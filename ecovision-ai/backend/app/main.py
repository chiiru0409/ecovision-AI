import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
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

@app.get("/")
def root():
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
