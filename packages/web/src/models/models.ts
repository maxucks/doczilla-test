export type FileInfo = {
  name: string
  reads: number
  createdAt: Date
}

export type CityInfo = {
  id: number
  name: string
  country: string
  latitude: number
  longitude: number
}

export type DayForecast = {
  time: string[]
  temperature: number[]
}
