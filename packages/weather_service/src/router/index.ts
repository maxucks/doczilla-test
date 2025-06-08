import { Config } from "@/config/config"
import { ForecastController } from "@/controllers"
import { CacheManager } from "@/managers"
import { Request, Response, Router } from "shared"

export async function setupRouter(config: Config): Promise<Router> {
  const managers = {
    cache: new CacheManager(config.redis.url),
  }

  await managers.cache.connect()

  const ctrl = {
    forecast: new ForecastController(config.redis.expiration, managers.cache),
  }

  const router = new Router()

  router.use((_: Request, res: Response): boolean => {
    res.response.setHeader("Access-Control-Allow-Origin", "*")
    res.response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    res.response.setHeader("Access-Control-Allow-Headers", "*")
    res.response.setHeader("Access-Control-Max-Age", "86400")
    return true
  })

  router.get("/geocode", ctrl.forecast.getGeoData)
  router.get("/weather", ctrl.forecast.getCityWeather)

  return router
}
