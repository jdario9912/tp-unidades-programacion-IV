import type { Producto, ProductoInput } from "@/features/products/types/producto";
import {
  handleActualizarProducto,
  handleAsignarCategoria,
  handleAsignarIngrediente,
  handleCrearProducto,
  handleEliminarProducto,
  handleGetProductos,
  handleQuitarCategoria,
  handleQuitarIngrediente,
} from "@/features/products/api/productos";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { succeeded } from "@/shared/utils/promise";
import { notificarError, notificarExito } from "@/shared/utils/notificaciones";

const PRODUCTOS_QUERY_KEY = "productos";

export const useGetProductos = (search = "") => {
  const { data, isLoading, isFetching, error } = useQuery<Producto[]>({
    // el search en la key separa la caché de cada búsqueda; las
    // invalidaciones con [PRODUCTOS_QUERY_KEY] siguen alcanzando a todas
    queryKey: [PRODUCTOS_QUERY_KEY, search],
    queryFn: () => handleGetProductos(search),
    // mantiene la tabla anterior mientras llega el resultado de la búsqueda
    placeholderData: keepPreviousData,
  });

  return {
    productos: data,
    loading: isLoading,
    fetching: isFetching,
    error: error?.message,
  };
};

type CrearProductoArgs = {
  input: ProductoInput;
  categoriasIds: number[];
  ingredientesIds: number[];
};

export const useCreateProducto = () => {
  const queryClient = useQueryClient();
  const invalidar = () =>
    queryClient.invalidateQueries({ queryKey: [PRODUCTOS_QUERY_KEY] });

  const mutation = useMutation({
    mutationFn: async ({
      input,
      categoriasIds,
      ingredientesIds,
    }: CrearProductoArgs) => {
      const producto = await handleCrearProducto(input);

      // las categorías y los ingredientes se asocian en endpoints aparte
      try {
        await Promise.all([
          ...categoriasIds.map((id) => handleAsignarCategoria(producto.id, id)),
          ...ingredientesIds.map((id) =>
            handleAsignarIngrediente(producto.id, id),
          ),
        ]);
      } catch (error) {
        const mensaje = error instanceof Error ? error.message : String(error);
        throw new Error(
          `El producto se creó, pero no se pudieron asignar las categorías o ingredientes: ${mensaje}. Editalo para asignarlos.`,
          { cause: error },
        );
      }

      return producto;
    },
    onSuccess: () => {
      invalidar();
      notificarExito("Producto creado");
    },
    // el producto pudo crearse aunque falle alguna asignación
    onError: (error) => {
      invalidar();
      notificarError(error);
    },
  });

  const submit = async (
    input: ProductoInput,
    categoriasIds: number[],
    ingredientesIds: number[],
  ) => {
    return succeeded(
      mutation.mutateAsync({ input, categoriasIds, ingredientesIds }),
    );
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
  ingredientesIds: number[];
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
      ingredientesIds,
    }: ActualizarProductoArgs) => {
      const actualizado = await handleActualizarProducto(producto.id, input);

      const actuales = producto.categorias.map((c) => c.id);
      const agregar = categoriasIds.filter((id) => !actuales.includes(id));
      const quitar = actuales.filter((id) => !categoriasIds.includes(id));

      const ingredientesActuales = producto.ingredientes.map((i) => i.id);
      const agregarIngredientes = ingredientesIds.filter(
        (id) => !ingredientesActuales.includes(id),
      );
      const quitarIngredientes = ingredientesActuales.filter(
        (id) => !ingredientesIds.includes(id),
      );

      await Promise.all([
        ...agregar.map((id) => handleAsignarCategoria(producto.id, id)),
        ...quitar.map((id) => handleQuitarCategoria(producto.id, id)),
        ...agregarIngredientes.map((id) =>
          handleAsignarIngrediente(producto.id, id),
        ),
        ...quitarIngredientes.map((id) =>
          handleQuitarIngrediente(producto.id, id),
        ),
      ]);

      return actualizado;
    },
    onSuccess: () => {
      invalidar();
      notificarExito("Producto actualizado");
    },
    onError: (error) => {
      invalidar();
      notificarError(error);
    },
  });

  const submit = async (
    producto: Producto,
    input: ProductoInput,
    categoriasIds: number[],
    ingredientesIds: number[],
  ) => {
    return succeeded(
      mutation.mutateAsync({
        producto,
        input,
        categoriasIds,
        ingredientesIds,
      }),
    );
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
      notificarExito("Producto eliminado");
    },
    onError: notificarError,
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

// CRUD completo de productos: listado y mutaciones de alta, edición y baja
export const useProducts = (search = "") => {
  const listado = useGetProductos(search);
  const crear = useCreateProducto();
  const actualizar = useUpdateProducto();
  const eliminar = useDeleteProducto();

  return { ...listado, crear, actualizar, eliminar };
};
