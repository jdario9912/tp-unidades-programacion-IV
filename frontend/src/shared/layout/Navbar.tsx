import { useMatch } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { useCartStore } from "@/store/cartStore";
import ThemeToggle from "@/shared/components/ThemeToggle";
import ActionButton from "@/shared/ui/action-button";
import LinkButton from "@/shared/ui/link-button";

type Enlace = { to: string; label: string };

const ENLACES_ADMIN: Enlace[] = [
  { to: "/admin/resumen", label: "Resumen" },
  { to: "/admin/pedidos", label: "Pedidos" },
  { to: "/admin/productos", label: "Productos" },
  { to: "/admin/categorias", label: "Categorías" },
  { to: "/admin/usuarios", label: "Usuarios" },
];

const NavLink = ({ to, label }: Enlace) => {
  const activo = useMatch(`${to}/*`);

  return (
    <li>
      <LinkButton to={to} variant={activo ? "outline" : "ghost"}>
        {label}
      </LinkButton>
    </li>
  );
};

const Navbar = () => {
  const { usuario, esAdmin, logout } = useAuth();
  const enLogin = useMatch("/login");
  const enRegister = useMatch("/register");
  const enCarrito = useMatch("/carrito");
  const cantidad = useCartStore((s) =>
    s.items.reduce((suma, i) => suma + i.cantidad, 0),
  );

  return (
    <header className="border-b border-divider px-4 md:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-x-2">
          <LinkButton to="/" className="p-0">
            <div className="p-4">
              <h1 className="font-semibold">Food Store</h1>
            </div>
          </LinkButton>
          {usuario && (
            <span className="text-sm">
              {usuario.full_name}
              <span className="ml-2 rounded border border-divider px-1.5 py-0.5 text-xs">
                {usuario.role}
              </span>
            </span>
          )}
        </div>
        <nav className="flex flex-wrap items-center gap-x-2">
          <ul className="flex flex-wrap">
            <NavLink to="/" label="Catálogo" />
            {usuario && <NavLink to="/mis-pedidos" label="Mis pedidos" />}
            <li>
              <LinkButton
                to="/carrito"
                variant={enCarrito ? "outline" : "ghost"}
              >
                Carrito{cantidad > 0 && ` (${cantidad})`}
              </LinkButton>
            </li>
          </ul>
          <ThemeToggle />
          {usuario ? (
            <ActionButton variant="secondary" onClick={logout}>
              Cerrar sesión
            </ActionButton>
          ) : (
            <>
              {!enLogin && (
                <LinkButton to="/login" variant="primary">
                  Iniciar sesión
                </LinkButton>
              )}
              {!enRegister && (
                <LinkButton to="/register" variant="outline">
                  Registrarse
                </LinkButton>
              )}
            </>
          )}
        </nav>
      </div>
      {/* acceso al panel solo para admin; ocultarlo no reemplaza a require_role */}
      {esAdmin && (
        <nav aria-label="Panel de administración" className="pb-2">
          <ul className="flex flex-wrap items-center gap-x-1 text-sm">
            <li className="pr-2 text-xs font-semibold uppercase text-muted">
              Panel
            </li>
            {ENLACES_ADMIN.map((enlace) => (
              <NavLink key={enlace.to} {...enlace} />
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
