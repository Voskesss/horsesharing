from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.auth import get_current_user, require_role
from app.models.user import User, UserRole
from app.models.listing import Listing
from app.models.horse import Horse
from app.schemas.listing import ListingResponse, ListingCreate, ListingUpdate

router = APIRouter(tags=["listings"])

@router.get("/", response_model=List[ListingResponse])
async def get_listings(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Get all active listings"""
    listings = db.query(Listing).filter(
        Listing.is_active == True
    ).offset(skip).limit(limit).all()
    return listings

@router.get("/my", response_model=List[ListingResponse])
async def get_my_listings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's listings"""
    listings = db.query(Listing).join(Horse).filter(
        Horse.owner_id == current_user.id
    ).all()
    return listings

@router.post("/", response_model=ListingResponse)
async def create_listing(
    listing_data: ListingCreate,
    current_user: User = Depends(require_role(UserRole.OWNER)),
    db: Session = Depends(get_db)
):
    """Create a new listing"""
    # Verify horse belongs to current user
    horse = db.query(Horse).filter(
        Horse.id == listing_data.horse_id,
        Horse.owner_id == current_user.id
    ).first()
    
    if not horse:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Horse not found or not owned by you"
        )
    
    listing = Listing(**listing_data.dict())
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing

@router.get("/{listing_id}", response_model=ListingResponse)
async def get_listing(
    listing_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific listing"""
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )
    return listing

@router.put("/{listing_id}", response_model=ListingResponse)
async def update_listing(
    listing_id: int,
    listing_data: ListingUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a listing"""
    listing = db.query(Listing).join(Horse).filter(
        Listing.id == listing_id,
        Horse.owner_id == current_user.id
    ).first()
    
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found or not owned by you"
        )
    
    for field, value in listing_data.dict(exclude_unset=True).items():
        setattr(listing, field, value)
    
    db.commit()
    db.refresh(listing)
    return listing

@router.delete("/{listing_id}")
async def delete_listing(
    listing_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a listing"""
    listing = db.query(Listing).join(Horse).filter(
        Listing.id == listing_id,
        Horse.owner_id == current_user.id
    ).first()
    
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found or not owned by you"
        )
    
    db.delete(listing)
    db.commit()
    return {"message": "Listing deleted successfully"}
