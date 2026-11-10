import type { UsuarioAdmin } from "@/features/auth/types/auth.types";
import {
  handleActivarUsuario,
  handleDesactivarUsuario,
  handleGetUsuarios,
} from "@/features/auth/api/auth";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { succeeded } from "@/shared/utils/promise";
import { notificarError, notificarExito } from "@/shared/utils/notificaciones";

const USUARIOS_QUERY_KEY = "usuarios";

export const useGetUsuarios = (search = "") => {
  const { data, isLoading, isFetching, error } = useQuery<UsuarioAdmin[]>({
    queryKey: [USUARIOS_QUERY_KEY, search],
    queryFn: () => handleGetUsuarios(search),
    placeholderData: keepPreviousData,
  });

  return {
    usuarios: data,
    loading: isLoading,
    fetching: isFetching,
    error: error?.message,
  };
};

// activa al usuario inactivo y desactiva al activo
export const useCambiarEstadoUsuario = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (usuario: UsuarioAdmin) =>
      usuario.activo
        ? handleDesactivarUsuario(usuario.id)
        : handleActivarUsuario(usuario.id),
    onSuccess: (usuario) => {
      queryClient.invalidateQueries({ queryKey: [USUARIOS_QUERY_KEY] });
      notificarExito(usuario.activo ? "Usuario activado" : "Usuario desactivado");
    },
    onError: notificarError,
  });

  const submit = async (usuario: UsuarioAdmin) => {
    return succeeded(mutation.mutateAsync(usuario));
  };

  return {
    loading: mutation.isPending,
    error: mutation.error?.message,
    submit,
  };
};
