# Web App Flow & Structure Guide

## Overview
This document describes the user interface flow and navigation structure for the English Tutorial Web App.

---

## Application Flow Diagram

```
Landing Page (Login/Register)
         ↓
    Dashboard (Home)
         ↓
   Topics Index Page
         ↓
    ┌────────────┐
    ↓            ↓
Learning Page  Exercise Page
    ↓            ↓
    └─→ Results & Progress ←┘
         ↓
   Back to Topics Index
```

---

## 1. Landing Page (Login/Register)

### URL: `/`

**First-Time Users:**
- Welcome message in Hebrew: "ברוכים הבאים לאפליקציית לימוד אנגלית!"
- Registration form:
  - Name (שם)
  - Age (גיל)
  - Email (optional - for parent)
  - Password (סיסמה)
  - Register button
- Link to login if already registered

**Returning Users:**
- Login form:
  - Name or Email
  - Password
  - Login button
- Link to register if new user

---

## 2. Dashboard (Home Page)

### URL: `/dashboard`

**Components:**
- Welcome message: "שלום [שם התלמיד]!"
- Progress summary card:
  - Completed lessons: X/30
  - Current level: Beginner/Elementary/Intermediate
  - Overall score: X%
- Quick stats:
  - Lessons completed today: X
  - Current streak: X days
  - Total time spent: X hours
- Action buttons:
  - "המשך ללמוד" (Continue Learning) → Go to last lesson
  - "כל הנושאים" (All Topics) → Go to Topics Index
  - "ההתקדמות שלי" (My Progress) → Go to Progress Page

---

## 3. Topics Index Page (Main Navigation)

### URL: `/topics`

**Layout:**
- Page title: "נושאים ללימוד" (Topics to Learn)
- Filter/Sort options:
  - All Topics
  - By Level: Beginner / Elementary / Intermediate
  - Completed / Not Started / In Progress

**Topics List Structure:**

Each topic is displayed as an expandable card:

```
┌─────────────────────────────────────────────────────┐
│ 📚 Topic 1: Present Simple (זמן הווה פשוט)          │
│ Level: Beginner | Progress: 3/6 completed            │
│ [Expand ▼]                                           │
│                                                      │
│ Sub-topics:                                          │
│   1.1 Introduction to Present Simple                │
│       [📖 Learn] [✏️ Practice]  ✅ Completed         │
│                                                      │
│   1.2 Affirmative Sentences                         │
│       [📖 Learn] [✏️ Practice]  ✅ Completed         │
│                                                      │
│   1.3 Negative Sentences                            │
│       [📖 Learn] [✏️ Practice]  ⏳ In Progress       │
│                                                      │
│   1.4 Yes/No Questions                              │
│       [📖 Learn] [✏️ Practice]  🔒 Locked            │
│                                                      │
│   1.5 Wh- Questions                                 │
│       [📖 Learn] [✏️ Practice]  🔒 Locked            │
│                                                      │
│   1.6 Frequency Adverbs                             │
│       [📖 Learn] [✏️ Practice]  🔒 Locked            │
└─────────────────────────────────────────────────────┘
```

**Interaction:**
- Click topic card to expand/collapse sub-topics
- Click **[📖 Learn]** button → Navigate to Learning Page for that sub-topic
- Click **[✏️ Practice]** button → Navigate to Exercise Page for that sub-topic
- Locked sub-topics (🔒) require completing previous sub-topics first
- Completed sub-topics show ✅ checkmark
- In-progress sub-topics show ⏳ icon

**Status Indicators:**
- ✅ Completed (score ≥ 70%)
- ⏳ In Progress (started but not completed)
- 🔒 Locked (prerequisites not met)
- ⭐ Perfect Score (100%)

---

## 4. Learning Page (Theory Section)

### URL: `/learn/:topicId/:subtopicId`

**Example:** `/learn/1/1.3` (Topic 1, Sub-topic 1.3 - Negative Sentences)

**Layout:**

**Header:**
- Breadcrumb navigation: Topics > Topic 1: Present Simple > 1.3 Negative Sentences
- Progress indicator: "Sub-topic 3 of 6"

**Content Area:**
- **Title (bilingual):**
  - English: "Negative Sentences"
  - Hebrew: "משפטים שליליים"

