from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MutualMatchResponse(BaseModel):
    id: int
    rider_id: int
    listing_id: int
    score: float
    paid_chat: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class MatchResult(BaseModel):
    listing_id: int
    horse_id: int
    owner_id: int
    score: float
    listing: dict
    horse: dict
    owner: dict
