from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey, JSON, Date, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum

class ContributionType(str, enum.Enum):
    MONTH = "month"
    SESSION = "session"

class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    horse_id = Column(Integer, ForeignKey("horses.id"), nullable=False)
    location_postcode = Column(String, nullable=False)
    radius_km = Column(Integer, nullable=False)
    contribution_min = Column(Integer, nullable=False)  # euro cents
    contribution_type = Column(Enum(ContributionType), nullable=False)
    start_date = Column(Date, nullable=False)
    duration_weeks = Column(Integer, nullable=True)
    required_tasks = Column(JSON, nullable=True)  # Array of required tasks
    guidance_required = Column(Boolean, default=False)
    lesson_available = Column(Boolean, default=False)
    material_policy = Column(JSON, nullable=True)  # JSON object with material policies
    photos = Column(JSON, nullable=True)  # Array of photo URLs
    video_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    horse = relationship("Horse", back_populates="listings")
    likes = relationship("Like", back_populates="listing")
    matches = relationship("MutualMatch", back_populates="listing")
    
    def __repr__(self):
        return f"<Listing {self.id} for {self.horse.name}>"
