from datetime import datetime, timezone
import logging
from fastapi import APIRouter
from sqlalchemy import text
from app.config import settings
from app.services.classifier import classifier_service
from app.database.session import SessionLocal

router = APIRouter(tags=["Health & Telemetry"])
logger = logging.getLogger("ecovision.health")

@router.get("/health")
def get_health():
    # 1. Model status
    try:
        is_model_ready = classifier_service.is_loaded()
    except Exception as e:
        logger.warning(f"Health check model status warning: {e}")
        is_model_ready = False

    # 2. Database connection status
    db_connected = False
    db_error = None
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        db_connected = True
    except Exception as e:
        db_error = str(e)
        logger.warning(f"Health check database ping notice: {e}")

    # Determine database brand/type
    if settings.DATABASE_URL:
        if "neon.tech" in settings.DATABASE_URL.lower():
            db_type = "Neon PostgreSQL (Cloud Serverless)"
        elif "supabase" in settings.DATABASE_URL.lower():
            db_type = "Supabase PostgreSQL"
        else:
            db_type = "PostgreSQL"
    else:
        db_type = "SQLite (Local Dual-Persistence)"

    return {
        "status": "healthy",
        "service": "EcoVision AI Engine",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "model_loaded": is_model_ready,
        "model_type": classifier_service.model_type if is_model_ready else "Offline/Heuristic Fallback",
        "model_version": settings.MODEL_VERSION,
        "database_connected": db_connected,
        "database_type": db_type,
        "database_status": "connected" if db_connected else f"offline ({db_error})",
        "environment": settings.ENVIRONMENT
    }

@router.get("/model-info")
def get_model_info():
    return {
        "model_name": "EcoVision MobileNetV2 Deep Classifier",
        "architecture": "MobileNetV2 Transfer Learning + Custom Classification Head",
        "model_version": settings.MODEL_VERSION,
        "input_shape": [224, 224, 3],
        "num_classes": len(settings.SUPPORTED_CLASSES),
        "supported_classes": settings.SUPPORTED_CLASSES,
        "confidence_threshold": settings.CONFIDENCE_THRESHOLD,
        "weights": "Pretrained ImageNet + Waste Classification Fine-Tuning"
    }
