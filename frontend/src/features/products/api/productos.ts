import type { Producto, ProductoInput } from "@/features/products/types/producto";
import { get, post, put, remove } from "@/shared/api/client";
import { paths } from "@/shared/api/constantes";

const URL_PRODUCTOS = `/${paths.productos}`;

export const handleGetProductos = async (search = "") => {
  const params = new URLSearchParams({ limit: "50" });
  if (search) params.set("search", search);

  return get<Producto[]>(`${URL_PRODUCTOS}?${params}`);
};

export const handleCrearProducto = async (producto: ProductoInput) => {
  return post<ProductoInput, Producto>(`${URL_PRODUCTOS}`, producto);
};

export const handleActualizarProducto = async (
  id: number,
  producto: ProductoInput,
) => {
  return put<ProductoInput, Producto>(`${URL_PRODUCTOS}/${id}`, producto);
};

export const handleAsignarCategoria = async (
  productoId: number,
  categoriaId: number,
) => {
  await post(`${URL_PRODUCTOS}/${productoId}/categorias`, {
    categoria_id: categoriaId,
    es_principal: false,
  });
};

export const handleQuitarCategoria = async (
  productoId: number,
  categoriaId: number,
) => {
  await remove(`${URL_PRODUCTOS}/${productoId}/categorias/${categoriaId}`);
};

export const handleAsignarIngrediente = async (
  productoId: number,
  ingredienteId: number,
) => {
  await post(`${URL_PRODUCTOS}/${productoId}/ingredientes`, {
    ingrediente_id: ingredienteId,
  });
};

export const handleQuitarIngrediente = async (
  productoId: number,
  ingredienteId: number,
) => {
  await remove(`${URL_PRODUCTOS}/${productoId}/ingredientes/${ingredienteId}`);
};

export const handleEliminarProducto = async (id: number) => {
  await remove(`${URL_PRODUCTOS}/${id}`);
};
