import api from "./api";

export const get = async <T>(ruta: string): Promise<T> => {
  const { data } = await api.get<T>(ruta);
  return data;
};

export const post = async <T, U>(ruta: string, body: T): Promise<U> => {
  const { data } = await api.post<U>(ruta, body);
  return data;
};

export const put = async <T, U>(ruta: string, body: T): Promise<U> => {
  const { data } = await api.put<U>(ruta, body);
  return data;
};

export const remove = async (ruta: string): Promise<void> => {
  const { data } = await api.delete(ruta);
  return data;
};

export const patch = async <T, U>(ruta: string, body: T): Promise<U> => {
  const { data } = await api.patch<U>(ruta, body);
  return data;
};
