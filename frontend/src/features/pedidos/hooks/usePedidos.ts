import type {
  EstadoPedido,
  FiltrosPedidos,
  PedidoCreate,
  PedidosPaginados,
  ResumenPedidos,
} from "@/features/pedidos/types/pedido";
import {
  handleCambiarEstado,
  handleCancelarPedido,
  handleCrearPedido,
  handleGetPedidos,
  handleGetResumen,
} from "@/features/pedidos/api/pedidos";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { useCartStore } from "@/store/cartStore";
import { succeeded } from "@/shared/utils/promise";
import { notificarError, notificarExito } from "@/shared/utils/notificaciones";

// el resumen cuelga de la misma key: invalidar pedidos también lo refresca
const PEDIDOS_QUERY_KEY = "pedidos";
const RESUMEN_QUERY_KEY = [PEDIDOS_QUERY_KEY, "resumen"];
// crear y cancelar mueven el stock que muestra el catálogo
const PRODUCTOS_QUERY_KEY = "productos";

const invalidarPedidosYStock = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: [PEDIDOS_QUERY_KEY] });
  queryClient.invalidateQueries({ queryKey: [PRODUCTOS_QUERY_KEY] });
};

export const usePedidos = (filtros: FiltrosPedidos) => {
  const { data, isLoading, isFetching, error } = useQuery<PedidosPaginados>({
    queryKey: [PEDIDOS_QUERY_KEY, filtros],
    queryFn: () => handleGetPedidos(filtros),
    placeholderData: keepPreviousData,
  });

  return {
    pedidos: data?.items,
    total: data?.total ?? 0,
    loading: isLoading,
    fetching: isFetching,
    error: error?.message,
  };
};

export const useResumenPedidos = () => {
  const { data, isLoading, isFetching, error } = useQuery<ResumenPedidos>({
    queryKey: RESUMEN_QUERY_KEY,
    queryFn: handleGetResumen,
  });

  return {
    resumen: data,
    loading: isLoading,
    fetching: isFetching,
    error: error?.message,
  };
};

export const useCrearPedido = () => {
  const queryClient = useQueryClient();
  const vaciar = useCartStore((s) => s.vaciar);
  const mutation = useMutation({
    mutationFn: handleCrearPedido,
    onSuccess: () => {
      vaciar();
      invalidarPedidosYStock(queryClient);
      notificarExito("Pedido confirmado");
    },
  });

  const submit = async (pedido: PedidoCreate) => {
    return succeeded(mutation.mutateAsync(pedido));
  };

  return {
    loading: mutation.isPending,
    error: mutation.error?.message,
    submit,
    reset: mutation.reset,
  };
};

export const useCambiarEstadoPedido = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: handleCambiarEstado,
    onSuccess: (pedido) => {
      invalidarPedidosYStock(queryClient);
      notificarExito(`Pedido #${pedido.id}: ${pedido.estado.replace("_", " ")}`);
    },
    onError: notificarError,
  });

  const submit = async (id: number, estado: EstadoPedido) => {
    return succeeded(mutation.mutateAsync({ id, estado }));
  };

  return {
    loading: mutation.isPending,
    error: mutation.error?.message,
    submit,
  };
};

export const useCancelarPedido = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: handleCancelarPedido,
    onSuccess: () => {
      invalidarPedidosYStock(queryClient);
      notificarExito("Pedido cancelado");
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
