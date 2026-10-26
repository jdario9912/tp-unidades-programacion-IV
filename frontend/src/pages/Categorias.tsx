import CategoriaList from "../components/categorias/CategoriaList";
import CategoriaModal from "../components/categorias/CategoriaModal";
import { useGetCategorias } from "../hooks/categorias";
import { useState, type ChangeEvent } from "react";
import CardError from "../components/ui/card-error";
import Input from "../components/ui/input";
import Label from "../components/ui/label";
import { useDebounce } from "../hooks/debounce";
import Spinner from "../components/ui/spinner";
import TableSkeleton from "../components/ui/table-skeleton";

const Categorias = () => {
  const [busqueda, setBusqueda] = useState("");
  const search = useDebounce(busqueda.trim());
  const { categorias, error, loading, fetching } = useGetCategorias(search);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 w-full p-2 px-4">
        <h2 className="flex items-center gap-x-2 text-2xl font-bold text-primary">
          Categorías
          {fetching && !loading && <Spinner />}
        </h2>
        <div className="order-last flex w-full justify-center sm:order-none sm:w-auto sm:flex-1">
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
        <CardError className="m-4">Error al cargar categorías.</CardError>
      ) : (
        <CategoriaList categorias={categorias ?? []} />
      )}
    </>
  );
};

export default Categorias;
