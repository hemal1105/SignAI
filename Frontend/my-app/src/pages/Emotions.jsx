import React, { useRef, useEffect, useState } from "react";

const Emotions = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [emotion, setEmotion] = useState("Detecting...");

  // 1. Start the Webcam
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => { videoRef.current.srcObject = stream; })
      .catch((err) => console.error("Webcam Error:", err));
  }, []);

  const captureAndPredict = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Convert canvas to a Blob (File)
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("image", blob, "frame.jpg");

      try {
        const response = await fetch("http://127.0.0.1:5000/predict_emotion", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        setEmotion(data.emotion); // Updates the UI with the fresh prediction!
      } catch (error) {
        console.error("Prediction Error:", error);
      }
    }, "image/jpeg");
  };

  useEffect(() => {
    // This creates the "Live" feeling by asking the AI every 1 second
    const interval = setInterval(() => {
      captureAndPredict();
    }, 1000);

    return () => clearInterval(interval); // Stops the camera loop when you leave the page
  }, []);

  return (
    <div>
      <h2>I see: {emotion}</h2>
      <video ref={videoRef} autoPlay playsInline width="400" height="300" />
      <canvas ref={canvasRef} width="400" height="300" style={{ display: "none" }} />
    </div>
  );
};
export default Emotions;