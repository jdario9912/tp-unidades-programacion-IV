import IngredienteList from "../components/ingredientes/IngredienteList";
import IngredienteModal from "../components/ingredientes/IngredienteModal";
import { useGetIngredientes } from "../hooks/ingredientes";
import { useState, type ChangeEvent } from "react";
import CardError from "../components/ui/card-error";
import Input from "../components/ui/input";
import Label from "../components/ui/label";
import { useDebounce } from "../hooks/debounce";
import Spinner from "../components/ui/spinner";
import TableSkeleton from "../components/ui/table-skeleton";

const Ingredientes = () => {
  const [busqueda, setBusqueda] = useState("");
  const search = useDebounce(busqueda.trim());
  const { ingredientes, error, loading, fetching } = useGetIngredientes(search);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 w-full p-2 px-4">
        <h2 className="flex items-center gap-x-2 text-2xl font-bold text-primary">
          Ingredientes
          {fetching && !loading && <Spinner />}
        </h2>
        <div className="order-last flex w-full justify-center sm:order-0 sm:w-auto sm:flex-1">
          <Label htmlFor="busqueda" className="sr-only">
            Buscar ingredientes
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
        <IngredienteModal />
      </div>
      {loading ? (
        <TableSkeleton className="px-4 sm:px-0" />
      ) : error ? (
        <CardError className="m-4">Error al cargar ingredientes.</CardError>
      ) : (
        <IngredienteList ingredientes={ingredientes ?? []} />
      )}
    </>
  );
};

export default Ingredientes;
