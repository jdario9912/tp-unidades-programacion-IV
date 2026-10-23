from decimal import Decimal
from typing import List, Optional

from sqlmodel import Session

from src.modules.producto.errors import ProductoNoEncontradoError
from .unit_of_work import PedidoUnitOfWork

from .errors import (
    EstadoNoEncontradoError,
    FormaPagoInactivaError,
    FormaPagoNoEncontradaError,
    PedidoNoEncontradoError,
    PedidoNoModificableError,
    ProductoNoDisponibleError,
    TotalNegativoError,
    TransicionInvalidaError,
)
from .schemas import (
    HistorialEstadoPedidoRead,
    PedidoCreate,
    PedidoEstadoUpdate,
    PedidoRead,
    PedidoUpdate,
)
from .models import DetallePedido, HistorialEstadoPedido, Pedido

ESTADO_INICIAL = "PENDIENTE"
CENTAVOS = Decimal("0.01")

# Transiciones permitidas. Los estados terminales (ENTREGADO, CANCELADO) no tienen salida.
TRANSICIONES = {
    "PENDIENTE": {"CONFIRMADO", "CANCELADO"},
    "CONFIRMADO": {"EN_PREP", "CANCELADO"},
    "EN_PREP": {"EN_CAMINO", "CANCELADO"},
    "EN_CAMINO": {"ENTREGADO"},
}


class PedidoService:
    def __init__(self, session: Session) -> None:
        self._session = session

    @staticmethod
    def _validar_forma_pago(uow: PedidoUnitOfWork, codigo: str) -> None:
        forma_pago = uow.formas_pago.get_by_codigo(codigo)
        if not forma_pago:
            raise FormaPagoNoEncontradaError(codigo)
        if not forma_pago.activo:
            raise FormaPagoInactivaError(codigo)

    def crear(self, data: PedidoCreate) -> PedidoRead:
        with PedidoUnitOfWork(self._session) as uow:
            self._validar_forma_pago(uow, data.forma_pago_codigo)

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

    def obtener_todos(
        self, skip: int = 0, limit: int = 10, estado: Optional[str] = None
    ) -> List[PedidoRead]:
        with PedidoUnitOfWork(self._session) as uow:
            pedidos = uow.pedidos.listar_con_detalles(skip, limit, estado)
            return [PedidoRead.model_validate(p) for p in pedidos]

    def obtener_por_id(self, id: int) -> PedidoRead:
        with PedidoUnitOfWork(self._session) as uow:
            pedido = uow.pedidos.get_by_id_con_detalles(id)
            if not pedido:
                raise PedidoNoEncontradoError(id)

            return PedidoRead.model_validate(pedido)

    def actualizar(self, id: int, data: PedidoUpdate) -> PedidoRead:
        """Solo se puede modificar un pedido PENDIENTE."""
        with PedidoUnitOfWork(self._session) as uow:
            pedido = uow.pedidos.get_by_id(id)
            if not pedido:
                raise PedidoNoEncontradoError(id)
            if pedido.estado_codigo != ESTADO_INICIAL:
                raise PedidoNoModificableError(id, pedido.estado_codigo)

            cambios = data.model_dump(exclude_unset=True)
            # forma_pago_codigo es obligatoria en la tabla: un null explícito se ignora.
            if cambios.get("forma_pago_codigo") is None:
                cambios.pop("forma_pago_codigo", None)
            else:
                self._validar_forma_pago(uow, cambios["forma_pago_codigo"])

            for key, value in cambios.items():
                setattr(pedido, key, value)

            pedido = uow.pedidos.add(pedido)
            resultado = PedidoRead.model_validate(pedido)
        return resultado

    def cambiar_estado(self, id: int, data: PedidoEstadoUpdate) -> PedidoRead:
        """Cambia el estado y registra la transición en el historial, en la misma transacción."""
        with PedidoUnitOfWork(self._session) as uow:
            pedido = uow.pedidos.get_by_id(id)
            if not pedido:
                raise PedidoNoEncontradoError(id)

            if not uow.estados.get_by_codigo(data.estado_codigo):
                raise EstadoNoEncontradoError(data.estado_codigo)

            actual = uow.estados.get_by_codigo(pedido.estado_codigo)
            if actual.es_terminal or data.estado_codigo not in TRANSICIONES.get(actual.codigo, set()):
                raise TransicionInvalidaError(actual.codigo, data.estado_codigo)

            pedido.estado_codigo = data.estado_codigo
            uow.pedidos.add(pedido)
            uow.historial.add(
                HistorialEstadoPedido(
                    pedido_id=pedido.id,
                    estado_desde=actual.codigo,
                    estado_hacia=data.estado_codigo,
                    motivo=data.motivo,
                )
            )

            resultado = PedidoRead.model_validate(pedido)
        return resultado

    def listar_historial(self, id: int) -> List[HistorialEstadoPedidoRead]:
        with PedidoUnitOfWork(self._session) as uow:
            if not uow.pedidos.get_by_id(id):
                raise PedidoNoEncontradoError(id)

            return [HistorialEstadoPedidoRead.model_validate(h) for h in uow.historial.listar_de_pedido(id)]

    def borrar(self, id: int) -> None:
        with PedidoUnitOfWork(self._session) as uow:
            pedido = uow.pedidos.get_by_id(id)
            if not pedido:
                raise PedidoNoEncontradoError(id)

            uow.pedidos.delete(pedido)
