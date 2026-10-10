const ProductoForm = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <div className="mb-8">
        <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md">
          + Agregar producto
        </button>
      </div>
      <form>
        <div className="mb-4 text-sm">
          <label htmlFor="nombre" className="block mb-2">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            className="border border-gray-200 rounded p-2 w-full"
          />
        </div>
        <div className="mb-4 text-sm">
          <label htmlFor="precio" className="block mb-2">
            Precio
          </label>
          <input
            type="number"
            id="precio"
            name="precio"
            className="border border-gray-200 rounded p-2 w-full"
          />
        </div>
        <div className="mb-4 text-sm">
          <label htmlFor="categoria" className="block mb-2">
            Categoria
          </label>
          <input
            type="number"
            id="categoria"
            name="categoria"
            className="border border-gray-200 rounded p-2 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Guardar Producto
        </button>
      </form>
    </div>
  );
};

export default ProductoForm;
