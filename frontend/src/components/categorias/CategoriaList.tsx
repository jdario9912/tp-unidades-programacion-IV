import { tableFeatures, type ColumnDef, useTable } from "@tanstack/react-table";
import type { Categoria } from "../../types/categoria";
import CategoriaModal from "./CategoriaModal";
import CategoriaEliminar from "./CategoriaEliminar";

type Props = {
  categorias: Categoria[];
};

const features = tableFeatures({});

const columns: Array<ColumnDef<typeof features, Categoria>> = [
  {
    accessorKey: "id",
    header: () => <th></th>,
    cell: (info) => (
      <td className="px-4 py-2 text-center">{info.getValue<string>()}</td>
    ),
  },
  {
    accessorKey: "nombre",
    cell: (info) => (
      <td className="px-4 py-2 text-center font-semibold first-letter:capitalize">
        {info.getValue<string>()}
      </td>
    ),
  },
  {
    accessorKey: "descripcion",
    header: "Descripcion",
    cell: (info) => (
      <td className="px-4 py-2 text-center">{info.getValue<string>()}</td>
    ),
  },
  {
    accessorKey: "acciones",
    cell: (info) => {
      return (
        <td className="flex w-full gap-x-2 justify-end px-4 py-2">
          <CategoriaModal categoria={info.row.original} />
          <CategoriaEliminar idCategoria={info.row.original.id} />
        </td>
      );
    },
  },
];

const CategoriaList = ({ categorias }: Props) => {
  const table = useTable({
    key: "person-table",
    features,
    columns,
    data: categorias,
  });

  return (
    <table className="min-w-full border rounded-lg overflow-hidden">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="bg-gray-200">
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder ? null : (
                  <table.FlexRender header={header} />
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getAllCells().map((cell) => (
              <td key={cell.id}>
                <table.FlexRender cell={cell} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CategoriaList;
