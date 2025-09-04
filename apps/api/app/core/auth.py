from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.orm import Session
import httpx
from typing import Optional

from app.core.config import settings
from app.core.database import get_db
from app.models.user import User, UserRole

security = HTTPBearer()

async def verify_kinde_token(token: str) -> dict:
    """Verify Kinde JWT token"""
    try:
        # Get Kinde public keys
        async with httpx.AsyncClient() as client:
            response = await client.get(f"https://{settings.KINDE_DOMAIN}/.well-known/jwks.json")
            jwks = response.json()
        
        # Decode and verify token
        header = jwt.get_unverified_header(token)
        key = None
        for jwk in jwks["keys"]:
            if jwk["kid"] == header["kid"]:
                key = jwk
                break
        
        if not key:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token key"
            )
        
        payload = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience=settings.KINDE_AUDIENCE
        )
        
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user"""
    token = credentials.credentials
    
    try:
        payload = await verify_kinde_token(token)
        user_sub: str = payload.get("sub")
        if user_sub is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user = db.query(User).filter(User.sub == user_sub).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found. Please complete onboarding first."
        )
    
    return user

def require_role(required_role: UserRole):
    """Decorator to require specific user role"""
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role != required_role and current_user.role != UserRole.BOTH:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return current_user
    return role_checker
