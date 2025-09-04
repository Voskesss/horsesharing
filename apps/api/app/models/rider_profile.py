from sqlalchemy import Column, Integer, String, Text, Boolean, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class RiderProfile(Base):
    __tablename__ = "rider_profiles"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    name = Column(String, nullable=False)
    photo = Column(String, nullable=True)  # URL to photo
    bio = Column(Text, nullable=True)
    years_exp = Column(Integer, nullable=False)
    level = Column(String, nullable=False)  # beginner, intermediate, advanced
    max_distance_km = Column(Integer, nullable=False)
    budget_min = Column(Integer, nullable=False)  # euro cents
    budget_max = Column(Integer, nullable=False)  # euro cents
    availability = Column(JSON, nullable=True)  # JSON object with schedule
    style_tags = Column(JSON, nullable=True)  # Array of style preferences
    tasks_ready = Column(JSON, nullable=True)  # Array of tasks willing to do
    prefers_bitless = Column(Boolean, default=False)
    can_trailer = Column(Boolean, default=False)
    guardian_ok = Column(Boolean, default=True)  # For minors
    
    # Guardian info for minors
    guardian_name = Column(String, nullable=True)
    guardian_email = Column(String, nullable=True)
    guardian_consent = Column(Boolean, default=False)
    
    # Relationships
    user = relationship("User", back_populates="rider_profile")
    match_preferences = relationship("MatchPreference", back_populates="rider")
    
    def __repr__(self):
        return f"<RiderProfile {self.name}>"
