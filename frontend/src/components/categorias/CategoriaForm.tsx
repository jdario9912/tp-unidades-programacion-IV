import type { ChangeEvent, SyntheticEvent } from "react";
import { useCreateCategoria, useUpdateCategoria } from "../../hooks/categorias";
import type { Categoria } from "../../types/categoria";
import Label from "../ui/label";
import Input from "../ui/input";
import ActionButton from "../ui/action-button";
import { revalidateLogic, useForm } from "@tanstack/react-form";

type Props = {
  categoria?: Categoria;
  cerrar: () => void;
};

const validarNombre = ({ value }: { value: string }) => {
  const nombre = value.trim();

  if (!nombre) return "El nombre es obligatorio";
  if (nombre.length < 3) return "El nombre debe tener al menos 3 caracteres";
  if (nombre.length > 50) return "El nombre no puede superar los 50 caracteres";

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

const FieldError = ({ errors }: { errors: unknown[] }) =>
  errors.map((err) => (
    <p key={String(err)} className="text-destructive text-xs mt-1.5">
      {String(err)}
    </p>
  ));

const CategoriaForm = ({ categoria, cerrar }: Props) => {
  const initialValues = {
    nombre: categoria ? categoria.nombre : "",
    descripcion: categoria ? categoria.descripcion : "",
  };

  const { submit: submitCreate, error: errorCreate } = useCreateCategoria();
  const { submit: submitUpdate, error: errorUpdate } = useUpdateCategoria();

  const serverError = categoria ? errorUpdate : errorCreate;

  const form = useForm({
    defaultValues: initialValues,
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      const input = {
        nombre: value.nombre.trim(),
        descripcion: value.descripcion.trim(),
      };

      try {
        if (categoria) await submitUpdate(categoria.id, input);
        else await submitCreate(input);
      } catch {
        return;
      }

      cerrar();
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
                <FieldError errors={f.state.meta.errors} />
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
                <FieldError errors={f.state.meta.errors} />
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
              value={categoria ? "Actualizar" : "Guardar"}
              disabled={!canSubmit || isSubmitting}
            />
          )}
        </form.Subscribe>
      </div>
      {serverError && (
        <p className="text-destructive text-sm mt-2">{serverError}</p>
      )}
    </form>
  );
};

export default CategoriaForm;
