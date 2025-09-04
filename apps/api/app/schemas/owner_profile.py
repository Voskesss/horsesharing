from pydantic import BaseModel
from typing import Optional

class OwnerProfileBase(BaseModel):
    stable_name: Optional[str] = None
    phone_public: Optional[str] = None
    rules_text: Optional[str] = None

class OwnerProfileCreate(OwnerProfileBase):
    pass

class OwnerProfileUpdate(BaseModel):
    stable_name: Optional[str] = None
    phone_public: Optional[str] = None
    rules_text: Optional[str] = None

class OwnerProfileResponse(OwnerProfileBase):
    user_id: int

    class Config:
        from_attributes = True
