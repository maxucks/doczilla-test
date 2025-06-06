import { Config } from "@/config/config"
import { FilesController } from "@/controllers"
import { FilesManager } from "@/managers"
import { Router } from "shared"

export async function setupRouter(config: Config): Promise<Router> {
  const managers = {
    files: new FilesManager({
      storageName: config.files.name,
      deleteAfter: config.files.deleteAfter,
      deleterFrequency: config.files.deleterFrequency,
    }),
  }

  const ctrl = {
    files: new FilesController(managers.files),
  }

  const router = new Router()

  router.get("/files", ctrl.files.getFiles)
  router.post("/files", ctrl.files.upload)
  router.get("/download", ctrl.files.download)

  return router
}
