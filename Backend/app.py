from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from tensorflow.keras.models import load_model

# 1. INITIALIZE APP FIRST (Fixes NameError)
app = Flask(__name__)
CORS(app)

# 2. LOAD MODELS
# Double check these paths are correct for your folder structure
model = load_model("C:/termwork/Sem6/MiniProject/AI_Model/emotion_model.keras")
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Ensure alphabetical order: bad, good, happy, sad, ugly
classes = ["bad", "good", "happy", "sad", "ugly"]

@app.route("/predict_emotion", methods=["POST"])
def predict_emotion():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image"}), 400

        file = request.files['image']
        image_bytes = np.frombuffer(file.read(), np.uint8)
        frame = cv2.imdecode(image_bytes, cv2.IMREAD_COLOR)

        if frame is None:
            return jsonify({"error": "Image decode failed"}), 400

        # Detection works best on Gray
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        if len(faces) == 0:
            return jsonify({"emotion": "No Face", "confidence": 0})

        # 3. CROP COLOR IMAGE (Fixes the axis -1 shape mismatch)
        (x, y, w, h) = faces[0]
        face_roi = frame[y:y+h, x:x+w]
        
        # 4. PREPROCESS
        face_roi = cv2.resize(face_roi, (64, 64))
        face_roi = face_roi.astype("float32") / 255.0
        
        # Shape becomes (1, 64, 64, 3)
        input_data = np.expand_dims(face_roi, axis=0)

        # 5. PREDICT
        preds = model.predict(input_data, verbose=0)
        idx = np.argmax(preds)

        return jsonify({
            "emotion": classes[idx],
            "confidence": float(np.max(preds))
        })

    except Exception as e:
        print(f"Server Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Start the server on port 5000
    app.run(debug=True, port=5000)