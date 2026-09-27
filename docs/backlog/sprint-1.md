# Sprint 1 — Exercise page without scrolling (archived backlog)

**Goal:** Let a student answer a whole exercise on the Exercise page without scrolling: a compact layout that fits the viewport, navigation always in reach, and each new question shown from the top.
**Period:** 2026-09-27 → 2026-09-27
**Items:** 18 (6 stories), all done

## Scope

- Exercise (question) page only: tighten header, progress bar, question card, feedback and spacing so a typical question fits in the viewport on a laptop and a phone
- Previous / Check / Next controls pinned in a bar at the bottom of the viewport, always visible while answering and after feedback
- Pressing Next (or Previous) scrolls so the new question is the first thing on screen, with no lingering feedback from the previous question
- Keep the existing behaviour: question dots, previous-attempt modal, keyboard flow, results page
- No backend changes; frontend build must stay green

## Stories

### P1 s6 · Review follow-ups: as a maintainer, I want the review findings on PR #5 fixed before it merges

Six findings from /sprint review (correctness pass + coupling lens). All small; land on PR #5.

- [x] Opening an exercise in development (StrictMode) does not scroll past the header
- [x] Cross-test feedback uses the same component as the exercise page, clamps on phones, and the toggle appears only when text is clamped
- [x] Bottom padding accounts for the safe-area inset; page height uses dvh
- [x] Navbar height comes from a single --navbar-height variable
- [x] Buttons do not overflow at 360px width
- [x] viewport-check.js cannot serve files outside build/, survives malformed URLs, reports HTTP errors clearly, and the documented dev-server path works

*Closing note:* All six review findings fixed and verified (viewport check passes at 3 sizes). On PR #5.

| Task | Owner | Note |
|---|---|---|
| R1 StrictMode-safe scroll hook (track previous index) | Claude | Previous-index tracking; no scroll on mount even under StrictMode. Commit 3dc99e5. |
| R2 Extract ExerciseFeedback (clamp + overflow-aware toggle) and use it in both pages | Claude | ExerciseFeedback.jsx shared by both pages; toggle only when scrollHeight > clientHeight; CSS comment fixed. Commit 3dc99e5. |
| R3 + R4 Safe-area padding, dvh, and --navbar-height variable | Claude | --navbar-height in Navbar.css (4.25rem / 3.75rem, navbar min-height bound to it); exercise page uses it for min-height (dvh + vh fallback), scroll margin; padding-bottom adds env(safe-area-inset-bottom). Commit 3dc99e5. |
| R5 Let the action buttons wrap on narrow phones | Claude | Buttons wrap at ≤768px; check now includes 360×740 and asserts labels fit (5px to spare). Commit 3dc99e5. |
| R6 Harden viewport-check.js and fix the dev-server docs | Claude | Path resolved inside build/ with guarded decode; HTTP errors reported with status/route; localhost default + SETUP note. Commit 3dc99e5. |

### P1 s1 · As a student, I want the exercise page to fit my screen so I can read the question, its options and the feedback without scrolling

Size: ~3 h. Today the header (breadcrumb + 2rem title + badge + progress), a question card with min-height 350px and 2.5rem padding, 1.2rem-tall options and a padded feedback block stack to well over one screen. Files: components/exercise/ExercisePage.{jsx,css}, MultipleChoice.css, FillInBlank.css.

- [x] On a 1366×768 laptop viewport, a 4-option multiple-choice question with its feedback visible fits without vertical page scroll
- [x] On a 390×844 phone viewport the same holds (feedback may collapse the explanation behind a tap)
- [x] Header shows breadcrumb, title and difficulty/retry badge on at most two compact lines; progress bar stays
- [x] Fill-in-the-blank questions look consistent with the new spacing
- [x] Frontend production build passes

*Closing note:* All acceptance criteria verified at 1366×768 and 390×844; build green.

| Task | Owner | Note |
|---|---|---|
| Compact header: title, badge and breadcrumb in a tight block, slim progress row | Claude | Header: breadcrumb + title/badge row + progress bar with the counter on one line (ExercisePage.css). Commit a9ce91c. |
| Compact question card and answer options | Claude | min-height removed, paddings halved, options 0.55rem tall; MultipleChoice.css and FillInBlank.css scoped under their root classes because later-imported stylesheets overrode them. Commit a9ce91c. |
| Compact feedback block | Claude | Feedback compact with the icon inline; explanation clamps to 2 lines on phones with a show-more toggle. Commit a9ce91c. |
| Verify the layout at laptop and phone sizes with screenshots | Claude | Playwright over 6 questions per size: laptop worst case 34px to spare, phone 110px; screenshots in docs/backlog/sprint-1/. Check script kept in the session scratchpad for s4. |

