# Topics Status Tracking

This document tracks the implementation status of all curriculum topics and provides a step-by-step guide for creating new topics.

**Single Source of Truth:** `/docs/topics.md` defines the authoritative curriculum structure.

---

## Table of Contents

1. [Topic Creation Guide](#topic-creation-guide)
2. [Asset Checklist](#asset-checklist)
3. [Topic Status Table](#topic-status-table)
4. [Recent Activity Log](#recent-activity-log)

---

## Topic Creation Guide

Follow these steps in order when creating a new topic:

### Step 1: Update topics.md (Single Source of Truth)

**File:** `/docs/topics.md`

Add the topic content including:
- Topic number and name (English + Hebrew)
- Difficulty level (Beginner/Intermediate/Advanced)
- Subtopic structure with detailed explanations
- Examples and usage notes

### Step 2: Create Backend Seed File

**Location:** `/backend/src/database/seeds/topic{N}-{name}.js`

Create a new seed file with this structure:

```javascript
const topic{N}Data = [
  {
    topicNumber: {N},
    subtopicNumber: 1,
    titleEn: 'Subtopic Title',
    titleHe: 'כותרת משנה',
    level: 'beginner',  // beginner | intermediate | advanced
    orderIndex: 1,
    theoryContentHe: `
      <div class="theory-section">
        <!-- Theory content in Hebrew -->
      </div>
    `,
    exercises: [
      {
        type: 'multiple-choice',
        questionHe: 'שאלה בעברית?',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 0,
        explanationHe: 'הסבר בעברית',
        difficulty: 'easy'  // easy | medium | hard
      }
    ]
  }
];

module.exports = topic{N}Data;
```

### Step 3: Register in Master Seed

**File:** `/backend/src/database/seed-all-lessons.js`

1. Add the import at the top:
```javascript
const topic{N}Data = require('./seeds/topic{N}-{name}');
```

2. Add to the lessonData array:
```javascript
const lessonData = [
  // ... existing topics
  ...topic{N}Data,
];
```

### Step 4: Update Frontend Component

**File:** `/frontend/src/components/topics/TopicsIndex.jsx`

Update three mappings:

1. **topicNames** - Add topic name (EN + HE):
```javascript
{N}: { en: 'Topic Name', he: 'שם הנושא' },
```

2. **tocExamples** - Add table of contents example:
```javascript
{N}: '(Example 1, Example 2)',
```

3. **topicDescriptions** - Add description and examples:
```javascript
{N}: {
  description: 'תיאור הנושא בעברית',
  examples: ['Example 1', 'Example 2', 'Example 3']
},
```

### Step 5: Run Database Seed

From the backend directory:

```bash
cd backend
npm run seed
```

### Step 6: Verify & Test

1. Start the development server
2. Check that lessons appear in the frontend
3. Test that exercises work correctly
4. Verify theory content displays properly

---

## Asset Checklist

For each topic, these assets must exist:

| Asset | Location | Description |
|-------|----------|-------------|
| Documentation | `/docs/topics.md` | Full topic content with subtopics |
| Seed File | `/backend/src/database/seeds/topic{N}-*.js` | Lessons and exercises data |
| Seed Registration | `/backend/src/database/seed-all-lessons.js` | Import and include in lessonData |
| Frontend Mapping | `/frontend/src/components/topics/TopicsIndex.jsx` | topicNames, tocExamples, topicDescriptions |
| Database Seeded | PostgreSQL database | Run `npm run seed` from backend |
| Exercises | Seed file exercises array | Easy/medium/hard difficulty levels |

---

## Topic Status Table

| # | Topic Name (EN) | Topic Name (HE) | Seed File | Registered | Frontend | Status |
|---|-----------------|-----------------|-----------|------------|----------|--------|
| 1 | Grammar Basics | יסודות דקדוק | topic1-grammar-basics.js | Yes | Yes | Complete |
| 2 | Verb "To Be" - Present | פועל להיות - הווה | topic2-to-be.js | Yes | Yes | Complete |
| 3 | Personal Pronouns & Possessives | כינויי גוף ושייכות | topic3-personal-pronouns.js | Yes | Yes | Complete |
| 4 | Nouns - Singular & Plural | שמות עצם - יחיד ורבים | topic4-nouns.js | Yes | Yes | Complete |
| 5 | Articles | מאמרים | topic5-articles.js | Yes | Yes | Complete |
| 6 | Demonstratives | מילות הצבעה | topic6-demonstratives.js | Yes | Yes | Complete |
| 7 | There is / There are | יש | topic7-there-is-are.js | Yes | Yes | Complete |
| 8 | Adjectives | שמות תואר | topic8-adjectives.js | Yes | Yes | Complete |
| 9 | Present Simple Tense | זמן הווה פשוט | topic9-present-simple.js | Yes | Yes | Complete |
| 10 | Question Words | מילות שאלה | topic10-question-words.js | Yes | Yes | Complete |
| 11 | Present Progressive | הווה ממושך | topic11-present-progressive.js | Yes | Yes | Complete |
| 12 | Can / Could | יכול / יכול היה | topic12-can-could.js | Yes | Yes | Complete |
| 13 | Prepositions of Place | מילות יחס - מקום | topic13-prepositions-place.js | Yes | Yes | Complete |
| 14 | Prepositions of Time | מילות יחס - זמן | topic14-prepositions-time.js | Yes | Yes | Complete |
| 15 | Past Simple Tense | עבר פשוט | topic15-past-simple.js | Yes | Yes | Complete |
| 16 | Going to | הולך ל | Missing | No | Yes | Planned |
| 17 | Future Simple - will | עתיד פשוט | Missing | No | Yes | Planned |
| 18 | Comparatives & Superlatives | דרגות השוואה | Missing | No | Yes | Planned |

### Status Legend

- **Complete**: All assets exist and are registered
- **Partial**: Seed file exists but not registered in seed-all-lessons.js
- **Planned**: Documented in topics.md and frontend, but no seed file
- **Missing**: Not yet documented

### Summary

- **Complete:** 15 topics (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15)
- **Planned:** 3 topics (16, 17, 18)

---

## Recent Activity Log

Track changes per topic with dates and descriptions.

### Topic 1: Grammar Basics
- Initial seed file created
- 2026-01-21: Registered in seed-all-lessons.js

### Topic 2: Verb "To Be" - Present
- Initial seed file created
- 2026-01-21: Fixed naming issue (seedTopic6 → seedTopic2)
- 2026-01-21: Registered in seed-all-lessons.js

### Topic 3: Personal Pronouns & Possessives
- Seed file created and registered in seed-all-lessons.js

### Topic 4: Nouns - Singular & Plural
- Initial seed file created
- 2026-01-21: Fixed naming issue (seedTopic5 → seedTopic4)
- 2026-01-21: Registered in seed-all-lessons.js

### Topic 5: Articles
- Seed file created and registered in seed-all-lessons.js

### Topic 6: Demonstratives
- Initial seed file created
- 2026-01-21: Fixed naming issue (seedTopic8 → seedTopic6)
- 2026-01-21: Registered in seed-all-lessons.js

### Topic 7: There is / There are
- Initial seed file created
- 2026-01-21: Registered in seed-all-lessons.js

### Topic 8: Adjectives
- Initial seed file created
- 2026-01-21: Fixed naming issue (seedTopic9 → seedTopic8)
- 2026-01-21: Registered in seed-all-lessons.js

### Topic 9: Present Simple Tense
- Seed file created and registered in seed-all-lessons.js

### Topic 10: Question Words
- Documented in topics.md
- Frontend mapping added
- 2026-01-21: Seed file created (7 subtopics, 140 exercises)
- 2026-01-21: Registered in seed-all-lessons.js

### Topic 11: Present Progressive
- Seed file created and registered in seed-all-lessons.js

### Topic 12: Can / Could
- Initial seed file created
- 2026-01-21: Registered in seed-all-lessons.js

### Topic 13: Prepositions of Place
- Initial seed file created
- 2026-01-21: Fixed naming issue (seedTopic10 → seedTopic13)
- 2026-01-21: Registered in seed-all-lessons.js

### Topic 14: Prepositions of Time
- Initial seed file created
- 2026-01-21: Fixed naming issue (seedTopic11 → seedTopic14)
- 2026-01-21: Registered in seed-all-lessons.js

### Topic 15: Past Simple Tense
- Seed file created and registered in seed-all-lessons.js

### Topic 16: Going to
- Documented in topics.md
- Frontend mapping added
- Seed file pending

### Topic 17: Future Simple - will
- Documented in topics.md
- Frontend mapping added
- Seed file pending

### Topic 18: Comparatives & Superlatives
- Documented in topics.md
- Frontend mapping added
- Seed file pending

---

## Next Steps (Priority)

1. **Register partial topics** - Add topics 1, 2, 4, 6, 7, 8, 12, 13, 14 to seed-all-lessons.js
2. **Create missing seed files** - Topics 10, 16, 17, 18
3. **Run database seed** - After registering all topics
