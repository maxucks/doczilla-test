import { Request, Response } from "shared"
import { TokenManager } from "@/managers"

export class AuthGuard {
  constructor(private tokenManager: TokenManager) {}

  public verify = (req: Request, res: Response): boolean => {
    const authHeader = req.raw.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized: No token provided" })
      return false
    }

    const slices = authHeader.split(" ")
    if (slices.length < 2) {
      res.status(401).json({ message: "Unauthorized: No token provided" })
      return false
    }

    const token = slices[1]!

    try {
      this.tokenManager.verify(token)
      return true
    } catch (err) {
      console.error(err)
      res.status(401).json({ message: err })
      return false
    }
  }
}
