from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import pickle
import mediapipe as mp

app = Flask(__name__)
CORS(app)

# 1. LOAD MODELS
try:
    with open('model.p', 'rb') as f:
        model_dict = pickle.load(f)
        isl_model = model_dict['model']
except Exception as e:
    print(f"Failed to load ISL Model: {e}")
    isl_model = None

mp_hands = mp.solutions.hands.Hands(
    static_image_mode=True,
    max_num_hands=2,
    min_detection_confidence=0.3,
    min_tracking_confidence=0.3
)

@app.route("/predict_isl", methods=["POST"])
def predict_isl():
    if isl_model is None:
        return jsonify({"error": "ISL model not loaded"}), 500
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image in request"}), 400
            
        file = request.files['image']
        image_bytes = np.frombuffer(file.read(), np.uint8)
        frame = cv2.imdecode(image_bytes, cv2.IMREAD_COLOR)

        if frame is None:
            return jsonify({"error": "Failed to decode image"}), 400

        results = mp_hands.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        data_aux = []
        x_ = []
        y_ = []

        if results.multi_hand_landmarks:
            # Sort hands left-to-right explicitly based on the wrist's x-coordinate
            sorted_hands = sorted(results.multi_hand_landmarks, key=lambda hand: hand.landmark[0].x)
            
            for hand_landmarks in sorted_hands:
                for i in range(len(hand_landmarks.landmark)):
                    x_.append(hand_landmarks.landmark[i].x)
                    y_.append(hand_landmarks.landmark[i].y)
            
            for hand_landmarks in sorted_hands:
                for j in range(len(hand_landmarks.landmark)):
                    data_aux.append(hand_landmarks.landmark[j].x - min(x_))
                    data_aux.append(hand_landmarks.landmark[j].y - min(y_))
            
            # Padding Logic (42 features per hand, if 1 hand, pad 42 zeros to make 84)
            if len(data_aux) == 42:
                data_aux.extend([0]*42)
            
            data_aux = data_aux[:84] # Safety limit
            prediction = isl_model.predict([np.asarray(data_aux)])[0]
            confidence = np.max(isl_model.predict_proba([np.asarray(data_aux)])[0])

            hands_detected = len(sorted_hands)
            print(f"Predicted: {prediction} | Confidence: {confidence:.2f} | Hands Detected: {hands_detected}")

            return jsonify({
                "character": str(prediction),
                "confidence": float(confidence)
            })
        else:
            return jsonify({"character": "None", "confidence": 0.0})

    except Exception as e:
        print(f"Predict ISL Error: {e}")
        return jsonify({"error": str(e)}), 500 

if __name__ == "__main__":
    app.run(debug=True, port=5000)