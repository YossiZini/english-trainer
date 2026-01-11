# Technical Implementation Guide

## Overview
This document provides technical guidelines for building the English Tutorial Web App, including architecture, database design, API specifications, and implementation details.

---

## 1. Architecture Overview

### High-Level Architecture
```
┌─────────────────────────────────────────────────────┐
│                   Client (Browser)                   │
│              React SPA + React Router                │
│                                                       │
│  Components:                                          │
│  - Auth (Login/Register)                             │
│  - Dashboard                                          │
│  - Topics Index                                       │
│  - Learning Page                                      │
│  - Exercise Page                                      │
│  - Results Page                                       │
│  - Progress Page                                      │
└───────────────────┬─────────────────────────────────┘
                    │ HTTPS / REST API
                    │ (JSON)
┌───────────────────▼─────────────────────────────────┐
│              Backend Server (Node.js)                │
│                Express.js + Middleware               │
│                                                       │
│  Routes:                                              │
│  - /api/auth       (authentication)                  │
│  - /api/lessons    (lesson content)                  │
│  - /api/exercises  (exercise questions)              │
│  - /api/progress   (user progress tracking)          │
│  - /api/results    (exercise results)                │
│  - /api/mistakes   (wrong answers tracking)          │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│              Database (MongoDB/PostgreSQL)           │
│                                                       │
│  Collections/Tables:                                  │
│  - users                                              │
│  - lessons                                            │
│  - exercises                                          │
│  - user_progress                                      │
│  - exercise_results                                   │
│  - wrong_answers (for retry functionality)            │
│  - achievements                                       │
└─────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### Frontend
- **Framework**: React 18+ with Hooks
- **Routing**: React Router v6
- **State Management**:
  - Context API for global state (user, auth)
  - Local state for component-specific data
  - Optional: Redux Toolkit for complex state
- **HTTP Client**: Axios
- **Styling**:
  - CSS Modules or Styled Components
  - Responsive design with CSS Grid/Flexbox
  - Optional: Material-UI or Ant Design for components
- **Form Handling**: React Hook Form
- **Validation**: Yup or Zod
- **Internationalization**: react-i18next (Hebrew + English)

### Backend
- **Runtime**: Node.js 18+ LTS
- **Framework**: Express.js 4.x
- **Authentication**:
  - JWT (jsonwebtoken)
  - bcryptjs for password hashing
- **Validation**: express-validator or Joi
- **Security**:
  - helmet (security headers)
  - cors (CORS configuration)
  - express-rate-limit (rate limiting)
- **Logging**: Winston or Morgan
- **Environment Variables**: dotenv

### Database
**Option A: MongoDB (NoSQL)**
- mongoose for ODM
- Good for flexible schema
- Easy to iterate during development

**Option B: PostgreSQL (SQL)**
- Sequelize or Prisma for ORM
- Better for complex relationships
- ACID compliance

**Recommendation**: PostgreSQL for data integrity and relationships

### Development Tools
- **Version Control**: Git
- **Package Manager**: npm or yarn
- **Linting**: ESLint + Prettier
- **Testing**:
  - Frontend: Jest + React Testing Library
  - Backend: Jest + Supertest
- **API Testing**: Postman or Thunder Client
- **Database GUI**: pgAdmin (PostgreSQL) or MongoDB Compass

---

## 3. Database Schema

### 3.1 Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  age INTEGER,
  current_level VARCHAR(50) DEFAULT 'beginner',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  total_time_spent INTEGER DEFAULT 0, -- in minutes
  current_streak INTEGER DEFAULT 0
);
```

