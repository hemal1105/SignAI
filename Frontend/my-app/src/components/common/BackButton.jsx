import React from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import styles from './BackButton.module.css';

const BackButton = ({ variant = 'back', fallbackRoute }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (fallbackRoute) {
            navigate(fallbackRoute);
        } else {
            navigate(-1);
        }
    };

    const isBack = variant === 'back';
    const buttonClass = `${styles.btn} ${isBack ? styles.backBtn : styles.closeBtn}`;
    const buttonText = isBack ? '← Back' : '✖';

    return (
        <motion.button
            className={buttonClass}
            onClick={handleClick}
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.9, y: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
            {buttonText}
        </motion.button>
    );
};

export default BackButton;
