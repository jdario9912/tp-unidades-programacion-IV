import type { Producto, ProductoInput } from "../types/producto";
import { get, post, put, remove } from "./axiosInstance";

const URL_PRODUCTOS = "/productos";

export const handleGetProductos = async (search = "") => {
  const params = new URLSearchParams({ limit: "50" });
  if (search) params.set("search", search);

  try {
    return await get<Producto[]>(`${URL_PRODUCTOS}?${params}`);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
};

export const handleCrearProducto = async (producto: ProductoInput) => {
  try {
    return await post<ProductoInput, Producto>(`${URL_PRODUCTOS}`, producto);
  } catch (error) {
    console.error("Error al crear producto:", error);
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
    console.error(`Error al actualizar producto con ID ${id}:`, error);
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
    console.error(
      `Error al asignar categoría ${categoriaId} al producto ${productoId}:`,
      error,
    );
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
    console.error(
      `Error al quitar categoría ${categoriaId} del producto ${productoId}:`,
      error,
    );
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
    console.error(
      `Error al asignar ingrediente ${ingredienteId} al producto ${productoId}:`,
      error,
    );
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
    console.error(
      `Error al quitar ingrediente ${ingredienteId} del producto ${productoId}:`,
      error,
    );
    throw error;
  }
};

export const handleEliminarProducto = async (id: number) => {
  try {
    await remove(`${URL_PRODUCTOS}/${id}`);
  } catch (error) {
    console.error(`Error al eliminar producto con ID ${id}:`, error);
    throw error;
  }
};
