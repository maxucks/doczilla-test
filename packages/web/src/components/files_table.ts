import type { FileService } from "../services"
import { formatDate } from "../utils/date"

export class FilesTableComponent {
  table: HTMLDivElement
  service: FileService

  constructor(selector: string, service: FileService) {
    this.table = document.querySelector(selector) as HTMLDivElement
    this.service = service
  }

  createCell = <K extends keyof HTMLElementTagNameMap>(tag: K, value: string) => {
    const cell = document.createElement(tag)
    cell.classList = "flex ac table__item"
    cell.innerText = value.length > 12 ? `${value.substring(0, 12)}...` : value
    return cell
  }

  createHeaderRow = (): HTMLDivElement => {
    const row = document.createElement("div")
    row.classList = "flex table__row"
    row.append(
      this.createCell("div", "File"),
      this.createCell("div", "Downloads"),
      this.createCell("div", "Created at")
    )
    return row
  }

  createFileRow = (filename: string, downloads: number, createdAt: Date, token: string): HTMLDivElement => {
    const filenameCell = this.createCell("div", filename)
    const downloadsCell = this.createCell("div", String(downloads))
    const createdAtCell = this.createCell("div", formatDate(createdAt))
    const buttonCell = this.createCell("button", "Download")

    buttonCell.addEventListener("click", (_) => {
      const url = this.service.getDownloadLink(filename, token)
      window.open(url, "_blank")
      this.build(token)
    })

    const row = document.createElement("div")
    row.classList = "flex table__row"

    row.append(filenameCell, downloadsCell, createdAtCell, buttonCell)

    return row
  }

  build = async (token: string) => {
    const files = await this.service.getFiles()

    const rows = [this.createHeaderRow()]
    for (const file of files) {
      const row = this.createFileRow(file.name, file.reads, file.createdAt, token)
      rows.push(row)
    }
    this.table.replaceChildren(...rows)
  }
}
