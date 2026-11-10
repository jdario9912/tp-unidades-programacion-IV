import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/features/auth";
import api from "./api";
import { paths } from "./constantes";
import { handleApiError, toApiError } from "./handle-errors";
import { queryClient } from "./queryClient";

// un 401 en estas rutas es parte del flujo de login, no una sesión vencida
const RUTAS_SIN_LIMPIEZA = [`/${paths.auth}/token`, `/${paths.auth}/me`];

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

    const status = error.response?.status;
    const url = error.config?.url ?? "";

    // ante un 401 se limpia la sesión local; ProtectedRoute redirige al login
    if (status === 401 && !RUTAS_SIN_LIMPIEZA.some((r) => url.startsWith(r))) {
      useAuthStore.setState({ usuario: null });
      queryClient.clear();
    }

    // los consumidores reciben un ApiError con el mensaje ya extraído
    return Promise.reject(toApiError(error));
  },
);
