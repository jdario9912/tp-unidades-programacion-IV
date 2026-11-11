# Food Store: modelo de datos

Reproduce el diagrama UML de la consigna (UML_FOOD_STORE). Las restricciones de largo y rango (`>= 0`, `2..100`) se validan en los schemas y en el Service, no con CHECK en la base.

## Diagrama

```mermaid
erDiagram
    Usuario {
        int id PK
        str username "UQ, NN"
        str full_name "NN"
        str email "UQ, NN"
        str hashed_password "NN"
        Rol role "enum: user | admin, default user"
        bool disabled "default false"
        datetime created_at "NN"
    }

    Categoria {
        int id PK
        str nombre "UQ, NN, 2..100"
        str descripcion
        bool activo "default true"
    }

    Producto {
        int id PK
        int categoria_id FK "NN"
        str nombre "NN"
        str descripcion
        float precio_base "NN, >= 0"
        str imagen_url
        int stock "default 0, >= 0"
        bool disponible "default true"
        bool activo "default true"
    }

    Pedido {
        int id PK
        int usuario_id FK "NN"
        str estado "default PENDIENTE"
        str forma_pago "EFECTIVO | TRANSFERENCIA"
        str direccion_entrega "NN, 5..200"
        str notas
        float total "NN"
        datetime created_at "NN"
        datetime updated_at "NN"
    }

    DetallePedido {
        int id PK
        int pedido_id FK "NN"
        int producto_id FK "NN"
        int cantidad "NN, >= 1"
        str nombre_producto "NN, copia"
        float precio_unitario "NN, copia"
        float subtotal "NN"
    }

    Categoria ||--o{ Producto : "productos / categoria"
    Usuario ||--o{ Pedido : "pedidos / usuario"
    Pedido ||--|{ DetallePedido : "items / pedido"
    Producto ||--o{ DetallePedido : "detalles / producto"
```

## Relaciones

| Relación                   | Atributos                                  |
| -------------------------- | ------------------------------------------ |
| Categoria 1:N Producto     | `Categoria.productos` y `Producto.categoria` |
| Usuario 1:N Pedido         | `Usuario.pedidos` y `Pedido.usuario`       |
| Pedido 1:N DetallePedido   | `Pedido.items` y `DetallePedido.pedido`    |
| Producto 1:N DetallePedido | `Producto.detalles` y `DetallePedido.producto` |

## Reglas

- **Baja lógica**: `Usuario.disabled`, `Categoria.activo` y `Producto.activo`. Los pedidos no se borran: se cancelan.
- La baja de una categoría no libera su nombre ni oculta sus productos.
- Un producto se vende solo si está activo, disponible y con `stock >= cantidad` (RN-01).
- El stock se descuenta al crear el pedido (RN-01) y se restituye al cancelarlo (RN-03), en la misma transacción.
- `DetallePedido` es inmutable: copia `nombre_producto` y `precio_unitario`, y `subtotal = precio_unitario × cantidad`. `Pedido.total` es la suma de los subtotales y no cambia (RN-05).
- Un producto no se repite en el mismo pedido (RN-01).

## Estados del pedido (RN-02)

```mermaid
stateDiagram-v2
    [*] --> PENDIENTE
    PENDIENTE --> EN_PREPARACION : admin
    PENDIENTE --> CANCELADO : admin o dueño
    EN_PREPARACION --> ENTREGADO : admin
    EN_PREPARACION --> CANCELADO : admin
    ENTREGADO --> [*]
    CANCELADO --> [*]
```
