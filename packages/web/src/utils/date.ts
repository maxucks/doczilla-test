export function formatDate(date: Date) {
  const dd = String(date.getDate()).padStart(2, "0")
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const yyyy = date.getFullYear()
  const hh = String(date.getHours()).padStart(2, "0")
  const min = String(date.getMinutes()).padStart(2, "0")

  return `${dd}.${mm}.${yyyy}, ${hh}:${min}`
}

export function sanitizeFilename(filename: string): string {
  filename = filename.normalize("NFKD")
  filename = filename.replace(/[\u00A0\u2000-\u200B\u202F\u205F\u3000]/g, " ")
  filename = filename.replace(/[\/\\:*?"<>|\x00-\x1F]/g, "_")
  filename = filename.replace(/\s+/g, "_")
  return filename.replace(/[. ]+$/, "")
}

export function sanitizeFile(file: File): File {
  return new File([file], sanitizeFilename(file.name), {
    type: file.type,
    lastModified: file.lastModified,
  })
}
