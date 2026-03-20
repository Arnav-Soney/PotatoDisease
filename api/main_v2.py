"""
Tomato Disease Classification API v2.0
Production-ready with uncertainty estimation, calibration, and explainability
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import tensorflow as tf
from tensorflow import keras
import cv2
from PIL import Image
import io
import json
import os
from typing import Optional
import base64

app = FastAPI(
    title="Plant Disease Classification API v2.0",
    description="Modern ML API with uncertainty estimation, calibration, and Grad-CAM explainability",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# Configuration
# ============================================================
class Config:
    MODEL_PATH = "saved_models_v2/tomato_disease_v2.keras"
    METADATA_PATH = "saved_models_v2/model_metadata.json"
    IMAGE_SIZE = 224
    MC_DROPOUT_SAMPLES = 10
    CONFIDENCE_THRESHOLD = 0.7

config = Config()

# ============================================================
# Load Model and Metadata
# ============================================================
model = None
metadata = None
gradcam = None

def load_model():
    global model, metadata, gradcam
    
    # Load model
    model = keras.models.load_model(
        config.MODEL_PATH,
        custom_objects={
            'FocalLoss': FocalLoss,
            'SoftAccuracy': SoftAccuracy
        }
    )
    
    # Load metadata
    with open(config.METADATA_PATH, 'r') as f:
        metadata = json.load(f)
    
    # Initialize Grad-CAM
    gradcam = GradCAM(model)
    
    print(f"✅ Model loaded: {metadata['backbone']}")
    print(f"   Classes: {metadata['class_names']}")


# ============================================================
# Custom Classes (same as training)
# ============================================================
class FocalLoss(keras.losses.Loss):
    def __init__(self, gamma=2.0, alpha=0.25, num_classes=None, **kwargs):
        super().__init__(**kwargs)
        self.gamma = gamma
        self.alpha = alpha
        self.num_classes = num_classes
    
    def call(self, y_true, y_pred):
        y_pred = tf.clip_by_value(y_pred, 1e-7, 1 - 1e-7)
        if len(y_true.shape) == 1 or y_true.shape[-1] == 1:
            y_true = tf.one_hot(tf.cast(y_true, tf.int32), self.num_classes)
            y_true = tf.squeeze(y_true)
        cross_entropy = -y_true * tf.math.log(y_pred)
        focal_weight = self.alpha * tf.pow(1 - y_pred, self.gamma)
        return tf.reduce_mean(tf.reduce_sum(focal_weight * cross_entropy, axis=-1))
    
    def get_config(self):
        return {'gamma': self.gamma, 'alpha': self.alpha, 'num_classes': self.num_classes}


class SoftAccuracy(keras.metrics.Metric):
    def __init__(self, name='accuracy', **kwargs):
        super().__init__(name=name, **kwargs)
        self.correct = self.add_weight(name='correct', initializer='zeros')
        self.total = self.add_weight(name='total', initializer='zeros')
    
    def update_state(self, y_true, y_pred, sample_weight=None):
        y_pred_class = tf.argmax(y_pred, axis=-1)
        if len(y_true.shape) > 1 and y_true.shape[-1] > 1:
            y_true_class = tf.argmax(y_true, axis=-1)
        else:
            y_true_class = tf.cast(tf.round(y_true), tf.int64)
            if len(y_true_class.shape) > 1:
                y_true_class = tf.squeeze(y_true_class, axis=-1)
        correct = tf.cast(tf.equal(y_pred_class, y_true_class), tf.float32)
        self.correct.assign_add(tf.reduce_sum(correct))
        self.total.assign_add(tf.cast(tf.shape(y_true)[0], tf.float32))
    
    def result(self):
        return self.correct / (self.total + 1e-7)
    
    def reset_state(self):
        self.correct.assign(0)
        self.total.assign(0)


class GradCAM:
    """Grad-CAM for model explainability"""
    
    def __init__(self, model, layer_name=None):
        self.model = model
        
        if layer_name is None:
            for layer in reversed(model.layers):
                if len(layer.output_shape) == 4:
                    layer_name = layer.name
                    break
        
        self.layer_name = layer_name
        self.grad_model = keras.Model(
            inputs=model.input,
            outputs=[model.get_layer(layer_name).output, model.output]
        )
    
    def compute_heatmap(self, image, class_idx=None, eps=1e-8):
        if len(image.shape) == 3:
            image = np.expand_dims(image, 0)
        
        image = tf.cast(image, tf.float32)
        
        with tf.GradientTape() as tape:
            conv_outputs, predictions = self.grad_model(image)
            if class_idx is None:
                class_idx = tf.argmax(predictions[0])
            class_output = predictions[:, class_idx]
        
        grads = tape.gradient(class_output, conv_outputs)
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        
        conv_outputs = conv_outputs[0]
        heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
        heatmap = tf.squeeze(heatmap)
        heatmap = tf.maximum(heatmap, 0) / (tf.reduce_max(heatmap) + eps)
        
        return heatmap.numpy()
    
    def overlay_heatmap(self, image, heatmap, alpha=0.4):
        heatmap_resized = cv2.resize(heatmap, (image.shape[1], image.shape[0]))
        heatmap_colored = cv2.applyColorMap(np.uint8(255 * heatmap_resized), cv2.COLORMAP_JET)
        heatmap_colored = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)
        
        if image.max() <= 1.0:
            image = (image * 255).astype(np.uint8)
        
        return cv2.addWeighted(image, 1 - alpha, heatmap_colored, alpha, 0)


# ============================================================
# Helper Functions
# ============================================================
def preprocess_image(image_bytes):
    """Preprocess uploaded image"""
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    image = image.resize((config.IMAGE_SIZE, config.IMAGE_SIZE))
    image_array = np.array(image)
    return image_array


def apply_temperature_scaling(probs, temperature):
    """Apply temperature scaling for calibration"""
    scaled = np.log(probs + 1e-7) / temperature
    exp_scaled = np.exp(scaled - np.max(scaled, axis=-1, keepdims=True))
    return exp_scaled / exp_scaled.sum(axis=-1, keepdims=True)


def predict_with_uncertainty(image, n_samples=10):
    """MC Dropout prediction with uncertainty"""
    image_batch = np.expand_dims(image, 0)
    
    predictions = []
    for _ in range(n_samples):
        pred = model(image_batch, training=True)  # Keep dropout active
        predictions.append(pred.numpy())
    
    predictions = np.array(predictions)
    mean_pred = predictions.mean(axis=0)
    uncertainty = predictions.std(axis=0).mean(axis=-1)
    entropy = -np.sum(mean_pred * np.log(mean_pred + 1e-7), axis=-1)
    
    return mean_pred[0], uncertainty[0], entropy[0]


def image_to_base64(image_array):
    """Convert numpy array to base64 string"""
    image = Image.fromarray(image_array.astype(np.uint8))
    buffer = io.BytesIO()
    image.save(buffer, format='PNG')
    return base64.b64encode(buffer.getvalue()).decode()


# ============================================================
# API Endpoints
# ============================================================
@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    try:
        load_model()
    except Exception as e:
        print(f"⚠️ Failed to load model: {e}")
        print("   API will work but predictions unavailable until model is loaded")


@app.get("/")
async def root():
    return {
        "message": "Plant Disease Classification API v2.0",
        "features": [
            "Transfer Learning (EfficientNetV2)",
            "MC Dropout Uncertainty",
            "Temperature Scaling Calibration",
            "Grad-CAM Explainability"
        ]
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "classes": metadata['class_names'] if metadata else None
    }


@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    include_explanation: bool = False,
    n_uncertainty_samples: int = 10
):
    """
    Predict plant disease with confidence and uncertainty
    
    Args:
        file: Image file (JPEG, PNG)
        include_explanation: Include Grad-CAM heatmap
        n_uncertainty_samples: Number of MC Dropout samples
    
    Returns:
        prediction: Predicted class
        confidence: Calibrated confidence
        uncertainty: Epistemic uncertainty (lower = more certain)
        is_reliable: Whether prediction meets reliability threshold
        top3: Top 3 predictions with probabilities
        explanation_image: Base64 Grad-CAM overlay (if requested)
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    # Read and preprocess image
    image_bytes = await file.read()
    image = preprocess_image(image_bytes)
    
    # Get prediction with uncertainty
    mean_pred, uncertainty, entropy = predict_with_uncertainty(
        image, n_samples=n_uncertainty_samples
    )
    
    # Apply calibration
    calibrated_pred = apply_temperature_scaling(
        mean_pred, 
        metadata['calibration_temperature']
    )
    
    # Get predictions
    top_idx = int(np.argmax(calibrated_pred))
    top_confidence = float(calibrated_pred[top_idx])
    
    # Top 3
    top3_idx = np.argsort(calibrated_pred)[-3:][::-1]
    top3 = [
        {"class": metadata['class_names'][idx], "probability": float(calibrated_pred[idx])}
        for idx in top3_idx
    ]
    
    # Reliability check
    is_reliable = (
        top_confidence >= config.CONFIDENCE_THRESHOLD and
        uncertainty < 0.15
    )
    
    response = {
        "prediction": metadata['class_names'][top_idx],
        "confidence": round(top_confidence, 4),
        "uncertainty": round(float(uncertainty), 4),
        "entropy": round(float(entropy), 4),
        "is_reliable": is_reliable,
        "reliability_message": "High confidence prediction" if is_reliable else "Low confidence - consider manual verification",
        "top3_predictions": top3
    }
    
    # Add Grad-CAM explanation if requested
    if include_explanation:
        heatmap = gradcam.compute_heatmap(image, class_idx=top_idx)
        overlaid = gradcam.overlay_heatmap(image, heatmap)
        response["explanation_image"] = image_to_base64(overlaid)
        response["heatmap"] = image_to_base64(
            (cv2.applyColorMap(np.uint8(255 * cv2.resize(heatmap, (config.IMAGE_SIZE, config.IMAGE_SIZE))), 
                              cv2.COLORMAP_JET))
        )
    
    return response


