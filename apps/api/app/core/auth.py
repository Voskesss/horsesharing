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
    print(f"DEBUG: Verifying token with domain: {settings.KINDE_DOMAIN}")
    print(f"DEBUG: Expected audience: {settings.KINDE_AUDIENCE}")
    print(f"DEBUG: Token preview: {token[:50]}...")
    
    try:
        # Get Kinde public keys
        jwks_url = f"https://{settings.KINDE_DOMAIN}/.well-known/jwks.json"
        print(f"DEBUG: Fetching JWKS from: {jwks_url}")
        
        async with httpx.AsyncClient() as client:
            response = await client.get(jwks_url)
            print(f"DEBUG: JWKS response status: {response.status_code}")
            jwks = response.json()
            print(f"DEBUG: JWKS keys count: {len(jwks.get('keys', []))}")
        
        # Decode and verify token
        header = jwt.get_unverified_header(token)
        print(f"DEBUG: Token header: {header}")
        
        key = None
        for jwk in jwks["keys"]:
            if jwk["kid"] == header["kid"]:
                key = jwk
                break
        
        if not key:
            print(f"DEBUG: No matching key found for kid: {header['kid']}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token key"
            )
        
        print(f"DEBUG: Found matching key for kid: {header['kid']}")
        
        # First decode without audience verification to see what's in the token
        payload_unverified = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            options={"verify_aud": False}
        )
        print(f"DEBUG: Token payload (unverified): {payload_unverified}")
        print(f"DEBUG: Token audience claim: {payload_unverified.get('aud')}")
        
        # Check if token has audience claim
        if payload_unverified.get('aud'):
            # M2M token with audience - verify audience
            payload = jwt.decode(
                token,
                key,
                algorithms=["RS256"],
                audience=settings.KINDE_AUDIENCE
            )
        else:
            # User token without audience - skip audience verification
            print("DEBUG: User token detected (no audience) - skipping audience verification")
            payload = jwt.decode(
                token,
                key,
                algorithms=["RS256"],
                options={"verify_aud": False}
            )
        
        print(f"DEBUG: Token payload: {payload}")
        return payload
    except JWTError as e:
        print(f"DEBUG: JWT Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    except Exception as e:
        print(f"DEBUG: Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token verification failed"
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
        print(f"DEBUG: Token sub claim: {user_sub}")
        if user_sub is None:
            print("DEBUG: No sub claim found - this is an M2M token, not a user token")
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
