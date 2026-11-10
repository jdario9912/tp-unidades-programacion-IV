import { create } from "zustand";

export type NotificationType = "success" | "error";

type NotificationState = {
  message: string;
  type: NotificationType;
  visible: boolean;
  showNotification: (message: string, type?: NotificationType) => void;
  hideNotification: () => void;
};

export const useNotificationStore = create<NotificationState>()((set) => ({
  message: "",
  type: "success",
  visible: false,
  showNotification: (message, type = "success") =>
    set({ message, type, visible: true }),
  hideNotification: () => set({ visible: false }),
}));
