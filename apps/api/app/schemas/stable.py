from pydantic import BaseModel
from typing import Optional

class StableBase(BaseModel):
    name: str
    address: str
    phone: Optional[str] = None
    email: Optional[str] = None
    description: Optional[str] = None

class StableCreate(StableBase):
    pass

class StableUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    description: Optional[str] = None

class StableResponse(StableBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True
