"""Authentication router."""
from fastapi import APIRouter, Form, HTTPException, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

from auth import authenticate_user, create_access_token

router = APIRouter()
templates = Jinja2Templates(directory="templates")


@router.get("/", response_class=HTMLResponse)
async def login_page(request: Request):
    """Login page."""
    error_message = ""
    if request.query_params.get("error") == "invalid":
        error_message = "Неверный логин или пароль"

    return templates.TemplateResponse(request, "login.html", {"error": error_message})


@router.post("/login")
async def login(username: str = Form(), password: str = Form()):
    """User login."""
    if authenticate_user(username, password):
        token = create_access_token(username)
        response = RedirectResponse(url="/dashboard", status_code=302)
        response.set_cookie(key="access_token", value=token, httponly=True)
        return response

    # Редирект обратно на страницу входа с ошибкой
    return RedirectResponse(url="/?error=invalid", status_code=302)
