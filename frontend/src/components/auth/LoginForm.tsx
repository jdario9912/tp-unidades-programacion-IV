import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useLogin } from "../../hooks/auth";
import Label from "../ui/label";
import Input from "../ui/input";
import FieldError from "../ui/field-error";
import CardError from "../ui/card-error";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validarEmail = ({ value }: { value: string }) => {
  const email = value.trim();

  if (!email) return "El email es obligatorio";
  if (!EMAIL_REGEX.test(email)) return "El email no es válido";

  return undefined;
};

const validarPassword = ({ value }: { value: string }) => {
  if (!value) return "La contraseña es obligatoria";

  return undefined;
};

const LoginForm = () => {
  const login = useLogin();
  // login no es una mutation de react-query, el error del servidor se guarda acá
  const [serverError, setServerError] = useState<string>();

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      setServerError(undefined);

      // al cargarse el usuario en el store, LoginPage redirige solo
      try {
        await login(value.email.trim(), value.password);
      } catch (error) {
        setServerError(error instanceof Error ? error.message : String(error));
      }
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
          <form.Field name="email" validators={{ onDynamic: validarEmail }}>
            {(f) => (
              <>
                <Label htmlFor={f.name}>Email</Label>
                <Input
                  id={f.name}
                  name={f.name}
                  type="email"
                  autoComplete="email"
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

        <div>
          <form.Field
            name="password"
            validators={{ onDynamic: validarPassword }}
          >
            {(f) => (
              <>
                <Label htmlFor={f.name}>Contraseña</Label>
                <Input
                  id={f.name}
                  name={f.name}
                  type="password"
                  autoComplete="current-password"
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
      </div>
      <div className="flex justify-end">
        <form.Subscribe
          selector={(s) => [s.canSubmit, s.isSubmitting] as const}
        >
          {([canSubmit, isSubmitting]) => (
            <Input
              type="submit"
              className="w-full"
              value={isSubmitting ? "Ingresando…" : "Iniciar sesión"}
              disabled={!canSubmit || isSubmitting}
            />
          )}
        </form.Subscribe>
      </div>
      {serverError && <CardError className="mt-2">{serverError}</CardError>}
    </form>
  );
};

export default LoginForm;
