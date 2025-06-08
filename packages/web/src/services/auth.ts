type TokenResponse = {
  token: string
}

export class AuthService {
  static api = "http://localhost:8080"

  getDevToken = async (): Promise<string> => {
    const response = await fetch(`${AuthService.api}/dev/token`)
    const json = (await response.json()) as TokenResponse
    return json.token
  }
}
