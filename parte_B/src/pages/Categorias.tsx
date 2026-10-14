import CategoriaList from "../components/categorias/CategoriaList";
import CategoriaModal from "../components/categorias/CategoriaModal";
import { useGetCategorias } from "../hooks/categorias";

const Categorias = () => {
  const { categorias, error, loading, refetch } = useGetCategorias();

  if (loading) return <p>Cargando categorías...</p>;

  if (error) return <p>Error al cargar categorías: {error}</p>;

  return (
    <div>
      <div className="flex justify-between w-full p-2 px-4">
        <h2 className="text-2xl font-bold text-blue-500">Categorías</h2>
        <CategoriaModal onSave={refetch} />
      </div>
      <CategoriaList onSave={refetch} categorias={categorias} />
    </div>
  );
};

export default Categorias;
