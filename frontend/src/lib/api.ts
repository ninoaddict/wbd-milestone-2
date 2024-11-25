import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

api.defaults.headers.common["Content-Type"] = "application/json";
