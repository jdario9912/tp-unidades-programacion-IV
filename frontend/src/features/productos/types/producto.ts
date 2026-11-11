import type { Categoria } from "@/features/categorias";

// mismos campos que ProductoRead del backend
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio_base: number;
  imagen_url: string | null;
  stock: number;
  disponible: boolean;
  activo: boolean;
  categoria_id: number;
  categoria: Categoria;
}

export interface ProductosPaginados {
  total: number;
  items: Producto[];
}

export type ProductoInput = Omit<Producto, "id" | "activo" | "categoria">;

export type ProductoStockInput = Pick<Producto, "stock" | "disponible">;

export interface FiltrosProductos {
  skip: number;
  limit: number;
  search?: string;
  categoria_id?: number;
  disponible?: boolean;
}

export type ProductoFormValues = {
  nombre: string;
  descripcion: string;
  precio_base: string;
  imagen_url: string;
  stock: string;
  disponible: boolean;
  categoria_id: string;
};
