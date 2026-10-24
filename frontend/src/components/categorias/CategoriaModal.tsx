import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import { useModal } from "../../hooks/modal";
import type { Categoria, CategoriaInput } from "../../types/categoria";
import Input from "../ui/input";
import Label from "../ui/label";
import { Modal } from "../ui/modal";
import { useCreateCategoria, useUpdateCategoria } from "../../hooks/categorias";
import ActionButton from "../ui/action-button";

type Props = {
  categoria?: Categoria;
};

const CategoriaModal = ({ categoria }: Props) => {
  const { abierto, abrir, cerrar } = useModal();
  const [error, setError] = useState<string | undefined>("");
  const [loading, setLoading] = useState<boolean>(false);

  const initialValues = {
    nombre: categoria ? categoria.nombre : "",
    descripcion: categoria ? categoria.descripcion : "",
  };
  const [categoriaInput, setCategoriaInput] =
    useState<CategoriaInput>(initialValues);

  const {
    submit: submitCreate,
    error: errorCreate,
    loading: loadingCreate,
  } = useCreateCategoria();

  const {
    submit: submitUpdate,
    error: errorUpdate,
    loading: loadingUpdate,
  } = useUpdateCategoria();

  const handleUpdate = async (id: number) => {
    setLoading(loadingUpdate);
    await submitUpdate(id, {
      nombre: categoriaInput.nombre,
      descripcion: categoriaInput.descripcion,
    });
    setError(errorUpdate);
  };

  const handleCreate = async () => {
    setLoading(loadingCreate);
    await submitCreate(categoriaInput);
    setError(errorCreate);
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (categoria) await handleUpdate(categoria.id);
    else await handleCreate();

    cerrar();
    setCategoriaInput(initialValues);
    setError("");
  };

  const handleCancel = () => {
    cerrar();
    setCategoriaInput(initialValues);
    setError("");
  };

  return (
    <>
      <ActionButton onClick={abrir}>
        {categoria ? "Editar" : "+ Añadir Categoría"}
      </ActionButton>

      <Modal abierto={abierto} onCerrar={handleCancel}>
        <div className="flex justify-between p-2 px-4 min-w-xl">
          <h2 className="font-bold">
            {categoria ? "Editar Categoría" : "Añadir Categoría"}
          </h2>

          <ActionButton onClick={cerrar} variant="ghost">
            X
          </ActionButton>
        </div>
        <form className="p-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-y-4 mb-4">
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                name="nombre"
                className="w-full"
                value={categoriaInput.nombre}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setCategoriaInput({
                    ...categoriaInput,
                    [e.target.name]: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <Input
                id="descripcion"
                name="descripcion"
                className="w-full"
                value={categoriaInput.descripcion}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setCategoriaInput({
                    ...categoriaInput,
                    [e.target.name]: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="flex gap-x-2 justify-end">
            <ActionButton onClick={handleCancel} variant="secondary">
              Cancelar
            </ActionButton>
            <Input
              type="submit"
              value={categoria ? "Actualizar" : "Guardar"}
              disabled={loading}
            />
          </div>
        </form>
        {error && <span className="text-red-500">{error}</span>}
      </Modal>
    </>
  );
};

export default CategoriaModal;
