import { Navigate, useLocation } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import LinkButton from "../components/ui/link-button";
import { useUsuario } from "../hooks/auth";

type LocationState = { from?: string; registrado?: boolean } | null;

const LoginPage = () => {
  const usuario = useUsuario();
  const location = useLocation();
  const state = location.state as LocationState;
  // ProtectedRoute guarda la ruta que se quiso visitar para volver después del login
  const destino = state?.from ?? "/";

  if (usuario) return <Navigate to={destino} replace />;

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-sm border border-divider rounded mt-8">
        <h2 className="text-2xl font-bold text-primary px-4 pt-4">
          Iniciar sesión
        </h2>
        {/* RegisterForm redirige acá con este flag al crear la cuenta */}
        {state?.registrado && (
          <p
            role="status"
            className="bg-success/10 text-success text-sm rounded px-3 py-2 mx-4 mt-4"
          >
            Cuenta creada, iniciá sesión
          </p>
        )}
        <LoginForm />
        <p className="text-sm text-center px-4 pb-4">
          ¿No tenés cuenta?
          <LinkButton to="/register" className="px-2 text-primary">
            Registrarse
          </LinkButton>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
