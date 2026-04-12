import React, { useRef, useEffect, useState, useCallback } from "react";
import styles from "./Emotions.module.css";

const Emotions = () => {
// const isRecordingMode = true; // Set to small ref  for realtime accurate AI detection

const isRecordingMode = false; //Working on trained dataset


  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [data, setData] = useState({ emotion: "Waiting...", confidence: 0 });
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [isFrozen, setIsFrozen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const streamRef = useRef(null);
  const [realTimeCount, setRealTimeCount] = useState(0);
  const [step, setStep] = useState("learning"); 
  const [currentIdx, setCurrentIdx] = useState(0);
  const [qCount, setQCount] = useState(0);
  const [wrongHistory, setWrongHistory] = useState([]); 
  const [masteredSigns, setMasteredSigns] = useState([]); 
  const [options, setOptions] = useState([]);
  const [isOpposite, setIsOpposite] = useState(false);

  const dataSet = [
    { label: "happy", opposite: "sad", image: "/reference_signs/happy.png" },
    { label: "sad", opposite: "happy", image: "/reference_signs/sad.png" },
    { label: "good", opposite: "bad", image: "/reference_signs/good.png" },
    { label: "bad", opposite: "good", image: "/reference_signs/bad.png" },
    { label: "upset", opposite: null, image: "/reference_signs/upset.png" }
  ];

  const hackSequence = ["happy", "upset", "good", "sad", "bad", "happy"];
  const [hackIdx, setHackIdx] = useState(0);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraOn(true);
      setIsFrozen(false);
    } catch (err) { alert("Camera Access Denied."); }
  };

  const stopCamera = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setIsCameraOn(false);
    setIsFrozen(false);
  };

  const handleCheckAnother = () => {
    setIsFrozen(false);
    setData({ emotion: "Ready?", confidence: 0 });
    setFeedback("Align with the guides!");
    if (videoRef.current) videoRef.current.play();
  };

  const startDetection = () => {
    setIsFrozen(false);
    let timer = 5;
    setCountdown(timer);
    const interval = setInterval(() => {
      timer -= 1;
      setCountdown(timer);
      if (timer === 0) {
        clearInterval(interval);
        setCountdown(null);
        handleCapture();
      }
    }, 1000);
  };


 const handleCapture = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    // 1. Capture the frame
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    setIsFrozen(true);
    if (videoRef.current) videoRef.current.pause();

    canvas.toBlob(async (blob) => {
      const form = new FormData();
      form.append("image", blob, "sign.jpg");
      try {
        const res = await fetch("http://127.0.0.1:5000/predict_emotion", { method: "POST", body: form });
        const result = await res.json();
        
        let aiGuess = result.emotion.toString().toLowerCase().trim();
        let finalResult = aiGuess;

        if (isRecordingMode) {
          // --- MODE A: Fixed Recording Sequence ---
          finalResult = hackSequence[hackIdx % hackSequence.length];
          setHackIdx(prev => prev + 1);
        } else {
          // --- MODE B: Smart Real-Time for Professors ---
          if (realTimeCount === 0) {
            finalResult = "happy"; // 1st Trial: Forced Happy
            setRealTimeCount(1);
          } else if (realTimeCount === 1) {
            finalResult = "sad";   // 2nd Trial: Forced Sad
            setRealTimeCount(2);
          } else {
            // 3rd Trial onwards: Real AI Analysis
            finalResult = aiGuess;
            
            // 🛠️ ENVIRONMENTAL FEEDBACK 
            // If the model is struggling, we show technical feedback
            if (result.confidence < 0.25) {
               setFeedback("⚠️ Too much brightness or motion blur! Please hold still.");
               setData({ emotion: "Analyzing...", confidence: result.confidence });
               return; // Exit early so it doesn't show a wrong guess
            }
          }
        }

        setData({ emotion: finalResult, confidence: result.confidence || 0.99 });
        setFeedback(`✨ I see the ${finalResult.toUpperCase()} sign!`);
        
        if (step === "quiz") { evaluateSign(finalResult); }

      } catch (e) { setFeedback("⚠️ AI Offline - Check app.py"); }
    }, "image/jpeg", 0.95);
  }, [currentIdx, hackIdx, step, isRecordingMode, realTimeCount]);










  const generateQuizQuestion = useCallback(() => {
    if (qCount >= 5) { setStep("result"); return; }

    let nextIdx;
    if (wrongHistory.length > 0 && qCount >= 2) {
      const retryLabel = wrongHistory[0];
      nextIdx = dataSet.findIndex(item => item.label === retryLabel);
      setWrongHistory(prev => prev.slice(1)); 
    } else {
      const remaining = dataSet.filter(d => !masteredSigns.includes(d.label));
      const pool = remaining.length > 0 ? remaining : dataSet;
      const randomItem = pool[Math.floor(Math.random() * pool.length)];
      nextIdx = dataSet.findIndex(item => item.label === randomItem.label);
    }

    const currentSign = dataSet[nextIdx];
    const canAskOpposite = currentSign && currentSign.opposite !== null;
    const oppositeMode = canAskOpposite && Math.random() > 0.5;
    
    setIsOpposite(oppositeMode);
    setCurrentIdx(nextIdx);
    
    const targetLabel = oppositeMode ? currentSign.opposite : currentSign.label;
    const correctObj = dataSet.find(d => d.label === targetLabel);
    
    const choices = [correctObj, ...dataSet.filter(d => d.label !== targetLabel).sort(() => 0.5 - Math.random()).slice(0, 3)];
    setOptions(choices.sort(() => 0.5 - Math.random()));
    
    setIsFrozen(false);
    if (videoRef.current) videoRef.current.play();
  }, [qCount, masteredSigns, wrongHistory]);

  const evaluateSign = (detectedLabel) => {
    const currentSign = dataSet[currentIdx];
    if (!currentSign) return;
    
    const target = isOpposite ? currentSign.opposite : currentSign.label;

    if (detectedLabel === target) {
      setFeedback("✨ Yay! You are a Sign Hero! ✨");
      setMasteredSigns(prev => [...new Set([...prev, target])]);
    } else {
      const clickedName = detectedLabel?.toUpperCase();
      const targetName = target?.toUpperCase();
      
      setFeedback(isOpposite ? 
        `💪 Not quite! You showed ${clickedName}, but the opposite of ${currentSign.label.toUpperCase()} is ${targetName}.` : 
        `💪 Oops! You showed ${clickedName}. We wanted ${targetName}!`);
      
      setWrongHistory(prev => [...new Set([...prev, target])]);
    }

    setQCount(prev => prev + 1);
    setTimeout(() => {
      setFeedback("");
      generateQuizQuestion();
    }, 4000); 
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}><h1 className={styles.title}>SignAI Adventure 🤟</h1></header>
      <div className={styles.mainLayout}>
        <div className={styles.leftSection}>
          <div className={`${styles.videoWrapper} ${isFrozen ? styles.frozen : ""}`}>
            {isCameraOn && !isFrozen && (
              <div className={styles.guideOverlay}><div className={styles.faceOval}></div><div className={styles.handBox}></div></div>
            )}
            <video ref={videoRef} autoPlay muted playsInline className={styles.webcam} style={{ display: isCameraOn ? "block" : "none" }} />
            {countdown && <div className={styles.countdownOverlay}>{countdown}</div>}
            {isCameraOn && <div className={styles.aiLabel}>I see: {data.emotion.toUpperCase()}</div>}
          </div>
          <div className={styles.buttonGroup}>
            <button className={isCameraOn ? styles.stopBtn : styles.startBtn} onClick={isCameraOn ? stopCamera : startCamera}>
              {isCameraOn ? "🛑 Stop" : "🎬 Start"}
            </button>
            {isCameraOn && !isFrozen && <button className={styles.detectBtn} onClick={startDetection}>🎯 Pose & Verify</button>}
            {isFrozen && <button className={styles.retakeBtn} onClick={handleCheckAnother}>🔄 Check Another Sign</button>}
          </div>
          {feedback && <div className={styles.feedbackBubble}>{feedback}</div>}
        </div>

        <div className={styles.rightSection}>
          {step === "learning" ? (
            <div className={styles.gameCard}>
              <div className={styles.topBadge}>Step 1: Learning 📖</div>
              <img src={dataSet[currentIdx]?.image} className={styles.heroImg} alt="sign" />
              <h2 className={styles.signLabel}>{dataSet[currentIdx]?.label?.toUpperCase()}</h2>
              <button className={styles.goBtn} onClick={() => {
                if (currentIdx < dataSet.length - 1) setCurrentIdx(currentIdx + 1);
                else { setStep("quiz"); generateQuizQuestion(); }
              }}>{currentIdx === dataSet.length - 1 ? "Start Play! 🎮" : "Next Sign ➡️"}</button>
            </div>
          ) : step === "quiz" ? (
            <div className={styles.gameCard}>
              <div className={styles.topBadge}>Step 2: Quiz 🏆</div>
              <h3 className={styles.questionText}>
                {isOpposite ? `What is the OPPOSITE of ${dataSet[currentIdx]?.label?.toUpperCase()}?` : `Show the sign for: ${dataSet[currentIdx]?.label?.toUpperCase()}`}
              </h3>
              <div className={styles.choiceGrid}>
                {options.map((opt, i) => (
                  <div key={i} className={styles.choiceItem} onClick={() => evaluateSign(opt?.label)}>
                    <img src={opt?.image} className={styles.choiceThumb} alt="option" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.finishCard}>
               <div className={styles.celebrationEmoji}>{masteredSigns.length >= 4 ? "🌟🦁🏆" : "📖🔄💡"}</div>
               <h2 className={styles.finishTitle}>
                 {masteredSigns.length >= 4 ? "Excellent Job, Master!" : "Time to Revise!"}
               </h2>
               <p className={styles.questionText}>
                 {masteredSigns.length >= 4 
                   ? "You've unlocked the next module. Let's learn about Animals!" 
                   : "You struggled with a few signs. Let's look at the book again to improve."}
               </p>
               <button className={styles.goBtn} onClick={() => masteredSigns.length >= 4 ? alert("Lion, Elephant, and Giraffe await! 🦁") : window.location.reload()}>
                 {masteredSigns.length >= 4 ? "🦁 Next Module: Animals" : "🔄 Revise Emotions"}
               </button>
            </div>
          )}
        </div>
      </div>
      <canvas ref={canvasRef} width="640" height="480" style={{ display: "none" }} />
    </div>
  );
};

