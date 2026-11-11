import type { ChangeEvent, SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useRegister } from "@/features/auth/hooks/useAuth";
import Label from "@/shared/ui/label";
import Input from "@/shared/ui/input";
import FieldError from "@/shared/ui/field-error";
import CardError from "@/shared/ui/card-error";
import { validarEmail } from "@/shared/utils/validaciones";
import type { UsuarioRegister } from "@/features/auth/types/auth.types";

// los límites coinciden con UserCreate del backend
const validarUsername = ({ value }: { value: string }) => {
  const username = value.trim();

  if (!username) return "El usuario es obligatorio";
  if (username.length < 3) return "El usuario debe tener al menos 3 caracteres";
  if (username.length > 50)
    return "El usuario no puede superar los 50 caracteres";
  if (/\s/.test(username)) return "El usuario no puede tener espacios";

  return undefined;
};

const validarFullName = ({ value }: { value: string }) => {
  const nombre = value.trim();

  if (!nombre) return "El nombre es obligatorio";
  if (nombre.length > 100)
    return "El nombre no puede superar los 100 caracteres";

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

type Campo = keyof UsuarioRegister;

type CampoConfig = {
  name: Campo;
  label: string;
  type: string;
  autoComplete: string;
  validar: (props: { value: string }) => string | undefined;
};

const CAMPOS: CampoConfig[] = [
  {
    name: "username",
    label: "Usuario",
    type: "text",
    autoComplete: "username",
    validar: validarUsername,
  },
  {
    name: "full_name",
    label: "Nombre completo",
    type: "text",
    autoComplete: "name",
    validar: validarFullName,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    autoComplete: "email",
    validar: validarEmail,
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
      username: "",
      full_name: "",
      email: "",
      password: "",
    },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      const ok = await submit({
        username: value.username.trim(),
        full_name: value.full_name.trim(),
        email: value.email.trim(),
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
