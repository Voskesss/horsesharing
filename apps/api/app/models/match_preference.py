from sqlalchemy import Column, Integer, Boolean, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class MatchPreference(Base):
    __tablename__ = "match_preferences"

    id = Column(Integer, primary_key=True, index=True)
    rider_id = Column(Integer, ForeignKey("rider_profiles.user_id"), nullable=False)
    goals = Column(JSON, nullable=True)  # Array of riding goals
    seasons = Column(JSON, nullable=True)  # Array of preferred seasons
    weather_ok_evening = Column(Boolean, default=True)
    
    # Relationships
    rider = relationship("RiderProfile", back_populates="match_preferences")
    
    def __repr__(self):
        return f"<MatchPreference {self.id}>"
