from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importamos los endpoints
from app.producto.router import router as producto_router
from app.categoria.router import router as categoria_router
from app.producto_categoria.router import router as producto_categoria_router

app = FastAPI(title="Gestor de Productos - TP2")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(producto_router)
app.include_router(categoria_router)
app.include_router(producto_categoria_router)


@app.get("/")
def root():
    return {"mensaje": "API Gestor de Productos TP3 - ver /docs para documentación"}
