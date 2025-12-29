"""Authentication utilities."""

from datetime import datetime, timedelta
from typing import Dict, Optional

import jwt
from config import settings
from fastapi import Cookie, HTTPException


def create_access_token(username: str) -> str:
    """Create JWT access token."""
    payload = {"username": username, "exp": datetime.utcnow() + timedelta(hours=24)}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def verify_token(access_token: Optional[str] = Cookie(None)) -> Dict[str, str]:
    """Verify JWT token and return payload."""
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload: Dict[str, str] = jwt.decode(
            access_token, settings.SECRET_KEY, algorithms=["HS256"]
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def authenticate_user(username: str, password: str) -> bool:
    """Authenticate user credentials."""
    return username == settings.ADMIN_USERNAME and password == settings.ADMIN_PASSWORD
