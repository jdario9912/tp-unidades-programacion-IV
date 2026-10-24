import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import { useModal } from "../../hooks/modal";
import type { Categoria, CategoriaInput } from "../../types/categoria";
import Input from "../ui/input";
import Label from "../ui/label";
import { Modal } from "../ui/modal";
import { useCreateCategoria, useUpdateCategoria } from "../../hooks/categorias";
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
