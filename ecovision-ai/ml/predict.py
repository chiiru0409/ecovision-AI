"""
EcoVision AI - CLI Prediction Tool
Performs inference on a single image and prints category probabilities,
top-3 rankings, and disposal guidelines.
"""

import sys
import json
from pathlib import Path
from PIL import Image
import numpy as np
import tensorflow as tf
from tensorflow import keras

BASE_DIR = Path(__file__).resolve().parent
SAVED_MODEL_DIR = BASE_DIR / "saved_model"

CLASSES = [
    "cardboard",
    "glass",
    "metal",
    "organic",
    "paper",
    "plastic",
    "trash"
]

def predict_image(image_path: str):
    path = Path(image_path)
    if not path.exists():
        print(f"[!] Error: Image file '{image_path}' not found.")
        return

    model_path = SAVED_MODEL_DIR / "ecovision_model.keras"
    if not model_path.exists():
        print(f"[!] Model not found at {model_path}. Please run train.py first.")
        return

    # Load model and class indices
    model = keras.models.load_model(model_path)
    class_indices_path = SAVED_MODEL_DIR / "class_indices.json"
    if class_indices_path.exists():
        with open(class_indices_path, "r") as f:
            idx_map = json.load(f)
            # Invert mapping to index -> class name
            inv_map = {v: k for k, v in idx_map.items()}
    else:
        inv_map = {i: c for i, c in enumerate(CLASSES)}

    # Preprocess image
    img = Image.open(path).convert("RGB").resize((224, 224))
    img_array = np.array(img, dtype=np.float32)
    img_array = keras.applications.mobilenet_v2.preprocess_input(img_array)
    img_batch = np.expand_dims(img_array, axis=0)

    # Predict
    probabilities = model.predict(img_batch, verbose=0)[0]
    
    # Sort descending
    sorted_indices = np.argsort(probabilities)[::-1]
    top_class = inv_map[sorted_indices[0]]
    top_confidence = probabilities[sorted_indices[0]]

    print("\n" + "="*50)
    print("      ECOVISION AI INFERENCE RESULTS")
    print("="*50)
    print(f"File: {path.name}")
    print(f"Predicted Class: {top_class.upper()}")
    print(f"Confidence:      {top_confidence * 100:.2f}%\n")
    print("Top 3 Candidates:")
    for rank, idx in enumerate(sorted_indices[:3], 1):
        c_name = inv_map[idx]
        conf = probabilities[idx]
        bar = "█" * int(conf * 25)
        print(f"  {rank}. {c_name.capitalize():10s} {conf*100:6.2f}% | {bar}")
    print("="*50 + "\n")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python predict.py <path_to_image>")
    else:
        predict_image(sys.argv[1])
