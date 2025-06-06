export type Config = {
  service: {
    port: number
  }
  storage: {
    name: string
  }
  auth: {
    accessTokenTTL: number
  }
}

export function loadConfigFromEnv(): Config {
  return {
    service: {
      port: process.env.SERVICE_PORT ? Number(process.env.SERVICE_PORT) : 8000,
    },
    storage: {
      name: process.env.STORAGE_FOLDER_NAME ? process.env.STORAGE_FOLDER_NAME : "storage",
    },
    auth: {
      accessTokenTTL: process.env.ACCESS_TOKEN_TTL ? Number(process.env.ACCESS_TOKEN_TTL) : 900000, // 15 min
    },
  }
}
