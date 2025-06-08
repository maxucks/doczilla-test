import { AuthService, FileService } from "./services"
import type { ChartService } from "./services/chart"
import type { WeatherService } from "./services/weather"

export type AppDependencies = {
  auth: AuthService
  files: FileService
  weather: WeatherService
  chart: ChartService
}

export type AppState = {
  token: string
}
