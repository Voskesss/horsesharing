from sqlalchemy import Column, Integer, String, DateTime, Boolean, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class UserRole(str, enum.Enum):
    RIDER = "rider"
    OWNER = "owner"
    BOTH = "both"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    sub = Column(String, unique=True, index=True, nullable=False)  # Kinde subject ID
    role = Column(Enum(UserRole), nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)
    is_minor = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    rider_profile = relationship("RiderProfile", back_populates="user", uselist=False)
    owner_profile = relationship("OwnerProfile", back_populates="user", uselist=False)
    horses = relationship("Horse", back_populates="owner")
    likes_given = relationship("Like", back_populates="from_user")
    matches_as_rider = relationship("MutualMatch", back_populates="rider")
    messages_sent = relationship("Message", back_populates="from_user")
    reviews_given = relationship("Review", back_populates="reviewer", foreign_keys="Review.reviewer_id")
    reviews_received = relationship("Review", back_populates="reviewee", foreign_keys="Review.reviewee_user_id")
    reports_made = relationship("ModerationReport", back_populates="reporter")
    bookings_as_rider = relationship("Booking", back_populates="rider", foreign_keys="Booking.rider_id")
    bookings_as_owner = relationship("Booking", back_populates="owner", foreign_keys="Booking.owner_id")
    
    def __repr__(self):
        return f"<User {self.email}>"
