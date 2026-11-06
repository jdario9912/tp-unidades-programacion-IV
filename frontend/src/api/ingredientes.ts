import type { Ingrediente, IngredienteInput } from "../types/ingrediente";
import { get, post, put, remove } from "./client";
import { paths } from "./constantes";

const URL_INGREDIENTES = `/${paths.ingredientes}`;

export const handleGetIngredientes = async (search = "") => {
  const params = new URLSearchParams({ limit: "50" });
  if (search) params.set("search", search);

  try {
    return await get<Ingrediente[]>(`${URL_INGREDIENTES}?${params}`);
  } catch (error) {
    throw error;
  }
};

export const handleCrearIngrediente = async (ingrediente: IngredienteInput) => {
  try {
    return await post<IngredienteInput, Ingrediente>(
      `${URL_INGREDIENTES}`,
      ingrediente,
    );
  } catch (error) {
    throw error;
  }
};

export const handleActualizarIngrediente = async (ingrediente: Ingrediente) => {
  try {
    return await put<IngredienteInput, Ingrediente>(
      `${URL_INGREDIENTES}/${ingrediente.id}`,
      { nombre: ingrediente.nombre },
    );
  } catch (error) {
    throw error;
  }
};

export const handleEliminarIngrediente = async (id: number) => {
  try {
    await remove(`${URL_INGREDIENTES}/${id}`);
  } catch (error) {
    throw error;
  }
};
