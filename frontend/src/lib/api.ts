import axios from "axios";
import { BACKEND_URL } from "@/config";

export const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
});

api.defaults.headers.common["Content-Type"] = "application/json";
