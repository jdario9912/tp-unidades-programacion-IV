import { useEffect, useState } from "react";
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
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const data = await handleGetCategoriaById(id);
        setCategoria(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoria();
  }, [id]);

  return { categoria, loading, error };
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
    mutation.mutate({
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
    mutation.mutate(categoria);
  };

  return {
    createdCategoria: mutation.data,
    loading: mutation.isPending,
    error: mutation.error?.message,
    submit,
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

  return { loading: mutation.isPending, error: mutation.isError, submit };
};
