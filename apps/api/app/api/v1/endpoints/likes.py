from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.like import Like
from app.models.listing import Listing
from app.schemas.like import LikeResponse, LikeCreate
from app.services.match_service import MatchService

router = APIRouter(tags=["likes"])

@router.post("/", response_model=LikeResponse)
async def create_like(
    like_data: LikeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Like a listing"""
    # Check if listing exists
    listing = db.query(Listing).filter(Listing.id == like_data.listing_id).first()
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )
    
    # Check if already liked
    existing_like = db.query(Like).filter(
        Like.from_user_id == current_user.id,
        Like.listing_id == like_data.listing_id
    ).first()
    
    if existing_like:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already liked this listing"
        )
    
    # Create like
    like = Like(
        from_user_id=current_user.id,
        listing_id=like_data.listing_id
    )
    db.add(like)
    db.commit()
    db.refresh(like)
    
    # Check for mutual match
    match_service = MatchService(db)
    mutual_match = match_service.create_mutual_match(current_user.id, like_data.listing_id)
    
    return like

@router.get("/my", response_model=List[LikeResponse])
async def get_my_likes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's likes"""
    likes = db.query(Like).filter(Like.from_user_id == current_user.id).all()
    return likes

@router.delete("/{like_id}")
async def delete_like(
    like_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Unlike a listing"""
    like = db.query(Like).filter(
        Like.id == like_id,
        Like.from_user_id == current_user.id
    ).first()
    
    if not like:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Like not found"
        )
    
    db.delete(like)
    db.commit()
    return {"message": "Like removed successfully"}
