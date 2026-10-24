import ProductoForm from "../components/productos/ProductoForm";
import ProductoList from "../components/productos/ProductoList";

const Productos = () => {
  return (
    <>
      <div className="flex justify-between w-full p-2 px-4">
        <h2 className="text-2xl font-bold text-blue-500">Productos</h2>
      </div>

      <div className="flex flex-col gap-y-4 max-w-2xl mx-auto">
        <ProductoForm />
        <ProductoList productos={[]} />
      </div>
    </>
  );
};

export default Productos;
