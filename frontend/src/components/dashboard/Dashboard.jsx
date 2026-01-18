import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import progressService from '../../services/progressService';
import DailyChallenge from '../challenges/DailyChallenge';
import achievementService from '../../services/achievementService';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [dashboardData, setDashboardData] = useState(null);
  const [recentAchievements, setRecentAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [dashData, achievementsData] = await Promise.all([
        progressService.getDashboard(),
        achievementService.getRecentlyUnlocked(3).catch(() => ({ data: [] }))
      ]);
      setDashboardData(dashData);
      setRecentAchievements(achievementsData.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('שגיאה בטעינת הדשבורד');
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} שעות ${minutes} דקות`;
    }
    return `${minutes} דקות`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'אף פעם';
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading">טוען דשבורד...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  const { stats, completion, nextLesson, recentActivity, mistakeStats, gamification, dailyStats } = dashboardData;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Welcome Header */}
        <div className="welcome-header">
          <h1 className="welcome-title">
            שלום, {user?.studentName || user?.name || 'תלמיד'}! 👋
          </h1>
          <p className="welcome-subtitle">בוא נמשיך ללמוד אנגלית</p>
        </div>

        {/* Daily Stats Section */}
        {dailyStats && (
          <div className="daily-stats-section">
            <div className="daily-stat-card streak-card">
              <div className="daily-stat-icon">🔥</div>
              <div className="daily-stat-content">
                <div className="daily-stat-value">{dailyStats.currentStreak}</div>
                <div className="daily-stat-label">ימים רצופים</div>
              </div>
            </div>
            <div className="daily-stat-card points-today-card">
              <div className="daily-stat-icon">⭐</div>
              <div className="daily-stat-content">
                <div className="daily-stat-value">{dailyStats.pointsToday}</div>
                <div className="daily-stat-label">נקודות היום</div>
              </div>
            </div>
          </div>
        )}

        {/* Gamification Section */}
        {gamification && (
          <div className="gamification-section">
            <div className="arena-display">
              <div className="arena-image-container">
                <img
                  src={gamification.levelImagePath}
                  alt={gamification.arenaName}
                  className="arena-image"
                />
                <div className="arena-badge">
                  <div className="arena-level">Level {gamification.currentLevel}</div>
                </div>
              </div>
              <div className="arena-info">
                <h3 className="arena-name">{gamification.arenaName}</h3>
                <div className="points-display">
                  <div className="points-label">נקודות:</div>
                  <div className="points-value">{gamification.totalPoints}</div>
                </div>
                <div className="next-level-info">
                  <div className="next-level-label">
                    {gamification.currentLevel < 6
                      ? `עוד ${gamification.pointsToNextLevel} נקודות לשלב הבא`
                      : 'הגעת לשלב הגבוה ביותר! 🎉'}
                  </div>
                  {gamification.currentLevel < 6 && (
                    <div className="level-progress-bar">
                      <div
                        className="level-progress-fill"
                        style={{
                          width: `${((20 - gamification.pointsToNextLevel) / 20) * 100}%`
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Daily Challenge Widget */}
        <div className="dashboard-challenges-section">
          <DailyChallenge />
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2 className="section-title">פעולות מהירות</h2>
          <div className="actions-grid">
            {nextLesson ? (
              <button
                className="action-card primary"
                onClick={() => navigate(`/learn/${nextLesson.id}`)}
              >
                <div className="action-icon">📚</div>
                <div className="action-title">המשך ללמוד</div>
                <div className="action-subtitle">{nextLesson.title_he}</div>
              </button>
            ) : (
              <div className="action-card completed-all">
                <div className="action-icon">🎓</div>
                <div className="action-title">סיימת הכל!</div>
                <div className="action-subtitle">כל הכבוד!</div>
              </div>
            )}

            <button
              className="action-card secondary"
              onClick={() => navigate('/topics')}
            >
              <div className="action-icon">📋</div>
              <div className="action-title">כל הנושאים</div>
              <div className="action-subtitle">בחר שיעור</div>
            </button>

            <button
              className="action-card secondary"
              onClick={() => navigate('/progress')}
            >
              <div className="action-icon">📈</div>
              <div className="action-title">התקדמות מפורטת</div>
              <div className="action-subtitle">סטטיסטיקות וגרפים</div>
            </button>

            <button
              className="action-card cross-test-card"
              onClick={() => navigate('/cross-test')}
            >
              <div className="action-icon">🎯</div>
              <div className="action-title">מבחן משולב</div>
              <div className="action-subtitle">שאלות מכל הנושאים</div>
            </button>

            <button
              className="action-card vocabulary-card"
              onClick={() => navigate('/vocabulary')}
            >
              <div className="action-icon">📝</div>
              <div className="action-title">לימוד מילים</div>
              <div className="action-subtitle">תרגול אוצר מילים</div>
            </button>

            <button
              className="action-card unseen-card"
              onClick={() => navigate('/unseen')}
            >
              <div className="action-icon">📖</div>
              <div className="action-title">פסקאות באנגלית</div>
              <div className="action-subtitle">Unseen - הבנת הנקרא</div>
            </button>

            {mistakeStats.uncorrected_count > 0 && (
              <button
                className="action-card mistakes-card"
                onClick={() => navigate('/mistakes')}
              >
                <div className="action-icon">🔄</div>
                <div className="action-title">תקן טעויות</div>
                <div className="action-subtitle">
                  {mistakeStats.uncorrected_count} ממתינות
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Recent Achievements */}
        {recentAchievements && recentAchievements.length > 0 && (
          <div className="dashboard-achievements-section">
            <div className="section-header">
              <h2 className="section-title">הישגים אחרונים</h2>
              <button
                className="view-all-link"
                onClick={() => navigate('/achievements')}
              >
                צפה בכל ההישגים ←
              </button>
            </div>
            <div className="recent-achievements-grid">
              {recentAchievements.map((achievement) => (
                <div key={achievement.id} className="recent-achievement-card">
                  <div className="recent-achievement-icon">{achievement.icon}</div>
                  <div className="recent-achievement-info">
                    <h4>{achievement.name_he}</h4>
                    <p>{achievement.description_he}</p>
                    <span className="recent-achievement-points">
                      🪙 {achievement.points_reward}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card completed">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{completion.completed_lessons}</div>
            <div className="stat-label">שיעורים הושלמו</div>
            <div className="stat-detail">מתוך {completion.total_lessons}</div>
          </div>

          <div className="stat-card average">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{stats.average_score}%</div>
            <div className="stat-label">ציון ממוצע</div>
            <div className="stat-detail">{stats.total_attempts} ניסיונות</div>
          </div>

          <div className="stat-card time">
            <div className="stat-icon">⏱️</div>
            <div className="stat-value">{formatTime(stats.total_time_spent)}</div>
            <div className="stat-label">זמן למידה</div>
            <div className="stat-detail">סה״כ</div>
          </div>

          <div className="stat-card mistakes">
            <div className="stat-icon">🎯</div>
            <div className="stat-value">{mistakeStats.uncorrected_count}</div>
            <div className="stat-label">טעויות לתיקון</div>
            <div className="stat-detail">מתוך {mistakeStats.total_mistakes}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <h2 className="section-title">ההתקדמות שלך</h2>
          <div className="progress-card">
            <div className="progress-header">
              <span className="progress-label">השלמת שיעורים</span>
              <span className="progress-percentage">{completion.percentage}%</span>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${completion.percentage}%` }}
              ></div>
            </div>
            <div className="progress-footer">
              <span>{completion.completed_lessons} הושלמו</span>
              <span>{completion.total_lessons - completion.completed_lessons} נותרו</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {recentActivity && recentActivity.length > 0 && (
          <div className="recent-activity">
            <h2 className="section-title">פעילות אחרונה</h2>
            <div className="activity-list">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    {activity.score >= 70 ? '✅' : '📝'}
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">{activity.title_he}</div>
                    <div className="activity-details">
                      ניסיון {activity.attempt_number} • ציון: {activity.score}% •{' '}
                      {activity.correct_answers}/{activity.total_questions} נכונות
                    </div>
                  </div>
                  <div className="activity-date">{formatDate(activity.completed_at)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
