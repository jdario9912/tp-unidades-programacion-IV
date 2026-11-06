from app.modules.errors import ConflictError, NotFoundError

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


class ProductoIngredienteDuplicadoError(ConflictError):
    def __init__(self, producto_id: int, ingrediente_id: int):
        self.producto_id = producto_id
        self.ingrediente_id = ingrediente_id
        super().__init__(f"El producto {producto_id} ya tiene el ingrediente {ingrediente_id}")


class ProductoIngredienteNoEncontradoError(NotFoundError):
    def __init__(self, producto_id: int, ingrediente_id: int):
        self.producto_id = producto_id
        self.ingrediente_id = ingrediente_id
        super().__init__(f"El producto {producto_id} no tiene el ingrediente {ingrediente_id}")
