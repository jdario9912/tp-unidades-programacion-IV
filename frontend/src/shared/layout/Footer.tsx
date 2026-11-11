const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 dark:bg-gray-950 text-white text-center p-4">
      <p>&copy; {year}. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;
