from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class BookingStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    
    # Participants
    rider_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    horse_id = Column(Integer, ForeignKey("horses.id"), nullable=False)
    
    # Booking details
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    duration_hours = Column(Integer, nullable=False)
    
    # Pricing
    price_per_hour = Column(Integer, nullable=False)  # in euro cents
    total_price = Column(Integer, nullable=False)  # in euro cents
    
    # Status and notes
    status = Column(Enum(BookingStatus), default=BookingStatus.PENDING)
    rider_notes = Column(Text, nullable=True)
    owner_notes = Column(Text, nullable=True)
    cancellation_reason = Column(Text, nullable=True)
    
    # Payment
    stripe_payment_intent_id = Column(String, nullable=True)
    is_paid = Column(Boolean, default=False)
    payment_date = Column(DateTime(timezone=True), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    rider = relationship("User", back_populates="bookings_as_rider", foreign_keys=[rider_id])
    owner = relationship("User", back_populates="bookings_as_owner", foreign_keys=[owner_id])
    horse = relationship("Horse", back_populates="bookings")
    
    @property
    def total_price_euro(self):
        return self.total_price / 100
    
    @property
    def price_per_hour_euro(self):
        return self.price_per_hour / 100
    
    def __repr__(self):
        return f"<Booking {self.id} - {self.status}>"
