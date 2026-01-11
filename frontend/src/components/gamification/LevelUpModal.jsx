import React, { useEffect } from 'react';
import soundEffects from '../../utils/soundEffects';
import './LevelUpModal.css';

/**
 * LevelUpModal - Celebration modal shown when user levels up
 *
 * Props:
 * - isOpen: boolean - whether modal is visible
 * - onClose: function - callback when modal is closed
 * - newLevel: number - the new level reached
 * - arenaName: string - name of new arena
 * - levelImagePath: string - path to level image
 * - totalPoints: number - total points accumulated
 */
const LevelUpModal = ({ isOpen, onClose, newLevel, arenaName, levelImagePath, totalPoints }) => {
  // Play level-up sound when modal opens
  useEffect(() => {
    if (isOpen) {
      // Initialize sound effects on first interaction
      soundEffects.init();
      // Play level-up sound
      soundEffects.playLevelUp();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="level-up-overlay" onClick={onClose}>
      <div className="level-up-modal" onClick={(e) => e.stopPropagation()}>
        <button className="level-up-close" onClick={onClose}>×</button>

        {/* Confetti Effect */}
        <div className="confetti">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#ffc107', '#ff9800', '#667eea', '#764ba2', '#28a745'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>

        {/* Level Up Content */}
        <div className="level-up-content">
          <div className="level-up-badge">
            <div className="level-up-badge-glow"></div>
            <img
              src={levelImagePath}
              alt={arenaName}
              className="level-up-image"
            />
            <div className="level-up-level-number">Level {newLevel}</div>
          </div>

          <h2 className="level-up-title">🎉 העלית רמה! 🎉</h2>
          <h3 className="level-up-arena">{arenaName}</h3>

          <div className="level-up-stats">
            <div className="level-up-stat">
              <div className="level-up-stat-label">רמה חדשה</div>
              <div className="level-up-stat-value">{newLevel}</div>
            </div>
            <div className="level-up-stat">
              <div className="level-up-stat-label">סך נקודות</div>
              <div className="level-up-stat-value">{totalPoints}</div>
            </div>
          </div>

          <p className="level-up-message">
            כל הכבוד! המשך להתקדם ולהשיג רמות גבוהות יותר!
          </p>

          <button className="level-up-continue" onClick={onClose}>
            המשך
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelUpModal;
