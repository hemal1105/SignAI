import React from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import styles from './QuizDashboard.module.css';

const QuizDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.arcadePage}>
            <motion.h1
                className={styles.arcadeTitle}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.6 }}
            >
                Welcome to the Quiz Arcade! 🎮
            </motion.h1>

            <div className={styles.cardsContainer}>
                {/* Alphabet Quizzes Card */}
                <motion.div
                    className={`${styles.arcadeCard} ${styles.alphabetCard}`}
                    onClick={() => navigate('/quizzes/alphabets')}
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                >
                    <div className={styles.cardIcon}>🔤</div>
                    <h2 className={styles.cardTitle}>Alphabet Quizzes</h2>
                </motion.div>

                {/* Number Quizzes Card */}
                <motion.div
                    className={`${styles.arcadeCard} ${styles.numberCard}`}
                    onClick={() => navigate('/quiz/numbers')}
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                >
                    <div className={styles.cardIcon}>🔢</div>
                    <h2 className={styles.cardTitle}>Number Quizzes</h2>
                </motion.div>
            </div>
        </div>
    );
};

export default QuizDashboard;
