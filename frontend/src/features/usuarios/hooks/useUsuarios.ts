import type { Usuario } from "@/features/usuarios/types/usuario";
import {
  handleActivarUsuario,
  handleDesactivarUsuario,
  handleGetUsuarios,
} from "@/features/usuarios/api/usuarios";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { succeeded } from "@/shared/utils/promise";
import { notificarError, notificarExito } from "@/shared/utils/notificaciones";

const USUARIOS_QUERY_KEY = "usuarios";

export const useGetUsuarios = () => {
  const { data, isLoading, isFetching, error } = useQuery<Usuario[]>({
    queryKey: [USUARIOS_QUERY_KEY],
    queryFn: handleGetUsuarios,
  });

  return {
    usuarios: data,
    loading: isLoading,
    fetching: isFetching,
    error: error?.message,
  };
};

// activa al usuario desactivado y desactiva al activo
export const useCambiarEstadoUsuario = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (usuario: Usuario) =>
      usuario.disabled
        ? handleActivarUsuario(usuario.id)
        : handleDesactivarUsuario(usuario.id),
    onSuccess: (usuario) => {
      queryClient.invalidateQueries({ queryKey: [USUARIOS_QUERY_KEY] });
      notificarExito(
        usuario.disabled ? "Usuario desactivado" : "Usuario activado",
      );
    },
    onError: notificarError,
  });

  const submit = async (usuario: Usuario) => {
    return succeeded(mutation.mutateAsync(usuario));
  };

  return {
    loading: mutation.isPending,
    error: mutation.error?.message,
    submit,
  };
};
