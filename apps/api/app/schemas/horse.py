from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class HorseBase(BaseModel):
    name: str
    breed: str
    age: int
    gender: str
    color: Optional[str] = None
    height: Optional[float] = None
    description: Optional[str] = None
    temperament: Optional[str] = None
    experience_required: str = "beginner"
    disciplines: Optional[str] = None
    price_per_hour: int  # in euro cents
    location_city: str
    location_address: Optional[str] = None
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    photos: Optional[str] = None
    videos: Optional[str] = None
    health_certificate_url: Optional[str] = None
    insurance_info: Optional[str] = None
    special_requirements: Optional[str] = None

class HorseCreate(HorseBase):
    stable_id: Optional[int] = None

class HorseUpdate(BaseModel):
    name: Optional[str] = None
    breed: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    color: Optional[str] = None
    height: Optional[float] = None
    description: Optional[str] = None
    temperament: Optional[str] = None
    experience_required: Optional[str] = None
    disciplines: Optional[str] = None
    is_available: Optional[bool] = None
    price_per_hour: Optional[int] = None
    location_city: Optional[str] = None
    location_address: Optional[str] = None
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    photos: Optional[str] = None
    videos: Optional[str] = None
    health_certificate_url: Optional[str] = None
    insurance_info: Optional[str] = None
    special_requirements: Optional[str] = None
    stable_id: Optional[int] = None

class HorseResponse(HorseBase):
    id: int
    owner_id: int
    stable_id: Optional[int] = None
    is_available: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    average_rating: Optional[float] = None
    price_per_hour_euro: float

    class Config:
        from_attributes = True
