import ProductoList from "../components/productos/ProductoList";
import ProductoModal from "../components/productos/ProductoModal";
import { useGetProductos } from "../hooks/productos";
import { useState, type ChangeEvent } from "react";
import CardError from "../components/ui/card-error";
import Input from "../components/ui/input";
import Label from "../components/ui/label";
import { useDebounce } from "../hooks/debounce";
import Spinner from "../components/ui/spinner";
import TableSkeleton from "../components/ui/table-skeleton";

const Productos = () => {
  const [busqueda, setBusqueda] = useState("");
  const search = useDebounce(busqueda.trim());
  const { productos, error, loading, fetching } = useGetProductos(search);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 w-full p-2 px-4">
        <h2 className="flex items-center gap-x-2 text-2xl font-bold text-primary">
          Productos
          {fetching && !loading && <Spinner />}
        </h2>
        <div className="order-last flex w-full justify-center sm:order-none sm:w-auto sm:flex-1">
          <Label htmlFor="busqueda" className="sr-only">
            Buscar productos
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
        <ProductoModal />
      </div>
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <CardError className="m-4">Error al cargar productos.</CardError>
      ) : (
        <ProductoList productos={productos ?? []} />
      )}
    </>
  );
};

export default Productos;
