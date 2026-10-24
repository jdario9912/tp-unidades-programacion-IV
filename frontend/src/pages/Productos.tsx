import type { Producto } from "../types/producto";
import ProductoForm from "../components/productos/ProductoForm";
import ProductoList from "../components/productos/ProductoList";

const productos: Producto[] = [
  {
    id: 1,
    nombre: "Producto 1",
    categoria: "Categoria 1",
    precio: 10.99,
    stock: 100,
    stock_minimo: 10,
    activo: true,
  },
  {
    id: 2,
    nombre: "Producto 2",
    categoria: "Categoria 2",
    precio: 19.99,
    stock: 50,
    stock_minimo: 5,
    activo: true,
  },
  {
    id: 3,
    nombre: "Producto 3",
    categoria: "Categoria 3",
    precio: 5.99,
    stock: 200,
    stock_minimo: 20,
    activo: true,
  },
  {
    id: 4,
    nombre: "Producto 4",
    categoria: "Categoria 4",
    precio: 29.99,
    stock: 75,
    stock_minimo: 15,
    activo: true,
  },
];

const Productos = () => {
  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-blue-500">TP Productos</h2>
        <p className="text-xs">Demo: Eventos - Formularios - .map()</p>
      </div>

      <div className="flex flex-col gap-y-4 max-w-2xl mx-auto">
        <ProductoForm />
        <ProductoList productos={productos} />
      </div>
    </>
  );
};

export default Productos;
