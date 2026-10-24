import type { Categoria } from "./categoria";

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_base: number;
  disponible: boolean;
  imagenes_url: string[];
  created_at: Date;
  updated_at: Date;
  categorias: Categoria[];
}
