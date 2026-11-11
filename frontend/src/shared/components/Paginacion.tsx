import ActionButton from "@/shared/ui/action-button";

type Props = {
  // página actual, empezando en 0
  pagina: number;
  totalPaginas: number;
  onCambiar: (pagina: number) => void;
};

const Paginacion = ({ pagina, totalPaginas, onCambiar }: Props) => {
  if (totalPaginas <= 1) return null;

  return (
    <nav
      aria-label="Paginación"
      className="flex items-center justify-center gap-x-2 p-4"
    >
      <ActionButton
        variant="outline"
        onClick={() => onCambiar(pagina - 1)}
        disabled={pagina === 0}
      >
        Anterior
      </ActionButton>
      <span className="text-sm">
        Página {pagina + 1} de {totalPaginas}
      </span>
      <ActionButton
        variant="outline"
        onClick={() => onCambiar(pagina + 1)}
        disabled={pagina >= totalPaginas - 1}
      >
        Siguiente
      </ActionButton>
    </nav>
  );
};

export default Paginacion;
