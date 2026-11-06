import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UsuarioAuth } from "../types/auth.types";
import { handleLogin, handleLogout, handleMe } from "../api/auth";

type AuthState = {
  usuario: UsuarioAuth | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      // arranca en true: la sesión no está confirmada hasta que corre checkSession
      loading: true,

      login: async (email, password) => {
        set({ loading: true });
        try {
          // el token viaja en una cookie HttpOnly; el store sólo guarda el usuario
          await handleLogin(email, password);
          const usuario = await handleMe();
          set({ usuario });
        } finally {
          set({ loading: false });
        }
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
        set({ loading: true });
        try {
          const usuario = await handleMe();
          set({ usuario });
        } catch {
          set({ usuario: null });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth",
      partialize: (state) => ({ usuario: state.usuario }),
    },
  ),
);
