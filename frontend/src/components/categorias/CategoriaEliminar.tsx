import type { SyntheticEvent } from "react";
import { useModal } from "../../hooks/modal";
import ActionButton from "../ui/action-button";
import Input from "../ui/input";
import { Modal } from "../ui/modal";
import CardError from "../ui/card-error";
import { useDeleteCategoria } from "../../hooks/categorias";

type Props = {
  idCategoria: number;
};

const CategoriaEliminar = ({ idCategoria }: Props) => {
  const { abierto, abrir, cerrar } = useModal();
  const { error, loading, submit } = useDeleteCategoria();

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    await submit(idCategoria);
  };

  return (
    <>
      <ActionButton onClick={abrir} variant="destructive">
        Eliminar
      </ActionButton>

      <Modal abierto={abierto} onCerrar={cerrar}>
        <div className="flex justify-between p-2 px-4 min-w-xl">
          <h2 className="font-bold">Eliminar categoria</h2>

          <ActionButton onClick={cerrar} variant="ghost">
            X
          </ActionButton>
        </div>
        <div className="p-4">
          <p>¿Estas seguro de que quieres eliminar esta categoria?</p>
        </div>
        <div className="flex gap-x-2 p-4 justify-end">
          <ActionButton onClick={cerrar} variant="secondary">
            Cancelar
          </ActionButton>
          <form onSubmit={handleSubmit}>
            <Input
              type="submit"
              value="Eliminar"
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

export default CategoriaEliminar;
