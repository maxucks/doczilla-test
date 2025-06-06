import redis, { RedisClientType } from "redis"

type SetOptions = {
  // In seconds
  expiration: number
}

export class CacheManager {
  private client: RedisClientType

  constructor(url: string) {
    this.client = redis.createClient({ url })
  }

  public connect = async () => this.client.connect()

  public set = async (key: string, value: string, opts?: SetOptions): Promise<any> =>
    this.client.set(key, value, {
      expiration: opts && {
        type: "EX",
        value: opts.expiration,
      },
    })

  public get = async (key: string): Promise<string | null> => this.client.get(key)
}
