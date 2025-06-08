import type { FileInfo } from "../models/models"

export type FilesResponse = {
  files: {
    [filename: string]: {
      reads: number
      createdAt: string
    }
  }
}

export class FileService {
  static api = "http://localhost:8080"

  getFiles = async (): Promise<FileInfo[]> => {
    const response = await fetch(`${FileService.api}/files`)
    const json: FilesResponse = await response.json()

    const files: FileInfo[] = []
    for (const [filename, info] of Object.entries(json.files)) {
      files.push({
        name: filename,
        createdAt: new Date(info.createdAt),
        reads: info.reads,
      })
    }

    return files
  }

  upload = async (file: File, token: string): Promise<void> => {
    const headers = {
      authorization: `Bearer ${token}`,
      "file-name": file.name,
    }

    const formData = new FormData()
    formData.append("file", file)

    try {
      await fetch(`${FileService.api}/files`, {
        method: "POST",
        headers,
        body: formData,
      })
    } catch (err) {
      console.error(err)
    }
  }

  getDownloadLink = (filename: string, token: string) =>
    `${FileService.api}/download?filename=${filename}&token=${token}`
}