**MongoDB equivalent:**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  passwordHash: String,
  age: Number,
  currentLevel: String,
  createdAt: Date,
  lastLogin: Date,
  totalTimeSpent: Number,
  currentStreak: Number
}
```

### 3.2 Lessons Table
```sql
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_number INTEGER NOT NULL,
  subtopic_number VARCHAR(10) NOT NULL, -- e.g., "1.3"
  title_en VARCHAR(255) NOT NULL,
  title_he VARCHAR(255) NOT NULL,
  level VARCHAR(50) NOT NULL, -- 'beginner', 'elementary', 'intermediate'
  order_index INTEGER NOT NULL,
  theory_content_he TEXT NOT NULL, -- HTML content in Hebrew
  theory_content_en TEXT, -- Optional English content
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(topic_number, subtopic_number)
);
```

### 3.3 Exercises Table
```sql
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'multiple_choice', 'fill_in_blank'
  question_text_he TEXT NOT NULL,
  question_text_en TEXT,
  options JSONB, -- for multiple choice: ["option1", "option2", "option3", "option4"]
  correct_answer TEXT NOT NULL,
  explanation_he TEXT NOT NULL,
  explanation_en TEXT,
  difficulty VARCHAR(50) DEFAULT 'medium', -- 'easy', 'medium', 'hard'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exercises_lesson ON exercises(lesson_id);
```

### 3.4 User Progress Table
```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL, -- 'not_started', 'in_progress', 'completed'
  best_score INTEGER DEFAULT 0, -- percentage 0-100
  attempts INTEGER DEFAULT 0,
  first_completed_at TIMESTAMP,
  last_attempted_at TIMESTAMP,
  time_spent INTEGER DEFAULT 0, -- in seconds
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_progress_user ON user_progress(user_id);
CREATE INDEX idx_progress_lesson ON user_progress(lesson_id);
```

### 3.5 Exercise Results Table (Detailed Results History)
```sql
CREATE TABLE exercise_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  wrong_answers INTEGER NOT NULL,
  score INTEGER NOT NULL, -- percentage
  time_spent INTEGER NOT NULL, -- in seconds
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_results_user ON exercise_results(user_id);
CREATE INDEX idx_results_lesson ON exercise_results(lesson_id);
CREATE INDEX idx_results_date ON exercise_results(completed_at);
```

### 3.6 Wrong Answers Table (For Retry Functionality) ⭐
```sql
CREATE TABLE wrong_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  user_answer TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  attempt_number INTEGER NOT NULL,
  is_reviewed BOOLEAN DEFAULT FALSE,
  is_corrected BOOLEAN DEFAULT FALSE, -- TRUE if answered correctly in retry
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  corrected_at TIMESTAMP
);

CREATE INDEX idx_wrong_answers_user ON wrong_answers(user_id);
CREATE INDEX idx_wrong_answers_lesson ON wrong_answers(lesson_id);
CREATE INDEX idx_wrong_answers_reviewed ON wrong_answers(user_id, is_reviewed);
```

**Purpose**: Track every wrong answer to enable:
- Review of mistakes after completing exercise
- "Retry Mistakes" feature - practice only questions you got wrong
- Analytics on which questions/concepts are most difficult
- Personalized recommendations

### 3.7 Achievements Table
```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en VARCHAR(100) NOT NULL,
  name_he VARCHAR(100) NOT NULL,
  description_en TEXT,
  description_he TEXT,
  icon VARCHAR(50), -- emoji or icon name
  requirement_type VARCHAR(50) NOT NULL, -- 'lessons_completed', 'perfect_score', 'streak', etc.
  requirement_value INTEGER NOT NULL
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, achievement_id)
);
```

---

## 4. API Endpoints Specification

### 4.1 Authentication Endpoints

#### POST /api/auth/register
**Request:**
```json
{
  "name": "David",
  "age": 11,
  "email": "parent@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "uuid-here",
    "name": "David",
    "token": "jwt-token-here"
  }
}
```

#### POST /api/auth/login
**Request:**
```json
{
  "email": "parent@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "uuid-here",
    "name": "David",
    "currentLevel": "beginner",
    "token": "jwt-token-here"
  }
}
```

#### POST /api/auth/logout
**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 4.2 Lesson Endpoints

#### GET /api/lessons
Get all lessons, optionally filtered by level

**Query Parameters:**
- `level` (optional): beginner/elementary/intermediate
- `topicNumber` (optional): filter by topic number

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "lesson-uuid-1",
      "topicNumber": 1,
      "subtopicNumber": "1.1",
      "titleEn": "Introduction to Present Simple",
      "titleHe": "מבוא לזמן הווה פשוט",
      "level": "beginner",
      "orderIndex": 1,
      "userProgress": {
        "status": "completed",
        "bestScore": 85,
        "attempts": 2
      }
    },
    {
      "id": "lesson-uuid-2",
      "topicNumber": 1,
      "subtopicNumber": "1.2",
      "titleEn": "Affirmative Sentences",
      "titleHe": "משפטים חיוביים",
      "level": "beginner",
      "orderIndex": 2,
      "userProgress": {
        "status": "in_progress",
        "bestScore": 60,
        "attempts": 1
      }
    }
  ]
}
```

