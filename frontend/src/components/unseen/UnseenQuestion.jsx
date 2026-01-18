import React, { useState, useEffect } from 'react';
import './UnseenQuestion.css';

const UnseenQuestion = ({ question, selectedAnswer, onAnswerSelect, feedback, onSubmit, onNext }) => {
  const [hoveredOption, setHoveredOption] = useState(null);
  const [showHebrewTranslation, setShowHebrewTranslation] = useState(false);

  const options = question?.options || [];

  // Reset Hebrew translation visibility when question changes
  useEffect(() => {
    setShowHebrewTranslation(false);
  }, [question?.id]);

  // Auto-select first option when question loads (if no answer selected yet)
  useEffect(() => {
    if (question && selectedAnswer === undefined && !feedback && options.length > 0) {
      onAnswerSelect(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.id]);

  // Handle arrow key navigation and Enter to submit/next
  useEffect(() => {
    if (!question) return;

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        // Don't allow arrow navigation if feedback is shown
        if (feedback) return;

        event.preventDefault();

        const currentIndex = selectedAnswer !== undefined ? selectedAnswer : 0;
        let newIndex;

        if (event.key === 'ArrowUp') {
          // Move up (previous option)
          newIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
        } else {
          // Move down (next option)
          newIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
        }

        onAnswerSelect(newIndex);
      } else if (event.key === 'Enter') {
        event.preventDefault();

        if (feedback) {
          // If feedback is shown, move to next question
          if (onNext) {
            onNext();
          }
        } else {
          // If no feedback, submit the answer
          if (selectedAnswer !== undefined && onSubmit) {
            onSubmit();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question, selectedAnswer, options, feedback, onAnswerSelect, onSubmit, onNext]);

  if (!question) return null;

  const handleOptionClick = (index) => {
    // Don't allow changing answer after feedback is shown
    if (feedback) return;
    onAnswerSelect(index);
  };

  return (
    <div className="unseen-question">
      <div className="question-header">
        <div className="question-number">שאלה {question.question_number}</div>
      </div>

      <div className="question-text-section">
        <p className="question-text-en" dir="ltr">{question.question_text_en}</p>
        {question.question_text_he && (
          <div className="translation-toggle-container">
            <button
              className="translation-toggle-btn"
              onClick={() => setShowHebrewTranslation(!showHebrewTranslation)}
              type="button"
            >
              <span className="toggle-icon">{showHebrewTranslation ? '−' : '+'}</span>
              <span className="toggle-text">
                {showHebrewTranslation ? 'הסתר תרגום' : 'הצג תרגום לעברית'}
              </span>
            </button>
            {showHebrewTranslation && (
              <p className="question-text-he">{question.question_text_he}</p>
            )}
          </div>
        )}
      </div>

      <div className="options-container">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isHovered = hoveredOption === index;
          const isCorrect = feedback && feedback.correctAnswer === index;
          const isWrong = feedback && isSelected && !feedback.isCorrect;

          let optionClass = 'option-card';
          if (isSelected) optionClass += ' selected';
          if (isHovered && !feedback) optionClass += ' hovered';
          if (feedback) {
            if (isCorrect) optionClass += ' correct';
            if (isWrong) optionClass += ' wrong';
          }

          return (
            <div
              key={index}
              className={optionClass}
              onClick={() => handleOptionClick(index)}
              onMouseEnter={() => !feedback && setHoveredOption(index)}
              onMouseLeave={() => setHoveredOption(null)}
            >
              <div className="option-indicator">
                {feedback ? (
                  isCorrect ? '✓' : isWrong ? '✗' : ''
                ) : (
                  isSelected ? '●' : '○'
                )}
              </div>
              <div className="option-text" dir="ltr">
                {option}
              </div>
            </div>
          );
        })}
      </div>

      {/* Show explanation when feedback is provided */}
      {feedback && (
        <div className={`feedback-section ${feedback.isCorrect ? 'correct-feedback' : 'wrong-feedback'}`}>
          <div className="feedback-status">
            {feedback.isCorrect ? '✓ תשובה נכונה!' : '✗ תשובה שגויה'}
          </div>
          {feedback.explanation && (
            <div className="feedback-explanation">
              <strong>הסבר:</strong> {feedback.explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UnseenQuestion;
