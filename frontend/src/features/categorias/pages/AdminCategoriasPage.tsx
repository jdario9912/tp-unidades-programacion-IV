import CategoriaTable from "@/features/categorias/components/CategoriaTable";
import CategoriaModal from "@/features/categorias/components/CategoriaModal";
import { useGetCategorias } from "@/features/categorias/hooks/useCategorias";
import { useState, type ChangeEvent } from "react";
import EstadoError from "@/shared/components/EstadoError";
import TableSkeleton from "@/shared/components/TableSkeleton";
import Input from "@/shared/ui/input";
import Label from "@/shared/ui/label";
import Spinner from "@/shared/ui/spinner";

const AdminCategoriasPage = () => {
  const [busqueda, setBusqueda] = useState("");
  const { categorias, error, loading, fetching } = useGetCategorias();

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 w-full p-2 px-4">
        <h2 className="flex items-center gap-x-2 text-2xl font-bold text-primary">
          Categorías
          {fetching && !loading && <Spinner />}
        </h2>
        <div className="order-last flex w-full justify-center sm:order-0 sm:w-auto sm:flex-1">
          <Label htmlFor="busqueda" className="sr-only">
            Buscar categorías
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
        <CategoriaModal />
      </div>
      {loading ? (
        <TableSkeleton className="px-4 sm:px-0" />
      ) : error ? (
        <EstadoError mensaje="Error al cargar categorías" error={error} />
      ) : (
        <CategoriaTable categorias={categorias ?? []} filtro={busqueda.trim()} />
      )}
    </>
  );
};

export default AdminCategoriasPage;
