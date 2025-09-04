from typing import List, Dict, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from datetime import datetime, date
import math

from app.models.user import User
from app.models.rider_profile import RiderProfile
from app.models.listing import Listing
from app.models.horse import Horse
from app.models.like import Like
from app.models.mutual_match import MutualMatch


class MatchService:
    def __init__(self, db: Session):
        self.db = db

    def get_matches_for_rider(
        self, 
        rider_user: User, 
        limit: int = 20,
        exclude_liked: bool = True
    ) -> List[Dict]:
        """Get potential matches for a rider with scoring"""
        
        # Get rider profile
        rider_profile = self.db.query(RiderProfile).filter(
            RiderProfile.user_id == rider_user.id
        ).first()
        
        if not rider_profile:
            return []

        # Base query for active listings
        query = self.db.query(Listing).join(Horse).join(User).filter(
            Listing.is_active == True,
            User.id != rider_user.id  # Exclude own listings
        )

        # Apply hard filters
        query = self._apply_hard_filters(query, rider_profile)

        # Exclude already liked listings if requested
        if exclude_liked:
            liked_listing_ids = self.db.query(Like.listing_id).filter(
                Like.from_user_id == rider_user.id
            ).subquery()
            query = query.filter(~Listing.id.in_(liked_listing_ids))

        listings = query.all()

        # Score and sort listings
        scored_listings = []
        for listing in listings:
            score = self._calculate_match_score(rider_profile, listing)
            scored_listings.append({
                'listing': listing,
                'score': score,
                'horse': listing.horse,
                'owner': listing.horse.owner
            })

        # Sort by score descending
        scored_listings.sort(key=lambda x: x['score'], reverse=True)

        return scored_listings[:limit]

    def _apply_hard_filters(self, query, rider_profile: RiderProfile):
        """Apply hard filters that must match"""
        
        # Distance filter
        if rider_profile.max_distance_km:
            # Note: In real implementation, you'd use PostGIS for proper distance calculation
            # For now, we'll skip geographic filtering
            pass

        # Budget filter
        if rider_profile.budget_min and rider_profile.budget_max:
            query = query.filter(
                and_(
                    Listing.contribution_cents >= rider_profile.budget_min,
                    Listing.contribution_cents <= rider_profile.budget_max
                )
            )

        # Age restrictions for minors
        if rider_profile.user.is_minor:
            # Only match with listings that allow minors
            # This would need additional fields in the listing model
            pass

        return query

    def _calculate_match_score(self, rider_profile: RiderProfile, listing: Listing) -> float:
        """Calculate compatibility score between rider and listing"""
        score = 0.0
        max_score = 0.0

        # Experience level compatibility (20% weight)
        exp_score = self._score_experience_match(rider_profile.level, listing.horse)
        score += exp_score * 0.2
        max_score += 0.2

        # Horse energy level vs rider experience (15% weight)
        energy_score = self._score_energy_compatibility(rider_profile.level, listing.horse.energy_level)
        score += energy_score * 0.15
        max_score += 0.15

        # Task compatibility (15% weight)
        task_score = self._score_task_compatibility(rider_profile.tasks_ready, listing.tasks_expected)
        score += task_score * 0.15
        max_score += 0.15

        # Style/discipline compatibility (10% weight)
        style_score = self._score_style_compatibility(rider_profile.style_tags, listing.horse.disciplines)
        score += style_score * 0.10
        max_score += 0.10

        # Equipment compatibility (10% weight)
        equipment_score = self._score_equipment_compatibility(rider_profile, listing.horse)
        score += equipment_score * 0.10
        max_score += 0.10

        # Availability overlap (20% weight)
        availability_score = self._score_availability_overlap(rider_profile.availability, listing.availability)
        score += availability_score * 0.20
        max_score += 0.20

        # Recency bonus (10% weight)
        recency_score = self._score_listing_recency(listing.created_at)
        score += recency_score * 0.10
        max_score += 0.10

        # Normalize to 0-100 scale
        if max_score > 0:
            return (score / max_score) * 100
        return 0.0

    def _score_experience_match(self, rider_level: str, horse: Horse) -> float:
        """Score experience level compatibility"""
        level_hierarchy = {
            'beginner': 1,
            'intermediate': 2,
            'advanced': 3
        }
        
        rider_level_num = level_hierarchy.get(rider_level, 1)
        
        # Horses suitable for different levels
        if horse.energy_level == 'calm':
            suitable_levels = [1, 2, 3]  # All levels
        elif horse.energy_level == 'moderate':
            suitable_levels = [2, 3]  # Intermediate and advanced
        else:  # energetic
            suitable_levels = [3]  # Advanced only
        
        if rider_level_num in suitable_levels:
            return 1.0
        elif abs(min(suitable_levels) - rider_level_num) == 1:
            return 0.5  # Close match
        else:
            return 0.0

    def _score_energy_compatibility(self, rider_level: str, horse_energy: str) -> float:
        """Score energy level compatibility"""
        compatibility_matrix = {
            'beginner': {'calm': 1.0, 'moderate': 0.3, 'energetic': 0.0},
            'intermediate': {'calm': 0.8, 'moderate': 1.0, 'energetic': 0.5},
            'advanced': {'calm': 0.6, 'moderate': 0.9, 'energetic': 1.0}
        }
        
        return compatibility_matrix.get(rider_level, {}).get(horse_energy, 0.0)

    def _score_task_compatibility(self, rider_tasks: Optional[List[str]], listing_tasks: Optional[List[str]]) -> float:
        """Score task compatibility"""
        if not rider_tasks or not listing_tasks:
            return 0.5  # Neutral if no data
        
        rider_set = set(rider_tasks)
        listing_set = set(listing_tasks)
        
        if not listing_set:
            return 1.0  # No specific tasks required
        
        overlap = len(rider_set.intersection(listing_set))
        total_required = len(listing_set)
        
        return overlap / total_required if total_required > 0 else 0.0

    def _score_style_compatibility(self, rider_styles: Optional[List[str]], horse_disciplines: Optional[List[str]]) -> float:
        """Score style/discipline compatibility"""
        if not rider_styles or not horse_disciplines:
            return 0.5  # Neutral if no data
        
        rider_set = set(rider_styles)
        horse_set = set(horse_disciplines)
        
        overlap = len(rider_set.intersection(horse_set))
        total_styles = len(rider_set.union(horse_set))
        
        return overlap / total_styles if total_styles > 0 else 0.0

    def _score_equipment_compatibility(self, rider_profile: RiderProfile, horse: Horse) -> float:
        """Score equipment compatibility"""
        score = 1.0
        
        # Bitless preference
        if rider_profile.prefers_bitless and not horse.can_be_bitless:
            score -= 0.5
        
        # Trailer availability
        if horse.needs_transport and not rider_profile.can_trailer:
            score -= 0.5
        
        return max(0.0, score)

    def _score_availability_overlap(self, rider_availability: Optional[dict], listing_availability: Optional[dict]) -> float:
        """Score availability overlap"""
        if not rider_availability or not listing_availability:
            return 0.5  # Neutral if no data
        
        # Simplified availability scoring
        # In real implementation, this would be more sophisticated
        overlap_count = 0
        total_slots = 0
        
        for day in ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']:
            rider_slots = rider_availability.get(day, [])
            listing_slots = listing_availability.get(day, [])
            
            if rider_slots and listing_slots:
                # Check for any time overlap (simplified)
                if any(slot in listing_slots for slot in rider_slots):
                    overlap_count += 1
            
            if listing_slots:
                total_slots += 1
        
        return overlap_count / total_slots if total_slots > 0 else 0.0

    def _score_listing_recency(self, created_at: datetime) -> float:
        """Score based on how recent the listing is"""
        days_old = (datetime.utcnow() - created_at).days
        
        if days_old <= 7:
            return 1.0
        elif days_old <= 30:
            return 0.7
        elif days_old <= 90:
            return 0.4
        else:
            return 0.1

    def create_mutual_match(self, rider_user_id: int, listing_id: int) -> Optional[MutualMatch]:
        """Create a mutual match when both parties like each other"""
        
        # Check if owner has liked the rider back
        listing = self.db.query(Listing).filter(Listing.id == listing_id).first()
        if not listing:
            return None
        
        owner_like = self.db.query(Like).filter(
            Like.from_user_id == listing.horse.owner_id,
            Like.listing_id == listing_id  # This would need adjustment for rider profiles
        ).first()
        
        rider_like = self.db.query(Like).filter(
            Like.from_user_id == rider_user_id,
            Like.listing_id == listing_id
        ).first()
        
        if owner_like and rider_like:
            # Check if match already exists
            existing_match = self.db.query(MutualMatch).filter(
                MutualMatch.rider_id == rider_user_id,
                MutualMatch.listing_id == listing_id
            ).first()
            
            if not existing_match:
                # Calculate match score
                rider_profile = self.db.query(RiderProfile).filter(
                    RiderProfile.user_id == rider_user_id
                ).first()
                
                score = self._calculate_match_score(rider_profile, listing) if rider_profile else 50.0
                
                mutual_match = MutualMatch(
                    rider_id=rider_user_id,
                    listing_id=listing_id,
                    score=score,
                    paid_chat=False
                )
                
                self.db.add(mutual_match)
                self.db.commit()
                self.db.refresh(mutual_match)
                
                return mutual_match
        
        return None
