from app.modules.errors import BadRequestError, ConflictError, NotFoundError


class UsuarioDuplicado(ConflictError):
    def __init__(self, campo: str, valor: str):
        super().__init__(f"Ya existe un usuario con el {campo} '{valor}'")


class UsuarioNoEncontrado(NotFoundError):
    def __init__(self, id: int):
        super().__init__(f"No se encontró un usuario con el id {id}")


class AutoDesactivacion(BadRequestError):
    def __init__(self):
        super().__init__("Un administrador no puede desactivarse a sí mismo")
