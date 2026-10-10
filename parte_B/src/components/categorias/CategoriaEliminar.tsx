import type { SyntheticEvent } from "react";
import { useModal } from "../../hooks/modal";
import ActionButton from "../ui/action-button";
import Input from "../ui/input";
import { Modal } from "../ui/modal";
import { useDeleteCategoria } from "../../hooks/categorias";

type Props = {
  idCategoria: number;
  onSave: () => void | Promise<void>;
};

const CategoriaEliminar = ({ idCategoria, onSave }: Props) => {
  const { abierto, abrir, cerrar } = useModal();
  const { error, loading, submit } = useDeleteCategoria();

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    submit(idCategoria);
    await onSave();
  };

  return (
    <>
      <ActionButton onClick={abrir} className="text-red-500">
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
            <ActionButton onClick={cerrar} className="bg-gray-400 text-white">
              Cancelar
            </ActionButton>
            <Input
              type="submit"
              value="Eliminar"
              className="p-2 px-4 bg-red-500 text-white outline-none border-none"
              disabled={loading}
            />
          </div>
        </form>
        {error ?? <span>{error}</span>}
      </Modal>
    </>
  );
};

export default CategoriaEliminar;
