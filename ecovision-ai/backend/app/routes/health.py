from datetime import datetime
from fastapi import APIRouter
from app.config import settings
from app.services.classifier import classifier_service

router = APIRouter(tags=["Health & Telemetry"])

@router.get("/health")
def get_health():
    is_model_ready = classifier_service.is_loaded()
    return {
        "status": "healthy",
        "service": "EcoVision AI Engine",
        "timestamp": datetime.utcnow().isoformat(),
        "model_loaded": is_model_ready,
        "model_version": settings.MODEL_VERSION,
        "database_type": "PostgreSQL / Supabase" if settings.DATABASE_URL else "SQLite (Local Dual-Persistence)",
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
