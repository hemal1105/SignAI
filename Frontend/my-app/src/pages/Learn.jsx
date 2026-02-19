import React from 'react';
import styles from './Learn.module.css';
import { motion } from 'framer-motion';

const Learn = () => {
  const steps = [
    { id: 1, label: 'Alphabets', status: 'completed' },
    { id: 2, label: 'Numbers', status: 'current' },
    { id: 3, label: 'Family', status: 'locked' },
    { id: 4, label: 'Emotions', status: 'locked' },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Learning Path 🗺️</h1>
      <div className={styles.path}>
        {steps.map((step, index) => (
          <motion.div 
            key={step.id}
            whileHover={{ scale: 1.1 }}
            className={`${styles.stepCircle} ${styles[step.status]}`}
          >
            <span className={styles.number}>{step.id}</span>
            <p className={styles.label}>{step.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Learn;