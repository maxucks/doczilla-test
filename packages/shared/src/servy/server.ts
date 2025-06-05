import http from "http"
import { Router } from "./router"

export class Servy {
  private server: http.Server

  constructor(router: Router) {
    this.server = http.createServer(router.handler)
  }

  public listen = (port: number) => {
    this.server.listen(port, () => {
      console.log(`App is running on http://localhost:${port}`)
    })
  }
}
