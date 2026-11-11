import { useCancelarPedido } from "@/features/pedidos/hooks/usePedidos";
import { useModal } from "@/shared/hooks/modal";
import ActionButton from "@/shared/ui/action-button";
import { Modal } from "@/shared/ui/modal";
import CardError from "@/shared/ui/card-error";

type Props = {
  idPedido: number;
};

const PedidoCancelar = ({ idPedido }: Props) => {
  const { abierto, abrir, cerrar } = useModal();
  const { error, loading, submit, reset } = useCancelarPedido();

  const handleConfirmar = async () => {
    if (await submit(idPedido)) cerrar();
  };

  const handleCerrar = () => {
    reset();
    cerrar();
  };

  return (
    <>
      <ActionButton onClick={abrir} variant="destructive">
        Cancelar pedido
      </ActionButton>

      <Modal abierto={abierto} onCerrar={handleCerrar} className="max-w-sm">
        <div className="flex justify-between p-2 px-4">
          <h2 className="font-bold">Cancelar pedido #{idPedido}</h2>
          <ActionButton onClick={handleCerrar} variant="ghost">
            X
          </ActionButton>
        </div>
        <p className="p-4">
          ¿Querés cancelar este pedido? No se puede deshacer.
        </p>
        <div className="flex gap-x-2 p-4 justify-end">
          <ActionButton onClick={handleCerrar} variant="secondary">
            Volver
          </ActionButton>
          <ActionButton
            onClick={handleConfirmar}
            variant="destructive"
            disabled={loading}
          >
            {loading ? "Cancelando…" : "Cancelar pedido"}
          </ActionButton>
        </div>
        {error && <CardError className="mx-4 mb-4">{error}</CardError>}
      </Modal>
    </>
  );
};

export default PedidoCancelar;
