## Crear entorno virtual

```sh
python3 -m venv .venv
```

## Activar entorno

```sh
source .venv/bin/activate
```

## Instalar dependencias

```sh
pip install -r requirements.txt
```

### Levantar servidor

```sh
python -m fastapi dev ./app/main.py
```

Ver documentacion de enpoints en [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
