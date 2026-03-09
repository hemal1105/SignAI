import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, CameraOff } from 'lucide-react';
import styles from './CameraFeed.module.css';

const CameraFeed = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false); // Start OFF to test toggle

  // 1. FUNCTION TO KILL HARDWARE
  const killCamera = useCallback(() => {
    if (streamRef.current) {
      console.log("Stopping hardware tracks...");
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => {
        track.stop(); // Kills the physical power
        track.enabled = false; // Extra safety
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // 2. FUNCTION TO START HARDWARE
  const startCamera = useCallback(async () => {
    // Kill any existing stream before starting a new one
    killCamera();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 } // Lower res for faster testing
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setIsCameraOn(false);
    }
  }, [killCamera]);

  // 3. EFFECT TO MONITOR STATE
  useEffect(() => {
    if (isCameraOn) {
      // eslint-disable-next-line
      startCamera();
    } else {
      killCamera();
    }

    // Cleanup on component unmount
    return () => killCamera();
  }, [isCameraOn, startCamera, killCamera]);

  return (
    <div className={styles.cameraContainer}>
      <div className={styles.viewfinder}>
        {isCameraOn ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={styles.videoStream}
          />
        ) : (
          <div className={styles.placeholder}>
            <CameraOff size={64} />
            <p>Camera is OFF</p>
          </div>
        )}
      </div>

      <button
        onClick={() => setIsCameraOn(prev => !prev)}
        className={isCameraOn ? styles.btnOff : styles.btnOn}
      >
        {isCameraOn ? "Stop Camera" : "Start Camera"}
      </button>
    </div>
  );
};

export default CameraFeed;