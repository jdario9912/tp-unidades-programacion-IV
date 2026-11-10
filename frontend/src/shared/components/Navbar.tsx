import { useMatch } from "react-router-dom";
import { useAuth } from "@/features/auth";
import ActionButton from "@/shared/components/ui/action-button";
import LinkButton from "@/shared/components/ui/link-button";

const Navbar = () => {
  const enProductos = useMatch("/products/*");
  const enCategorias = useMatch("/categories/*");
  const enIngredientes = useMatch("/ingredients/*");
  const enUsuarios = useMatch("/admin/users/*");
  const enLogin = useMatch("/login");
  const enRegister = useMatch("/register");

  const { usuario, esAdmin, logout } = useAuth();

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
            {esAdmin && (
              <li>
                <LinkButton
                  to="/admin/users"
                  variant={enUsuarios ? "outline" : "ghost"}
                >
                  Usuarios
                </LinkButton>
              </li>
            )}
          </ul>
          <ActionButton variant="primary" onClick={logout}>
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
