const Navbar = () => {
  return (
    <nav>
      <ul className="flex space-x-4 py-4">
        <li>
          <a href="/">Inicio</a>
        </li>
        <li>
          <a href="/#">Productos</a>
        </li>
        <li>
          <a href="/#">Contacto</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
