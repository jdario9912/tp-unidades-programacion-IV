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
  const [updatedCategoria, setUpdatedCategoria] = useState<Categoria | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const submit = async (id: number, categoria: CategoriaInput) => {
    try {
      const data = await handleActualizarCategoria(id, categoria);
      setUpdatedCategoria(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { updatedCategoria, loading, error, submit };
};

export const useCreateCategoria = () => {
  const [createdCategoria, setCreatedCategoria] = useState<Categoria | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const submit = async (categoria: CategoriaInput) => {
    try {
      const data = await handleCrearCategoria(categoria);
      setCreatedCategoria(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { createdCategoria, loading, error, submit };
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
