import React, { useEffect } from 'react';
import soundEffects from '../../utils/soundEffects';
import './Achievements.css';

/**
 * AchievementUnlockModal - Celebration modal shown when achievement is unlocked
 *
 * Props:
 * - isOpen: boolean - whether modal is visible
 * - onClose: function - callback when modal is closed
 * - achievement: object containing:
 *   - name_he, description_he, icon, tier, points_reward
 */
const AchievementUnlockModal = ({ isOpen, onClose, achievement }) => {
  // Play achievement sound when modal opens
  useEffect(() => {
    if (isOpen && achievement) {
      soundEffects.init();
      soundEffects.playAchievement();
    }
  }, [isOpen, achievement]);

  if (!isOpen || !achievement) return null;

  const getTierColor = (tier) => {
    switch (tier) {
      case 'bronze': return '#cd7f32';
      case 'silver': return '#c0c0c0';
      case 'gold': return '#ffd700';
      case 'platinum': return '#e5e4e2';
      default: return '#888';
    }
  };

  const getTierLabel = (tier) => {
    switch (tier) {
      case 'bronze': return 'ארד';
      case 'silver': return 'כסף';
      case 'gold': return 'זהב';
      case 'platinum': return 'פלטינה';
      default: return tier;
    }
  };

  return (
    <div className="achievement-unlock-overlay" onClick={onClose}>
      <div className="achievement-unlock-modal" onClick={(e) => e.stopPropagation()}>
        <button className="achievement-unlock-close" onClick={onClose}>×</button>

        {/* Sparkle Effect */}
        <div className="achievement-sparkles">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1}s`,
                backgroundColor: getTierColor(achievement.tier)
              }}
            />
          ))}
        </div>

        {/* Achievement Content */}
        <div className="achievement-unlock-content">
          <h2 className="achievement-unlock-title">🏆 הישג חדש! 🏆</h2>

          {/* Achievement Icon with Glow */}
          <div className="achievement-unlock-icon-container">
            <div
              className="achievement-unlock-glow"
              style={{ backgroundColor: getTierColor(achievement.tier) }}
            ></div>
            <div className="achievement-unlock-icon">{achievement.icon}</div>
          </div>

          {/* Achievement Details */}
          <div className="achievement-unlock-details">
            <div
              className="achievement-unlock-tier"
              style={{ backgroundColor: getTierColor(achievement.tier) }}
            >
              {getTierLabel(achievement.tier)}
            </div>

            <h3 className="achievement-unlock-name">{achievement.name_he}</h3>
            <p className="achievement-unlock-description">{achievement.description_he}</p>

            {/* Points Earned */}
            <div className="achievement-unlock-points">
              <span className="achievement-unlock-points-icon">🪙</span>
              <span className="achievement-unlock-points-value">+{achievement.points_reward}</span>
              <span className="achievement-unlock-points-label">נקודות</span>
            </div>
          </div>

          {/* Congratulations Message */}
          <p className="achievement-unlock-message">
            כל הכבוד! המשך ללמוד ולפתוח עוד הישגים!
          </p>

          <button className="achievement-unlock-continue" onClick={onClose}>
            המשך
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementUnlockModal;
