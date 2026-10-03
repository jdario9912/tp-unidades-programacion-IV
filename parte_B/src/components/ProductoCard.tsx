import type { Producto } from "../types/producto";

type Props = {
  producto: Producto;
};

const ProductoCard = ({ producto }: Props) => {
  return (
    <tr className="border-t border-gray-200">
      <td className="px-4 py-2">{producto.id}</td>
      <td className="px-4 py-2 font-bold">{producto.nombre}</td>
      <td className="px-4 py-2">${producto.precio}</td>
      <td className="px-4 py-2">{producto.descripcion}</td>
    </tr>
  );
};

export default ProductoCard;
