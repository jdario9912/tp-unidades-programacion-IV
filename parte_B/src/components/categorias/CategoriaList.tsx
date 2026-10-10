import type { Categoria } from "../../types/categoria";

type Props = {
  categorias: Categoria[];
};

const CategoriaList = ({ categorias }: Props) => {
  return (
    <table className="min-w-full border border-gray-200">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-4 py-2 text-left">ID</th>
          <th className="px-4 py-2 text-left">Nombre</th>
          <th className="px-4 py-2 text-left">Descripción</th>
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
            <tr key={categoria.id} className="border-t border-gray-200">
              <td className="px-4 py-2">{categoria.id}</td>
              <td className="px-4 py-2 font-bold">{categoria.nombre}</td>
              <td className="px-4 py-2">{categoria.descripcion}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default CategoriaList;
