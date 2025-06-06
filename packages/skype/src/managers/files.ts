import fs from "fs"
import path from "path"

type LockFile = {
  files: {
    [name: string]: {
      createdAt: Date
    }
  }
}

export class FilesManager {
  private lockfilePath: string
  private uploadsPath: string
  private lock: LockFile = { files: {} }

  constructor(storageName: string = "storage") {
    const storagePath = path.join(process.cwd(), storageName)
    this.lockfilePath = path.join(storagePath, "lock.json")
    this.uploadsPath = path.join(storagePath, "uploads")

    if (!fs.existsSync(storagePath)) fs.mkdirSync(storagePath)
    if (!fs.existsSync(this.uploadsPath)) fs.mkdirSync(this.uploadsPath)

    if (fs.existsSync(this.lockfilePath)) {
      const json = fs.readFileSync(this.lockfilePath, "utf-8")
      this.lock = JSON.parse(json)
    }
  }

  private lockFile = (filename: string): void => {
    this.lock.files[filename] = {
      createdAt: new Date(Date.now()),
    }
    const json = JSON.stringify(this.lock, null, 2)
    fs.writeFileSync(this.lockfilePath, json, "utf8")
  }

  public exists = (filename: string): boolean => this.lock.files[filename] !== undefined

  public writeFileStream = (filename: string): fs.WriteStream => {
    const filepath = path.join(this.uploadsPath, filename)
    this.lockFile(filename)
    return fs.createWriteStream(filepath)
  }

  public readFileStream = (filename: string): fs.ReadStream => {
    const filepath = path.join(this.uploadsPath, filename)
    return fs.createReadStream(filepath)
  }
}
