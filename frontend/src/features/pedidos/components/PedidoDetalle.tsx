import type { Pedido } from "@/features/pedidos/types/pedido";
import { formatearPrecio } from "@/shared/utils/formato";

type Props = {
  pedido: Pedido;
};

const PedidoDetalle = ({ pedido }: Props) => (
  <div className="flex flex-col gap-y-3 text-sm">
    <table className="w-full">
      <thead>
        <tr className="text-left text-muted">
          <th className="py-1 font-normal">Producto</th>
          <th className="py-1 text-right font-normal">Cant.</th>
          <th className="py-1 text-right font-normal">Precio</th>
          <th className="py-1 text-right font-normal">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {pedido.items.map((item) => (
          <tr key={item.producto_id} className="border-t border-divider">
            <td className="py-1">{item.nombre_producto}</td>
            <td className="py-1 text-right">{item.cantidad}</td>
            <td className="py-1 text-right">
              {formatearPrecio(item.precio_unitario)}
            </td>
            <td className="py-1 text-right">{formatearPrecio(item.subtotal)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="border-t border-divider font-bold">
          <td colSpan={3} className="py-1">
            Total
          </td>
          <td className="py-1 text-right">{formatearPrecio(pedido.total)}</td>
        </tr>
      </tfoot>
    </table>
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
      <dt className="text-muted">Entrega</dt>
      <dd>{pedido.direccion_entrega}</dd>
      <dt className="text-muted">Pago</dt>
      <dd>{pedido.forma_pago === "EFECTIVO" ? "Efectivo" : "Transferencia"}</dd>
      {pedido.notas && (
        <>
          <dt className="text-muted">Notas</dt>
          <dd>{pedido.notas}</dd>
        </>
      )}
    </dl>
  </div>
);

export default PedidoDetalle;
