### Crear entorno virtual

```sh
python3 -m venv .venv
```

### Activar entorno

```sh
source .venv/bin/activate
```

### Instalar dependencias

```sh
pip install -r requirements.txt
```

### Levantar servidor

```sh
python -m fastapi dev ./src/main.py
```

Ver documentacion de enpoints en [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### Levantar la base de datos

```sh
docker compose up -d
```

### Cargar datos iniciales

Carga los estados de pedido, las formas de pago, los roles (`admin` y `user`) y el primer administrador (`admin@foodstore.com` / `admin1234`, configurable con `ADMIN_EMAIL` y `ADMIN_PASSWORD` en el `.env`). También se ejecuta solo al levantar el servidor y se puede correr varias veces sin duplicar datos.

```sh
python -m src.seed
```

### Eliminar el contenedor de la base de datos

```sh
docker rm -f tienda
```

### Desactivar entorno de Python

```sh
desactivate
```
