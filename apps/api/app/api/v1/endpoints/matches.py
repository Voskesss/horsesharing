from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.auth import get_current_user, require_role
from app.models.user import User, UserRole
from app.models.mutual_match import MutualMatch
from app.schemas.match import MutualMatchResponse, MatchResult
from app.services.match_service import MatchService

router = APIRouter(tags=["matches"])

@router.get("/discover", response_model=List[MatchResult])
async def discover_matches(
    limit: int = 20,
    current_user: User = Depends(require_role(UserRole.RIDER)),
    db: Session = Depends(get_db)
):
    """Get potential matches for current rider"""
    match_service = MatchService(db)
    matches = match_service.get_matches_for_rider(current_user, limit=limit)
    
    results = []
    for match in matches:
        listing = match['listing']
        horse = match['horse']
        owner = match['owner']
        
        result = MatchResult(
            listing_id=listing.id,
            horse_id=horse.id,
            owner_id=owner.id,
            score=match['score'],
            listing={
                'id': listing.id,
                'location_name': listing.location_name,
                'contribution_cents': listing.contribution_cents,
                'start_date': listing.start_date.isoformat(),
                'end_date': listing.end_date.isoformat(),
                'description': listing.description,
                'media_urls': listing.media_urls or []
            },
            horse={
                'id': horse.id,
                'name': horse.name,
                'breed': horse.breed,
                'age': horse.age,
                'sex': horse.sex.value,
                'type': horse.type.value,
                'energy_level': horse.energy_level.value,
                'photo_urls': horse.photo_urls or []
            },
            owner={
                'id': owner.id,
                'email': owner.email,
                'phone': owner.phone
            }
        )
        results.append(result)
    
    return results

@router.get("/mutual", response_model=List[MutualMatchResponse])
async def get_mutual_matches(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's mutual matches"""
    if current_user.role == UserRole.RIDER:
        matches = db.query(MutualMatch).filter(
            MutualMatch.rider_id == current_user.id
        ).all()
    else:
        # For owners, get matches where their listings are involved
        matches = db.query(MutualMatch).join(
            MutualMatch.listing
        ).filter(
            MutualMatch.listing.has(horse_id__in=[
                h.id for h in current_user.horses
            ])
        ).all()
    
    return matches

@router.get("/{match_id}", response_model=MutualMatchResponse)
async def get_match(
    match_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific mutual match"""
    match = db.query(MutualMatch).filter(MutualMatch.id == match_id).first()
    
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match not found"
        )
    
    # Check if user is part of this match
    if (match.rider_id != current_user.id and 
        match.listing.horse.owner_id != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return match