@app.post("/predict/batch")
async def predict_batch(files: list[UploadFile] = File(...)):
    """Batch prediction for multiple images"""
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    results = []
    for file in files:
        image_bytes = await file.read()
        image = preprocess_image(image_bytes)
        
        mean_pred, uncertainty, entropy = predict_with_uncertainty(image, n_samples=5)
        calibrated_pred = apply_temperature_scaling(mean_pred, metadata['calibration_temperature'])
        
        top_idx = int(np.argmax(calibrated_pred))
        
        results.append({
            "filename": file.filename,
            "prediction": metadata['class_names'][top_idx],
            "confidence": round(float(calibrated_pred[top_idx]), 4),
            "uncertainty": round(float(uncertainty), 4)
        })
    
    return {"predictions": results}


@app.get("/classes")
async def get_classes():
    """Get list of supported disease classes"""
    if metadata is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    return {
        "num_classes": metadata['num_classes'],
        "classes": metadata['class_names']
    }


@app.get("/model/info")
async def model_info():
    """Get model information and configuration"""
    if metadata is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    return {
        "backbone": metadata['backbone'],
        "image_size": metadata['image_size'],
        "num_classes": metadata['num_classes'],
        "calibration_temperature": metadata['calibration_temperature'],
        "confidence_threshold": config.CONFIDENCE_THRESHOLD,
        "mc_dropout_samples": config.MC_DROPOUT_SAMPLES,
        "test_accuracy": metadata.get('test_accuracy'),
        "features": [
            "Transfer Learning",
            "Focal Loss",
            "MC Dropout Uncertainty",
            "Temperature Scaling",
            "Grad-CAM Explainability"
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
