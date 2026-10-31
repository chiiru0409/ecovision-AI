import logging
from typing import Optional, Any
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.database.models import Classification, CategoryInformation
from app.database.session import SessionLocal
from app.config import settings

logger = logging.getLogger("ecovision.storage")

class StorageService:
    @staticmethod
    def create_classification(
        image_name: str,
        predicted_class: str,
        confidence: float,
        top_predictions: list[dict],
        model_version: str = settings.MODEL_VERSION,
        db: Optional[Session] = None
    ) -> Classification:
        close_on_finish = False
        if db is None:
            db = SessionLocal()
            close_on_finish = True

        try:
            record = Classification(
                image_name=image_name,
                predicted_class=predicted_class,
                confidence=confidence,
                top_predictions=top_predictions,
                model_version=model_version
            )
            db.add(record)
            db.commit()
            db.refresh(record)
            return record
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to save classification: {e}")
            raise
        finally:
            if close_on_finish:
                db.close()

    @staticmethod
    def list_history(
        category: Optional[str] = None,
        search: Optional[str] = None,
        limit: int = 100,
        offset: int = 0,
        db: Optional[Session] = None
    ) -> tuple[list[Classification], int]:
        close_on_finish = False
        if db is None:
            db = SessionLocal()
            close_on_finish = True

        try:
            query = db.query(Classification)
            if category and category.lower() != "all":
                query = query.filter(func.lower(Classification.predicted_class) == category.lower())
            if search:
                term = f"%{search.strip().lower()}%"
                query = query.filter(
                    (func.lower(Classification.image_name).like(term)) |
                    (func.lower(Classification.predicted_class).like(term))
                )
            
            total_count = query.count()
            records = query.order_by(desc(Classification.created_at)).offset(offset).limit(limit).all()
            return records, total_count
        finally:
            if close_on_finish:
                db.close()

    @staticmethod
    def delete_record(record_id: str, db: Optional[Session] = None) -> bool:
        close_on_finish = False
        if db is None:
            db = SessionLocal()
            close_on_finish = True

        try:
            record = db.query(Classification).filter(Classification.id == record_id).first()
            if not record:
                return False
            db.delete(record)
            db.commit()
            return True
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to delete record {record_id}: {e}")
            return False
        finally:
            if close_on_finish:
                db.close()

    @staticmethod
    def get_analytics(db: Optional[Session] = None) -> dict[str, Any]:
        close_on_finish = False
        if db is None:
            db = SessionLocal()
            close_on_finish = True

        try:
            total_count = db.query(Classification).count()
            
            # Counts per category
            category_counts = {cat: 0 for cat in settings.SUPPORTED_CLASSES}
            
            rows = db.query(
                Classification.predicted_class, 
                func.count(Classification.id)
            ).group_by(Classification.predicted_class).all()
            
            for class_name, count in rows:
                # Normalize capitalization
                matched_key = next((c for c in settings.SUPPORTED_CLASSES if c.lower() == class_name.lower()), class_name)
                category_counts[matched_key] = count

            # Calculate percentages
            category_percentages = {}
            for cat, count in category_counts.items():
                pct = round((count / total_count * 100), 2) if total_count > 0 else 0.0
                category_percentages[cat] = pct

            # Recent 10 classifications
            recent_records = db.query(Classification).order_by(
                desc(Classification.created_at)
            ).limit(10).all()

            # Daily trends (grouped by date)
            trend_rows = db.query(
                func.date(Classification.created_at).label("date"),
                func.count(Classification.id).label("count")
            ).group_by(func.date(Classification.created_at)).order_by(desc("date")).limit(14).all()

            daily_trends = [
                {"date": str(r.date), "count": r.count}
                for r in reversed(trend_rows)
            ]

            return {
                "total_classifications": total_count,
                "category_counts": category_counts,
                "category_percentages": category_percentages,
                "recent_activity": [r.to_dict() for r in recent_records],
                "daily_trends": daily_trends
            }
        finally:
            if close_on_finish:
                db.close()

storage_service = StorageService()
