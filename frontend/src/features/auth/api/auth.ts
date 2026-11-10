import type {
  UsuarioAdmin,
  UsuarioAuth,
  UsuarioRegister,
} from "@/features/auth/types/auth.types";
import { get, post } from "@/shared/api/client";
import { paths } from "@/shared/api/constantes";

const URL_AUTH = `/${paths.auth}`;

type LoginResponse = { detail: string };

export const handleLogin = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  // el backend usa OAuth2PasswordRequestForm: form-urlencoded con el email en username
  const input = new URLSearchParams({ username: email, password });
  return post<URLSearchParams, LoginResponse>(`${URL_AUTH}/token`, input);
};

export const handleMe = async (): Promise<UsuarioAuth> => {
  return get<UsuarioAuth>(`${URL_AUTH}/me`);
};

export const handleRegister = async (
  input: UsuarioRegister,
): Promise<UsuarioAuth> => {
  return post<UsuarioRegister, UsuarioAuth>(`${URL_AUTH}/register`, input);
};

export const handleLogout = async (): Promise<void> => {
  return post<Record<string, never>, void>(`${URL_AUTH}/logout`, {});
};

export const handleGetUsuarios = async (search = "") => {
  // incluye a los desactivados para poder volver a activarlos
  const params = new URLSearchParams({
    limit: "50",
    incluir_inactivos: "true",
  });
  if (search) params.set("search", search);

  return get<UsuarioAdmin[]>(`${URL_AUTH}/admin/usuarios?${params}`);
};

export const handleActivarUsuario = async (id: number) => {
  return post<Record<string, never>, UsuarioAdmin>(
    `${URL_AUTH}/admin/usuarios/${id}/activar`,
    {},
  );
};

export const handleDesactivarUsuario = async (id: number) => {
  return post<Record<string, never>, UsuarioAdmin>(
    `${URL_AUTH}/admin/usuarios/${id}/desactivar`,
    {},
  );
};
