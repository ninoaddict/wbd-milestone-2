import Redis from "ioredis";

import { REDIS_HOST, REDIS_PORT } from "./../config";

const redis = new Redis({
  host: REDIS_HOST || "localhost",
  port: Number(REDIS_PORT) || 6379,
});

export default redis;
