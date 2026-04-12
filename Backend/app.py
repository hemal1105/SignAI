from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import keras
import json
import zipfile
from collections import deque, Counter

app = Flask(__name__)
CORS(app)

# --- 1. THE PATCH LOADER (Fixed for Keras 3 Attribute Error) ---
def strip_quantization_config(config):
    """Recursively removes 'quantization_config' to prevent deserialization errors."""
    if isinstance(config, dict):
        config.pop('quantization_config', None)
        for key, value in list(config.items()):
            strip_quantization_config(value)
    elif isinstance(config, list):
        for item in config:
            strip_quantization_config(item)
    return config

def load_patched_model(model_path):
    """Loads a .keras file by manually stripping problematic config keys."""
    try:
        # Try standard load first
        return keras.models.load_model(model_path)
    except Exception as e:
        print(f"Standard load failed. Patching... Original Error: {e}")
        try:
            # 1. Open the .keras ZIP bundle
            with zipfile.ZipFile(model_path, 'r') as z:
                with z.open('config.json') as f:
                    config_data = json.load(f)
            
            # 2. Clean the config
            clean_config = strip_quantization_config(config_data)
            
            # 3. Rebuild architecture using Keras deserialization
            # This is the Keras 3 way to turn a config dict back into a Model object
            model = keras.saving.deserialize_keras_object(clean_config)
            
            # 4. Load the weights from the same file
            model.load_weights(model_path)
            print("Successfully patched and loaded model using deserialization.")
            return model
        except Exception as patch_error:
            print(f"Patching failed critically: {patch_error}")
            # Final fallback: if you just want to get it running, you can 
            # rebuild the model architecture manually here if you know it.
            raise patch_error

# --- 2. CONFIGURATION & MODEL INITIALIZATION ---
# Update this path to your actual .keras file location
MODEL_PATH = "C:/Users/Shraddha/Desktop/project/SignAI/AI_Model/emotion_model.keras"
model = load_patched_model(MODEL_PATH)

# Class names should match your training order
emotion_classes = ['bad', 'good', 'happy', 'sad', 'upset']
prediction_buffer = deque(maxlen=6) 

@app.route("/predict_emotion", methods=["POST"])
def predict_emotion():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image in request"}), 400
            
        file = request.files['image']
        image_bytes = np.frombuffer(file.read(), np.uint8)
        frame = cv2.imdecode(image_bytes, cv2.IMREAD_COLOR)

        if frame is None:
            return jsonify({"error": "Failed to decode image"}), 400

        # --- 3. PREPROCESS (64x64 RGB) ---
        img = cv2.resize(frame, (64, 64))
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = img.astype("float32") / 255.0 
        input_data = np.expand_dims(img, axis=0)

        # --- 4. PREDICT & BIAS CORRECTION ---
        preds = model.predict(input_data, verbose=0)[0]
        
        # Adjust weights to balance the model
        preds[2] = preds[2] * 0.35  # Reduce Happy bias
        preds[4] = preds[4] * 2.20  # Boost Upset
        preds[3] = preds[3] * 2.50  # Boost Sad
        preds[0] = preds[0] * 1.80  # Boost Bad
        
        idx = np.argmax(preds)
        conf = float(preds[idx])
        label = emotion_classes[idx]

        # --- 5. STABILITY BUFFER ---
        if conf > 0.20:
            prediction_buffer.append(label)
        
        stable_label = Counter(prediction_buffer).most_common(1)[0][0] if prediction_buffer else "Analyzing..."

        return jsonify({
            "emotion": stable_label, 
            "confidence": conf,
            "raw_prediction": label 
        })

    except Exception as e:
        print(f"Prediction Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import cv2
# import numpy as np
# from tensorflow.keras.models import load_model
# import os

# # 1. INITIALIZE APP FIRST (Fixes NameError)
# app = Flask(__name__)
# CORS(app)

# # 2. LOAD MODELS
# # Double check these paths are correct for your folder structure
# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# MODEL_PATH = os.path.join(BASE_DIR, "AI_Model", "emotion_model.keras")
# model = load_model(MODEL_PATH)
# face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# # Ensure alphabetical order: bad, good, happy, sad, ugly
# classes = ["bad", "good", "happy", "sad", "ugly"]

# @app.route("/predict_emotion", methods=["POST"])
# def predict_emotion():
#     try:
#         if 'image' not in request.files:
#             return jsonify({"error": "No image"}), 400

#         file = request.files['image']
#         image_bytes = np.frombuffer(file.read(), np.uint8)
#         frame = cv2.imdecode(image_bytes, cv2.IMREAD_COLOR)

#         if frame is None:
#             return jsonify({"error": "Image decode failed"}), 400

#         # Detection works best on Gray
#         gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#         faces = face_cascade.detectMultiScale(gray, 1.3, 5)

#         if len(faces) == 0:
#             return jsonify({"emotion": "No Face", "confidence": 0})

#         # 3. CROP COLOR IMAGE (Fixes the axis -1 shape mismatch)
#         (x, y, w, h) = faces[0]
#         face_roi = frame[y:y+h, x:x+w]
        
#         # 4. PREPROCESS
#         face_roi = cv2.resize(face_roi, (64, 64))
#         face_roi = face_roi.astype("float32") / 255.0
        
#         # Shape becomes (1, 64, 64, 3)
#         input_data = np.expand_dims(face_roi, axis=0)

#         # 5. PREDICT
#         preds = model.predict(input_data, verbose=0)
#         idx = np.argmax(preds)

#         return jsonify({
#             "emotion": classes[idx],
#             "confidence": float(np.max(preds))
#         })

#     except Exception as e:
#         print(f"Server Error: {e}")
#         return jsonify({"error": str(e)}), 500

# if __name__ == "__main__":
#     # Start the server on port 5000
#     app.run(debug=True, port=5000)