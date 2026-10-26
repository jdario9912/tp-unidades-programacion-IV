import CategoriaList from "../components/categorias/CategoriaList";
import CategoriaModal from "../components/categorias/CategoriaModal";
import { useGetCategorias } from "../hooks/categorias";
import CardError from "../components/ui/card-error";
import Spinner from "../components/ui/spinner";
import TableSkeleton from "../components/ui/table-skeleton";

const Categorias = () => {
  const { categorias, error, loading, fetching } = useGetCategorias();

  return (
    <>
      <div className="flex justify-between w-full p-2 px-4">
        <h2 className="flex items-center gap-x-2 text-2xl font-bold text-blue-500">
          Categorías
          {fetching && !loading && <Spinner />}
        </h2>
        <CategoriaModal />
      </div>
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <CardError className="m-4">Error al cargar categorías.</CardError>
      ) : (
        <CategoriaList categorias={categorias ?? []} />
      )}
    </>
  );
};

export default Categorias;
