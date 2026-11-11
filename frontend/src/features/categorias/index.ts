// API pública de la feature categorias
export { default as AdminCategoriasPage } from "./pages/AdminCategoriasPage";
export {
  useCreateCategoria,
  useDeleteCategoria,
  useGetCategorias,
  useUpdateCategoria,
} from "./hooks/useCategorias";
export type { Categoria, CategoriaInput } from "./types/categoria";
