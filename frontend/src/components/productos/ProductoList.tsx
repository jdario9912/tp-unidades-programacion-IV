import {
  rowSortingFeature,
  tableFeatures,
  type ColumnDef,
  useTable,
  createSortedRowModel,
} from "@tanstack/react-table";
import type { Producto } from "../../types/producto";
import ProductoModal from "./ProductoModal";
import ProductoEliminar from "./ProductoEliminar";

type Props = {
  productos: Producto[];
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

const columns: Array<ColumnDef<typeof features, Producto>> = [
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
    id: "precio_base",
    accessorKey: "precio_base",
    header: "Precio",
    cell: (info) => (
      <div className="px-4 py-2 text-right">
        ${info.getValue<number>().toFixed(2)}
      </div>
    ),
  },
  {
    id: "disponible",
    accessorKey: "disponible",
    header: "Disponible",
    enableSorting: false,
    cell: (info) => (
      <div className="px-4 py-2 text-center">
        {info.getValue<boolean>() ? "Sí" : "No"}
      </div>
    ),
  },
  {
    id: "acciones",
    header: () => <span>Acciones</span>,
    enableSorting: false,
    cell: (info) => (
      <div className="flex w-full gap-x-2 justify-end px-4 py-2">
        <ProductoModal producto={info.row.original} />
        <ProductoEliminar idProducto={info.row.original.id} />
      </div>
    ),
  },
];

const ProductoList = ({ productos }: Props) => {
  const table = useTable({
    key: "table-productos",
    features,
    columns,
    data: productos,
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
          {productos.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-2 text-center">
                No hay productos disponibles.
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

export default ProductoList;
