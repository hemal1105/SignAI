import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from './common/BackButton';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
// REUSING the CSS module from Module One for exact styling match
import styles from './AlphabetModuleOne.module.css';

// Importing specific signs for Numbers (1 - 9)
import sign1 from '../assets/numbers/1.png';
import sign2 from '../assets/numbers/2.png';
import sign3 from '../assets/numbers/3.png';
import sign4 from '../assets/numbers/4.png';
import sign5 from '../assets/numbers/5.png';
import sign6 from '../assets/numbers/6.png';
import sign7 from '../assets/numbers/7.png';
import sign8 from '../assets/numbers/8.png';
import sign9 from '../assets/numbers/9.png';

// The data array for Numbers
const numbersModuleData = [
    { id: 1, number: "1", signImage: sign1 },
    { id: 2, number: "2", signImage: sign2 },
    { id: 3, number: "3", signImage: sign3 },
    { id: 4, number: "4", signImage: sign4 },
    { id: 5, number: "5", signImage: sign5 },
    { id: 6, number: "6", signImage: sign6 },
    { id: 7, number: "7", signImage: sign7 },
    { id: 8, number: "8", signImage: sign8 },
    { id: 9, number: "9", signImage: sign9 }
];

const NumbersModule = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    const handleNext = () => {
        if (currentIndex < numbersModuleData.length - 1) {
            setCurrentIndex(prevIndex => prevIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prevIndex => prevIndex - 1);
        }
    };

    const currentItem = numbersModuleData[currentIndex];

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
                <BackButton variant="back" fallbackRoute="/learn" />
                <h1 className={styles.title}>SignAI Numbers</h1>
            </header>

            <main className={styles.mainContent}>
                <div className={styles.cardsContainer}>
                    <AnimatePresence mode="wait">
                        {/* The Left (Number) Card */}
                        <motion.div
                            key={`${currentItem.number}-number`}
                            className={`${styles.card} ${styles.letterCard}`}
                            variants={cardVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <span className={styles.massiveLetter}>{currentItem.number}</span>
                        </motion.div>

                        {/* The Right (Sign Language) Card */}
                        <motion.div
                            key={`${currentItem.number}-sign`}
                            className={`${styles.card} ${styles.signCard}`}
                            variants={cardVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <img src={currentItem.signImage} alt={`Sign for ${currentItem.number}`} className={styles.massiveSignImage} />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Buttons (Gamified) */}
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

                    {currentIndex === numbersModuleData.length - 1 ? (
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
                            // Navigating back to the main learn page for now until a Numbers Map exists
                            onClick={() => navigate('/learn')}
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
                                onClick={() => navigate('/quiz/numbers')}
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

export default NumbersModule;
