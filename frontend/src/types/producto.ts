import type { Categoria } from "./categoria";

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
}

export type ProductoInput = Omit<
  Producto,
  "id" | "created_at" | "updated_at" | "categorias"
>;

export type ProductoFormValues = {
  nombre: string;
  descripcion: string;
  precio_base: string;
  disponible: boolean;
  categorias_ids: number[];
};
