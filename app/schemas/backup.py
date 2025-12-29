"""Pydantic schemas for API requests and responses."""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    username: str
    password: str


class SnapshotResponse(BaseModel):
    id: str
    time: datetime
    hostname: str
    username: str
    tags: Optional[List[str]] = None
    size: Optional[int] = None


class FileInfo(BaseModel):
    name: str
    type: str
    path: str
    size: Optional[int] = None
    mode: Optional[int] = None
    mtime: Optional[datetime] = None


class BackupRequest(BaseModel):
    tags: Optional[List[str]] = Field(default_factory=list)


class BackupResponse(BaseModel):
    snapshot_id: Optional[str] = None
    message: str
    files_count: int
