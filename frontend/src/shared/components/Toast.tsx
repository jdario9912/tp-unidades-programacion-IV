import { useEffect } from "react";
import { useNotificationStore } from "@/store/notificationStore";
import { cn } from "@/shared/utils/cn";

const DURACION_MS = 3000;

const Toast = () => {
  const { message, type, visible, hideNotification } = useNotificationStore();

  useEffect(() => {
    if (!visible) return;
    const timeout = setTimeout(hideNotification, DURACION_MS);

    // un mensaje nuevo reinicia el contador
    return () => clearTimeout(timeout);
  }, [visible, message, hideNotification]);

  if (!visible) return null;

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={cn(
        "fixed bottom-4 right-4 z-50 max-w-sm rounded px-4 py-3 text-sm text-white shadow-lg",
        type === "error" ? "bg-destructive" : "bg-success",
      )}
    >
      {message}
    </div>
  );
};

export default Toast;
