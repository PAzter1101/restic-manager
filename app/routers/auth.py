"""Authentication router."""

from auth import authenticate_user, create_access_token
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
async def login(login_data: LoginRequest):
    """User login for API."""
    if authenticate_user(login_data.username, login_data.password):
        token = create_access_token(login_data.username)
        return {"access_token": token, "token_type": "bearer"}

    raise HTTPException(status_code=401, detail="Invalid credentials")
