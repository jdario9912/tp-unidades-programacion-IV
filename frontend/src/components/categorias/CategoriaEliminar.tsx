import type { SyntheticEvent } from "react";
import { useModal } from "../../hooks/modal";
import ActionButton from "../ui/action-button";
import Input from "../ui/input";
import { Modal } from "../ui/modal";
import { useDeleteCategoria } from "../../hooks/categorias";

type Props = {
  idCategoria: number;
};

const CategoriaEliminar = ({ idCategoria }: Props) => {
  const { abierto, abrir, cerrar } = useModal();
  const { error, loading, submit } = useDeleteCategoria();

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    submit(idCategoria);
  };

  return (
    <>
      <ActionButton onClick={abrir} className="text-destructive">
        Eliminar
      </ActionButton>

      <Modal abierto={abierto} onCerrar={cerrar}>
        <div className="flex justify-between p-2 px-4 min-w-xl">
          <h2 className="font-bold">Eliminar categoria</h2>

          <ActionButton onClick={cerrar}>X</ActionButton>
        </div>
        <div className="p-4">
          <p>¿Estas seguro de que quieres eliminar esta categoria?</p>
        </div>
        <form className="p-4" onSubmit={handleSubmit}>
          <div className="flex gap-x-2 justify-end">
            <ActionButton onClick={cerrar} variant="secondary">
              Cancelar
            </ActionButton>
            <Input
              type="submit"
              value="Eliminar"
              className="p-2 px-4 bg-destructive text-off-white outline-none border-none"
              disabled={loading}
            />
          </div>
        </form>
        {error && <span>{error}</span>}
      </Modal>
    </>
  );
};

export default CategoriaEliminar;
