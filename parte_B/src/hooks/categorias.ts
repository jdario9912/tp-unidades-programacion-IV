import { useCallback, useEffect, useState } from "react";
import type { Categoria, CategoriaInput } from "../types/categoria";
import {
  handleActualizarCategoria,
  handleGetCategoriaById,
  handleGetCategorias,
  handleCrearCategoria,
  handleEliminarCategoria,
} from "../api/categorias";

export const useGetCategorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true); // solo la carga inicial
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = useCallback(async () => {
    try {
      setError(null);
      const data = await handleGetCategorias();
      setCategorias(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  return { categorias, loading, error, refetch: fetchCategorias };
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

export const useDeleteCategoria = (id: number) => {
  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const deleteCategoria = async () => {
      try {
        await handleEliminarCategoria(id);
        setDeleted(true);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    deleteCategoria();
  }, [id]);

  return { deleted, loading, error };
};
