class ConflictError(Exception):
    pass


class CodigoDuplicadoError(ConflictError):
    def __init__(self, codigo: str):
        self.codigo = codigo
        super().__init__(f"Ya existe otro proveedor con el código '{codigo}'")


class ProveedorYaInactivoError(ConflictError):
    def __init__(self, id: int):
        self.id = id
        super().__init__(f"El proveedor {id} ya está desactivado")


class NotFoundError(Exception):
    pass


class ProveedorNoEncontradoError(NotFoundError):
    def __init__(self, id: int):
        self.id = id
        super().__init__(f"No se encontró un proveedor con el id {id}")