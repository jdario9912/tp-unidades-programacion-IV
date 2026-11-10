import { ApiError } from "@/shared/api/handle-errors";
import { useNotificationStore } from "@/store/notificationStore";

// se usan desde los callbacks de las mutaciones, fuera del render
export const notificarExito = (mensaje: string) =>
  useNotificationStore.getState().showNotification(mensaje);

export const notificarError = (error: Error) => {
  // el interceptor ya avisa «acceso denegado» ante un 403
  if (error instanceof ApiError && error.status === 403) return;
  useNotificationStore.getState().showNotification(error.message, "error");
};
