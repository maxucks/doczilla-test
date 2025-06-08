import type { CityInfo, DayForecast } from "../models/models"

type GeocodeResponse = {
  data: CityInfo[]
  from: string
}

type GetWeatherResponse = {
  data: {
    latitude: number
    longitude: number
    hourly: DayForecast
  }
  from: string
}

export class WeatherService {
  static api = "http://localhost:8081"

  geocode = async (city: string): Promise<CityInfo[]> => {
    try {
      const response = await fetch(`${WeatherService.api}/geocode?city=${city}`)
      const json = (await response.json()) as GeocodeResponse
      return json.data
    } catch (err) {
      console.error(err)
      return []
    }
  }

  getWeather = async (latitude: number, longitude: number): Promise<DayForecast> => {
    const response = await fetch(`${WeatherService.api}/weather?latitude=${latitude}&longitude=${longitude}`)
    const json = (await response.json()) as GetWeatherResponse

    const time = json.data.hourly.time.map((t) => t.split("T")[1])

    return {
      time: time,
      temperature: json.data.hourly.temperature,
    }
  }
}
