from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, horses, reviews, stables, profiles, listings, likes, matches, payments, rider_profiles, owner_profiles, matching

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth")
api_router.include_router(users.router, prefix="/users")
api_router.include_router(profiles.router, prefix="/profiles")
api_router.include_router(rider_profiles.router, prefix="/profiles/rider")
api_router.include_router(owner_profiles.router, prefix="/profiles/owner")
api_router.include_router(horses.router, prefix="/horses")
api_router.include_router(listings.router, prefix="/listings")
api_router.include_router(likes.router, prefix="/likes")
api_router.include_router(matches.router, prefix="/matches")
api_router.include_router(matching.router, prefix="/matching")
api_router.include_router(payments.router, prefix="/payments")
api_router.include_router(reviews.router, prefix="/reviews")
api_router.include_router(stables.router, prefix="/stables")
