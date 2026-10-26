import ProductoList from "../components/productos/ProductoList";
import ProductoModal from "../components/productos/ProductoModal";
import { useGetProductos } from "../hooks/productos";

const Productos = () => {
  const { productos, error, loading } = useGetProductos();

  if (loading) return <p>Cargando productos...</p>;

  if (error) return <p>Error al cargar productos.</p>;

  return (
    <>
      <div className="flex justify-between w-full p-2 px-4">
        <h2 className="text-2xl font-bold text-blue-500">Productos</h2>
        <ProductoModal />
      </div>
      <ProductoList productos={productos ?? []} />
    </>
  );
};

export default Productos;