#### GET /api/lessons/:lessonId
Get specific lesson with full theory content

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "lesson-uuid-1",
    "topicNumber": 1,
    "subtopicNumber": "1.3",
    "titleEn": "Negative Sentences",
    "titleHe": "משפטים שליליים",
    "level": "beginner",
    "theoryContentHe": "<h2>מבנה המשפט השלילי</h2><p>Subject + do/does + not + base verb</p>...",
    "theoryContentEn": null,
    "userProgress": {
      "status": "not_started",
      "bestScore": 0,
      "attempts": 0
    }
  }
}
```

---

### 4.3 Exercise Endpoints

#### GET /api/exercises/:lessonId
Get all exercises for a lesson

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "lessonId": "lesson-uuid-1",
    "lessonTitle": "Negative Sentences",
    "exercises": [
      {
        "id": "exercise-uuid-1",
        "questionNumber": 1,
        "type": "multiple_choice",
        "questionTextHe": "השלם את המשפט: He _______ like coffee.",
        "questionTextEn": "Complete the sentence: He _______ like coffee.",
        "options": ["don't", "doesn't", "isn't", "not"],
        "difficulty": "easy"
      },
      {
        "id": "exercise-uuid-2",
        "questionNumber": 2,
        "type": "fill_in_blank",
        "questionTextHe": "השלם עם don't או doesn't: They _______ play football.",
        "questionTextEn": "Fill with don't or doesn't: They _______ play football.",
        "difficulty": "easy"
      }
    ]
  }
}
```

**Note:** `correctAnswer` and `explanationHe` are NOT sent to client to prevent cheating

#### POST /api/exercises/check
Check a single answer (immediate feedback during exercise)

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "exerciseId": "exercise-uuid-1",
  "userAnswer": "doesn't"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "isCorrect": true,
    "correctAnswer": "doesn't",
    "explanationHe": "משתמשים ב-doesn't עבור he/she/it",
    "explanationEn": "We use doesn't for he/she/it"
  }
}
```

#### POST /api/exercises/submit
Submit complete exercise results

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "lessonId": "lesson-uuid-1",
  "answers": [
    {
      "exerciseId": "exercise-uuid-1",
      "userAnswer": "doesn't",
      "isCorrect": true
    },
    {
      "exerciseId": "exercise-uuid-2",
      "userAnswer": "don't",
      "isCorrect": true
    },
    {
      "exerciseId": "exercise-uuid-3",
      "userAnswer": "don't",
      "isCorrect": false
    }
  ],
  "timeSpent": 480 // seconds
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "resultId": "result-uuid-1",
    "totalQuestions": 15,
    "correctAnswers": 12,
    "wrongAnswers": 3,
    "score": 80,
    "isPassed": true,
    "attemptNumber": 1,
    "timeSpent": 480,
    "wrongAnswersCount": 3,
    "nextLesson": {
      "id": "lesson-uuid-2",
      "titleHe": "שאלות כן/לא"
    }
  }
}
```

