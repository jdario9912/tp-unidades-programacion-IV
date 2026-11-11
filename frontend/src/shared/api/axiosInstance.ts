import axios, { AxiosError } from "axios";
import { paths } from "./constantes";
import {
  ApiError,
  SIN_CONEXION,
  TIEMPO_AGOTADO,
  handleApiError,
  mensajeDeError,
} from "./handleApiError";

// Único archivo que conoce Axios: para cambiar de librería se reescribe este
// adaptador y los cuerpos de client.ts.

// cliente HTTP único: la cookie HttpOnly viaja sola con withCredentials
const axiosInstance = axios.create({
  baseURL: paths.apiUrl,
  withCredentials: true,
  timeout: 15_000,
  headers: { Accept: "application/json" },
});

const aApiError = (error: AxiosError): ApiError => {
  const status = error.response?.status;
  const detail = (error.response?.data as { detail?: unknown } | undefined)
    ?.detail;
  const message =
    error.code === AxiosError.ECONNABORTED
      ? TIEMPO_AGOTADO
      : !error.response
        ? SIN_CONEXION
        : mensajeDeError(detail);

  return new ApiError(message, { status, detail, url: error.config?.url }, error);
};

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError = aApiError(error);
    handleApiError(apiError);

    // los consumidores reciben un ApiError con el mensaje ya extraído
    return Promise.reject(apiError);
  },
);

export default axiosInstance;
