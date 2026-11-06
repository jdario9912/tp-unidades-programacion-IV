from app.modules.errors import ConflictError, NotFoundError


class EstadoNoEncontradoError(NotFoundError):
    def __init__(self, codigo: str):
        self.codigo = codigo
        super().__init__(f"No existe el estado '{codigo}'")


class FormaPagoNoEncontradaError(NotFoundError):
    def __init__(self, codigo: str):
        self.codigo = codigo
        super().__init__(f"No existe la forma de pago '{codigo}'")


class FormaPagoInactivaError(ConflictError):
    def __init__(self, codigo: str):
        self.codigo = codigo
        super().__init__(f"La forma de pago '{codigo}' no está activa")
