import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../results/ResultsPage.css';

const CrossTestResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { score, correctAnswers, totalQuestions, timeSpent, results, mistakeCount } = location.state || {};

  if (!location.state) {
    navigate('/dashboard');
    return null;
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getScoreEmoji = (score) => {
    if (score >= 90) return '🌟';
    if (score >= 80) return '🎉';
    if (score >= 70) return '👍';
    if (score >= 60) return '📚';
    return '💪';
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return 'מצוין! עבודה נהדרת!';
    if (score >= 80) return 'יפה מאוד! כל הכבוד!';
    if (score >= 70) return 'טוב! תמשיך כך!';
    if (score >= 60) return 'לא רע! תמשיך להתאמן!';
    return 'תמשיך להתאמן ותשתפר!';
  };

  // Group results by topic
  const resultsByTopic = {};
  if (results) {
    results.forEach(result => {
      const topic = result.exercise.lesson_title || 'אחר';
      if (!resultsByTopic[topic]) {
        resultsByTopic[topic] = {
          correct: 0,
          total: 0,
          exercises: []
        };
      }
      resultsByTopic[topic].total++;
      if (result.feedback?.isCorrect) {
        resultsByTopic[topic].correct++;
      }
      resultsByTopic[topic].exercises.push(result);
    });
  }

  return (
    <div className="results-page">
      <div className="results-container">
        {/* Header */}
        <div className="results-header">
          <h1 className="results-title">
            {getScoreEmoji(score)} תוצאות מבחן משולב
          </h1>
          <p className="results-subtitle">{getScoreMessage(score)}</p>
        </div>

        {/* Score Overview */}
        <div className="score-overview">
          <div className="score-circle">
            <div className="score-value">{score}%</div>
            <div className="score-label">ציון סופי</div>
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">✅</div>
              <div className="stat-value">{correctAnswers}</div>
              <div className="stat-label">נכונות</div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">❌</div>
              <div className="stat-value">{totalQuestions - correctAnswers}</div>
              <div className="stat-label">שגויות</div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">📝</div>
              <div className="stat-value">{totalQuestions}</div>
              <div className="stat-label">סה״כ שאלות</div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">⏱️</div>
              <div className="stat-value">{formatTime(timeSpent)}</div>
              <div className="stat-label">זמן</div>
            </div>
          </div>

          {mistakeCount > 0 && (
            <div className="mistakes-info">
              <span className="mistakes-icon">🔄</span>
              <span>המבחן כלל {mistakeCount} טעויות קודמות</span>
            </div>
          )}
        </div>

        {/* Results by Topic */}
        <div className="topic-breakdown">
          <h2 className="section-title">פירוט לפי נושאים</h2>
          <div className="topic-cards">
            {Object.entries(resultsByTopic).map(([topic, data]) => {
              const topicScore = Math.round((data.correct / data.total) * 100);
              return (
                <div key={topic} className="topic-card">
                  <div className="topic-header">
                    <h3 className="topic-name">📚 {topic}</h3>
                    <div className="topic-score">
                      {topicScore}% ({data.correct}/{data.total})
                    </div>
                  </div>
                  <div className="topic-progress-bar">
                    <div
                      className="topic-progress-fill"
                      style={{
                        width: `${topicScore}%`,
                        backgroundColor: topicScore >= 70 ? '#22c55e' : topicScore >= 50 ? '#f59e0b' : '#ef4444'
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mistakes Review */}
        {results && results.some(r => !r.feedback?.isCorrect) && (
          <div className="mistakes-section">
            <h2 className="section-title">שאלות שנענו בצורה שגויה</h2>
            <div className="mistakes-list">
              {results
                .filter(r => !r.feedback?.isCorrect)
                .map((result, idx) => (
                  <div key={idx} className="mistake-item">
                    <div className="mistake-header">
                      <span className="mistake-topic">📚 {result.exercise.lesson_title}</span>
                      <span className="mistake-icon">❌</span>
                    </div>
                    <div className="mistake-question" dir="ltr">{result.exercise.question_text_he}</div>
                    <div className="mistake-answers">
                      <div className="mistake-answer wrong">
                        <span className="answer-label">תשובתך:</span>
                        <span className="answer-value" dir="ltr">{result.userAnswer || '(לא נענתה)'}</span>
                      </div>
                      <div className="mistake-answer correct">
                        <span className="answer-label">תשובה נכונה:</span>
                        <span className="answer-value" dir="ltr">{result.feedback?.correctAnswer}</span>
                      </div>
                    </div>
                    {result.feedback?.explanationHe && (
                      <div className="mistake-explanation">
                        <strong>הסבר:</strong> {result.feedback.explanationHe}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="results-actions">
          <button
            className="action-button primary"
            onClick={() => navigate('/cross-test')}
          >
            🔄 נסה שוב
          </button>

          <button
            className="action-button secondary"
            onClick={() => navigate('/topics')}
          >
            📚 חזור לנושאים
          </button>

          <button
            className="action-button secondary"
            onClick={() => navigate('/dashboard')}
          >
            🏠 דשבורד
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrossTestResultsPage;
