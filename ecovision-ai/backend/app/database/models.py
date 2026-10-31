import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Text, JSON
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class CategoryInformation(Base):
    __tablename__ = "category_information"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    category_name = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=False)
    disposal_method = Column(Text, nullable=False)
    recycling_instructions = Column(Text, nullable=False)
    environmental_benefit = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "category_name": self.category_name,
            "description": self.description,
            "disposal_method": self.disposal_method,
            "recycling_instructions": self.recycling_instructions,
            "environmental_benefit": self.environmental_benefit,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class Classification(Base):
    __tablename__ = "classifications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    image_name = Column(String(255), nullable=False)
    predicted_class = Column(String(50), nullable=False, index=True)
    confidence = Column(Float, nullable=False)
    top_predictions = Column(JSON, nullable=False)
    model_version = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    def to_dict(self):
        return {
            "id": self.id,
            "image_name": self.image_name,
            "predicted_class": self.predicted_class,
            "confidence": round(float(self.confidence), 4),
            "top_predictions": self.top_predictions,
            "model_version": self.model_version,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
