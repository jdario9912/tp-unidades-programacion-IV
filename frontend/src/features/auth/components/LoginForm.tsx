import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useLogin } from "@/features/auth/hooks/useAuth";
import Label from "@/shared/ui/label";
import Input from "@/shared/ui/input";
import FieldError from "@/shared/ui/field-error";
import CardError from "@/shared/ui/card-error";

const validarUsername = ({ value }: { value: string }) => {
  if (!value.trim()) return "El usuario es obligatorio";

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
    defaultValues: { username: "", password: "" },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      setServerError(undefined);

      // al cargarse el usuario en el store, LoginPage redirige solo
      try {
        await login(value.username.trim(), value.password);
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
          <form.Field
            name="username"
            validators={{ onDynamic: validarUsername }}
          >
            {(f) => (
              <>
                <Label htmlFor={f.name}>Usuario</Label>
                <Input
                  id={f.name}
                  name={f.name}
                  autoComplete="username"
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
