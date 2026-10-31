import { useModal } from "../../hooks/modal";
import type { Ingrediente } from "../../types/ingrediente";
import { Modal } from "../ui/modal";
import ActionButton from "../ui/action-button";
import IngredienteForm from "./IngredienteForm";

type Props = {
  ingrediente?: Ingrediente;
};

const IngredienteModal = ({ ingrediente }: Props) => {
  const { abierto, abrir, cerrar } = useModal();

  return (
    <>
      <ActionButton onClick={abrir}>
        {ingrediente ? (
          "Editar"
        ) : (
          <>
            + <span className="hidden sm:inline">Añadir </span>
            Ingrediente
          </>
        )}
      </ActionButton>

      <Modal abierto={abierto} onCerrar={cerrar}>
        <div className="flex justify-between p-2 px-4">
          <h2 className="font-bold">
            {ingrediente ? "Editar Ingrediente" : "Añadir Ingrediente"}
          </h2>

          <ActionButton onClick={cerrar} variant="ghost">
            X
          </ActionButton>
        </div>
        {/* se monta sólo abierto para que cada apertura arranque sin errores */}
        {abierto && (
          <IngredienteForm ingrediente={ingrediente} cerrar={cerrar} />
        )}
      </Modal>
    </>
  );
};

export default IngredienteModal;
