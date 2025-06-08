import { TokenManager } from "@/managers"
import { Request, Response } from "shared"

export class AuthController {
  constructor(private token: TokenManager) {}

  public getDevToken = async (_: Request, res: Response) => {
    try {
      const accessToken = this.token.new()
      res.json({ token: accessToken })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: err })
    }
  }
}
