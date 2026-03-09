import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Quiz.module.css';

// 1. Data Setup (All 26 letters)
import signA from '../assets/alphabets/mod1/sign_A.png';
import signB from '../assets/alphabets/mod1/sign_B.png';
import signC from '../assets/alphabets/mod1/sign_C.png';
import signD from '../assets/alphabets/mod1/sign_D.png';
import signE from '../assets/alphabets/mod1/sign_E.png';

import signF from '../assets/alphabets/mod2/sign_F.png';
import signG from '../assets/alphabets/mod2/sign_G.png';
import signH from '../assets/alphabets/mod2/sign_H.png';
import signI from '../assets/alphabets/mod2/sign_I.png';
import signJ from '../assets/alphabets/mod2/sign_J.png';

import signK from '../assets/alphabets/mod3/sign_K.png';
import signL from '../assets/alphabets/mod3/sign_L.png';
import signM from '../assets/alphabets/mod3/sign_M.png';
import signN from '../assets/alphabets/mod3/sign_N.png';
import signO from '../assets/alphabets/mod3/sign_O.png';

import signP from '../assets/alphabets/mod4/sign_P.png';
import signQ from '../assets/alphabets/mod4/sign_Q.png';
import signR from '../assets/alphabets/mod4/sign_R.png';
import signS from '../assets/alphabets/mod4/sign_S.png';
import signT from '../assets/alphabets/mod4/sign_T.png';

import signU from '../assets/alphabets/mod5/sign_U.png';
import signV from '../assets/alphabets/mod5/sign_V.png';
import signW from '../assets/alphabets/mod5/sign_W.png';
import signX from '../assets/alphabets/mod5/sign_X.png';
import signY from '../assets/alphabets/mod5/sign_Y.png';
import signZ from '../assets/alphabets/mod5/sign_Z.png';

const baseData = [
    { letter: "A", image: signA },
    { letter: "B", image: signB },
    { letter: "C", image: signC },
    { letter: "D", image: signD },
    { letter: "E", image: signE },
    { letter: "F", image: signF },
    { letter: "G", image: signG },
    { letter: "H", image: signH },
    { letter: "I", image: signI },
    { letter: "J", image: signJ },
    { letter: "K", image: signK },
    { letter: "L", image: signL },
    { letter: "M", image: signM },
    { letter: "N", image: signN },
    { letter: "O", image: signO },
    { letter: "P", image: signP },
    { letter: "Q", image: signQ },
    { letter: "R", image: signR },
    { letter: "S", image: signS },
    { letter: "T", image: signT },
    { letter: "U", image: signU },
    { letter: "V", image: signV },
    { letter: "W", image: signW },
    { letter: "X", image: signX },
    { letter: "Y", image: signY },
    { letter: "Z", image: signZ }
];

// Utility: Fisher-Yates Shuffle
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const AlphabetQuizMaster = () => {
    const navigate = useNavigate();

    // 2. Adaptive State Management
    const [queue, setQueue] = useState([]);
    const [currentOptions, setCurrentOptions] = useState([]);
    const [mistakes, setMistakes] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [feedback, setFeedback] = useState(null);

    // Initialize the Quiz
    const startQuiz = () => {
        setQueue(shuffleArray(baseData));
        setMistakes(0);
        setIsFinished(false);
        setFeedback(null);
    };

    // Run once on mount
    useEffect(() => {
        // eslint-disable-next-line
        startQuiz();
    }, []);

    // 3. Option Generation
    useEffect(() => {
        if (queue.length > 0) {
            const currentQ = queue[0];
            const wrongPool = baseData.filter(item => item.letter !== currentQ.letter);
            const shuffledWrong = shuffleArray(wrongPool).slice(0, 3);
            const options = shuffleArray([currentQ, ...shuffledWrong]);
            // eslint-disable-next-line
            setCurrentOptions(options);
        }
    }, [queue, isFinished, mistakes]);

    // 4. The Logic: Handling option clicks
    const handleOptionClick = (selectedLetter) => {
        if (feedback !== null) return;
        const currentQ = queue[0];
        const isCorrect = selectedLetter === currentQ.letter;
        setFeedback({ selectedLetter, isCorrect });

        setTimeout(() => {
            if (isCorrect) {
                const newQueue = queue.slice(1);
                if (newQueue.length === 0) {
                    setIsFinished(true);
                } else {
                    setQueue(newQueue);
                }
            } else {
                setMistakes(prev => prev + 1);
                const newQueue = [...queue.slice(1), currentQ];
                setQueue(newQueue);
            }
            setFeedback(null);
        }, 800);
    };

    // Generate Stars (Adjusted scaled stars for 26 questions, mostly 0 mistakes for 3 stars, maybe <=5 for 2 stars)
    const renderStars = () => {
        if (mistakes === 0) return "⭐⭐⭐";
        if (mistakes <= 5) return "⭐⭐";
        return "⭐";
    };

    // 6. Summary Screen
    if (isFinished) {
        return (
            <div className={styles.quizPage}>
                <motion.div
                    className={styles.summaryContainer}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                >
                    <h2 className={styles.summaryTitle}>Boss Level Complete! 👑</h2>
                    <p>You made {mistakes} {mistakes === 1 ? 'mistake' : 'mistakes'}.</p>
                    <div className={styles.starsText}>{renderStars()}</div>

                    <button className={`${styles.actionBtn} ${styles.playAgainBtn}`} onClick={startQuiz}>
                        Play Again 🔄
                    </button>
                    <button className={`${styles.actionBtn} ${styles.backMapBtn}`} onClick={() => navigate('/quizzes/alphabets')}>
                        Back to Map 🗺️
                    </button>
                </motion.div>
            </div>
        );
    }

    if (queue.length === 0) return null;
    const currentQ = queue[0];

    // 5. UI Rendering
    return (
        <div className={styles.quizPage}>
            <h1 className={styles.quizTitle}>
                Master A-Z 👑
            </h1>

            <button className={styles.closeBtn} onClick={() => navigate('/quizzes/alphabets')}>X</button>
            <motion.div
                className={styles.imageCard}
                key={currentQ.letter + "-image"}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
                <img src={currentQ.image} alt="Sign to guess" className={styles.signImage} />
            </motion.div>

            <div className={styles.optionsGrid}>
                <AnimatePresence mode="popLayout">
                    {currentOptions.map((opt, index) => {
                        let btnClass = styles.optionBtn;
                        if (feedback && feedback.selectedLetter === opt.letter) {
                            btnClass = `${styles.optionBtn} ${feedback.isCorrect ? styles.correctBtn : styles.wrongBtn}`;
                        }
                        return (
                            <motion.button
                                key={opt.letter + index}
                                className={btnClass}
                                onClick={() => handleOptionClick(opt.letter)}
                                disabled={feedback !== null}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ delay: index * 0.1, type: "spring", stiffness: 200, damping: 15 }}
                                whileHover={feedback === null ? { scale: 1.05 } : {}}
                                whileTap={feedback === null ? { scale: 0.95 } : {}}
                            >
                                {opt.letter}
                            </motion.button>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AlphabetQuizMaster;
