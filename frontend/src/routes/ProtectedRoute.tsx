import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthLoading, useUsuario } from "@/features/auth";
import Spinner from "@/shared/components/ui/spinner";

type Props = {
  allowedRoles?: string[];
};

const ProtectedRoute = ({ allowedRoles }: Props) => {
  const usuario = useUsuario();
  const loading = useAuthLoading();
  const location = useLocation();

  // con un usuario persistido se renderiza enseguida mientras checkSession
  // confirma la sesión; si falla, usuario pasa a null y se redirige
  if (!usuario && loading)
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
