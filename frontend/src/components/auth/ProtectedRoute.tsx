import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthLoading, useUsuario } from "../../hooks/auth";
import Spinner from "../ui/spinner";

const ProtectedRoute = () => {
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

  return <Outlet />;
};

export default ProtectedRoute;
