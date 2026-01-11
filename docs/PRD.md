# Product Requirements Document (PRD)
## English Tutorial App for Hebrew-Speaking Children

---

## 1. Overview

### Project Goal
Create a web-based English learning platform designed for Hebrew-speaking children (ages 10-12) that provides progressive, grammar-focused instruction with interactive exercises and progress tracking.

### Vision
Empower young Hebrew speakers to master English grammar through structured, engaging lessons that adapt to their learning pace, with clear explanations in Hebrew and immediate feedback.

---

## 2. Target Audience

**Primary User**: Hebrew-speaking children, ages 10-12
- Native Hebrew speakers learning English
- School-age students needing grammar reinforcement
- Self-motivated learners who benefit from structured progression

**Secondary User**: Parents
- Monitor child's progress
- Understand learning outcomes
- Support at-home learning

---

## 3. Key Features

### 3.1 Core Learning Features

#### Theory Sections
- **Hebrew explanations** of English grammar concepts
- Clear examples with translations
- Visual aids and diagrams where helpful
- Age-appropriate language and tone

#### Exercise System
- **Multiple choice questions** for concept validation
- **Fill-in-the-blank exercises** for practical application
- Immediate feedback on answers
- Explanation of correct answers (in Hebrew)
- Retry capability for incorrect answers
- **Mistake Tracking**: All wrong answers are recorded for review and practice
- **Retry Mistakes Feature**: Practice only the questions answered incorrectly
- **Review Mode**: After completing exercises, review all mistakes with explanations

#### Progressive Difficulty
- Lessons organized by difficulty level (Beginner → Elementary → Intermediate)
- Topics unlock as previous topics are mastered
- Adaptive difficulty based on performance

### 3.2 Progress Tracking Features

- **User Authentication**: Individual student accounts
- **Progress Dashboard**:
  - Completed lessons
  - Current level
  - Overall score/accuracy
  - Time spent learning
  - **Mistakes to review** counter with quick access
- **Lesson History**: Track performance per topic
- **Mistake History**: View all wrong answers across lessons
  - Filter by lesson or difficulty
  - See which mistakes have been corrected
  - Track improvement on challenging questions
- **Achievements**: Milestone badges (e.g., "10 lessons completed", "Perfect score on Present Tense")
- **Detailed Results**: For each exercise attempt:
  - Score and time spent
  - Question-by-question breakdown
  - Areas needing improvement
  - Option to retry all or retry only mistakes

### 3.3 Content Structure

#### Grammar Topics (Organized by Difficulty)

**Beginner Level**:
- Parts of speech (Nouns, Verbs, Adjectives)
- Present Simple tense
- Articles (a, an, the)
- Basic sentence structure
- Pronouns (I, you, he, she, it, we, they)
- Singular vs Plural

**Elementary Level**:
- Past Simple tense
- Future Simple tense (will)
- Present Continuous
- Question formation (What, Where, When, Who, Why, How)
- Prepositions of place and time
- Comparative and Superlative adjectives

**Intermediate Level**:
- Present Perfect tense
- Past Continuous
- Conditional sentences (if/then)
- Modal verbs (can, could, should, must, may)
- Passive voice basics
- Reported speech

---

## 4. User Experience Flow

### 4.1 First-Time User
1. Landing page with welcome message (Hebrew)
2. Account creation (name, age, optional parent email)
3. Brief introduction tour of the platform
4. Start with Beginner level, Lesson 1

### 4.2 Returning User
1. Login
2. Dashboard showing:
   - Current progress
   - Continue where you left off
   - Available lessons
   - Recent achievements
3. Select lesson or continue from last position

### 4.3 Lesson Flow
1. **Theory Page**: Read explanation with examples (Hebrew + English)
2. **Exercise Set**: 10-15 questions per lesson
3. **Results**: Score, correct answers, explanations
4. **Next Steps**: Continue to next lesson or retry for better score

---

## 5. Technical Architecture

### 5.1 Technology Stack

**Frontend**:
- **React**: Component-based UI
- **React Router**: Navigation between lessons and pages
- **CSS/Styled Components**: Responsive design for desktop and tablet
- **Axios**: API communication

**Backend**:
- **Node.js + Express**: RESTful API server
- **Database**: MongoDB or PostgreSQL
  - User accounts and authentication
  - Progress tracking
  - Lesson content storage
  - Score history

**Authentication**:
- JWT (JSON Web Tokens) for session management
- Secure password hashing (bcrypt)

**Deployment**:
- Frontend: Vercel or Netlify
- Backend: Heroku, Railway, or AWS
- Database: MongoDB Atlas or hosted PostgreSQL

### 5.2 Data Models

#### User
```javascript
{
  id: UUID,
  name: String,
  age: Number,
  email: String (optional, for parents),
  password: Hash,
  currentLevel: String (beginner/elementary/intermediate),
  createdAt: Date,
  lastLogin: Date
}
```

#### Lesson
```javascript
{
  id: UUID,
  topic: String,
  level: String,
  order: Number,
  theory: {
    titleHe: String,
    titleEn: String,
    contentHe: String, // HTML content
    examples: Array
  },
  exercises: Array<Exercise>
}
```

