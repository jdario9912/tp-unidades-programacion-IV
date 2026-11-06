import { useMatch } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import ActionButton from "./ui/action-button";
import LinkButton from "./ui/link-button";

const Navbar = () => {
  const enProductos = useMatch("/productos/*");
  const enCategorias = useMatch("/categorias/*");
  const enIngredientes = useMatch("/ingredientes/*");
  const enLogin = useMatch("/login");

  const usuario = useAuthStore((s) => s.usuario);
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  // ProtectedRoute redirige al login cuando usuario pasa a null
  const handleLogout = async () => {
    await logout();
    queryClient.clear();
  };

  return (
    <header className="flex justify-between items-center border-b border-divider px-4 md:px-6 lg:px-8">
      <div className="flex items-center gap-x-2">
        <LinkButton to="/" className="p-0">
          <div className="p-4">
            <h1 className="font-semibold">Food Store</h1>
          </div>
        </LinkButton>
        {usuario && (
          <span className="text-sm">
            {usuario.nombre} {usuario.apellido}
          </span>
        )}
      </div>
      {usuario ? (
        <nav className="flex items-center gap-x-2">
          <ul className="flex">
            <li>
              <LinkButton
                to="/productos"
                variant={enProductos ? "outline" : "ghost"}
              >
                Productos
              </LinkButton>
            </li>
            <li>
              <LinkButton
                to="/categorias"
                variant={enCategorias ? "outline" : "ghost"}
              >
                Categorias
              </LinkButton>
            </li>
            <li>
              <LinkButton
                to="/ingredientes"
                variant={enIngredientes ? "outline" : "ghost"}
              >
                Ingredientes
              </LinkButton>
            </li>
          </ul>
          <ActionButton variant="primary" onClick={handleLogout}>
            Cerrar sesión
          </ActionButton>
        </nav>
      ) : (
        !enLogin && (
          <LinkButton to="/login" variant="outline">
            Iniciar sesión
          </LinkButton>
        )
      )}
    </header>
  );
};

export default Navbar;
