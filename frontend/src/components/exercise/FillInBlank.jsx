import React, { useEffect, useRef, useState } from 'react';
import './FillInBlank.css';
import MathText from '../common/MathText';

// subject: 'english' questions are English sentences (LTR) whose base verb in
// parentheses pre-fills the input; other subjects are Hebrew (RTL) with no prefill.
const FillInBlank = ({ question, userAnswer, onAnswerChange, feedback, subject }) => {
  // The page passes the lesson's subject; cross-test questions carry their own.
  const questionSubject = subject || question.subject || 'english';
  const textDir = questionSubject === 'english' ? 'ltr' : 'rtl';
  const prefillBaseForm = questionSubject === 'english';
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
      const baseForm = prefillBaseForm ? extractBaseForm(question.question_text_he || '') : '';
      if (baseForm && !userAnswer) {
        onAnswerChange(baseForm);
      }
      setBaseFormInitialized(true);
    }
  }, [question.id, feedback, baseFormInitialized, userAnswer, onAnswerChange, question.question_text_he, prefillBaseForm]);

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
      <MathText as="div" className="question-text" dir={textDir} text={question.question_text_he} />

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
          <span className="hint-label">רמז:</span> <MathText text={question.hint_he} />
        </div>
      )}
    </div>
  );
};

export default FillInBlank;
