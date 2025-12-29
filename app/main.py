from fastapi import FastAPI, Depends, HTTPException, Request, Form, Cookie
from fastapi.responses import HTMLResponse, StreamingResponse, RedirectResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import subprocess
import json
import os
import tempfile
from datetime import datetime, timedelta
import jwt
from typing import List, Dict, Optional

app = FastAPI(title="Restic Web Manager")
security = HTTPBearer()
templates = Jinja2Templates(directory="templates")

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Конфигурация из переменных окружения
RESTIC_REPOSITORY = os.getenv("RESTIC_REPOSITORY")
RESTIC_PASSWORD = os.getenv("RESTIC_PASSWORD")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin")

def get_restic_env():
    return {
        "RESTIC_REPOSITORY": RESTIC_REPOSITORY,
        "RESTIC_PASSWORD": RESTIC_PASSWORD,
        "AWS_ACCESS_KEY_ID": AWS_ACCESS_KEY_ID,
        "AWS_SECRET_ACCESS_KEY": AWS_SECRET_ACCESS_KEY,
    }

def verify_token(access_token: str = Cookie(None)):
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/", response_class=HTMLResponse)
async def login_page(request: Request):
    error_message = ""
    if request.query_params.get("error") == "invalid":
        error_message = "Неверный логин или пароль"
    
    return templates.TemplateResponse("login.html", {
        "request": request, 
        "error": error_message
    })

@app.post("/login")
async def login(username: str = Form(), password: str = Form()):
    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        token = jwt.encode({
            "username": username,
            "exp": datetime.utcnow() + timedelta(hours=24)
        }, SECRET_KEY, algorithm="HS256")
        
        response = RedirectResponse(url="/dashboard", status_code=302)
        response.set_cookie(key="access_token", value=token, httponly=True)
        return response
    
    # Редирект обратно на страницу входа с ошибкой
    response = RedirectResponse(url="/?error=invalid", status_code=302)
    return response

@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard(request: Request, access_token: str = Cookie(None)):
    if not access_token:
        return RedirectResponse(url="/", status_code=302)
    
    try:
        jwt.decode(access_token, SECRET_KEY, algorithms=["HS256"])
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        response = RedirectResponse(url="/", status_code=302)
        response.delete_cookie("access_token")
        return response
    
    return templates.TemplateResponse("dashboard.html", {"request": request})

@app.get("/snapshots")
async def get_snapshots(host: Optional[str] = None, tag: Optional[str] = None, user=Depends(verify_token)):
    cmd = ["restic", "snapshots", "--json"]
    if host:
        cmd.extend(["--host", host])
    if tag:
        cmd.extend(["--tag", tag])
    
    result = subprocess.run(cmd, env=get_restic_env(), capture_output=True, text=True)
    if result.returncode != 0:
        raise HTTPException(status_code=500, detail=f"Restic error: {result.stderr}")
    
    snapshots = json.loads(result.stdout)
    
    # Добавляем размер как null - будет загружаться отдельно
    for snapshot in snapshots:
        snapshot["size"] = None
    
    return snapshots

@app.get("/snapshot/{snapshot_id}/size")
async def get_snapshot_size(snapshot_id: str, user=Depends(verify_token)):
    try:
        stats_cmd = ["restic", "stats", snapshot_id, "--json"]
        stats_result = subprocess.run(stats_cmd, env=get_restic_env(), capture_output=True, text=True)
        
        if stats_result.returncode == 0:
            stats = json.loads(stats_result.stdout)
            return {"size": stats.get("total_size", 0)}
        else:
            return {"size": 0}
    except:
        return {"size": 0}

@app.get("/snapshot/{snapshot_id}/files")
async def get_snapshot_files(snapshot_id: str, user=Depends(verify_token)):
    cmd = ["restic", "ls", snapshot_id, "--json"]
    result = subprocess.run(cmd, env=get_restic_env(), capture_output=True, text=True)
    if result.returncode != 0:
        raise HTTPException(status_code=500, detail=f"Restic error: {result.stderr}")
    
    files = []
    for line in result.stdout.strip().split('\n'):
        if line:
            files.append(json.loads(line))
    return files

@app.get("/download/{snapshot_id}")
async def download_snapshot_files(snapshot_id: str, user=Depends(verify_token)):
    import gzip
    
    # Получаем список файлов в снапшоте
    cmd = ["restic", "ls", snapshot_id, "--json"]
    result = subprocess.run(cmd, env=get_restic_env(), capture_output=True, text=True)
    if result.returncode != 0:
        raise HTTPException(status_code=500, detail=f"Restic error: {result.stderr}")
    
    files = []
    for line in result.stdout.strip().split('\n'):
        if line:
            file_info = json.loads(line)
            if file_info.get('type') == 'file':
                files.append(file_info)
    
    if not files:
        raise HTTPException(status_code=404, detail="No files found in snapshot")
    
    # Берем первый файл
    file_path = files[0]['path']
    filename = os.path.basename(file_path)
    
    def gzip_compressed_generator():
        # Запускаем restic dump и gzip в pipeline
        restic_cmd = ["restic", "dump", snapshot_id, file_path]
        gzip_cmd = ["gzip", "-c"]
        
        # Создаем pipeline: restic dump | gzip
        restic_process = subprocess.Popen(restic_cmd, env=get_restic_env(), stdout=subprocess.PIPE)
        gzip_process = subprocess.Popen(gzip_cmd, stdin=restic_process.stdout, stdout=subprocess.PIPE)
        restic_process.stdout.close()  # Позволяет restic завершиться при закрытии gzip
        
        try:
            while True:
                chunk = gzip_process.stdout.read(64*1024)  # 64KB chunks
                if not chunk:
                    break
                yield chunk
        finally:
            gzip_process.stdout.close()
            gzip_process.wait()
            restic_process.wait()
    
    return StreamingResponse(
        gzip_compressed_generator(),
        media_type="application/gzip",
        headers={"Content-Disposition": f"attachment; filename={filename}.gz"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
