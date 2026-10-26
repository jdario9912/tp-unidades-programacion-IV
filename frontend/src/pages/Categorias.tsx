import CategoriaList from "../components/categorias/CategoriaList";
import CategoriaModal from "../components/categorias/CategoriaModal";
import { useGetCategorias } from "../hooks/categorias";
import CardError from "../components/ui/card-error";

const Categorias = () => {
  const { categorias, error, loading } = useGetCategorias();

  if (loading) return <p>Cargando categorías...</p>;

  if (error)
    return <CardError className="m-4">Error al cargar categorías.</CardError>;

  return (
    <>
      <div className="flex justify-between w-full p-2 px-4">
        <h2 className="text-2xl font-bold text-blue-500">Categorías</h2>
        <CategoriaModal />
      </div>
      <CategoriaList categorias={categorias ?? []} />
    </>
  );
};

export default Categorias;
