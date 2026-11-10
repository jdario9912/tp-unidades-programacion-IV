import type { ChangeEvent, SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useRegister } from "@/features/auth/hooks/useAuth";
import Label from "@/shared/components/ui/label";
import Input from "@/shared/components/ui/input";
import FieldError from "@/shared/components/ui/field-error";
import CardError from "@/shared/components/ui/card-error";
import { validarEmail } from "@/shared/utils/validaciones";

// los límites coinciden con UserCreate del backend
const validarNombre =
  (campo: string) =>
  ({ value }: { value: string }) => {
    const nombre = value.trim();

    if (!nombre) return `El ${campo} es obligatorio`;
    if (nombre.length > 80)
      return `El ${campo} no puede superar los 80 caracteres`;

    return undefined;
  };

const validarCelular = ({ value }: { value: string }) => {
  if (value.trim().length > 20)
    return "El celular no puede superar los 20 caracteres";

  return undefined;
};

const validarPassword = ({ value }: { value: string }) => {
  if (!value) return "La contraseña es obligatoria";
  if (value.length < 8)
    return "La contraseña debe tener al menos 8 caracteres";
  if (value.length > 72)
    return "La contraseña no puede superar los 72 caracteres";

  return undefined;
};

type Campo = "nombre" | "apellido" | "email" | "celular" | "password";

type CampoConfig = {
  name: Campo;
  label: string;
  type: string;
  autoComplete: string;
  validar: (props: { value: string }) => string | undefined;
};

const CAMPOS: CampoConfig[] = [
  {
    name: "nombre",
    label: "Nombre",
    type: "text",
    autoComplete: "given-name",
    validar: validarNombre("nombre"),
  },
  {
    name: "apellido",
    label: "Apellido",
    type: "text",
    autoComplete: "family-name",
    validar: validarNombre("apellido"),
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    autoComplete: "email",
    validar: validarEmail,
  },
  {
    name: "celular",
    label: "Celular (opcional)",
    type: "tel",
    autoComplete: "tel",
    validar: validarCelular,
  },
  {
    name: "password",
    label: "Contraseña",
    type: "password",
    autoComplete: "new-password",
    validar: validarPassword,
  },
];

const RegisterForm = () => {
  const navigate = useNavigate();
  const { submit, error: serverError } = useRegister();

  const form = useForm({
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      celular: "",
      password: "",
    },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      const celular = value.celular.trim();
      const ok = await submit({
        nombre: value.nombre.trim(),
        apellido: value.apellido.trim(),
        email: value.email.trim(),
        // el celular vacío no se manda: el backend lo guarda como null
        ...(celular && { celular }),
        password: value.password,
      });

      if (ok) navigate("/login", { replace: true, state: { registrado: true } });
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
        {CAMPOS.map((campo) => (
          <div key={campo.name}>
            <form.Field
              name={campo.name}
              validators={{ onDynamic: campo.validar }}
            >
              {(f) => (
                <>
                  <Label htmlFor={f.name}>{campo.label}</Label>
                  <Input
                    id={f.name}
                    name={f.name}
                    type={campo.type}
                    autoComplete={campo.autoComplete}
                    className="w-full"
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
        ))}
      </div>
      <div className="flex justify-end">
        <form.Subscribe
          selector={(s) => [s.canSubmit, s.isSubmitting] as const}
        >
          {([canSubmit, isSubmitting]) => (
            <Input
              type="submit"
              className="w-full"
              value={isSubmitting ? "Registrando…" : "Crear cuenta"}
              disabled={!canSubmit || isSubmitting}
            />
          )}
        </form.Subscribe>
      </div>
      {serverError && <CardError className="mt-2">{serverError}</CardError>}
    </form>
  );
};

export default RegisterForm;
