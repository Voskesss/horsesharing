from sqlalchemy import Column, Integer, DateTime, ForeignKey, Boolean, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class MutualMatch(Base):
    __tablename__ = "mutual_matches"

    id = Column(Integer, primary_key=True, index=True)
    rider_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False)
    score = Column(Float, nullable=False)  # 0-100 match score
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    paid_chat = Column(Boolean, default=False)
    
    # Relationships
    rider = relationship("User", back_populates="matches_as_rider")
    listing = relationship("Listing", back_populates="matches")
    messages = relationship("Message", back_populates="match")
    
    def __repr__(self):
        return f"<MutualMatch {self.rider_id} <-> {self.listing_id}>"
