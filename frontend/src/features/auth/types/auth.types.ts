export type Rol = "user" | "admin";

// mismos campos que UserPublic del backend
export interface Usuario {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: Rol;
  disabled: boolean;
  created_at: string;
}

export interface UsuarioRegister {
  username: string;
  full_name: string;
  email: string;
  password: string;
}

export interface MensajeResponse {
  message: string;
}
