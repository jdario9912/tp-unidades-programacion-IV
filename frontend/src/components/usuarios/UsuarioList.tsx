import {
  rowSortingFeature,
  tableFeatures,
  type ColumnDef,
  useTable,
  createSortedRowModel,
} from "@tanstack/react-table";
import type { UsuarioAdmin } from "../../types/auth.types";
import UsuarioEstado from "./UsuarioEstado";

type Props = {
  usuarios: UsuarioAdmin[];
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

const columns: Array<ColumnDef<typeof features, UsuarioAdmin>> = [
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
    id: "apellido",
    accessorFn: (usuario) => `${usuario.apellido}, ${usuario.nombre}`,
    header: "Nombre",
    sortFn: "textoEs",
    cell: (info) => (
      <div className="px-4 py-2 text-left font-semibold">
        {info.getValue<string>()}
      </div>
    ),
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
    sortFn: "textoEs",
    cell: (info) => (
      <div className="px-4 py-2 text-left">{info.getValue<string>()}</div>
    ),
  },
  {
    id: "roles",
    accessorFn: (usuario) => usuario.roles.join(", "),
    header: "Roles",
    enableSorting: false,
    cell: (info) => (
      <div className="px-4 py-2 text-left">{info.getValue<string>()}</div>
    ),
  },
  {
    id: "activo",
    accessorKey: "activo",
    header: "Estado",
    enableSorting: false,
    cell: (info) => (
      <div className="px-4 py-2 text-center">
        {info.getValue<boolean>() ? "Activo" : "Inactivo"}
      </div>
    ),
  },
  {
    id: "acciones",
    header: () => <span>Acciones</span>,
    enableSorting: false,
    cell: (info) => (
      <div className="flex w-full justify-end px-4 py-2">
        <UsuarioEstado usuario={info.row.original} />
      </div>
    ),
  },
];

const UsuarioList = ({ usuarios }: Props) => {
  const table = useTable({
    key: "table-usuarios",
    features,
    columns,
    data: usuarios,
    getRowId: (row) => String(row.id),
    initialState: {
      sorting: [{ id: "apellido", desc: false }],
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
          {usuarios.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-2 text-center">
                No hay usuarios.
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

export default UsuarioList;
