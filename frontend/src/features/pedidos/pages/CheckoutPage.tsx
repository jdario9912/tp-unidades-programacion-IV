import CheckoutForm from "@/features/pedidos/components/CheckoutForm";
import { useCartStore } from "@/store/cartStore";
import EstadoVacio from "@/shared/components/EstadoVacio";
import Card from "@/shared/ui/card";
import LinkButton from "@/shared/ui/link-button";
import { formatearPrecio } from "@/shared/utils/formato";

const CheckoutPage = () => {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());

  if (items.length === 0)
    return (
      <EstadoVacio mensaje="No hay productos en el carrito para confirmar.">
        <LinkButton to="/" variant="primary">
          Ver catálogo
        </LinkButton>
      </EstadoVacio>
    );

  return (
    <>
      <h2 className="text-2xl font-bold text-primary p-2 px-4">
        Confirmar pedido
      </h2>
      <div className="grid gap-4 p-4 md:grid-cols-2">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Resumen</h3>
          <ul className="text-sm">
            {items.map((item) => (
              <li
                key={item.producto_id}
                className="flex justify-between border-b border-divider py-1"
              >
                <span>
                  {item.cantidad} × {item.nombre}
                </span>
                <span>{formatearPrecio(item.precio_unitario * item.cantidad)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatearPrecio(total)}</span>
          </p>
          <LinkButton to="/carrito" className="mt-2 inline-block px-0 text-primary">
            Modificar carrito
          </LinkButton>
        </Card>
        <Card>
          <CheckoutForm items={items} />
        </Card>
      </div>
    </>
  );
};

export default CheckoutPage;
