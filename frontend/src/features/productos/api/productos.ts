import type {
  FiltrosProductos,
  Producto,
  ProductoInput,
  ProductosPaginados,
  ProductoStockInput,
} from "@/features/productos/types/producto";
import { get, patch, post, put, remove } from "@/shared/api/client";
import { paths } from "@/shared/api/constantes";

const URL_PRODUCTOS = `/${paths.productos}`;

export const handleGetProductos = async (filtros: FiltrosProductos) => {
  return get<ProductosPaginados>(URL_PRODUCTOS, { ...filtros });
};

export const handleCrearProducto = async (producto: ProductoInput) => {
  return post<ProductoInput, Producto>(URL_PRODUCTOS, producto);
};

export const handleActualizarProducto = async ({
  id,
  ...producto
}: ProductoInput & { id: number }) => {
  return put<ProductoInput, Producto>(`${URL_PRODUCTOS}/${id}`, producto);
};

export const handleActualizarStock = async ({
  id,
  ...stock
}: ProductoStockInput & { id: number }) => {
  return patch<ProductoStockInput, Producto>(
    `${URL_PRODUCTOS}/${id}/stock`,
    stock,
  );
};

export const handleEliminarProducto = async (id: number) => {
  await remove(`${URL_PRODUCTOS}/${id}`);
};
