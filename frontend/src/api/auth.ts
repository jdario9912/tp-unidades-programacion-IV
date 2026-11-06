import type { UsuarioAuth, UsuarioRegister } from "../types/auth.types";
import { get, post } from "./client";
import { paths } from "./constantes";

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
