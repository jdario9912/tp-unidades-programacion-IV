import { useMatch } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useLogout, useUsuario } from "../hooks/auth";
import ActionButton from "./ui/action-button";
import LinkButton from "./ui/link-button";

const Navbar = () => {
  const enProductos = useMatch("/products/*");
  const enCategorias = useMatch("/categories/*");
  const enIngredientes = useMatch("/ingredients/*");
  const enLogin = useMatch("/login");
  const enRegister = useMatch("/register");

  const usuario = useUsuario();
  const logout = useLogout();
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
            <span className="ml-2 rounded border border-divider px-1.5 py-0.5 text-xs">
              {usuario.roles.join(", ")}
            </span>
          </span>
        )}
      </div>
      {usuario ? (
        <nav className="flex items-center gap-x-2">
          <ul className="flex">
            <li>
              <LinkButton
                to="/products"
                variant={enProductos ? "outline" : "ghost"}
              >
                Productos
              </LinkButton>
            </li>
            <li>
              <LinkButton
                to="/categories"
                variant={enCategorias ? "outline" : "ghost"}
              >
                Categorias
              </LinkButton>
            </li>
            <li>
              <LinkButton
                to="/ingredients"
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
        !enLogin &&
        !enRegister && (
          <LinkButton to="/login" variant="outline">
            Iniciar sesión
          </LinkButton>
        )
      )}
    </header>
  );
};

export default Navbar;
