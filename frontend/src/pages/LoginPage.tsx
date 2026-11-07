import { Navigate, useLocation } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import { useUsuario } from "../hooks/auth";

type LocationState = { from?: string } | null;

const LoginPage = () => {
  const usuario = useUsuario();
  const location = useLocation();
  // ProtectedRoute guarda la ruta que se quiso visitar para volver después del login
  const destino = (location.state as LocationState)?.from ?? "/";

  if (usuario) return <Navigate to={destino} replace />;

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-sm border border-divider rounded mt-8">
        <h2 className="text-2xl font-bold text-primary px-4 pt-4">
          Iniciar sesión
        </h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
