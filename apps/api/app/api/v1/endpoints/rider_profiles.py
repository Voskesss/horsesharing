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
    
    # Convert frontend nested data to database format
    profile_dict = profile_data.dict(exclude_unset=True)
    
    # Extract nested data and map to database fields
    if profile_dict.get('address_data'):
        address = profile_dict.pop('address_data')
        if address.get('postal_code'):
            profile_dict['postcode'] = address['postal_code']
    
    if profile_dict.get('experience_data'):
        experience = profile_dict.pop('experience_data')
        if experience.get('disciplines'):
            profile_dict['discipline_preferences'] = experience['disciplines']
        if experience.get('level'):
            profile_dict['certification_level'] = experience['level']
    
    if profile_dict.get('availability_data'):
        availability = profile_dict.pop('availability_data')
        if availability.get('days'):
            profile_dict['available_days'] = availability['days']
    
    # Keep nested data as JSON for flexible fields
    if profile_data.preferences_data:
        profile_dict['comfort_levels'] = profile_data.preferences_data
    if profile_data.goals_data:
        profile_dict['riding_goals'] = profile_data.goals_data.get('goals', [])
    if profile_data.media_data:
        profile_dict['photos'] = profile_data.media_data.get('photos', [])
    
    if existing_profile:
        # Update existing profile
        for field, value in profile_dict.items():
            setattr(existing_profile, field, value)
        
        db.commit()
        db.refresh(existing_profile)
        return existing_profile
    else:
        # Create new profile
        profile = RiderProfile(
            user_id=current_user.id,
            **profile_dict
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
    print(f"🔍 Getting rider profile for user_id: {current_user.id}")
    profile = db.query(RiderProfile).filter(RiderProfile.user_id == current_user.id).first()
    
    if not profile:
        print(f"❌ No rider profile found for user_id: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rider profile not found"
        )
    
    print(f"✅ Found rider profile: {profile.first_name} {profile.last_name}")
    return profile

@router.get("/debug/{user_id}")
async def debug_get_rider_profile(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Debug endpoint to get rider profile by user_id"""
    profile = db.query(RiderProfile).filter(RiderProfile.user_id == user_id).first()
    
    if not profile:
        return {"message": f"No rider profile found for user_id: {user_id}"}
    
    return {
        "user_id": profile.user_id,
        "first_name": profile.first_name,
        "last_name": profile.last_name,
        "postcode": profile.postcode,
        "available_days": profile.available_days,
        "discipline_preferences": profile.discipline_preferences,
        "budget_min_euro": profile.budget_min_euro,
        "budget_max_euro": profile.budget_max_euro
    }

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
