from src.modules.errors import ConflictError, NotFoundError

class CodigoProductoDuplicadoError(ConflictError):
    def __init__(self, codigo: str):
        self.codigo = codigo
        super().__init__(f"Ya existe otro producto con el código '{codigo}'")


class ProductoYaInactivoError(ConflictError):
    def __init__(self, id: int):
        self.id = id
        super().__init__(f"El producto {id} ya está desactivado")


class ProductoNoEncontradoError(NotFoundError):
    def __init__(self, id: int):
        self.id = id
        super().__init__(f"No se encontró un producto con el id {id}")