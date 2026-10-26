import type { Categoria, CategoriaInput } from "../types/categoria";
import {
  handleActualizarCategoria,
  handleGetCategoriaById,
  handleGetCategorias,
  handleCrearCategoria,
  handleEliminarCategoria,
} from "../api/categorias";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const CATEGORIAS_QUERY_KEY = "categorias";
const CATEGORIA_QUERY_KEY = "categoria";

export const useGetCategorias = () => {
  const { data, isLoading, isError } = useQuery<Categoria[]>({
    queryKey: [CATEGORIAS_QUERY_KEY],
    queryFn: handleGetCategorias,
  });

  return {
    categorias: data,
    loading: isLoading,
    error: isError,
  };
};

export const useGetCategoriaById = (id: number) => {
  const { data, isLoading, isError } = useQuery<Categoria>({
    queryKey: [CATEGORIA_QUERY_KEY, id],
    queryFn: () => handleGetCategoriaById(id),
  });

  return { categoria: data, loading: isLoading, error: isError };
};

export const useUpdateCategoria = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: handleActualizarCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIAS_QUERY_KEY] });
    },
  });

  const submit = async (id: number, categoria: CategoriaInput) => {
    return mutation.mutateAsync({
      id,
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
    });
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
    },
  });

  const submit = async (categoria: CategoriaInput) => {
    return mutation.mutateAsync(categoria);
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
    },
  });

  const submit = async (id: number) => {
    mutation.mutate(id);
  };

  return {
    loading: mutation.isPending,
    error: mutation.error?.message,
    submit,
    reset: mutation.reset,
  };
};
