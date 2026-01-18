import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import vocabularyService from '../../services/vocabularyService';
import VocabularyQuestion from './VocabularyQuestion';
import './VocabularyQuizPage.css';

const VocabularyQuizPage = () => {
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

      // Response is {success, data} from backend, vocabularyService returns response.data
      // which gives us the actual data object
      const data = response.data || response;

      if (data.quizComplete) {
        // Quiz is complete, navigate to results
        await completeQuiz();
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
      const response = await vocabularyService.submitAnswer(
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

  const completeQuiz = async () => {
    try {
      await vocabularyService.completeQuiz(sessionId);
      navigate(`/vocabulary/results/${sessionId}`);
    } catch (err) {
      console.error('Failed to complete quiz:', err);
      setError('שגיאה בסיום החידון');
    }
  };

  const getDifficultyLabel = (stage) => {
    switch (stage) {
      case 1: return 'קל (1-3)';
      case 2: return 'בינוני (3-5)';
      case 3: return 'קשה (5-10)';
      default: return 'רמה ' + stage;
    }
  };

  if (loading) {
    return (
      <div className="vocabulary-quiz-page">
        <div className="loading">טוען שאלה...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vocabulary-quiz-page">
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
    <div className="vocabulary-quiz-page">
      <div className="quiz-container">
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
            <div className="stat-badge difficulty">
              <span className="stat-label">רמת קושי:</span>
              <span className="stat-value">{getDifficultyLabel(question.currentStage)}</span>
            </div>

            <div className="stat-badge streak">
              <span className="stat-label">רצף נכונות:</span>
              <span className="stat-value">{question.consecutiveCorrect}/3 🔥</span>
            </div>

            <div className={`stat-badge fails ${question.accumulatedFails >= 8 ? 'warning' : ''}`}>
              <span className="stat-label">שגיאות נצברות:</span>
              <span className="stat-value">{question.accumulatedFails}/10</span>
            </div>
          </div>
        </div>

        {/* Stage Changed Notification */}
        {feedback && feedback.stageChanged && (
          <div className="stage-notification">
            <div className="notification-icon">🎉</div>
            <div className="notification-text">
              עלית לרמת קושי גבוהה יותר!
            </div>
          </div>
        )}

        {/* Question */}
        <VocabularyQuestion
          question={question}
          selectedAnswer={selectedAnswer}
          feedback={feedback}
          onAnswerSelect={handleAnswerSelect}
          disabled={isAnswering || feedback !== null}
        />
      </div>
    </div>
  );
};

export default VocabularyQuizPage;
