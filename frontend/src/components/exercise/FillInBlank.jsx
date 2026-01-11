import React, { useEffect, useRef } from 'react';
import './FillInBlank.css';

const FillInBlank = ({ question, userAnswer, onAnswerChange, feedback }) => {
  const inputRef = useRef(null);

  // Auto-focus input when question changes or feedback is cleared
  useEffect(() => {
    if (!feedback && inputRef.current) {
      inputRef.current.focus();
    }
  }, [question.id, feedback]);

  const handleInputChange = (e) => {
    // Don't allow changing answer after feedback is shown
    if (feedback) return;
    onAnswerChange(e.target.value);
  };

  return (
    <div className="fill-in-blank">
      <div className="question-text">{question.question_text_he}</div>

      <div className="answer-container">
        <input
          ref={inputRef}
          type="text"
          className={`answer-input ${feedback ? (feedback.isCorrect ? 'correct' : 'wrong') : ''}`}
          value={userAnswer}
          onChange={handleInputChange}
          placeholder="הזן את התשובה כאן..."
          disabled={!!feedback}
          dir="ltr"
          autoFocus
        />
        {feedback && (
          <div className="input-indicator">
            {feedback.isCorrect ? '✓' : '✗'}
          </div>
        )}
      </div>

      {question.hint_he && !feedback && (
        <div className="hint">
          <span className="hint-label">רמז:</span> {question.hint_he}
        </div>
      )}
    </div>
  );
};

export default FillInBlank;
