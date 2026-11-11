import type {
  MensajeResponse,
  Usuario,
  UsuarioRegister,
} from "@/features/auth/types/auth.types";
import { get, post } from "@/shared/api/client";
import { paths } from "@/shared/api/constantes";

const URL_AUTH = `/${paths.auth}`;

export const handleLogin = async (
  username: string,
  password: string,
): Promise<MensajeResponse> => {
  // el backend usa OAuth2PasswordRequestForm: form-urlencoded con username y password
  const input = new URLSearchParams({ username, password });
  return post<URLSearchParams, MensajeResponse>(`${URL_AUTH}/token`, input);
};

export const handleMe = async (): Promise<Usuario> => {
  return get<Usuario>(`${URL_AUTH}/me`);
};

export const handleRegister = async (
  input: UsuarioRegister,
): Promise<Usuario> => {
  return post<UsuarioRegister, Usuario>(`${URL_AUTH}/register`, input);
};

export const handleLogout = async (): Promise<MensajeResponse> => {
  return post<Record<string, never>, MensajeResponse>(`${URL_AUTH}/logout`, {});
};
