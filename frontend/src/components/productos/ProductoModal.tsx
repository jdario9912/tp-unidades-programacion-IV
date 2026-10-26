import { useModal } from "../../hooks/modal";
import type { Producto } from "../../types/producto";
import { Modal } from "../ui/modal";
import ActionButton from "../ui/action-button";
import ProductoForm from "./ProductoForm";

type Props = {
  producto?: Producto;
};

const ProductoModal = ({ producto }: Props) => {
  const { abierto, abrir, cerrar } = useModal();

  return (
    <>
      <ActionButton onClick={abrir}>
        {producto ? "Ver" : "+ Añadir Producto"}
      </ActionButton>

      <Modal abierto={abierto} onCerrar={cerrar}>
        <div className="flex justify-between p-2 px-4 min-w-xl">
          <h2 className="font-bold">
            {producto ? "Ver Producto" : "Añadir Producto"}
          </h2>

          <ActionButton onClick={cerrar} variant="ghost">
            X
          </ActionButton>
        </div>
        {abierto && <ProductoForm producto={producto} cerrar={cerrar} />}
      </Modal>
    </>
  );
};

export default ProductoModal;
