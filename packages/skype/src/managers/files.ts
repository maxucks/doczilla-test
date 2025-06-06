import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  ReadStream,
  writeFileSync,
  WriteStream,
} from "fs"
import { unlink } from "fs/promises"
import path from "path"

type State = {
  files: { [name: string]: FileInfo }
}

type FileInfo = {
  createdAt: Date
  reads: number
}

type Options = {
  storageName: string
  deleteAfter: number
  deleterFrequency: number
}

export class FilesManager {
  private lockfilePath: string
  private uploadsPath: string
  public state: State = { files: {} }

  constructor({ storageName, deleteAfter, deleterFrequency }: Options) {
    const storagePath = path.join(process.cwd(), storageName)
    this.lockfilePath = path.join(storagePath, "state.json")
    this.uploadsPath = path.join(storagePath, "uploads")

    if (!existsSync(storagePath)) mkdirSync(storagePath)
    if (!existsSync(this.uploadsPath)) mkdirSync(this.uploadsPath)

    if (existsSync(this.lockfilePath)) {
      const json = readFileSync(this.lockfilePath, "utf-8")
      const rawState = JSON.parse(json)

      // Load state from file
      for (const [filename, data] of Object.entries(rawState.files)) {
        const info = data as FileInfo
        this.state.files[filename] = {
          createdAt: new Date(info.createdAt),
          reads: info.reads,
        }
      }
    }

    this.runFileDeleterCron(deleterFrequency, deleteAfter)
  }

  // CRON job handling files deletion after certain deadline
  private runFileDeleterCron = (frequency: number, deleteAfter: number) =>
    setInterval(async () => {
      console.log("Clearing files")
      const now = new Date(Date.now())
      for (const [filename, data] of Object.entries(this.state.files)) {
        const diff = now.getTime() - data.createdAt.getTime()
        if (diff < deleteAfter) continue

        try {
          const filepath = path.join(this.uploadsPath, filename)
          await unlink(filepath)
          delete this.state.files[filename]
          this.saveState()
          console.log(`File ${filename} deleted after ${deleteAfter / 60000} minutes`)
        } catch (err) {
          console.error("Error deleting file:", err)
        }
      }
    }, frequency)

  private saveState = (): void => {
    const json = JSON.stringify(this.state, null, 2)
    writeFileSync(this.lockfilePath, json, "utf8")
  }

  public exists = (filename: string): boolean => {
    const filepath = path.join(this.uploadsPath, filename)
    return existsSync(filepath) && this.state.files[filename] !== undefined
  }

  public writeFileStream = (filename: string): WriteStream => {
    this.state.files[filename] = {
      createdAt: new Date(Date.now()),
      reads: 0,
    }
    this.saveState()

    const filepath = path.join(this.uploadsPath, filename)
    return createWriteStream(filepath)
  }

  public readFileStream = (filename: string): ReadStream => {
    if (!this.exists(filename)) throw Error("file not found")

    this.state.files[filename]!.reads += 1
    this.saveState()

    const filepath = path.join(this.uploadsPath, filename)
    return createReadStream(filepath)
  }
}
