export type Config = {
  service: {
    port: number
  }
  redis: {
    url: string
    expiration: number
  }
}

export function loadConfigFromEnv(): Config {
  return {
    service: {
      port: process.env.SERVICE_PORT ? Number(process.env.SERVICE_PORT) : 8000,
    },
    redis: {
      url: process.env.REDIS_URL ? process.env.REDIS_URL : "redis://localhost:6379",
      expiration: process.env.CACHE_EXPIRATION ? Number(process.env.CACHE_EXPIRATION) : 900, // 15 min by default = 900 seconds
    },
  }
}
