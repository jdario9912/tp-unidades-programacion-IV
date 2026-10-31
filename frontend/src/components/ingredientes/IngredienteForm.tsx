import type { ChangeEvent, SyntheticEvent } from "react";
import {
  useCreateIngrediente,
  useUpdateIngrediente,
} from "../../hooks/ingredientes";
import type { Ingrediente } from "../../types/ingrediente";
import Label from "../ui/label";
import Input from "../ui/input";
import ActionButton from "../ui/action-button";
import FieldError from "../ui/field-error";
import CardError from "../ui/card-error";
import { revalidateLogic, useForm } from "@tanstack/react-form";

type Props = {
  ingrediente?: Ingrediente;
  cerrar: () => void;
};

const validarNombre = ({ value }: { value: string }) => {
  const nombre = value.trim();

  if (!nombre) return "El nombre es obligatorio";
  if (nombre.length < 3) return "El nombre debe tener al menos 3 caracteres";
  if (nombre.length > 50) return "El nombre no puede superar los 50 caracteres";

  return undefined;
};

const IngredienteForm = ({ ingrediente, cerrar }: Props) => {
  const initialValues = {
    nombre: ingrediente ? ingrediente.nombre : "",
  };

  const { submit: submitCreate, error: errorCreate } = useCreateIngrediente();
  const { submit: submitUpdate, error: errorUpdate } = useUpdateIngrediente();

  const serverError = ingrediente ? errorUpdate : errorCreate;

  const form = useForm({
    defaultValues: initialValues,
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      const input = {
        nombre: value.nombre.trim(),
      };

      try {
        if (ingrediente) await submitUpdate(ingrediente.id, input);
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
                  : ingrediente
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

export default IngredienteForm;
