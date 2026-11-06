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

const extractApiErrorMessage = (
  error: AxiosError<ErrorResponseDetail>,
): string => {
  const detail = error.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((d: { msg: string }) => d.msg).join(", ");
  return "Error inesperado";
};

export const handleApiError = (error: unknown): void => {
  if (!axios.isAxiosError(error)) {
    console.error("[api] Error no-HTTP:", error);
    return;
  }

  const status = error.response?.status;
  const message = extractApiErrorMessage(error);

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

export let onUnauthorized: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: () => void): void => {
  onUnauthorized = handler;
};
