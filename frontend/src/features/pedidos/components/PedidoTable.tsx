import type { ColumnDef } from "@tanstack/react-table";
import type { Pedido } from "@/features/pedidos/types/pedido";
import DataTable from "@/shared/components/DataTable";
import BadgeEstado from "@/shared/ui/badge-estado";
import { formatearFecha, formatearPrecio } from "@/shared/utils/formato";
import PedidoAcciones from "./PedidoAcciones";
import PedidoDetalleModal from "./PedidoDetalleModal";

type Props = {
  pedidos: Pedido[];
};

const columns: ColumnDef<Pedido>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "created_at",
    header: "Fecha",
    cell: ({ row }) => formatearFecha(row.original.created_at),
  },
  {
    accessorKey: "usuario_id",
    header: "Cliente",
    cell: ({ row }) => `#${row.original.usuario_id}`,
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => formatearPrecio(row.original.total),
  },
  {
    accessorKey: "forma_pago",
    header: "Pago",
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => <BadgeEstado estado={row.original.estado} />,
  },
  {
    id: "acciones",
    header: () => <span className="block text-right">Acciones</span>,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex justify-end gap-x-2">
        <PedidoDetalleModal pedido={row.original} />
        <PedidoAcciones pedido={row.original} />
      </div>
    ),
  },
];

const PedidoTable = ({ pedidos }: Props) => (
  <DataTable
    data={pedidos}
    columns={columns}
    getRowId={(row) => String(row.id)}
    vacio="No hay pedidos."
    sortingInicial={[{ id: "id", desc: true }]}
  />
);

export default PedidoTable;
