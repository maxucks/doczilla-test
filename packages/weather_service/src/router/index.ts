import { Config } from "@/config/config"
import { ForecastController } from "@/controllers"
import { CacheManager } from "@/managers"
import { Router } from "shared"

export async function setupRouter(config: Config): Promise<Router> {
  const managers = {
    cache: new CacheManager(config.redis.url),
  }

  await managers.cache.connect()

  const ctrl = {
    forecast: new ForecastController(config.redis.expiration, managers.cache),
  }

  const router = new Router()

  router.get("/geocode", ctrl.forecast.getGeoData)
  router.get("/weather", ctrl.forecast.getCityWeather)

  return router
}
