import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from './common/BackButton';
import styles from './AlphabetLevels.module.css';

const STAR_ALTITUDE = 40; // Pixels exactly (1cm height clearance above the pill edge)

const AlphabetLevels = () => {
    const navigate = useNavigate();
    const [unlockedLevel, setUnlockedLevel] = useState(1);
    const [activeStarLevel, setActiveStarLevel] = useState(null);

    useEffect(() => {
        const currentUnlocked = parseInt(sessionStorage.getItem('alphabet_unlockedLevel')) || 1;
        const storedPrev = parseInt(sessionStorage.getItem('alphabet_prevLevel')) || currentUnlocked;
        
        setUnlockedLevel(currentUnlocked);
        // Place star at previous position
        setActiveStarLevel(storedPrev);

        // Slide the star gently
        if (storedPrev < currentUnlocked) {
            setTimeout(() => {
                setActiveStarLevel(currentUnlocked);
                sessionStorage.setItem('alphabet_prevLevel', currentUnlocked.toString());
            }, 500); 
        } else {
            sessionStorage.setItem('alphabet_prevLevel', currentUnlocked.toString());
        }
    }, []);

    const levels = [
        { id: 1, title: "A - E", route: '/learn/alphabets/mod1', color: "var(--btn-green)" },
        { id: 2, title: "F - J", route: '/learn/alphabets/mod2', color: "var(--text-yellow)" },
        { id: 3, title: "K - O", route: '/learn/alphabets/mod3', color: "#34b6f7" },
        { id: 4, title: "P - T", route: '/learn/alphabets/mod4', color: "#ff006e" },
        { id: 5, title: "U - Z", route: '/learn/alphabets/mod5', color: "#8338ec" }
    ];

    const resetJourney = () => {
        sessionStorage.removeItem('alphabet_unlockedLevel');
        sessionStorage.removeItem('alphabet_prevLevel');
        setUnlockedLevel(1);
        setActiveStarLevel(1);
    };

    const grandMasterUnlocked = unlockedLevel === 6;

    return (
        <div className={styles.levelsPage} style={{ background: "#fbf3f5", color: "#333", minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
            <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px", width: "100%", boxSizing: "border-box" }}>
                <div style={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
                    <BackButton variant="back" fallbackRoute="/learn" />
                </div>
                
                <h1 style={{ 
                    color: "#ff8c00", 
                    fontFamily: "'Nunito', 'Segoe UI', Tahoma, Verdana, sans-serif", 
                    fontWeight: "900", 
                    fontSize: "3.5rem", 
                    textShadow: "3px 3px 0px white, -3px -3px 0px white, 3px -3px 0px white, -3px 3px 0px white, 0 8px 15px rgba(255, 140, 0, 0.2)",
                    letterSpacing: "1px",
                    margin: 0,
                    textAlign: "center",
                    flex: 2,
                    background: "white",
                    padding: "20px 60px",
                    borderRadius: "50px",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.05)"
                }}>
                    Alphabet Map 🗺️
                </h1>
                
                <div style={{ flex: 1 }}></div> 
            </header>

            <main className={styles.pathContainer} style={{ position: "relative", paddingBottom: "100px", paddingTop: "50px" }}>
                <div className={styles.dashedLine} style={{ borderColor: "rgba(183,110,121,0.3)", borderStyle: "dashed", borderWidth: "4px" }}></div>

                {levels.map((level, index) => {
                    const isTop = index % 2 === 0;
                    const currentLevelNumber = index + 1;
                    const isUnlocked = currentLevelNumber <= unlockedLevel;
                    const isCurrent = currentLevelNumber === unlockedLevel;

                    let labelContent = "🔒";
                    let labelColor = "#999";

                    if (currentLevelNumber < unlockedLevel) {
                        labelContent = `Module ${currentLevelNumber} ✅`;
                        labelColor = "#06d6a0"; 
                    } else if (currentLevelNumber === unlockedLevel) {
                        labelContent = "START";
                        labelColor = "#3a86ff";
                    } else {
                        labelContent = "🔒";
                        labelColor = "#999";
                    }

                    return (
                        <motion.div
                            key={level.id}
                            className={`${styles.levelWrapper} ${isTop ? styles.topWave : styles.bottomWave}`}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.15, type: "spring", stiffness: 120 }}
                            style={{ position: "relative" }}
                        >
                            <motion.button
                                className={`${styles.levelCircle}`}
                                style={{ 
                                    backgroundColor: isUnlocked ? level.color : "#e2e8f0",
                                    filter: isUnlocked ? "none" : "grayscale(1) opacity(0.6)",
                                    boxShadow: isCurrent ? "0 0 30px rgba(58, 134, 255, 0.4), 0 8px 0 rgba(0,0,0,0.2)" : (isUnlocked ? "0 8px 0 rgba(0,0,0,0.2)" : "0 8px 0 rgba(0,0,0,0.1)"),
                                    position: "relative",
                                    display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                                    transition: "all 0.5s ease-in-out",
                                    flexShrink: 0
                                }}
                                animate={isCurrent ? { scale: [1, 1.05, 1] } : {}}
                                transition={isCurrent ? { repeat: Infinity, duration: 1.5 } : {}}
                                onClick={() => isUnlocked && navigate(level.route)}
                                disabled={!isUnlocked}
                            >
                                {/* Dynamic White Pill rendering centrally above module tracking exact node */}
                                <div style={{ 
                                    background: "white", color: labelColor, fontWeight: "900", 
                                    height: "32px", width: "150px", 
                                    display: "flex", justifyContent: "center", alignItems: "center",
                                    borderRadius: "20px", fontSize: "1rem", 
                                    boxShadow: "0 6px 10px rgba(0,0,0,0.15)",
                                    fontFamily: "'Nunito', sans-serif", letterSpacing: "1px",
                                    position: "absolute", top: "-16px", left: "50%", transform: "translateX(-50%)",
                                    zIndex: 5
                                }}>
                                    {isCurrent ? (
                                        <motion.span style={{display: "inline-block"}} animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>{labelContent}</motion.span>
                                    ) : (
                                        <span style={{display: "inline-block"}}>{labelContent}</span>
                                    )}

                                    {/* Exclusively anchored mascot tied structurally to the exact pill bounding box leveraging 1cm altitude math */}
                                    {activeStarLevel === currentLevelNumber && (
                                        <motion.div 
                                            layoutId="goldenStar"
                                            transition={{ duration: 2, ease: "easeInOut" }}
                                            style={{ 
                                                position: "absolute", 
                                                bottom: `calc(100% + ${STAR_ALTITUDE}px)`, 
                                                left: "50%", 
                                                transform: "translateX(-50%)", 
                                                fontSize: "3.5rem", 
                                                zIndex: 100, 
                                                filter: "drop-shadow(0 8px 10px rgba(0,0,0,0.3))",
                                                pointerEvents: "none",
                                                whiteSpace: "nowrap"
                                            }}
                                        >
                                            🌟
                                        </motion.div>
                                    )}
                                </div>

                                <span className={styles.levelLabel} style={{ color: isUnlocked ? "white" : "#666", fontWeight: "bold", marginTop: "15px", visibility: "hidden" }}>Module {level.id}</span>
                                <h2 className={styles.levelTitle} style={{ color: isUnlocked ? "white" : "#333", fontSize: "1.8rem", textShadow: isUnlocked ? "0 2px 5px rgba(0,0,0,0.3)" : "none", margin: 0 }}>{level.title}</h2>
                            </motion.button>
                        </motion.div>
                    );
                })}

                {/* Grand Master Trophy directly anchored bounding structural offset perfectly rendering explicitly */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", flexShrink: 0, width: "130px" }}
                >
                    <div style={{
                       background: grandMasterUnlocked ? "linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)" : "rgba(224, 224, 224, 0.3)", 
                       padding: "50px", borderRadius: "50%",
                       boxShadow: grandMasterUnlocked ? "0 20px 50px rgba(255, 140, 0, 0.6), inset 0 0 20px rgba(255,255,255,0.7), 0 10px 0 #cc7000" : "0 5px 15px rgba(0,0,0,0.05)",
                       filter: grandMasterUnlocked ? "none" : "grayscale(1)",
                       display: "flex", justifyContent: "center", alignItems: "center",
                       position: "relative",
                       transition: "all 0.5s ease-in-out" 
                    }}>
                        {!grandMasterUnlocked && (
                            <div style={{ position: "absolute", zIndex: 20, fontSize: "2.5rem" }}>🔒</div>
                        )}
                        <motion.div 
                            animate={grandMasterUnlocked ? { rotate: [0, -5, 5, -5, 0] } : {}}
                            transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                            style={{ fontSize: "7rem", filter: grandMasterUnlocked ? "drop-shadow(0 10px 10px rgba(0,0,0,0.3))" : "none", opacity: grandMasterUnlocked ? 1 : 0.4 }}
                        >
                            🏆
                        </motion.div>

                        {/* Grand Master Target Lock mathematically tied identically mimicking 1cm structural rule above trophy boundary */}
                        {activeStarLevel === 6 && (
                            <motion.div 
                                layoutId="goldenStar"
                                transition={{ duration: 2, ease: "easeInOut" }}
                                style={{ 
                                    position: "absolute", 
                                    bottom: `calc(100% + ${STAR_ALTITUDE}px)`, 
                                    left: "50%", 
                                    transform: "translateX(-50%)", 
                                    fontSize: "4rem", 
                                    zIndex: 100, 
                                    filter: "drop-shadow(0 10px 10px rgba(255,215,0,0.5))",
                                    pointerEvents: "none",
                                    whiteSpace: "nowrap"
                                }}
                            >
                                🌟
                            </motion.div>
                        )}
                    </div>
                    
                    <h2 style={{
                        marginTop: "30px", color: grandMasterUnlocked ? "#FF8C00" : "#999",
                        fontWeight: "900", fontSize: "2.5rem", fontFamily: "'Nunito', sans-serif",
                        textShadow: grandMasterUnlocked ? "3px 3px 0px white, 0 5px 10px rgba(0,0,0,0.1)" : "none",
                        letterSpacing: "2px",
                        whiteSpace: "nowrap"
                    }}>
                        GRAND MASTER
                    </h2>
                </motion.div>
            </main>

            <div style={{ display: "flex", justifyContent: "center", paddingBottom: "40px" }}>
                <button 
                    onClick={resetJourney}
                    style={{ background: "transparent", color: "#b76e79", border: "3px solid #b76e79", padding: "10px 25px", borderRadius: "20px", cursor: "pointer", fontWeight: "bold", fontSize: "1.1rem", transition: "all 0.2s" }}
                    onMouseOver={e => e.currentTarget.style.background = "rgba(183,110,121,0.1)"}
                    onMouseOut={e => e.currentTarget.style.background = "transparent"}
                >
                    Reset Journey ↺
                </button>
            </div>
        </div>
    );
};

export default AlphabetLevels;
