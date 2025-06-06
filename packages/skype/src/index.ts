import { Servy } from "shared"
import { setupRouter } from "@/router"
import { loadConfigFromEnv } from "./config/config"

async function main() {
  const config = loadConfigFromEnv()
  const router = await setupRouter(config)

  console.log(`loaded config: ${JSON.stringify(config, null, "  ")}`)

  const server = new Servy(router)
  server.listen(config.service.port)
}

main()
