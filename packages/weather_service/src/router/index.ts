import { ForecastController } from "@/controllers"
import { Router } from "shared"

const router = new Router()

const ctrl = {
  forecast: new ForecastController(),
}

router.get("/weather", ctrl.forecast.getCityWeather)

export { router }
