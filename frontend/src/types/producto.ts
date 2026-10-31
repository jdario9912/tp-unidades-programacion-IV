import type { Categoria } from "./categoria";
import type { Ingrediente } from "./ingrediente";

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_base: number;
  disponible: boolean;
  imagenes_url: string[];
  created_at: string;
  updated_at: string;
  categorias: Categoria[];
  ingredientes: Ingrediente[];
}

export type ProductoInput = Omit<
  Producto,
  "id" | "created_at" | "updated_at" | "categorias" | "ingredientes"
>;

export type ProductoFormValues = {
  nombre: string;
  descripcion: string;
  precio_base: string;
  imagenes_url: string[];
  disponible: boolean;
  categorias_ids: number[];
  ingredientes_ids: number[];
};
