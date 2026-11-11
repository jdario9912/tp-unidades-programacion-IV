import type { Pedido } from "@/features/pedidos/types/pedido";
import { useModal } from "@/shared/hooks/modal";
import ActionButton from "@/shared/ui/action-button";
import BadgeEstado from "@/shared/ui/badge-estado";
import { Modal } from "@/shared/ui/modal";
import PedidoDetalle from "./PedidoDetalle";

type Props = {
  pedido: Pedido;
};

const PedidoDetalleModal = ({ pedido }: Props) => {
  const { abierto, abrir, cerrar } = useModal();

  return (
    <>
      <ActionButton variant="outline" onClick={abrir}>
        Ver
      </ActionButton>

      <Modal abierto={abierto} onCerrar={cerrar}>
        <div className="flex items-center justify-between p-2 px-4">
          <h2 className="flex items-center gap-x-2 font-bold">
            Pedido #{pedido.id}
            <BadgeEstado estado={pedido.estado} />
          </h2>
          <ActionButton onClick={cerrar} variant="ghost">
            X
          </ActionButton>
        </div>
        <div className="p-4">
          <PedidoDetalle pedido={pedido} />
        </div>
      </Modal>
    </>
  );
};

export default PedidoDetalleModal;
