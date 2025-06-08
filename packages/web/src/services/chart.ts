import { Chart, LineController, LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale } from "chart.js"
import type { CityInfo, DayForecast } from "../models/models"

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale)

export class ChartService {
  chartElement: HTMLCanvasElement
  textElement: HTMLElement
  chart: Chart | null = null

  constructor(canvaseSelector: string, textSelector: string) {
    this.chartElement = document.querySelector(canvaseSelector) as HTMLCanvasElement
    this.textElement = document.querySelector(textSelector) as HTMLElement
  }

  renderWeatherChart = (forecast: DayForecast, city: CityInfo): void => {
    this.chart?.destroy()
    const text = `Weather in ${city.name} today`
    this.textElement.innerText = text
    this.chart = new Chart(this.chartElement, {
      type: "line",
      data: {
        datasets: [
          {
            data: forecast.temperature,
            label: text,
          },
        ],
        labels: forecast.time,
      },
    })
  }
}
