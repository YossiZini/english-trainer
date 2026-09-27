# English Trainer

A web app that teaches English grammar and vocabulary to Hebrew-speaking
children (ages 10–12): Hebrew explanations, progressive English content,
interactive exercises, mistake review, vocabulary quizzes, reading passages
and a points/achievements system.

**Live:** https://teacher-509909.web.app

## What it does

| Area | For the student |
|---|---|
| Grammar lessons | 15 topics, 97 lessons with Hebrew theory; videos for some topics |
| Math (מתמטיקה) | Grades 7–8, in Hebrew: fractions, order of operations, average, percentage; teaching document + 30 exercises per topic |
| Exercises | Multiple choice and fill-in-the-blank at easy / medium / hard; progress per difficulty; numeric answers accepted as fraction, decimal or percent |
| Cross-test | Mixed questions across topics |
| Mistakes | Every wrong answer is kept for focused retry |
| Vocabulary | 3,287 words, per-word mastery tracking, smart quizzes, review mode |
| Reading | Passages with comprehension questions and a hard-words popup |
| Gamification | Points, levels, achievements, daily challenges, streaks |
| Progress | Dashboard, statistics, Kanban-style progress page |

Curriculum status and the guide for adding topics: `docs/topics-status.md`.

## Architecture

```
Browser ──► Firebase Hosting (React)
               │  /api/** ──► Cloud Run (Node 22 / Express 5)
               │                  ├─ curriculum content: bundled JSON, read-only
               │                  └─ Firestore: student data
               └─ videos ──► Cloud Storage
GitHub push to main ──► GitHub Actions ──► deploy (keyless, Workload Identity)
```

- **Frontend**: React 19, React Router 7, Axios (`frontend/`)
- **Backend**: Node.js 22, Express 5, custom JWT auth (`backend/`)
- **Data**: Firestore for student data; curriculum generated from seed files
- **Cloud**: GCP project `teacher-509909`, region `europe-west1`

## Working on the project

- Setup and local runs: `SETUP.md`
- Operations, rollback, costs: `docs/deployment.md`
- Design documents: `docs/PRD.md`, `docs/technical.md`, `docs/webapp.md`
- Change requests (PRD + workplan per change): `change-requests/`

Every push to `main` runs the backend tests on the Firestore emulator and,
when green, deploys backend and frontend.
