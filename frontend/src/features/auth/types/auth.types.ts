export type UsuarioAuth = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  roles: string[];
};

export type UsuarioRegister = {
  nombre: string;
  apellido: string;
  email: string;
  celular?: string;
  password: string;
};

export type UsuarioAdmin = UsuarioAuth & {
  activo: boolean;
  deleted_at: string | null;
};
