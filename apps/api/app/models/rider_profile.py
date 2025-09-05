from sqlalchemy import Column, Integer, String, Text, Boolean, JSON, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class RiderProfile(Base):
    __tablename__ = "rider_profiles"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    
    # Core required fields - minimal for flexibility
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    date_of_birth = Column(String, nullable=True)  # Flexible format
    
    # Address - flexible structure
    address_data = Column(JSON, nullable=True)  # {address, city, postal_code, etc}
    
    # Rider preferences - all flexible JSON for easy finetuning
    experience_data = Column(JSON, nullable=True)  # {level, years, disciplines, etc}
    preferences_data = Column(JSON, nullable=True)  # {age, size, location, distance, etc}
    availability_data = Column(JSON, nullable=True)  # {days, times, frequency, etc}
    goals_data = Column(JSON, nullable=True)  # {description, objectives, etc}
    
    # Media - flexible for future expansion
    media_data = Column(JSON, nullable=True)  # {photos: [], videos: [], etc}
    
    # Meta fields
    is_complete = Column(Boolean, default=False)  # Track completion status
    profile_version = Column(String, default="1.0")  # For future schema changes
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="rider_profile")
    
    def __repr__(self):
        return f"<RiderProfile {self.first_name} {self.last_name}>"
