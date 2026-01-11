import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mistakesService from '../../services/mistakesService';
import exerciseService from '../../services/exerciseService';
import MultipleChoice from './MultipleChoice';
import FillInBlank from './FillInBlank';
import './ExercisePage.css';

const CrossTestPage = () => {
  const navigate = useNavigate();

  const [exercises, setExercises] = useState([]);
  const [testInfo, setTestInfo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime] = useState(Date.now());
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRecap, setShowRecap] = useState(true);
  const [topicsWithTheory, setTopicsWithTheory] = useState([]);

  useEffect(() => {
    loadCrossTest();
  }, []);

  // Handle Enter key press to submit answer or navigate
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        // If on recap page, start the test
        if (showRecap) {
          setShowRecap(false);
          return;
        }

        // Exercise page logic
        if (exercises.length > 0) {
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
              handleSubmit();
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [showRecap, exercises, currentIndex, userAnswers, feedback, isSubmitting]);

  const loadCrossTest = async () => {
    try {
      setLoading(true);
      const data = await mistakesService.getCrossTopicTest(20);
      setExercises(data.exercises || []);
      setTestInfo(data);
      setTopicsWithTheory(data.topicsWithTheory || []);
      // Only show recap if there are topics with theory
      setShowRecap(data.topicsWithTheory && data.topicsWithTheory.length > 0);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load cross-topic test:', err);
      setError('שגיאה בטעינת המבחן המשולב');
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
      // Calculate results locally
      const totalQuestions = exercises.length;
      let correctAnswers = 0;
      const results = [];

      for (const exercise of exercises) {
        const feedbackItem = feedback[exercise.id];
        if (feedbackItem && feedbackItem.isCorrect) {
          correctAnswers++;
        }
        results.push({
          exercise,
          userAnswer: userAnswers[exercise.id] || '',
          feedback: feedbackItem
        });
      }

      const score = Math.round((correctAnswers / totalQuestions) * 100);
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);

      // Navigate to results page with cross-test results
      navigate('/cross-test/results', {
        state: {
          score,
          correctAnswers,
          totalQuestions,
          timeSpent,
          results,
          mistakeCount: testInfo?.mistakeCount || 0
        }
      });
    } catch (err) {
      console.error('Failed to submit cross-test:', err);
      alert('שגיאה בשליחת המבחן');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="exercise-page">
        <div className="loading">טוען מבחן משולב...</div>
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
        <div className="no-exercises">
          <p>אין מספיק שאלות זמינות למבחן משולב</p>
          <p>נסה לתרגל יותר נושאים כדי לצבור שאלות</p>
          <button onClick={() => navigate('/topics')} className="btn-primary">
            חזור לנושאים
          </button>
        </div>
      </div>
    );
  }

  // Show recap page before test if there are topics with theory
  if (showRecap && topicsWithTheory.length > 0) {
    return (
      <div className="exercise-page">
        <div className="exercise-container">
          <div className="recap-container">
            <div className="recap-header">
              <h1>📚 חזרה על החומר</h1>
              <p className="recap-subtitle">
                לפני שמתחילים, בוא נחזור על הנושאים שהיו לך בהם טעויות
              </p>
            </div>

            <div className="recap-topics">
              {topicsWithTheory.map((topic, index) => (
                <div key={topic.lessonId} className="recap-topic-card">
                  <div className="topic-card-header">
                    <span className="topic-number">{index + 1}</span>
                    <div className="topic-titles">
                      <h3>{topic.titleHe}</h3>
                      <span className="topic-title-en">{topic.titleEn}</span>
                    </div>
                    <div className="mistake-badge">
                      {topic.uncorrectedCount > 0
                        ? `${topic.uncorrectedCount} טעויות לתיקון`
                        : `${topic.mistakeCount} טעויות קודמות`
                      }
                    </div>
                  </div>

                  <div className="topic-card-content">
                    {topic.theorySummary && (
                      <div className="summary-content">
                        {topic.theorySummary.content.split('\n').map((line, idx) => {
                          // Replace **text** with bold
                          const parts = line.split(/(\*\*.*?\*\*)/g);
                          return (
                            <div key={idx} style={{ marginBottom: line.trim() === '' ? '0.5rem' : '0.2rem' }}>
                              {parts.map((part, i) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                  return <strong key={i}>{part.slice(2, -2)}</strong>;
                                }
                                return <span key={i}>{part}</span>;
                              })}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <button
                    className="btn-learn-more"
                    onClick={() => navigate(`/learn/${topic.lessonId}`)}
                  >
                    לשיעור המלא →
                  </button>
                </div>
              ))}
            </div>

            <div className="recap-actions">
              <button
                className="btn-start-test"
                onClick={() => setShowRecap(false)}
              >
                מוכן! להתחיל מבחן
              </button>
              <p className="keyboard-hint">לחץ Enter להתחלה</p>
            </div>
          </div>
        </div>
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
            <span onClick={() => navigate('/dashboard')} className="breadcrumb-link">
              דשבורד
            </span>
            <span className="breadcrumb-separator"> &gt; </span>
            <span className="breadcrumb-current">מבחן משולב</span>
          </div>

          <h1 className="exercise-title">
            🎯 מבחן משולב - שאלות מכל הנושאים
          </h1>
          <div className="cross-test-badge">
            {testInfo?.mistakeCount > 0 && (
              <span>🔄 כולל {testInfo.mistakeCount} טעויות קודמות</span>
            )}
          </div>

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
            <div className="question-header">
              <div className="question-number">שאלה {currentExercise.question_number}</div>
              {currentExercise.lesson_title && (
                <div className="question-topic">
                  📚 {currentExercise.lesson_title}
                </div>
              )}
            </div>

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
                title={`שאלה ${idx + 1}${ex.lesson_title ? ' - ' + ex.lesson_title : ''}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossTestPage;
