import http from "http"

type RouteMap = {
  [path: string]: {
    [method: string]: {
      handler: HandlerFn
      guard: MiddlewareFn | null
    }
  }
}

export type HandlerFn<Req = Request, Res = Response> = (req: Req, res: Res) => void
export type MiddlewareFn<Req = Request, Res = Response> = (req: Req, res: Res) => boolean

export type Request<Q = any> = {
  raw: http.IncomingMessage
  query: Q
}

export class Response {
  constructor(public response: http.ServerResponse) {}

  public status = (code: number): Response => {
    this.response.statusCode = code
    return this
  }

  public json = (data: any) => {
    this.response.setHeader("Content-Type", "application/json")
    this.response.end(JSON.stringify(data))
  }
}

export class Router {
  private routes: RouteMap = {}
  private middlewares: MiddlewareFn[] = []

  public get = (path: string, handler: HandlerFn, opts?: { guard: MiddlewareFn | null }) => {
    if (!this.routes[path]) {
      this.routes[path] = {}
    }
    this.routes[path].GET = { handler, guard: opts ? opts.guard : null }
  }

  public post = (path: string, handler: HandlerFn, opts?: { guard: MiddlewareFn | null }) => {
    if (!this.routes[path]) {
      this.routes[path] = {}
    }
    this.routes[path].POST = { handler, guard: opts ? opts.guard : null }
  }

  public use = (mw: MiddlewareFn) => this.middlewares.push(mw)

  public handler = (req: http.IncomingMessage, res: http.ServerResponse) => {
    if (!req.url || !req.method) return

    const parts = req.url.split("?")
    const url = parts[0]!
    const query: any = {}

    if (parts[1]) {
      const pairs = parts[1].split("&")
      for (const pair of pairs) {
        const keyValue = pair.split("=")
        if (keyValue.length !== 2) continue

        const [key, value] = keyValue
        query[key!] = value!
      }
    }

    const response = new Response(res)
    const request: Request = { raw: req, query }

    const handlers = this.routes[url]
    if (!handlers) {
      return response.status(404).json({
        message: `${req.url}: unregistered path`,
      })
    }

    if (!handlers[req.method]) {
      return response.status(404).json({
        message: `${req.method} ${req.url}: unregistered method`,
      })
    }

    let next = true

    for (const mw of this.middlewares) {
      next = mw(request, response)
      if (!next) break
    }

    const { handler, guard } = handlers[req.method]!

    if (next && guard) {
      next = guard(request, response)
    }
    if (next) handler(request, response)
  }
}
