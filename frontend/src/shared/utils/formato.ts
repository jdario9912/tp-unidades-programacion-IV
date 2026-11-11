const PESOS = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

const FECHA = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
});

export const formatearPrecio = (monto: number) => PESOS.format(monto);

export const formatearFecha = (iso: string) => FECHA.format(new Date(iso));
