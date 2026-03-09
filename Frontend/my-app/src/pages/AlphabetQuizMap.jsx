import React from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
// Reusing exact styles from AlphabetLevels to perfectly preserve the horizontal wave layout
import BackButton from '../components/common/BackButton';
import styles from '../components/AlphabetLevels.module.css';

const AlphabetQuizMap = () => {
    const navigate = useNavigate();

    // Define the 6 quiz nodes, explicitly including the Boss Level
    const levels = [
        { id: 1, title: "A - E", unlocked: true, route: '/quiz/alphabets/mod1', color: "var(--btn-green)", subtitle: "Module 1" },
        { id: 2, title: "F - J", unlocked: true, route: '/quiz/alphabets/mod2', color: "#ff006e", subtitle: "Module 2" },
        { id: 3, title: "K - O", unlocked: true, route: '/quiz/alphabets/mod3', color: "#34b6f7", subtitle: "Module 3" },
        { id: 4, title: "P - T", unlocked: true, route: '/quiz/alphabets/mod4', color: "var(--bg-orange)", subtitle: "Module 4" },
        { id: 5, title: "U - Z", unlocked: true, route: '/quiz/alphabets/mod5', color: "#8338ec", subtitle: "Module 5" },
        {
            id: 6,
            title: "A - Z 👑",
            unlocked: true,
            route: '/quiz/alphabets/master',
            color: "#ffbe0b",
            label: "Boss Level"
        }
    ];

    return (
        <div className={styles.levelsPage}>
            <header className={styles.header}>
                <BackButton variant="back" fallbackRoute="/quizzes" />
                <h1 className={styles.title}>Alphabet Quiz Map 🗺️</h1>
            </header>

            <main className={styles.pathContainer}>
                {/* The dashed line connecting the levels */}
                <div className={styles.dashedLine}></div>

                {levels.map((level, index) => {
                    // Alternating top/bottom alignment for the wave path
                    const isTop = index % 2 === 0;

                    // Special inline style handling for the Boss level button to make it massive
                    const extraStyles = level.id === 6 ? { width: '160px', height: '160px', border: '8px solid white' } : {};

                    return (
                        <motion.div
                            key={level.id}
                            className={`${styles.levelWrapper} ${isTop ? styles.topWave : styles.bottomWave}`}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.15, type: "spring", stiffness: 120 }}
                        >
                            <button
                                className={`${styles.levelCircle} ${styles.unlocked}`}
                                style={{ backgroundColor: level.color, ...extraStyles }}
                                onClick={() => navigate(level.route)}
                            >
                                {/* Floating Module Label */}
                                <span className={styles.levelLabel}>{level.label || level.subtitle}</span>
                                <h2 className={styles.levelTitle}>{level.title}</h2>
                            </button>
                        </motion.div>
                    );
                })}
            </main>
        </div>
    );
};

export default AlphabetQuizMap;
