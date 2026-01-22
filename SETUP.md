# Project Setup Guide - eng-tu

## Prerequisites

Install the following before starting:

- **Node.js** (v18 or later recommended) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

Verify installation:
```bash
node --version   # Should show v18.x or higher
npm --version    # Should show 9.x or higher
git --version
```

---

## Quick Start (5 steps)

```bash
# 1. Clone the repository
git clone <repository-url>
cd eng-tu

# 2. Setup backend
cd backend
npm install
cp .env.example .env

# 3. Setup frontend (new terminal)
cd ../frontend
npm install
cp .env.example .env

# 4. Start backend (in backend folder)
npm run dev

# 5. Start frontend (in frontend folder)
npm start
```

Access the app at: **http://localhost:3000**

---

## Detailed Setup Instructions

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd eng-tu
```

### Step 2: Backend Setup

```bash
cd backend
npm install
```

Create environment file:
```bash
cp .env.example .env
```

Edit `.env` and set a secure JWT secret:
```
JWT_SECRET=your_unique_secret_key_here_make_it_long_and_random
```

The default `.env` values work for local development:
```
NODE_ENV=development
PORT=5000
JWT_EXPIRATION=7d
CORS_ORIGIN=http://localhost:3000
```

### Step 3: Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env
```

Default `.env` values (usually no changes needed):
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

### Step 4: Start the Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs at: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend runs at: http://localhost:3000

---

## Project Structure Overview

```
eng-tu/
├── backend/
│   ├── data/
│   │   ├── static/      # Lessons, exercises, vocabulary (read-only)
│   │   └── dynamic/     # User data, progress (read-write)
│   ├── src/
│   │   ├── server.js    # Entry point
│   │   ├── controllers/ # Route handlers
│   │   ├── services/    # Business logic
│   │   └── routes/      # API endpoints
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js       # Main app with routes
│   │   ├── components/  # React components
│   │   └── services/    # API services
│   └── package.json
└── docs/                # Documentation
```

---

## Database Information

This project uses **JSON file-based storage** (no PostgreSQL required).

- **Static data** (`backend/data/static/`): Pre-populated lessons, exercises, vocabulary
- **Dynamic data** (`backend/data/dynamic/`): User accounts, progress, quiz sessions

Data files are included in the repository - no database setup needed.

---

## Useful Commands

### Backend
```bash
npm run dev           # Start with hot reload (development)
npm start            # Start without hot reload (production)
npm test             # Run tests
npm run generate-data # Regenerate static data from seeds
npm run reset-password <username> <password>  # Reset user password
```

### Frontend
```bash
npm start   # Start development server
npm build   # Create production build
npm test    # Run tests
```

---

## Troubleshooting

### Port Already in Use

If port 3000 or 5000 is busy:

```bash
# Find what's using the port
lsof -i :3000
lsof -i :5000

# Kill the process
lsof -i :3000 -t | xargs kill -9
lsof -i :5000 -t | xargs kill -9
```

**Important:** Do NOT change the ports. The app is configured to use 3000/5000.

### CORS Errors

Ensure both servers are running and `.env` files have correct URLs:
- Backend `CORS_ORIGIN=http://localhost:3000`
- Frontend `REACT_APP_API_URL=http://localhost:5000/api`

### Missing Data

If lessons/exercises don't load, regenerate data:
```bash
cd backend
npm run generate-data
```

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 19, React Router 7, Axios |
| Backend | Node.js, Express 5 |
| Database | JSON file storage |
| Auth | JWT (jsonwebtoken), bcryptjs |

---

## Fixed Configuration (Do Not Change)

- Frontend port: **3000**
- Backend port: **5000**
- API base URL: **http://localhost:5000/api**
