const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  /**
   * Create a new user
   */
  static async create({ name, email, password, age }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (name, email, password_hash, age, current_level)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, age, current_level, created_at
    `;

    const values = [name, email || null, hashedPassword, age || null, 'beginner'];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') {
        // Unique violation - email already exists
        throw new Error('Email already registered');
      }
      throw error;
    }
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    const query = `
      SELECT id, name, email, password_hash, age, current_level,
             created_at, last_login, total_time_spent, current_streak
      FROM users
      WHERE email = $1
    `;

    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    const query = `
      SELECT id, name, email, age, current_level,
             created_at, last_login, total_time_spent, current_streak
      FROM users
      WHERE id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Find user by name (for login without email)
   */
  static async findByName(name) {
    const query = `
      SELECT id, name, email, password_hash, age, current_level,
             created_at, last_login, total_time_spent, current_streak
      FROM users
      WHERE name = $1
    `;

    const result = await pool.query(query, [name]);
    return result.rows[0];
  }

  /**
   * Verify password
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Update last login time
   */
  static async updateLastLogin(userId) {
    const query = `
      UPDATE users
      SET last_login = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING last_login
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Update user streak
   */
  static async updateStreak(userId, streak) {
    const query = `
      UPDATE users
      SET current_streak = $1
      WHERE id = $2
      RETURNING current_streak
    `;

    const result = await pool.query(query, [streak, userId]);
    return result.rows[0];
  }

  /**
   * Update total time spent
   */
  static async addTimeSpent(userId, minutes) {
    const query = `
      UPDATE users
      SET total_time_spent = total_time_spent + $1
      WHERE id = $2
      RETURNING total_time_spent
    `;

    const result = await pool.query(query, [minutes, userId]);
    return result.rows[0];
  }

  /**
   * Update user level
   */
  static async updateLevel(userId, level) {
    const query = `
      UPDATE users
      SET current_level = $1
      WHERE id = $2
      RETURNING current_level
    `;

    const result = await pool.query(query, [level, userId]);
    return result.rows[0];
  }

  /**
   * Get user statistics
   */
  static async getStats(userId) {
    const query = `
      SELECT
        u.name,
        u.current_level,
        u.total_time_spent,
        u.current_streak,
        COUNT(DISTINCT up.lesson_id) FILTER (WHERE up.status = 'completed') as completed_lessons,
        COALESCE(AVG(up.best_score) FILTER (WHERE up.status = 'completed'), 0) as average_score
      FROM users u
      LEFT JOIN user_progress up ON u.id = up.user_id
      WHERE u.id = $1
      GROUP BY u.id, u.name, u.current_level, u.total_time_spent, u.current_streak
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }
}

module.exports = User;
