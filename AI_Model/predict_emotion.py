import cv2
import numpy as np
from tensorflow.keras.models import load_model

# Load your trained model
model = load_model('AI_Model/emotion_model.keras')

# Define the emotion classes (order must match your training)
emotion_classes = ['happy', 'sad', 'ugly', 'bad', 'good']

# Open webcam
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Preprocess the frame
    img = cv2.resize(frame, (48, 48))  # match your training size
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  # if trained on grayscale
    img = img / 255.0  # normalize
    img = np.expand_dims(img, axis=-1)  # add channel if grayscale
    img = np.expand_dims(img, axis=0)   # add batch dimension

    # Predict
    preds = model.predict(img)
    emotion_idx = np.argmax(preds)
    emotion_label = emotion_classes[emotion_idx]

    # Display the result
    cv2.putText(frame, emotion_label, (50,50), cv2.FONT_HERSHEY_SIMPLEX, 
                1, (0,255,0), 2, cv2.LINE_AA)
    cv2.imshow('Emotion Recognition', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()