import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const Dashboard = () => {
  const menus = [
    { title: 'Learn Signs', path: '/learn', color: '#4CC9F0', icon: '📚' },
    { title: 'Talking Tool', path: '/translate', color: '#90BE6D', icon: '🤖' },
    { title: 'My Prizes', path: '/progress', color: '#F9C74F', icon: '🏆' }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Hi, Explorer! 🌟</h1>
        <p>What do you want to do today?</p>
      </header>
      
      <div className={styles.menuGrid}>
        {menus.map((menu, index) => (
          <Link to={menu.path} key={index} style={{ textDecoration: 'none' }}>
            <motion.div 
              className={styles.card}
              whileHover={{ scale: 1.05 }}
              style={{ backgroundColor: menu.color }}
            >
              <span className={styles.icon}>{menu.icon}</span>
              <h2>{menu.title}</h2>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;