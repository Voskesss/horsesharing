from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.booking import Booking, BookingStatus
from app.models.horse import Horse
from app.schemas.booking import BookingResponse, BookingCreate, BookingUpdate

router = APIRouter()

@router.get("/", response_model=List[BookingResponse])
async def get_user_bookings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's bookings"""
    bookings = db.query(Booking).filter(
        (Booking.rider_id == current_user.id) | (Booking.owner_id == current_user.id)
    ).order_by(Booking.start_time.desc()).all()
    return bookings

@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific booking"""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    if booking.rider_id != current_user.id and booking.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this booking"
        )
    
    return booking

@router.post("/", response_model=BookingResponse)
async def create_booking(
    booking_data: BookingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new booking"""
    # Verify horse exists and is available
    horse = db.query(Horse).filter(Horse.id == booking_data.horse_id).first()
    if not horse:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Horse not found"
        )
    
    if not horse.is_available:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Horse is not available"
        )
    
    # Calculate duration and total price
    duration = (booking_data.end_time - booking_data.start_time).total_seconds() / 3600
    total_price = int(duration * horse.price_per_hour)
    
    booking = Booking(
        rider_id=current_user.id,
        owner_id=horse.owner_id,
        horse_id=booking_data.horse_id,
        start_time=booking_data.start_time,
        end_time=booking_data.end_time,
        duration_hours=int(duration),
        price_per_hour=horse.price_per_hour,
        total_price=total_price,
        rider_notes=booking_data.rider_notes
    )
    
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking

@router.put("/{booking_id}", response_model=BookingResponse)
async def update_booking(
    booking_id: int,
    booking_data: BookingUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update booking status"""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Only rider or owner can update
    if booking.rider_id != current_user.id and booking.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this booking"
        )
    
    for field, value in booking_data.dict(exclude_unset=True).items():
        setattr(booking, field, value)
    
    db.commit()
    db.refresh(booking)
    return booking
