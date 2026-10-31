from typing import Optional, Any
from pydantic import BaseModel, Field

class TopPrediction(BaseModel):
    category: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    percentage: float = Field(..., ge=0.0, le=100.0)
    disposal_summary: Optional[str] = None

class ClassificationResponse(BaseModel):
    id: str
    image_name: str
    predicted_class: str
    confidence: float
    confidence_percentage: float
    top_predictions: list[TopPrediction]
    model_version: str
    description: str
    disposal_method: str
    recycling_instructions: str
    environmental_benefit: str
    created_at: str

class ClassificationListItem(BaseModel):
    id: str
    image_name: str
    predicted_class: str
    confidence: float
    confidence_percentage: float
    top_predictions: list[TopPrediction]
    model_version: str
    created_at: str

class CategoryResponse(BaseModel):
    id: str
    category_name: str
    description: str
    disposal_method: str
    recycling_instructions: str
    environmental_benefit: str

class AnalyticsResponse(BaseModel):
    total_classifications: int
    category_counts: dict[str, int]
    category_percentages: dict[str, float]
    recent_activity: list[ClassificationListItem]
    daily_trends: list[dict[str, Any]]

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    model_loaded: bool
    model_version: str
    database_connected: bool
    database_type: str

class ModelInfoResponse(BaseModel):
    model_name: str
    architecture: str
    model_version: str
    input_shape: list[int]
    num_classes: int
    supported_classes: list[str]
    confidence_threshold: float
