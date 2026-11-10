// API pública de la feature auth: el resto de la app importa solo desde acá
export { default as LoginPage } from "./pages/LoginPage";
export { default as RegisterPage } from "./pages/RegisterPage";
export { default as AdminUsersPage } from "./pages/AdminUsersPage";
export { useAuthStore } from "./store/authStore";
export {
  useAuthChecking,
  useCheckAuth,
  useEsAdmin,
  useLogin,
  useLogout,
  useUsuario,
} from "./hooks/useAuth";
export type {
  UsuarioAdmin,
  UsuarioAuth,
  UsuarioRegister,
} from "./types/auth.types";
