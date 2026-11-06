import type { Ingrediente, IngredienteInput } from "../types/ingrediente";
import { get, post, put, remove } from "./client";

const URL_INGREDIENTES = "/ingredientes";

export const handleGetIngredientes = async (search = "") => {
  const params = new URLSearchParams({ limit: "50" });
  if (search) params.set("search", search);

  try {
    return await get<Ingrediente[]>(`${URL_INGREDIENTES}?${params}`);
  } catch (error) {
    console.error("Error al obtener ingredientes:", error);
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
    console.error("Error al crear ingrediente:", error);
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
    console.error(
      `Error al actualizar ingrediente con ID ${ingrediente.id}:`,
      error,
    );
    throw error;
  }
};

export const handleEliminarIngrediente = async (id: number) => {
  try {
    await remove(`${URL_INGREDIENTES}/${id}`);
  } catch (error) {
    console.error(`Error al eliminar ingrediente con ID ${id}:`, error);
    throw error;
  }
};
