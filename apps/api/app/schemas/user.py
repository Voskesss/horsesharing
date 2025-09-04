from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.user import UserRole

class UserResponse(BaseModel):
    id: int
    sub: str
    role: UserRole
    email: str
    phone: Optional[str] = None
    is_minor: bool
    created_at: datetime

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    role: UserRole
    phone: Optional[str] = None
    is_minor: bool = False

class UserUpdate(BaseModel):
    role: Optional[UserRole] = None
    phone: Optional[str] = None
    is_minor: Optional[bool] = None
