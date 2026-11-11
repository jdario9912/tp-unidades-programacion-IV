import type { Producto } from "@/features/productos/types/producto";
import { useCartStore } from "@/store/cartStore";
import { notificarExito } from "@/shared/utils/notificaciones";
import { formatearPrecio } from "@/shared/utils/formato";
import ActionButton from "@/shared/ui/action-button";
import Card from "@/shared/ui/card";
import ImagenPreview from "./ImagenPreview";

type Props = {
  producto: Producto;
};

const ProductoCard = ({ producto }: Props) => {
  const agregar = useCartStore((s) => s.agregar);
  const enCarrito = useCartStore(
    (s) =>
      s.items.find((i) => i.producto_id === producto.id)?.cantidad ?? 0,
  );

  const sinStock = producto.stock === 0;
  // no deja sumar al carrito más unidades que las que hay en stock
  const puedeAgregar = producto.disponible && enCarrito < producto.stock;

  const handleAgregar = () => {
    agregar({
      producto_id: producto.id,
      nombre: producto.nombre,
      precio_unitario: producto.precio_base,
    });
    notificarExito(`${producto.nombre} agregado al carrito`);
  };

  return (
    <Card className="flex flex-col overflow-hidden">
      <ImagenPreview
        url={producto.imagen_url ?? ""}
        alt={producto.nombre}
        className="h-40 w-full rounded-none border-0 border-b text-sm"
      />
      <div className="flex flex-1 flex-col gap-y-1 p-4">
        <p className="text-xs text-muted">{producto.categoria.nombre}</p>
        <h3 className="font-semibold">{producto.nombre}</h3>
        {producto.descripcion && (
          <p className="text-sm text-muted">{producto.descripcion}</p>
        )}
        <div className="mt-auto flex items-end justify-between pt-2">
          <span className="text-lg font-bold">
            {formatearPrecio(producto.precio_base)}
          </span>
          <span className="text-xs text-muted">
            {!producto.disponible
              ? "No disponible"
              : sinStock
                ? "Sin stock"
                : `Stock: ${producto.stock}`}
          </span>
        </div>
        <ActionButton
          className="mt-2"
          onClick={handleAgregar}
          disabled={!puedeAgregar}
        >
          {enCarrito > 0
            ? `Agregar al carrito (${enCarrito})`
            : "Agregar al carrito"}
        </ActionButton>
      </div>
    </Card>
  );
};

export default ProductoCard;
