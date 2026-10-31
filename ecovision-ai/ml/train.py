"""
EcoVision AI - Model Training Pipeline
Trains a MobileNetV2 Transfer Learning Architecture on the 7-class waste dataset.
Includes:
- Data Augmentation & Normalization
- Pretrained MobileNetV2 Feature Extractor
- Custom Classification Head with Dropout & Regularization
- Multi-phase Training (Feature Extraction + Fine-Tuning)
- Checkpointing, Learning Rate Scheduling, and Metrics Visualization
"""

import os
import sys
import json
import matplotlib.pyplot as plt
from pathlib import Path
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, regularizers

# Paths
BASE_DIR = Path(__file__).resolve().parent
SPLITS_DIR = BASE_DIR / "dataset" / "splits"
SAVED_MODEL_DIR = BASE_DIR / "saved_model"
RESULTS_DIR = BASE_DIR / "results"

SAVED_MODEL_DIR.mkdir(parents=True, exist_ok=True)
RESULTS_DIR.mkdir(parents=True, exist_ok=True)

# Hyperparameters
IMG_SIZE = (224, 224)
BATCH_SIZE = 16
NUM_CLASSES = 7
INITIAL_EPOCHS = 8
FINE_TUNE_EPOCHS = 4
TOTAL_EPOCHS = INITIAL_EPOCHS + FINE_TUNE_EPOCHS

def load_datasets():
    train_dir = SPLITS_DIR / "train"
    val_dir = SPLITS_DIR / "val"
    test_dir = SPLITS_DIR / "test"

    print(f"[*] Loading training dataset from {train_dir}...")
    train_ds = keras.utils.image_dataset_from_directory(
        train_dir,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        label_mode="categorical",
        shuffle=True,
        seed=42
    )

    print(f"[*] Loading validation dataset from {val_dir}...")
    val_ds = keras.utils.image_dataset_from_directory(
        val_dir,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        label_mode="categorical",
        shuffle=False
    )

    class_names = train_ds.class_names
    print(f"[+] Loaded {len(class_names)} classes: {class_names}")

    # Optimize pipeline performance
    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.prefetch(buffer_size=AUTOTUNE)

    return train_ds, val_ds, class_names

def build_model(num_classes: int):
    """
    Builds the MobileNetV2 transfer learning model with data augmentation
    and custom dense classification head.
    """
    # 1. Data Augmentation
    data_augmentation = keras.Sequential([
        layers.RandomFlip("horizontal"),
        layers.RandomRotation(0.12),
        layers.RandomZoom(0.1),
        layers.RandomContrast(0.1),
    ], name="data_augmentation")

    # 2. Base Pretrained Model
    base_model = keras.applications.MobileNetV2(
        input_shape=(224, 224, 3),
        include_top=False,
        weights="imagenet"
    )
    base_model.trainable = False  # Freeze base model initially

    # 3. Model Pipeline
    inputs = keras.Input(shape=(224, 224, 3), name="input_image")
    x = data_augmentation(inputs)
    x = keras.applications.mobilenet_v2.preprocess_input(x)
    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D(name="global_avg_pool")(x)
    x = layers.BatchNormalization(name="batch_norm")(x)
    x = layers.Dense(256, activation="relu", kernel_regularizer=regularizers.l2(1e-4), name="dense_256")(x)
    x = layers.Dropout(0.4, name="dropout_head")(x)
    outputs = layers.Dense(num_classes, activation="softmax", name="waste_probabilities")(x)

    model = keras.Model(inputs=inputs, outputs=outputs, name="EcoVision_MobileNetV2")
    return model, base_model

