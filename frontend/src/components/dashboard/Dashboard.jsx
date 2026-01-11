import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import progressService from '../../services/progressService';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await progressService.getDashboard();
      setDashboardData(data);
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

  const { stats, completion, nextLesson, recentActivity, mistakeStats } = dashboardData;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Welcome Header */}
        <div className="welcome-header">
          <h1 className="welcome-title">
            שלום, {user?.username || 'תלמיד'}! 👋
          </h1>
          <p className="welcome-subtitle">בוא נמשיך ללמוד אנגלית</p>
        </div>

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
