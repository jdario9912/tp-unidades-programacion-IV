import axios from "axios";
import { paths } from "./constantes";

const API_URL = paths.apiUrl;

// los interceptores se registran en setupInterceptors.ts
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 15_000,
  headers: { Accept: "application/json" },
});

export default api;
