import { useState } from "react";
import PedidoCard from "@/features/pedidos/components/PedidoCard";
import { usePedidos } from "@/features/pedidos/hooks/usePedidos";
import EstadoError from "@/shared/components/EstadoError";
import EstadoVacio from "@/shared/components/EstadoVacio";
import Paginacion from "@/shared/components/Paginacion";
import Skeleton from "@/shared/components/Skeleton";
import LinkButton from "@/shared/ui/link-button";
import Spinner from "@/shared/ui/spinner";

const POR_PAGINA = 10;

const MisPedidosPage = () => {
  const [pagina, setPagina] = useState(0);
  // el backend devuelve solo los pedidos propios del usuario de la sesión
  const { pedidos, total, loading, fetching, error } = usePedidos({
    skip: pagina * POR_PAGINA,
    limit: POR_PAGINA,
  });

  return (
    <>
      <h2 className="flex items-center gap-x-2 text-2xl font-bold text-primary p-2 px-4">
        Mis pedidos
        {fetching && !loading && <Spinner />}
      </h2>
      {loading ? (
        <div aria-busy="true" className="flex flex-col gap-y-2 p-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : error ? (
        <EstadoError mensaje="Error al cargar tus pedidos" error={error} />
      ) : !pedidos?.length ? (
        <EstadoVacio mensaje="Todavía no hiciste pedidos.">
          <LinkButton to="/" variant="primary">
            Ver catálogo
          </LinkButton>
        </EstadoVacio>
      ) : (
        <>
          <div className="flex flex-col gap-y-2 p-4">
            {pedidos.map((pedido) => (
              <PedidoCard key={pedido.id} pedido={pedido} />
            ))}
          </div>
          <Paginacion
            pagina={pagina}
            totalPaginas={Math.ceil(total / POR_PAGINA)}
            onCambiar={setPagina}
          />
        </>
      )}
    </>
  );
};

export default MisPedidosPage;
