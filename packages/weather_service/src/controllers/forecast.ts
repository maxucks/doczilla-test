import { forecastFromJson, geoDataFromJson } from "@/models"
import { Request, Response } from "shared"

type GetGeoDataQuery = {
  city: string
}

type GetGeoDataRequest = Request<GetGeoDataQuery>

type GetCityWeatherQuery = {
  longitude: string
  latitude: string
}

type GetCityWeatherRequest = Request<GetCityWeatherQuery>

export class ForecastController {
  public getGeoData = async (req: GetGeoDataRequest, res: Response) => {
    const { city } = req.query
    if (!city || city === "") {
      return res.status(400).json({ message: "'city' must not be empty" })
    }

    try {
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${req.query.city}`)
      const data = await response.json()
      const geo = geoDataFromJson(data.results)
      res.json({ data: geo })
    } catch (err) {
      res.status(500).json({ message: err })
    }
  }

  public getCityWeather = async (req: GetCityWeatherRequest, res: Response) => {
    if (!req.query.latitude || req.query.latitude === "" || !req.query.longitude || req.query.longitude === "") {
      return res.status(400).json({ message: "'latitude' and 'longitude' are required" })
    }

    const lat = Number(req.query.latitude)
    const lon = Number(req.query.longitude)

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&forecast_days=1`
      )
      const data = await response.json()
      const forecast = forecastFromJson(data)
      res.json({ data: forecast })
    } catch (err) {
      res.status(500).json({ message: err })
    }
  }
}
