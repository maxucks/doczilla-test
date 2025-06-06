import { GeoData, ForecastData } from "./models"

export function geoDataFromJson(json: any): GeoData[] {
  return json.map((e: any) => ({
    id: e.id,
    name: e.name,
    country: e.country,
    latitude: e.latitude,
    longitude: e.longitude,
  }))
}

export function forecastFromJson(json: any): ForecastData {
  return {
    latitude: json.latitude,
    longitude: json.longitude,
    hourly: {
      time: json.hourly.time,
      temperature: json.hourly.temperature,
    },
  }
}