#### Exercise
```javascript
{
  id: UUID,
  lessonId: UUID,
  type: String (multiple_choice/fill_in_blank),
  questionHe: String,
  questionEn: String,
  options: Array (for multiple choice),
  correctAnswer: String,
  explanationHe: String
}
```

#### Progress
```javascript
{
  id: UUID,
  userId: UUID,
  lessonId: UUID,
  completed: Boolean,
  score: Number,
  attempts: Number,
  completedAt: Date
}
```

#### WrongAnswer (Mistake Tracking)
```javascript
{
  id: UUID,
  userId: UUID,
  lessonId: UUID,
  exerciseId: UUID,
  userAnswer: String,
  correctAnswer: String,
  attemptNumber: Number,
  isReviewed: Boolean,
  isCorrected: Boolean, // True if answered correctly in retry
  createdAt: Date,
  correctedAt: Date
}
```

#### ExerciseResult (Detailed History)
```javascript
{
  id: UUID,
  userId: UUID,
  lessonId: UUID,
  attemptNumber: Number,
  totalQuestions: Number,
  correctAnswers: Number,
  wrongAnswers: Number,
  score: Number,
  timeSpent: Number, // in seconds
  completedAt: Date
}
```

### 5.3 API Endpoints

**Authentication**:
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

**Lessons**:
- `GET /api/lessons` - Get all lessons (filtered by level)
- `GET /api/lessons/:id` - Get specific lesson with theory and exercises

**Exercises**:
- `GET /api/exercises/:lessonId` - Get all exercises for a lesson
- `POST /api/exercises/check` - Check a single answer (immediate feedback)
- `POST /api/exercises/submit` - Submit complete exercise results and record mistakes

**Mistakes & Retry**:
- `GET /api/exercises/:lessonId/mistakes` - Get all wrong answers for a lesson
- `GET /api/mistakes` - Get all user's mistakes across lessons
- `POST /api/exercises/retry-mistakes` - Get retry exercise set (only wrong questions)
- `PUT /api/mistakes/:id/corrected` - Mark mistake as corrected

**Progress**:
- `GET /api/progress/:userId` - Get user's progress
- `POST /api/progress` - Submit lesson completion and score
- `GET /api/progress/:userId/stats` - Get statistics for dashboard
- `GET /api/progress/lessons/:lessonId` - Get detailed progress for specific lesson

---

## 6. UI/UX Requirements

### 6.1 Design Principles
- **Child-friendly**: Colorful, engaging, not overwhelming
- **Clear typography**: Large, readable fonts
- **Bilingual**: Hebrew UI with English content
- **Responsive**: Works on desktop and tablets
- **Accessible**: Keyboard navigation, good contrast

### 6.2 Key Pages

1. **Landing/Login Page**: Welcoming, simple authentication
2. **Dashboard**: Progress overview, lesson selection
3. **Lesson Theory Page**: Clean reading experience
4. **Exercise Page**: Clear question display, intuitive answer selection
5. **Results Page**: Encouraging feedback, score visualization
6. **Progress Page**: Charts and statistics

---

## 7. Success Metrics

### User Engagement
- Daily/Weekly active users
- Average lessons completed per user
- Session duration
- Return rate (users coming back after first session)

### Learning Outcomes
- Average score per lesson
- Improvement over time (comparing first vs. later attempts)
- Completion rate (% of users who finish levels)

### Technical Metrics
- Page load time < 2 seconds
- API response time < 500ms
- Zero critical bugs
- 99% uptime

---

## 8. Development Phases

### Phase 1: MVP (Minimum Viable Product)
- User authentication (register/login)
- 3 beginner lessons with theory + exercises
- Basic progress tracking
- Simple dashboard

### Phase 2: Content Expansion
- Complete all beginner level lessons (8-10 topics)
- Add elementary level lessons (8-10 topics)
- Enhanced progress visualization
- Achievement system

### Phase 3: Advanced Features
- Intermediate level lessons
- Gamification (points, badges, streaks)
- Parent dashboard
- Performance analytics

### Phase 4: Enhancements
- Mobile app (React Native)
- Audio pronunciations
- Export progress reports
- Social features (compare with friends)

---

## 9. Future Considerations

- **Content Management System**: Admin panel for adding/editing lessons
- **Adaptive Learning**: AI-powered difficulty adjustment
- **Additional Exercise Types**: Drag-and-drop, matching, speaking exercises
- **Vocabulary Section**: Complement grammar with vocabulary building
- **Reading Comprehension**: Add stories and passages
- **Offline Mode**: Progressive Web App (PWA) capability

---

## 10. Open Questions & Decisions Needed

1. **Subscription Model**: Will this be free, one-time purchase, or subscription-based?
2. **Content Creation**: Who will write the lesson content? (You, teachers, professional content creators?)
3. **Design**: Will you hire a designer or use templates/component libraries?
4. **Testing**: How many kids will test the app before full launch?
5. **Maintenance**: Long-term content updates and technical maintenance plan?

---

**Document Version**: 1.0
**Date**: January 10, 2026
**Author**: PRD created collaboratively with parent/stakeholder
