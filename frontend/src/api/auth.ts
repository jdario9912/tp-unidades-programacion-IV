import type { UsuarioAuth, UsuarioRegister } from "../types/auth.types";
import { get, post } from "./client";
import { paths } from "./constantes";

const URL_AUTH = `/${paths.auth}`;

type LoginResponse = { details: string };

export const handleLogin = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const input = { email, password };
  try {
    return await post<typeof input, LoginResponse>(`${URL_AUTH}/token`, input);
  } catch (error) {
    throw error;
  }
};

export const handleMe = async (): Promise<UsuarioAuth> => {
  try {
    return await get<UsuarioAuth>(`${URL_AUTH}/me`);
  } catch (error) {
    throw error;
  }
};

export const handleRegister = async (
  input: UsuarioRegister,
): Promise<UsuarioAuth> => {
  try {
    return await post<UsuarioRegister, UsuarioAuth>(
      `${URL_AUTH}/register`,
      input,
    );
  } catch (error) {
    throw error;
  }
};

export const handleLogout = async (): Promise<void> => {
  try {
    return await post<{}, void>(`${URL_AUTH}/register`, {});
  } catch (error) {
    throw error;
  }
};
