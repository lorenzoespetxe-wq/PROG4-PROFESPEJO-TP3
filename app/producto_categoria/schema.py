from pydantic import BaseModel


class ProductoCategoriaBase(BaseModel):
    producto_id: int
    categoria_id: int


class ProductoCategoriaCreate(ProductoCategoriaBase):
    pass


class ProductoCategoriaRead(ProductoCategoriaBase):
    id: int

    class Config:
        from_attributes = True
