# Sistema de pedidos de comida — ERD

v3.0 · 3FN · Soft-delete · Snapshot · Audit Trail · FK explícitas

## Notación

| Mermaid             | UML original      | Significado                       |
| ------------------- | ----------------- | --------------------------------- |
| línea continua `--` | `*--` composición | `ON DELETE CASCADE`               |
| línea punteada `..` | `o--` asociación  | `ON DELETE RESTRICT` / `SET NULL` |
| `\|\|--o{`          | `"1" -- "0..*"`   | uno a cero o más                  |
| `\|\|--\|{`         | `"1" -- "1..*"`   | uno a uno o más                   |

Los tipos `DECIMAL` llevan la precisión en el comentario porque Mermaid no admite comas en el tipo.
Estereotipos: **Table** entidad mutable · **Link** tabla pivot N:M · **Catalog** catálogo de referencia.

## Diagrama

```mermaid
erDiagram
    %% ═══ Identidad & Acceso ═══
    Usuario {
        BIGSERIAL id PK
        VARCHAR(80) nombre "NN"
        VARCHAR(80) apellido "NN"
        VARCHAR(254) email UK "NN"
        VARCHAR(20) celular
        CHAR(60) password_hash "NN"
        TIMESTAMPTZ created_at "NN"
        TIMESTAMPTZ updated_at "NN"
        TIMESTAMPTZ deleted_at
    }

    Rol {
        BIGSERIAL id PK
        VARCHAR(50) nombre UK "NN"
        TEXT descripcion
    }

    UsuarioRol {
        BIGINT usuario_id PK, FK
        BIGINT rol_id PK, FK
        BIGINT asignado_por_id FK "a Usuario.id"
        TIMESTAMPTZ expires_at
        TIMESTAMPTZ created_at "NN"
    }

    DireccionEntrega {
        BIGSERIAL id PK
        BIGINT usuario_id FK "NN"
        VARCHAR(80) etiqueta
        TEXT linea1 "NN"
        TEXT linea2
        VARCHAR(100) ciudad "NN"
        DECIMAL latitud "(9,6)"
        DECIMAL longitud "(9,6)"
        BOOLEAN es_principal "NN, DEFAULT false"
        TIMESTAMPTZ created_at "NN"
        TIMESTAMPTZ updated_at "NN"
        TIMESTAMPTZ deleted_at
    }

    %% ═══ Catálogo de Productos ═══
    Categoria {
        BIGSERIAL id PK
        VARCHAR(100) nombre UK "NN"
        TEXT descripcion "NN, DEFAULT 0"
        TIMESTAMPTZ created_at "NN"
        TIMESTAMPTZ updated_at "NN"
        TIMESTAMPTZ deleted_at
    }

    Producto {
        BIGSERIAL id PK
        VARCHAR(150) nombre "NN"
        TEXT descripcion
        DECIMAL precio_base "(10,2) NN, CHECK >= 0"
        TEXT[] imagenes_url
        BOOLEAN disponible "NN, DEFAULT true"
        TIMESTAMPTZ created_at "NN"
        TIMESTAMPTZ updated_at "NN"
        TIMESTAMPTZ deleted_at
    }

    ProductoCategoria {
        BIGINT producto_id PK, FK
        BIGINT categoria_id PK, FK
        BOOLEAN es_principal "NN, DEFAULT false"
        TIMESTAMPTZ created_at "NN"
    }

    Ingrediente {
        BIGSERIAL id PK
        VARCHAR(100) nombre "NN"
        TIMESTAMPTZ created_at "NN"
        TIMESTAMPTZ updated_at "NN"
        TIMESTAMPTZ deleted_at
    }

    ProductoIngrediente {
        BIGINT producto_id PK, FK
        BIGINT ingrediente_id PK, FK
        TIMESTAMPTZ created_at "NN"
    }

    %% ═══ Ventas & Transacciones ═══
    FormaPago {
        VARCHAR(30) codigo PK
        VARCHAR(80) descripcion "NN"
        BOOLEAN activo "NN, DEFAULT true"
    }

    EstadoPedido {
        VARCHAR(20) codigo PK
        VARCHAR(80) descripcion "NN"
        INT orden "NN"
        BOOLEAN es_terminal "NN"
    }

    Pedido {
        BIGSERIAL id PK
        BIGINT usuario_id FK "NN"
        BIGINT direccion_id FK "SET NULL"
        VARCHAR(20) estado_codigo FK "NN"
        VARCHAR(30) forma_pago_codigo FK "NN"
        DECIMAL subtotal "(10,2) NN, snap"
        DECIMAL descuento "(10,2) NN, DEFAULT 0, snap"
        DECIMAL costo_envio "(10,2) NN, DEFAULT 0, snap"
        DECIMAL total "(10,2) NN, CHECK >= 0, snap"
        TEXT notas
        TIMESTAMPTZ created_at "NN"
        TIMESTAMPTZ updated_at "NN"
        TIMESTAMPTZ deleted_at
    }

    DetallePedido {
        BIGINT pedido_id PK, FK "CASCADE"
        BIGINT producto_id PK, FK "RESTRICT"
        SMALLINT cantidad "NN, CHECK >= 1"
        VARCHAR(150) nombre_producto_snap "NN, snap"
        DECIMAL precio_unitario_snap "(10,2) NN, CHECK >= 0, snap"
        DECIMAL subtotal_snap "(10,2) NN, snap"
        JSONB personalizacion
        TIMESTAMPTZ created_at "NN, inmutable"
    }

    HistorialEstadoPedido {
        BIGSERIAL id PK
        BIGINT pedido_id FK "NN, CASCADE"
        VARCHAR(20) estado_desde FK "NULL = inicial"
        VARCHAR(20) estado_hacia FK "NN"
        BIGINT usuario_id FK
        TEXT motivo
        TIMESTAMPTZ created_at "NN, append-only"
    }

    %% ═══ Relaciones: Identidad ═══
    Usuario ||--o{ DireccionEntrega : tiene
    Usuario ||--o{ UsuarioRol : posee
    Rol ||..o{ UsuarioRol : agrupa
    Usuario ||..o{ UsuarioRol : asignado_por

    %% ═══ Relaciones: Catálogo ═══
    Producto ||--|{ ProductoCategoria : clasifica
    Categoria ||..o{ ProductoCategoria : agrupa
    Producto ||--o{ ProductoIngrediente : contiene
    Ingrediente ||..o{ ProductoIngrediente : compone

    %% ═══ Relaciones: Ventas ═══
    Usuario ||..o{ Pedido : realiza
    DireccionEntrega ||..o{ Pedido : destino
    EstadoPedido ||..o{ Pedido : "en estado"
    FormaPago ||..o{ Pedido : "pagado con"
    Pedido ||--|{ DetallePedido : contiene
    Producto ||..o{ DetallePedido : referenciado

    %% ═══ Relaciones: Trazabilidad ═══
    Pedido ||--o{ HistorialEstadoPedido : historial
    EstadoPedido ||..o{ HistorialEstadoPedido : desde
    EstadoPedido ||..o{ HistorialEstadoPedido : hacia
    Usuario ||..o{ HistorialEstadoPedido : modifico
```

