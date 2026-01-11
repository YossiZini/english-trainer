import React from 'react';
import './Achievements.css';

/**
 * AchievementCard - Display a single achievement with progress
 *
 * Props:
 * - achievement: object containing:
 *   - id, key, name_he, description_he, icon, tier, points_reward
 *   - requirement_type, requirement_value
 *   - unlocked: boolean
 *   - unlocked_at: timestamp or null
 *   - progress: number
 */
const AchievementCard = ({ achievement }) => {
  const {
    name_he,
    description_he,
    icon,
    tier,
    points_reward,
    requirement_value,
    unlocked,
    unlocked_at,
    progress
  } = achievement;

  const progressPercentage = unlocked ? 100 : Math.min((progress / requirement_value) * 100, 100);

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

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className={`achievement-card ${unlocked ? 'unlocked' : 'locked'}`}>
      {/* Tier Badge */}
      <div className="achievement-tier-badge" style={{ backgroundColor: getTierColor(tier) }}>
        {getTierLabel(tier)}
      </div>

      {/* Achievement Icon */}
      <div className="achievement-icon">
        {icon}
      </div>

      {/* Achievement Info */}
      <div className="achievement-info">
        <h3 className="achievement-name">{name_he}</h3>
        <p className="achievement-description">{description_he}</p>

        {/* Progress Bar for Locked Achievements */}
        {!unlocked && (
          <div className="achievement-progress">
            <div className="achievement-progress-bar">
              <div
                className="achievement-progress-fill"
                style={{
                  width: `${progressPercentage}%`,
                  backgroundColor: getTierColor(tier)
                }}
              ></div>
            </div>
            <div className="achievement-progress-text">
              {progress}/{requirement_value}
            </div>
          </div>
        )}

        {/* Unlock Date for Unlocked Achievements */}
        {unlocked && unlocked_at && (
          <div className="achievement-unlocked-date">
            נפתח: {formatDate(unlocked_at)}
          </div>
        )}

        {/* Points Reward */}
        <div className="achievement-points">
          <span className="achievement-points-icon">🪙</span>
          {points_reward} נקודות
        </div>
      </div>

      {/* Locked Overlay */}
      {!unlocked && (
        <div className="achievement-locked-overlay">
          <div className="achievement-lock-icon">🔒</div>
        </div>
      )}
    </div>
  );
};

export default AchievementCard;