- **Theory Content:**
  - Hebrew explanation with English examples
  - Structure formulas
  - Examples with translations
  - Visual aids (tables, diagrams)
  - Common mistakes section
  - Tips and tricks

**Footer Navigation:**
- [← Previous Sub-topic] button
- [Practice Now ✏️] button (go to exercises for this sub-topic)
- [Next Sub-topic →] button
- [Back to Topics 🏠] button

**Example Content Display:**
```
┌─────────────────────────────────────────────────────┐
│ 1.3 Negative Sentences (משפטים שליליים)             │
├─────────────────────────────────────────────────────┤
│                                                      │
│ מבנה המשפט השלילי:                                   │
│ Subject + do/does + not + base verb                 │
│                                                      │
│ עבור I/You/We/They:                                 │
│   - I don't like coffee.                            │
│   - They don't play tennis.                         │
│                                                      │
│ עבור He/She/It:                                     │
│   - He doesn't watch TV.                            │
│   - She doesn't eat meat.                           │
│                                                      │
│ ⚠️ שים לב! הפועל חוזר לצורת הבסיס:                  │
│   ❌ He doesn't plays                                │
│   ✅ He doesn't play                                 │
│                                                      │
│ [תרגול עכשיו]                                        │
└─────────────────────────────────────────────────────┘
```

---

## 5. Exercise Page (Practice Section)

### URL: `/exercise/:topicId/:subtopicId`

**Example:** `/exercise/1/1.3`

**Layout:**

**Header:**
- Title: "תרגול: Negative Sentences"
- Progress bar: Question X of 15
- Timer (optional): Time spent
- Score counter: Current score

**Question Display:**

**Type 1: Multiple Choice**
```
┌─────────────────────────────────────────────────────┐
│ Question 3 of 15                          Score: 2/2 │
├─────────────────────────────────────────────────────┤
│                                                      │
│ השלם את המשפט:                                       │
│ He _______ like coffee.                             │
│                                                      │
│ ○ A) don't                                          │
│ ○ B) doesn't                                        │
│ ○ C) isn't                                          │
│ ○ D) not                                            │
│                                                      │
│ [Submit Answer]                                      │
└─────────────────────────────────────────────────────┘
```

**Type 2: Fill in the Blank**
```
┌─────────────────────────────────────────────────────┐
│ Question 5 of 15                          Score: 4/4 │
├─────────────────────────────────────────────────────┤
│                                                      │
│ השלם עם don't או doesn't:                           │
│ They _______ play football on Mondays.              │
│                                                      │
│ Answer: [____________]                              │
│                                                      │
│ [Check Answer]                                       │
└─────────────────────────────────────────────────────┘
```

**After Submitting Answer:**

**Correct Answer:**
```
┌─────────────────────────────────────────────────────┐
│ ✅ נכון! (Correct!)                                  │
├─────────────────────────────────────────────────────┤
│ He doesn't like coffee.                             │
│                                                      │
│ הסבר: משתמשים ב-doesn't עבור he/she/it              │
│                                                      │
│ [Next Question →]                                    │
└─────────────────────────────────────────────────────┘
```

**Wrong Answer:**
```
┌─────────────────────────────────────────────────────┐
│ ❌ לא נכון (Incorrect)                               │
├─────────────────────────────────────────────────────┤
│ Your answer: don't                                  │
│ Correct answer: doesn't                             │
│                                                      │
│ הסבר: עבור he/she/it משתמשים ב-doesn't ולא don't    │
│ דוגמאות:                                             │
│   ✅ He doesn't play                                 │
│   ✅ I don't play                                    │
│                                                      │
│ [Try Again] [Next Question →]                       │
└─────────────────────────────────────────────────────┘
```

**Navigation:**
- "Next Question" button (after answering)
- "Previous Question" button (review mode)
- "Exit Exercise" button (with confirmation dialog)

---

## 6. Results Page

### URL: `/results/:topicId/:subtopicId`

