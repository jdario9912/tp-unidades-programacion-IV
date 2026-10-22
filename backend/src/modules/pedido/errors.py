from src.modules.errors import NotFoundError

class PedidoNoEncontradoError(NotFoundError):
    def __init__(self, id: int):
        self.id = id
        super().__init__(f"No se encontró el pedido con el id {id}")