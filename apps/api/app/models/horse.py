from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey, JSON, Enum
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
    MEDIUM = "med"
    HIGH = "high"

class Horse(Base):
    __tablename__ = "horses"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    type = Column(Enum(HorseType), nullable=False)
    height_cm = Column(Integer, nullable=True)
    age = Column(Integer, nullable=False)
    sex = Column(Enum(HorseSex), nullable=False)
    breed = Column(String, nullable=False)
    energy = Column(Enum(EnergyLevel), nullable=False)
    temperament_tags = Column(JSON, nullable=True)  # Array of temperament tags
    likes = Column(JSON, nullable=True)  # Array of things horse likes
    dislikes = Column(JSON, nullable=True)  # Array of things horse dislikes
    health_notes = Column(Text, nullable=True)
    disciplines = Column(JSON, nullable=True)  # Array of disciplines
    max_jump_cm = Column(Integer, nullable=True)
    not_for_beginners = Column(Boolean, default=False)
    
    # Relationships
    owner = relationship("User", back_populates="horses")
    listings = relationship("Listing", back_populates="horse")
    
    def __repr__(self):
        return f"<Horse {self.name}>"
