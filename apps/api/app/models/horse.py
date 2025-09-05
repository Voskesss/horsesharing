from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey, JSON, Enum, Float
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum

class HorseType(str, enum.Enum):
    PONY = "pony"
    HORSE = "horse"

class HorseSex(str, enum.Enum):
    STALLION = "stallion"
    MARE = "mare"
    GELDING = "gelding"

class EnergyLevel(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class Horse(Base):
    __tablename__ = "horses"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Basic info
    name = Column(String, nullable=False)
    type = Column(Enum(HorseType), nullable=False)
    height_cm = Column(Integer, nullable=True)
    age = Column(Integer, nullable=False)
    sex = Column(Enum(HorseSex), nullable=False)
    breed = Column(String, nullable=False)
    
    # Physical capabilities
    weight_capacity_kg = Column(Integer, nullable=True)
    rider_height_min_cm = Column(Integer, nullable=True)
    rider_height_max_cm = Column(Integer, nullable=True)
    
    # Character & energy
    energy_level = Column(Enum(EnergyLevel), nullable=False)
    temperament = Column(JSON, nullable=True)  # ["calm", "sensitive", "playful", "dominant"]
    triggers = Column(JSON, nullable=True)  # ["traffic", "water", "crowds", "trailers", "dogs"]
    
    # Preferences & abilities
    enjoys = Column(JSON, nullable=True)  # ["outdoor_rides", "dressage", "jumping", "lunging", "grooming"]
    dislikes = Column(JSON, nullable=True)  # ["hard_hands", "loud_noises", "jumping", "solo_outdoor"]
    
    # Experience & suitability
    suitable_for_levels = Column(JSON, nullable=True)  # ["beginner", "intermediate", "advanced"]
    not_suitable_for = Column(JSON, nullable=True)  # ["beginners", "nervous_riders"]
    
    # Disciplines & training
    disciplines = Column(JSON, nullable=True)  # ["dressage", "jumping", "outdoor", "natural_horsemanship"]
    current_training_level = Column(JSON, nullable=True)  # {"dressage": "L1", "jumping": "60cm"}
    max_jump_height_cm = Column(Integer, nullable=True)
    
    # Health & medical
    health_restrictions = Column(JSON, nullable=True)  # ["no_jumping", "walk_trot_only", "limited_outdoor"]
    medication_schedule = Column(JSON, nullable=True)  # {"arthritis_meds": "daily", "supplements": "twice_daily"}
    farrier_schedule = Column(String, nullable=True)  # "every_6_weeks"
    physio_schedule = Column(String, nullable=True)  # "monthly"
    
    # Media
    photos = Column(JSON, nullable=True)  # ["url1", "url2", "url3"]
    video_url = Column(String, nullable=True)
    
    # Relationships
    owner = relationship("User", back_populates="horses")
    listings = relationship("Listing", back_populates="horse")
    
    def __repr__(self):
        return f"<Horse {self.name}>"
