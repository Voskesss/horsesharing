from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.auth import get_current_user, require_role, UserRole
from app.models.user import User
from app.models.stable import Stable
from app.schemas.stable import StableResponse, StableCreate, StableUpdate

router = APIRouter()

@router.get("/", response_model=List[StableResponse])
async def get_stables(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    city: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get list of stables"""
    query = db.query(Stable).filter(Stable.is_active == True)
    
    if city:
        query = query.filter(Stable.city.ilike(f"%{city}%"))
    
    stables = query.offset(skip).limit(limit).all()
    return stables

@router.get("/{stable_id}", response_model=StableResponse)
async def get_stable(
    stable_id: int,
    db: Session = Depends(get_db)
):
    """Get specific stable by ID"""
    stable = db.query(Stable).filter(Stable.id == stable_id).first()
    if not stable:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stable not found"
        )
    return stable

@router.post("/", response_model=StableResponse)
async def create_stable(
    stable_data: StableCreate,
    current_user: User = Depends(require_role(UserRole.OWNER)),
    db: Session = Depends(get_db)
):
    """Create new stable (stable owners only)"""
    stable = Stable(**stable_data.dict(), owner_id=current_user.id)
    db.add(stable)
    db.commit()
    db.refresh(stable)
    return stable

@router.put("/{stable_id}", response_model=StableResponse)
async def update_stable(
    stable_id: int,
    stable_data: StableUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update stable (owner only)"""
    stable = db.query(Stable).filter(Stable.id == stable_id).first()
    if not stable:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stable not found"
        )
    
    if stable.owner_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this stable"
        )
    
    for field, value in stable_data.dict(exclude_unset=True).items():
        setattr(stable, field, value)
    
    db.commit()
    db.refresh(stable)
    return stable
