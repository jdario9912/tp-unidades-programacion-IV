import type { SyntheticEvent } from "react";
import { useModal } from "../../hooks/modal";
import ActionButton from "../ui/action-button";
import Input from "../ui/input";
import { Modal } from "../ui/modal";
import { useDeleteProducto } from "../../hooks/productos";

type Props = {
  idProducto: number;
};

const ProductoEliminar = ({ idProducto }: Props) => {
  const { abierto, abrir, cerrar } = useModal();
  const { error, loading, submit, reset } = useDeleteProducto();

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await submit(idProducto);
    } catch {
      return;
    }

    cerrar();
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
        <div className="flex justify-between p-2 px-4 min-w-xl">
          <h2 className="font-bold">Eliminar producto</h2>

          <ActionButton onClick={handleCerrar} variant="ghost">
            X
          </ActionButton>
        </div>
        <div className="p-4">
          <p>¿Estás seguro de que quieres eliminar este producto?</p>
        </div>
        <div className="flex gap-x-2 p-4 justify-end">
          <ActionButton onClick={handleCerrar} variant="secondary">
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
        {error && <p className="text-destructive text-sm px-4 pb-4">{error}</p>}
      </Modal>
    </>
  );
};

export default ProductoEliminar;
