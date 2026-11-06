import type { Producto, ProductoInput } from "../types/producto";
import { get, post, put, remove } from "./client";
import { paths } from "./constantes";

const URL_PRODUCTOS = `/${paths.productos}`;

export const handleGetProductos = async (search = "") => {
  const params = new URLSearchParams({ limit: "50" });
  if (search) params.set("search", search);

  try {
    return await get<Producto[]>(`${URL_PRODUCTOS}?${params}`);
  } catch (error) {
    throw error;
  }
};

export const handleCrearProducto = async (producto: ProductoInput) => {
  try {
    return await post<ProductoInput, Producto>(`${URL_PRODUCTOS}`, producto);
  } catch (error) {
    throw error;
  }
};

export const handleActualizarProducto = async (
  id: number,
  producto: ProductoInput,
) => {
  try {
    return await put<ProductoInput, Producto>(
      `${URL_PRODUCTOS}/${id}`,
      producto,
    );
  } catch (error) {
    throw error;
  }
};

export const handleAsignarCategoria = async (
  productoId: number,
  categoriaId: number,
) => {
  try {
    await post(`${URL_PRODUCTOS}/${productoId}/categorias`, {
      categoria_id: categoriaId,
      es_principal: false,
    });
  } catch (error) {
    throw error;
  }
};

export const handleQuitarCategoria = async (
  productoId: number,
  categoriaId: number,
) => {
  try {
    await remove(`${URL_PRODUCTOS}/${productoId}/categorias/${categoriaId}`);
  } catch (error) {
    throw error;
  }
};

export const handleAsignarIngrediente = async (
  productoId: number,
  ingredienteId: number,
) => {
  try {
    await post(`${URL_PRODUCTOS}/${productoId}/ingredientes`, {
      ingrediente_id: ingredienteId,
    });
  } catch (error) {
    throw error;
  }
};

export const handleQuitarIngrediente = async (
  productoId: number,
  ingredienteId: number,
) => {
  try {
    await remove(
      `${URL_PRODUCTOS}/${productoId}/ingredientes/${ingredienteId}`,
    );
  } catch (error) {
    throw error;
  }
};

export const handleEliminarProducto = async (id: number) => {
  try {
    await remove(`${URL_PRODUCTOS}/${id}`);
  } catch (error) {
    throw error;
  }
};
