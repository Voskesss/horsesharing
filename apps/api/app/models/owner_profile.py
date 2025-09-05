from sqlalchemy import Column, Integer, String, Text, Boolean, JSON, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class OwnerProfile(Base):
    __tablename__ = "owner_profiles"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    
    # Core required fields - minimal for flexibility
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    
    # Stable info - flexible structure
    stable_data = Column(JSON, nullable=True)  # {name, address, facilities, etc}
    
    # Horses - flexible array for easy management
    horses_data = Column(JSON, nullable=True)  # [{name, age, breed, discipline, etc}, ...]
    
    # Owner preferences and rules - flexible JSON
    preferences_data = Column(JSON, nullable=True)  # {experience_required, rules, etc}
    
    # Media - flexible for future expansion
    media_data = Column(JSON, nullable=True)  # {stable_photos: [], horse_photos: {}, etc}
    
    # Meta fields
    is_complete = Column(Boolean, default=False)  # Track completion status
    profile_version = Column(String, default="1.0")  # For future schema changes
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="owner_profile")
    
    def __repr__(self):
        stable_name = self.stable_data.get('name') if self.stable_data else None
        return f"<OwnerProfile {stable_name or f'{self.first_name} {self.last_name}'}>"
