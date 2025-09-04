from pydantic import BaseModel
from typing import Optional, List
from app.models.rider_profile import RiderProfile

class RiderProfileBase(BaseModel):
    name: str
    photo: Optional[str] = None
    bio: Optional[str] = None
    years_exp: int
    level: str  # beginner, intermediate, advanced
    max_distance_km: int
    budget_min: int  # euro cents
    budget_max: int  # euro cents
    availability: Optional[dict] = None
    style_tags: Optional[List[str]] = None
    tasks_ready: Optional[List[str]] = None
    prefers_bitless: bool = False
    can_trailer: bool = False
    guardian_ok: bool = True

class RiderProfileCreate(RiderProfileBase):
    guardian_name: Optional[str] = None
    guardian_email: Optional[str] = None
    guardian_consent: bool = False

class RiderProfileUpdate(BaseModel):
    name: Optional[str] = None
    photo: Optional[str] = None
    bio: Optional[str] = None
    years_exp: Optional[int] = None
    level: Optional[str] = None
    max_distance_km: Optional[int] = None
    budget_min: Optional[int] = None
    budget_max: Optional[int] = None
    availability: Optional[dict] = None
    style_tags: Optional[List[str]] = None
    tasks_ready: Optional[List[str]] = None
    prefers_bitless: Optional[bool] = None
    can_trailer: Optional[bool] = None
    guardian_ok: Optional[bool] = None
    guardian_name: Optional[str] = None
    guardian_email: Optional[str] = None
    guardian_consent: Optional[bool] = None

class RiderProfileResponse(RiderProfileBase):
    user_id: int
    guardian_name: Optional[str] = None
    guardian_email: Optional[str] = None
    guardian_consent: bool

    class Config:
        from_attributes = True
