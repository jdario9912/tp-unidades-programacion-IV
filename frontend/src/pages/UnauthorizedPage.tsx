import LinkButton from "../components/ui/link-button";

const UnauthorizedPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="mx-auto text-center">
        <h2 className="text-xl mb-2">Acceso denegado</h2>
        <p className="text-muted mb-4">
          No tenés permisos para ver esta página
        </p>
        <LinkButton to="/" variant="primary">
          Inicio
        </LinkButton>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
