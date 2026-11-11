# Backend Food Store

Las instrucciones de instalación, configuración y ejecución están en el [README de la raíz](../README.md#backend).

Resumen:

```sh
python3.12 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
docker compose up -d          # opcional: con DATABASE_URL=sqlite:///./foodstore.db no hace falta
python -m app.db.seed         # admin / Admin1234!
uvicorn app.main:app --reload # http://localhost:8000/docs
```

El modelo de datos está en [doc/uml_food_store.md](doc/uml_food_store.md).
