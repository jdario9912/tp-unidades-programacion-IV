import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthChecking, useUsuario } from "@/features/auth";
import Spinner from "@/shared/components/ui/spinner";

type Props = {
  allowedRoles?: string[];
};

const ProtectedRoute = ({ allowedRoles }: Props) => {
  const usuario = useUsuario();
  const checking = useAuthChecking();
  const location = useLocation();

  // mientras /auth/me no responde no se sabe si hay sesión: no se redirige
  if (checking)
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );

  if (!usuario)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  // sin allowedRoles alcanza con tener sesión
  if (allowedRoles && !allowedRoles.some((rol) => usuario.roles.includes(rol)))
    return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
