import React from 'react';
import { assessmentFor } from '../../content/assessment';
import './Assessment.css';

/**
 * The end-of-test card: words instead of a score (content/assessment.js).
 * Children, when given, add a small line under the words.
 */
const Assessment = ({ correct, total, children }) => {
  const { tone, icon, title, text } = assessmentFor(correct, total);
  return (
    <div className={`assessment assessment-${tone}`}>
      <div className="assessment-icon" aria-hidden="true">{icon}</div>
      <div className="assessment-title">{title}</div>
      <p className="assessment-text">{text}</p>
      {children && <div className="assessment-detail">{children}</div>}
    </div>
  );
};

export default Assessment;