#### GET /api/exercises/:lessonId/mistakes ⭐
Get all wrong answers for a specific lesson (for review/retry)

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `onlyNotCorrected` (optional): boolean - only show mistakes not yet corrected

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "lessonId": "lesson-uuid-1",
    "lessonTitle": "Negative Sentences",
    "totalMistakes": 5,
    "notCorrected": 3,
    "mistakes": [
      {
        "id": "mistake-uuid-1",
        "exercise": {
          "id": "exercise-uuid-3",
          "questionTextHe": "השלם: She _______ eat meat.",
          "type": "fill_in_blank",
          "options": null
        },
        "userAnswer": "don't",
        "correctAnswer": "doesn't",
        "explanationHe": "עבור she משתמשים ב-doesn't",
        "attemptNumber": 1,
        "isCorrected": false,
        "createdAt": "2026-01-10T10:30:00Z"
      }
    ]
  }
}
```

#### POST /api/exercises/retry-mistakes
Practice only the questions that were answered incorrectly

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "lessonId": "lesson-uuid-1",
  "onlyNotCorrected": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "lessonId": "lesson-uuid-1",
    "retryExercises": [
      {
        "id": "exercise-uuid-3",
        "questionNumber": 3,
        "type": "fill_in_blank",
        "questionTextHe": "השלם: She _______ eat meat.",
        "mistakeId": "mistake-uuid-1",
        "previousAnswer": "don't"
      },
      {
        "id": "exercise-uuid-7",
        "questionNumber": 7,
        "type": "multiple_choice",
        "questionTextHe": "בחר את התשובה הנכונה...",
        "options": ["...", "...", "...", "..."],
        "mistakeId": "mistake-uuid-2",
        "previousAnswer": "option2"
      }
    ]
  }
}
```

---

### 4.4 Progress Endpoints

#### GET /api/progress
Get current user's overall progress

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "user-uuid-1",
    "overallStats": {
      "totalLessons": 30,
      "completedLessons": 8,
      "averageScore": 82,
      "totalTimeSpent": 320, // minutes
      "currentStreak": 5,
      "currentLevel": "beginner"
    },
    "topicProgress": [
      {
        "topicNumber": 1,
        "topicTitle": "Present Simple",
        "totalSubtopics": 6,
        "completedSubtopics": 4,
        "progressPercentage": 67,
        "averageScore": 85
      }
    ],
    "recentActivity": [
      {
        "lessonTitle": "Negative Sentences",
        "score": 80,
        "completedAt": "2026-01-10T10:30:00Z"
      }
    ]
  }
}
```

#### GET /api/progress/lessons/:lessonId
Get detailed progress for specific lesson

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "lessonId": "lesson-uuid-1",
    "lessonTitle": "Negative Sentences",
    "status": "completed",
    "bestScore": 80,
    "attempts": 2,
    "timeSpent": 600,
    "firstCompletedAt": "2026-01-09T14:20:00Z",
    "lastAttemptedAt": "2026-01-10T10:30:00Z",
    "attemptHistory": [
      {
        "attemptNumber": 1,
        "score": 60,
        "completedAt": "2026-01-09T14:20:00Z",
        "timeSpent": 420
      },
      {
        "attemptNumber": 2,
        "score": 80,
        "completedAt": "2026-01-10T10:30:00Z",
        "timeSpent": 480
      }
    ],
    "wrongAnswersCount": 3,
    "correctedMistakes": 1
  }
}
```

#### GET /api/progress/stats
Get statistics for dashboard and charts

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `period` (optional): day/week/month/all

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "scoresTrend": [
      { "date": "2026-01-08", "averageScore": 75 },
      { "date": "2026-01-09", "averageScore": 80 },
      { "date": "2026-01-10", "averageScore": 85 }
    ],
    "timeByTopic": [
      { "topic": "Present Simple", "minutes": 180 },
      { "topic": "Pronouns", "minutes": 140 }
    ],
    "completionRate": {
      "beginner": 80,
      "elementary": 0,
      "intermediate": 0
    }
  }
}
```

---

### 4.5 Achievement Endpoints

#### GET /api/achievements
Get all available achievements and user's earned achievements

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "earned": [
      {
        "id": "achievement-uuid-1",
        "nameEn": "First Lesson Complete",
        "nameHe": "השיעור הראשון הושלם",
        "icon": "🏆",
        "earnedAt": "2026-01-08T10:00:00Z"
      }
    ],
    "available": [
      {
        "id": "achievement-uuid-2",
        "nameEn": "5 Lessons Streak",
        "nameHe": "רצף של 5 שיעורים",
        "icon": "🔥",
        "progress": 3,
        "required": 5
      }
    ]
  }
}
```

---

## 5. Frontend Structure

