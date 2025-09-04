from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class OwnerProfile(Base):
    __tablename__ = "owner_profiles"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    stable_name = Column(String, nullable=True)
    phone_public = Column(String, nullable=True)  # Public phone number
    rules_text = Column(Text, nullable=True)  # Stable rules and requirements
    
    # Relationships
    user = relationship("User", back_populates="owner_profile")
    
    def __repr__(self):
        return f"<OwnerProfile {self.stable_name or 'Private Owner'}>"
