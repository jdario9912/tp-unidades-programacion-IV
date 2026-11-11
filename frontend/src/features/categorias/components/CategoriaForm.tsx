import type { ChangeEvent, SyntheticEvent } from "react";
import { useCreateCategoria, useUpdateCategoria } from "@/features/categorias/hooks/useCategorias";
import type { Categoria } from "@/features/categorias/types/categoria";
import Label from "@/shared/ui/label";
import Input from "@/shared/ui/input";
import ActionButton from "@/shared/ui/action-button";
import FieldError from "@/shared/ui/field-error";
import CardError from "@/shared/ui/card-error";
import { revalidateLogic, useForm } from "@tanstack/react-form";

type Props = {
  categoria?: Categoria;
  cerrar: () => void;
};

const validarNombre = ({ value }: { value: string }) => {
  const nombre = value.trim();

  if (!nombre) return "El nombre es obligatorio";
  if (nombre.length < 2) return "El nombre debe tener al menos 2 caracteres";
  if (nombre.length > 100)
    return "El nombre no puede superar los 100 caracteres";

  return undefined;
};

const validarDescripcion = ({ value }: { value: string }) => {
  const descripcion = value.trim();

  if (descripcion && descripcion.length < 3)
    return "La descripción debe tener al menos 3 caracteres";
  if (descripcion.length > 255)
    return "La descripción no puede superar los 255 caracteres";

  return undefined;
};

const CategoriaForm = ({ categoria, cerrar }: Props) => {
  const initialValues = {
    nombre: categoria ? categoria.nombre : "",
    descripcion: categoria?.descripcion ?? "",
  };

  const { submit: submitCreate, error: errorCreate } = useCreateCategoria();
  const { submit: submitUpdate, error: errorUpdate } = useUpdateCategoria();

  const serverError = categoria ? errorUpdate : errorCreate;

  const form = useForm({
    defaultValues: initialValues,
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      const descripcion = value.descripcion.trim();
      const input = {
        nombre: value.nombre.trim(),
        // vacía se guarda como null
        descripcion: descripcion || null,
      };

      const ok = categoria
        ? await submitUpdate(categoria.id, input)
        : await submitCreate(input);

      if (ok) cerrar();
    },
  });

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  return (
    <form className="p-4" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-y-4 mb-4">
        <div>
          <form.Field name="nombre" validators={{ onDynamic: validarNombre }}>
            {(f) => (
              <>
                <Label htmlFor={f.name}>Nombre</Label>
                <Input
                  id={f.name}
                  name={f.name}
                  className="w-full first-letter:capitalize"
                  value={f.state.value}
                  onBlur={f.handleBlur}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    f.handleChange(e.target.value)
                  }
                />
                {f.state.meta.errors.map((err) => (
                  <FieldError key={String(err)} className="mt-1.5">
                    {String(err)}
                  </FieldError>
                ))}
              </>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field
            name="descripcion"
            validators={{ onDynamic: validarDescripcion }}
          >
            {(f) => (
              <>
                <Label htmlFor={f.name}>Descripción</Label>
                <Input
                  id={f.name}
                  name={f.name}
                  className="w-full first-letter:capitalize"
                  value={f.state.value}
                  onBlur={f.handleBlur}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    f.handleChange(e.target.value)
                  }
                />
                {f.state.meta.errors.map((err) => (
                  <FieldError key={String(err)} className="mt-1.5">
                    {String(err)}
                  </FieldError>
                ))}
              </>
            )}
          </form.Field>
        </div>
      </div>
      <div className="flex gap-x-2 justify-end">
        <ActionButton onClick={cerrar} variant="secondary">
          Cancelar
        </ActionButton>
        <form.Subscribe
          selector={(s) => [s.canSubmit, s.isSubmitting] as const}
        >
          {([canSubmit, isSubmitting]) => (
            <Input
              type="submit"
              value={
                isSubmitting
                  ? "Guardando…"
                  : categoria
                    ? "Actualizar"
                    : "Guardar"
              }
              disabled={!canSubmit || isSubmitting}
            />
          )}
        </form.Subscribe>
      </div>
      {serverError && <CardError className="mt-2">{serverError}</CardError>}
    </form>
  );
};

export default CategoriaForm;