### Directory Structure
```
/frontend
├── /public
│   ├── index.html
│   └── favicon.ico
├── /src
│   ├── /components
│   │   ├── /common
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── Header.jsx
│   │   ├── /auth
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── /dashboard
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ProgressCard.jsx
│   │   │   └── QuickStats.jsx
│   │   ├── /topics
│   │   │   ├── TopicsIndex.jsx
│   │   │   ├── TopicCard.jsx
│   │   │   └── SubtopicList.jsx
│   │   ├── /learn
│   │   │   ├── LearningPage.jsx
│   │   │   └── TheoryContent.jsx
│   │   ├── /exercise
│   │   │   ├── ExercisePage.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── MultipleChoice.jsx
│   │   │   ├── FillInBlank.jsx
│   │   │   └── FeedbackModal.jsx
│   │   ├── /results
│   │   │   ├── ResultsPage.jsx
│   │   │   ├── ScoreDisplay.jsx
│   │   │   └── MistakesReview.jsx ⭐
│   │   └── /progress
│   │       ├── ProgressPage.jsx
│   │       ├── ProgressChart.jsx
│   │       └── AchievementsList.jsx
│   ├── /context
│   │   ├── AuthContext.jsx
│   │   └── ProgressContext.jsx
│   ├── /hooks
│   │   ├── useAuth.js
│   │   ├── useLessons.js
│   │   ├── useExercises.js
│   │   └── useMistakes.js ⭐
│   ├── /services
│   │   ├── api.js (axios instance)
│   │   ├── authService.js
│   │   ├── lessonService.js
│   │   ├── exerciseService.js
│   │   └── progressService.js
│   ├── /utils
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── constants.js
│   ├── /styles
│   │   ├── global.css
│   │   └── variables.css
│   ├── App.jsx
│   ├── routes.jsx
│   └── index.jsx
├── package.json
└── .env.example
```

---

## 6. Backend Structure

### Directory Structure
```
/backend
├── /src
│   ├── /config
│   │   ├── database.js
│   │   └── jwt.js
│   ├── /models
│   │   ├── User.js
│   │   ├── Lesson.js
│   │   ├── Exercise.js
│   │   ├── UserProgress.js
│   │   ├── ExerciseResult.js
│   │   ├── WrongAnswer.js ⭐
│   │   └── Achievement.js
│   ├── /routes
│   │   ├── auth.routes.js
│   │   ├── lesson.routes.js
│   │   ├── exercise.routes.js
│   │   ├── progress.routes.js
│   │   └── achievement.routes.js
│   ├── /controllers
│   │   ├── auth.controller.js
│   │   ├── lesson.controller.js
│   │   ├── exercise.controller.js
│   │   ├── progress.controller.js
│   │   └── achievement.controller.js
│   ├── /middleware
│   │   ├── auth.middleware.js
│   │   ├── validation.middleware.js
│   │   └── error.middleware.js
│   ├── /services
│   │   ├── auth.service.js
│   │   ├── lesson.service.js
│   │   ├── exercise.service.js
│   │   ├── progress.service.js
│   │   ├── mistakes.service.js ⭐
│   │   └── achievement.service.js
│   ├── /utils
│   │   ├── logger.js
│   │   └── helpers.js
│   ├── /validators
│   │   ├── auth.validator.js
│   │   ├── exercise.validator.js
│   │   └── lesson.validator.js
│   ├── app.js
│   └── server.js
├── /tests
│   ├── /unit
│   └── /integration
├── package.json
├── .env.example
└── README.md
```

---

## 7. Key Features Implementation

### 7.1 Wrong Answer Tracking & Retry System ⭐

#### Flow:
1. **During Exercise Submission**:
   - When user submits exercise results, store all wrong answers in `wrong_answers` table
   - Record: user_id, lesson_id, exercise_id, user_answer, correct_answer, attempt_number

2. **After Exercise - Review Mistakes**:
   - Results page shows button: "Review Mistakes" (סקור טעויות)
   - Clicking shows all wrong answers with explanations
   - Each mistake shows: question, user's answer, correct answer, explanation

3. **Retry Mistakes Feature**:
   - Results page shows button: "Retry Mistakes" (נסה שוב טעויות)
   - Loads ONLY questions that were answered incorrectly
   - User practices just those questions
   - When answered correctly, mark `is_corrected = TRUE` in `wrong_answers` table

4. **Progress Tracking**:
   - Dashboard shows: "X mistakes to review"
   - Can access mistakes from progress page
   - Filter mistakes by: all/not corrected/by lesson

