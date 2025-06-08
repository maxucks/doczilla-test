import jwt from "jsonwebtoken"

export class TokenManager {
  constructor(private secret: string, private accessTokenTtl: number) {}

  public new = (payload: any = {}) => {
    const token = jwt.sign(payload, this.secret, { expiresIn: this.accessTokenTtl })
    return token
  }

  public verify = (token: string): any => {
    return jwt.verify(token, this.secret)
  }
}
