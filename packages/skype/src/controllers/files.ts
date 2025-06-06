import { FilesManager } from "@/managers"
import { Request, Response } from "shared"

type DownloadFileQuery = {
  filename: string
}

type DownloadFileRequest = Request<DownloadFileQuery>

export class FilesController {
  constructor(private files: FilesManager) {}

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
      const contentDisposition = req.raw.headers["content-disposition"]
      if (!contentDisposition) {
        return res.status(400).json({ message: "Missing Content-Disposition header" })
      }

      const match = contentDisposition.match(/filename="(.+)"/)
      if (!match || !match[1]) {
        return res.status(400).json({ message: "Invalid filename" })
      }
      const filename = match[1]

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
    const { filename } = req.query
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
