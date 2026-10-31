import logging
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from app.config import settings, ROOT_DIR, BASE_DIR
from app.database.session import init_db
from app.services.classifier import classifier_service
from app.routes import health, categories, history, analytics, classify

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("ecovision.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize database schema & seeds
    logger.info("Initializing EcoVision AI Backend Services...")
    try:
        init_db()
        logger.info("Database initialized successfully.")
    except Exception as e:
        logger.error(f"Database initialization warning: {e}")

    # Warm up / Load ML Model
    try:
        classifier_service.load_model()
    except Exception as e:
        logger.warning(f"Model warm-up notice: {e}")

    yield

    # Shutdown
    logger.info("EcoVision AI Backend shutting down.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Enterprise AI-powered waste segregation and circular economy analytics platform.",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits local dev and preview servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers under /api
app.include_router(health.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
app.include_router(history.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(classify.router, prefix="/api")

def get_api_info():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs_url": "/docs",
        "api_endpoints": {
            "classify": "/api/classify",
            "history": "/api/history",
            "analytics": "/api/analytics",
            "categories": "/api/categories",
            "health": "/api/health",
            "model_info": "/api/model-info"
        }
    }

@app.get("/api")
@app.get("/api/")
def api_root():
    return get_api_info()

# Locate frontend dist directory across possible deployment setups
dist_candidates = [
    ROOT_DIR / "frontend" / "dist",
    BASE_DIR.parent / "frontend" / "dist",
    Path.cwd() / "ecovision-ai" / "frontend" / "dist",
    Path.cwd() / "frontend" / "dist",
    Path.cwd() / "dist",
]
frontend_dist = None
for candidate in dist_candidates:
    if candidate.exists() and (candidate / "index.html").exists():
        frontend_dist = candidate
        break

if frontend_dist:
    logger.info(f"Mounting frontend assets from {frontend_dist}")
    assets_dir = frontend_dist / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    @app.get("/favicon.svg")
    def serve_favicon():
        fav = frontend_dist / "favicon.svg"
        if fav.exists():
            return FileResponse(str(fav))
        raise HTTPException(status_code=404)

    @app.get("/")
    def serve_root():
        index_file = frontend_dist / "index.html"
        if index_file.exists():
            return FileResponse(str(index_file))
        return get_api_info()

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        # Exclude reserved API/docs prefixes
        if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("openapi"):
            raise HTTPException(status_code=404, detail="Not Found")
        
        target = frontend_dist / full_path
        if target.exists() and target.is_file():
            return FileResponse(str(target))
        
        index_file = frontend_dist / "index.html"
        if index_file.exists():
            return FileResponse(str(index_file))
        raise HTTPException(status_code=404, detail="Not Found")
else:
    @app.get("/")
    def serve_root_fallback():
        return get_api_info()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
