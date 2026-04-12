import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Emotions from "./Emotions"; // Ensure this path is correct
import styles from "./Learn.module.css";

const Learn = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);

  // Added a 'path' property to each step for easier management
  const steps = [
    { id: 1, label: "Alphabets", path: "/learn/alphabets" },
    { id: 2, label: "Numbers", path: "/learn/numbers" },
    { id: 3, label: "Family", path: null }, // Stays on page
    { id: 4, label: "Emotions", path: "/emotions" },
  ];

  const handleStepClick = (step) => {
    setActiveStep(step.id);
    
    // If the step has a specific URL path, navigate to it
    if (step.path) {
      navigate(step.path);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Learning Path 🗺️</h1>
      
      <div className={styles.path}>
        {steps.map((step) => (
          <motion.div
            key={step.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`${styles.stepCircle} ${
              activeStep === step.id ? styles.current : ""
            }`}
            onClick={() => handleStepClick(step)}
          >
            <span className={styles.number}>{step.id}</span>
            <p className={styles.label}>{step.label}</p>
          </motion.div>
        ))}
      </div>

      <hr className={styles.divider} />

      {/* Logic for on-page content rendering */}
      <div className={styles.module}>
        {activeStep === 4 && <Emotions />}
        
        {/* Placeholder for steps that don't navigate away yet */}
        {activeStep === 3 && (
          <div className={styles.placeholder}>
            <h2>Family Module</h2>
            <p>Module content for Family goes here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Learn;


// import React, { useState } from "react";
// // eslint-disable-next-line no-unused-vars
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import Emotions from "./Emotions"; // Check if this file exists in src/pages/
// import styles from "./Learn.module.css";

// const Learn = () => {
//   const [activeStep, setActiveStep] = useState(1);
//   const navigate = useNavigate();

//   const steps = [
//     { id: 1, label: "Alphabets" },
//     { id: 2, label: "Numbers" },
//     { id: 3, label: "Family" },
//     { id: 4, label: "Emotions" },
//   ];

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>My Learning Path 🗺️</h1>
//       <div className={styles.path}>
//         {steps.map((step) => (
//           <motion.div
//             key={step.id}
//             whileHover={{ scale: 1.1 }}
//             className={`${styles.stepCircle} ${activeStep === step.id ? styles.current : ""}`}
//             onClick={() => {
//               setActiveStep(step.id);
//               if (step.id === 1) {
//                 navigate("/learn/alphabets");
//               } else if (step.id === 2) {
//                 navigate("/learn/numbers");
//               }
//             }}
//           >
//             <span className={styles.number}>{step.id}</span>
//             <p className={styles.label}>{step.label}</p>
//           </motion.div>
//         ))}
//       </div>

//       <div className={styles.module}>
//         {activeStep === 4 && <Emotions />}
//         {activeStep !== 1 && activeStep !== 4 && <p>Module content for step {activeStep} goes here</p>}
//       </div>
//     </div>
//   );
// };

// export default Learn;
