from sqlalchemy import Column, Integer, String, Text, Boolean, JSON, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class RiderProfile(Base):
    __tablename__ = "rider_profiles"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    
    # Basic info
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    date_of_birth = Column(String, nullable=True)
    
    # Location & travel
    postcode = Column(String, nullable=True)
    max_travel_distance_km = Column(Integer, nullable=True)
    transport_options = Column(JSON, nullable=True)  # ["car", "public_transport", "bike"]
    
    # Availability
    available_days = Column(JSON, nullable=True)  # ["monday", "tuesday", ...]
    available_time_blocks = Column(JSON, nullable=True)  # [{"day": "monday", "blocks": ["morning", "afternoon"]}]
    session_duration_min = Column(Integer, nullable=True)
    session_duration_max = Column(Integer, nullable=True)
    start_date = Column(String, nullable=True)
    arrangement_duration = Column(String, nullable=True)  # "temporary", "ongoing"
    
    # Budget
    budget_min_euro = Column(Integer, nullable=True)  # euro cents
    budget_max_euro = Column(Integer, nullable=True)  # euro cents
    budget_type = Column(String, nullable=True)  # "monthly", "per_session"
    
    # Experience & level
    experience_years = Column(Integer, nullable=True)
    certification_level = Column(String, nullable=True)  # "FNRS_B1", "KNHS_3", etc
    previous_instructors = Column(JSON, nullable=True)  # references
    comfort_levels = Column(JSON, nullable=True)  # {"traffic": true, "outdoor_solo": false, "jumping_height": 60}
    
    # Goals & preferences
    riding_goals = Column(JSON, nullable=True)  # ["recreation", "training", "competition"]
    discipline_preferences = Column(JSON, nullable=True)  # ["dressage", "jumping", "outdoor"]
    personality_style = Column(JSON, nullable=True)  # ["patient", "consistent", "playful"]
    
    # Tasks & responsibilities
    willing_tasks = Column(JSON, nullable=True)  # ["mucking", "feeding", "grooming"]
    task_frequency = Column(JSON, nullable=True)  # {"mucking": "weekly", "feeding": "never"}
    
    # Material preferences
    material_preferences = Column(JSON, nullable=True)  # {"bitless_ok": true, "spurs": false}
    
    # Health & restrictions
    health_restrictions = Column(JSON, nullable=True)  # ["height_anxiety", "back_problems"]
    insurance_coverage = Column(Boolean, default=False)  # AVP coverage
    
    # No-gos
    no_gos = Column(JSON, nullable=True)  # ["busy_stables", "night_appointments"]
    
    # Media
    photos = Column(JSON, nullable=True)  # ["url1", "url2", "url3"]
    video_intro_url = Column(String, nullable=True)
    
    # Meta fields
    is_complete = Column(Boolean, default=False)  # Track completion status
    profile_version = Column(String, default="1.0")  # For future schema changes
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="rider_profile")
    match_preferences = relationship("MatchPreference", back_populates="rider")
    
    def __repr__(self):
        return f"<RiderProfile {self.first_name} {self.last_name}>"
