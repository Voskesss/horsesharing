from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.rider_profile import RiderProfile
from app.schemas.rider_profile import RiderProfileCreate, RiderProfileUpdate, RiderProfileResponse

router = APIRouter()
security = HTTPBearer()

@router.post("/", response_model=RiderProfileResponse)
async def create_rider_profile(
    profile_data: RiderProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create or update rider profile - flexible data structure"""
    # Check if profile already exists
    existing_profile = db.query(RiderProfile).filter(RiderProfile.user_id == current_user.id).first()
    
    if existing_profile:
        # Update existing profile
        for field, value in profile_data.dict(exclude_unset=True).items():
            setattr(existing_profile, field, value)
        
        db.commit()
        db.refresh(existing_profile)
        return existing_profile
    else:
        # Create new profile
        profile = RiderProfile(
            user_id=current_user.id,
            **profile_data.dict(exclude_unset=True)
        )
        
        db.add(profile)
        db.commit()
        db.refresh(profile)
        return profile

@router.get("/", response_model=RiderProfileResponse)
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

@router.patch("/", response_model=RiderProfileResponse)
async def update_rider_profile(
    profile_data: RiderProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update rider profile - partial updates allowed for flexibility"""
    profile = db.query(RiderProfile).filter(RiderProfile.user_id == current_user.id).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rider profile not found"
        )
    
    # Update only provided fields - flexible approach
    for field, value in profile_data.dict(exclude_unset=True).items():
        setattr(profile, field, value)
    
    db.commit()
    db.refresh(profile)
    return profile

@router.delete("/")
async def delete_rider_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete rider profile"""
    profile = db.query(RiderProfile).filter(RiderProfile.user_id == current_user.id).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rider profile not found"
        )
    
    db.delete(profile)
    db.commit()
    return {"message": "Rider profile deleted successfully"}
