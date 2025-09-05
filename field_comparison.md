# Veld Vergelijking: Profile Pagina vs Backend Database

## Database Model (rider_profile.py)
```python
# Basic info
first_name = Column(String, nullable=True)
last_name = Column(String, nullable=True)
phone = Column(String, nullable=True)
date_of_birth = Column(String, nullable=True)

# Location & travel
postcode = Column(String, nullable=True)
max_travel_distance_km = Column(Integer, nullable=True)
transport_options = Column(JSON, nullable=True)

# Availability
available_days = Column(JSON, nullable=True)
available_time_blocks = Column(JSON, nullable=True)
session_duration_min = Column(Integer, nullable=True)
session_duration_max = Column(Integer, nullable=True)
start_date = Column(String, nullable=True)
arrangement_duration = Column(String, nullable=True)

# Budget
budget_min_euro = Column(Integer, nullable=True)
budget_max_euro = Column(Integer, nullable=True)
budget_type = Column(String, nullable=True)

# Experience & level
experience_years = Column(Integer, nullable=True)
certification_level = Column(String, nullable=True)
previous_instructors = Column(JSON, nullable=True)
comfort_levels = Column(JSON, nullable=True)

# Goals & preferences
riding_goals = Column(JSON, nullable=True)
discipline_preferences = Column(JSON, nullable=True)
personality_style = Column(JSON, nullable=True)

# Tasks & responsibilities
willing_tasks = Column(JSON, nullable=True)
task_frequency = Column(JSON, nullable=True)

# Material preferences
material_preferences = Column(JSON, nullable=True)

# Health & restrictions
health_restrictions = Column(JSON, nullable=True)
insurance_coverage = Column(Boolean, default=False)

# No-gos
no_gos = Column(JSON, nullable=True)

# Media
photos = Column(JSON, nullable=True)
video_intro_url = Column(String, nullable=True)
```

## Frontend Profile Pagina - Gevonden Velden
- ✅ first_name
- ✅ last_name
- ✅ phone
- ✅ postcode
- ✅ date_of_birth
- ✅ max_travel_distance_km
- ✅ available_days
- ✅ available_time_blocks
- ✅ budget_min_euro
- ✅ budget_max_euro
- ✅ discipline_preferences
- ✅ riding_goals
- ✅ experience_years
- ✅ certification_level
- ✅ comfort_levels
- ✅ willing_tasks
- ✅ material_preferences
- ✅ health_restrictions
- ✅ insurance_coverage
- ✅ no_gos
- ✅ video_intro_url

## ONTBREKENDE VELDEN in Profile Pagina
- ❌ transport_options
- ❌ session_duration_min
- ❌ session_duration_max
- ❌ start_date
- ❌ arrangement_duration
- ❌ budget_type
- ❌ previous_instructors
- ❌ personality_style
- ❌ task_frequency
- ❌ photos

## INCONSISTENTIES
Geen inconsistenties in veldnamen gevonden - alle gebruikte velden komen overeen met database schema.
