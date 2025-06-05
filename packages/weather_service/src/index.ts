import { Servy } from "shared"
import { router } from "@/router"

const server = new Servy(router)
server.listen(8000)
