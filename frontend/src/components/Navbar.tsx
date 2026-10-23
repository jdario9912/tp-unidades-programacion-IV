import LinkButton from "./ui/link-button";

const Navbar = () => {
  return (
    <header className="flex justify-between p-4 border-b border-divider">
      <div>
        <h1 className="font-semibold">Food Store</h1>
      </div>
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
