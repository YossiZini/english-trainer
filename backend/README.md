# English Tutorial Backend API

Node.js + Express + PostgreSQL backend for the English Tutorial App.

## Prerequisites

- Node.js 18+ LTS
- PostgreSQL 14+
- npm or yarn

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Install PostgreSQL (if not installed)

**macOS:**
```bash
# Using Homebrew
brew install postgresql@14
brew services start postgresql@14
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download from https://www.postgresql.org/download/windows/

### 3. Create Database

```bash
# Create database
createdb english_tutorial_dev

# Or using psql
psql -U postgres
CREATE DATABASE english_tutorial_dev;
\q
```

### 4. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and update database credentials:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=english_tutorial_dev
DB_USER=postgres
DB_PASSWORD=your_password
```

### 5. Run Database Migration

```bash
npm run migrate
```

This will create all 7 tables:
- users
- lessons
- exercises
- user_progress
- exercise_results
- wrong_answers
- achievements + user_achievements

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server will run on http://localhost:5000

## API Endpoints

### Health Check
```
GET /health
```

Returns API status and timestamp.

### Authentication (Coming in Phase 2)
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

### Lessons (Coming in Phase 3)
```
GET /api/lessons
GET /api/lessons/:id
```

### Exercises (Coming in Phase 4)
```
GET /api/exercises/:lessonId
POST /api/exercises/check
POST /api/exercises/submit
```

### Mistakes & Retry (Coming in Phase 5)
```
GET /api/exercises/:lessonId/mistakes
POST /api/exercises/retry-mistakes
PUT /api/mistakes/:id/corrected
```

### Progress (Coming in Phase 6)
```
GET /api/progress
GET /api/progress/lessons/:lessonId
```

## Project Structure

```
/backend
├── /src
│   ├── /config           # Configuration files
│   │   └── database.js   # Database connection
│   ├── /database         # Database schemas and migrations
│   │   ├── schema.sql    # PostgreSQL schema
│   │   └── migrate.js    # Migration script
│   ├── /models           # Database models (to be added)
│   ├── /routes           # API routes (to be added)
│   ├── /controllers      # Route controllers (to be added)
│   ├── /middleware       # Express middleware (to be added)
│   ├── /services         # Business logic (to be added)
│   ├── /utils            # Utility functions (to be added)
│   ├── app.js            # Express app configuration
│   └── server.js         # Server entry point
├── .env                  # Environment variables (not in git)
├── .env.example          # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Database Schema

See [schema.sql](./src/database/schema.sql) for complete database structure.

### Key Tables:

1. **users** - User accounts and authentication
2. **lessons** - Lesson content with Hebrew theory
3. **exercises** - Questions for each lesson
4. **user_progress** - Track completion and scores
5. **exercise_results** - Detailed attempt history
6. **wrong_answers** - Mistake tracking for retry feature ⭐
7. **achievements** - Achievement system

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development |
| PORT | Server port | 5000 |
| DB_HOST | PostgreSQL host | localhost |
| DB_PORT | PostgreSQL port | 5432 |
| DB_NAME | Database name | english_tutorial_dev |
| DB_USER | Database user | postgres |
| DB_PASSWORD | Database password | - |
| JWT_SECRET | Secret key for JWT | - |
| JWT_EXPIRATION | Token expiration | 7d |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:3000 |

## Development Workflow

1. Make changes to code
2. Test locally with `npm run dev`
3. Run tests with `npm test`
4. Commit changes
5. Deploy to production

## Troubleshooting

### Database Connection Error

If you see connection errors:

1. Ensure PostgreSQL is running:
   ```bash
   # macOS
   brew services list

   # Linux
   sudo systemctl status postgresql
   ```

2. Check database exists:
   ```bash
   psql -U postgres -l
   ```

3. Verify credentials in `.env` file

### Port Already in Use

If port 5000 is already in use, change PORT in `.env`:
```
PORT=5001
```

### Migration Fails

If migration fails, you can manually run the SQL:
```bash
psql -U postgres -d english_tutorial_dev -f src/database/schema.sql
```

## License

Educational use only.
