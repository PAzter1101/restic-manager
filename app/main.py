"""Main FastAPI application."""

import os

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from routers import auth, backup

app = FastAPI(title="Restic Web Manager")

# Mount static files FIRST (before API routes)
static_dir = "static"
if os.path.exists(static_dir):
    # Mount assets for React build files
    assets_dir = os.path.join(static_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Include API routers with /api prefix
app.include_router(auth.router, prefix="/api")
app.include_router(backup.router, prefix="/api")


@app.get("/")
async def read_index():
    """Serve React app."""
    if os.path.exists("static/index.html"):
        return FileResponse("static/index.html")
    return {"message": "React app not built"}


# Catch-all route for SPA (must be LAST)
@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    """Serve React app for any unmatched routes (SPA routing)."""
    if os.path.exists("static/index.html"):
        return FileResponse("static/index.html")
    return {"message": "React app not built"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
