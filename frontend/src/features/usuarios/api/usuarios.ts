import type { Usuario } from "@/features/usuarios/types/usuario";
import { get, post } from "@/shared/api/client";
import { paths } from "@/shared/api/constantes";

const URL_USUARIOS = `/${paths.usuarios}`;

export const handleGetUsuarios = async () => {
  return get<Usuario[]>(URL_USUARIOS);
};

export const handleActivarUsuario = async (id: number) => {
  return post<Record<string, never>, Usuario>(
    `${URL_USUARIOS}/${id}/activar`,
    {},
  );
};

export const handleDesactivarUsuario = async (id: number) => {
  return post<Record<string, never>, Usuario>(
    `${URL_USUARIOS}/${id}/desactivar`,
    {},
  );
};
