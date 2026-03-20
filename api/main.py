import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load all models
MODELS = {
    "potato": tf.keras.models.load_model("saved_models/1.keras"),
    "pepper": tf.keras.models.load_model("saved_models/2.keras"),
    "tomato": tf.keras.models.load_model("saved_models/3.keras"),
}

# Class names for each crop
CLASS_NAMES = {
    "potato": ["Early Blight", "Late Blight", "Healthy"],
    "pepper": ["Bacterial Spot", "Healthy"],
    "tomato": [
        "Bacterial Spot", "Early Blight", "Late Blight", "Leaf Mold",
        "Septoria Leaf Spot", "Spider Mites", "Target Spot",
        "Yellow Leaf Curl Virus", "Mosaic Virus", "Healthy"
    ],
}

@app.get("/ping")
async def ping():
    return "Hello, I am alive"

@app.get("/crops")
async def get_crops():
    """Return available crops for prediction"""
    return {
        "crops": [
            {"id": "potato", "name": "Potato", "icon": "🥔"},
            {"id": "pepper", "name": "Pepper", "icon": "🌶️"},
            {"id": "tomato", "name": "Tomato", "icon": "🍅"},
        ]
    }

def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image

@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    crop: str = Form(default="potato")
):
    # Validate crop type
    if crop not in MODELS:
        return {"error": f"Invalid crop type. Available: {list(MODELS.keys())}"}
    
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)

    model = MODELS[crop]
    class_names = CLASS_NAMES[crop]
    
    predictions = model.predict(img_batch)

    predicted_class = class_names[np.argmax(predictions[0])]
    confidence = np.max(predictions[0])
    return {
        'class': predicted_class,
        'confidence': float(confidence),
        'crop': crop
    }


# if __name__ == "__main__":
#     uvicorn.run(app, host='localhost', port=8000)
