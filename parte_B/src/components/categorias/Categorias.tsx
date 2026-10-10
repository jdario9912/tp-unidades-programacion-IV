import { useGetCategorias } from "../../hooks/categorias";
import CategoriaList from "./CategoriaList";

const Categorias = () => {
  const { categorias, error, loading } = useGetCategorias();

  if (loading) return <p>Cargando categorías...</p>;

  if (error) return <p>Error al cargar categorías: {error}</p>;

  return (
    <div>
      <div className="flex flex-col gap-y-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-500">Categorías</h2>
      </div>
      <CategoriaList categorias={categorias} />
    </div>
  );
};

export default Categorias;
