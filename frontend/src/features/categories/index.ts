// API pública de la feature categories
export { default as Categorias } from "./pages/Categorias";
export {
  useCategories,
  useCreateCategoria,
  useDeleteCategoria,
  useGetCategoriaById,
  useGetCategorias,
  useUpdateCategoria,
} from "./hooks/useCategories";
export type { Categoria, CategoriaInput } from "./types/categoria";