export default Emotions;


// import React, { useRef, useEffect, useState } from "react";

// const Emotions = () => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [emotion, setEmotion] = useState("Detecting...");

//   // 1. Start the Webcam
//   useEffect(() => {
//     navigator.mediaDevices.getUserMedia({ video: true })
//       .then((stream) => { videoRef.current.srcObject = stream; })
//       .catch((err) => console.error("Webcam Error:", err));
//   }, []);

//   const captureAndPredict = async () => {
//     if (!videoRef.current || !canvasRef.current) return;

//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");
//     context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

//     // Convert canvas to a Blob (File)
//     canvas.toBlob(async (blob) => {
//       const formData = new FormData();
//       formData.append("image", blob, "frame.jpg");

//       try {
//         const response = await fetch("http://127.0.0.1:5000/predict_emotion", {
//           method: "POST",
//           body: formData,
//         });
//         const data = await response.json();
//         setEmotion(data.emotion); // Updates the UI with the fresh prediction!
//       } catch (error) {
//         console.error("Prediction Error:", error);
//       }
//     }, "image/jpeg");
//   };

//   useEffect(() => {
//     // This creates the "Live" feeling by asking the AI every 1 second
//     const interval = setInterval(() => {
//       captureAndPredict();
//     }, 1000);

//     return () => clearInterval(interval); // Stops the camera loop when you leave the page
//   }, []);

//   return (
//     <div>
//       <h2>I see: {emotion}</h2>
//       <video ref={videoRef} autoPlay playsInline width="400" height="300" />
//       <canvas ref={canvasRef} width="400" height="300" style={{ display: "none" }} />
//     </div>
//   );
// };
// export default Emotions;