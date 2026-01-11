import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import exerciseService from '../../services/exerciseService';
import './ResultsPage.css';

const ResultsPage = () => {
  const { resultId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [result, setResult] = useState(location.state?.result || null);
  const [lessonTitle, setLessonTitle] = useState(location.state?.lessonTitle || '');
  const [loading, setLoading] = useState(!result);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!result && resultId) {
      loadResult();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultId, result]);

  const loadResult = async () => {
    try {
      setLoading(true);
      const data = await exerciseService.getResult(resultId);
      setResult(data);
      setLessonTitle(data.title_he || '');
      setLoading(false);
    } catch (err) {
      console.error('Failed to load result:', err);
      setError('שגיאה בטעינת התוצאות');
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#28a745';
    if (score >= 70) return '#20c997';
    if (score >= 50) return '#ffc107';
    return '#dc3545';
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return 'מעולה! 🎉';
    if (score >= 70) return 'כל הכבוד! ✨';
    if (score >= 50) return 'יפה, אבל אפשר לשפר 💪';
    return 'כדאי לנסות שוב 📚';
  };

  if (loading) {
    return (
      <div className="results-page">
        <div className="loading">טוען תוצאות...</div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="results-page">
        <div className="error">{error || 'לא נמצאו תוצאות'}</div>
        <button onClick={() => navigate('/topics')} className="back-button">
          חזרה לנושאים
        </button>
      </div>
    );
  }

  const scoreColor = getScoreColor(result.score);
  const scoreMessage = getScoreMessage(result.score);
  const isPassed = result.isPassed || result.score >= 70;

  return (
    <div className="results-page">
      <div className="results-container">
        {/* Score Card */}
        <div className="score-card" style={{ borderColor: scoreColor }}>
          <div className="score-header">
            <h1 className="results-title">תוצאות התרגיל</h1>
            {lessonTitle && <p className="lesson-title">{lessonTitle}</p>}
          </div>

          <div className="score-circle" style={{ borderColor: scoreColor }}>
            <div className="score-value" style={{ color: scoreColor }}>
              {result.score}%
            </div>
            <div className="score-label">ציון</div>
          </div>

          <div className="score-message" style={{ color: scoreColor }}>
            {scoreMessage}
          </div>

          {isPassed ? (
            <div className="pass-badge">
              <span className="pass-icon">✅</span>
              <span className="pass-text">עברת בהצלחה!</span>
            </div>
          ) : (
            <div className="fail-badge">
              <span className="fail-icon">📚</span>
              <span className="fail-text">נדרש 70% לעבור</span>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="statistics">
          <div className="stat-card correct">
            <div className="stat-icon">✓</div>
            <div className="stat-value">{result.correctAnswers}</div>
            <div className="stat-label">תשובות נכונות</div>
          </div>

          <div className="stat-card wrong">
            <div className="stat-icon">✗</div>
            <div className="stat-value">{result.wrongAnswers}</div>
            <div className="stat-label">תשובות שגויות</div>
          </div>

          <div className="stat-card total">
            <div className="stat-icon">📝</div>
            <div className="stat-value">{result.totalQuestions}</div>
            <div className="stat-label">סך הכל שאלות</div>
          </div>

          <div className="stat-card time">
            <div className="stat-icon">⏱️</div>
            <div className="stat-value">{formatTime(result.timeSpent)}</div>
            <div className="stat-label">זמן</div>
          </div>
        </div>

        {/* Detailed Results */}
        {result.results && result.results.length > 0 && (
          <div className="detailed-results">
            <h2 className="section-title">תוצאות מפורטות</h2>
            <div className="results-list">
              {result.results.map((item, index) => (
                <div
                  key={index}
                  className={`result-item ${item.isCorrect ? 'correct' : 'incorrect'}`}
                >
                  <div className="result-number">
                    <span className="result-icon">
                      {item.isCorrect ? '✓' : '✗'}
                    </span>
                    שאלה {index + 1}
                  </div>
                  <div className="result-content">
                    <div className="result-row">
                      <span className="result-label">התשובה שלך:</span>
                      <span className="user-answer">{item.userAnswer || '(לא נענתה)'}</span>
                    </div>
                    {!item.isCorrect && (
                      <div className="result-row">
                        <span className="result-label">התשובה הנכונה:</span>
                        <span className="correct-answer">{item.correctAnswer}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            onClick={() => navigate('/topics')}
            className="action-button secondary"
          >
            חזרה לנושאים
          </button>

          {result.wrongAnswers > 0 && (
            <button
              onClick={() => navigate(`/mistakes/review/${result.lessonId}`, {
                state: { lesson: { title_he: lessonTitle } }
              })}
              className="action-button review"
            >
              סקור טעויות ({result.wrongAnswers})
            </button>
          )}

          {!isPassed && (
            <button
              onClick={() => navigate(`/exercise/${result.lessonId}`)}
              className="action-button retry"
            >
              נסה שוב
            </button>
          )}

          {isPassed && result.nextLesson && (
            <button
              onClick={() => navigate(`/learn/${result.nextLesson.id}`)}
              className="action-button primary"
            >
              המשך לשיעור הבא: {result.nextLesson.title_he}
            </button>
          )}

          {isPassed && !result.nextLesson && (
            <div className="completion-message">
              🎓 סיימת את כל השיעורים הזמינים! כל הכבוד! 🎓
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
