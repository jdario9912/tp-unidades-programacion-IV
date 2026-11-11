import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { handleRegister } from "@/features/auth/api/auth";
import { useAuthStore } from "@/store/authStore";
import type { UsuarioRegister } from "@/features/auth/types/auth.types";
import { succeeded } from "@/shared/utils/promise";

export const useUsuario = () => useAuthStore((s) => s.usuario);

export const useEsAdmin = () =>
  useAuthStore((s) => s.usuario?.role === "admin");

export const useAuthCargando = () => useAuthStore((s) => s.cargando);

export const useLogin = () => useAuthStore((s) => s.login);

export const useCheckSession = () => useAuthStore((s) => s.checkSession);

export const useLogout = () => {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return async () => {
    await logout();
    queryClient.clear();
    navigate("/login", { replace: true });
  };
};

// lectura de la sesión e inicio y cierre en un solo hook
export const useAuth = () => {
  const usuario = useUsuario();
  const esAdmin = useEsAdmin();
  const cargando = useAuthCargando();
  const login = useLogin();
  const logout = useLogout();

  return { usuario, esAdmin, cargando, login, logout };
};

export const useRegister = () => {
  const mutation = useMutation({
    mutationFn: handleRegister,
  });

  const submit = async (usuario: UsuarioRegister) => {
    return succeeded(mutation.mutateAsync(usuario));
  };

  return {
    registeredUsuario: mutation.data,
    loading: mutation.isPending,
    error: mutation.error?.message,
    submit,
    reset: mutation.reset,
  };
};
