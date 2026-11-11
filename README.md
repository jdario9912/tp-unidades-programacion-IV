# Food Store: sistema de pedidos de comida

Trabajo Práctico Integrador de Programación 4. Es una aplicación web para un negocio de comidas:

- **Clientes**: se registran, recorren el catálogo, arman un carrito y confirman pedidos con dirección y forma de pago.
- **Administrador**: gestiona categorías, productos, stock, pedidos y usuarios desde un panel.

- **Repositorio**: https://github.com/jdario9912/tpi-programacion-IV
- **Video de demostración**: _(completar con el link público)_

## Stack

| Parte    | Tecnologías                                                                                    |
| -------- | ---------------------------------------------------------------------------------------------- |
| Backend  | Python, FastAPI, SQLModel, PostgreSQL (o SQLite), JWT en cookie HttpOnly, passlib/bcrypt        |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4, TanStack Query/Form/Table, Zustand, Axios, React Router |

## Requisitos

- Python **3.11 a 3.13** (SQLModel 0.0.22 no funciona con 3.14)
- Node.js **20.19** o superior
- pnpm **9** o superior
- PostgreSQL **15** o superior, o Docker para levantarlo con `docker compose`. Para desarrollo también sirve SQLite, sin instalar nada.

## Backend

Todos los comandos se ejecutan desde `backend/`.

### 1. Entorno e instalación

```sh
cd backend
python3.12 -m venv .venv          # o python3.11 / python3.13
source .venv/bin/activate         # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Variables de entorno

```sh
cp .env.example .env
```

| Variable                      | Descripción                                   | Ejemplo                                                |
| ----------------------------- | --------------------------------------------- | ------------------------------------------------------ |
| `DATABASE_URL`                | Conexión a la base (**obligatoria**)          | `postgresql://user:pass@localhost:5432/foodstore_db`   |
| `SECRET_KEY`                  | Firma del JWT, **mínimo 32 caracteres**       | `cambiar-esta-clave-de-al-menos-32-caracteres`         |
| `ALGORITHM`                   | Algoritmo del JWT                             | `HS256`                                                |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Expiración de la cookie y del token (minutos) | `30`                                                   |
| `FRONTEND_ORIGIN`             | Origen permitido en CORS                      | `http://localhost:5173`                                |
| `ADMIN_EMAIL`                 | Email del admin que crea el seed              | `admin@foodstore.com`                                  |
| `ADMIN_PASSWORD`              | Contraseña del admin que crea el seed         | `Admin1234!`                                           |

Para usar SQLite en lugar de PostgreSQL: `DATABASE_URL=sqlite:///./foodstore.db`.

### 3. Base de datos (PostgreSQL con Docker)

El `docker-compose.yml` crea la base `foodstore_db` con el usuario `user` / `pass` en el puerto 5432. Coincide con el `DATABASE_URL` del `.env.example`.

```sh
docker compose up -d
```

Con SQLite este paso no hace falta.

### 4. Datos iniciales (seed)

Crea las tablas, el usuario administrador, 4 categorías y 10 productos con stock. Es idempotente: se puede correr varias veces sin duplicar datos.

```sh
python -m app.db.seed
```

| Usuario del seed | Contraseña   | Rol     |
| ---------------- | ------------ | ------- |
| `admin`          | `Admin1234!` | `admin` |

La contraseña y el email salen de `ADMIN_PASSWORD` y `ADMIN_EMAIL`; los valores de la tabla son los del `.env.example`.

### 5. Ejecutar

```sh
uvicorn app.main:app --reload
```

- API: http://localhost:8000/api/v1
- Documentación: http://localhost:8000/docs (Swagger) y http://localhost:8000/redoc

En `backend/tests/*.http` hay pedidos de ejemplo para la extensión REST Client de VS Code.

## Frontend

Todos los comandos se ejecutan desde `frontend/`.

```sh
cd frontend
cp .env.example .env
pnpm install
pnpm build      # verifica los tipos (TypeScript strict) y genera dist/
pnpm dev
```

Abrir http://localhost:5173.

| Variable       | Descripción                      | Ejemplo                        |
| -------------- | -------------------------------- | ------------------------------ |
| `VITE_API_URL` | URL de la API, con el `/api/v1`  | `http://localhost:8000/api/v1` |

## Funcionalidades

**Cliente** (rol `user`)
- Registro e inicio de sesión. La sesión viaja en la cookie HttpOnly `access_token` y el frontend nunca lee el token.
- Catálogo paginado en el servidor, con búsqueda por nombre y filtro por categoría.
- Carrito que se conserva al recargar la página.
- Checkout con dirección de entrega, forma de pago (efectivo o transferencia) y notas.
- «Mis pedidos», con el detalle de cada uno y la opción de cancelar mientras esté PENDIENTE.

**Administrador** (rol `admin`)
- Resumen con pedidos por estado, pedidos del día e ingresos de los entregados.
- ABM de categorías y productos, con cambio de stock y disponibilidad.
- Gestión de pedidos con la máquina de estados: PENDIENTE → EN_PREPARACION → ENTREGADO, y cancelación desde los estados no terminales.
- Activación y desactivación de usuarios.

**Reglas de negocio**
- El pedido se crea completo o no se crea.
- El stock se descuenta en la misma transacción que crea el pedido y se restituye al cancelarlo.
- Las líneas del pedido copian el nombre y el precio del producto, así que el total no cambia después de creado.

## Estructura

```text
backend/
├── app/
│   ├── main.py           # FastAPI, CORS, routers bajo /api/v1 y manejadores de errores
│   ├── core/             # config, database, security, deps, unit_of_work, base_repository
│   ├── modules/          # auth, usuarios, categorias, productos, pedidos
│   │   └── <módulo>/     # router → service → unit_of_work → repository → models; schemas y errors
│   └── db/seed.py
├── tests/*.http
└── requirements.txt
frontend/src/
├── shared/               # api/ (axiosInstance, client, handleApiError, queryClient), ui/, components/, layout/
├── features/             # auth, categorias, productos, usuarios, pedidos
│   └── <feature>/        # api/ → hooks/ → components/ y pages/; types/
├── store/                # authStore y cartStore (Zustand + persist), tema y notificaciones
└── routes/               # AppRouter y ProtectedRoute
```
