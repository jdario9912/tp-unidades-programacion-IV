import type {
  EstadoPedido,
  FiltrosPedidos,
  Pedido,
  PedidoCreate,
  PedidosPaginados,
  ResumenPedidos,
} from "@/features/pedidos/types/pedido";
import { get, patch, post } from "@/shared/api/client";
import { paths } from "@/shared/api/constantes";

const URL_PEDIDOS = `/${paths.pedidos}`;

export const handleGetPedidos = async (filtros: FiltrosPedidos) => {
  return get<PedidosPaginados>(URL_PEDIDOS, { ...filtros });
};

export const handleGetResumen = async () => {
  return get<ResumenPedidos>(`${URL_PEDIDOS}/resumen`);
};

export const handleCrearPedido = async (pedido: PedidoCreate) => {
  return post<PedidoCreate, Pedido>(URL_PEDIDOS, pedido);
};

export const handleCambiarEstado = async ({
  id,
  estado,
}: {
  id: number;
  estado: EstadoPedido;
}) => {
  return patch<{ estado: EstadoPedido }, Pedido>(`${URL_PEDIDOS}/${id}/estado`, {
    estado,
  });
};

export const handleCancelarPedido = async (id: number) => {
  return patch<undefined, Pedido>(`${URL_PEDIDOS}/${id}/cancelar`);
};
