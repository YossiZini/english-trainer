import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import unseenService from '../../services/unseenService';
import './UnseenResults.css';

const UnseenResults = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadResults();
  }, [sessionId]);

  const loadResults = async () => {
    try {
      setLoading(true);
      const resultsData = await unseenService.getSessionResults(sessionId);
      const sess = resultsData.data?.session || resultsData.session;
      const ans = resultsData.data?.answers || resultsData.answers;

      setSession(sess);
      setAnswers(ans);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load results:', err);
      setError('שגיאה בטעינת התוצאות');
      setLoading(false);
    }
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return { text: '🏆 מצוין! ביצוע מושלם!', color: 'excellent' };
    if (score >= 80) return { text: '⭐ כל הכבוד! ביצוע נהדר!', color: 'great' };
    if (score >= 70) return { text: '✅ יופי! ביצוע טוב!', color: 'good' };
    if (score >= 60) return { text: '📖 לא רע, אבל יש מקום לשיפור', color: 'okay' };
    return { text: '💪 אל תוותר! נסה שוב', color: 'needs-work' };
  };

  const handleRetry = () => {
    if (session) {
      navigate(`/unseen/reading/${session.paragraph_id}`);
    }
  };

  const handleBackToList = () => {
    navigate('/unseen');
  };

  if (loading) {
    return (
      <div className="unseen-results">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>טוען תוצאות...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="unseen-results">
        <div className="error-container">
          <p>{error || 'שגיאה בטעינת התוצאות'}</p>
          <button onClick={handleBackToList} className="back-button">
            חזרה לרשימת הפסקאות
          </button>
        </div>
      </div>
    );
  }

  const scoreMessage = getScoreMessage(session.score);
  const correctCount = session.correct_answers;
  const totalCount = session.total_questions;

  return (
    <div className="unseen-results">
      <div className="results-container">
        {/* Score Card */}
        <div className={`score-card ${scoreMessage.color}`}>
          <div className="score-icon">{scoreMessage.text.split(' ')[0]}</div>
          <div className="score-value">{session.score}%</div>
          <div className="score-message">{scoreMessage.text}</div>
          <div className="score-details">
            ענית נכון על {correctCount} מתוך {totalCount} שאלות
          </div>
        </div>

        {/* Paragraph Info */}
        <div className="paragraph-info">
          <h2>{session.title_en}</h2>
          {session.title_he && <p>{session.title_he}</p>}
        </div>

        {/* Answers Review */}
        <div className="answers-review">
          <h3>סקירת התשובות</h3>
          <div className="answers-list">
            {answers.map((answer) => (
              <div
                key={answer.id}
                className={`answer-item ${answer.is_correct ? 'correct' : 'incorrect'}`}
              >
                <div className="answer-header">
                  <div className="answer-number">
                    {answer.is_correct ? '✓' : '✗'} שאלה {answer.question_number}
                  </div>
                  <div className={`answer-status ${answer.is_correct ? 'correct' : 'incorrect'}`}>
                    {answer.is_correct ? 'נכון' : 'שגוי'}
                  </div>
                </div>

                <div className="answer-question" dir="ltr">
                  {answer.question_text_en}
                </div>

                {answer.question_text_he && (
                  <div className="answer-question-he">
                    {answer.question_text_he}
                  </div>
                )}

                <div className="answer-details">
                  {!answer.is_correct && (
                    <>
                      <div className="user-answer">
                        <strong>תשובתך:</strong> <span dir="ltr">{answer.options[answer.user_answer]}</span>
                      </div>
                      <div className="correct-answer">
                        <strong>תשובה נכונה:</strong> <span dir="ltr">{answer.options[answer.correct_answer]}</span>
                      </div>
                    </>
                  )}

                  {answer.explanation_he && (
                    <div className="explanation">
                      <strong>הסבר:</strong> {answer.explanation_he}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={handleRetry} className="retry-btn">
            נסה שוב
          </button>
          <button onClick={handleBackToList} className="back-btn">
            חזרה לרשימת הפסקאות
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnseenResults;
