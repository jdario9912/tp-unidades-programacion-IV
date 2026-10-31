export interface Ingrediente {
  id: number;
  nombre: string;
}

export type IngredienteInput = Omit<Ingrediente, "id">;