### P1 s2 · As a student, I want Previous / Check / Next always visible at the bottom of the screen so I never scroll to continue

Size: ~1.5 h. Move .exercise-navigation and the question dots into a bar fixed to the bottom of the viewport (safe-area aware), add bottom padding to the content so nothing hides behind it. Files: ExercisePage.{jsx,css}.

- [x] The bar with Previous / Check-or-Next / Submit is visible at the bottom on every viewport size, before and after feedback
- [x] Button states unchanged: Previous disabled on question 1, Check shown until feedback, Submit on the last question
- [x] Question dots remain usable (in or just above the bar) and the last content is never hidden behind the bar
- [x] Works with the previous-attempt modal open (modal stays above the bar)

*Closing note:* Bar visible in every check; button states unchanged; modal z-index 9999 stays above.

| Task | Owner | Note |
|---|---|---|
| Fixed bottom action bar with the navigation buttons and dots | Claude | .exercise-actionbar fixed at the bottom (safe-area aware, z-index under the modal); page reserves 6rem. Commit a9ce91c. |
| Phone layout for the bar | Claude | Under 768px: one-row buttons with flex:1, 44px min height, dots above. Commit a9ce91c. |

### P1 s3 · As a student, when I press Next or Previous I want the new question to be the first thing on screen, with no feedback from the previous question lingering

Size: ~1 h. On currentIndex change scroll the question card to the top (below the sticky navbar); applies to buttons, question dots and the Enter key. Feedback is already keyed per exercise id. Files: ExercisePage.jsx.

- [x] After Next/Previous/dot click/Enter, the question card's top is at the viewport top (just below the navbar) on laptop and phone
- [x] No feedback of another question is visible after navigating
- [x] Respects prefers-reduced-motion (no smooth scroll animation)

*Closing note:* Verified: after each Next the question sits under the navbar and no previous feedback is visible.

| Task | Owner | Note |
|---|---|---|
| Scroll the question into view on index change | Claude | useEffect on currentIndex scrolls .question-container into view (scroll-margin-top for the navbar), reduced-motion aware; skipped on first render. Commit a9ce91c. |

### P2 s4 · As a maintainer, I want a repeatable viewport check so the no-scroll layout does not regress

Size: ~1.5 h. Turn the manual screenshot check from s1-t4 into frontend/scripts/viewport-check.js (Playwright against a local build + emulator) that fails when the exercise page exceeds the viewport at 1366×768 or 390×844; documented in SETUP.md. CI wiring optional.

- [x] npm run check:viewport in frontend/ exits non-zero when the page scrolls at either size
- [x] Documented in SETUP.md

*Closing note:* frontend/scripts/viewport-check.js + npm run check:viewport (Playwright; serves the build and proxies /api). Documented in SETUP.md. Passes: laptop 34px spare, phone 110px. Commit 51163e1. CI wiring left out (needs Chromium + emulator in the job).

### P3 s5 · As a student, I want the cross-test and mistakes-review pages to get the same compact layout and pinned navigation

Size: ~1.5 h, only if CrossTestPage / ReviewMistakesPage reuse the exercise layout; otherwise defer to a later sprint.

- [x] Same no-scroll and pinned-navigation behaviour on those pages where they share the exercise structure

*Closing note:* CrossTestPage shares the layout: it now uses the extracted ExerciseActionBar and useScrollToQuestion (pinned bar + scroll-to-question) and the compacted shared CSS. ReviewMistakesPage only links into the exercise page in retry mode, nothing to change. Build green; not screenshot-verified (needs mistake data). Commit 51163e1.

## References

- Pull requests: #5 (implementation + review follow-ups), #6 (retrospective)
- Retrospective: `docs/retro.md` → "Sprint 1 — Exercise page without scrolling"
- Screenshots: `docs/backlog/sprint-1/laptop-feedback.png`, `docs/backlog/sprint-1/phone-feedback.png`
- Regression check: `cd frontend && npm run check:viewport` (see `SETUP.md`)
