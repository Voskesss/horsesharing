from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime

class RiderProfileCreate(BaseModel):
    """Complete schema for creating rider profiles with all matching fields"""
    # Basic info
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[str] = None
    
    # Location & travel
    postcode: Optional[str] = None
    max_travel_distance_km: Optional[int] = None
    transport_options: Optional[List[str]] = None
    
    # Availability
    available_days: Optional[List[str]] = None
    available_time_blocks: Optional[List[Any]] = None
    session_duration_min: Optional[int] = None
    session_duration_max: Optional[int] = None
    start_date: Optional[str] = None
    arrangement_duration: Optional[str] = None
    
    # Budget
    budget_min_euro: Optional[int] = None
    budget_max_euro: Optional[int] = None
    budget_type: Optional[str] = None
    
    # Experience & level
    experience_years: Optional[int] = None
    certification_level: Optional[str] = None
    previous_instructors: Optional[List[str]] = None
    comfort_levels: Optional[Dict[str, Any]] = None
    
    # Goals & preferences
    riding_goals: Optional[List[str]] = None
    discipline_preferences: Optional[List[str]] = None
    personality_style: Optional[List[str]] = None
    
    # Tasks & responsibilities
    willing_tasks: Optional[List[str]] = None
    task_frequency: Optional[Dict[str, str]] = None
    
    # Material preferences
    material_preferences: Optional[Dict[str, Any]] = None
    
    # Health & restrictions
    health_restrictions: Optional[List[str]] = None
    insurance_coverage: Optional[bool] = None
    
    # No-gos
    no_gos: Optional[List[str]] = None
    
    # Media
    photos: Optional[List[str]] = None
    video_intro_url: Optional[str] = None
    
    # Meta
    is_complete: Optional[bool] = False

class RiderProfileUpdate(BaseModel):
    """Flexible schema for updating rider profiles - partial updates allowed"""
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[str] = None
    address_data: Optional[Dict[str, Any]] = None
    experience_data: Optional[Dict[str, Any]] = None
    preferences_data: Optional[Dict[str, Any]] = None
    availability_data: Optional[Dict[str, Any]] = None
    goals_data: Optional[Dict[str, Any]] = None
    media_data: Optional[Dict[str, Any]] = None
    is_complete: Optional[bool] = None

class RiderProfileResponse(BaseModel):
    """Response schema - includes all data plus metadata"""
    user_id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[str] = None
    address_data: Optional[Dict[str, Any]] = None
    experience_data: Optional[Dict[str, Any]] = None
    preferences_data: Optional[Dict[str, Any]] = None
    availability_data: Optional[Dict[str, Any]] = None
    goals_data: Optional[Dict[str, Any]] = None
    media_data: Optional[Dict[str, Any]] = None
    is_complete: bool
    profile_version: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
