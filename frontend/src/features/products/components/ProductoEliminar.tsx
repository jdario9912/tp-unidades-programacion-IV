import type { SyntheticEvent } from "react";
import { useModal } from "@/shared/hooks/modal";
import ActionButton from "@/shared/components/ui/action-button";
import Input from "@/shared/components/ui/input";
import { Modal } from "@/shared/components/ui/modal";
import CardError from "@/shared/components/ui/card-error";
import { useDeleteProducto } from "@/features/products/hooks/useProducts";

type Props = {
  idProducto: number;
};

const ProductoEliminar = ({ idProducto }: Props) => {
  const { abierto, abrir, cerrar } = useModal();
  const { error, loading, submit, reset } = useDeleteProducto();

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (await submit(idProducto)) cerrar();
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

export default ProductoEliminar;
