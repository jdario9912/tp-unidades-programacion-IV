import { useState, type ChangeEvent } from "react";
import PedidoTable from "@/features/pedidos/components/PedidoTable";
import { usePedidos } from "@/features/pedidos/hooks/usePedidos";
import { ESTADOS, type EstadoPedido } from "@/features/pedidos/types/pedido";
import EstadoError from "@/shared/components/EstadoError";
import TableSkeleton from "@/shared/components/TableSkeleton";
import Label from "@/shared/ui/label";
import Select from "@/shared/ui/select";
import Spinner from "@/shared/ui/spinner";

const AdminPedidosPage = () => {
  const [estado, setEstado] = useState<EstadoPedido | "">("");
  // el panel pide hasta 100 y pagina del lado del cliente; el estado filtra en el servidor
  const { pedidos, loading, fetching, error } = usePedidos({
    skip: 0,
    limit: 100,
    estado: estado || undefined,
  });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 w-full p-2 px-4">
        <h2 className="flex items-center gap-x-2 text-2xl font-bold text-primary">
          Pedidos
          {fetching && !loading && <Spinner />}
        </h2>
        <div className="flex items-center gap-x-2">
          <Label htmlFor="estado" className="mb-0">
            Estado
          </Label>
          <Select
            id="estado"
            value={estado}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setEstado(e.target.value as EstadoPedido | "")
            }
          >
            <option value="">Todos</option>
            {ESTADOS.map((e) => (
              <option key={e} value={e}>
                {e.replace("_", " ")}
              </option>
            ))}
          </Select>
        </div>
      </div>
      {loading ? (
        <TableSkeleton className="px-4 sm:px-0" />
      ) : error ? (
        <EstadoError mensaje="Error al cargar pedidos" error={error} />
      ) : (
        <PedidoTable pedidos={pedidos ?? []} />
      )}
    </>
  );
};

export default AdminPedidosPage;
