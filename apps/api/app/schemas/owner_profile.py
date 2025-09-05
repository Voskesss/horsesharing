from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class OwnerProfileCreate(BaseModel):
    """Flexible schema for creating owner profiles - easy to extend"""
    # Core personal data - all optional for flexibility
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    
    # Flexible JSON fields - can contain any structure
    stable_data: Optional[Dict[str, Any]] = None
    horses_data: Optional[Dict[str, Any]] = None
    preferences_data: Optional[Dict[str, Any]] = None
    media_data: Optional[Dict[str, Any]] = None
    
    # Meta
    is_complete: Optional[bool] = False

class OwnerProfileUpdate(BaseModel):
    """Flexible schema for updating owner profiles - partial updates allowed"""
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    stable_data: Optional[Dict[str, Any]] = None
    horses_data: Optional[Dict[str, Any]] = None
    preferences_data: Optional[Dict[str, Any]] = None
    media_data: Optional[Dict[str, Any]] = None
    is_complete: Optional[bool] = None

class OwnerProfileResponse(BaseModel):
    """Response schema - includes all data plus metadata"""
    user_id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    stable_data: Optional[Dict[str, Any]] = None
    horses_data: Optional[Dict[str, Any]] = None
    preferences_data: Optional[Dict[str, Any]] = None
    media_data: Optional[Dict[str, Any]] = None
    is_complete: bool
    profile_version: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
