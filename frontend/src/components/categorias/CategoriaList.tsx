import {
  rowSortingFeature,
  tableFeatures,
  type ColumnDef,
  useTable,
  createSortedRowModel,
} from "@tanstack/react-table";
import type { Categoria } from "../../types/categoria";
import CategoriaModal from "./CategoriaModal";
import CategoriaEliminar from "./CategoriaEliminar";

type Props = {
  categorias: Categoria[];
};

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    textoEs: (rowA, rowB, columnId) => {
      const a = rowA.getValue<string>(columnId) ?? "";
      const b = rowB.getValue<string>(columnId) ?? "";
      return a.localeCompare(b, "es", { sensitivity: "base" });
    },
  },
});

const columns: Array<ColumnDef<typeof features, Categoria>> = [
  {
    id: "id",
    accessorKey: "id",
    header: "",
    enableSorting: false,
    cell: (info) => (
      <div className="px-4 py-2 text-center">{info.getValue<string>()}</div>
    ),
  },
  {
    id: "nombre",
    accessorKey: "nombre",
    header: "Nombre",
    sortFn: "textoEs",
    cell: (info) => (
      <div className="px-4 py-2 text-left font-semibold first-letter:capitalize">
        {info.getValue<string>()}
      </div>
    ),
  },
  {
    id: "descripcion",
    accessorKey: "descripcion",
    header: "Descripción",
    enableSorting: false,
    cell: (info) => (
      // en mobile se corta a una línea; el texto completo queda en el title
      <div
        title={info.getValue<string>()}
        className="max-w-48 truncate px-4 py-2 text-left first-letter:capitalize sm:max-w-none sm:whitespace-normal"
      >
        {info.getValue<string>()}
      </div>
    ),
  },
  {
    id: "acciones",
    header: () => <span>Acciones</span>,
    enableSorting: false,
    cell: (info) => {
      return (
        <div className="flex w-full gap-x-2 justify-end px-4 py-2">
          <CategoriaModal categoria={info.row.original} />
          <CategoriaEliminar idCategoria={info.row.original.id} />
        </div>
      );
    },
  },
];

const CategoriaList = ({ categorias }: Props) => {
  const table = useTable({
    key: "table-categorias",
    features,
    columns,
    data: categorias,
    initialState: {
      sorting: [{ id: "nombre", desc: false }],
    },
  });

  return (
    <div className="overflow-x-auto px-4 sm:px-0">
      <table className="min-w-full border rounded-lg overflow-hidden">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-200">
              {headerGroup.headers.map((header) => {
                if (header.isPlaceholder) return <th key={header.id} />;

                const { column } = header;
                const sorted = column.getIsSorted();

                return (
                  <th
                    key={header.id}
                    className="py-2"
                    aria-sort={
                      sorted === "asc"
                        ? "ascending"
                        : sorted === "desc"
                          ? "descending"
                          : "none"
                    }
                  >
                    {column.getCanSort() ? (
                      <button
                        type="button"
                        onClick={column.getToggleSortingHandler()}
                        className="inline-flex items-center gap-1 cursor-pointer select-none"
                      >
                        <table.FlexRender header={header} />
                        <span className="text-xs">
                          {sorted === "asc"
                            ? "▲"
                            : sorted === "desc"
                              ? "▼"
                              : "↕"}
                        </span>
                      </button>
                    ) : (
                      <table.FlexRender header={header} />
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {categorias.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-2 text-center">
                No hay categorías disponibles.
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getAllCells().map((cell) => (
                  <td key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriaList;
