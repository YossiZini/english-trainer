import React, { useState, useEffect } from 'react';
import challengeService from '../../services/challengeService';
import './Challenges.css';

/**
 * ChallengeHistory - Display past daily challenges
 */
const ChallengeHistory = () => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const [historyData, statsData] = await Promise.all([
        challengeService.getChallengeHistory(7),
        challengeService.getChallengeStats()
      ]);

      setHistory(historyData.data);
      setStats(statsData.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load challenge history:', err);
      setError('שגיאה בטעינת היסטוריית אתגרים');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', { weekday: 'long', day: '2-digit', month: '2-digit' });
  };

  if (loading) {
    return (
      <div className="challenge-history-loading">
        <div className="spinner"></div>
        <p>טוען היסטוריה...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="challenge-history-error">
        <p>{error}</p>
        <button onClick={loadHistory}>נסה שוב</button>
      </div>
    );
  }

  return (
    <div className="challenge-history-container">
      {/* Statistics */}
      {stats && (
        <div className="challenge-stats-header">
          <div className="challenge-stat-card">
            <div className="challenge-stat-value">{stats.completed}</div>
            <div className="challenge-stat-label">הושלמו</div>
          </div>
          <div className="challenge-stat-card">
            <div className="challenge-stat-value">{stats.total}</div>
            <div className="challenge-stat-label">סה"כ אתגרים</div>
          </div>
          <div className="challenge-stat-card">
            <div className="challenge-stat-value">{stats.percentage}%</div>
            <div className="challenge-stat-label">אחוז הצלחה</div>
          </div>
        </div>
      )}

      {/* History List */}
      <div className="challenge-history-list">
        <h3 className="challenge-history-title">אתגרים אחרונים</h3>
        {history.map((challenge) => {
          const isCompleted = challenge.completed;
          const progressPercentage = challenge.progress
            ? Math.min((challenge.progress / challenge.challenge_target) * 100, 100)
            : 0;

          return (
            <div
              key={challenge.id}
              className={`challenge-history-item ${isCompleted ? 'completed' : 'missed'}`}
            >
              <div className="challenge-history-icon">{challenge.icon || '🎯'}</div>

              <div className="challenge-history-content">
                <div className="challenge-history-header">
                  <h4 className="challenge-history-name">{challenge.title_he}</h4>
                  <span className="challenge-history-date">{formatDate(challenge.challenge_date)}</span>
                </div>

                <p className="challenge-history-description">{challenge.description_he}</p>

                {/* Progress */}
                <div className="challenge-history-progress">
                  <div className="challenge-history-progress-bar">
                    <div
                      className="challenge-history-progress-fill"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <span className="challenge-history-progress-text">
                    {challenge.progress || 0} / {challenge.challenge_target}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className={`challenge-history-status ${isCompleted ? 'completed' : 'missed'}`}>
                {isCompleted ? (
                  <>
                    <span className="status-icon">✅</span>
                    <span className="status-text">הושלם</span>
                    <span className="status-points">+{challenge.points_reward}</span>
                  </>
                ) : (
                  <>
                    <span className="status-icon">❌</span>
                    <span className="status-text">הוחמץ</span>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {history.length === 0 && (
          <div className="no-history">
            <p>אין אתגרים קודמים עדיין</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeHistory;
