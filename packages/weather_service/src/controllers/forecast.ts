import { Request, Response } from "shared"

type GetCityWeatherQuery = {
  city: string
}

type GetCityWeatherRequest = Request<GetCityWeatherQuery>

export class ForecastController {
  public getCityWeather = (req: GetCityWeatherRequest, res: Response) => {
    res.json({ yay: `Get weather!! ${req.query.city}` })
  }
}
