from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Stable(Base):
    __tablename__ = "stables"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    # Contact information
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    website = Column(String, nullable=True)
    
    # Location
    address = Column(String, nullable=False)
    city = Column(String, nullable=False)
    postal_code = Column(String, nullable=False)
    country = Column(String, default="Netherlands")
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    
    # Facilities
    facilities = Column(String, nullable=True)  # JSON string: indoor arena, outdoor arena, trails, etc.
    capacity = Column(Integer, nullable=True)  # number of horses
    
    # Media
    photos = Column(String, nullable=True)  # JSON string of photo URLs
    
    # Business info
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="owned_stables")
    horses = relationship("Horse", back_populates="stable")
    
    def __repr__(self):
        return f"<Stable {self.name}>"
