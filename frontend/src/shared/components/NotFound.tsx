import LinkButton from "@/shared/ui/link-button";

const NotFound = () => {
  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="mx-auto text-center">
        <h2 className="text-xl mb-4">Página no encontrada</h2>
        <LinkButton to="/" variant="primary">
          Inicio
        </LinkButton>
      </div>
    </div>
  );
};

export default NotFound;
