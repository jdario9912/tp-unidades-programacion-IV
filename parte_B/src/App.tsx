import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProductoForm from "./components/ProductoForm";
import ProductoList from "./components/ProductoList";
import type { Producto } from "./types/producto";

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

function App() {
  return (
    <div className="bg-gray-100 min-h-screen text-gray-700">
      <main className="container mx-auto p-4">
        <Navbar />

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-500">TP Productos</h1>
          <p className="text-xs">Demo: Eventos - Formularios - .map()</p>
        </div>

        <div className="flex flex-col gap-y-4 max-w-2xl mx-auto">
          <ProductoForm />
          <ProductoList productos={productos} />
        </div>
        <Footer />
      </main>
    </div>
  );
}

export default App;
