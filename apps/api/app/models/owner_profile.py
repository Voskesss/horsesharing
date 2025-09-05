from sqlalchemy import Column, Integer, String, Text, Boolean, JSON, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class OwnerProfile(Base):
    __tablename__ = "owner_profiles"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    
    # Basic info
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    
    # Location
    postcode = Column(String, nullable=True)
    visible_radius_km = Column(Integer, nullable=True)  # 3, 5, 10, 20, 30 km
    parking_available = Column(Boolean, default=False)
    public_transport_access = Column(Boolean, default=False)
    
    # Availability & scheduling
    available_days = Column(JSON, nullable=True)  # ["monday", "tuesday", ...]
    available_time_blocks = Column(JSON, nullable=True)  # [{"day": "monday", "blocks": ["morning", "afternoon"]}]
    start_date = Column(String, nullable=True)
    trial_period_weeks = Column(Integer, nullable=True)
    arrangement_duration = Column(String, nullable=True)  # "temporary", "ongoing"
    
    # Financial
    contribution_min_euro = Column(Integer, nullable=True)  # euro cents
    contribution_type = Column(String, nullable=True)  # "monthly", "per_session"
    deposit_required = Column(Boolean, default=False)
    deposit_amount_euro = Column(Integer, nullable=True)
    
    # Requirements & restrictions
    min_age = Column(Integer, nullable=True)
    max_age = Column(Integer, nullable=True)
    parental_consent_required = Column(Boolean, default=False)
    min_experience_years = Column(Integer, nullable=True)
    required_certifications = Column(JSON, nullable=True)  # ["FNRS_B1", "KNHS_3"]
    
    # Tasks & expectations
    required_tasks = Column(JSON, nullable=True)  # ["mucking", "feeding", "grooming"]
    optional_tasks = Column(JSON, nullable=True)  # ["walking", "lunging"]
    task_frequency = Column(JSON, nullable=True)  # {"mucking": "daily", "feeding": "weekly"}
    
    # Guidance & supervision
    instruction_available = Column(Boolean, default=False)
    instruction_required = Column(Boolean, default=False)
    supervision_required = Column(Boolean, default=False)
    instructor_present = Column(Boolean, default=False)
    
    # Safety & policies
    helmet_required = Column(Boolean, default=True)
    safety_equipment_required = Column(JSON, nullable=True)  # ["helmet", "boots", "gloves"]
    id_verification_required = Column(Boolean, default=False)
    contract_required = Column(Boolean, default=False)
    
    # Insurance requirements
    rider_insurance_required = Column(Boolean, default=False)
    liability_insurance_available = Column(Boolean, default=False)
    business_insurance = Column(Boolean, default=False)
    
    # Material policies
    bit_policy = Column(String, nullable=True)  # "required", "bitless_ok", "bitless_preferred"
    spur_policy = Column(String, nullable=True)  # "allowed", "forbidden", "experienced_only"
    auxiliary_reins_policy = Column(String, nullable=True)  # "allowed", "forbidden"
    bareback_allowed = Column(Boolean, default=False)
    
    # Facilities
    indoor_arena = Column(Boolean, default=False)
    outdoor_arena = Column(Boolean, default=False)
    arena_lighting = Column(Boolean, default=False)
    lunging_circle = Column(Boolean, default=False)
    walker_available = Column(Boolean, default=False)
    outdoor_trails = Column(Boolean, default=False)
    beach_access = Column(Boolean, default=False)
    forest_trails = Column(Boolean, default=False)
    road_riding = Column(Boolean, default=False)
    trailer_available = Column(Boolean, default=False)
    
    # Stable rules & no-gos
    stable_rules = Column(JSON, nullable=True)  # ["no_smoking", "quiet_hours_after_8pm"]
    no_gos = Column(JSON, nullable=True)  # ["rough_handling", "mobile_phones_during_riding"]
    
    # Media
    stable_photos = Column(JSON, nullable=True)  # ["url1", "url2", "url3"]
    video_intro_url = Column(String, nullable=True)
    
    # Meta fields
    is_complete = Column(Boolean, default=False)  # Track completion status
    profile_version = Column(String, default="1.0")  # For future schema changes
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="owner_profile")
    
    def __repr__(self):
        stable_name = self.stable_data.get('name') if self.stable_data else None
        return f"<OwnerProfile {stable_name or f'{self.first_name} {self.last_name}'}>"
