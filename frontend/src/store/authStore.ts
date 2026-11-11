import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Usuario } from "@/features/auth/types/auth.types";
import { handleLogin, handleLogout, handleMe } from "@/features/auth/api/auth";

type AuthState = {
  usuario: Usuario | null;
  cargando: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  clearSession: () => void;
};

// el token vive en la cookie HttpOnly: el store solo guarda los datos del usuario
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      // arranca en true: la sesión no está confirmada hasta que corre checkSession
      cargando: true,

      login: async (username, password) => {
        await handleLogin(username, password);
        const usuario = await handleMe();
        set({ usuario });
      },

      logout: async () => {
        try {
          await handleLogout();
        } finally {
          // aunque falle el request, la sesión local se limpia igual
          set({ usuario: null });
        }
      },

      checkSession: async () => {
        set({ cargando: true });
        try {
          const usuario = await handleMe();
          set({ usuario });
        } catch {
          set({ usuario: null });
        } finally {
          set({ cargando: false });
        }
      },

      clearSession: () => set({ usuario: null }),
    }),
    {
      name: "auth-storage",
      // solo el usuario: nunca el token ni el estado de carga
      partialize: (state) => ({ usuario: state.usuario }),
    },
  ),
);
