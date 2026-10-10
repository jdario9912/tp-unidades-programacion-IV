import type { Categoria } from "../../types/categoria";

type Props = {
  categoria: Categoria;
};

const CategoriaCard = ({ categoria }: Props) => {
  return (
    <tr className="border-t border-gray-200">
      <td className="px-4 py-2">{categoria.id}</td>
      <td className="px-4 py-2 font-bold">{categoria.nombre}</td>
      <td className="px-4 py-2">{categoria.descripcion}</td>
    </tr>
  );
};

export default CategoriaCard;
