import type { ColumnDef } from "@tanstack/react-table";
import type { Producto } from "@/features/productos/types/producto";
import DataTable from "@/shared/components/DataTable";
import { formatearPrecio } from "@/shared/utils/formato";
import ImagenPreview from "./ImagenPreview";
import ProductoModal from "./ProductoModal";
import ProductoStockModal from "./ProductoStockModal";
import ProductoEliminar from "./ProductoEliminar";

type Props = {
  productos: Producto[];
  filtro: string;
};

const columns: ColumnDef<Producto>[] = [
  {
    id: "imagen",
    header: "",
    enableSorting: false,
    cell: ({ row }) => (
      <ImagenPreview
        url={row.original.imagen_url ?? ""}
        alt={row.original.nombre}
      />
    ),
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.nombre}</span>
    ),
  },
  {
    id: "categoria",
    accessorFn: (producto) => producto.categoria.nombre,
    header: "Categoría",
  },
  {
    accessorKey: "precio_base",
    header: "Precio",
    enableGlobalFilter: false,
    cell: ({ row }) => formatearPrecio(row.original.precio_base),
  },
  {
    accessorKey: "stock",
    header: "Stock",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "disponible",
    header: "Disponible",
    enableGlobalFilter: false,
    cell: ({ row }) => (row.original.disponible ? "Sí" : "No"),
  },
  {
    id: "acciones",
    header: () => <span className="block text-right">Acciones</span>,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex w-full gap-x-2 justify-end">
        <ProductoStockModal producto={row.original} />
        <ProductoModal producto={row.original} />
        <ProductoEliminar idProducto={row.original.id} />
      </div>
    ),
  },
];

const ProductoTable = ({ productos, filtro }: Props) => (
  <DataTable
    data={productos}
    columns={columns}
    getRowId={(row) => String(row.id)}
    vacio="No hay productos."
    sortingInicial={[{ id: "nombre", desc: false }]}
    filtro={filtro}
  />
);

export default ProductoTable;
