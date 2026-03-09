import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from './common/BackButton';
import styles from './Quiz.module.css';

// 1. Data Setup
import sign1 from '../assets/numbers/1.png';
import sign2 from '../assets/numbers/2.png';
import sign3 from '../assets/numbers/3.png';
import sign4 from '../assets/numbers/4.png';
import sign5 from '../assets/numbers/5.png';
import sign6 from '../assets/numbers/6.png';
import sign7 from '../assets/numbers/7.png';
import sign8 from '../assets/numbers/8.png';
import sign9 from '../assets/numbers/9.png';

const baseData = [
    { letter: "1", image: sign1 },
    { letter: "2", image: sign2 },
    { letter: "3", image: sign3 },
    { letter: "4", image: sign4 },
    { letter: "5", image: sign5 },
    { letter: "6", image: sign6 },
    { letter: "7", image: sign7 },
    { letter: "8", image: sign8 },
    { letter: "9", image: sign9 }
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

const NumbersQuiz = () => {
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

    // Generate Stars
    const renderStars = () => {
        if (mistakes === 0) return "⭐⭐⭐";
        if (mistakes <= 2) return "⭐⭐";
        return "⭐";
    };

    // 6. Summary Screen
    if (isFinished) {
        return (
            <div className={styles.quizPage}>
                <header className={styles.header}>
                    <BackButton variant="back" fallbackRoute="/quizzes" />
                    <h1 className={styles.title}>Numbers Quiz</h1>
                </header>
                <main className={styles.quizContent}>
                    <motion.div
                        className={styles.summaryContainer}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                    >
                        <h2 className={styles.summaryTitle}>Quiz Complete!</h2>
                        <p>You made {mistakes} {mistakes === 1 ? 'mistake' : 'mistakes'}.</p>
                        <div className={styles.starsText}>{renderStars()}</div>

                        <button className={`${styles.actionBtn} ${styles.playAgainBtn}`} onClick={startQuiz}>
                            Play Again 🔄
                        </button>
                        <button className={`${styles.actionBtn} ${styles.backMapBtn}`} onClick={() => navigate('/learn')}>
                            Back to Map 🗺️
                        </button>
                    </motion.div>
                </main>
            </div>
        );
    }

    if (queue.length === 0) return null;
    const currentQ = queue[0];

    // 5. UI Rendering
    return (
        <div className={styles.quizPage}>
            <header className={styles.header}>
                <BackButton variant="back" fallbackRoute="/quizzes" />
                <h1 className={styles.title}>Numbers Quiz</h1>
            </header>
            <main className={styles.quizContent}>
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
            </main>
        </div>
    );
};

export default NumbersQuiz;
