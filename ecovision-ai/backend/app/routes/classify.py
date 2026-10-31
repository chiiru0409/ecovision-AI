import logging
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.classifier import classifier_service
from app.services.storage import storage_service
from app.schemas.classification import ClassificationResponse

router = APIRouter(tags=["Waste Classification"])
logger = logging.getLogger("ecovision.classify_route")

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB

@router.post("/classify", response_model=ClassificationResponse)
async def classify_waste_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # 1. Filename validation
    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing uploaded image filename.")

    # 2. Extension validation
    ext = "." + file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Allowed formats: JPG, JPEG, PNG, WEBP, BMP."
        )

    # 3. Read image contents
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="File exceeds maximum permissible size of 15 MB.")

    # 4. Perform Inference
    try:
        result = classifier_service.predict(contents, filename=file.filename)
    except Exception as e:
        logger.error(f"Image processing error: {e}")
        raise HTTPException(
            status_code=422,
            detail=f"Corrupt or invalid image file. Unable to decode visual features: {str(e)}"
        )

    # 5. Persist to Database
    try:
        record = storage_service.create_classification(
            image_name=file.filename,
            predicted_class=result["predicted_class"],
            confidence=result["confidence"],
            top_predictions=result["top_predictions"],
            model_version=result["model_version"],
            db=db
        )
        record_id = record.id
        created_at_str = record.created_at.isoformat()
    except Exception as e:
        logger.warning(f"Database persistence warning: {e}")
        import uuid
        from datetime import datetime
        record_id = str(uuid.uuid4())
        created_at_str = datetime.utcnow().isoformat()

    # 6. Return response
    return ClassificationResponse(
        id=record_id,
        image_name=file.filename,
        predicted_class=result["predicted_class"],
        confidence=result["confidence"],
        confidence_percentage=result["confidence_percentage"],
        top_predictions=result["top_predictions"],
        model_version=result["model_version"],
        description=result["description"],
        disposal_method=result["disposal_method"],
        recycling_instructions=result["recycling_instructions"],
        environmental_benefit=result["environmental_benefit"],
        created_at=created_at_str
    )
