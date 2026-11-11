import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { paths } from "./constantes";
import { queryClient } from "./queryClient";

// Punto central de los errores HTTP. No conoce la librería: el adaptador
// (axiosInstance.ts) convierte su error a ApiError y llama a handleApiError.

// Cambiar estas interfaces si cambia la api en el futuro
interface ValidationErrorItem {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export const SIN_CONEXION = "No se pudo conectar con el servidor";
export const TIEMPO_AGOTADO = "La solicitud tardó demasiado";

const CUENTA_DESACTIVADA = "Cuenta de usuario desactivada";

// un 401 en estas rutas es parte del flujo de login, no una sesión vencida
const RUTAS_SIN_LIMPIEZA = [`/${paths.auth}/token`, `/${paths.auth}/me`];

// error normalizado que reciben los hooks y componentes: el message ya es
// el texto para mostrar al usuario
export class ApiError extends Error {
  status?: number;
  detail?: unknown;
  url?: string;

  constructor(
    message: string,
    { status, detail, url }: { status?: number; detail?: unknown; url?: string } = {},
    cause?: unknown,
  ) {
    super(message, { cause });
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
    this.url = url;
  }
}

const esErrorDeValidacion = (detail: unknown): detail is ValidationErrorItem[] =>
  Array.isArray(detail);

// convierte el detail de FastAPI en un mensaje para la pantalla
export const mensajeDeError = (detail: unknown): string => {
  if (typeof detail === "string") return detail;
  if (esErrorDeValidacion(detail)) return detail.map((d) => d.msg).join(", ");
  return "Error inesperado";
};

const esCuentaDesactivada = (error: ApiError) =>
  error.status === 400 && error.detail === CUENTA_DESACTIVADA;

const esSesionInvalida = (error: ApiError) => {
  const url = error.url ?? "";

  if (error.status === 401)
    return !RUTAS_SIN_LIMPIEZA.some((r) => url.startsWith(r));
  // el admin desactivó la cuenta mientras la sesión estaba abierta
  return esCuentaDesactivada(error);
};

// los consumidores no vuelven a avisar lo que ya resolvió handleApiError
export const fueManejadoGlobalmente = (error: unknown): boolean =>
  error instanceof ApiError &&
  (error.status === 401 || error.status === 403 || esCuentaDesactivada(error));

// efectos globales de cualquier error HTTP, antes de que llegue a los hooks
export const handleApiError = (error: ApiError): void => {
  if (import.meta.env.DEV)
    console.warn("[api]", error.status ?? "sin respuesta", error.url, error.message);

  // se limpia la sesión local; ProtectedRoute redirige al login
  if (esSesionInvalida(error)) {
    useAuthStore.getState().clearSession();
    queryClient.clear();
  }

  // un 403 no cierra la sesión: solo se avisa
  if (error.status === 403)
    useNotificationStore.getState().showNotification("Acceso denegado", "error");
};
