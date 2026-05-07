Para correr:

1 - Correr el contenedor con la db:
docker-compose up -d


2 - Crear el entorno virtual y correrlo:
python -m venv .venv
.venv\Scripts\activate

3 - Instalar dependencias:
pip install -r requirements.txt

4 - Ejecutar migraciones de Alembic:
alembic revision --autogenerate -m "Creacion tabla producto"
alembic upgrade head

5 - Levantar el servidor de desarrollo:
fastapi dev app/main.py
