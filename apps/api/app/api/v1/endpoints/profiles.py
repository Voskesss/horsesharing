from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.rider_profile import RiderProfile
from app.models.owner_profile import OwnerProfile
from app.schemas.rider_profile import RiderProfileResponse, RiderProfileCreate, RiderProfileUpdate
from app.schemas.owner_profile import OwnerProfileResponse, OwnerProfileCreate, OwnerProfileUpdate

router = APIRouter(tags=["profiles"])

# Rider Profile endpoints
@router.get("/rider", response_model=RiderProfileResponse)
async def get_rider_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's rider profile"""
    profile = db.query(RiderProfile).filter(RiderProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rider profile not found"
        )
    return profile

@router.put("/rider", response_model=RiderProfileResponse)
async def update_rider_profile(
    profile_data: RiderProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user's rider profile"""
    profile = db.query(RiderProfile).filter(RiderProfile.user_id == current_user.id).first()
    
    if not profile:
        # Create new profile if it doesn't exist
        profile_dict = profile_data.dict(exclude_unset=True)
        profile = RiderProfile(user_id=current_user.id, **profile_dict)
        db.add(profile)
    else:
        # Update existing profile
        for field, value in profile_data.dict(exclude_unset=True).items():
            setattr(profile, field, value)
    
    db.commit()
    db.refresh(profile)
    return profile

# Owner Profile endpoints
@router.get("/owner", response_model=OwnerProfileResponse)
async def get_owner_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's owner profile"""
    profile = db.query(OwnerProfile).filter(OwnerProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Owner profile not found"
        )
    return profile

@router.put("/owner", response_model=OwnerProfileResponse)
async def update_owner_profile(
    profile_data: OwnerProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user's owner profile"""
    profile = db.query(OwnerProfile).filter(OwnerProfile.user_id == current_user.id).first()
    
    if not profile:
        # Create new profile if it doesn't exist
        profile_dict = profile_data.dict(exclude_unset=True)
        profile = OwnerProfile(user_id=current_user.id, **profile_dict)
        db.add(profile)
    else:
        # Update existing profile
        for field, value in profile_data.dict(exclude_unset=True).items():
            setattr(profile, field, value)
    
    db.commit()
    db.refresh(profile)
    return profile
