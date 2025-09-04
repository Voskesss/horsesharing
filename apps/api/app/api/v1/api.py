from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, horses, bookings, reviews, stables, profiles, listings, likes, matches, payments

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth")
api_router.include_router(users.router, prefix="/users")
api_router.include_router(profiles.router, prefix="/profiles")
api_router.include_router(horses.router, prefix="/horses")
api_router.include_router(listings.router, prefix="/listings")
api_router.include_router(likes.router, prefix="/likes")
api_router.include_router(matches.router, prefix="/matches")
api_router.include_router(payments.router, prefix="/payments")
api_router.include_router(bookings.router, prefix="/bookings")
api_router.include_router(reviews.router, prefix="/reviews")
api_router.include_router(stables.router, prefix="/stables")
