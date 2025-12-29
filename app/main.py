"""Main FastAPI application."""
import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from routers import auth, backup

app = FastAPI(title="Restic Web Manager")

# Mount static files if directory exists
static_dir = "static"
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Include routers
app.include_router(auth.router)
app.include_router(backup.router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
