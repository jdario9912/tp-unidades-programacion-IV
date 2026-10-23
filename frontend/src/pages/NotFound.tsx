import LinkButton from "../components/ui/link-button";

const NotFound = () => {
  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="mx-auto text-center">
        <h1 className="text-xl mb-4">Página no encontrada</h1>
        <LinkButton to="/" variant="primary">
          Inicio
        </LinkButton>
      </div>
    </div>
  );
};

export default NotFound;
