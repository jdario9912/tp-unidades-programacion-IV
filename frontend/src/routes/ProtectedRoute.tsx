import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthCargando, useUsuario, type Rol } from "@/features/auth";
import Spinner from "@/shared/ui/spinner";

type Props = {
  allowedRoles?: Rol[];
};

// solo decide qué pantalla mostrar: la protección real es require_role en el backend
const ProtectedRoute = ({ allowedRoles }: Props) => {
  const usuario = useUsuario();
  const cargando = useAuthCargando();
  const location = useLocation();

  // mientras /auth/me no responde no se sabe si la sesión sigue viva: no se redirige
  if (cargando)
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );

  if (!usuario)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  // sin allowedRoles alcanza con tener sesión
  if (allowedRoles && !allowedRoles.includes(usuario.role))
    return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
