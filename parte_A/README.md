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

### Eliminar el contenedor de la base de datos

```sh
docker rm -f tienda
```
