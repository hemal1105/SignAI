import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Learn', path: '/learn', icon: '📖' },
    { name: 'Translator', path: '/translate', icon: '🤖' },
    { name: 'Badges', path: '/progress', icon: '🏆' },
  ];

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        <motion.span 
          animate={{ rotate: [0, 10, -10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
        >
          🤟
        </motion.span>
        SignAI
      </Link>

      <div className={styles.navLinks}>
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navText}>{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;