import type {
  Categoria,
  CategoriaInput,
} from "@/features/categorias/types/categoria";
import { get, post, put, remove } from "@/shared/api/client";
import { paths } from "@/shared/api/constantes";

const URL_CATEGORIAS = `/${paths.categorias}`;

export const handleGetCategorias = async () => {
  return get<Categoria[]>(URL_CATEGORIAS);
};

export const handleCrearCategoria = async (categoria: CategoriaInput) => {
  return post<CategoriaInput, Categoria>(URL_CATEGORIAS, categoria);
};

export const handleActualizarCategoria = async ({
  id,
  ...categoria
}: CategoriaInput & { id: number }) => {
  return put<CategoriaInput, Categoria>(`${URL_CATEGORIAS}/${id}`, categoria);
};

export const handleEliminarCategoria = async (id: number) => {
  await remove(`${URL_CATEGORIAS}/${id}`);
};
