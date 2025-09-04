from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReviewBase(BaseModel):
    reviewee_id: int
    horse_id: int
    rating: int  # 1-5 stars
    title: Optional[str] = None
    comment: Optional[str] = None
    communication_rating: Optional[int] = None
    reliability_rating: Optional[int] = None
    horse_condition_rating: Optional[int] = None
    facility_rating: Optional[int] = None

class ReviewCreate(ReviewBase):
    booking_id: Optional[int] = None

class ReviewResponse(ReviewBase):
    id: int
    reviewer_id: int
    booking_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
