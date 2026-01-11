import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import lessonService from '../../services/lessonService';
import exerciseService from '../../services/exerciseService';
import mistakesService from '../../services/mistakesService';
import MultipleChoice from './MultipleChoice';
import FillInBlank from './FillInBlank';
import './ExercisePage.css';

const ExercisePage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if in retry mode and get difficulty level
  const searchParams = new URLSearchParams(location.search);
  const isRetryMode = searchParams.get('mode') === 'retry';
  const selectedDifficulty = searchParams.get('difficulty');

  const [lesson, setLesson] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [currentDifficulty, setCurrentDifficulty] = useState('easy');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime] = useState(Date.now());
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadExercises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, isRetryMode]);

  // Handle Enter key press to submit answer or navigate
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter' && exercises.length > 0) {
        const currentExercise = exercises[currentIndex];
        const currentAnswer = userAnswers[currentExercise?.id];
        const currentFeedback = feedback[currentExercise?.id];

        // If no feedback yet and answer exists - check the answer
        if (currentAnswer && !currentFeedback) {
          handleCheckAnswer();
        }
        // If feedback exists - move to next question or submit
        else if (currentFeedback) {
          if (currentIndex < exercises.length - 1) {
            handleNext();
          } else {
            // Last question - submit the form
            handleSubmit();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercises, currentIndex, userAnswers, feedback, isSubmitting]);

  const loadExercises = async () => {
    try {
      setLoading(true);
      const lessonData = await lessonService.getLessonById(lessonId);
      setLesson(lessonData);

      // Load exercises based on mode
      let exercisesData;
      if (isRetryMode) {
        exercisesData = await mistakesService.getExercisesForRetry(lessonId);
      } else {
        exercisesData = await lessonService.getExercises(lessonId, selectedDifficulty);
      }

      setExercises(exercisesData.exercises || exercisesData);
      if (exercisesData.currentDifficulty) {
        setCurrentDifficulty(exercisesData.currentDifficulty);
      }
      setLoading(false);
    } catch (err) {
      console.error('Failed to load exercises:', err);
      setError('שגיאה בטעינת התרגילים');
      setLoading(false);
    }
  };

  const handleAnswerChange = (exerciseId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [exerciseId]: answer
    }));
    // Clear feedback when user changes answer
    setFeedback(prev => ({
      ...prev,
      [exerciseId]: null
    }));
  };

  const handleCheckAnswer = async () => {
    const currentExercise = exercises[currentIndex];
    const userAnswer = userAnswers[currentExercise.id];

    if (!userAnswer || userAnswer.trim() === '') {
      alert('נא לבחור או להזין תשובה');
      return;
    }

    try {
      const result = await exerciseService.checkAnswer(currentExercise.id, userAnswer);
      setFeedback(prev => ({
        ...prev,
        [currentExercise.id]: result
      }));
    } catch (err) {
      console.error('Failed to check answer:', err);
      alert('שגיאה בבדיקת התשובה');
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unansweredCount = exercises.filter(ex => !userAnswers[ex.id]).length;

    if (unansweredCount > 0) {
      if (!window.confirm(`יש ${unansweredCount} שאלות שלא נענו. האם אתה בטוח שברצונך לשלוח?`)) {
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const answers = exercises.map(ex => ({
        exerciseId: ex.id,
        userAnswer: userAnswers[ex.id] || ''
      }));

      if (isRetryMode) {
        // Submit retry
        const result = await mistakesService.submitRetry(lessonId, answers);

        // Show retry results
        const message = `תיקנת ${result.correctedCount} טעויות!\n\nציון: ${result.score}%\nנכונות: ${result.correctAnswers}/${result.totalQuestions}`;

        if (result.hasMoreMistakes) {
          if (window.confirm(message + '\n\nיש עוד טעויות לתקן. האם תרצה לתרגל אותן עכשיו?')) {
            // Reload retry exercises
            setIsSubmitting(false);
            setCurrentIndex(0);
            setUserAnswers({});
            setFeedback({});
            loadExercises();
          } else {
            navigate(`/mistakes/review/${lessonId}`, {
              state: { lesson: { title_he: lesson?.title_he } }
            });
          }
        } else {
          alert(message + '\n\nכל הכבוד! תיקנת את כל הטעויות! 🎉');
          navigate(`/mistakes/review/${lessonId}`, {
            state: { lesson: { title_he: lesson?.title_he } }
          });
        }
      } else {
        // Regular exercise submission
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        const result = await exerciseService.submitExercise(lessonId, answers, timeSpent);

        // Navigate to results page
        navigate(`/results/${result.resultId}`, {
          state: {
            result,
            lessonTitle: lesson.title_he
          }
        });
      }
    } catch (err) {
      console.error('Failed to submit exercise:', err);
      alert('שגיאה בשליחת התרגיל');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="exercise-page">
        <div className="loading">טוען תרגילים...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="exercise-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!exercises || exercises.length === 0) {
    return (
      <div className="exercise-page">
        <div className="no-exercises">אין תרגילים זמינים לשיעור זה</div>
      </div>
    );
  }

  const currentExercise = exercises[currentIndex];
  const currentFeedback = feedback[currentExercise.id];
  const currentAnswer = userAnswers[currentExercise.id];
  const progress = ((currentIndex + 1) / exercises.length) * 100;

  return (
    <div className="exercise-page">
      <div className="exercise-container">
        {/* Header */}
        <div className="exercise-header">
          <div className="breadcrumb">
            <span onClick={() => navigate('/topics')} className="breadcrumb-link">
              נושאים
            </span>
            <span className="breadcrumb-separator"> &gt; </span>
            <span className="breadcrumb-current">{lesson?.title_he}</span>
          </div>

          <h1 className="exercise-title">
            {isRetryMode ? 'תיקון טעויות: ' : 'תרגול: '}
            {lesson?.title_he}
          </h1>
          {isRetryMode ? (
            <div className="retry-badge">
              🔄 מצב תיקון טעויות
            </div>
          ) : (
            <div className={`difficulty-badge difficulty-${currentDifficulty}`}>
              {currentDifficulty === 'easy' && '🌱 רמת מתחיל'}
              {currentDifficulty === 'medium' && '⚡ רמת ביניים'}
              {currentDifficulty === 'hard' && '🔥 רמה מתקדמת'}
            </div>
          )}

          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="progress-text">
              שאלה {currentIndex + 1} מתוך {exercises.length}
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="exercise-content">
          <div className="question-container">
            <div className="question-number">שאלה {currentExercise.question_number}</div>

            {currentExercise.type === 'multiple_choice' ? (
              <MultipleChoice
                question={currentExercise}
                selectedAnswer={currentAnswer}
                onAnswerChange={(answer) => handleAnswerChange(currentExercise.id, answer)}
                feedback={currentFeedback}
              />
            ) : (
              <FillInBlank
                question={currentExercise}
                userAnswer={currentAnswer || ''}
                onAnswerChange={(answer) => handleAnswerChange(currentExercise.id, answer)}
                feedback={currentFeedback}
              />
            )}

            {/* Feedback Display */}
            {currentFeedback && (
              <div className={`feedback ${currentFeedback.isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="feedback-icon">
                  {currentFeedback.isCorrect ? '✅' : '❌'}
                </div>
                <div className="feedback-content">
                  {currentFeedback.isCorrect ? (
                    <p className="feedback-message">כל הכבוד! התשובה נכונה!</p>
                  ) : (
                    <>
                      <p className="feedback-message">התשובה שגויה</p>
                      <p className="feedback-correct">התשובה הנכונה: {currentFeedback.correctAnswer}</p>
                    </>
                  )}
                  {currentFeedback.explanationHe && (
                    <p className="feedback-explanation">{currentFeedback.explanationHe}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="exercise-navigation">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="nav-button prev-button"
            >
              ← שאלה קודמת
            </button>

            {!currentFeedback && (
              <button
                onClick={handleCheckAnswer}
                className="check-button"
                disabled={!currentAnswer}
              >
                בדוק תשובה
              </button>
            )}

            {currentIndex < exercises.length - 1 ? (
              <button
                onClick={handleNext}
                className="nav-button next-button"
              >
                שאלה הבאה →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'שולח...' : 'סיים ושלח'}
              </button>
            )}
          </div>

          {/* Question Dots Indicator */}
          <div className="question-dots">
            {exercises.map((ex, idx) => (
              <div
                key={ex.id}
                className={`question-dot ${idx === currentIndex ? 'active' : ''} ${
                  userAnswers[ex.id] ? 'answered' : ''
                } ${feedback[ex.id]?.isCorrect ? 'correct' : ''} ${
                  feedback[ex.id] && !feedback[ex.id].isCorrect ? 'incorrect' : ''
                }`}
                onClick={() => setCurrentIndex(idx)}
                title={`שאלה ${idx + 1}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExercisePage;
