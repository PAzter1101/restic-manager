"""Backup operations router."""

import os
import subprocess
from typing import List, Optional

from auth import verify_token
from config import settings
from fastapi import APIRouter, Cookie, Depends, File, HTTPException, Request, UploadFile
from fastapi.responses import HTMLResponse, RedirectResponse, StreamingResponse
from fastapi.templating import Jinja2Templates
from schemas.backup import BackupResponse
from services.restic import restic_service

router = APIRouter()
templates = Jinja2Templates(directory="templates")


@router.get("/dashboard", response_class=HTMLResponse)
async def dashboard(request: Request, access_token: str = Cookie(None)):
    """Dashboard page."""
    if not access_token:
        return RedirectResponse(url="/", status_code=302)

    try:
        verify_token(access_token)
    except HTTPException:
        response = RedirectResponse(url="/", status_code=302)
        response.delete_cookie("access_token")
        return response

    return templates.TemplateResponse(request, "dashboard.html", {})


@router.get("/snapshots")
async def get_snapshots(
    user=Depends(verify_token),
    host: Optional[str] = None,
    tag: Optional[str] = None,
    page: int = 1,
    limit: int = 25,
):
    """Get list of snapshots."""
    snapshots = restic_service.get_snapshots(host, tag)

    # Простая пагинация
    total = len(snapshots)
    start = (page - 1) * limit
    end = start + limit
    paginated_snapshots = snapshots[start:end]

    return {
        "snapshots": paginated_snapshots,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit,
    }


@router.get("/snapshot/{snapshot_id}/size")
async def get_snapshot_size(snapshot_id: str, user=Depends(verify_token)):
    """Get snapshot size."""
    size = restic_service.get_snapshot_size(snapshot_id)
    return {"size": size}


@router.get("/snapshots/{snapshot_id}/files")
async def get_snapshot_files(
    snapshot_id: str, path: str = "/", user=Depends(verify_token)
):
    """Get files in snapshot."""
    try:
        files = restic_service.get_snapshot_files(snapshot_id)
        return {"files": files}
    except Exception as e:
        return {"files": [], "error": str(e)}


@router.post("/upload", response_model=BackupResponse)
async def upload_files(
    user=Depends(verify_token),
    files: List[UploadFile] = File(...),
    tags: Optional[str] = None,
):
    """Upload files and create backup."""
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")

    # Парсим теги
    tag_list = []
    if tags:
        tag_list = [tag.strip() for tag in tags.split(",") if tag.strip()]

    result = restic_service.create_backup(files, tag_list)
    return BackupResponse(
        message=result["message"],
        files_count=int(result["files_count"]),
        snapshot_id=result.get("snapshot_id", ""),
    )


@router.get("/download/{snapshot_id}")
async def download_snapshot_files(snapshot_id: str, user=Depends(verify_token)):
    """Download files from snapshot."""
    # Получаем список файлов в снапшоте
    files = restic_service.get_snapshot_files(snapshot_id)

    # Фильтруем только файлы (не директории)
    file_list = [f for f in files if f.get("type") == "file"]

    if not file_list:
        raise HTTPException(status_code=404, detail="No files found in snapshot")

    # Берем первый файл
    file_path = file_list[0]["path"]
    filename = os.path.basename(file_path)

    def gzip_compressed_generator():
        # Запускаем restic dump и gzip в pipeline
        restic_cmd = ["restic", "dump", snapshot_id, file_path]
        gzip_cmd = ["gzip", "-c"]

        # Создаем pipeline: restic dump | gzip
        restic_process = subprocess.Popen(
            restic_cmd, env=settings.get_restic_env(), stdout=subprocess.PIPE
        )
        gzip_process = subprocess.Popen(
            gzip_cmd, stdin=restic_process.stdout, stdout=subprocess.PIPE
        )
        restic_process.stdout.close()  # Позволяет restic завершиться при закрытии gzip

        try:
            while True:
                chunk = gzip_process.stdout.read(64 * 1024)  # 64KB chunks
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
        headers={"Content-Disposition": f"attachment; filename={filename}.gz"},
    )
