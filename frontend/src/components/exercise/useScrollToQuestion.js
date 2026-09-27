import { useEffect, useRef } from 'react';

/**
 * Brings the current question to the top of the screen whenever the index
 * changes (buttons, dots or the Enter key). Skips the initial render so the
 * page opens at its header, and honours prefers-reduced-motion.
 *
 * Usage: const questionRef = useScrollToQuestion(currentIndex);
 *        <div className="question-container" ref={questionRef}>
 */
export default function useScrollToQuestion(currentIndex) {
  const questionRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (questionRef.current) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      questionRef.current.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }, [currentIndex]);

  return questionRef;
}
