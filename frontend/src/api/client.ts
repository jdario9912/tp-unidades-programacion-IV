const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const jsonInit = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

const getErrorMessage = async (res: Response, ruta: string) => {
  const fallback = `Error ${res.status} al pedir ${ruta}.`;

  try {
    const { detail } = await res.json();

    if (typeof detail === "string") return detail;
    if (Array.isArray(detail))
      return detail.map((d: { msg: string }) => d.msg).join(", ");
  } catch {
    // la respuesta no tiene un body JSON
  }

  return fallback;
};

export const get = async <T>(ruta: string): Promise<T> => {
  const res = await fetch(`${API_URL}${ruta}`);

  if (!res.ok) throw new Error(await getErrorMessage(res, ruta));

  return res.json() as Promise<T>;
};

export const post = async <T, U>(ruta: string, body: T): Promise<U> => {
  const res = await fetch(`${API_URL}${ruta}`, jsonInit("POST", body));

  if (!res.ok) throw new Error(await getErrorMessage(res, ruta));

  return res.json() as Promise<U>;
};

export const put = async <T, U>(ruta: string, body: T): Promise<U> => {
  const res = await fetch(`${API_URL}${ruta}`, jsonInit("PUT", body));

  if (!res.ok) throw new Error(await getErrorMessage(res, ruta));

  return res.json() as Promise<U>;
};

export const remove = async (ruta: string): Promise<void> => {
  const res = await fetch(`${API_URL}${ruta}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error(await getErrorMessage(res, ruta));
};

export const patch = async <T, U>(ruta: string, body: T): Promise<U> => {
  const res = await fetch(`${API_URL}${ruta}`, jsonInit("PATCH", body));

  if (!res.ok) throw new Error(await getErrorMessage(res, ruta));

  return res.json() as Promise<U>;
};
