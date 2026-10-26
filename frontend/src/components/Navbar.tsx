import { useMatch } from "react-router-dom";
import LinkButton from "./ui/link-button";

const Navbar = () => {
  const enProductos = useMatch("/productos/*");
  const enCategorias = useMatch("/categorias/*");

  return (
    <header className="flex justify-between items-center border-b border-divider px-4 md:px-6 lg:px-8">
      <LinkButton to="/" className="p-0">
        <div className="p-4">
          <h1 className="font-semibold">Food Store</h1>
        </div>
      </LinkButton>
      <nav>
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
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
