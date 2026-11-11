import { fueManejadoGlobalmente } from "@/shared/api/handleApiError";
import { useNotificationStore } from "@/store/notificationStore";

// se usan desde los callbacks de las mutaciones, fuera del render
export const notificarExito = (mensaje: string) =>
  useNotificationStore.getState().showNotification(mensaje);

export const notificarError = (error: Error) => {
  // la sesión inválida y el 403 ya los resolvió handleApiError
  if (fueManejadoGlobalmente(error)) return;
  useNotificationStore.getState().showNotification(error.message, "error");
};
