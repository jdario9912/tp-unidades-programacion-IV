"""
Carga los datos iniciales: el usuario admin, categorías y productos con stock.
Es idempotente: se puede correr varias veces sin duplicar datos.

    python -m app.db.seed
"""

from app.core.config import settings
from app.core.database import create_all_tables
from app.core.security import hash_password
from app.core.unit_of_work import UnitOfWork
from app.modules.categorias.models import Categoria
from app.modules.categorias.repository import CategoriaRepository
from app.modules.productos.models import Producto
from app.modules.productos.repository import ProductoRepository
from app.modules.usuarios.models import Rol, Usuario
from app.modules.usuarios.repository import UsuarioRepository

ADMIN_PASSWORD_DEFAULT = "Admin1234!"

# El username es fijo; el email y la contraseña salen de ADMIN_EMAIL y ADMIN_PASSWORD.
ADMIN = {
    "username": settings.ADMIN_USER,
    "full_name": "Administrador",
    "email": settings.ADMIN_EMAIL,
    "password": settings.ADMIN_PASSWORD,
}

CATEGORIAS = [
    ("Hamburguesas", "Hamburguesas caseras con papas fritas"),
    ("Pizzas", "Pizzas a la piedra, enteras"),
    ("Empanadas", "Empanadas al horno, por unidad"),
    ("Bebidas", "Gaseosas, aguas y cervezas"),
]

# (categoría, nombre, descripción, precio, stock)
PRODUCTOS = [
    ("Hamburguesas", "Hamburguesa clásica", "Carne, queso cheddar, lechuga y tomate", 8500, 30),
    ("Hamburguesas", "Hamburguesa doble bacon", "Doble carne, doble cheddar y panceta", 11200, 20),
    ("Hamburguesas", "Hamburguesa veggie", "Medallón de lentejas, rúcula y alioli", 9000, 15),
    ("Pizzas", "Pizza muzzarella", "Salsa de tomate, muzzarella y aceitunas", 9800, 25),
    ("Pizzas", "Pizza napolitana", "Muzzarella, tomate en rodajas y ajo", 11000, 18),
    ("Pizzas", "Pizza fugazzeta", "Muzzarella y cebolla", 10500, 12),
    ("Empanadas", "Empanada de carne", "Carne cortada a cuchillo", 1500, 100),
    ("Empanadas", "Empanada de jamón y queso", "Jamón cocido y muzzarella", 1400, 80),
    ("Bebidas", "Gaseosa 1.5 L", "Cola, lima-limón o naranja", 3200, 40),
    ("Bebidas", "Agua mineral 500 ml", "Con o sin gas", 1500, 50),
]


def imagen(nombre: str) -> str:
    return f"https://placehold.co/600x400?text={nombre.replace(' ', '+')}"


def cargar_admin(usuarios: UsuarioRepository) -> None:
    if usuarios.get_by_username(ADMIN["username"]):
        return

    usuarios.add(
        Usuario(
            username=ADMIN["username"],
            full_name=ADMIN["full_name"],
            email=ADMIN["email"].strip().lower(),
            hashed_password=hash_password(ADMIN["password"]),
            role=Rol.ADMIN,
        )
    )


def cargar_categorias(categorias: CategoriaRepository) -> dict[str, Categoria]:
    resultado = {}
    for nombre, descripcion in CATEGORIAS:
        categoria = categorias.get_by_nombre(nombre)
        if not categoria:
            categoria = categorias.add(Categoria(nombre=nombre, descripcion=descripcion))
        resultado[nombre] = categoria
    return resultado


def cargar_productos(productos: ProductoRepository, categorias: dict[str, Categoria]) -> None:
    existentes = {p.nombre for p in productos.get_all(limit=1000)}
    for categoria, nombre, descripcion, precio, stock in PRODUCTOS:
        if nombre in existentes:
            continue

        productos.add(
            Producto(
                categoria_id=categorias[categoria].id,
                nombre=nombre,
                descripcion=descripcion,
                precio_base=precio,
                imagen_url=imagen(nombre),
                stock=stock,
            )
        )


def main() -> None:
    create_all_tables()
    with UnitOfWork() as uow:
        cargar_admin(UsuarioRepository(uow.session))
        categorias = cargar_categorias(CategoriaRepository(uow.session))
        cargar_productos(ProductoRepository(uow.session), categorias)
    # una contraseña personalizada no se muestra en la consola
    if ADMIN["password"] == ADMIN_PASSWORD_DEFAULT:
        print(f"Seed completo: {ADMIN['username']} / {ADMIN_PASSWORD_DEFAULT}")
    else:
        print(f"Seed completo: {ADMIN['username']} (contraseña de ADMIN_PASSWORD)")


if __name__ == "__main__":
    main()
