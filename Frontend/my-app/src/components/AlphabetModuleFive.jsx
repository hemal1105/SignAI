import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from './common/BackButton';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
// REUSING the CSS module from Module One for exact styling match
import styles from './AlphabetModuleOne.module.css';

// Importing specific signs for Module 5
import signU from '../assets/alphabets/mod5/sign_U.png';
import signV from '../assets/alphabets/mod5/sign_V.png';
import signW from '../assets/alphabets/mod5/sign_W.png';
import signX from '../assets/alphabets/mod5/sign_X.png';
import signY from '../assets/alphabets/mod5/sign_Y.png';
import signZ from '../assets/alphabets/mod5/sign_Z.png';

// The data array for Module 5 (Contains 6 letters!)
const alphabetModuleData = [
    { id: 1, letter: "U", signImage: signU },
    { id: 2, letter: "V", signImage: signV },
    { id: 3, letter: "W", signImage: signW },
    { id: 4, letter: "X", signImage: signX },
    { id: 5, letter: "Y", signImage: signY },
    { id: 6, letter: "Z", signImage: signZ }
];

const AlphabetModuleFive = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    const handleNext = () => {
        if (currentIndex < alphabetModuleData.length - 1) {
            setCurrentIndex(prevIndex => prevIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prevIndex => prevIndex - 1);
        }
    };

    const currentItem = alphabetModuleData[currentIndex];

    // Animation variants for the bouncy flashcard effect
    const cardVariants = {
        initial: { opacity: 0, y: 30, scale: 0.8 },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: 'spring', stiffness: 150, damping: 15 }
        },
        exit: {
            opacity: 0,
            y: -30,
            scale: 0.8,
            transition: { duration: 0.2 }
        }
    };

    return (
        <div className={styles.modulePage}>
            <header className={styles.header}>
                <BackButton variant="back" fallbackRoute="/learn/alphabets" />
                <h1 className={styles.title}>SignAI Alphabets</h1>
            </header>

            <main className={styles.mainContent}>
                <div className={styles.cardsContainer}>
                    <AnimatePresence mode="wait">
                        {/* The Left (Alphabet) Card */}
                        <motion.div
                            key={`${currentItem.letter}-letter`}
                            className={`${styles.card} ${styles.letterCard}`}
                            variants={cardVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <span className={styles.massiveLetter}>{currentItem.letter}</span>
                        </motion.div>

                        {/* The Right (Sign Language) Card */}
                        <motion.div
                            key={`${currentItem.letter}-sign`}
                            className={`${styles.card} ${styles.signCard}`}
                            variants={cardVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <img src={currentItem.signImage} alt={`Sign for ${currentItem.letter}`} className={styles.massiveSignImage} />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Buttons */}
                <div className={styles.navigationControls}>
                    <motion.button
                        className={`${styles.arrowBtn} ${styles.prevBtn}`}
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                        whileHover={currentIndex !== 0 ? { scale: 1.1 } : {}}
                        whileTap={currentIndex !== 0 ? { scale: 0.9, y: 5 } : {}}
                    >
                        ◀
                    </motion.button>

                    {currentIndex === alphabetModuleData.length - 1 ? (
                        <div className={styles.endScreenActions}>
                            <motion.button
                            className={styles.completedBtn}
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 10, -10, 0]
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                ease: "easeInOut"
                            }}
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9, y: 8 }}
                            onClick={() => navigate('/learn/alphabets')}
                        >
                            🏆
                        </motion.button>
                            <motion.button
                                className={styles.playQuizBtn}
                                animate={{
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 2,
                                    ease: "easeInOut"
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9, y: 8 }}
                                onClick={() => navigate('/quiz/alphabets/mod5')}
                            >
                                🎮 Play Game!
                            </motion.button>
                        </div>
                    ) : (
                        <motion.button
                            className={`${styles.arrowBtn} ${styles.nextBtn}`}
                            onClick={handleNext}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9, y: 5 }}
                        >
                            ▶
                        </motion.button>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AlphabetModuleFive;
