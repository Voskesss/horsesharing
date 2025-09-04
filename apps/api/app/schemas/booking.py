from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.booking import BookingStatus

class BookingBase(BaseModel):
    horse_id: int
    start_time: datetime
    end_time: datetime
    rider_notes: Optional[str] = None

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    status: Optional[BookingStatus] = None
    owner_notes: Optional[str] = None
    cancellation_reason: Optional[str] = None

class BookingResponse(BookingBase):
    id: int
    rider_id: int
    owner_id: int
    duration_hours: int
    price_per_hour: int
    total_price: int
    status: BookingStatus
    owner_notes: Optional[str] = None
    cancellation_reason: Optional[str] = None
    stripe_payment_intent_id: Optional[str] = None
    is_paid: bool
    payment_date: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    total_price_euro: float
    price_per_hour_euro: float

    class Config:
        from_attributes = True