## Dominios

| Dominio                | Tablas                                                                                                                      |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Identidad & Acceso     | `Usuario` (Table), `Rol` (Catalog), `UsuarioRol` (Link), `DireccionEntrega` (Table)                                         |
| Catálogo de Productos  | `Categoria` (Table), `Producto` (Table), `ProductoCategoria` (Link), `Ingrediente` (Table), `ProductoIngrediente` (Link)    |
| Ventas & Transacciones | `FormaPago` (Catalog), `EstadoPedido` (Catalog), `Pedido` (Table), `DetallePedido` (Table), `HistorialEstadoPedido` (Table) |

## Notas

**Producto**: stock excluido, pertenece al dominio INVENTARIO (SRP).

**Ingrediente**: el nombre es único entre los ingredientes activos (se valida en el servicio, no en la DB, por el soft delete). No se puede eliminar mientras esté asociado a un producto activo.

**ProductoIngrediente**: tabla pivot N:M sin `updated_at`. Al quitar un ingrediente de un producto la fila se borra físicamente.

**EstadoPedido**: valores del catálogo.

| codigo     | orden | es_terminal |
| ---------- | ----- | ----------- |
| PENDIENTE  | 1     | false       |
| CONFIRMADO | 2     | false       |
| EN_PREP    | 3     | false       |
| EN_CAMINO  | 4     | false       |
| ENTREGADO  | 5     | **true**    |
| CANCELADO  | 6     | **true**    |

**DetallePedido**: fila inmutable, sin `updated_at`. `personalizacion` es un JSONB con los ingredientes removidos/agregados.

**HistorialEstadoPedido**:

- Append-only: solo INSERT, nunca UPDATE ni DELETE.
- `estado_desde = NULL`: transición inicial.
- Reconstruir: `ORDER BY created_at ASC`.
- Validar `es_terminal` antes del INSERT.
