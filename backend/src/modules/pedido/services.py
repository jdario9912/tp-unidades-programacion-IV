from decimal import Decimal

from sqlmodel import Session

from src.modules.producto.errors import ProductoNoEncontradoError
from .unit_of_work import PedidoUnitOfWork

from .errors import (
    FormaPagoInactivaError,
    FormaPagoNoEncontradaError,
    ProductoNoDisponibleError,
    TotalNegativoError,
)
from .schemas import PedidoCreate, PedidoRead
from .models import DetallePedido, HistorialEstadoPedido, Pedido

ESTADO_INICIAL = "PENDIENTE"
CENTAVOS = Decimal("0.01")


class PedidoService:
    def __init__(self, session: Session) -> None:
        self._session = session

    def crear(self, data: PedidoCreate) -> PedidoRead:
        with PedidoUnitOfWork(self._session) as uow:
            forma_pago = uow.formas_pago.get_by_codigo(data.forma_pago_codigo)
            if not forma_pago:
                raise FormaPagoNoEncontradaError(data.forma_pago_codigo)
            if not forma_pago.activo:
                raise FormaPagoInactivaError(data.forma_pago_codigo)

            productos = {}
            for item in data.detalles:
                producto = uow.productos.get_by_id(item.producto_id)
                if not producto:
                    raise ProductoNoEncontradoError(item.producto_id)
                if not producto.disponible:
                    raise ProductoNoDisponibleError(item.producto_id)
                productos[item.producto_id] = producto

            pedido = Pedido(
                estado_codigo=ESTADO_INICIAL,
                forma_pago_codigo=data.forma_pago_codigo,
                descuento=data.descuento,
                costo_envio=data.costo_envio,
                notas=data.notas,
                subtotal=Decimal("0"),
                total=Decimal("0"),
            )
            uow.pedidos.add(pedido)

            subtotal = Decimal("0")
            for item in data.detalles:
                producto = productos[item.producto_id]
                precio = Decimal(str(producto.precio_base)).quantize(CENTAVOS)
                detalle = DetallePedido(
                    pedido_id=pedido.id,
                    producto_id=producto.id,
                    cantidad=item.cantidad,
                    nombre_producto_snap=producto.nombre,
                    precio_unitario_snap=precio,
                    subtotal_snap=precio * item.cantidad,
                    personalizacion=item.personalizacion,
                )
                uow.pedidos.session.add(detalle)
                subtotal += detalle.subtotal_snap

            total = subtotal - data.descuento + data.costo_envio
            if total < 0:
                raise TotalNegativoError(total)
            pedido.subtotal = subtotal
            pedido.total = total
            uow.pedidos.add(pedido)

            uow.historial.add(
                HistorialEstadoPedido(pedido_id=pedido.id, estado_desde=None, estado_hacia=ESTADO_INICIAL)
            )

            resultado = PedidoRead.model_validate(pedido)
        return resultado