#### Backend Service: `mistakes.service.js`
```javascript
class MistakesService {
  // Store wrong answers after exercise submission
  async recordWrongAnswers(userId, lessonId, wrongAnswers, attemptNumber) {
    // Insert multiple wrong answers into database
  }

  // Get all mistakes for a lesson
  async getLessonMistakes(userId, lessonId, onlyNotCorrected = false) {
    // Query wrong_answers with exercise details
  }

  // Get all user's mistakes across all lessons
  async getAllUserMistakes(userId, onlyNotCorrected = false) {
    // Query with aggregation/join
  }

  // Mark mistake as reviewed
  async markAsReviewed(mistakeId) {
    // Update is_reviewed = true
  }

  // Mark mistake as corrected (answered correctly in retry)
  async markAsCorrected(mistakeId) {
    // Update is_corrected = true, corrected_at = now
  }

  // Get exercises for retry (only wrong answers)
  async getRetryExercises(userId, lessonId, onlyNotCorrected = true) {
    // Get unique exercise IDs from wrong_answers
    // Fetch full exercise details
    // Return with previous wrong answer info
  }
}
```

#### Frontend Hook: `useMistakes.js`
```javascript
export const useMistakes = () => {
  const [mistakes, setMistakes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMistakes = async (lessonId, onlyNotCorrected = false) => {
    // API call to get mistakes
  };

  const retryMistakes = async (lessonId) => {
    // API call to get retry exercises
  };

  const markCorrected = async (mistakeId) => {
    // API call to mark as corrected
  };

  return { mistakes, loading, fetchMistakes, retryMistakes, markCorrected };
};
```

### 7.2 Progress Unlocking Logic

```javascript
// Check if next lesson should be unlocked
async function checkAndUnlockNextLesson(userId, currentLessonId, score) {
  const PASSING_SCORE = 70;

  if (score >= PASSING_SCORE) {
    // Get next lesson by order_index
    const nextLesson = await Lesson.findNextLesson(currentLessonId);

    if (nextLesson) {
      // Create or update progress for next lesson
      await UserProgress.findOrCreate({
        userId,
        lessonId: nextLesson.id,
        status: 'not_started'
      });
    }

    return nextLesson;
  }

  return null;
}
```

### 7.3 Achievement System

```javascript
// Check and award achievements after each exercise
async function checkAchievements(userId) {
  const achievements = [];

  // Check various achievement conditions
  const completedLessons = await UserProgress.count({
    where: { userId, status: 'completed' }
  });

  if (completedLessons === 1) {
    achievements.push(await awardAchievement(userId, 'FIRST_LESSON'));
  }

  if (completedLessons === 10) {
    achievements.push(await awardAchievement(userId, 'TEN_LESSONS'));
  }

  // Check for perfect scores
  const perfectScores = await ExerciseResult.count({
    where: { userId, score: 100 }
  });

  if (perfectScores === 1) {
    achievements.push(await awardAchievement(userId, 'PERFECT_SCORE'));
  }

  return achievements;
}
```

### 7.4 Streak Tracking

```javascript
// Update user streak on login/completion
async function updateStreak(userId) {
  const user = await User.findByPk(userId);
  const lastLogin = user.lastLogin;
  const today = new Date();

  const daysDiff = Math.floor((today - lastLogin) / (1000 * 60 * 60 * 24));

  if (daysDiff === 1) {
    // Continue streak
    user.currentStreak += 1;
  } else if (daysDiff > 1) {
    // Streak broken
    user.currentStreak = 1;
  }
  // Same day = no change

  user.lastLogin = today;
  await user.save();

  return user.currentStreak;
}
```

---

## 8. Security Considerations

### 8.1 Authentication
- Password hashing with bcrypt (min 10 rounds)
- JWT tokens with expiration (e.g., 7 days)
- Refresh token mechanism (optional)
- HTTPS only in production
- Secure cookies with httpOnly flag

### 8.2 Authorization
- Middleware to verify JWT on protected routes
- Users can only access their own data
- Validate user ownership before operations

### 8.3 Input Validation
- Validate all user inputs on backend
- Sanitize HTML content in lesson theory
- Prevent SQL injection (use parameterized queries)
- Rate limiting on auth endpoints

