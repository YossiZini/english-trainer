import React, { useState, useEffect } from 'react';
import './VocabularyQuestion.css';

const VocabularyQuestion = ({
  question,
  selectedAnswer,
  feedback,
  onAnswerSelect,
  disabled
}) => {
  const [keyboardSelectedIndex, setKeyboardSelectedIndex] = useState(0);

  // Reset keyboard selection when question changes and select first option by default
  useEffect(() => {
    setKeyboardSelectedIndex(0);
  }, [question.word.id]);

  // Handle keyboard navigation
  useEffect(() => {
    if (disabled || feedback) return;

    const handleKeyDown = (e) => {
      const optionsCount = question.options.length;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setKeyboardSelectedIndex((prev) => (prev + 1) % optionsCount);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setKeyboardSelectedIndex((prev) => (prev - 1 + optionsCount) % optionsCount);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selectedOption = question.options[keyboardSelectedIndex];
        onAnswerSelect(selectedOption.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, feedback, question.options, keyboardSelectedIndex, onAnswerSelect]);

  const getOptionClass = (optionId, index) => {
    const classes = ['option'];

    // Add keyboard-focused class
    if (!feedback && !disabled && index === keyboardSelectedIndex) {
      classes.push('keyboard-focused');
    }

    if (!feedback) {
      if (selectedAnswer === optionId) {
        classes.push('selected');
      }
      return classes.join(' ');
    }

    // Show feedback
    if (optionId === feedback.correctAnswer.id) {
      classes.push('correct');
    } else if (optionId === selectedAnswer && !feedback.isCorrect) {
      classes.push('incorrect');
    }

    return classes.join(' ');
  };

  return (
    <div className="vocabulary-question">
      <div className="question-card">
        <div className="question-header">
          <span className="question-label">מה המשמעות של המילה:</span>
        </div>

        <div className="english-word">
          {question.word.english}
        </div>

        <div className="options-container">
          {question.options.map((option, index) => (
            <button
              key={option.id}
              className={getOptionClass(option.id, index)}
              onClick={() => onAnswerSelect(option.id)}
              disabled={disabled}
            >
              <span className="option-text">{option.hebrew}</span>
              {feedback && option.id === feedback.correctAnswer.id && (
                <span className="option-icon">✓</span>
              )}
              {feedback && option.id === selectedAnswer && !feedback.isCorrect && (
                <span className="option-icon">✗</span>
              )}
            </button>
          ))}
        </div>

        {/* Feedback Message */}
        {feedback && (
          <div className={`feedback-message ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="feedback-icon">
              {feedback.isCorrect ? '✓' : '✗'}
            </div>
            <div className="feedback-content">
              {feedback.isCorrect ? (
                <>
                  <div className="feedback-title">נכון! 🎉</div>
                  <div className="feedback-text">
                    +{feedback.pointsEarned} נקודות
                  </div>
                </>
              ) : (
                <>
                  <div className="feedback-title">לא נכון</div>
                  <div className="feedback-text">
                    התשובה הנכונה: <strong>{feedback.correctAnswer.hebrew}</strong>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabularyQuestion;
