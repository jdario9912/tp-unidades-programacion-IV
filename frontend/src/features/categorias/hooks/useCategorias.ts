import type {
  Categoria,
  CategoriaInput,
} from "@/features/categorias/types/categoria";
import {
  handleActualizarCategoria,
  handleCrearCategoria,
  handleEliminarCategoria,
  handleGetCategorias,
} from "@/features/categorias/api/categorias";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { succeeded } from "@/shared/utils/promise";
import { notificarExito } from "@/shared/utils/notificaciones";

const CATEGORIAS_QUERY_KEY = "categorias";
// los productos muestran su categoría: se refrescan cuando ella cambia
const PRODUCTOS_QUERY_KEY = "productos";

export const useGetCategorias = () => {
  const { data, isLoading, isFetching, error } = useQuery<Categoria[]>({
    queryKey: [CATEGORIAS_QUERY_KEY],
    queryFn: handleGetCategorias,
  });

  return {
    categorias: data,
    loading: isLoading,
    fetching: isFetching,
    error: error?.message,
  };
};

export const useUpdateCategoria = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: handleActualizarCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIAS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [PRODUCTOS_QUERY_KEY] });
      notificarExito("Categoría actualizada");
    },
  });

  const submit = async (id: number, categoria: CategoriaInput) => {
    return succeeded(mutation.mutateAsync({ id, ...categoria }));
  };

  return {
    updatedCategoria: mutation.data,
    loading: mutation.isPending,
    error: mutation.error?.message,
    submit,
    reset: mutation.reset,
  };
};

export const useCreateCategoria = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: handleCrearCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIAS_QUERY_KEY] });
      notificarExito("Categoría creada");
    },
  });

  const submit = async (categoria: CategoriaInput) => {
    return succeeded(mutation.mutateAsync(categoria));
  };

  return {
    createdCategoria: mutation.data,
    loading: mutation.isPending,
    error: mutation.error?.message,
    submit,
    reset: mutation.reset,
  };
};

export const useDeleteCategoria = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: handleEliminarCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIAS_QUERY_KEY] });
      notificarExito("Categoría eliminada");
    },
  });

  const submit = async (id: number) => {
    return succeeded(mutation.mutateAsync(id));
  };

  return {
    loading: mutation.isPending,
    error: mutation.error?.message,
    submit,
    reset: mutation.reset,
  };
};
