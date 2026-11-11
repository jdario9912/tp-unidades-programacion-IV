// mismos campos que CategoriaRead del backend
export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
}

export type CategoriaInput = Pick<Categoria, "nombre" | "descripcion">;
