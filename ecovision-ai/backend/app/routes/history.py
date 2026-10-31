from typing import Optional
from fastapi import APIRouter, Query, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.storage import storage_service

router = APIRouter(tags=["Classification History"])

@router.get("/history")
def get_history(
    category: Optional[str] = Query(None, description="Filter by predicted category"),
    search: Optional[str] = Query(None, description="Search by image filename or category"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    records, total_count = storage_service.list_history(
        category=category,
        search=search,
        limit=limit,
        offset=offset,
        db=db
    )
    return {
        "total": total_count,
        "limit": limit,
        "offset": offset,
        "items": [r.to_dict() for r in records]
    }

@router.delete("/history/{record_id}")
def delete_history_item(record_id: str, db: Session = Depends(get_db)):
    success = storage_service.delete_record(record_id, db=db)
    if not success:
        raise HTTPException(status_code=404, detail="Classification record not found")
    return {"status": "success", "message": f"Record {record_id} deleted successfully"}
