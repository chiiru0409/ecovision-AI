import os
from pathlib import Path
from dotenv import load_dotenv

# Base Directory of backend
BASE_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = BASE_DIR.parent

# Load .env file
load_dotenv(BASE_DIR / ".env")
load_dotenv(ROOT_DIR / ".env")

class Settings:
    PROJECT_NAME: str = "EcoVision AI – Intelligent Waste Classification System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Server configs
    HOST: str = os.getenv("BACKEND_HOST", "0.0.0.0")
    PORT: int = int(os.getenv("BACKEND_PORT", "8000"))
    
    # CORS
    CORS_ORIGINS: list[str] = [
        origin.strip() 
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000").split(",")
        if origin.strip()
    ]
    
    # ML Engine Settings
    MODEL_PATH: str = os.getenv(
        "MODEL_PATH", 
        str(ROOT_DIR / "ml" / "saved_model" / "ecovision_model.keras")
    )
    CLASS_INDICES_PATH: str = os.getenv(
        "CLASS_INDICES_PATH", 
        str(ROOT_DIR / "ml" / "saved_model" / "class_indices.json")
    )
    MODEL_VERSION: str = os.getenv("MODEL_VERSION", "1.0.0-mobilenetv2")
    CONFIDENCE_THRESHOLD: float = float(os.getenv("CONFIDENCE_THRESHOLD", "0.35"))
    
    # Database Settings (Supabase / SQLite Fallback)
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    SQLITE_PATH: Path = BASE_DIR / "app" / "database" / "ecovision.db"

    # Supported Classes
    SUPPORTED_CLASSES: list[str] = [
        "Cardboard",
        "Glass",
        "Metal",
        "Organic",
        "Paper",
        "Plastic",
        "Trash"
    ]

settings = Settings()
