import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from "react-webcam";
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PracticeMode = () => {
    const webcamRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Default range if accessed directly
    const { startLetter = 'A', endLetter = 'E' } = location.state || {};

    const getAlphabetRange = (start, end) => {
        if (!isNaN(start) && !isNaN(end)) {
            const result = [];
            for (let i = parseInt(start); i <= parseInt(end); i++) {
                result.push(i.toString());
            }
            return result;
        }

        const result = [];
        for (let i = start.charCodeAt(0); i <= end.charCodeAt(0); i++) {
            result.push(String.fromCharCode(i));
        }
        return result;
    };

    const [queue, setQueue] = useState(() => getAlphabetRange(startLetter, endLetter));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [feedback, setFeedback] = useState("Show the sign...");
    const [confidence, setConfidence] = useState(0);
    const [isSuccess, setIsSuccess] = useState(false);
    const [points, setPoints] = useState(0);
    const [frozenImage, setFrozenImage] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const [lowConfCount, setLowConfCount] = useState(0);
    const [consecutiveCount, setConsecutiveCount] = useState(0);
    const [showAchievement, setShowAchievement] = useState(false);

    const captureAndPredict = useCallback(async () => {
        if (!webcamRef.current) return;
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;

        try {
            const res = await fetch(imageSrc);
            const blob = await res.blob();

            const form = new FormData();
            form.append("image", blob, "frame.jpg");

            const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";
            const response = await fetch(`${apiUrl}/predict_isl`, { method: "POST", body: form });
            const result = await response.json();
            
            // Relaxed 30% Threshold
            if (result.character?.trim().toUpperCase() === queue[currentIndex]?.trim().toUpperCase() && result.confidence >= 0.30) {
                const updatedCount = consecutiveCount + 1;
                
                if (updatedCount >= 2) {
                    // Locked in - Success
                    setIsPaused(true);
                    setFrozenImage(imageSrc);
                    setFeedback(`Correct! matched ${result.character} ✨`);
                    setConfidence(result.confidence);
                    setIsSuccess(true);
                    setPoints(prev => prev + 10);
                    setLowConfCount(0);
                    setConsecutiveCount(0);
                } else {
                    // Almost there buffer
                    setConsecutiveCount(updatedCount);
                    setFeedback(`Almost there! Hold ${result.character}...`);
                    setConfidence(result.confidence);
                    setLowConfCount(0);
                }
            } else {
                setConsecutiveCount(0);
                if (!isSuccess && !isPaused) {
                    const charSeen = result.character === 'None' ? 'None' : result.character;
                    setFeedback(`AI sees: ${charSeen}`);
                    setConfidence(result.confidence);
                    
                    if (result.character === 'None') {
                        setLowConfCount(prev => prev + 1);
                    } else {
                        // Reset if it sees an active wrong letter, preventing "hands too close" false-positives
                        setLowConfCount(0);
                    }
                }
            }
        } catch (e) {
            if (!isPaused) {
                setFeedback("Error connecting to AI (Is app.py running?)");
            }
        }
    }, [currentIndex, queue, isSuccess, isPaused, points, consecutiveCount, navigate]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPaused && !isSuccess) {
                captureAndPredict();
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [captureAndPredict, isPaused, isSuccess]);

    const handleContinue = () => {
        if (currentIndex < queue.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsSuccess(false);
            setIsPaused(false);
            setFrozenImage(null);
            setFeedback("Show the sign...");
            setConfidence(0);
            setLowConfCount(0);
            setConsecutiveCount(0);
        } else {
            // Module Complete Logic 
            const getLevelNumber = (s, e) => {
                if (s === 'A' && e === 'E') return 1;
                if (s === 'F' && e === 'J') return 2;
                if (s === 'K' && e === 'O') return 3;
                if (s === 'P' && e === 'T') return 4;
                if (s === 'U' && e === 'Z') return 5;
                return null;
            };
            const currentMod = getLevelNumber(startLetter, endLetter);
            if (currentMod) {
                const nextLevel = currentMod + 1;
                const existing = parseInt(sessionStorage.getItem('alphabet_unlockedLevel')) || 1;
                if (nextLevel > existing && nextLevel <= 5 + 1) {
                    sessionStorage.setItem('alphabet_unlockedLevel', nextLevel.toString());
                }
            }
            setShowAchievement(true);
        }
    };

    const handleSkip = () => {
        if (queue.length > 1) {
            const newQueue = [...queue];
            const skipped = newQueue.splice(currentIndex, 1)[0];
            newQueue.push(skipped);
            setQueue(newQueue);

            if (currentIndex >= newQueue.length) {
                setCurrentIndex(0);
            }

            // Reset feedback states for the new sign
            setIsSuccess(false);
            setIsPaused(false);
            setFrozenImage(null);
            setFeedback("Show the sign...");
            setConfidence(0);
            setLowConfCount(0);
            setConsecutiveCount(0);
        }
    };

    if (showAchievement) {
        return (
            <div style={{
                position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 9999,
                background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(10px)",
                display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"
            }}>
                <motion.div 
                    initial={{ scale: 0.2, opacity: 0, rotate: -10 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12, stiffness: 100 }}
                    style={{
                        background: "linear-gradient(135deg, #b76e79 0%, #9b5de5 100%)", 
                        padding: "50px", borderRadius: "40px",
                        boxShadow: "0 30px 60px rgba(155,93,229,0.5), inset 0 0 20px rgba(255,255,255,0.3)", 
                        textAlign: "center", border: "4px solid rgba(255,255,255,0.5)", 
                        maxWidth: "80%", position: "relative"
                    }}
                >
                    <motion.div 
                        animate={{ y: [0, -20, 0] }} 
                        transition={{ repeat: Infinity, duration: 1.5 }} 
                        style={{ fontSize: "6rem", marginBottom: "20px", filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.3))" }}
                    >
                        🎉✨🌟
                    </motion.div>
                    
                    <h1 style={{ 
                        color: "#fb5607", fontSize: "4.5rem", marginBottom: "15px",
                        fontFamily: "'Nunito', 'Segoe UI', Tahoma, Verdana, sans-serif", fontWeight: "900",
                        textShadow: "3px 3px 0 white, -3px -3px 0 white, 3px -3px 0 white, -3px 3px 0 white",
                        lineHeight: 1.1
                    }}>
                        Module Complete!
                    </h1>
                    
                    <h2 style={{ color: "white", fontSize: "1.8rem", marginBottom: "40px", fontWeight: "bold", textShadow: "0 2px 5px rgba(0,0,0,0.2)" }}>
                        You are a Sign Language Star! 🌟<br/>Your next module is now unlocked!
                    </h2>
                    
                    <motion.button 
                        onClick={() => navigate('/learn/alphabets')}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                        whileHover={{ scale: 1.1 }}
                        style={{
                            background: "#ffbe0b", color: "#333", border: "none",
                            padding: "20px 40px", fontSize: "1.8rem", borderRadius: "30px",
                            cursor: "pointer", fontWeight: "900", 
                            boxShadow: "0 8px 0 #cc9808, 0 15px 20px rgba(0,0,0,0.2)",
                            fontFamily: "'Nunito', sans-serif"
                        }}
                    >
                        Back to Map 🗺️
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    // Determine Progress Bar Color
    let progressColor = "#fb5607"; // default red/orange
    if (isSuccess) progressColor = "#06d6a0"; // green
    else if (consecutiveCount > 0) progressColor = "#ffbe0b"; // yellow for almost there

    return (
        <div style={{ textAlign: "center", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#e0fbfc", minHeight: "100vh", position: "relative" }}>

            <h3 style={{ position: "absolute", top: "20px", right: "20px", color: "#6a4c93", background: "white", padding: "15px 30px", borderRadius: "30px", boxShadow: "0 8px 0 rgba(106, 76, 147, 0.2), 0 10px 20px rgba(0,0,0,0.1)", fontSize: "1.5rem", margin: 0, fontWeight: "900" }}>
                Score: <span style={{ color: "#fb5607", fontWeight: "bold" }}>{points}</span>
            </h3>

            <h1 style={{ 
                color: "#fb5607", fontSize: "3.5rem", margin: "10px 0",
                fontFamily: "'Nunito', 'Segoe UI', sans-serif", fontWeight: "900",
                textShadow: "2px 2px 0px white, -2px -2px 0px white"
            }}>
                Practice Mode 🎯
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "30px" }}>
                <button
                    title="Previous Letter"
                    disabled={currentIndex === 0 || isSuccess}
                    onClick={() => setCurrentIndex(c => Math.max(0, c - 1))}
                    style={{ fontSize: "2rem", padding: "10px 20px", borderRadius: "15px", border: "none", cursor: (currentIndex === 0 || isSuccess) ? "not-allowed" : "pointer", opacity: (currentIndex === 0 || isSuccess) ? 0.5 : 1, background: "white", boxShadow: "0 6px 0px #cbd5e1", transition: "transform 0.1s" }}
                    onMouseOver={e => !(currentIndex === 0 || isSuccess) && (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    ⬅️
                </button>
                <h2 style={{ color: "#333", margin: 0, padding: "0 20px" }}>
                    Target: <span style={{ fontSize: "5rem", color: "#6a4c93", fontWeight: "900", textShadow: "0 5px 10px rgba(106,76,147,0.2)" }}>{queue[currentIndex]}</span>
                </h2>
                <button
                    title="Next Letter"
                    disabled={currentIndex === queue.length - 1 || isSuccess}
                    onClick={() => setCurrentIndex(c => Math.min(queue.length - 1, c + 1))}
                    style={{ fontSize: "2rem", padding: "10px 20px", borderRadius: "15px", border: "none", cursor: (currentIndex === queue.length - 1 || isSuccess) ? "not-allowed" : "pointer", opacity: (currentIndex === queue.length - 1 || isSuccess) ? 0.5 : 1, background: "white", boxShadow: "0 6px 0px #cbd5e1", transition: "transform 0.1s" }}
                    onMouseOver={e => !(currentIndex === queue.length - 1 || isSuccess) && (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    ➡️
                </button>
            </div>

            <div style={{ position: "relative", display: "inline-block", background: "white", padding: "12px", borderRadius: "30px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}>
                {frozenImage && (
                    <div style={{ position: "absolute", top: "12px", left: "12px", right: "12px", bottom: "12px", zIndex: 10, borderRadius: "20px", overflow: "hidden" }}>
                        <img src={frozenImage} alt="frozen target" style={{ width: "100%", height: "100%", objectFit: "cover" }} />

                        <div style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", background: "rgba(6, 214, 160, 0.5)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", animation: "fadeIn 0.3s ease-in-out" }}>
                            <div style={{ fontSize: "7rem", textShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
                                ✨✅
                            </div>
                            <h2 style={{ color: "white", fontSize: "3.5rem", margin: "10px 0", fontFamily: "'Nunito', sans-serif", fontWeight: "900", textShadow: "0 5px 15px rgba(0,0,0,0.4)" }}>Success!</h2>
                            
                            <motion.button 
                                onClick={handleContinue}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ marginTop: "15px", padding: "15px 40px", fontSize: "1.5rem", fontWeight: "900", background: "white", color: "#06d6a0", border: "none", borderRadius: "30px", cursor: "pointer", boxShadow: "0 8px 0px rgba(0,0,0,0.2)" }}
                            >
                                Continue to Next Letter ➡️
                            </motion.button>
                        </div>
                    </div>
                )}
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={640}
                    height={480}
                    style={{ borderRadius: "20px", border: isSuccess ? "8px solid #06d6a0" : "8px solid transparent", transition: "border 0.3s ease" }}
                />

                {lowConfCount >= 5 && !isSuccess && !isPaused && (
                    <div style={{ position: "absolute", bottom: "25px", left: "50%", transform: "translateX(-50%)", background: "rgba(239, 71, 111, 0.95)", color: "white", padding: "12px 25px", borderRadius: "20px", fontSize: "1.2rem", fontWeight: "bold", animation: "bounce 1s infinite alternate", boxShadow: "0 10px 20px rgba(239, 71, 111, 0.4)", pointerEvents: "none" }}>
                        💡 Hands missing? Keep them in frame!
                    </div>
                )}
            </div>

            {!isSuccess && (
                <button 
                    onClick={handleSkip} 
                    style={{ padding: "12px 30px", fontSize: "1.3rem", fontWeight: "900", background: "#ef476f", color: "white", border: "none", borderRadius: "20px", marginTop: "25px", cursor: "pointer", boxShadow: "0 6px 0 #c1121f", transition: "transform 0.1s" }}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    Try This Later ⏭️
                </button>
            )}

            <div style={{ marginTop: "30px", background: "white", padding: "20px", borderRadius: "20px", width: "100%", maxWidth: "600px", boxShadow: "0 8px 0 rgba(0,0,0,0.05)" }}>
                <h3 style={{ color: progressColor, fontSize: "2rem", margin: 0, fontWeight: "900" }}>{feedback}</h3>
                <p style={{ fontSize: "1.2rem", color: "#666", fontWeight: "body", margin: "10px 0" }}>
                    Confidence: {(confidence * 100).toFixed(1)}%
                </p>
                <div style={{ width: "100%", height: "20px", background: "#f0f0f0", borderRadius: "10px", overflow: "hidden", marginTop: "10px", boxShadow: "inset 0 2px 5px rgba(0,0,0,0.1)" }}>
                    <div style={{ width: `${confidence * 100}%`, height: "100%", background: progressColor, transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s" }}></div>
                </div>
            </div>

            <button 
                onClick={() => navigate(-1)} 
                style={{ padding: "15px 40px", fontSize: "1.4rem", fontWeight: "900", cursor: "pointer", marginTop: "30px", marginBottom: "40px", background: "#ffbe0b", color: "white", border: "none", borderRadius: "20px", boxShadow: "0 6px 0px #d49f05", transition: "transform 0.1s" }}
            >
                Back 🗺️
            </button>
        </div>
    );
};

export default PracticeMode;
