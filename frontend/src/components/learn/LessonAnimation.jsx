import React, { useCallback, useEffect, useRef, useState } from 'react';
import MathText from '../common/MathText';
import './LessonAnimation.css';

/**
 * Step-by-step animated explanation shown above a lesson's written theory.
 *
 * Data contract (see frontend/src/content/animations/):
 *   scenes = [{ name: 'הרחבה', steps: [{ caption: 'Hebrew text, fractions as a/b', draw: () => <JSX for the SVG stage/> }] }]
 * The stage is an SVG (viewBox 0 0 640 280, LTR) drawn with the primitives in
 * content/animations/primitives.jsx. Each step remounts the stage so the CSS
 * keyframe classes (pop, rise, fadein, draw, shake) run again.
 *
 * Controls: scene tabs, back / play-pause / forward, progress dots that fill
 * over the step time, auto-advance that stops after the last step, arrow keys
 * (RTL: left = forward) and space when the player has focus.
 */
export const STEP_MS = 4500;

// Default: autoplay on wide screens; on phones (and with reduced motion) the
// player starts paused so the page does not move while the student reads.
const autoplayDefault = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return true;
  return window.matchMedia('(min-width: 769px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const LessonAnimation = ({ scenes, stepMs = STEP_MS, autoplay }) => {
  const [si, setSi] = useState(0);
  const [st, setSt] = useState(0);
  const [playing, setPlaying] = useState(autoplay === undefined ? autoplayDefault() : autoplay);
  const [captionKey, setCaptionKey] = useState(0);
  const rootRef = useRef(null);

  const scene = scenes[si];
  const step = scene.steps[st];
  const isLast = si === scenes.length - 1 && st === scene.steps.length - 1;

  const goTo = useCallback((i, j) => { setSi(i); setSt(j); setCaptionKey((k) => k + 1); }, []);

  const next = useCallback(() => {
    if (st < scene.steps.length - 1) goTo(si, st + 1);
    else if (si < scenes.length - 1) goTo(si + 1, 0);
    else setPlaying(false);
  }, [si, st, scene, scenes.length, goTo]);

  const prev = useCallback(() => {
    if (st > 0) goTo(si, st - 1);
    else if (si > 0) goTo(si - 1, scenes[si - 1].steps.length - 1);
  }, [si, st, scenes, goTo]);

  const togglePlay = useCallback(() => {
    if (!playing && isLast) goTo(0, 0);
    setPlaying((p) => !p);
  }, [playing, isLast, goTo]);

  // Auto-advance
  useEffect(() => {
    if (!playing) return undefined;
    if (isLast) { setPlaying(false); return undefined; }
    const t = setTimeout(next, stepMs);
    return () => clearTimeout(t);
  }, [playing, si, st, isLast, next, stepMs]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); prev(); }
    else if (e.key === ' ') { e.preventDefault(); togglePlay(); }
  };

  return (
    <section
      ref={rootRef}
      className={`lesson-animation ${playing ? '' : 'paused'}`}
      style={{ '--la-dur': `${stepMs}ms` }}
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label="הסבר מונפש"
    >
      <div className="la-tabs" role="tablist">
        {scenes.map((s, i) => (
          <button
            key={s.name}
            type="button"
            role="tab"
            className="la-tab"
            aria-selected={i === si}
            onClick={() => goTo(i, 0)}
          >
            {i + 1}. {s.name}
          </button>
        ))}
      </div>

      <div className="la-stage">
        <h3 className="la-scene-title">
          <span>{scene.name}</span>
          <small>שלב {st + 1} מתוך {scene.steps.length}</small>
        </h3>
        <div className="la-canvas">
          <svg key={`${si}-${st}`} viewBox="0 0 640 280" direction="ltr" style={{ direction: 'ltr' }} role="img" aria-label={step.caption}>
            {step.draw()}
          </svg>
        </div>
        <MathText key={captionKey} as="p" className="la-caption" text={step.caption} />
        <div className="la-controls">
          <button type="button" className="la-btn" onClick={prev} disabled={si === 0 && st === 0} aria-label="צעד אחורה">‹ אחורה</button>
          <button type="button" className="la-btn la-btn-primary" onClick={togglePlay} aria-label={playing ? 'השהה' : 'הפעל'}>
            {playing ? '⏸ השהה' : isLast ? '↻ מהתחלה' : '▶ הפעל'}
          </button>
          <button type="button" className="la-btn" onClick={next} disabled={isLast} aria-label="צעד קדימה">קדימה ›</button>
          <div className="la-dots" aria-hidden="true">
            {scene.steps.map((_, i) => (
              <span key={`${si}-${i}-${i === st ? captionKey : 0}`} className={`la-dot ${i < st ? 'done' : i === st ? 'live' : ''}`}><i /></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LessonAnimation;
