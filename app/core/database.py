import os
from sqlmodel import SQLModel, create_engine, Session

# En un entorno real se usa python-dotenv o pydantic-settings
DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://admin:password@localhost:5432/productos_db"
)

engine = create_engine(DATABASE_URL, echo=True)


# Método para inyectar una sesión al hacer peticiones HTTP:
def get_session():
    with Session(engine) as session:
        yield session