### 8.4 Data Protection
- Don't send correct answers to client before submission
- Don't send password hashes to client
- Encrypt sensitive data at rest (optional)

---

## 9. Development Workflow

### 9.1 Setup Steps
1. Clone repository
2. Install dependencies: `npm install` (both frontend and backend)
3. Set up database (PostgreSQL or MongoDB)
4. Create `.env` file with environment variables
5. Run database migrations/seeds
6. Start backend: `npm run dev`
7. Start frontend: `npm start`

### 9.2 Environment Variables

**Backend `.env`:**
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/english_tutorial
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=7d
CORS_ORIGIN=http://localhost:3000
```

**Frontend `.env`:**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

### 9.3 Git Workflow
- Main branch: `main` (production)
- Development branch: `develop`
- Feature branches: `feature/feature-name`
- Bug fixes: `bugfix/bug-name`
- Pull requests required for merging to main

---

## 10. Testing Strategy

### 10.1 Backend Testing
- **Unit Tests**: Test individual functions/services
- **Integration Tests**: Test API endpoints
- **Database Tests**: Test models and queries
- Coverage target: 80%+

### 10.2 Frontend Testing
- **Component Tests**: Test React components
- **Integration Tests**: Test user flows
- **E2E Tests**: Cypress or Playwright (optional)

### 10.3 Test Examples

**Backend Test (Jest + Supertest):**
```javascript
describe('POST /api/exercises/submit', () => {
  it('should record wrong answers and return results', async () => {
    const response = await request(app)
      .post('/api/exercises/submit')
      .set('Authorization', `Bearer ${token}`)
      .send({
        lessonId: 'lesson-id',
        answers: [...],
        timeSpent: 300
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.wrongAnswersCount).toBe(3);
  });
});
```

---

## 11. Deployment

### 11.1 Deployment Options

**Frontend:**
- Vercel (recommended for React)
- Netlify
- AWS S3 + CloudFront

**Backend:**
- Heroku
- Railway
- AWS EC2/Elastic Beanstalk
- DigitalOcean

**Database:**
- PostgreSQL: Heroku Postgres, Railway, AWS RDS
- MongoDB: MongoDB Atlas

### 11.2 Deployment Checklist
- [ ] Set environment variables in hosting platform
- [ ] Set up database and run migrations
- [ ] Configure CORS for production domain
- [ ] Set up SSL certificates (HTTPS)
- [ ] Configure logging and monitoring
- [ ] Set up automated backups for database
- [ ] Test all features in production
- [ ] Set up error tracking (e.g., Sentry)

---

## 12. Performance Optimization

### 12.1 Frontend
- Code splitting with React.lazy()
- Image optimization
- Caching API responses
- Minimize bundle size
- Service worker for offline support (PWA)

### 12.2 Backend
- Database indexing on frequently queried fields
- Caching with Redis (optional)
- Pagination for large data sets
- Query optimization (avoid N+1 queries)
- Connection pooling

### 12.3 Database
- Index on foreign keys
- Index on frequently filtered fields (user_id, lesson_id)
- Regular VACUUM (PostgreSQL)
- Monitor slow queries

---

## 13. Monitoring & Analytics

### 13.1 Application Monitoring
- Error tracking (Sentry, Rollbar)
- Performance monitoring (New Relic, DataDog)
- Uptime monitoring (UptimeRobot, Pingdom)

### 13.2 User Analytics
- Track lesson completion rates
- Average time per lesson
- Common mistakes (most failed questions)
- User engagement metrics (DAU, MAU)
- Drop-off points

---

## 14. Future Technical Enhancements

### Phase 2+
- **Real-time features**: WebSockets for live feedback
- **Mobile app**: React Native version
- **Offline mode**: PWA with service workers
- **Audio support**: Text-to-speech for pronunciation
- **AI-powered recommendations**: Personalized learning paths
- **Admin panel**: CMS for content management
- **Analytics dashboard**: Teacher/parent insights
- **Gamification**: Leaderboards, competitions
- **Social features**: Friend comparisons, sharing achievements

---

**Version:** 1.0
**Last Updated:** January 10, 2026
