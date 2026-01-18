import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import unseenService from '../../services/unseenService';
import UnseenQuestion from './UnseenQuestion';
import HardWordsPopup from './HardWordsPopup';
import './UnseenReadingPage.css';

const UnseenReadingPage = () => {
  const { paragraphId } = useParams();
  const navigate = useNavigate();

  const [paragraph, setParagraph] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [session, setSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [showHardWords, setShowHardWords] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [checkingAnswer, setCheckingAnswer] = useState(false);

  useEffect(() => {
    loadParagraphAndStartSession();
  }, [paragraphId]);

  const loadParagraphAndStartSession = async () => {
    try {
      setLoading(true);
      setError('');

      // Get paragraph data
      const paragraphData = await unseenService.getParagraphById(paragraphId);
      const para = paragraphData.data?.paragraph || paragraphData.paragraph;
      const qs = paragraphData.data?.questions || paragraphData.questions;

      setParagraph(para);
      setQuestions(qs);

      // Start session
      const sessionData = await unseenService.startSession(paragraphId);
      const sess = sessionData.data?.session || sessionData.session;
      setSession(sess);

      setLoading(false);
    } catch (err) {
      console.error('Failed to load paragraph:', err);
      setError('שגיאה בטעינת הפסקה');
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers({
      ...answers,
      [questionId]: answerIndex
    });
  };

  const handleCheckAnswer = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const userAnswer = answers[currentQuestion.id];

    if (userAnswer === undefined) {
      return;
    }

    try {
      setCheckingAnswer(true);
      setError('');

      // Submit the answer
      await unseenService.submitAnswer(session.id, currentQuestion.id, userAnswer);

      // Get the correct answer and check if user was correct
      const isCorrect = userAnswer === currentQuestion.correct_answer;

      // Set feedback with explanation
      setFeedback({
        ...feedback,
        [currentQuestion.id]: {
          isCorrect,
          correctAnswer: currentQuestion.correct_answer,
          explanation: currentQuestion.explanation ||
            (isCorrect
              ? 'כל הכבוד! התשובה נכונה.'
              : `התשובה הנכונה היא: ${currentQuestion.options[currentQuestion.correct_answer]}`)
        }
      });

      setCheckingAnswer(false);
    } catch (err) {
      console.error('Failed to check answer:', err);
      setError('שגיאה בבדיקת התשובה');
      setCheckingAnswer(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // If it's the last question, submit the quiz
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if all questions have feedback (meaning they've been answered and checked)
    const uncheckedCount = questions.filter(q => !feedback[q.id]).length;

    if (uncheckedCount > 0) {
      if (!window.confirm(`יש לך ${uncheckedCount} שאלות שלא נבדקו. להמשיך בכל זאת?`)) {
        return;
      }
    }

    try {
      setSubmitting(true);
      setError('');

      // Submit any remaining unanswered questions
      for (const question of questions) {
        const userAnswer = answers[question.id];
        if (userAnswer !== undefined && !feedback[question.id]) {
          await unseenService.submitAnswer(session.id, question.id, userAnswer);
        }
      }

      // Complete session
      const result = await unseenService.completeSession(session.id);
      const completedSession = result.data?.session || result.session;

      // Navigate to results
      navigate(`/unseen/results/${session.id}`);
    } catch (err) {
      console.error('Failed to submit answers:', err);
      setError('שגיאה בשליחת התשובות');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="unseen-reading-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>טוען פסקה...</p>
        </div>
      </div>
    );
  }

  if (error || !paragraph || !session) {
    return (
      <div className="unseen-reading-page">
        <div className="error-container">
          <p>{error || 'שגיאה בטעינת הפסקה'}</p>
          <button onClick={() => navigate('/unseen')} className="back-button">
            חזרה לרשימת הפסקאות
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const checkedCount = Object.keys(feedback).length;

  return (
    <div className="unseen-reading-page">
      <div className="reading-container">
        {/* Header */}
        <div className="reading-header">
          <button onClick={() => navigate('/unseen')} className="back-btn">
            ← חזרה
          </button>
          <h1 className="reading-title">{paragraph.title_en}</h1>
          {paragraph.title_he && (
            <p className="reading-title-he">{paragraph.title_he}</p>
          )}
        </div>

        {/* Paragraph Content */}
        <div className="paragraph-content" dir="ltr">
          <div className="content-text">
            {paragraph.content.split('\n\n').map((para, index) => (
              <p key={index}>{para}</p>
            ))}
          </div>

          {/* Hard Words Button */}
          {paragraph.hard_words && paragraph.hard_words.length > 0 && (
            <button
              className="hard-words-btn"
              onClick={() => setShowHardWords(true)}
            >
              📖 תרגום מילים קשות
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-text">
            שאלה {currentQuestionIndex + 1} מתוך {questions.length} |
            נבדקו: {checkedCount}/{questions.length}
          </div>
        </div>

        {/* Question Section */}
        {currentQuestion && (
          <UnseenQuestion
            question={currentQuestion}
            selectedAnswer={answers[currentQuestion.id]}
            onAnswerSelect={(answerIndex) => handleAnswerSelect(currentQuestion.id, answerIndex)}
            feedback={feedback[currentQuestion.id]}
            onSubmit={handleCheckAnswer}
            onNext={handleNext}
          />
        )}

        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="nav-btn prev-btn"
          >
            ← שאלה קודמת
          </button>

          {!feedback[currentQuestion.id] ? (
            <button
              onClick={handleCheckAnswer}
              disabled={checkingAnswer || answers[currentQuestion.id] === undefined}
              className="nav-btn check-btn"
            >
              {checkingAnswer ? 'בודק...' : 'בדוק תשובה (Enter)'}
            </button>
          ) : currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="nav-btn next-btn"
            >
              שאלה הבאה → (Enter)
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="nav-btn submit-btn"
            >
              {submitting ? 'שולח...' : 'סיום ומעבר לתוצאות (Enter)'}
            </button>
          )}
        </div>

        {/* Question Navigation Dots */}
        <div className="question-dots">
          {questions.map((q, index) => (
            <button
              key={q.id}
              className={`dot ${index === currentQuestionIndex ? 'active' : ''} ${feedback[q.id] ? 'answered' : ''}`}
              onClick={() => setCurrentQuestionIndex(index)}
              title={`שאלה ${index + 1}${feedback[q.id] ? ' - נבדקה' : ''}`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>

      {/* Hard Words Popup */}
      {showHardWords && (
        <HardWordsPopup
          hardWords={paragraph.hard_words}
          onClose={() => setShowHardWords(false)}
        />
      )}
    </div>
  );
};

export default UnseenReadingPage;
