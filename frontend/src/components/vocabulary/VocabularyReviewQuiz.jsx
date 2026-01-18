import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import vocabularyService from '../../services/vocabularyService';
import VocabularyQuestion from './VocabularyQuestion';
import './VocabularyReviewQuiz.css';

const VocabularyReviewQuiz = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isAnswering, setIsAnswering] = useState(false);

  useEffect(() => {
    loadNextQuestion();
  }, [sessionId]);

  const loadNextQuestion = async () => {
    try {
      setLoading(true);
      setError('');
      setSelectedAnswer(null);
      setFeedback(null);
      setIsAnswering(false);

      const response = await vocabularyService.getNextQuestion(sessionId);
      const data = response.data || response;

      if (data.quizComplete) {
        // Quiz is complete, navigate to results
        await completeReview();
      } else {
        setQuestion(data);
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to load question:', err);
      setError('שגיאה בטעינת השאלה');
      setLoading(false);
    }
  };

  const handleAnswerSelect = async (answerId) => {
    if (isAnswering || feedback) return;

    setSelectedAnswer(answerId);
    setIsAnswering(true);

    try {
      const response = await vocabularyService.submitReviewAnswer(
        sessionId,
        question.word.id,
        answerId
      );

      const feedbackData = response.data || response;
      setFeedback(feedbackData);

      // Show feedback for 2 seconds before moving to next question
      setTimeout(() => {
        loadNextQuestion();
      }, 2000);
    } catch (err) {
      console.error('Failed to submit answer:', err);
      setError('שגיאה בשליחת התשובה');
      setIsAnswering(false);
    }
  };

  const completeReview = async () => {
    try {
      await vocabularyService.completeReview(sessionId);
      navigate(`/vocabulary/results/${sessionId}`);
    } catch (err) {
      console.error('Failed to complete review:', err);
      setError('שגיאה בסיום החידון');
    }
  };

  if (loading) {
    return (
      <div className="vocabulary-review-quiz">
        <div className="loading">טוען שאלה...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vocabulary-review-quiz">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/vocabulary')} className="btn-back">
          חזרה לדף הבית
        </button>
      </div>
    );
  }

  if (!question) {
    return null;
  }

  return (
    <div className="vocabulary-review-quiz">
      <div className="quiz-container">
        {/* Review Mode Badge */}
        <div className="review-mode-badge">
          <span className="badge-icon">🔄</span>
          <span className="badge-text">מצב חזרה - 2x נקודות</span>
        </div>

        {/* Header */}
        <div className="quiz-header">
          <div className="progress-info">
            <span className="question-counter">
              שאלה {question.questionNumber} מתוך {question.totalQuestions}
            </span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${(question.questionNumber / question.totalQuestions) * 100}%`
                }}
              />
            </div>
          </div>

          <div className="quiz-stats">
            <div className="stat-badge fails">
              <span className="stat-label">שגיאות שנותרו:</span>
              <span className="stat-value">{question.accumulatedFails}/10</span>
            </div>
          </div>
        </div>

        {/* Question */}
        <VocabularyQuestion
          question={question}
          selectedAnswer={selectedAnswer}
          feedback={feedback}
          onAnswerSelect={handleAnswerSelect}
          disabled={isAnswering || feedback !== null}
        />

        {/* Review Info */}
        <div className="review-info">
          <div className="info-icon">💡</div>
          <div className="info-text">
            כל תשובה נכונה מוריד שגיאה אחת מהספירה ומעניק 2 נקודות
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyReviewQuiz;
