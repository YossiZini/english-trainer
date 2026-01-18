import React, { useEffect, useRef, useState } from 'react';
import './FillInBlank.css';

const FillInBlank = ({ question, userAnswer, onAnswerChange, feedback }) => {
  const inputRef = useRef(null);
  const [baseFormInitialized, setBaseFormInitialized] = useState(false);

  // Extract base form from question text (text in parentheses)
  const extractBaseForm = (text) => {
    const match = text.match(/\(([^)]+)\)/);
    return match ? match[1].trim() : '';
  };

  // Initialize input with base form when question changes
  useEffect(() => {
    if (!feedback && !baseFormInitialized) {
      const baseForm = extractBaseForm(question.question_text_he || '');
      if (baseForm && !userAnswer) {
        onAnswerChange(baseForm);
      }
      setBaseFormInitialized(true);
    }
  }, [question.id, feedback, baseFormInitialized, userAnswer, onAnswerChange, question.question_text_he]);

  // Reset initialization flag when question changes
  useEffect(() => {
    setBaseFormInitialized(false);
  }, [question.id]);

  // Auto-focus input when question changes or feedback is cleared
  useEffect(() => {
    if (!feedback && inputRef.current) {
      inputRef.current.focus();
      // Move cursor to end of input
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [question.id, feedback]);

  const handleInputChange = (e) => {
    // Don't allow changing answer after feedback is shown
    if (feedback) return;
    onAnswerChange(e.target.value);
  };

  return (
    <div className="fill-in-blank">
      <div className="question-text" dir="ltr">{question.question_text_he}</div>

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
