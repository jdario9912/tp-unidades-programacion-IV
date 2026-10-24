import { useModal } from "../../hooks/modal";
import type { Categoria } from "../../types/categoria";
import { Modal } from "../ui/modal";
import ActionButton from "../ui/action-button";
import CategoriaForm from "./CategoriaForm";

type Props = {
  categoria?: Categoria;
};

const CategoriaModal = ({ categoria }: Props) => {
  const { abierto, abrir, cerrar } = useModal();

  return (
    <>
      <ActionButton onClick={abrir}>
        {categoria ? "Editar" : "+ Añadir Categoría"}
      </ActionButton>

      <Modal abierto={abierto} onCerrar={cerrar}>
        <div className="flex justify-between p-2 px-4 min-w-xl">
          <h2 className="font-bold">
            {categoria ? "Editar Categoría" : "Añadir Categoría"}
          </h2>

          <ActionButton onClick={cerrar} variant="ghost">
            X
          </ActionButton>
        </div>
        <CategoriaForm categoria={categoria} cerrar={cerrar} />
      </Modal>
    </>
  );
};

export default CategoriaModal;
