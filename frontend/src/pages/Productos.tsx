import ProductoList from "../components/productos/ProductoList";
import ProductoModal from "../components/productos/ProductoModal";
import { useGetProductos } from "../hooks/productos";
import CardError from "../components/ui/card-error";
import Spinner from "../components/ui/spinner";
import TableSkeleton from "../components/ui/table-skeleton";

const Productos = () => {
  const { productos, error, loading, fetching } = useGetProductos();

  return (
    <>
      <div className="flex justify-between w-full p-2 px-4">
        <h2 className="flex items-center gap-x-2 text-2xl font-bold text-blue-500">
          Productos
          {fetching && !loading && <Spinner />}
        </h2>
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
