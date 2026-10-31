from typing import Optional
from app.database.session import DEFAULT_CATEGORIES

CATEGORY_MAP = {
    cat["category_name"].lower(): cat for cat in DEFAULT_CATEGORIES
}

class CategoryService:
    @staticmethod
    def get_all_categories() -> list[dict]:
        return DEFAULT_CATEGORIES

    @staticmethod
    def get_category_by_name(name: str) -> Optional[dict]:
        clean_name = name.strip().lower()
        return CATEGORY_MAP.get(clean_name)

    @staticmethod
    def get_disposal_summary(name: str) -> str:
        cat = CategoryService.get_category_by_name(name)
        if cat:
            return cat["disposal_method"][:90] + "..."
        return "Dispose according to municipal recycling guidelines."

category_service = CategoryService()
