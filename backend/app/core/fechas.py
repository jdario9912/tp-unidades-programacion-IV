from datetime import datetime, timezone


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def inicio_del_dia() -> datetime:
    """Medianoche del día local, en UTC, para comparar con las fechas guardadas."""
    ahora = datetime.now().astimezone()
    return ahora.replace(hour=0, minute=0, second=0, microsecond=0).astimezone(timezone.utc)


def como_utc(fecha: datetime) -> datetime:
    """SQLite devuelve las fechas sin zona horaria: se guardaron en UTC."""
    return fecha if fecha.tzinfo else fecha.replace(tzinfo=timezone.utc)
