from fastapi import APIRouter
from app.services.category_service import category_service

router = APIRouter(tags=["Categories & Guidelines"])

@router.get("/categories")
def get_categories():
    categories = category_service.get_all_categories()
    return {
        "total_categories": len(categories),
        "categories": categories
    }
