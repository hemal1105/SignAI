import React, { useState } from "react";
import { motion } from "framer-motion";
import Emotions from "./Emotions"; // Check if this file exists in src/pages/
import styles from "./Learn.module.css";

const Learn = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    { id: 1, label: "Alphabets" },
    { id: 2, label: "Numbers" },
    { id: 3, label: "Family" },
    { id: 4, label: "Emotions" },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Learning Path 🗺️</h1>
      <div className={styles.path}>
        {steps.map((step) => (
          <motion.div
            key={step.id}
            whileHover={{ scale: 1.1 }}
            className={`${styles.stepCircle} ${activeStep === step.id ? styles.current : ""}`}
            onClick={() => setActiveStep(step.id)}
          >
            <span className={styles.number}>{step.id}</span>
            <p className={styles.label}>{step.label}</p>
          </motion.div>
        ))}
      </div>

      <div className={styles.module}>
        {activeStep === 4 ? <Emotions /> : <p>Module content for step {activeStep} goes here</p>}
      </div>
    </div>
  );
};

export default Learn;

// import React from 'react';
// import styles from './Learn.module.css';
// import { motion } from 'framer-motion';

// const Learn = () => {
//   const steps = [
//     { id: 1, label: 'Alphabets', status: 'completed' },
//     { id: 2, label: 'Numbers', status: 'current' },
//     { id: 3, label: 'Family', status: 'locked' },
//     { id: 4, label: 'Emotions', status: 'locked' },
//   ];

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>My Learning Path 🗺️</h1>
//       <div className={styles.path}>
//         {steps.map((step, index) => (
//           <motion.div 
//             key={step.id}
//             whileHover={{ scale: 1.1 }}
//             className={`${styles.stepCircle} ${styles[step.status]}`}
//           >
//             <span className={styles.number}>{step.id}</span>
//             <p className={styles.label}>{step.label}</p>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Learn;