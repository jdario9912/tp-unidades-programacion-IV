import axios, { AxiosError } from "axios";

// Cambiar estas interfaces si cambia la api en el futuro
interface ValidationErrorItem {
  loc: (string | number)[];
  msg: string;
  type: string;
}

interface FastAPIErrorBody {
  detail?: string | ValidationErrorItem[];
}

type ErrorResponseDetail = FastAPIErrorBody;

// error normalizado que reciben los hooks y componentes: el message ya es
// el texto para mostrar al usuario
export class ApiError extends Error {
  status?: number;
  detail?: unknown;

  constructor(
    message: string,
    status?: number,
    detail?: unknown,
    cause?: unknown,
  ) {
    super(message, { cause });
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

const getDetail = (error: AxiosError) =>
  (error.response?.data as ErrorResponseDetail | undefined)?.detail;

const extractApiErrorMessage = (error: AxiosError): string => {
  if (error.code === AxiosError.ECONNABORTED)
    return "La solicitud tardó demasiado";
  if (!error.response) return "No se pudo conectar con el servidor";

  const detail = getDetail(error);
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((d: { msg: string }) => d.msg).join(", ");
  return "Error inesperado";
};

export const toApiError = (error: AxiosError): ApiError =>
  new ApiError(
    extractApiErrorMessage(error),
    error.response?.status,
    getDetail(error),
    error,
  );

export const handleApiError = (error: unknown): void => {
  if (!axios.isAxiosError(error)) {
    console.error("[api] Error no-HTTP:", error);
    return;
  }

  const status = error.response?.status;
  const message = extractApiErrorMessage(error);

  if (!error.response) {
    console.error("[api] Sin respuesta del servidor: ", message);
    return;
  }

  switch (status) {
    case 400:
    case 422:
      console.warn("[api] Datos inválidos: ", message);
      break;
    case 401:
      console.warn("[api] No autorizado: ", message);
      onUnauthorized?.();
      break;
    case 403:
      console.warn("[api] Permisos insuficientes: ", message);
      break;
    case 404:
      console.warn("[api] Recurso no encontrado: ", message);
      break;
    case 500:
      console.error("[api] Error interno del servidor: ", message);
      break;
    default:
      console.error("[api] Error inesperado: ", message);
  }
};

let onUnauthorized: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: () => void): void => {
  onUnauthorized = handler;
};
