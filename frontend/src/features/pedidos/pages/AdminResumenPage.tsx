import ResumenCard from "@/features/pedidos/components/ResumenCard";
import { useResumenPedidos } from "@/features/pedidos/hooks/usePedidos";
import EstadoError from "@/shared/components/EstadoError";
import Skeleton from "@/shared/components/Skeleton";
import Spinner from "@/shared/ui/spinner";
import { formatearPrecio } from "@/shared/utils/formato";

const AdminResumenPage = () => {
  const { resumen, loading, fetching, error } = useResumenPedidos();

  return (
    <>
      <h2 className="flex items-center gap-x-2 text-2xl font-bold text-primary p-2 px-4">
        Resumen
        {fetching && !loading && <Spinner />}
      </h2>
      {loading ? (
        <div aria-busy="true" className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : error || !resumen ? (
        <EstadoError mensaje="Error al cargar el resumen" error={error} />
      ) : (
        <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
          <ResumenCard titulo="Pedidos de hoy" valor={resumen.pedidos_hoy} />
          <ResumenCard
            titulo="Ingresos (entregados)"
            valor={formatearPrecio(resumen.ingresos_entregados)}
          />
          <ResumenCard titulo="Pendientes" valor={resumen.pendientes} />
          <ResumenCard titulo="En preparación" valor={resumen.en_preparacion} />
          <ResumenCard titulo="Entregados" valor={resumen.entregados} />
          <ResumenCard titulo="Cancelados" valor={resumen.cancelados} />
        </div>
      )}
    </>
  );
};

export default AdminResumenPage;
