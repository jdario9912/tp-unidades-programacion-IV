from src.modules.errors import ConflictError, NotFoundError

class ProductoDuplicadoError(ConflictError):
    def __init__(self, nombre: str):
        self.nombre = nombre
        super().__init__(f"Ya existe otro producto con el nombre '{nombre}'")


class ProductoYaInactivoError(ConflictError):
    def __init__(self, id: int):
        self.id = id
        super().__init__(f"El producto {id} ya está desactivado")


class ProductoNoEncontradoError(NotFoundError):
    def __init__(self, id: int):
        self.id = id
        super().__init__(f"No se encontró un producto con el id {id}")

class CategoriaNoEncontradaError(NotFoundError):
    def __init__(self, id: int):
        self.id = id
        super().__init__(f"No se encontró una categoría con el id {id}")

class ProductoCategoriaDuplicadaError(ConflictError):
    def __init__(self, producto_id: int, categoria_id: int):
        self.producto_id = producto_id
        self.categoria_id = categoria_id
        super().__init__(f"El producto {producto_id} ya está asociado a la categoría {categoria_id}")


class ProductoCategoriaNoEncontradaError(NotFoundError):
    def __init__(self, producto_id: int, categoria_id: int):
        self.producto_id = producto_id
        self.categoria_id = categoria_id
        super().__init__(f"El producto {producto_id} no está asociado a la categoría {categoria_id}")