**Displayed after completing all exercises**

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│              🎉 תרגול הושלם!                        │
│           Exercise Completed!                        │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Topic: Present Simple - Negative Sentences          │
│                                                      │
│  📊 Your Score: 12/15 (80%)                         │
│  ⏱️ Time: 8 minutes                                 │
│  ⭐ Grade: Very Good! (טוב מאוד!)                   │
│                                                      │
│  Breakdown:                                          │
│  ✅ Correct answers: 12                              │
│  ❌ Wrong answers: 3                                 │
│                                                      │
│  💡 Areas to improve:                                │
│  - Using doesn't vs don't (1 mistake)               │
│  - Word order in questions (2 mistakes)             │
│                                                      │
│  [Review Mistakes] [Try Again] [Next Sub-topic →]   │
│  [Back to Topics]                                    │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Actions:**
- **Review Mistakes**: Show all questions with wrong answers and explanations
- **Try Again**: Restart exercise with new/shuffled questions
- **Next Sub-topic**: Continue to next sub-topic's learning page
- **Back to Topics**: Return to Topics Index

**Progress Update:**
- Score is saved to user's progress
- Sub-topic marked as completed if score ≥ 70%
- Next sub-topic is unlocked
- Achievements/badges awarded if applicable

---

## 7. Progress Page

### URL: `/progress`

**Layout:**

**Overall Statistics:**
- Total lessons completed: X/30
- Average score: X%
- Total time spent: X hours
- Current streak: X days
- Level: Beginner/Elementary/Intermediate

**Progress by Topic:**
```
┌─────────────────────────────────────────────────────┐
│ Topic 1: Present Simple                             │
│ Progress: ████████░░ 80% (4/5 completed)            │
│                                                      │
│ Completed Sub-topics:                                │
│ ✅ 1.1 Introduction - Score: 85% - Date: 10/01/26   │
│ ✅ 1.2 Affirmative Sentences - Score: 90%           │
│ ✅ 1.3 Negative Sentences - Score: 80%              │
│ ✅ 1.4 Yes/No Questions - Score: 75%                │
│ ⏳ 1.5 Wh- Questions - In Progress                   │
│                                                      │
│ [Continue Topic]                                     │
└─────────────────────────────────────────────────────┘
```

**Achievements Section:**
- 🏆 First Lesson Complete
- 🌟 5 Lessons Streak
- 💯 Perfect Score (100%)
- 📚 Topic Master (complete all sub-topics in one topic)
- 🔥 7-Day Streak

**Charts & Graphs:**
- Score trends over time (line chart)
- Time spent per topic (bar chart)
- Completion rate by topic (pie chart)

---

## 8. Navigation Structure Summary

### Main Menu (Always Visible)
```
┌─────────────────────────────────────────────────────┐
│ 🏠 Dashboard | 📚 Topics | 📈 Progress | ⚙️ Settings │
│                                      [Logout 🚪]     │
└─────────────────────────────────────────────────────┘
```

### URL Structure
```
/                           → Landing/Login page
/dashboard                  → Dashboard home
/topics                     → Topics index (main navigation)
/learn/:topicId/:subtopicId → Learning page (theory)
/exercise/:topicId/:subtopicId → Exercise page (practice)
/results/:topicId/:subtopicId → Results after exercise
/progress                   → Progress tracking page
/settings                   → User settings
```

---

## 9. User Interaction Rules

### Unlocking System
1. Sub-topics unlock sequentially within a topic
2. Must complete previous sub-topic with ≥70% score to unlock next
3. Can retry exercises unlimited times to improve score
4. Topics are available in order (Topic 1 → Topic 2 → Topic 3)

### Progress Tracking
- Auto-save progress after each question
- Can exit exercise and resume later
- Score is recorded only on completion
- Best score is saved if retrying

### Feedback & Encouragement
- Positive messages for correct answers
- Constructive explanations for wrong answers
- Celebration animations for completing topics
- Progress milestones highlighted

---

## 10. Mobile Responsive Considerations

**Desktop (>1024px):**
- Side navigation always visible
- Topics list in grid (2-3 columns)
- Split view for learning (content + progress)

**Tablet (768px - 1024px):**
- Collapsible side navigation
- Topics list in 2 columns
- Single column content

**Mobile (<768px):**
- Bottom navigation bar
- Topics list in single column
- Simplified layouts
- Touch-friendly buttons (min 44px)

---

## 11. Special Pages

### 404 Not Found
- Friendly message in Hebrew
- Link back to Dashboard or Topics

### Error Page
- Generic error message
- Option to report issue
- Link back to safe page

### Loading States
- Skeleton screens while loading content
- Spinner for quick operations
- Progress indicators for long operations

---

**Version:** 1.0
**Last Updated:** January 10, 2026
