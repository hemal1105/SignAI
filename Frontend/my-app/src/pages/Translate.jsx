import React, { useState, useRef, useEffect } from 'react';
import CameraFeed from '../components/CameraFeed';
import styles from './Translate.module.css';
import { Mic, MicOff } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const Translate = () => {
// eslint-disable-next-line no-unused-vars
  const [output, setOutput] = useState("Show a sign..."); // For Sign to Voice
  const [isMicOn, setIsMicOn] = useState(false);
  const [liveSpeech, setLiveSpeech] = useState(""); // For Voice to Sign
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-IN';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          interimTranscript += event.results[i][0].transcript;
        }
        setLiveSpeech(interimTranscript);
      };

      recognitionRef.current.onerror = () => setIsMicOn(false);
      recognitionRef.current.onend = () => setIsMicOn(false);
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (isMicOn) {
      recognitionRef.current.stop();
      setIsMicOn(false);
    } else {
      setLiveSpeech("");
      recognitionRef.current.start();
      setIsMicOn(true);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        
        {/* Left: Sign Recognition */}
        <div className={styles.box}>
          <span className={styles.badge}>Sign to Voice</span>
          <div className={styles.viewfinderContainer}>
            <CameraFeed />
          </div>
          <div className={styles.result}>
            <p className={styles.textHighlight}>{output}</p>
          </div>
        </div>

        {/* Right: Voice Generation */}
        <div className={styles.box}>
          <span className={styles.badge}>Voice to Sign</span>
          <div className={styles.signDisplay}>
            <AnimatePresence mode="wait">
              {isMicOn && liveSpeech ? (
                <motion.div 
                  key="speech"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={styles.signAnimation}
                >
                  <h2 className={styles.glossText}>{liveSpeech}</h2>
                  <div className={styles.waveContainer}>
                    <span></span><span></span><span></span>
                  </div>
                </motion.div>
              ) : (
                <motion.img 
                  key="mascot"
                  src="/assets/mascot-happy.png" 
                  alt="Mascot" 
                  className={styles.mascot} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </AnimatePresence>
          </div>
          
          <button 
            className={`${styles.talkBtn} ${isMicOn ? styles.listening : ''}`}
            onClick={toggleMic}
          >
            {isMicOn ? <><MicOff size={32}/> Stop Mic</> : <><Mic size={32}/> Start Mic</>}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Translate;