# Sprint 4 — Animated Fractions lessons (archived backlog)

**Goal:** Teach the six Fractions subtopics with step-by-step animations the student can play, pause and step through, modelled on the reference player, above the written theory on each learn page.
**Period:** 2026-09-28 → 2026-09-28
**Items:** 19 (6 stories), all done

## Scope

- A reusable animation player in the app, modelled on https://claude.ai/artifact/5b75AhKjgoevyoNJgv1riH: scenes as tabs, an SVG stage, a Hebrew caption per step, back / play-pause / forward controls with progress dots, auto-advance with pause, keyboard arrows and space, reduced-motion support, working at 360px
- Drawing primitives for the stage matching the app's pictures: bars that split into finer parts, shaded parts that slide into one row, fraction labels that pop in, circles, number lines, arrows and notes; app palette, stacked fraction labels
- One scene set per Fractions subtopic (1.1–1.6), 3–5 steps per rule, in teaching order and consistent with the written theory; captions in Hebrew with fractions written a/b and shown stacked
- The learn page shows the player at the top of the lesson when a scene set exists for that lesson; lessons without one (topics 2–4, English) are unchanged
- Scene sets are data files in the frontend keyed by lesson number, so the next topic adds a file and no player code
- Verification: a Playwright walk through every step of every scene at laptop and phone (no errors, stage inside the viewport), screenshots, frontend tests for the player; docs/math-content-guide.md gets a section on writing scenes

## Stories

### P1 s1 · As a student, I want an animation player at the top of a lesson that I can play, pause and step through, so a rule is shown to me before I read it

Size: ~4 h. New frontend/src/components/learn/LessonAnimation.jsx (+ .css scoped under .lesson-animation): tabs per scene, an SVG stage (viewBox 640×280, LTR), a caption per step with MathText, back / play-pause / forward, progress dots that fill over the step time, auto-advance (~4.5 s) that stops at the end, arrows (RTL: left = forward) and space, prefers-reduced-motion. Steps are data: { caption, draw: () => JSX } using primitives from frontend/src/content/animations/primitives.jsx (Bar with subdivisions and a slide-into-row effect, Frac label, Circle, NumberLine, Arrow, Note, Eq) with CSS keyframe classes (pop, rise, fadein, draw, shake, slide) and delays. LearningPage renders it above .theory-content when frontend/src/content/animations/index.js has a scene set for lesson.subtopicNumber.

- [x] On a lesson with a scene set, the player appears above the written theory; tabs switch scenes; back/forward step; play/pause toggles auto-advance; the last step stops
- [x] Arrow keys and space work; prefers-reduced-motion shortens animations to near zero
- [x] At 360px the stage, caption and controls fit the width with no horizontal scroll
- [x] Lessons without a scene set render exactly as before
- [x] react-scripts tests for the player: renders steps, steps forward/back, stops at the end, respects a scene set with one scene

*Closing note:* Player done and verified; pushed with the scenes once PR #19 is merged.

| Task | Owner | Note |
|---|---|---|
| Player shell: tabs, stage, caption, controls, dots, auto-advance, keyboard, reduced motion | Claude | components/learn/LessonAnimation.jsx + css; 4 unit tests (steps, auto-advance with fake timers, restart, keyboard). Commit b7667ec. |
| Stage primitives: Bar (subdivide, slide), Frac, Circle, NumberLine, Arrow, Note, Eq + keyframes | Claude | content/animations/primitives.jsx: Bar (subdiv, slide), Frac, Circle, Grid, NumberLine, Arrow, Note (arithmetic isolated), Eq; app palette. Commit b7667ec. |
| LearningPage integration: scene registry by subtopic number, player above the theory | Claude | content/animations/index.js registry; LearningPage renders the player above .theory-content, keyed by lesson id. Commit b7667ec. |
| Playwright walk: every step of every scene at 1366×768 and 360×740 | Claude | frontend/scripts/animation-check.js: 142 steps walked at 1366×768 and 360×740, 0 failures; 60 screenshots in docs/screenshots/sprint-4. |

### P1 s2 · As a student, I want animated scenes for lessons 1.1–1.3 (what a fraction is, equivalent and reducing, comparing), so each rule is shown step by step

Size: ~4 h. Scene files frontend/src/content/animations/fractions/101-1.jsx, 101-2.jsx, 101-3.jsx; one scene per rule of the written theory, 3–5 steps each, Hebrew captions with a/b fractions (MathText stacks them). 1.1: numerator/denominator on a circle, same fraction on bar and circle, fraction of a set, 4/4 = 1, fraction of a quantity. 1.2: expanding by splitting parts (½ → 2/4 → 3/6), reducing by merging, missing number, the add-1 mistake. 1.3: same denominator, same numerator, common denominator, half as a benchmark, number line.

