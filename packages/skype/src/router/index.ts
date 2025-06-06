import { Config } from "@/config/config"
import { FilesController } from "@/controllers"
import { FilesManager } from "@/managers"
import { Router } from "shared"

export async function setupRouter(config: Config): Promise<Router> {
  const managers = {
    files: new FilesManager(config.storage.name),
  }

  const ctrl = {
    files: new FilesController(managers.files),
  }

  const router = new Router()

  router.post("/files", ctrl.files.upload)
  router.get("/download", ctrl.files.download)

  return router
}
