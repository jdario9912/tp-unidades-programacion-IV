import type { Ingrediente, IngredienteInput } from "../types/ingrediente";
import {
  handleActualizarIngrediente,
  handleCrearIngrediente,
  handleEliminarIngrediente,
  handleGetIngredientes,
} from "../api/ingredientes";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const INGREDIENTES_QUERY_KEY = "ingredientes";

export const useGetIngredientes = (search = "") => {
  const { data, isLoading, isFetching, isError } = useQuery<Ingrediente[]>({
    // el search en la key separa la caché de cada búsqueda; las
    // invalidaciones con [INGREDIENTES_QUERY_KEY] siguen alcanzando a todas
    queryKey: [INGREDIENTES_QUERY_KEY, search],
    queryFn: () => handleGetIngredientes(search),
    // mantiene la tabla anterior mientras llega el resultado de la búsqueda
    placeholderData: keepPreviousData,
  });

  return {
    ingredientes: data,
    loading: isLoading,
    fetching: isFetching,
    error: isError,
  };
};

export const useUpdateIngrediente = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: handleActualizarIngrediente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INGREDIENTES_QUERY_KEY] });
    },
  });

  const submit = async (id: number, ingrediente: IngredienteInput) => {
    return mutation.mutateAsync({ id, nombre: ingrediente.nombre });
  };

  return {
    updatedIngrediente: mutation.data,
    loading: mutation.isPending,
    error: mutation.error?.message,
    submit,
    reset: mutation.reset,
  };
};

export const useCreateIngrediente = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: handleCrearIngrediente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INGREDIENTES_QUERY_KEY] });
    },
  });

  const submit = async (ingrediente: IngredienteInput) => {
    return mutation.mutateAsync(ingrediente);
  };

  return {
    createdIngrediente: mutation.data,
    loading: mutation.isPending,
    error: mutation.error?.message,
    submit,
    reset: mutation.reset,
  };
};

export const useDeleteIngrediente = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: handleEliminarIngrediente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INGREDIENTES_QUERY_KEY] });
    },
  });

  const submit = async (id: number) => {
    mutation.mutate(id);
  };

  return {
    loading: mutation.isPending,
    error: mutation.error?.message,
    submit,
    reset: mutation.reset,
  };
};
