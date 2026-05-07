from pydantic import BaseModel, Field


class CategoriaBase(BaseModel):
    nombre: str = Field(..., min_length=2)
    descripcion: str = Field(..., min_length=2)


class CategoriaCreate(CategoriaBase):
    pass


class CategoriaUpdate(CategoriaBase):
    pass


class CategoriaRead(CategoriaBase):
    id: int

    class Config:
        from_attributes = True
