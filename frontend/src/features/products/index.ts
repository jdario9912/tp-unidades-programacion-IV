// API pública de la feature products
export { default as Productos } from "./pages/Productos";
export {
  useCreateProducto,
  useDeleteProducto,
  useGetProductos,
  useUpdateProducto,
} from "./hooks/useProducts";
export type {
  Producto,
  ProductoFormValues,
  ProductoInput,
} from "./types/producto";
