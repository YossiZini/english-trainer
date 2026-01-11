import React, { useState, useEffect } from 'react';
import challengeService from '../../services/challengeService';
import './Challenges.css';

/**
 * DailyChallenge - Display today's challenge with progress
 */
const DailyChallenge = () => {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadChallenge();
    // Refresh every 5 minutes to check progress
    const interval = setInterval(loadChallenge, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadChallenge = async () => {
    try {
      const response = await challengeService.getChallengeProgress();
      setChallenge(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load daily challenge:', err);
      setError('שגיאה בטעינת האתגר היומי');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="daily-challenge-card loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="daily-challenge-card error">
        <p>{error}</p>
      </div>
    );
  }

  if (!challenge) {
    return null;
  }

  const progressPercentage = Math.min((challenge.progress / challenge.challenge_target) * 100, 100);
  const isCompleted = challenge.completed;

  // Calculate time remaining until midnight
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const hoursRemaining = Math.floor((midnight - now) / (1000 * 60 * 60));
  const minutesRemaining = Math.floor(((midnight - now) % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className={`daily-challenge-card ${isCompleted ? 'completed' : ''}`}>
      {/* Header */}
      <div className="daily-challenge-header">
        <div className="daily-challenge-icon">{challenge.icon || '🎯'}</div>
        <div className="daily-challenge-header-text">
          <h3 className="daily-challenge-title">אתגר יומי</h3>
          <p className="daily-challenge-time-remaining">
            {isCompleted ? (
              '✅ הושלם!'
            ) : (
              `⏰ ${hoursRemaining}:${minutesRemaining.toString().padStart(2, '0')} נותרו`
            )}
          </p>
        </div>
      </div>

      {/* Challenge Description */}
      <div className="daily-challenge-description">
        <h4>{challenge.title_he}</h4>
        <p>{challenge.description_he}</p>
      </div>

      {/* Progress Bar */}
      <div className="daily-challenge-progress">
        <div className="daily-challenge-progress-bar">
          <div
            className="daily-challenge-progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="daily-challenge-progress-text">
          {challenge.progress} / {challenge.challenge_target}
        </div>
      </div>

      {/* Reward */}
      <div className="daily-challenge-reward">
        <span className="daily-challenge-reward-icon">🪙</span>
        <span className="daily-challenge-reward-value">{challenge.points_reward}</span>
        <span className="daily-challenge-reward-label">נקודות</span>
      </div>

      {/* Completion Badge */}
      {isCompleted && (
        <div className="daily-challenge-completed-badge">
          <div className="completed-badge-icon">🏆</div>
          <div className="completed-badge-text">הושלם!</div>
        </div>
      )}
    </div>
  );
};

export default DailyChallenge;
