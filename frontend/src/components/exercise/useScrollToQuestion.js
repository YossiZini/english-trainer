import { useEffect, useRef } from 'react';

/**
 * Brings the current question to the top of the screen whenever the index
 * changes (buttons, dots or the Enter key). Scrolls only on a real index
 * change, never on mount (StrictMode runs mount effects twice), and honours
 * prefers-reduced-motion.
 *
 * Usage: const questionRef = useScrollToQuestion(currentIndex);
 *        <div className="question-container" ref={questionRef}>
 */
export default function useScrollToQuestion(currentIndex) {
  const questionRef = useRef(null);
  const previousIndex = useRef(currentIndex);

  useEffect(() => {
    if (previousIndex.current === currentIndex) return;
    previousIndex.current = currentIndex;
    if (questionRef.current) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      questionRef.current.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }, [currentIndex]);

  return questionRef;
}