def plot_training_history(history, fine_tune_history=None):
    """Generates and saves professional accuracy and loss curves."""
    acc = history.history["accuracy"]
    val_acc = history.history["val_accuracy"]
    loss = history.history["loss"]
    val_loss = history.history["val_loss"]

    if fine_tune_history:
        acc += fine_tune_history.history["accuracy"]
        val_acc += fine_tune_history.history["val_accuracy"]
        loss += fine_tune_history.history["loss"]
        val_loss += fine_tune_history.history["val_loss"]

    epochs_range = range(len(acc))

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
    fig.patch.set_facecolor('#ffffff')

    # Accuracy Plot
    ax1.plot(epochs_range, acc, label="Training Accuracy", color="#059669", linewidth=2.5)
    ax1.plot(epochs_range, val_acc, label="Validation Accuracy", color="#3b82f6", linewidth=2.5, linestyle="--")
    if fine_tune_history:
        ax1.axvline(x=INITIAL_EPOCHS-1, color="#ef4444", linestyle=":", label="Fine-Tuning Start")
    ax1.set_title("EcoVision AI – Model Accuracy", fontsize=14, fontweight="bold", pad=12)
    ax1.set_xlabel("Epochs", fontsize=11)
    ax1.set_ylabel("Accuracy", fontsize=11)
    ax1.set_ylim([0.0, 1.05])
    ax1.grid(True, linestyle=":", alpha=0.6)
    ax1.legend(loc="lower right")

    # Loss Plot
    ax2.plot(epochs_range, loss, label="Training Loss", color="#059669", linewidth=2.5)
    ax2.plot(epochs_range, val_loss, label="Validation Loss", color="#ef4444", linewidth=2.5, linestyle="--")
    if fine_tune_history:
        ax2.axvline(x=INITIAL_EPOCHS-1, color="#ef4444", linestyle=":", label="Fine-Tuning Start")
    ax2.set_title("EcoVision AI – Categorical Cross-Entropy Loss", fontsize=14, fontweight="bold", pad=12)
    ax2.set_xlabel("Epochs", fontsize=11)
    ax2.set_ylabel("Loss", fontsize=11)
    ax2.grid(True, linestyle=":", alpha=0.6)
    ax2.legend(loc="upper right")

    plt.tight_layout()
    chart_path = RESULTS_DIR / "training_curves.png"
    plt.savefig(chart_path, dpi=200)
    plt.close()
    print(f"[+] Training curves saved to {chart_path}")

def train_pipeline():
    train_ds, val_ds, class_names = load_datasets()

    # Save class indices
    class_indices = {cls: idx for idx, cls in enumerate(class_names)}
    with open(SAVED_MODEL_DIR / "class_indices.json", "w") as f:
        json.dump(class_indices, f, indent=2)

    model, base_model = build_model(len(class_names))
    model.summary()

    # Phase 1: Feature Extraction
    print("\n" + "="*60)
    print("PHASE 1: Training Classification Head (Feature Extraction)")
    print("="*60)
    
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=1e-3),
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )

    checkpoint_path = SAVED_MODEL_DIR / "ecovision_model.keras"
    callbacks = [
        keras.callbacks.EarlyStopping(monitor="val_loss", patience=5, restore_best_weights=True),
        keras.callbacks.ReduceLROnPlateau(monitor="val_loss", factor=0.3, patience=2, min_lr=1e-6),
        keras.callbacks.ModelCheckpoint(filepath=str(checkpoint_path), monitor="val_accuracy", save_best_only=True)
    ]

    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=INITIAL_EPOCHS,
        callbacks=callbacks
    )

    # Phase 2: Fine-Tuning top MobileNetV2 layers
    print("\n" + "="*60)
    print("PHASE 2: Fine-Tuning Top MobileNetV2 Layers")
    print("="*60)

    base_model.trainable = True
    # Freeze all layers before the 100th layer
    for layer in base_model.layers[:100]:
        layer.trainable = False

    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=1e-5),
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )

    fine_tune_history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=TOTAL_EPOCHS,
        initial_epoch=history.epoch[-1] + 1,
        callbacks=callbacks
    )

    # Plot & Save Curves
    plot_training_history(history, fine_tune_history)

    # Save final model
    model.save(checkpoint_path)
    print(f"\n[+] Trained model saved successfully to {checkpoint_path}")

    # Metadata record
    final_val_acc = float(fine_tune_history.history["val_accuracy"][-1])
    final_val_loss = float(fine_tune_history.history["val_loss"][-1])
    metadata = {
        "model_name": "EcoVision_MobileNetV2",
        "version": "1.0.0-mobilenetv2",
        "classes": class_names,
        "input_shape": [224, 224, 3],
        "final_val_accuracy": round(final_val_acc, 4),
        "final_val_loss": round(final_val_loss, 4),
        "total_parameters": int(model.count_params())
    }
    with open(SAVED_MODEL_DIR / "model_metadata.json", "w") as f:
        json.dump(metadata, f, indent=2)

    print("[+] Model metadata saved:")
    print(json.dumps(metadata, indent=2))

if __name__ == "__main__":
    train_pipeline()
