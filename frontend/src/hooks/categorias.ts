import type { Categoria, CategoriaInput } from "../types/categoria";
import {
  handleActualizarCategoria,
  handleGetCategoriaById,
  handleGetCategorias,
  handleCrearCategoria,
  handleEliminarCategoria,
} from "../api/categorias";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const CATEGORIAS_QUERY_KEY = "categorias";
const CATEGORIA_QUERY_KEY = "categoria";

export const useGetCategorias = (search = "") => {
  const { data, isLoading, isFetching, isError } = useQuery<Categoria[]>({
    // el search en la key separa la caché de cada búsqueda; las
    // invalidaciones con [CATEGORIAS_QUERY_KEY] siguen alcanzando a todas
    queryKey: [CATEGORIAS_QUERY_KEY, search],
    queryFn: () => handleGetCategorias(search),
    // mantiene la tabla anterior mientras llega el resultado de la búsqueda
    placeholderData: keepPreviousData,
  });

  return {
    categorias: data,
    loading: isLoading,
    fetching: isFetching,
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
    return mutation.mutateAsync(id);
  };

  return {
    loading: mutation.isPending,
    error: mutation.error?.message,
    submit,
    reset: mutation.reset,
  };
};
