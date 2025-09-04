from pydantic import BaseModel
from datetime import datetime

class LikeCreate(BaseModel):
    listing_id: int

class LikeResponse(BaseModel):
    id: int
    from_user_id: int
    listing_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
