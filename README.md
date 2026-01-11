# English Tutorial App

A web-based English learning platform designed for Hebrew-speaking children (ages 10-12) that provides progressive, grammar-focused instruction with interactive exercises and progress tracking.

## 📚 Project Overview

This application helps young Hebrew speakers master English grammar through:
- **Progressive Learning**: Beginner → Elementary → Intermediate levels
- **Grammar Focus**: Comprehensive English grammar topics with Hebrew explanations
- **Interactive Exercises**: Multiple choice and fill-in-the-blank questions
- **Mistake Tracking**: Record and retry wrong answers for focused practice
- **Progress Tracking**: Monitor learning progress with detailed statistics
- **Achievement System**: Earn badges and track streaks

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- React 18+
- React Router v6
- Axios
- CSS Modules / Styled Components

**Backend:**
- Node.js + Express
- PostgreSQL (or MongoDB)
- JWT Authentication
- bcryptjs for password hashing

**Deployment:**
- Frontend: Vercel / Netlify
- Backend: Heroku / Railway / AWS
- Database: PostgreSQL (hosted)

## 📁 Project Structure

```
/eng-tu
├── /frontend          # React application
├── /backend           # Node.js/Express API server
├── /docs              # Project documentation
│   ├── PRD.md         # Product Requirements Document
│   ├── technical.md   # Technical Implementation Guide
│   ├── webapp.md      # Web App Flow & Structure
│   ├── topics.md      # Learning Curriculum
│   └── workplan.md    # Phased Development Plan
├── CLAUDE.md          # Development workflow instructions
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ LTS
- PostgreSQL 14+ (or MongoDB)
- npm or yarn

### Installation

#### 1. Clone the repository
```bash
git clone <repository-url>
cd eng-tu
```

#### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

Backend will run on http://localhost:5000

#### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm start
```

Frontend will run on http://localhost:3000

#### 4. Database Setup
```bash
# Create database
createdb english_tutorial_dev

# Run migrations
cd backend
npm run migrate
```

## 📖 Documentation

- **[PRD.md](./docs/PRD.md)** - Complete product requirements and features
- **[technical.md](./docs/technical.md)** - Technical architecture and implementation details
- **[webapp.md](./docs/webapp.md)** - User interface flow and navigation structure
- **[topics.md](./docs/topics.md)** - Learning curriculum and topics
- **[workplan.md](./docs/workplan.md)** - Phased development plan with tasks

## ✨ Key Features

### Core Learning
- **Theory Pages**: Hebrew explanations with English examples
- **Exercise System**: 10-15 questions per lesson
- **Immediate Feedback**: Instant validation with explanations
- **Progressive Unlocking**: Sequential lesson access based on performance

### Mistake Tracking & Retry ⭐
- **Record Wrong Answers**: All mistakes automatically saved
- **Review Mistakes**: See all wrong answers with explanations
- **Retry Mode**: Practice only the questions answered incorrectly
- **Track Corrections**: Monitor when mistakes are corrected

### Progress & Engagement
- **User Dashboard**: Overview of progress and statistics
- **Detailed History**: Track all exercise attempts and scores
- **Achievement System**: Earn badges for milestones
- **Streak Tracking**: Daily learning streaks

## 🎯 Current Status

**Phase**: Phase 1 - Project Setup & Infrastructure
**Progress**: In Progress
**Last Updated**: January 10, 2026

See [workplan.md](./docs/workplan.md) for detailed development progress.

## 📝 Learning Content

### Beginner Level (Phase 1)
1. **Present Simple**: Affirmative, negative, questions, frequency adverbs
2. **Pronouns & Possessives**: Subject/object pronouns, possessive adjectives
3. **Articles**: a, an, the - usage rules
4. **Nouns**: Singular/plural, countable/uncountable
5. **Verb "To Be"**: am, is, are - present tense
6. **There is/are**: Existence and location

### Future Content
- Elementary Level: Past/Future tenses, prepositions, comparatives
- Intermediate Level: Perfect tenses, conditionals, modals, passive voice

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
npm run test:coverage
```

### Frontend Tests
```bash
cd frontend
npm test
npm run test:coverage
```

## 🚢 Deployment

See [technical.md](./docs/technical.md) for detailed deployment instructions.

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
```

## 🤝 Contributing

This is a personal educational project. Contributions, suggestions, and feedback are welcome!

## 📄 License

This project is for educational purposes.

## 👨‍👩‍👦 About

Created for Hebrew-speaking children learning English, with a focus on grammar fundamentals and progressive skill building.

---

**Built with ❤️ for young language learners**
