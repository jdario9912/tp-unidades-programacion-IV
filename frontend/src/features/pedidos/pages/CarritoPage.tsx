import CarritoItem from "@/features/pedidos/components/CarritoItem";
import { useCartStore } from "@/store/cartStore";
import EstadoVacio from "@/shared/components/EstadoVacio";
import ActionButton from "@/shared/ui/action-button";
import Card from "@/shared/ui/card";
import LinkButton from "@/shared/ui/link-button";
import { formatearPrecio } from "@/shared/utils/formato";

const CarritoPage = () => {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());
  const vaciar = useCartStore((s) => s.vaciar);

  return (
    <>
      <h2 className="text-2xl font-bold text-primary p-2 px-4">Carrito</h2>
      {items.length === 0 ? (
        <EstadoVacio mensaje="Tu carrito está vacío.">
          <LinkButton to="/" variant="primary">
            Ver catálogo
          </LinkButton>
        </EstadoVacio>
      ) : (
        <div className="p-4">
          <Card>
            <ul>
              {items.map((item) => (
                <CarritoItem key={item.producto_id} item={item} />
              ))}
            </ul>
            <div className="flex flex-wrap items-center justify-between gap-4 p-4">
              <ActionButton variant="ghost" onClick={vaciar}>
                Vaciar carrito
              </ActionButton>
              <div className="flex items-center gap-x-4">
                <span className="text-lg">
                  Total: <strong>{formatearPrecio(total)}</strong>
                </span>
                <LinkButton to="/checkout" variant="primary">
                  Confirmar pedido
                </LinkButton>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default CarritoPage;
