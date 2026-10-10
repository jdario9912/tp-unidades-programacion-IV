const API_URL = "http://localhost:8080";

export const get = async <T>(ruta: string): Promise<T> => {
  const res = await fetch(`${API_URL}${ruta}`);

  if (!res.ok) throw new Error(`Error ${res.status} al pedir ${ruta}.`);

  return res.json() as Promise<T>;
};

export const post = async <T, U>(ruta: string, body: T): Promise<U> => {
  const res = await fetch(`${API_URL}${ruta}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Error ${res.status} al pedir ${ruta}.`);

  return res.json() as Promise<U>;
};

export const put = async <T, U>(ruta: string, body: T): Promise<U> => {
  const res = await fetch(`${API_URL}${ruta}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Error ${res.status} al pedir ${ruta}.`);

  return res.json() as Promise<U>;
};

export const del = async (ruta: string): Promise<void> => {
  const res = await fetch(`${API_URL}${ruta}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error(`Error ${res.status} al pedir ${ruta}.`);
};

export const patch = async <T, U>(ruta: string, body: T): Promise<U> => {
  const res = await fetch(`${API_URL}${ruta}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Error ${res.status} al pedir ${ruta}.`);

  return res.json() as Promise<U>;
};
