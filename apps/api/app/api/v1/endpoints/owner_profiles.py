from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.owner_profile import OwnerProfile
from app.schemas.owner_profile import OwnerProfileCreate, OwnerProfileUpdate, OwnerProfileResponse

router = APIRouter()
security = HTTPBearer()

@router.post("/", response_model=OwnerProfileResponse)
async def create_owner_profile(
    profile_data: OwnerProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create or update owner profile - flexible data structure"""
    # Check if profile already exists
    existing_profile = db.query(OwnerProfile).filter(OwnerProfile.user_id == current_user.id).first()
    
    if existing_profile:
        # Update existing profile
        for field, value in profile_data.dict(exclude_unset=True).items():
            setattr(existing_profile, field, value)
        
        db.commit()
        db.refresh(existing_profile)
        return existing_profile
    else:
        # Create new profile
        profile = OwnerProfile(
            user_id=current_user.id,
            **profile_data.dict(exclude_unset=True)
        )
        
        db.add(profile)
        db.commit()
        db.refresh(profile)
        return profile

@router.get("/", response_model=OwnerProfileResponse)
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

@router.patch("/", response_model=OwnerProfileResponse)
async def update_owner_profile(
    profile_data: OwnerProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update owner profile - partial updates allowed for flexibility"""
    profile = db.query(OwnerProfile).filter(OwnerProfile.user_id == current_user.id).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Owner profile not found"
        )
    
    # Update only provided fields - flexible approach
    for field, value in profile_data.dict(exclude_unset=True).items():
        setattr(profile, field, value)
    
    db.commit()
    db.refresh(profile)
    return profile

@router.delete("/")
async def delete_owner_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete owner profile"""
    profile = db.query(OwnerProfile).filter(OwnerProfile.user_id == current_user.id).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Owner profile not found"
        )
    
    db.delete(profile)
    db.commit()
    return {"message": "Owner profile deleted successfully"}
