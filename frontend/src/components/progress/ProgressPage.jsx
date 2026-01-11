import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import progressService from '../../services/progressService';
import './ProgressPage.css';

const ProgressPage = () => {
  const navigate = useNavigate();

  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const data = await progressService.getProgress();
      setProgressData(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load progress:', err);
      setError('שגיאה בטעינת ההתקדמות');
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}ש ${minutes}ד`;
    }
    return `${minutes}ד`;
  };

  if (loading) {
    return (
      <div className="progress-page">
        <div className="loading">טוען נתונים...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="progress-page">
        <div className="error">{error}</div>
        <button onClick={() => navigate('/dashboard')} className="back-button">
          חזרה לדשבורד
        </button>
      </div>
    );
  }

  const { stats, completion, byTopic, allProgress } = progressData;

  return (
    <div className="progress-page">
      <div className="progress-container">
        {/* Header */}
        <div className="progress-header">
          <div className="breadcrumb">
            <span onClick={() => navigate('/dashboard')} className="breadcrumb-link">
              דשבורד
            </span>
            <span className="breadcrumb-separator"> &gt; </span>
            <span className="breadcrumb-current">התקדמות מפורטת</span>
          </div>

          <h1 className="progress-title">ההתקדמות שלך</h1>
        </div>

        {/* Overall Stats */}
        <div className="overall-stats">
          <div className="stat-box">
            <div className="stat-icon">📚</div>
            <div className="stat-info">
              <div className="stat-value">{completion.completed_lessons}</div>
              <div className="stat-label">שיעורים הושלמו</div>
              <div className="stat-subtext">מתוך {completion.total_lessons}</div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <div className="stat-value">{stats.average_score}%</div>
              <div className="stat-label">ציון ממוצע</div>
              <div className="stat-subtext">{stats.total_attempts} ניסיונות</div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon">⏱️</div>
            <div className="stat-info">
              <div className="stat-value">{formatTime(stats.total_time_spent)}</div>
              <div className="stat-label">זמן למידה</div>
              <div className="stat-subtext">סה"כ</div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <div className="stat-value">{completion.percentage}%</div>
              <div className="stat-label">השלמה כוללת</div>
              <div className="stat-subtext">מהתכנית</div>
            </div>
          </div>
        </div>

        {/* Progress by Topic */}
        <div className="topic-progress-section">
          <h2 className="section-title">התקדמות לפי נושא</h2>
          <div className="topics-list">
            {byTopic.map((topic) => (
              <div key={topic.topic_number} className="topic-card">
                <div className="topic-header">
                  <h3 className="topic-name">נושא {topic.topic_number}</h3>
                  <span className="topic-percentage">{topic.completion_percentage}%</span>
                </div>

                <div className="topic-progress-bar">
                  <div
                    className="topic-progress-fill"
                    style={{ width: `${topic.completion_percentage}%` }}
                  ></div>
                </div>

                <div className="topic-stats">
                  <div className="topic-stat">
                    <span className="topic-stat-icon">✅</span>
                    <span className="topic-stat-text">
                      {topic.completed_count} הושלמו
                    </span>
                  </div>
                  <div className="topic-stat">
                    <span className="topic-stat-icon">⏳</span>
                    <span className="topic-stat-text">
                      {topic.in_progress_count} בתהליך
                    </span>
                  </div>
                  <div className="topic-stat">
                    <span className="topic-stat-icon">📝</span>
                    <span className="topic-stat-text">
                      {topic.not_started_count} לא התחיל
                    </span>
                  </div>
                  <div className="topic-stat">
                    <span className="topic-stat-icon">📊</span>
                    <span className="topic-stat-text">
                      ממוצע: {topic.average_score}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Lessons Progress */}
        {allProgress && allProgress.length > 0 && (
          <div className="lessons-progress-section">
            <h2 className="section-title">כל השיעורים</h2>
            <div className="lessons-table">
              <div className="table-header">
                <div className="table-cell">שיעור</div>
                <div className="table-cell">סטטוס</div>
                <div className="table-cell">ציון מירבי</div>
                <div className="table-cell">ניסיונות</div>
                <div className="table-cell">זמן</div>
              </div>
              {allProgress.map((lesson) => (
                <div
                  key={lesson.id}
                  className={`table-row ${lesson.status}`}
                  onClick={() => navigate(`/learn/${lesson.lesson_id}`)}
                >
                  <div className="table-cell lesson-name">
                    <span className="lesson-number">{lesson.subtopic_number}</span>
                    {lesson.title_he}
                  </div>
                  <div className="table-cell">
                    <span className={`status-badge ${lesson.status}`}>
                      {lesson.status === 'completed' && '✅ הושלם'}
                      {lesson.status === 'in_progress' && '⏳ בתהליך'}
                      {lesson.status === 'not_started' && '📝 לא התחיל'}
                    </span>
                  </div>
                  <div className="table-cell">
                    <span className="score-badge">{lesson.best_score}%</span>
                  </div>
                  <div className="table-cell">{lesson.attempts}</div>
                  <div className="table-cell">{formatTime(lesson.time_spent)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="actions">
          <button onClick={() => navigate('/dashboard')} className="back-btn">
            חזרה לדשבורד
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
