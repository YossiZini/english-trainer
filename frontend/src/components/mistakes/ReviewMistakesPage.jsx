import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import mistakesService from '../../services/mistakesService';
import lessonService from '../../services/lessonService';
import './ReviewMistakesPage.css';

const ReviewMistakesPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [lesson, setLesson] = useState(location.state?.lesson || null);
  const [mistakes, setMistakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMistakes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const loadMistakes = async () => {
    try {
      setLoading(true);

      // Load lesson if not provided
      if (!lesson) {
        const lessonData = await lessonService.getLessonById(lessonId);
        setLesson(lessonData);
      }

      // Load mistakes
      const mistakesData = await mistakesService.getMistakesByLesson(lessonId, false);
      setMistakes(mistakesData);

      // Mark as reviewed
      if (mistakesData.length > 0) {
        await mistakesService.markAsReviewed(lessonId);
      }

      setLoading(false);
    } catch (err) {
      console.error('Failed to load mistakes:', err);
      setError('שגיאה בטעינת הטעויות');
      setLoading(false);
    }
  };

  const handleRetryMistakes = () => {
    navigate(`/exercise/${lessonId}?mode=retry`, {
      state: { lessonTitle: lesson?.title_he }
    });
  };

  if (loading) {
    return (
      <div className="review-mistakes-page">
        <div className="loading">טוען טעויות...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="review-mistakes-page">
        <div className="error">{error}</div>
        <button onClick={() => navigate('/topics')} className="back-button">
          חזרה לנושאים
        </button>
      </div>
    );
  }

  if (mistakes.length === 0) {
    return (
      <div className="review-mistakes-page">
        <div className="no-mistakes">
          <div className="success-icon">🎉</div>
          <h2>כל הכבוד!</h2>
          <p>אין טעויות לשיעור זה</p>
          <button onClick={() => navigate('/topics')} className="back-button">
            חזרה לנושאים
          </button>
        </div>
      </div>
    );
  }

  const uncorrectedCount = mistakes.filter(m => !m.is_corrected).length;
  const correctedCount = mistakes.filter(m => m.is_corrected).length;

  return (
    <div className="review-mistakes-page">
      <div className="review-container">
        {/* Header */}
        <div className="review-header">
          <div className="breadcrumb">
            <span onClick={() => navigate('/topics')} className="breadcrumb-link">
              נושאים
            </span>
            <span className="breadcrumb-separator"> &gt; </span>
            <span className="breadcrumb-current">סקירת טעויות</span>
          </div>

          <h1 className="review-title">סקירת טעויות</h1>
          {lesson && <p className="lesson-title">{lesson.title_he}</p>}

          {/* Statistics */}
          <div className="mistakes-stats">
            <div className="stat-badge total">
              <span className="stat-value">{mistakes.length}</span>
              <span className="stat-label">סה״כ טעויות</span>
            </div>
            <div className="stat-badge uncorrected">
              <span className="stat-value">{uncorrectedCount}</span>
              <span className="stat-label">לא תוקנו</span>
            </div>
            <div className="stat-badge corrected">
              <span className="stat-value">{correctedCount}</span>
              <span className="stat-label">תוקנו</span>
            </div>
          </div>
        </div>

        {/* Mistakes List */}
        <div className="mistakes-list">
          {mistakes.map((mistake, index) => (
            <div
              key={mistake.id}
              className={`mistake-card ${mistake.is_corrected ? 'corrected' : 'uncorrected'}`}
            >
              <div className="mistake-header">
                <div className="mistake-number">
                  <span className="question-icon">
                    {mistake.is_corrected ? '✅' : '❌'}
                  </span>
                  שאלה {mistake.question_number}
                </div>
                {mistake.is_corrected && (
                  <div className="corrected-badge">תוקן</div>
                )}
              </div>

              <div className="mistake-content">
                <div className="question-text">{mistake.question_text_he}</div>

                {mistake.type === 'multiple_choice' && mistake.options && (
                  <div className="options-display">
                    {JSON.parse(mistake.options).map((option, idx) => (
                      <div
                        key={idx}
                        className={`option-item ${
                          option === mistake.user_answer ? 'wrong-choice' : ''
                        } ${
                          option === mistake.correct_answer ? 'correct-choice' : ''
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}

                <div className="answers-section">
                  <div className="answer-row wrong-answer">
                    <span className="answer-label">התשובה שלך:</span>
                    <span className="answer-value">{mistake.user_answer}</span>
                  </div>

                  <div className="answer-row correct-answer">
                    <span className="answer-label">התשובה הנכונה:</span>
                    <span className="answer-value">{mistake.correct_answer}</span>
                  </div>
                </div>

                {mistake.explanation_he && (
                  <div className="explanation">
                    <div className="explanation-header">💡 הסבר:</div>
                    <div className="explanation-text">{mistake.explanation_he}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            onClick={() => navigate('/topics')}
            className="action-button secondary"
          >
            חזרה לנושאים
          </button>

          {uncorrectedCount > 0 && (
            <button
              onClick={handleRetryMistakes}
              className="action-button retry"
            >
              תרגל את הטעויות ({uncorrectedCount})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewMistakesPage;
