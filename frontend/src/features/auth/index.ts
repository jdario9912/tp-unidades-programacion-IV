// API pública de la feature auth: el resto de la app importa solo desde acá
export { default as LoginPage } from "./pages/LoginPage";
export { default as RegisterPage } from "./pages/RegisterPage";
export { default as UnauthorizedPage } from "./pages/UnauthorizedPage";
export {
  useAuth,
  useAuthCargando,
  useCheckSession,
  useEsAdmin,
  useLogin,
  useLogout,
  useUsuario,
} from "./hooks/useAuth";
export type { Rol, Usuario, UsuarioRegister } from "./types/auth.types";
