from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.rider_profile import RiderProfile
from app.models.owner_profile import OwnerProfile
from app.models.horse import Horse
from app.models.listing import Listing
from app.models.like import Like
from app.models.mutual_match import MutualMatch
from app.schemas.matching import MatchCandidate, MatchScore, LikeCreate
import math
from geopy.distance import geodesic

router = APIRouter()

def calculate_distance_km(postcode1: str, postcode2: str) -> float:
    """Calculate distance between two postcodes in km"""
    # TODO: Implement actual postcode to coordinates conversion
    # For now, return a mock distance
    return 5.0

def calculate_match_score(rider: RiderProfile, listing: Listing, horse: Horse, owner: OwnerProfile) -> float:
    """Calculate match score between rider and listing (0-100)"""
    score = 0.0
    max_score = 100.0
    
    # Hard filters - return 0 if any fail
    
    # 1. Location filter
    if rider.postcode and owner.postcode:
        distance = calculate_distance_km(rider.postcode, owner.postcode)
        if rider.max_travel_distance_km and distance > rider.max_travel_distance_km:
            return 0.0
        if owner.visible_radius_km and distance > owner.visible_radius_km:
            return 0.0
    
    # 2. Budget filter
    if rider.budget_max_euro and listing.contribution_min:
        if rider.budget_max_euro < listing.contribution_min:
            return 0.0
    
    # 3. Experience level filter
    if owner.min_experience_years and rider.experience_years:
        if rider.experience_years < owner.min_experience_years:
            return 0.0
    
    # 4. Age filter
    if owner.min_age or owner.max_age:
        # TODO: Calculate age from rider.date_of_birth
        pass
    
    # 5. Insurance filter
    if owner.rider_insurance_required and not rider.insurance_coverage:
        return 0.0
    
    # Soft scoring (weighted preferences)
    
    # Availability overlap (high weight: 25%)
    availability_score = 0.0
    if rider.available_days and owner.available_days:
        rider_days = set(rider.available_days)
        owner_days = set(owner.available_days)
        overlap = len(rider_days.intersection(owner_days))
        total_days = len(rider_days.union(owner_days))
        if total_days > 0:
            availability_score = (overlap / total_days) * 25
    
    # Discipline match (high weight: 20%)
    discipline_score = 0.0
    if rider.discipline_preferences and horse.disciplines:
        rider_disciplines = set(rider.discipline_preferences)
        horse_disciplines = set(horse.disciplines)
        overlap = len(rider_disciplines.intersection(horse_disciplines))
        if overlap > 0:
            discipline_score = min(overlap * 5, 20)  # Max 20 points
    
    # Character/temperament match (high weight: 20%)
    character_score = 0.0
    if rider.personality_style and horse.temperament:
        # Simple matching logic - can be improved
        if "patient" in rider.personality_style and "calm" in horse.temperament:
            character_score += 10
        if "playful" in rider.personality_style and "playful" in horse.temperament:
            character_score += 10
        character_score = min(character_score, 20)
    
    # Task compatibility (medium weight: 15%)
    task_score = 0.0
    if rider.willing_tasks and owner.required_tasks:
        rider_tasks = set(rider.willing_tasks)
        required_tasks = set(owner.required_tasks)
        covered_tasks = len(rider_tasks.intersection(required_tasks))
        total_required = len(required_tasks)
        if total_required > 0:
            task_score = (covered_tasks / total_required) * 15
    
    # Distance bonus (medium weight: 10%)
    distance_score = 0.0
    if rider.postcode and owner.postcode:
        distance = calculate_distance_km(rider.postcode, owner.postcode)
        max_distance = rider.max_travel_distance_km or 30
        distance_score = max(0, (1 - distance / max_distance)) * 10
    
    # Material compatibility (low weight: 10%)
    material_score = 0.0
    if rider.material_preferences and owner.bit_policy:
        # Simple example - can be expanded
        if rider.material_preferences.get("bitless_ok") and owner.bit_policy == "bitless_ok":
            material_score = 10
    
    total_score = availability_score + discipline_score + character_score + task_score + distance_score + material_score
    return min(total_score, max_score)

@router.get("/candidates", response_model=List[MatchCandidate])
async def get_match_candidates(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = Query(10, ge=1, le=50)
):
    """Get potential matches for the current rider"""
    
    # Get rider profile
    rider_profile = db.query(RiderProfile).filter(RiderProfile.user_id == current_user.id).first()
    if not rider_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rider profile not found"
        )
    
    # Get all active listings
    listings = db.query(Listing).filter(Listing.is_active == True).all()
    
    candidates = []
    for listing in listings:
        # Skip own listings
        if listing.horse.owner_id == current_user.id:
            continue
            
        # Skip already liked listings
        existing_like = db.query(Like).filter(
            Like.from_user_id == current_user.id,
            Like.listing_id == listing.id
        ).first()
        if existing_like:
            continue
        
        # Get owner profile and horse
        owner_profile = db.query(OwnerProfile).filter(OwnerProfile.user_id == listing.horse.owner_id).first()
        if not owner_profile:
            continue
            
        # Calculate match score
        score = calculate_match_score(rider_profile, listing, listing.horse, owner_profile)
        
        # Only include matches above threshold
        if score >= 30:  # Minimum 30% match
            candidates.append(MatchCandidate(
                listing_id=listing.id,
                horse_name=listing.horse.name,
                horse_photos=listing.horse.photos or [],
                owner_name=f"{owner_profile.first_name} {owner_profile.last_name}",
                location=owner_profile.postcode,
                contribution_euro=listing.contribution_min / 100 if listing.contribution_min else 0,
                match_score=score,
                distance_km=calculate_distance_km(rider_profile.postcode or "", owner_profile.postcode or ""),
                highlights=[]  # TODO: Generate match highlights
            ))
    
    # Sort by match score (highest first)
    candidates.sort(key=lambda x: x.match_score, reverse=True)
    
    return candidates[:limit]

@router.post("/like")
async def like_listing(
    like_data: LikeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Like a listing (swipe right)"""
    
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
    
    # Check for mutual match (owner also liked this rider)
    # TODO: Implement owner-side liking system
    
    db.commit()
    
    return {"message": "Listing liked successfully"}

@router.get("/matches")
async def get_mutual_matches(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get mutual matches for the current user"""
    
    matches = db.query(MutualMatch).filter(MutualMatch.rider_id == current_user.id).all()
    return matches
