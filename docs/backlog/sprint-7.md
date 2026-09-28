# Sprint 7 — Home page for both subjects (archived backlog)

**Goal:** Make the home page serve English and Math equally: one 'continue' button per subject, shared scores and streaks, and the English-only tools moved to the English topics page.
**Period:** 2026-09-28 → 2026-09-28
**Items:** 11 (4 stories), all done

## Scope

- Home page: neutral greeting; two 'continue' buttons, one per subject, each pointing at that subject's next lesson and level (today one button follows the English order only and Math never appears)
- Scores stay shared and stay on the home page: streak, points today, level and arena, achievements, daily challenge; progress shown per subject (today one bar counts English and Math lessons together)
- Recent activity carries a subject badge and mixes both subjects
- English-only tools (vocabulary practice, reading passages) move from the home page to the English topics page; the Math topics page gets its own quick actions (next lesson, review mistakes)
- Backend: next lesson, completion and recent activity become subject-aware in the progress API; existing web quiz and bot untouched
- Verification: backend tests for the subject-aware progress data, screenshots of home, English and Math pages at laptop and phone sizes, in-app navigation checked

## Stories

### P1 s1 · As a student, I want the app to know my next lesson and my progress in each subject separately, so Math is not hidden behind 106 English lessons

Size ~1.5 h. Today UserProgress.getNextLesson and getCompletionPercentage walk all lessons in order_index (Math is ordered after all English lessons) and getRecentActivity has no subject. GET /api/progress/dashboard gains subjects: { english, math }, each { nextLesson, completion, lastActivity }; the existing top-level fields stay so the old site keeps working during the deploy window. Web quiz, bot and lesson pages untouched.

- [x] Dashboard returns subjects.english and subjects.math, each with its own next lesson, completion (completed/total/percentage over that subject's lessons only) and last activity
- [x] A student with no Math activity gets the first Math lesson as Math's next lesson
- [x] Recent activity rows carry subject
- [x] api.test.js covers a student with English and Math results

*Closing note:* Committed locally; push waits for PR #33

| Task | Owner | Note |
|---|---|---|
| Subject-aware progress queries | Claude | UserProgress: getNextLesson/getCompletionPercentage/getRecentActivity take { subject }; rows carry subject |
| Dashboard returns both subjects, with tests | Claude | getDashboardData adds subjects.{english,math}; api.test covers it (43 tests, 3 green runs) |

### P1 s2 · As a student, I want the home page to treat English and Math equally, so I can continue either subject in one tap and see my shared scores

Size ~3 h. frontend/src/components/dashboard/Dashboard.jsx: neutral greeting (today 'בוא נמשיך ללמוד אנגלית'); two continue cards side by side, English and Math, each with the existing 'next difficulty, else next lesson' logic moved into a tested helper; shared scores stay (streak, points today, level and arena, achievements, daily challenge); two progress bars, one per subject; recent activity with a subject badge; vocabulary and reading-passage buttons removed from home (moved in s3); the quick-actions cards become one card per subject topics page.

- [x] Home shows two continue cards; each opens its own subject's lesson or next-level exercise; a subject with everything done shows a 'done' card
- [x] Greeting and all texts are subject-neutral
- [x] Progress section shows English and Math bars with their own counts
- [x] Recent activity rows show an English or Math badge
- [x] No vocabulary or reading-passage buttons on home
- [x] Laptop and phone (360 px) screenshots show no overflow; navbar navigation between home, English and Math works

*Closing note:* Home page for both subjects; next lesson now in curriculum order; styling collisions fixed

| Task | Owner | Note |
|---|---|---|
| Continue-target helper with tests | Claude | dashboard/continueTarget.js + test (easy->medium->hard->next lesson->done) |
| Home page layout for both subjects | Claude | Dashboard.jsx: SubjectContinueCard x2, neutral greeting, progress per subject, subject badges, English-only buttons removed; Dashboard.test.js |
| Screenshots and navigation check | Claude | Browser check (both sizes, cards, navbar, actions): 0 failures after fixes; found English order bug, CSS collisions and clipped phone logout |

### P1 s3 · As a student, I want each subject's page to carry that subject's own tools, so English practice tools are where I study English

Size ~1.5 h. frontend/src/components/topics/TopicsIndex.jsx header gets a row of subject actions taken from content/topicMeta.js: English = vocabulary practice (/vocabulary) and reading passages (/unseen); Math = continue (next Math lesson) and review mistakes (/mistakes). Data-driven per subject, no subject checks in the component.

- [x] English page shows vocabulary and reading-passage actions under its title
- [x] Math page shows continue and review-mistakes actions
- [x] Actions come from topicMeta, not from if(subject) in the component
- [x] Laptop and phone screenshots of both pages

*Closing note:* Done

| Task | Owner | Note |
|---|---|---|
| Subject actions on the topic pages | Claude | topicMeta.actions per subject rendered in TopicsIndex header; TopicsIndex.test.js |
| Screenshots of both topic pages | Claude | English/Math pages at both sizes, reached through the navbar; actions present |

### P2 s4 · As a maintainer, I want the change verified and recorded, so the next sprint starts from an accurate picture

Size ~30 min. Frontend full test suite and build, backend tests three runs, viewport check script, docs/screenshots/sprint-7; system map checked (page layout only, so likely no change).

- [x] All suites green, screenshots committed
- [x] System map reviewed; updated only if a flow changed

*Closing note:* Backend 45 tests x3; frontend 36 tests (App.test.js still fails to load: react-router/dom under jest, pre-existing); build; screenshots; system map: no design change

