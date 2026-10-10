import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await handleGetCategorias();
        setCategorias(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  return { categorias, loading, error };
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

export const useUpdateCategoria = (id: number, categoria: CategoriaInput) => {
  const [updatedCategoria, setUpdatedCategoria] = useState<Categoria | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateCategoria = async () => {
      try {
        const data = await handleActualizarCategoria(id, categoria);
        setUpdatedCategoria(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    updateCategoria();
  }, [id, categoria]);

  return { updatedCategoria, loading, error };
};

export const useCreateCategoria = (categoria: CategoriaInput) => {
  const [createdCategoria, setCreatedCategoria] = useState<Categoria | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createCategoria = async () => {
      try {
        const data = await handleCrearCategoria(categoria);
        setCreatedCategoria(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    createCategoria();
  }, [categoria]);

  return { createdCategoria, loading, error };
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
