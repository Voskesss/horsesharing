from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from app.models.listing import Listing

class ListingBase(BaseModel):
    location_lat: float
    location_lng: float
    location_name: str
    contribution_cents: int
    start_date: date
    end_date: date
    tasks_expected: Optional[List[str]] = None
    availability: Optional[dict] = None
    media_urls: Optional[List[str]] = None
    description: Optional[str] = None

class ListingCreate(ListingBase):
    horse_id: int

class ListingUpdate(BaseModel):
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    location_name: Optional[str] = None
    contribution_cents: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    tasks_expected: Optional[List[str]] = None
    availability: Optional[dict] = None
    media_urls: Optional[List[str]] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class ListingResponse(ListingBase):
    id: int
    horse_id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
