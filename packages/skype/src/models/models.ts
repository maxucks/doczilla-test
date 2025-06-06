export type GeoData = {
  id: number
  country: string
  name: string
  latitude: number
  longitude: number
}

export type ForecastData = {
  latitude: number
  longitude: number
  hourly: {
    time: string[]
    temperature: number[]
  }
}
