import type { Categoria, CategoriaInput } from "@/features/categories/types/categoria";
import { get, post, put, remove } from "@/shared/api/client";
import { paths } from "@/shared/api/constantes";

const URL_CATEGORIAS = `/${paths.categorias}`;

export const handleGetCategorias = async (search = "") => {
  const params = new URLSearchParams({ limit: "50" });
  if (search) params.set("search", search);

  return get<Categoria[]>(`${URL_CATEGORIAS}?${params}`);
};

export const handleGetCategoriaById = async (id: number) => {
  return get<Categoria>(`${URL_CATEGORIAS}/${id}`);
};

export const handleCrearCategoria = async (categoria: CategoriaInput) => {
  return post<CategoriaInput, Categoria>(`${URL_CATEGORIAS}`, categoria);
};

export const handleActualizarCategoria = async (categoria: Categoria) => {
  return put<CategoriaInput, Categoria>(`${URL_CATEGORIAS}/${categoria.id}`, {
    nombre: categoria.nombre,
    descripcion: categoria.descripcion,
  });
};

export const handleEliminarCategoria = async (id: number) => {
  await remove(`${URL_CATEGORIAS}/${id}`);
};
