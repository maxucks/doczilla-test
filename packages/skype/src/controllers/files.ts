import { FilesManager, TokenManager } from "@/managers"
import { Request, Response } from "shared"

type DownloadFileQuery = {
  filename: string
  token: string
}

type DownloadFileRequest = Request<DownloadFileQuery>

export class FilesController {
  constructor(private files: FilesManager, private token: TokenManager) {}

  public getFiles = async (_: Request, res: Response) => {
    try {
      res.json({ files: this.files.state.files })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: err })
    }
  }

  public upload = async (req: Request, res: Response) => {
    try {
      const filenameHeader = req.raw.headers["file-name"]
      if (!filenameHeader) {
        return res.status(400).json({ message: "Missing File-Name header" })
      }

      const filename = filenameHeader as string

      await new Promise((resolve, reject) => {
        const fileStream = this.files.writeFileStream(filename)
        req.raw.pipe(fileStream)
        req.raw.on("end", resolve)
        req.raw.on("error", reject)
      })

      res.status(201).json({ link: `/files?filename=${filename}` })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: err })
    }
  }

  public download = async (req: DownloadFileRequest, res: Response) => {
    const { filename, token } = req.query

    if (!token || token === "") {
      return res.status(400).json({ message: "'token' is required" })
    }

    try {
      this.token.verify(token)
    } catch (_) {
      return res.status(401).json({ message: "unauthorized: invalid token" })
    }

    if (!filename || filename === "") {
      return res.status(400).json({ message: "'filename' is required" })
    }
    const ext = filename.split(".")[1]!

    try {
      if (!this.files.exists(filename)) {
        return res.status(404).json({ message: "file not found" })
      }

      res.response.writeHead(200, {
        "Content-Type": `application/${ext}`,
        "Content-Disposition": `attachment; filename="${filename}"`,
      })
      this.files.readFileStream(filename).pipe(res.response)
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: err })
    }
  }
}
