from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.core.database import crear_tablas
from src.modules.producto.routers import router as producto_router
from src.modules.categoria.routers import router as categoria_router
from .exceptions_handler import register_exception_handlers

@asynccontextmanager
async def lifespan(app: FastAPI):
    crear_tablas()
    yield

def create_app() -> FastAPI:
    app = FastAPI(
        title="API Integradora - Unidad 1",
        description="Conceptos: Path, Query, Body, Pydantic, Errores.",
        version="1.0.0",
        lifespan=lifespan
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    app.include_router(producto_router)
    app.include_router(categoria_router)
    register_exception_handlers(app)
    return app

app = create_app()
