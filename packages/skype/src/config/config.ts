export type Config = {
  service: {
    port: number
  }
  files: {
    name: string
    deleteAfter: number
    deleterFrequency: number
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
    files: {
      name: process.env.STORAGE_FOLDER_NAME ? process.env.STORAGE_FOLDER_NAME : "storage",
      deleteAfter: process.env.DELETE_FILES_AFTER ? Number(process.env.DELETE_FILES_AFTER) : 2592000000, // 30 days by default
      deleterFrequency: process.env.DELETER_FREQUENCY ? Number(process.env.DELETER_FREQUENCY) : 300000, // 5 min by default
    },
    auth: {
      accessTokenTTL: process.env.ACCESS_TOKEN_TTL ? Number(process.env.ACCESS_TOKEN_TTL) : 900000, // 15 min by default
    },
  }
}
