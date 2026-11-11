import { useState, type ChangeEvent } from "react";
import { useGetCategorias } from "@/features/categorias";
import { useGetProductos } from "@/features/productos/hooks/useProductos";
import ProductoCard from "@/features/productos/components/ProductoCard";
import EstadoError from "@/shared/components/EstadoError";
import EstadoVacio from "@/shared/components/EstadoVacio";
import Paginacion from "@/shared/components/Paginacion";
import Skeleton from "@/shared/components/Skeleton";
import { useDebounce } from "@/shared/hooks/debounce";
import Input from "@/shared/ui/input";
import Label from "@/shared/ui/label";
import Select from "@/shared/ui/select";
import Spinner from "@/shared/ui/spinner";

const POR_PAGINA = 12;

const CatalogoPage = () => {
  const [pagina, setPagina] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const search = useDebounce(busqueda.trim());

  const { categorias } = useGetCategorias();
  // la paginación la hace el servidor: skip = página × limit
  const { productos, total, loading, fetching, error } = useGetProductos({
    skip: pagina * POR_PAGINA,
    limit: POR_PAGINA,
    search: search || undefined,
    categoria_id: categoriaId ? Number(categoriaId) : undefined,
  });

  const totalPaginas = Math.ceil(total / POR_PAGINA);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 w-full p-2 px-4">
        <h2 className="flex items-center gap-x-2 text-2xl font-bold text-primary">
          Catálogo
          {fetching && !loading && <Spinner />}
        </h2>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Label htmlFor="busqueda" className="sr-only">
            Buscar productos
          </Label>
          <Input
            id="busqueda"
            type="search"
            placeholder="Buscar..."
            className="w-full sm:w-64"
            value={busqueda}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setBusqueda(e.target.value);
              // un filtro nuevo vuelve a la primera página
              setPagina(0);
            }}
          />
          <Label htmlFor="categoria" className="sr-only">
            Filtrar por categoría
          </Label>
          <Select
            id="categoria"
            className="w-full sm:w-48"
            value={categoriaId}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setCategoriaId(e.target.value);
              setPagina(0);
            }}
          >
            <option value="">Todas las categorías</option>
            {categorias?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </Select>
        </div>
      </div>
      {loading ? (
        <div
          aria-busy="true"
          className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      ) : error ? (
        <EstadoError mensaje="Error al cargar el catálogo" error={error} />
      ) : !productos?.length ? (
        <EstadoVacio mensaje="No hay productos que coincidan con la búsqueda." />
      ) : (
        <>
          <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productos.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
          <Paginacion
            pagina={pagina}
            totalPaginas={totalPaginas}
            onCambiar={setPagina}
          />
        </>
      )}
    </>
  );
};

export default CatalogoPage;
