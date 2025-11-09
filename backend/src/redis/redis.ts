import Redis from "ioredis";

import { REDIS_URL } from "./../config";

const redis = new Redis(REDIS_URL || "redis://localhost:6379");

export default redis;
