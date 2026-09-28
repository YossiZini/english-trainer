import React, { useState, useEffect } from 'react';
import './MultipleChoice.css';
import MathText from '../common/MathText';
import { textDirection, isolateEnglish } from '../../utils/bidi';

// subject: 'english' questions are mostly English sentences (LTR); those that
// start in Hebrew ("המילה ... היא _______", "תקן: ...") read right-to-left with
// their English stretches isolated. Other subjects are written in Hebrew (RTL).
const MultipleChoice = ({ question, selectedAnswer, onAnswerChange, feedback, subject }) => {
  // The page passes the lesson's subject; cross-test questions carry their own.
  const questionSubject = subject || question.subject || 'english';
  const textDir = questionSubject === 'english' ? textDirection(question.question_text_he) : 'rtl';
  const hebrewFirstEnglish = questionSubject === 'english' && textDir === 'rtl';
  const options = question.options || [];
  const [hoveredOption, setHoveredOption] = useState(null);

  // Set first option as default when question loads (if no answer selected yet)
  useEffect(() => {
    if (!selectedAnswer && !feedback && options.length > 0) {
      onAnswerChange(options[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]); // Only run when question changes

  // Handle arrow key navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Don't handle keys if feedback is shown
      if (feedback) return;

      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();

        const currentIndex = options.findIndex(opt => opt === selectedAnswer);
        let newIndex;

        if (event.key === 'ArrowUp') {
          // Move up (previous option)
          newIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
        } else {
          // Move down (next option)
          newIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
        }

        onAnswerChange(options[newIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAnswer, options, feedback, onAnswerChange]);

  const handleOptionClick = (option) => {
    // Don't allow changing answer after feedback is shown
    if (feedback) return;
    onAnswerChange(option);
  };

  return (
    <div className="multiple-choice">
      {hebrewFirstEnglish ? (
        <div className="question-text" dir="rtl">
          {isolateEnglish(question.question_text_he).map((part, i) => (part.ltr
            ? <bdi key={i} dir="ltr">{part.text}</bdi>
            : <React.Fragment key={i}>{part.text}</React.Fragment>))}
        </div>
      ) : (
        <MathText as="div" className="question-text" dir={textDir} text={question.question_text_he} />
      )}

      <div className="options-container">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isHovered = hoveredOption === option;
          const isCorrect = feedback && feedback.correctAnswer === option;
          const isWrong = feedback && isSelected && !feedback.isCorrect;

          let optionClass = 'option';
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
              onClick={() => handleOptionClick(option)}
              onMouseEnter={() => !feedback && setHoveredOption(option)}
              onMouseLeave={() => setHoveredOption(null)}
              dir="ltr"
            >
              <div className="option-indicator">
                {feedback ? (
                  isCorrect ? '✓' : isWrong ? '✗' : ''
                ) : (
                  isSelected ? '●' : '○'
                )}
              </div>
              <MathText as="div" className="option-text" text={option} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MultipleChoice;
