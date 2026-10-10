import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../results/ResultsPage.css';
import MathText from '../common/MathText';
import Assessment from '../common/Assessment';
import { assessmentFor, fixedSummary } from '../../content/assessment';
import { metaOf } from '../../content/topicMeta';
import { textDirection } from '../../utils/bidi';

// Each question carries its subject, as in MultipleChoice: an English question
// reads by its first letter, the other subjects are written in Hebrew (RTL);
// answers are LTR (English words, math expressions) except Arabic ones, which
// also get the Arabic font.
const layoutOf = (exercise) => {
  const subject = exercise.subject || 'english';
  return {
    arabic: subject === 'arabic',
    questionDir: subject === 'english' ? textDirection(exercise.question_text_he) : 'rtl',
    answerDir: subject === 'arabic' ? 'rtl' : 'ltr'
  };
};

const CrossTestResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // `subject` (with fixed and waiting) marks a subject's mistakes exam; without it, the mixed test.
  const { correctAnswers, totalQuestions, timeSpent, results, mistakeCount, subject, fixed, waiting } = location.state || {};
  const meta = metaOf(subject);

  if (!location.state) {
    navigate('/dashboard');
    return null;
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
          <h1 className="results-title">{subject ? `תוצאות מבחן הטעויות – ${meta.title}` : 'תוצאות מבחן משולב'}</h1>
        </div>

        {/* Words instead of a score; a mistakes exam also says what it fixed */}
        <Assessment correct={correctAnswers} total={totalQuestions}>
          {subject && fixedSummary(fixed, waiting)}
        </Assessment>

        <div className="score-overview">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">✅</div>
              <div className="stat-value">{correctAnswers}</div>
              <div className="stat-label">נכונות</div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">💡</div>
              <div className="stat-value">{totalQuestions - correctAnswers}</div>
              <div className="stat-label">לחזרה</div>
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
              const words = assessmentFor(data.correct, data.total);
              return (
                <div key={topic} className="topic-card">
                  <div className="topic-header">
                    <h3 className="topic-name">📚 {topic}</h3>
                    <div className="topic-score">
                      {words.icon} {words.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mistakes Review */}
        {results && results.some(r => !r.feedback?.isCorrect) && (
          <div className="mistakes-section">
            <h2 className="section-title">שאלות לחזרה</h2>
            <div className="mistakes-list">
              {results
                .filter(r => !r.feedback?.isCorrect)
                .map((result, idx) => {
                  const layout = layoutOf(result.exercise);
                  return (
                    <div key={idx} className={`mistake-item${layout.arabic ? ' arabic' : ''}`}>
                      <div className="mistake-header">
                        <span className="mistake-topic">📚 {result.exercise.lesson_title}</span>
                        <span className="mistake-icon">💡</span>
                      </div>
                      <MathText as="div" className="mistake-question" dir={layout.questionDir} text={result.exercise.question_text_he} />
                      <div className="mistake-answers">
                        <div className="mistake-answer wrong">
                          <span className="answer-label">תשובתך:</span>
                          <MathText className="answer-value" dir={layout.answerDir} text={result.userAnswer || '(לא נענתה)'} />
                        </div>
                        <div className="mistake-answer correct">
                          <span className="answer-label">תשובה נכונה:</span>
                          <MathText className="answer-value" dir={layout.answerDir} text={result.feedback?.correctAnswer} />
                        </div>
                      </div>
                      {result.feedback?.explanationHe && (
                        <div className="mistake-explanation">
                          <strong>הסבר:</strong> <MathText text={result.feedback.explanationHe} />
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="results-actions">
          {subject ? (
            <>
              {waiting > 0 && (
                <button
                  className="action-button primary"
                  onClick={() => navigate(`/mistakes-exam/${subject}`)}
                >
                  🎯 לסיבוב הבא
                </button>
              )}
              <button
                className="action-button secondary"
                onClick={() => navigate(meta.route)}
              >
                📚 חזרה ל{meta.indexLabel}
              </button>
            </>
          ) : (
            <>
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
            </>
          )}

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
