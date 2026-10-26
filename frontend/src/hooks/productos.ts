import type { Producto, ProductoInput } from "../types/producto";
import {
  handleActualizarProducto,
  handleAsignarCategoria,
  handleCrearProducto,
  handleEliminarProducto,
  handleGetProductos,
  handleQuitarCategoria,
} from "../api/productos";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const PRODUCTOS_QUERY_KEY = "productos";

export const useGetProductos = () => {
  const { data, isLoading, isError } = useQuery<Producto[]>({
    queryKey: [PRODUCTOS_QUERY_KEY],
    queryFn: handleGetProductos,
  });

  return {
    productos: data,
    loading: isLoading,
    error: isError,
  };
};

type CrearProductoArgs = {
  input: ProductoInput;
  categoriasIds: number[];
};

export const useCreateProducto = () => {
  const queryClient = useQueryClient();
  const invalidar = () =>
    queryClient.invalidateQueries({ queryKey: [PRODUCTOS_QUERY_KEY] });

  const mutation = useMutation({
    mutationFn: async ({ input, categoriasIds }: CrearProductoArgs) => {
      const producto = await handleCrearProducto(input);

      // las categorías se asocian en un endpoint aparte
      try {
        await Promise.all(
          categoriasIds.map((id) => handleAsignarCategoria(producto.id, id)),
        );
      } catch (error) {
        const mensaje = error instanceof Error ? error.message : String(error);
        throw new Error(
          `El producto se creó, pero no se pudieron asignar las categorías: ${mensaje}. Editalo para asignarlas.`,
          { cause: error },
        );
      }

      return producto;
    },
    onSuccess: invalidar,
    // el producto pudo crearse aunque falle alguna asignación
    onError: invalidar,
  });

  const submit = async (input: ProductoInput, categoriasIds: number[]) => {
    return mutation.mutateAsync({ input, categoriasIds });
  };

  return {
    createdProducto: mutation.data,
    loading: mutation.isPending,
    error: mutation.error?.message,
    submit,
    reset: mutation.reset,
  };
};

type ActualizarProductoArgs = {
  producto: Producto;
  input: ProductoInput;
  categoriasIds: number[];
};

export const useUpdateProducto = () => {
  const queryClient = useQueryClient();
  const invalidar = () =>
    queryClient.invalidateQueries({ queryKey: [PRODUCTOS_QUERY_KEY] });

  const mutation = useMutation({
    mutationFn: async ({
      producto,
      input,
      categoriasIds,
    }: ActualizarProductoArgs) => {
      const actualizado = await handleActualizarProducto(producto.id, input);

      const actuales = producto.categorias.map((c) => c.id);
      const agregar = categoriasIds.filter((id) => !actuales.includes(id));
      const quitar = actuales.filter((id) => !categoriasIds.includes(id));

      await Promise.all([
        ...agregar.map((id) => handleAsignarCategoria(producto.id, id)),
        ...quitar.map((id) => handleQuitarCategoria(producto.id, id)),
      ]);

      return actualizado;
    },
    onSuccess: invalidar,
    onError: invalidar,
  });

  const submit = async (
    producto: Producto,
    input: ProductoInput,
    categoriasIds: number[],
  ) => {
    return mutation.mutateAsync({ producto, input, categoriasIds });
  };

  return {
    updatedProducto: mutation.data,
    loading: mutation.isPending,
    error: mutation.error?.message,
    submit,
    reset: mutation.reset,
  };
};

export const useDeleteProducto = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: handleEliminarProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTOS_QUERY_KEY] });
    },
  });

  const submit = async (id: number) => {
    return mutation.mutateAsync(id);
  };

  return {
    loading: mutation.isPending,
    error: mutation.error?.message,
    submit,
    reset: mutation.reset,
  };
};