- [x] Each of the three lessons has one scene per rule in the same order as the theory
- [x] Every step's caption matches what the stage shows; fractions in captions render stacked
- [x] Playwright walk passes for the three lessons

*Closing note:* Walk passes for 1.1–1.3 at both sizes.

| Task | Owner | Note |
|---|---|---|
| Scenes 1.1 מה זה שבר (5 scenes) | Claude | 101-1.jsx: 5 scenes (numerator/denominator, same fraction different shapes, fraction of a set, whole and zero, fraction of a quantity). |
| Scenes 1.2 שברים שווים וצמצום (4 scenes, from the reference) | Claude | 101-2.jsx: 5 scenes (expand, reduce, reduced form, missing number, the add-1 mistake); the first two follow the reference. |
| Scenes 1.3 השוואת שברים (5 scenes) | Claude | 101-3.jsx: 5 scenes (same denominator, same numerator, common denominator, half as benchmark, number line). |

### P1 s3 · As a student, I want animated scenes for lessons 1.4–1.6 (adding and subtracting, multiplying and dividing, mixed numbers), so the harder rules are shown step by step

Size: ~4 h. 1.4: same denominator with parts sliding into one row (from the reference), the ½+½≠2/4 mistake, common denominator then add, subtract from a whole. 1.5: n × a/b as repeated parts, fraction × fraction on an area grid, reduce before multiplying, divide as how many pieces fit, whole ÷ fraction. 1.6: improper fraction as whole circles plus a part, mixed → improper by counting, improper → mixed by grouping, on the number line, adding mixed numbers.

- [x] Each of the three lessons has one scene per rule in theory order
- [x] Captions match the stage; fractions stacked
- [x] Playwright walk passes for the three lessons

*Closing note:* Walk passes for 1.4–1.6 at both sizes.

| Task | Owner | Note |
|---|---|---|
| Scenes 1.4 חיבור וחיסור (4 scenes) | Claude | 101-4.jsx: 5 scenes (same denominator with the slide, the 1/2+1/2 mistake, different denominators, subtraction, from a whole). |
| Scenes 1.5 כפל וחילוק (5 scenes) | Claude | 101-5.jsx: 5 scenes (fraction × whole, fraction × fraction on a grid, reduce first, divide by the reciprocal, shrinks or grows). |
| Scenes 1.6 מספרים מעורבים (5 scenes) | Claude | 101-6.jsx: 5 scenes (more than one whole, mixed → improper, improper → mixed, number line, adding mixed numbers). |

### P1 s6 · Review follow-ups: caption fractions before a period, 1.6 sum drawing, walk script pause, keyboard on buttons, shared arrow defs

Findings of /sprint review to fix before close.

- [x] A fraction followed by '.' renders stacked (unit test)
- [x] Lesson 1.6 adding-mixed-numbers step 2 shows 5 quarters
- [x] animation-check.js only pauses when the player is playing; 142 steps still pass
- [x] Space on a focused control button does not toggle play
- [x] 101-3 uses ArrowDefs/Arrow

*Closing note:* All five fixed. The fix commit was pushed after PR #20 had merged, so it is in the follow-ups + retro PR.

| Task | Owner | Note |
|---|---|---|
| MathText: allow a period right after a fraction | Claude | Lookahead no longer excludes '.', decimals still excluded by [.,]\d; tests for '4 1/4.' and '3/4.5'. Same change in the seed helper. |
| 101-6 scene 5 step 2: slide with offset so the bar shows 5/4 | Claude | Eight-quarter bar (two wholes, dashed divider), second fraction slides in with offset 2; result 5/4 shown. |
| animation-check.js: pause only when playing; LessonAnimation: keys only from the section; 101-3 ArrowDefs | Claude | Walk pauses only when playing (142 steps green); keys handled only from the section (test); 101-3 uses ArrowDefs/Arrow. |

### P2 s4 · As a maintainer, I want the guide to say how to write scenes, so the next topic gets animations the same way

Size: ~0.5 h. docs/math-content-guide.md: a 'Animated lesson' section (scene/step contract, primitives, where files go, the walk script); docs/topics-status.md activity entry; README line.

- [x] Guide section with a minimal scene example
- [x] topics-status activity log entry for topic 101

*Closing note:* Guide section 'Animated lesson' with the scene/step contract and the check script; topics-status entry; README line.

### P3 s5 · As a student on a phone, I want the animation to start only when I tap play, so the page does not move while I read the title

Size: ~0.5 h. Autoplay on load only on wide screens; on phones the player shows the first step paused with a large play button. Also remembers nothing (no storage).

- [x] At 360px the player starts paused; at 1366px it starts playing

*Closing note:* autoplayDefault(): plays at ≥769px without reduced motion, otherwise starts paused; unit test with mocked matchMedia.

