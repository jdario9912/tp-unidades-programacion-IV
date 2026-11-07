import { useMutation } from "@tanstack/react-query";
import { handleRegister } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import type { UsuarioRegister } from "../types/auth.types";
import { succeeded } from "../utils/promise";

export const useUsuario = () => useAuthStore((s) => s.usuario);

export const useAuthLoading = () => useAuthStore((s) => s.loading);

export const useLogin = () => useAuthStore((s) => s.login);

export const useLogout = () => useAuthStore((s) => s.logout);

export const useCheckSession = () => useAuthStore((s) => s.checkSession);

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
