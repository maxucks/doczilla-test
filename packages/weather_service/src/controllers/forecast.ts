import { CacheManager } from "@/managers"
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

class CacheKeys {
  public static geo = (city: string): string => `geo:${city}`
  public static forecast = (lat: number, lon: number): string => `forecast:${lat}-${lon}`
}

export class ForecastController {
  constructor(private cacheExp: number, private cache: CacheManager) {}

  public getGeoData = async (req: GetGeoDataRequest, res: Response) => {
    const { city } = req.query
    if (!city || city === "") {
      return res.status(400).json({ message: "'city' must not be empty" })
    }

    const cacheKey = CacheKeys.geo(city)

    try {
      const cached = await this.cache.get(cacheKey)
      if (cached) {
        const data = JSON.parse(cached)
        return res.json({ data, from: "cache" })
      }

      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${req.query.city}`)
      const data = await response.json()
      const geo = geoDataFromJson(data.results)
      await this.cache.set(cacheKey, JSON.stringify(geo), { expiration: this.cacheExp })
      res.json({ data: geo, from: "source" })
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

    const cacheKey = CacheKeys.forecast(lat, lon)

    try {
      const cached = await this.cache.get(cacheKey)
      if (cached) {
        const data = JSON.parse(cached)
        return res.json({ data, from: "cache" })
      }

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&forecast_days=1`
      )
      const data = await response.json()
      const forecast = forecastFromJson(data)
      await this.cache.set(cacheKey, JSON.stringify(forecast), { expiration: this.cacheExp })
      res.json({ data: forecast, from: "source" })
    } catch (err) {
      res.status(500).json({ message: err })
    }
  }
}
