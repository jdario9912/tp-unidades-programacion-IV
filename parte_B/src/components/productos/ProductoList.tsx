import type { Producto } from "../../types/producto";
import ProductoCard from "./ProductoCard";

type Props = {
  productos: Producto[];
};

const ProductoList = ({ productos }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 p-4">
        Productos ({productos.length})
      </h2>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100 text-gray-600">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Precio</th>
          </tr>
        </thead>
        {productos.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={3} className="px-4 py-2 text-center">
                No hay productos disponibles.
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {productos.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default ProductoList;
