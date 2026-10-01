from sqlmodel import create_engine

DATABASE_URL="postgresql://user:password@localhost:5432/tienda"

engine = create_engine(DATABASE_URL, echo=True)