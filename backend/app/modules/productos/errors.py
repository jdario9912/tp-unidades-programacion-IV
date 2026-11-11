from app.modules.errors import NotFoundError


class ProductoNoEncontrado(NotFoundError):
    def __init__(self, id: int):
        super().__init__(f"No se encontró un producto con el id {id}")
