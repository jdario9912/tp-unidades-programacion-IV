import type { Categoria, CategoriaInput } from "../types/categoria";
import { get, post, put, remove } from "./client";

const URL_CATEGORIAS = "/categorias";

export const getCategorias = async () => {
  try {
    return await get<Categoria[]>(`${URL_CATEGORIAS}`);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    throw error;
  }
};

export const getCategoriaById = async (id: number) => {
  try {
    return await get<Categoria>(`${URL_CATEGORIAS}/${id}`);
  } catch (error) {
    console.error(`Error al obtener categoría con ID ${id}:`, error);
    throw error;
  }
};

export const crearCategoria = async (categoria: CategoriaInput) => {
  try {
    return await post<CategoriaInput, Categoria>(
      `${URL_CATEGORIAS}`,
      categoria,
    );
  } catch (error) {
    console.error("Error al crear categoría:", error);
    throw error;
  }
};

export const actualizarCategoria = async (
  id: number,
  categoria: CategoriaInput,
) => {
  try {
    return await put<CategoriaInput, Categoria>(
      `${URL_CATEGORIAS}/${id}`,
      categoria,
    );
  } catch (error) {
    console.error(`Error al actualizar categoría con ID ${id}:`, error);
    throw error;
  }
};

export const eliminarCategoria = async (id: number) => {
  try {
    await remove(`${URL_CATEGORIAS}/${id}`);
  } catch (error) {
    console.error(`Error al eliminar categoría con ID ${id}:`, error);
    throw error;
  }
};
