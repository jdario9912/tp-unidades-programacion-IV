// API pública de la feature ingredients
export { default as Ingredientes } from "./pages/Ingredientes";
export {
  useCreateIngrediente,
  useDeleteIngrediente,
  useGetIngredientes,
  useUpdateIngrediente,
} from "./hooks/useIngredients";
export type { Ingrediente, IngredienteInput } from "./types/ingrediente";
