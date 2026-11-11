import axiosInstance from "./axiosInstance";

type Params = Record<string, string | number | boolean | undefined>;

export const get = async <T>(ruta: string, params?: Params): Promise<T> => {
  const { data } = await axiosInstance.get<T>(ruta, { params });
  return data;
};

export const post = async <T, U>(ruta: string, body: T): Promise<U> => {
  const { data } = await axiosInstance.post<U>(ruta, body);
  return data;
};

export const put = async <T, U>(ruta: string, body: T): Promise<U> => {
  const { data } = await axiosInstance.put<U>(ruta, body);
  return data;
};

export const remove = async (ruta: string): Promise<void> => {
  await axiosInstance.delete(ruta);
};

export const patch = async <T, U>(ruta: string, body?: T): Promise<U> => {
  const { data } = await axiosInstance.patch<U>(ruta, body);
  return data;
};
