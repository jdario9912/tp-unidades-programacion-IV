import { useCambiarEstadoPedido } from "@/features/pedidos/hooks/usePedidos";
import {
  TRANSICIONES,
  type EstadoPedido,
  type Pedido,
} from "@/features/pedidos/types/pedido";
import ActionButton from "@/shared/ui/action-button";

type Props = {
  pedido: Pedido;
};

const ETIQUETAS: Record<EstadoPedido, string> = {
  PENDIENTE: "Pendiente",
  EN_PREPARACION: "Preparar",
  ENTREGADO: "Entregar",
  CANCELADO: "Cancelar",
};

// un botón por cada transición válida desde el estado actual
const PedidoAcciones = ({ pedido }: Props) => {
  const { loading, submit } = useCambiarEstadoPedido();

  return (
    <div className="flex justify-end gap-x-2">
      {TRANSICIONES[pedido.estado].map((estado) => (
        <ActionButton
          key={estado}
          variant={estado === "CANCELADO" ? "destructive" : "primary"}
          disabled={loading}
          onClick={() => submit(pedido.id, estado)}
        >
          {ETIQUETAS[estado]}
        </ActionButton>
      ))}
    </div>
  );
};

export default PedidoAcciones;
