import React from 'react';
import styles from './Progress.module.css';

const Progress = () => {
  const badges = [
    { name: 'Fast Learner', icon: '⚡' },
    { name: 'Sign Master', icon: '👑' },
    { name: 'Friendly Talker', icon: '🤝' },
  ];

  return (
    <div className={styles.page}>
      <h1>My Super Badges! 🏆</h1>
      <div className={styles.badgeGrid}>
        {badges.map(b => (
          <div key={b.name} className={styles.badgeCard}>
            <div className={styles.badgeIcon}>{b.icon}</div>
            <p>{b.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Progress;