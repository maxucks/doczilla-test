import { Config } from "@/config/config"
import { FilesController } from "@/controllers"
import { AuthController } from "@/controllers/auth"
import { AuthGuard } from "@/guards"
import { FilesManager, TokenManager } from "@/managers"
import { Request, Response, Router } from "shared"

export async function setupRouter(config: Config): Promise<Router> {
  const managers = {
    token: new TokenManager(config.auth.secret, config.auth.accessTokenTTL),
    files: new FilesManager({
      storageName: config.files.name,
      deleteAfter: config.files.deleteAfter,
      deleterFrequency: config.files.deleterFrequency,
    }),
  }

  const guards = {
    auth: new AuthGuard(managers.token),
  }

  const ctrl = {
    files: new FilesController(managers.files, managers.token),
    auth: new AuthController(managers.token),
  }

  const router = new Router()

  router.use((_: Request, res: Response): boolean => {
    res.response.setHeader("Access-Control-Allow-Origin", "*")
    res.response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    res.response.setHeader("Access-Control-Allow-Headers", "*")
    res.response.setHeader("Access-Control-Max-Age", "86400")
    return true
  })

  router.get("/dev/token", ctrl.auth.getDevToken)

  router.get("/files", ctrl.files.getFiles)
  router.post("/files", ctrl.files.upload, { guard: guards.auth.verify })
  router.get("/download", ctrl.files.download)

  return router
}
