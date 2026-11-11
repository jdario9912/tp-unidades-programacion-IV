import { useModal } from "@/shared/hooks/modal";
import type { Categoria } from "@/features/categorias/types/categoria";
import { Modal } from "@/shared/ui/modal";
import ActionButton from "@/shared/ui/action-button";
import CategoriaForm from "./CategoriaForm";

type Props = {
  categoria?: Categoria;
};

const CategoriaModal = ({ categoria }: Props) => {
  const { abierto, abrir, cerrar } = useModal();

  return (
    <>
      <ActionButton onClick={abrir}>
        {categoria ? (
          "Editar"
        ) : (
          <>
            + <span className="hidden sm:inline">Añadir </span>
            Categoría
          </>
        )}
      </ActionButton>

      <Modal abierto={abierto} onCerrar={cerrar}>
        <div className="flex justify-between p-2 px-4">
          <h2 className="font-bold">
            {categoria ? "Editar Categoría" : "Añadir Categoría"}
          </h2>

          <ActionButton onClick={cerrar} variant="ghost">
            X
          </ActionButton>
        </div>
        {/* se monta sólo abierto para que cada apertura arranque sin errores */}
        {abierto && <CategoriaForm categoria={categoria} cerrar={cerrar} />}
      </Modal>
    </>
  );
};

export default CategoriaModal;
