import { useEffect, useState } from "react";
import type { Categoria, CategoriaInput } from "../types/categoria";
import {
  handleActualizarCategoria,
  handleGetCategoriaById,
  handleGetCategorias,
  handleCrearCategoria,
  handleEliminarCategoria,
} from "../api/categorias";

import { useQuery } from "@tanstack/react-query";

export const useGetCategorias = () => {
  const { data, isLoading, isError } = useQuery<Categoria[]>({
    queryKey: ["products"],
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const submit = async (id: number) => {
    try {
      await handleEliminarCategoria(id);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, submit };
};
