import type {
  FiltrosProductos,
  ProductoInput,
  ProductosPaginados,
  ProductoStockInput,
} from "@/features/productos/types/producto";
import {
  handleActualizarProducto,
  handleActualizarStock,
  handleCrearProducto,
  handleEliminarProducto,
  handleGetProductos,
} from "@/features/productos/api/productos";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { succeeded } from "@/shared/utils/promise";
import { notificarExito } from "@/shared/utils/notificaciones";

const PRODUCTOS_QUERY_KEY = "productos";

export const useGetProductos = (filtros: FiltrosProductos) => {
  const { data, isLoading, isFetching, error } = useQuery<ProductosPaginados>({
    // los filtros en la key separan la caché de cada página y búsqueda; las
    // invalidaciones con [PRODUCTOS_QUERY_KEY] siguen alcanzando a todas
    queryKey: [PRODUCTOS_QUERY_KEY, filtros],
    queryFn: () => handleGetProductos(filtros),
    // mantiene la página anterior mientras llega la siguiente
    placeholderData: keepPreviousData,
  });

  return {
    productos: data?.items,
    total: data?.total ?? 0,
    loading: isLoading,
    fetching: isFetching,
    error: error?.message,
  };
};

export const useCreateProducto = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: handleCrearProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTOS_QUERY_KEY] });
      notificarExito("Producto creado");
    },
  });

  const submit = async (producto: ProductoInput) => {
    return succeeded(mutation.mutateAsync(producto));
  };

  return {
    loading: mutation.isPending,
    error: mutation.error?.message,
    submit,
    reset: mutation.reset,
  };
};

export const useUpdateProducto = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: handleActualizarProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTOS_QUERY_KEY] });
      notificarExito("Producto actualizado");
    },
  });

  const submit = async (id: number, producto: ProductoInput) => {
    return succeeded(mutation.mutateAsync({ id, ...producto }));
  };

  return {
    loading: mutation.isPending,
    error: mutation.error?.message,
    submit,
    reset: mutation.reset,
  };
};

export const useUpdateStock = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: handleActualizarStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTOS_QUERY_KEY] });
      notificarExito("Stock actualizado");
    },
  });

  const submit = async (id: number, stock: ProductoStockInput) => {
    return succeeded(mutation.mutateAsync({ id, ...stock }));
  };

  return {
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
      notificarExito("Producto eliminado");
    },
  });

  const submit = async (id: number) => {
    return succeeded(mutation.mutateAsync(id));
  };

  return {
    loading: mutation.isPending,
    error: mutation.error?.message,
    submit,
    reset: mutation.reset,
  };
};
