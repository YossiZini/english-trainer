import React from 'react';

/**
 * Previous / Check / Next-or-Submit buttons and the question dots, pinned to
 * the bottom of the viewport (see .exercise-actionbar in ExercisePage.css).
 * Shared by ExercisePage and CrossTestPage.
 */
const ExerciseActionBar = ({
  exercises,
  currentIndex,
  userAnswers,
  feedback,
  currentAnswer,
  currentFeedback,
  isSubmitting,
  onPrevious,
  onCheck,
  onNext,
  onSubmit,
  onSelect,
  dotTitle
}) => (
  <div className="exercise-actionbar">
    <div className="exercise-actionbar-inner">
      <div className="exercise-navigation">
        <button
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="nav-button prev-button"
        >
          ← שאלה קודמת
        </button>

        {!currentFeedback && (
          <button
            onClick={onCheck}
            className="check-button"
            disabled={!currentAnswer}
          >
            בדוק תשובה
          </button>
        )}

        {currentIndex < exercises.length - 1 ? (
          <button
            onClick={onNext}
            className="nav-button next-button"
          >
            שאלה הבאה →
          </button>
        ) : (
          <button
            onClick={onSubmit}
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'שולח...' : 'סיים ושלח'}
          </button>
        )}
      </div>

      <div className="question-dots">
        {exercises.map((ex, idx) => (
          <div
            key={ex.id}
            className={`question-dot ${idx === currentIndex ? 'active' : ''} ${
              userAnswers[ex.id] ? 'answered' : ''
            } ${feedback[ex.id]?.isCorrect ? 'correct' : ''} ${
              feedback[ex.id] && !feedback[ex.id].isCorrect ? 'incorrect' : ''
            }`}
            onClick={() => onSelect(idx)}
            title={dotTitle ? dotTitle(ex, idx) : `שאלה ${idx + 1}`}
          ></div>
        ))}
      </div>
    </div>
  </div>
);

export default ExerciseActionBar;
