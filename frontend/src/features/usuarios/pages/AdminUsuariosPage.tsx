import UsuarioTable from "@/features/usuarios/components/UsuarioTable";
import { useGetUsuarios } from "@/features/usuarios/hooks/useUsuarios";
import { useState, type ChangeEvent } from "react";
import EstadoError from "@/shared/components/EstadoError";
import TableSkeleton from "@/shared/components/TableSkeleton";
import Input from "@/shared/ui/input";
import Label from "@/shared/ui/label";
import Spinner from "@/shared/ui/spinner";

const AdminUsuariosPage = () => {
  const [busqueda, setBusqueda] = useState("");
  const { usuarios, error, loading, fetching } = useGetUsuarios();

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 w-full p-2 px-4">
        <h2 className="flex items-center gap-x-2 text-2xl font-bold text-primary">
          Usuarios
          {fetching && !loading && <Spinner />}
        </h2>
        <div className="order-last flex w-full justify-center sm:order-0 sm:w-auto sm:flex-1">
          <Label htmlFor="busqueda" className="sr-only">
            Buscar usuarios
          </Label>
          <Input
            id="busqueda"
            type="search"
            placeholder="Buscar..."
            className="w-full sm:max-w-sm"
            value={busqueda}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setBusqueda(e.target.value)
            }
          />
        </div>
      </div>
      {loading ? (
        <TableSkeleton className="px-4 sm:px-0" />
      ) : error ? (
        <EstadoError mensaje="Error al cargar usuarios" error={error} />
      ) : (
        <UsuarioTable usuarios={usuarios ?? []} filtro={busqueda.trim()} />
      )}
    </>
  );
};

export default AdminUsuariosPage;
