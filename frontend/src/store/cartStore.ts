import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ItemCarrito {
  producto_id: number;
  nombre: string;
  precio_unitario: number;
  cantidad: number;
}

type CartState = {
  items: ItemCarrito[];
  agregar: (item: Omit<ItemCarrito, "cantidad">, cantidad?: number) => void;
  quitar: (productoId: number) => void;
  cambiarCantidad: (productoId: number, cantidad: number) => void;
  vaciar: () => void;
  total: () => number;
};

// el carrito sobrevive a la recarga; el stock lo valida el backend al confirmar
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      agregar: (item, cantidad = 1) =>
        set((s) => {
          const existente = s.items.find(
            (i) => i.producto_id === item.producto_id,
          );
          if (!existente) return { items: [...s.items, { ...item, cantidad }] };

          return {
            items: s.items.map((i) =>
              i.producto_id === item.producto_id
                ? { ...i, cantidad: i.cantidad + cantidad }
                : i,
            ),
          };
        }),

      quitar: (productoId) =>
        set((s) => ({
          items: s.items.filter((i) => i.producto_id !== productoId),
        })),

      cambiarCantidad: (productoId, cantidad) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.producto_id === productoId
              ? { ...i, cantidad: Math.max(1, cantidad) }
              : i,
          ),
        })),

      vaciar: () => set({ items: [] }),

      total: () =>
        get().items.reduce((suma, i) => suma + i.precio_unitario * i.cantidad, 0),
    }),
    { name: "cart-storage" },
  ),
);
