import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { handleApiError } from "./handle-errors";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

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
    return Promise.reject(error);
  },
);

export const get = async <T>(ruta: string): Promise<T> => {
  const { data } = await api.get<T>(ruta);
  return data;
};

export const post = async <T, U>(ruta: string, body: T): Promise<U> => {
  const { data } = await api.post<U, AxiosResponse<U>, T>(ruta, body);
  return data;
};

export const put = async <T, U>(ruta: string, body: T): Promise<U> => {
  const { data } = await api.put<U, AxiosResponse<U>, T>(ruta, body);
  return data;
};

export const remove = async (ruta: string): Promise<void> => {
  const { data } = await api.delete(ruta);
  return data;
};

export const patch = async <T, U>(ruta: string, body: T): Promise<U> => {
  const { data } = await api.patch<U, AxiosResponse<U>, T>(ruta, body);
  return data;
};
