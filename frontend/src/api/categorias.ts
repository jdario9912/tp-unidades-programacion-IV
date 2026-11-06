import type { Categoria, CategoriaInput } from "../types/categoria";
import { get, post, put, remove } from "./client";
import { paths } from "./constantes";

const URL_CATEGORIAS = `/${paths.categorias}`;

export const handleGetCategorias = async (search = "") => {
  const params = new URLSearchParams({ limit: "50" });
  if (search) params.set("search", search);

  try {
    return await get<Categoria[]>(`${URL_CATEGORIAS}?${params}`);
  } catch (error) {
    throw error;
  }
};

export const handleGetCategoriaById = async (id: number) => {
  try {
    return await get<Categoria>(`${URL_CATEGORIAS}/${id}`);
  } catch (error) {
    throw error;
  }
};

export const handleCrearCategoria = async (categoria: CategoriaInput) => {
  try {
    return await post<CategoriaInput, Categoria>(
      `${URL_CATEGORIAS}`,
      categoria,
    );
  } catch (error) {
    throw error;
  }
};

export const handleActualizarCategoria = async (categoria: Categoria) => {
  try {
    return await put<CategoriaInput, Categoria>(
      `${URL_CATEGORIAS}/${categoria.id}`,
      {
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
      },
    );
  } catch (error) {
    throw error;
  }
};

export const handleEliminarCategoria = async (id: number) => {
  try {
    await remove(`${URL_CATEGORIAS}/${id}`);
  } catch (error) {
    throw error;
  }
};
