"""
EcoVision AI - Model Evaluation & Performance Analysis
Evaluates the trained MobileNetV2 model on the held-out test split (15%).
Generates:
- Actual Confusion Matrix Heatmap (ml/results/confusion_matrix.png)
- Full Classification Report with Precision, Recall, and F1-Score (ml/results/classification_report.json)
- Per-class performance breakdown and overall test accuracy
"""

import os
import json
from pathlib import Path
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import tensorflow as tf
from tensorflow import keras

BASE_DIR = Path(__file__).resolve().parent
TEST_DIR = BASE_DIR / "dataset" / "splits" / "test"
SAVED_MODEL_DIR = BASE_DIR / "saved_model"
RESULTS_DIR = BASE_DIR / "results"

IMG_SIZE = (224, 224)
BATCH_SIZE = 16

def evaluate_model():
    model_path = SAVED_MODEL_DIR / "ecovision_model.keras"
    if not model_path.exists():
        print(f"[!] Error: Model file not found at {model_path}. Train the model first via train.py!")
        return

    print(f"[*] Loading trained EcoVision model from {model_path}...")
    model = keras.models.load_model(model_path)

    # Load test dataset
    print(f"[*] Ingesting test dataset from {TEST_DIR}...")
    test_ds = keras.utils.image_dataset_from_directory(
        TEST_DIR,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        label_mode="categorical",
        shuffle=False
    )

    class_names = test_ds.class_names
    print(f"[+] Evaluating over {len(class_names)} classes: {class_names}")

    # Collect ground truths and raw predictions
    y_true_indices = []
    y_pred_indices = []

    print("[*] Running inference on held-out test samples...")
    for images, labels in test_ds:
        preds = model.predict(images, verbose=0)
        y_pred_batch = np.argmax(preds, axis=1)
        y_true_batch = np.argmax(labels.numpy(), axis=1)

        y_pred_indices.extend(y_pred_batch)
        y_true_indices.extend(y_true_batch)

    y_true = np.array(y_true_indices)
    y_pred = np.array(y_pred_indices)

    # 1. Overall Test Accuracy
    test_accuracy = accuracy_score(y_true, y_pred)
    print(f"\n==========================================")
    print(f"    ECOVISION AI TEST ACCURACY: {test_accuracy * 100:.2f}%")
    print(f"==========================================\n")

    # 2. Confusion Matrix
    cm = confusion_matrix(y_true, y_pred)
    
    plt.figure(figsize=(9, 7))
    sns.heatmap(
        cm,
        annot=True,
        fmt="d",
        cmap="Blues",
        xticklabels=class_names,
        yticklabels=class_names,
        cbar=True,
        linewidths=1.5,
        linecolor="#f1f5f9"
    )
    plt.title("EcoVision AI – Waste Classification Confusion Matrix", fontsize=13, fontweight="bold", pad=15)
    plt.xlabel("Predicted Category", fontsize=11, fontweight="medium", labelpad=10)
    plt.ylabel("Actual Ground Truth", fontsize=11, fontweight="medium", labelpad=10)
    plt.tight_layout()

    cm_path = RESULTS_DIR / "confusion_matrix.png"
    plt.savefig(cm_path, dpi=200)
    plt.close()
    print(f"[+] Confusion matrix saved to {cm_path}")

    # 3. Classification Report
    report_dict = classification_report(
        y_true,
        y_pred,
        target_names=class_names,
        output_dict=True,
        zero_division=0
    )
    report_str = classification_report(
        y_true,
        y_pred,
        target_names=class_names,
        zero_division=0
    )

    print("--- Detailed Classification Report ---")
    print(report_str)

    # Save metrics to JSON
    report_dict["overall_test_accuracy"] = round(test_accuracy, 4)
    report_dict["total_test_samples"] = len(y_true)
    report_dict["classes"] = class_names

    metrics_file = RESULTS_DIR / "classification_report.json"
    with open(metrics_file, "w") as f:
        json.dump(report_dict, f, indent=2)

    print(f"[+] Evaluation metrics saved to {metrics_file}")

if __name__ == "__main__":
    evaluate_model()
