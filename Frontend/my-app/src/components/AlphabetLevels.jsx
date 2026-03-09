import React from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import BackButton from './common/BackButton';
import styles from './AlphabetLevels.module.css';

const AlphabetLevels = () => {
    const navigate = useNavigate();

    // Define the 5 modules. Only Module 1 has a route right now!
    const levels = [
        { id: 1, title: "A - E", unlocked: true, route: '/learn/alphabets/mod1', color: "var(--btn-green)" },
        { id: 2, title: "F - J", unlocked: true, route: '/learn/alphabets/mod2', color: "var(--text-yellow)" },
        { id: 3, title: "K - O", unlocked: true, route: '/learn/alphabets/mod3', color: "#34b6f7" },
        { id: 4, title: "P - T", unlocked: true, route: '/learn/alphabets/mod4', color: "#ff006e" },
        { id: 5, title: "U - Z", unlocked: true, route: '/learn/alphabets/mod5', color: "#8338ec" }
    ];

    return (
        <div className={styles.levelsPage}>
            <header className={styles.header}>
                <BackButton variant="back" fallbackRoute="/learn" />
                <h1 className={styles.title}>Alphabet Map 🗺️</h1>
            </header>

            <main className={styles.pathContainer}>
                {/* The dashed line connecting the levels */}
                <div className={styles.dashedLine}></div>

                {levels.map((level, index) => {
                    // Alternating top/bottom alignment for the wave path
                    const isTop = index % 2 === 0;

                    return (
                        <motion.div
                            key={level.id}
                            className={`${styles.levelWrapper} ${isTop ? styles.topWave : styles.bottomWave}`}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.15, type: "spring", stiffness: 120 }}
                        >
                            <button
                                className={`${styles.levelCircle} ${level.unlocked ? styles.unlocked : styles.locked}`}
                                style={{ backgroundColor: level.color }}
                                onClick={() => level.unlocked && navigate(level.route)}
                                disabled={!level.unlocked}
                            >
                                {/* Floating Module Label */}
                                <span className={styles.levelLabel}>Module {level.id}</span>
                                <h2 className={styles.levelTitle}>{level.title}</h2>
                            </button>
                        </motion.div>
                    );
                })}
            </main>
        </div>
    );
};

export default AlphabetLevels;
