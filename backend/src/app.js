const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Behind Firebase Hosting / Cloud Run the client IP and protocol arrive in
// X-Forwarded-* headers.
app.set('trust proxy', 1);

// Allowed browser origins: comma-separated CORS_ORIGINS (CORS_ORIGIN kept for
// backwards compatibility). Requests without an Origin header (curl, health
// probes, same-origin Hosting rewrites) are always allowed.
const allowedOrigins = (process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

// Middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    const error = new Error(`Origin ${origin} not allowed by CORS`);
    error.status = 403;
    return callback(error);
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the English Tutorial API',
    status: 'Running',
    health_check: '/health'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'English Tutorial API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/lessons', require('./routes/lesson.routes'));
app.use('/api/exercises', require('./routes/exercise.routes'));
app.use('/api/mistakes', require('./routes/mistakes.routes'));
app.use('/api/progress', require('./routes/progress.routes'));
app.use('/api/achievements', require('./routes/achievement.routes'));
app.use('/api/challenges', require('./routes/challenge.routes'));
app.use('/api/vocabulary', require('./routes/vocabulary.routes'));
app.use('/api/unseen', require('./routes/unseen.routes'));
app.use('/api/kanban', require('./routes/kanban.routes'));
app.use('/api/telegram', require('./routes/telegram.routes'));
app.use('/api/bot', require('./routes/bot.routes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
