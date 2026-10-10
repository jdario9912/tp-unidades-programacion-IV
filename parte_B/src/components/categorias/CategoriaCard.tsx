import type { Categoria } from "../../types/categoria";
import CategoriaModal from "./CategoriaModal";

type Props = {
  categoria: Categoria;
  onSave: () => void | Promise<void>;
};

const CategoriaCard = ({ categoria, onSave }: Props) => {
  return (
    <tr className="border-t border-gray-200">
      <td className="px-4 py-2">{categoria.id}</td>
      <td className="px-4 py-2 font-bold first-letter:uppercase">
        {categoria.nombre}
      </td>
      <td className="px-4 py-2 first-letter:uppercase">
        {categoria.descripcion}
      </td>
      <td className="flex w-full justify-end px-4 py-2">
        <CategoriaModal onSave={onSave} categoria={categoria} />
      </td>
    </tr>
  );
};

export default CategoriaCard;
