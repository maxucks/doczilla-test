import "./styles/reset.css"
import "./styles/typeface.css"
import "./styles/lib.css"
import "./styles/styles.css"
import "./styles/file_uploader.css"

import type { AppDependencies, AppState } from "./types"
import { AuthService, FileService } from "./services"
import { FilesTableComponent } from "./components/files_table"
import { WeatherService } from "./services/weather"
import { ChartService } from "./services/chart"
import { InputSuggest } from "./components/suggest"
import type { CityInfo } from "./models/models"
import { FileUploader } from "./components/file_uploader"
import { sanitizeFile } from "./utils/date"

const deps: AppDependencies = {
  auth: new AuthService(),
  files: new FileService(),
  weather: new WeatherService(),
  chart: new ChartService(".weather__chart", ".weather__text"),
}

let state: AppState = {
  token: "",
}

async function init() {
  state.token = await deps.auth.getDevToken()

  const table = new FilesTableComponent(".table", deps.files)
  await table.build(state.token)

  const suggest = new InputSuggest(".autocomplete__input", ".autocomplete__suggestions")
  let suggestions: CityInfo[] = []

  suggest.onInputChange = async (value: string) => {
    if (value.length < 3) return

    suggestions = await deps.weather.geocode(value)
    const readableSuggestions = suggestions.map((s) => `${s.name}, ${s.country}`)
    suggest.updateSuggestions(readableSuggestions)
  }

  suggest.onSelect = async (_: string, index: number) => {
    console.log()
    const cityInfo = suggestions[index]
    const forecast = await deps.weather.getWeather(cityInfo.latitude, cityInfo.longitude)
    deps.chart.renderWeatherChart(forecast, cityInfo)
  }

  const uploader = new FileUploader("file-input", "file-list")
  uploader.onLoaded = async (file: File) => {
    const sanitizedFile = sanitizeFile(file)
    console.log(sanitizedFile.name)
    try {
      await deps.files.upload(sanitizedFile, state.token)
      table.build(state.token)
    } catch (err) {
      console.error(err)
    }
  }
}

init()
