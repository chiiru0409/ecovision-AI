import sys
from pathlib import Path

# Resolve base directories
ROOT_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = ROOT_DIR / "ecovision-ai" / "backend"
if not BACKEND_DIR.exists():
    BACKEND_DIR = ROOT_DIR / "backend"

# Ensure all relevant paths are on sys.path for serverless resolution
for p in [
    str(BACKEND_DIR),
    str(BACKEND_DIR / "app"),
    str(ROOT_DIR),
    str(ROOT_DIR / "ecovision-ai")
]:
    if p not in sys.path:
        sys.path.insert(0, p)

from app.main import app
