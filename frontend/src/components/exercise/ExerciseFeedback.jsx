import React, { useEffect, useRef, useState } from 'react';
import MathText from '../common/MathText';
import './ExerciseFeedback.css';

/**
 * Result of a checked answer: icon, message, correct answer and explanation.
 * On phones the explanation is clamped (see .feedback-explanation.clamped in
 * ExercisePage.css); the "show more" toggle appears only when the text is
 * actually cut. Shared by ExercisePage and CrossTestPage.
 *
 * `feedbackKey` identifies the question so the fold resets per question.
 */
const ExerciseFeedback = ({ feedback, feedbackKey }) => {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const explanationRef = useRef(null);

  // New question: start folded
  useEffect(() => {
    setExpanded(false);
  }, [feedbackKey]);

  // Show the toggle only when the clamp hides something
  useEffect(() => {
    const el = explanationRef.current;
    if (!el || expanded) return;
    const measure = () => setIsClamped(el.scrollHeight > el.clientHeight + 1);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [feedbackKey, expanded, feedback]);

  if (!feedback) return null;

  return (
    <div className={`feedback ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
      <div className="feedback-icon">
        {feedback.isCorrect ? '✅' : '💡'}
      </div>
      <div className="feedback-content">
        {feedback.isCorrect ? (
          <p className="feedback-message">כל הכבוד! התשובה נכונה!</p>
        ) : (
          <>
            <p className="feedback-message">התשובה שגויה</p>
            {/* bdi: an English answer keeps its own direction inside the Hebrew line
                ("She said, "Say 'hi' to Dan."" would otherwise show its end quotes on the wrong side) */}
            <p className="feedback-correct">התשובה הנכונה: <MathText as="bdi" text={feedback.correctAnswer} /></p>
          </>
        )}
        {feedback.explanationHe && (
          <>
            <p
              ref={explanationRef}
              className={`feedback-explanation ${expanded ? '' : 'clamped'}`}
            >
              <MathText text={feedback.explanationHe} />
            </p>
            {(isClamped || expanded) && (
              <button
                type="button"
                className="feedback-toggle"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? 'הצג פחות' : 'הצג עוד'}
              </button>
            )}
          </>
        )}
        {feedback.explanationPicture && (
          /* Bundled, author-written SVG from the seeds (not user content) */
          <div
            className="feedback-picture"
            dangerouslySetInnerHTML={{ __html: feedback.explanationPicture }}
          />
        )}
      </div>
    </div>
  );
};

export default ExerciseFeedback;
