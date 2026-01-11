import React, { useState } from 'react';
import './MultipleChoice.css';

const MultipleChoice = ({ question, selectedAnswer, onAnswerChange, feedback }) => {
  const options = question.options || [];
  const [hoveredOption, setHoveredOption] = useState(null);

  const handleOptionClick = (option) => {
    // Don't allow changing answer after feedback is shown
    if (feedback) return;
    onAnswerChange(option);
  };

  return (
    <div className="multiple-choice">
      <div className="question-text">{question.question_text_he}</div>

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
            >
              <div className="option-indicator">
                {feedback ? (
                  isCorrect ? '✓' : isWrong ? '✗' : ''
                ) : (
                  isSelected ? '●' : '○'
                )}
              </div>
              <div className="option-text">{option}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MultipleChoice;
