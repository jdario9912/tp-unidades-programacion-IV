import type { Ingrediente, IngredienteInput } from "../types/ingrediente";
import { get, post, put, remove } from "./client";
import { paths } from "./constantes";

const URL_INGREDIENTES = `/${paths.ingredientes}`;

export const handleGetIngredientes = async (search = "") => {
  const params = new URLSearchParams({ limit: "50" });
  if (search) params.set("search", search);

  return get<Ingrediente[]>(`${URL_INGREDIENTES}?${params}`);
};

export const handleCrearIngrediente = async (ingrediente: IngredienteInput) => {
  return post<IngredienteInput, Ingrediente>(
    `${URL_INGREDIENTES}`,
    ingrediente,
  );
};

export const handleActualizarIngrediente = async (ingrediente: Ingrediente) => {
  return put<IngredienteInput, Ingrediente>(
    `${URL_INGREDIENTES}/${ingrediente.id}`,
    { nombre: ingrediente.nombre },
  );
};

export const handleEliminarIngrediente = async (id: number) => {
  await remove(`${URL_INGREDIENTES}/${id}`);
};
