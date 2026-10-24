import LinkButton from "./ui/link-button";

const Navbar = () => {
  return (
    <header className="flex justify-between items-center border-b border-divider">
      <LinkButton to="/" className="p-0">
        <div className="p-4">
          <h1 className="font-semibold">Food Store</h1>
        </div>
      </LinkButton>
      <nav>
        <ul className="flex">
          <li>
            <LinkButton to="/productos">Productos</LinkButton>
          </li>
          <li>
            <LinkButton to="/categorias">Categorias</LinkButton>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
