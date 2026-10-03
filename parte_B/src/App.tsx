import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProductoForm from "./components/ProductoForm";
import ProductoList from "./components/ProductoList";
import type { Producto } from "./types/producto";

const productos: Producto[] = [
  {
    id: 1,
    nombre: "Producto 1",
    precio: 10.99,
    descripcion: "Descripción del producto 1",
  },
  {
    id: 2,
    nombre: "Producto 2",
    precio: 19.99,
    descripcion: "Descripción del producto 2",
  },
  {
    id: 3,
    nombre: "Producto 3",
    precio: 5.99,
    descripcion: "Descripción del producto 3",
  },
  {
    id: 4,
    nombre: "Producto 4",
    precio: 29.99,
    descripcion: "Descripción del producto 4",
  },
];

function App() {
  return (
    <body className="bg-gray-100 min-h-screen text-gray-700">
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
    </body>
  );
}

export default App;
