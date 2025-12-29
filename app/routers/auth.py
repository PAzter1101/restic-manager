"""Authentication router."""
from fastapi import APIRouter, Form, HTTPException, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel

from auth import authenticate_user, create_access_token

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
