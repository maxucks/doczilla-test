type FileStatus = "ready" | "uploading" | "done"

interface FileEntry {
  file: File
  status: FileStatus
  element: HTMLLIElement
}

type OnLoadedCallback = (file: File) => Promise<void> | void

export class FileUploader {
  private fileInput: HTMLInputElement
  private fileList: HTMLUListElement
  public onLoaded: OnLoadedCallback | null = null

  constructor(inputId: string, listId: string) {
    this.fileInput = document.getElementById(inputId) as HTMLInputElement
    this.fileList = document.getElementById(listId) as HTMLUListElement

    this.init()
  }

  private init() {
    this.fileInput.addEventListener("change", () => this.handleFiles())
  }

  private handleFiles() {
    if (!this.fileInput.files || this.fileInput.files.length === 0) return

    const file = this.fileInput.files[0]

    this.fileList.innerHTML = ""

    const entry: FileEntry = {
      file,
      status: "ready",
      element: this.createFileItem(file.name, "ready"),
    }

    this.fileList.appendChild(entry.element)
    this.simulateUpload(entry)

    this.fileInput.value = ""
  }

  private createFileItem(name: string, status: FileStatus): HTMLLIElement {
    const li = document.createElement("li")
    const nameSpan = document.createElement("span")
    const statusSpan = document.createElement("span")

    nameSpan.textContent = name
    statusSpan.textContent = status
    statusSpan.className = `status ${status}`

    li.appendChild(nameSpan)
    li.appendChild(statusSpan)

    return li
  }

  private updateStatus(entry: FileEntry, status: FileStatus) {
    entry.status = status
    const statusSpan = entry.element.querySelector(".status") as HTMLSpanElement
    statusSpan.textContent = status
    statusSpan.className = `status ${status}`
  }

  private async simulateUpload(entry: FileEntry) {
    this.updateStatus(entry, "uploading")
    await new Promise((res) => setTimeout(res, 1000))
    this.updateStatus(entry, "done")
    await this.onLoaded?.(entry.file)
  }
}
