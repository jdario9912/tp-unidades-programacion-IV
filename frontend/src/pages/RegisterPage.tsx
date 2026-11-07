import { Navigate } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";
import LinkButton from "../components/ui/link-button";
import { useUsuario } from "../hooks/auth";

const RegisterPage = () => {
  const usuario = useUsuario();

  if (usuario) return <Navigate to="/" replace />;

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-sm border border-divider rounded mt-8">
        <h2 className="text-2xl font-bold text-primary px-4 pt-4">
          Crear cuenta
        </h2>
        <RegisterForm />
        <p className="text-sm text-center px-4 pb-4">
          ¿Ya tenés cuenta?
          <LinkButton to="/login" className="px-2 text-primary">
            Iniciar sesión
          </LinkButton>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
