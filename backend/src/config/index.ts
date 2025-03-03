import { config } from "dotenv";

config({ path: `.env` });

export const {
  PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_HOST,
  REDIS_URL,
  SECRET_KEY,
  ORIGIN,
  PUBLIC_VAPID_KEY,
  PRIVATE_VAPID_KEY,
  REDIS_HOST,
  REDIS_PORT,
} = process.env;

export const CREDENTIALS = process.env.CREDENTIALS === "true";
