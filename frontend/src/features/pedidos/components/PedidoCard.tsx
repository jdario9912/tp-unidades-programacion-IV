import { useState } from "react";
import type { Pedido } from "@/features/pedidos/types/pedido";
import { formatearFecha, formatearPrecio } from "@/shared/utils/formato";
import ActionButton from "@/shared/ui/action-button";
import BadgeEstado from "@/shared/ui/badge-estado";
import Card from "@/shared/ui/card";
import PedidoCancelar from "./PedidoCancelar";
import PedidoDetalle from "./PedidoDetalle";

type Props = {
  pedido: Pedido;
};

const PedidoCard = ({ pedido }: Props) => {
  const [abierto, setAbierto] = useState(false);

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2 p-4">
        <div className="flex items-center gap-x-3">
          <span className="font-semibold">Pedido #{pedido.id}</span>
          <BadgeEstado estado={pedido.estado} />
        </div>
        <span className="text-sm text-muted">
          {formatearFecha(pedido.created_at)}
        </span>
        <span className="font-bold">{formatearPrecio(pedido.total)}</span>
        <div className="flex gap-x-2">
          <ActionButton
            variant="outline"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
          >
            {abierto ? "Ocultar" : "Ver detalle"}
          </ActionButton>
          {/* el cliente solo cancela en PENDIENTE (RN-04) */}
          {pedido.estado === "PENDIENTE" && (
            <PedidoCancelar idPedido={pedido.id} />
          )}
        </div>
      </div>
      {abierto && (
        <div className="border-t border-divider p-4">
          <PedidoDetalle pedido={pedido} />
        </div>
      )}
    </Card>
  );
};

export default PedidoCard;
