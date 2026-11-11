import { useCartStore, type ItemCarrito } from "@/store/cartStore";
import { formatearPrecio } from "@/shared/utils/formato";
import ActionButton from "@/shared/ui/action-button";

type Props = {
  item: ItemCarrito;
};

const CarritoItem = ({ item }: Props) => {
  const cambiarCantidad = useCartStore((s) => s.cambiarCantidad);
  const quitar = useCartStore((s) => s.quitar);

  return (
    <li className="flex flex-wrap items-center justify-between gap-2 border-b border-divider p-4">
      <div>
        <p className="font-semibold">{item.nombre}</p>
        <p className="text-sm text-muted">
          {formatearPrecio(item.precio_unitario)} c/u
        </p>
      </div>
      <div className="flex items-center gap-x-4">
        <div className="flex items-center gap-x-1">
          <ActionButton
            variant="outline"
            className="px-3 py-1"
            aria-label={`Quitar una unidad de ${item.nombre}`}
            onClick={() => cambiarCantidad(item.producto_id, item.cantidad - 1)}
            disabled={item.cantidad <= 1}
          >
            −
          </ActionButton>
          <span className="w-8 text-center">{item.cantidad}</span>
          <ActionButton
            variant="outline"
            className="px-3 py-1"
            aria-label={`Agregar una unidad de ${item.nombre}`}
            onClick={() => cambiarCantidad(item.producto_id, item.cantidad + 1)}
          >
            +
          </ActionButton>
        </div>
        <span className="w-28 text-right font-semibold">
          {formatearPrecio(item.precio_unitario * item.cantidad)}
        </span>
        <ActionButton
          variant="ghost"
          onClick={() => quitar(item.producto_id)}
          aria-label={`Quitar ${item.nombre} del carrito`}
        >
          ✕
        </ActionButton>
      </div>
    </li>
  );
};

export default CarritoItem;
