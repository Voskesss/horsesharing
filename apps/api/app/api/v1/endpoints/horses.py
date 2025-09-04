from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.auth import get_current_user, require_role, UserRole
from app.models.user import User
from app.models.horse import Horse
from app.schemas.horse import HorseResponse, HorseCreate, HorseUpdate

router = APIRouter()

@router.get("/", response_model=List[HorseResponse])
async def get_horses(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    city: Optional[str] = None,
    max_price: Optional[int] = None,
    discipline: Optional[str] = None,
    experience_level: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get list of available horses with filters"""
    query = db.query(Horse).filter(Horse.is_available == True)
    
    if city:
        query = query.filter(Horse.location_city.ilike(f"%{city}%"))
    if max_price:
        query = query.filter(Horse.price_per_hour <= max_price * 100)
    if discipline:
        query = query.filter(Horse.disciplines.contains(discipline))
    if experience_level:
        query = query.filter(Horse.experience_required == experience_level)
    
    horses = query.offset(skip).limit(limit).all()
    return horses

@router.get("/{horse_id}", response_model=HorseResponse)
async def get_horse(
    horse_id: int,
    db: Session = Depends(get_db)
):
    """Get specific horse by ID"""
    horse = db.query(Horse).filter(Horse.id == horse_id).first()
    if not horse:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Horse not found"
        )
    return horse

@router.post("/", response_model=HorseResponse)
async def create_horse(
    horse_data: HorseCreate,
    current_user: User = Depends(require_role(UserRole.OWNER)),
    db: Session = Depends(get_db)
):
    """Create new horse (owners only)"""
    horse = Horse(**horse_data.dict(), owner_id=current_user.id)
    db.add(horse)
    db.commit()
    db.refresh(horse)
    return horse

@router.put("/{horse_id}", response_model=HorseResponse)
async def update_horse(
    horse_id: int,
    horse_data: HorseUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update horse (owner only)"""
    horse = db.query(Horse).filter(Horse.id == horse_id).first()
    if not horse:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Horse not found"
        )
    
    if horse.owner_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this horse"
        )
    
    for field, value in horse_data.dict(exclude_unset=True).items():
        setattr(horse, field, value)
    
    db.commit()
    db.refresh(horse)
    return horse

@router.delete("/{horse_id}")
async def delete_horse(
    horse_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete horse (owner only)"""
    horse = db.query(Horse).filter(Horse.id == horse_id).first()
    if not horse:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Horse not found"
        )
    
    if horse.owner_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this horse"
        )
    
    db.delete(horse)
    db.commit()
    return {"message": "Horse deleted successfully"}
