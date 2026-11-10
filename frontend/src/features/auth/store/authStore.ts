import { create } from "zustand";
import type { UsuarioAuth } from "@/features/auth/types/auth.types";
import { handleLogin, handleLogout, handleMe } from "@/features/auth/api/auth";

type AuthState = {
  usuario: UsuarioAuth | null;
  checking: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearSession: () => void;
};

// sin persist: la sesión vive en la cookie HttpOnly y se recupera con /auth/me
export const useAuthStore = create<AuthState>()((set) => ({
  usuario: null,
  // arranca en true: la sesión no está confirmada hasta que corre checkAuth
  checking: true,

  login: async (email, password) => {
    // el token viaja en una cookie HttpOnly; el store sólo guarda el usuario
    await handleLogin(email, password);
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

  checkAuth: async () => {
    set({ checking: true });
    try {
      const usuario = await handleMe();
      set({ usuario });
    } catch {
      set({ usuario: null });
    } finally {
      set({ checking: false });
    }
  },

  clearSession: () => set({ usuario: null }),
}));
