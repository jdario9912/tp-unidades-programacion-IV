import ProductoList from "@/features/products/components/ProductoList";
import ProductoModal from "@/features/products/components/ProductoModal";
import { useGetProductos } from "@/features/products/hooks/useProducts";
import { useState, type ChangeEvent } from "react";
import CardError from "@/shared/components/ui/card-error";
import Input from "@/shared/components/ui/input";
import Label from "@/shared/components/ui/label";
import { useDebounce } from "@/shared/hooks/debounce";
import { useEsAdmin } from "@/features/auth";
import Spinner from "@/shared/components/ui/spinner";
import TableSkeleton from "@/shared/components/ui/table-skeleton";

const Productos = () => {
  const [busqueda, setBusqueda] = useState("");
  const search = useDebounce(busqueda.trim());
  const { productos, error, loading, fetching } = useGetProductos(search);
  const esAdmin = useEsAdmin();

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 w-full p-2 px-4">
        <h2 className="flex items-center gap-x-2 text-2xl font-bold text-primary">
          Productos
          {fetching && !loading && <Spinner />}
        </h2>
        <div className="order-last flex w-full justify-center sm:order-0 sm:w-auto sm:flex-1">
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
        {esAdmin && <ProductoModal />}
      </div>
      {loading ? (
        <TableSkeleton className="px-4 sm:px-0" />
      ) : error ? (
        <CardError className="m-4">
          Error al cargar productos: {error}
        </CardError>
      ) : (
        <ProductoList productos={productos ?? []} />
      )}
    </>
  );
};

export default Productos;
