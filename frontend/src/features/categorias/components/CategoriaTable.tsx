import type { ColumnDef } from "@tanstack/react-table";
import type { Categoria } from "@/features/categorias/types/categoria";
import DataTable from "@/shared/components/DataTable";
import CategoriaModal from "./CategoriaModal";
import CategoriaEliminar from "./CategoriaEliminar";

type Props = {
  categorias: Categoria[];
  filtro: string;
};

const columns: ColumnDef<Categoria>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.nombre}</span>
    ),
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
    enableSorting: false,
    cell: ({ row }) => (
      // en mobile se corta a una línea; el texto completo queda en el title
      <div
        title={row.original.descripcion ?? ""}
        className="max-w-48 truncate sm:max-w-none sm:whitespace-normal"
      >
        {row.original.descripcion}
      </div>
    ),
  },
  {
    id: "acciones",
    header: () => <span className="block text-right">Acciones</span>,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex w-full gap-x-2 justify-end">
        <CategoriaModal categoria={row.original} />
        <CategoriaEliminar idCategoria={row.original.id} />
      </div>
    ),
  },
];

const CategoriaTable = ({ categorias, filtro }: Props) => (
  <DataTable
    data={categorias}
    columns={columns}
    getRowId={(row) => String(row.id)}
    vacio="No hay categorías."
    sortingInicial={[{ id: "nombre", desc: false }]}
    filtro={filtro}
  />
);

export default CategoriaTable;
