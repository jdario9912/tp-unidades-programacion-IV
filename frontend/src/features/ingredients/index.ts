// API pública de la feature ingredients
export { default as Ingredientes } from "./pages/Ingredientes";
export {
  useCreateIngrediente,
  useDeleteIngrediente,
  useGetIngredientes,
  useIngredients,
  useUpdateIngrediente,
} from "./hooks/useIngredients";
export type { Ingrediente, IngredienteInput } from "./types/ingrediente";
