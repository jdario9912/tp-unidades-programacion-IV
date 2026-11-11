from typing import Optional

from app.core.fechas import inicio_del_dia
from app.modules.productos.errors import ProductoNoEncontrado
from app.modules.usuarios.models import Rol, Usuario
from .errors import (
    PedidoAjeno,
    PedidoNoCancelable,
    PedidoNoEncontrado,
    ProductoNoDisponible,
    ProductoRepetido,
    StockInsuficiente,
    TransicionInvalida,
)
from .models import (
    ESTADO_CANCELADO,
    ESTADO_EN_PREPARACION,
    ESTADO_ENTREGADO,
    ESTADO_PENDIENTE,
    DetallePedido,
    Pedido,
)
from .schemas import CambioEstado, PedidoCreate, PedidoRead, PedidosPaginados, ResumenPedidos
from .unit_of_work import PedidoUnitOfWork

# RN-02. ENTREGADO y CANCELADO son terminales: no tienen salida.
TRANSICIONES: dict[str, set[str]] = {
    ESTADO_PENDIENTE: {ESTADO_EN_PREPARACION, ESTADO_CANCELADO},
    ESTADO_EN_PREPARACION: {ESTADO_ENTREGADO, ESTADO_CANCELADO},
    ESTADO_ENTREGADO: set(),
    ESTADO_CANCELADO: set(),
}


class PedidoService:
    def __init__(self, uow: PedidoUnitOfWork) -> None:
        self.uow = uow

    def crear(self, data: PedidoCreate, usuario: Usuario) -> PedidoRead:
        """RN-01: todo en una transacción; si falla una validación no se persiste nada."""
        with self.uow as uow:
            vistos: set[int] = set()
            for item in data.items:
                if item.producto_id in vistos:
                    raise ProductoRepetido(item.producto_id)
                vistos.add(item.producto_id)

            pedido = Pedido(
                usuario_id=usuario.id,
                estado=ESTADO_PENDIENTE,
                forma_pago=data.forma_pago,
                direccion_entrega=data.direccion_entrega.strip(),
                notas=data.notas,
                total=0,
            )
            uow.pedidos.add(pedido)

            total = 0.0
            for item in data.items:
                producto = uow.productos.get_for_update(item.producto_id)
                if not producto or not producto.activo:
                    raise ProductoNoEncontrado(item.producto_id)
                if not producto.disponible:
                    raise ProductoNoDisponible(producto.nombre)
                if producto.stock < item.cantidad:
                    raise StockInsuficiente(producto.nombre, producto.stock, item.cantidad)

                producto.stock -= item.cantidad
                uow.productos.add(producto)

                # RN-05: la línea guarda una copia del nombre y del precio.
                subtotal = round(producto.precio_base * item.cantidad, 2)
                uow.session.add(
                    DetallePedido(
                        pedido_id=pedido.id,
                        producto_id=producto.id,
                        cantidad=item.cantidad,
                        nombre_producto=producto.nombre,
                        precio_unitario=producto.precio_base,
                        subtotal=subtotal,
                    )
                )
                total += subtotal

            pedido.total = round(total, 2)
            uow.pedidos.add(pedido)
            return PedidoRead.model_validate(pedido)

    def listar(
        self, usuario: Usuario, skip: int = 0, limit: int = 20, estado: Optional[str] = None
    ) -> PedidosPaginados:
        """RN-04: el admin ve todos; el resto, solo los propios."""
        with self.uow as uow:
            usuario_id = None if usuario.role == Rol.ADMIN else usuario.id
            total, pedidos = uow.pedidos.list_by_usuario(usuario_id, skip, limit, estado)
            return PedidosPaginados(total=total, items=[PedidoRead.model_validate(p) for p in pedidos])

    def resumen(self) -> ResumenPedidos:
        with self.uow as uow:
            conteos = uow.pedidos.count_by_estado()
            return ResumenPedidos(
                pendientes=conteos.get(ESTADO_PENDIENTE, 0),
                en_preparacion=conteos.get(ESTADO_EN_PREPARACION, 0),
                entregados=conteos.get(ESTADO_ENTREGADO, 0),
                cancelados=conteos.get(ESTADO_CANCELADO, 0),
                pedidos_hoy=uow.pedidos.count_desde(inicio_del_dia()),
                ingresos_entregados=uow.pedidos.sum_total_entregados(),
            )

    def obtener(self, id: int, usuario: Usuario) -> PedidoRead:
        with self.uow as uow:
            pedido = self._obtener(uow, id)
            if usuario.role != Rol.ADMIN and pedido.usuario_id != usuario.id:
                raise PedidoAjeno(id)

            return PedidoRead.model_validate(pedido)

    def cambiar_estado(self, id: int, data: CambioEstado) -> PedidoRead:
        """Admin: avanza o cancela según la máquina de estados (RN-02, RN-03)."""
        with self.uow as uow:
            pedido = self._obtener(uow, id)
            self._transicionar(uow, pedido, data.estado)
            return PedidoRead.model_validate(pedido)

    def cancelar(self, id: int, usuario: Usuario) -> PedidoRead:
        """Dueño: cancela su pedido solo si está PENDIENTE (RN-03, RN-04)."""
        with self.uow as uow:
            pedido = self._obtener(uow, id)
            if pedido.usuario_id != usuario.id:
                raise PedidoAjeno(id)
            if pedido.estado != ESTADO_PENDIENTE:
                raise PedidoNoCancelable(pedido.estado)

            self._transicionar(uow, pedido, ESTADO_CANCELADO)
            return PedidoRead.model_validate(pedido)

    @staticmethod
    def _obtener(uow: PedidoUnitOfWork, id: int) -> Pedido:
        pedido = uow.pedidos.get_by_id(id)
        if not pedido:
            raise PedidoNoEncontrado(id)
        return pedido

    @staticmethod
    def _transicionar(uow: PedidoUnitOfWork, pedido: Pedido, hacia: str) -> None:
        """Valida la transición antes de modificar el pedido. Al cancelar restituye el stock."""
        if hacia not in TRANSICIONES[pedido.estado]:
            raise TransicionInvalida(pedido.estado, hacia)

        if hacia == ESTADO_CANCELADO:
            for item in pedido.items:
                producto = uow.productos.get_for_update(item.producto_id)
                if producto:
                    producto.stock += item.cantidad
                    uow.productos.add(producto)

        pedido.estado = hacia
        uow.pedidos.add(pedido)
