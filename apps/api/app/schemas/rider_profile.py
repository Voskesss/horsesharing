from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class RiderProfileCreate(BaseModel):
    """Flexible schema for creating rider profiles - easy to extend"""
    # Core personal data - all optional for flexibility
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[str] = None
    
    # Flexible JSON fields - can contain any structure
    address_data: Optional[Dict[str, Any]] = None
    experience_data: Optional[Dict[str, Any]] = None
    preferences_data: Optional[Dict[str, Any]] = None
    availability_data: Optional[Dict[str, Any]] = None
    goals_data: Optional[Dict[str, Any]] = None
    media_data: Optional[Dict[str, Any]] = None
    
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
