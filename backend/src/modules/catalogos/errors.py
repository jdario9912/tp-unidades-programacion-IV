from src.modules.errors import ConflictError, NotFoundError


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


class FormaPagoDuplicadaError(ConflictError):
    def __init__(self, codigo: str):
        self.codigo = codigo
        super().__init__(f"Ya existe la forma de pago '{codigo}'")


class FormaPagoEnUsoError(ConflictError):
    def __init__(self, codigo: str):
        self.codigo = codigo
        super().__init__(
            f"La forma de pago '{codigo}' está usada en pedidos y no puede eliminarse; desactivala en su lugar"
        )


class FormaPagoYaActivaError(ConflictError):
    def __init__(self, codigo: str):
        self.codigo = codigo
        super().__init__(f"La forma de pago '{codigo}' ya está activa")


class FormaPagoYaInactivaError(ConflictError):
    def __init__(self, codigo: str):
        self.codigo = codigo
        super().__init__(f"La forma de pago '{codigo}' ya está inactiva")
