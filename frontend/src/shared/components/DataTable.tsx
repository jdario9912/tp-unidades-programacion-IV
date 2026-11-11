import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import Paginacion from "./Paginacion";

type Props<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  getRowId: (row: T) => string;
  vacio: string;
  sortingInicial?: SortingState;
  filtro?: string;
  pageSize?: number;
};

// tabla del panel: ordenamiento, filtro y paginación del lado del cliente
const DataTable = <T,>({
  data,
  columns,
  getRowId,
  vacio,
  sortingInicial = [],
  filtro = "",
  pageSize = 10,
}: Props<T>) => {
  const [sorting, setSorting] = useState<SortingState>(sortingInicial);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize });

  const table = useReactTable({
    data,
    columns,
    // id de la entidad como key: con el índice, al borrar una fila React
    // reutiliza su componente (y su modal abierto) para la fila siguiente
    getRowId,
    state: { sorting, pagination, globalFilter: filtro },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // al cambiar el filtro o los datos se vuelve a la primera página
    autoResetPageIndex: true,
  });

  const filas = table.getRowModel().rows;

  return (
    <>
      <div className="overflow-x-auto px-4 sm:px-0">
        <table className="min-w-full border rounded-lg overflow-hidden">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-200 dark:bg-gray-800">
                {headerGroup.headers.map((header) => {
                  if (header.isPlaceholder) return <th key={header.id} />;

                  const { column } = header;
                  const sorted = column.getIsSorted();
                  const titulo = flexRender(
                    column.columnDef.header,
                    header.getContext(),
                  );

                  return (
                    <th
                      key={header.id}
                      className="px-4 py-2 text-left"
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
                          {titulo}
                          <span className="text-xs">
                            {sorted === "asc"
                              ? "▲"
                              : sorted === "desc"
                                ? "▼"
                                : "↕"}
                          </span>
                        </button>
                      ) : (
                        titulo
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {filas.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-2 text-center">
                  {vacio}
                </td>
              </tr>
            ) : (
              filas.map((row) => (
                <tr key={row.id} className="border-t border-divider">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Paginacion
        pagina={table.getState().pagination.pageIndex}
        totalPaginas={table.getPageCount()}
        onCambiar={table.setPageIndex}
      />
    </>
  );
};

export default DataTable;
