import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { handleApiError, toApiError } from "./handle-errors";
import { paths } from "./constantes";

const API_URL = paths.apiUrl;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 15_000,
  headers: { Accept: "application/json" },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers.set("Accept", "application/json");
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    handleApiError(error);
    // los consumidores reciben un ApiError con el mensaje ya extraído
    return Promise.reject(toApiError(error));
  },
);

export default api;
