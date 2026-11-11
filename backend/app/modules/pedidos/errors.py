from app.modules.errors import BadRequestError, ForbiddenError, NotFoundError


class PedidoNoEncontrado(NotFoundError):
    def __init__(self, id: int):
        super().__init__(f"No se encontró el pedido con el id {id}")


class PedidoAjeno(ForbiddenError):
    def __init__(self, id: int):
        super().__init__(f"El pedido {id} pertenece a otro usuario")


class ProductoRepetido(BadRequestError):
    def __init__(self, producto_id: int):
        super().__init__(f"El producto {producto_id} está repetido en el pedido; usá la cantidad")


class ProductoNoDisponible(BadRequestError):
    def __init__(self, nombre: str):
        super().__init__(f"El producto '{nombre}' no está disponible")


class StockInsuficiente(BadRequestError):
    def __init__(self, nombre: str, disponible: int, pedido: int):
        super().__init__(f"Stock insuficiente de '{nombre}': hay {disponible} y se pidieron {pedido}")


class TransicionInvalida(BadRequestError):
    def __init__(self, desde: str, hacia: str):
        super().__init__(f"No se puede pasar el pedido de {desde} a {hacia}")


class PedidoNoCancelable(BadRequestError):
    def __init__(self, estado: str):
        super().__init__(f"Solo se puede cancelar un pedido PENDIENTE; este está {estado}")
