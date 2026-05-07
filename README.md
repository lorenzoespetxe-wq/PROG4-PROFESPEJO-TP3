# TP3 — Backend FastAPI

## Stack
- **FastAPI** + **SQLModel** + **PostgreSQL** + **Alembic**

## Pasos para ejecutar

### 1. Levantar la base de datos
```bash
docker-compose up -d
```

### 2. Crear y activar entorno virtual
```bash
python -m venv .venv
# Linux/macOS
source .venv/bin/activate
# Windows
.venv\Scripts\activate
```

### 3. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 4. Ejecutar migraciones de Alembic
```bash
alembic revision --autogenerate -m "Crear tablas TP3"
alembic upgrade head
```

### 5. Levantar el servidor
```bash
fastapi dev app/main.py
```

El servidor corre en `http://localhost:8000`.  
Documentación automática: `http://localhost:8000/docs`

## Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /categorias | Listar categorías |
| GET | /categorias/{id} | Obtener categoría |
| POST | /categorias | Crear categoría |
| PUT | /categorias/{id} | Actualizar categoría |
| DELETE | /categorias/{id} | Eliminar categoría |
| GET | /productos | Listar productos |
| GET | /productos/{id} | Obtener producto |
| POST | /productos | Crear producto |
| PUT | /productos/{id} | Actualizar producto |
| DELETE | /productos/{id} | Eliminar producto |
| GET | /producto-categorias | Listar relaciones |
| GET | /producto-categorias/producto/{id} | Categorías de un producto |
| POST | /producto-categorias | Asignar categoría a producto |
| DELETE | /producto-categorias/{id} | Eliminar relación |