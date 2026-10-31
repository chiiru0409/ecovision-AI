from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.storage import storage_service

router = APIRouter(tags=["Analytics & Statistics"])

@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    analytics_data = storage_service.get_analytics(db=db)
    return analytics_data
