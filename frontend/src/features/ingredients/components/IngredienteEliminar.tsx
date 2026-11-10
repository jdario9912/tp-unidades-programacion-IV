import type { SyntheticEvent } from "react";
import { useModal } from "@/shared/hooks/modal";
import ActionButton from "@/shared/components/ui/action-button";
import Input from "@/shared/components/ui/input";
import { Modal } from "@/shared/components/ui/modal";
import CardError from "@/shared/components/ui/card-error";
import { useDeleteIngrediente } from "@/features/ingredients/hooks/useIngredients";

type Props = {
  idIngrediente: number;
};

const IngredienteEliminar = ({ idIngrediente }: Props) => {
  const { abierto, abrir, cerrar } = useModal();
  const { error, loading, submit, reset } = useDeleteIngrediente();

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (await submit(idIngrediente)) cerrar();
  };

  const handleCerrar = () => {
    reset();
    cerrar();
  };

  return (
    <>
      <ActionButton onClick={abrir} variant="destructive">
        Eliminar
      </ActionButton>

      <Modal abierto={abierto} onCerrar={handleCerrar}>
        <div className="flex justify-between p-2 px-4">
          <h2 className="font-bold">Eliminar ingrediente</h2>

          <ActionButton onClick={handleCerrar} variant="ghost">
            X
          </ActionButton>
        </div>
        <div className="p-4">
          <p>¿Estás seguro de que quieres eliminar este ingrediente?</p>
        </div>
        <div className="flex gap-x-2 p-4 justify-end">
          <ActionButton onClick={handleCerrar} variant="secondary">
            Cancelar
          </ActionButton>
          <form onSubmit={handleSubmit}>
            <Input
              type="submit"
              value={loading ? "Eliminando…" : "Eliminar"}
              disabled={loading}
              variant="destructive"
            />
          </form>
        </div>
        {error && <CardError className="mx-4 mb-4">{error}</CardError>}
      </Modal>
    </>
  );
};

export default IngredienteEliminar;
