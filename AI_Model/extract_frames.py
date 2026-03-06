import cv2
import os

dataset_path = "datasets/emotions"
output_path = "dataset_frames/emotions"

os.makedirs(output_path, exist_ok=True)

for category in os.listdir(dataset_path):

    category_path = os.path.join(dataset_path, category)
    save_category = os.path.join(output_path, category)

    os.makedirs(save_category, exist_ok=True)

    for video in os.listdir(category_path):

        video_path = os.path.join(category_path, video)

        cap = cv2.VideoCapture(video_path)

        frame_count = 0

        while True:
            ret, frame = cap.read()

            if not ret:
                break

            frame_name = f"{video.split('.')[0]}_{frame_count}.jpg"
            frame_path = os.path.join(save_category, frame_name)

            cv2.imwrite(frame_path, frame)

            frame_count += 1

        cap.release()

print("Frame extraction completed!")