import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import progressService from '../../services/progressService';
import DailyChallenge from '../challenges/DailyChallenge';
import achievementService from '../../services/achievementService';
import { continueTarget, DIFFICULTY_LABELS } from './continueTarget';
import './Dashboard.css';

// The subjects on the home page, in display order. Scores, streak, level,
// achievements and the daily challenge are shared by both.
const SUBJECTS = [
  { key: 'english', label: 'אנגלית', icon: '🔤', page: '/topics' },
  { key: 'math', label: 'מתמטיקה', icon: '🔢', page: '/math' }
];
const SUBJECT_LABELS = Object.fromEntries(SUBJECTS.map(s => [s.key, s.label]));

/** One subject's continue button: next level of the last lesson, or the next lesson. */
const SubjectContinueCard = ({ subject, data, onGo }) => {
  const last = data?.lastActivity || null;
  const target = continueTarget(data?.nextLesson || null, last);
  if (target.kind === 'done') {
    return (
      <button className={`continue-training-btn ${subject.key} done`} onClick={() => onGo(subject.page)}>
        <div className="continue-training-icon">🎓</div>
        <div className="continue-training-content">
          <div className="continue-training-label">{subject.label}</div>
          <div className="continue-training-lesson">סיימת את כל השיעורים!</div>
        </div>
      </button>
    );
  }
  const lastScore = target.kind === 'exercise' && last ? last.score : null;
  return (
    <button className={`continue-training-btn ${subject.key}`} onClick={() => onGo(target.path)}>
      <div className="continue-training-icon">{subject.icon}</div>
      <div className="continue-training-content">
        <div className="continue-training-label">המשך {subject.label}</div>
        <div className="continue-training-lesson">{target.title}</div>
        <div className="continue-training-detail">
          {target.kind === 'exercise' ? (
            <>
              תרגול רמה: <span className="difficulty-badge">{DIFFICULTY_LABELS[target.difficulty]}</span>
              {lastScore != null && <> {' • '}ציון אחרון: {lastScore}%</>}
            </>
          ) : (
            <>שיעור חדש</>
          )}
        </div>
      </div>
      <div className="continue-training-arrow">←</div>
    </button>
  );
};

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

  const { stats, completion, recentActivity, mistakeStats, gamification, dailyStats, subjects = {} } = dashboardData;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Welcome Header */}
        <div className="welcome-header">
          <h1 className="welcome-title">
            שלום, {user?.studentName || user?.name || 'תלמיד'}! 👋
          </h1>
          <p className="welcome-subtitle">מה לומדים היום? אנגלית או מתמטיקה</p>
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

        {/* One continue button per subject */}
        <div className="training-actions-row">
          {SUBJECTS.map(subject => (
            <SubjectContinueCard key={subject.key} subject={subject} data={subjects[subject.key]} onGo={navigate} />
          ))}
        </div>

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
                    {gamification.currentLevel < 99
                      ? `עוד ${gamification.pointsToNextLevel} נקודות לשלב הבא`
                      : 'הגעת לשלב הגבוה ביותר! 🎉'}
                  </div>
                  {gamification.currentLevel < 99 && (
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
            <button
              className="action-card secondary"
              onClick={() => navigate('/topics')}
            >
              <div className="action-icon">📋</div>
              <div className="action-title">אנגלית</div>
              <div className="action-subtitle">כל הנושאים, מילים ופסקאות</div>
            </button>

            <button
              className="action-card secondary"
              onClick={() => navigate('/math')}
            >
              <div className="action-icon">🔢</div>
              <div className="action-title">מתמטיקה</div>
              <div className="action-subtitle">שברים, סדר פעולות, ממוצע, אחוזים</div>
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
          {SUBJECTS.map(subject => {
            const c = subjects[subject.key]?.completion;
            if (!c) return null;
            return (
              <div className={`progress-card ${subject.key}`} key={subject.key}>
                <div className="progress-header">
                  <span className="progress-label">{subject.icon} {subject.label}</span>
                  <span className="progress-percentage">{c.percentage}%</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${c.percentage}%` }}></div>
                </div>
                <div className="progress-footer">
                  <span>{c.completed_lessons} הושלמו</span>
                  <span>{c.total_lessons - c.completed_lessons} נותרו</span>
                </div>
              </div>
            );
          })}
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
                    <div className="activity-title">
                      {activity.subject && (
                        <span className={`subject-badge ${activity.subject}`}>{SUBJECT_LABELS[activity.subject]}</span>
                      )}
                      {activity.title_he}
                    </div>
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
