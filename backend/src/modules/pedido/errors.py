from decimal import Decimal

from src.modules.errors import ConflictError, NotFoundError

class PedidoNoEncontradoError(NotFoundError):
    def __init__(self, id: int):
        self.id = id
        super().__init__(f"No se encontró el pedido con el id {id}")


class FormaPagoNoEncontradaError(NotFoundError):
    def __init__(self, codigo: str):
        self.codigo = codigo
        super().__init__(f"No existe la forma de pago '{codigo}'")


class FormaPagoInactivaError(ConflictError):
    def __init__(self, codigo: str):
        self.codigo = codigo
        super().__init__(f"La forma de pago '{codigo}' no está activa")


class ProductoNoDisponibleError(ConflictError):
    def __init__(self, id: int):
        self.id = id
        super().__init__(f"El producto {id} no está disponible")


class TotalNegativoError(ConflictError):
    def __init__(self, total: Decimal):
        self.total = total
        super().__init__(f"El total del pedido no puede ser negativo ({total})")


class EstadoNoEncontradoError(NotFoundError):
    def __init__(self, codigo: str):
        self.codigo = codigo
        super().__init__(f"No existe el estado '{codigo}'")


class TransicionInvalidaError(ConflictError):
    def __init__(self, desde: str, hacia: str):
        self.desde = desde
        self.hacia = hacia
        super().__init__(f"No se puede pasar el pedido de {desde} a {hacia}")


class PedidoNoModificableError(ConflictError):
    def __init__(self, id: int, estado: str):
        self.id = id
        self.estado = estado
        super().__init__(f"El pedido {id} está en estado {estado} y ya no puede modificarse")
