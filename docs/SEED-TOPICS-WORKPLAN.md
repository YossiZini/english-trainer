# Seed Topics 3, 5, 9 - Workplan

## Overview
Creating seed files for topics that have content in topics.md but are missing database seed files.

**Start Date:** 2026-01-21
**Status:** COMPLETED (pending database seed)

---

## Topics to Complete

### Topic 3: Personal Pronouns & Possessives (כינויי גוף ושייכות)
**Status:** COMPLETED

| Subtopic | Title | Exercises | Status |
|----------|-------|-----------|--------|
| 3.1 | Subject Pronouns (כינויי גוף - נושא) | 20 | Pending |
| 3.2 | Object Pronouns (כינויי גוף - מושא) | 20 | Pending |
| 3.3 | Possessive Adjectives (תארי שייכות) | 20 | Pending |
| 3.4 | Possessive Pronouns (כינויי שייכות) | 20 | Pending |
| 3.5 | Possessive 's (apostrophe s) | 20 | Pending |

**Total Exercises:** 100

---

### Topic 5: Articles (מאמרים - a, an, the)
**Status:** COMPLETED

| Subtopic | Title | Exercises | Status |
|----------|-------|-----------|--------|
| 5.1 | Indefinite Articles - A/An (מאמר לא מוגדר) | 20 | Pending |
| 5.2 | Definite Article - The (מאמר מוגדר) | 20 | Pending |
| 5.3 | Zero Article (ללא מאמר) | 20 | Pending |
| 5.4 | Common Mistakes & Practice | 20 | Pending |

**Total Exercises:** 80

---

### Topic 9: Present Simple Tense (זמן הווה פשוט)
**Status:** COMPLETED

| Subtopic | Title | Exercises | Status |
|----------|-------|-----------|--------|
| 9.1 | Introduction to Present Simple | 20 | Pending |
| 9.2 | Affirmative Sentences (משפטים חיוביים) | 20 | Pending |
| 9.3 | Negative Sentences (משפטים שליליים) | 20 | Pending |
| 9.4 | Yes/No Questions (שאלות כן/לא) | 20 | Pending |
| 9.5 | Wh- Questions (שאלות מידע) | 20 | Pending |
| 9.6 | Frequency Adverbs (תארי תדירות) | 20 | Pending |

**Total Exercises:** 120

---

## Exercise Distribution per Subtopic
Each subtopic follows this difficulty distribution:
- **Easy:** 5 exercises (beginner level)
- **Medium:** 5 exercises (intermediate level)
- **Hard:** 10 exercises (advanced level)

---

## Progress Log

### Phase 1: Create Workplan
- [x] Analyze existing seed file structure
- [x] Review topics.md content for topics 3, 5, 9
- [x] Create this workplan document

### Phase 2: Topic 3 - Personal Pronouns & Possessives
- [ ] Create topic3-personal-pronouns.js
- [ ] Subtopic 3.1: Subject Pronouns
- [ ] Subtopic 3.2: Object Pronouns
- [ ] Subtopic 3.3: Possessive Adjectives
- [ ] Subtopic 3.4: Possessive Pronouns
- [ ] Subtopic 3.5: Possessive 's

### Phase 3: Topic 5 - Articles
- [ ] Create topic5-articles.js
- [ ] Subtopic 5.1: Indefinite Articles A/An
- [ ] Subtopic 5.2: Definite Article The
- [ ] Subtopic 5.3: Zero Article
- [ ] Subtopic 5.4: Common Mistakes & Practice

### Phase 4: Topic 9 - Present Simple
- [ ] Create topic9-present-simple.js
- [ ] Subtopic 9.1: Introduction
- [ ] Subtopic 9.2: Affirmative Sentences
- [ ] Subtopic 9.3: Negative Sentences
- [ ] Subtopic 9.4: Yes/No Questions
- [ ] Subtopic 9.5: Wh- Questions
- [ ] Subtopic 9.6: Frequency Adverbs

### Phase 5: Integration & Testing
- [ ] Update seed-all-lessons.js to import new topics
- [ ] Run seed scripts
- [ ] Verify data in database
- [ ] Test in frontend

---

## File Locations
- Seed files: `/backend/src/database/seeds/`
- Topics documentation: `/docs/topics.md`
- Main seed script: `/backend/src/database/seed-all-lessons.js`

---

## Notes
- Each exercise includes Hebrew question text, options (for multiple choice), correct answer, and Hebrew explanation
- Theory content is in Hebrew with English examples
- Following the same structure as existing seed files (e.g., topic6-demonstratives.js)
