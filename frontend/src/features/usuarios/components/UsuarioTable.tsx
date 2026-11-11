import type { ColumnDef } from "@tanstack/react-table";
import type { Usuario } from "@/features/usuarios/types/usuario";
import DataTable from "@/shared/components/DataTable";
import { cn } from "@/shared/utils/cn";
import UsuarioEstado from "./UsuarioEstado";

type Props = {
  usuarios: Usuario[];
  filtro: string;
};

const columns: ColumnDef<Usuario>[] = [
  {
    accessorKey: "username",
    header: "Usuario",
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.username}</span>
    ),
  },
  {
    accessorKey: "full_name",
    header: "Nombre",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Rol",
  },
  {
    accessorKey: "disabled",
    header: "Estado",
    enableGlobalFilter: false,
    cell: ({ row }) => (
      <span
        className={cn(
          "rounded px-2 py-0.5 text-xs font-semibold",
          row.original.disabled
            ? "bg-destructive/10 text-destructive"
            : "bg-success/10 text-success",
        )}
      >
        {row.original.disabled ? "Desactivado" : "Activo"}
      </span>
    ),
  },
  {
    id: "acciones",
    header: () => <span className="block text-right">Acciones</span>,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex w-full justify-end">
        <UsuarioEstado usuario={row.original} />
      </div>
    ),
  },
];

const UsuarioTable = ({ usuarios, filtro }: Props) => (
  <DataTable
    data={usuarios}
    columns={columns}
    getRowId={(row) => String(row.id)}
    vacio="No hay usuarios."
    sortingInicial={[{ id: "username", desc: false }]}
    filtro={filtro}
  />
);

export default UsuarioTable;
