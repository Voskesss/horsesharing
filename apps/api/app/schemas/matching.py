from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class MatchCandidate(BaseModel):
    listing_id: int
    horse_name: str
    horse_photos: List[str]
    owner_name: str
    location: str
    contribution_euro: float
    match_score: float
    distance_km: float
    highlights: List[str]

class MatchScore(BaseModel):
    total_score: float
    availability_score: float
    discipline_score: float
    character_score: float
    task_score: float
    distance_score: float
    material_score: float

class LikeCreate(BaseModel):
    listing_id: int

class LikeResponse(BaseModel):
    id: int
    from_user_id: int
    listing_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class MutualMatchResponse(BaseModel):
    id: int
    rider_id: int
    listing_id: int
    score: float
    created_at: datetime
    paid_chat: bool
    
    class Config:
        from_attributes = True
