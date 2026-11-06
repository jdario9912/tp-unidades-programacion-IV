from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.modules.errors import BadRequestError, ConflictError, ForbiddenError, NotFoundError, UnauthorizedError


async def bad_request_handler(request: Request, exc: BadRequestError) -> JSONResponse:
    return JSONResponse(status_code=400, content={"detail": str(exc)})

async def unauthorized_handler(request: Request, exc: UnauthorizedError) -> JSONResponse:
    return JSONResponse(
        status_code=401, content={"detail": str(exc)}, headers={"WWW-Authenticate": "Bearer"}
    )

async def forbidden_handler(request: Request, exc: ForbiddenError) -> JSONResponse:
    return JSONResponse(status_code=403, content={"detail": str(exc)})

async def conflict_handler(request: Request, exc: ConflictError) -> JSONResponse:
    return JSONResponse(status_code=409, content={"detail": str(exc)})

async def not_found_handler(request: Request, exc: NotFoundError) -> JSONResponse:
    return JSONResponse(status_code=404, content={"detail": str(exc)})


def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(BadRequestError, bad_request_handler)
    app.add_exception_handler(UnauthorizedError, unauthorized_handler)
    app.add_exception_handler(ForbiddenError, forbidden_handler)
    app.add_exception_handler(ConflictError, conflict_handler)
    app.add_exception_handler(NotFoundError, not_found_handler)