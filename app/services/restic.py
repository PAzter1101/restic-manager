"""Restic backup operations service."""
import json
import subprocess
import tempfile
from pathlib import Path
from typing import List, Optional

from fastapi import HTTPException, UploadFile

from config import settings


class ResticService:
    """Service for restic operations."""
    
    def __init__(self):
        self.env = settings.get_restic_env()
    
    def get_snapshots(self, host: Optional[str] = None, tag: Optional[str] = None) -> List[dict]:
        """Get list of snapshots."""
        cmd = ["restic", "snapshots", "--json"]
        if host:
            cmd.extend(["--host", host])
        if tag:
            cmd.extend(["--tag", tag])

        result = subprocess.run(cmd, env=self.env, capture_output=True, text=True)
        if result.returncode != 0:
            raise HTTPException(status_code=500, detail=f"Restic error: {result.stderr}")

        snapshots = json.loads(result.stdout)
        
        # Добавляем размер как null - будет загружаться отдельно
        for snapshot in snapshots:
            snapshot["size"] = None

        return snapshots
    
    def get_snapshot_size(self, snapshot_id: str) -> int:
        """Get snapshot size."""
        try:
            stats_cmd = ["restic", "stats", snapshot_id, "--json"]
            stats_result = subprocess.run(
                stats_cmd, env=self.env, capture_output=True, text=True
            )

            if stats_result.returncode == 0:
                stats = json.loads(stats_result.stdout)
                return stats.get("total_size", 0)
            else:
                return 0
        except Exception:
            return 0
    
    def get_snapshot_files(self, snapshot_id: str) -> List[dict]:
        """Get files in snapshot."""
        cmd = ["restic", "ls", snapshot_id, "--json"]
        result = subprocess.run(cmd, env=self.env, capture_output=True, text=True)
        if result.returncode != 0:
            raise HTTPException(status_code=500, detail=f"Restic error: {result.stderr}")

        files = []
        for line in result.stdout.strip().split("\n"):
            if line:
                files.append(json.loads(line))
        return files
    
    def create_backup(self, files: List[UploadFile], tags: Optional[List[str]] = None) -> dict:
        """Create backup from uploaded files."""
        # Валидация размера файлов
        total_size = 0
        for file in files:
            file.file.seek(0, 2)  # Перейти в конец файла
            file_size = file.file.tell()
            file.file.seek(0)  # Вернуться в начало
            
            if file_size > settings.max_file_size_bytes:
                raise HTTPException(
                    status_code=413, 
                    detail=f"File {file.filename} is too large. Max size: {settings.MAX_FILE_SIZE}MB"
                )
            total_size += file_size
        
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)
            
            # Сохраняем загруженные файлы во временную директорию
            for file in files:
                file_path = temp_path / file.filename
                with open(file_path, "wb") as f:
                    content = file.file.read()
                    f.write(content)
            
            # Создаем бекап
            cmd = ["restic", "backup", str(temp_path)]
            if tags:
                for tag in tags:
                    cmd.extend(["--tag", tag])
            
            result = subprocess.run(cmd, env=self.env, capture_output=True, text=True)
            if result.returncode != 0:
                raise HTTPException(status_code=500, detail=f"Backup failed: {result.stderr}")
            
            # Парсим вывод для получения информации о созданном снапшоте
            lines = result.stderr.strip().split('\n')
            snapshot_info = {}
            
            for line in lines:
                if "snapshot" in line.lower() and "saved" in line.lower():
                    # Пытаемся извлечь ID снапшота из строки
                    parts = line.split()
                    for part in parts:
                        if len(part) == 8 and part.isalnum():  # ID снапшота обычно 8 символов
                            snapshot_info["snapshot_id"] = part
                            break
            
            snapshot_info["message"] = "Backup created successfully"
            snapshot_info["files_count"] = len(files)
            
            return snapshot_info


restic_service = ResticService()
