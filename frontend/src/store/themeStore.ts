import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeState = {
  darkMode: boolean;
  toggleTheme: () => void;
};

// la preferencia de tema es lo único que se guarda en localStorage
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      darkMode: false,
      toggleTheme: () => set((s) => ({ darkMode: !s.darkMode })),
    }),
    { name: "theme-storage" },
  ),
);
