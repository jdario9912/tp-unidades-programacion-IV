import type { Categoria } from "../../types/categoria";
import CategoriaCard from "./CategoriaCard";

type Props = {
  categorias: Categoria[];
  onSave: () => void | Promise<void>;
};

const CategoriaList = ({ categorias, onSave }: Props) => {
  return (
    <table className="min-w-full border rounded-lg overflow-hidden">
      <thead className="">
        <tr className="bg-gray-200">
          <th className="px-4 py-2 text-left">ID</th>
          <th className="px-4 py-2 text-left">Nombre</th>
          <th className="px-4 py-2 text-left">Descripción</th>
          <th className="px-4 py-2 text-left"></th>
        </tr>
      </thead>
      <tbody>
        {categorias.length === 0 ? (
          <tr>
            <td colSpan={3} className="px-4 py-2 text-center">
              No hay categorías disponibles.
            </td>
          </tr>
        ) : (
          categorias.map((categoria) => (
            <CategoriaCard
              key={categoria.id}
              categoria={categoria}
              onSave={onSave}
            />
          ))
        )}
      </tbody>
    </table>
  );
};

export default CategoriaList;
