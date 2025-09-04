from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.review import Review
from app.models.booking import Booking, BookingStatus
from app.schemas.review import ReviewResponse, ReviewCreate

router = APIRouter()

@router.get("/horse/{horse_id}", response_model=List[ReviewResponse])
async def get_horse_reviews(
    horse_id: int,
    db: Session = Depends(get_db)
):
    """Get reviews for a specific horse"""
    reviews = db.query(Review).filter(Review.horse_id == horse_id).all()
    return reviews

@router.post("/", response_model=ReviewResponse)
async def create_review(
    review_data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new review after completed booking"""
    # Verify booking exists and is completed
    if review_data.booking_id:
        booking = db.query(Booking).filter(
            Booking.id == review_data.booking_id,
            Booking.status == BookingStatus.COMPLETED
        ).first()
        
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Completed booking not found"
            )
        
        if booking.rider_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the rider can review this booking"
            )
    
    review = Review(
        reviewer_id=current_user.id,
        **review_data.dict()
    )
    
    db.add(review)
    db.commit()
    db.refresh(review)
    return review
