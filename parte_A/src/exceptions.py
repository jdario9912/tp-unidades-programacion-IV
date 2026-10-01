from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from src.modules.proveedor.errors import ConflictError


async def conflict_handler(request: Request, exc: ConflictError) -> JSONResponse:
    return JSONResponse(status_code=409, content={"detail": str(exc)})


def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(ConflictError, conflict_handler)