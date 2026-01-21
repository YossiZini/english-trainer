const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  /**
   * Create a new user
   */
  static async create({ name, email, password, age, studentName }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (name, email, password_hash, age, current_level, student_name)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, email, age, current_level, student_name, created_at
    `;

    const values = [name, email || null, hashedPassword, age || null, 'beginner', studentName || name];

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
             created_at, last_login, total_time_spent, current_streak,
             total_points, gamification_level, student_name
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
             created_at, last_login, total_time_spent, current_streak,
             total_points, gamification_level, student_name
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
             created_at, last_login, total_time_spent, current_streak,
             total_points, gamification_level, student_name
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

  // ==================== GAMIFICATION METHODS ====================

  /**
   * Calculate level from points
   * Level = floor(totalPoints / 20) + 1
   */
  static calculateLevel(totalPoints) {
    return Math.floor(totalPoints / 20) + 1;
  }

  /**
   * Get arena name for level
   */
  static getArenaName(level) {
    const arenas = {
      1: 'Training Camp',
      2: 'Goblin Stadium',
      3: 'Bone Pit',
      4: 'Barbarian Bowl',
      5: "P.E.K.K.A's Playhouse",
      6: 'Royal Arena',
      7: 'Frozen Peak',
      8: 'Jungle Arena',
      9: 'Hog Mountain',
      10: 'Electro Valley',
      11: 'Spooky Town',
      12: 'Rascals Hideout',
      13: 'Serenity Peak',
      14: 'Miners Mine',
      15: 'Executioners Kitchen',
      16: 'Royal Crypt',
      17: 'Silent Sanctuary',
      18: 'Dragon Spa',
      19: 'Legendary Arena',
      20: 'Champions Arena'
    };

    if (level <= 20) {
      return arenas[level] || 'Champions Arena';
    }

    // For levels 21-99, use tiered naming
    if (level <= 40) return `Master Arena ${level - 20}`;
    if (level <= 60) return `Grand Master Arena ${level - 40}`;
    if (level <= 80) return `Epic Arena ${level - 60}`;
    if (level <= 99) return `Legendary Arena ${level - 80}`;
    return 'Ultimate Champion';
  }

  /**
   * Add points to user (with floor at 0)
   * Returns: { total_points, gamification_level, previousLevel }
   */
  static async addPoints(userId, pointsToAdd) {
    // First get the previous level
    const previousQuery = `
      SELECT total_points, gamification_level
      FROM users
      WHERE id = $1
    `;
    const previousResult = await pool.query(previousQuery, [userId]);
    const previousLevel = previousResult.rows[0]?.gamification_level || 1;

    // Update points and level atomically
    const query = `
      UPDATE users
      SET total_points = GREATEST(0, total_points + $1),
          gamification_level = GREATEST(1, FLOOR(GREATEST(0, total_points + $1) / 20.0) + 1)
      WHERE id = $2
      RETURNING total_points, gamification_level
    `;

    const result = await pool.query(query, [pointsToAdd, userId]);

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    return {
      ...result.rows[0],
      previousLevel
    };
  }

  /**
   * Get user's gamification data
   * Returns: { totalPoints, currentLevel, pointsToNextLevel, arenaName }
   */
  static async getGamificationData(userId) {
    const query = `
      SELECT total_points, gamification_level
      FROM users
      WHERE id = $1
    `;

    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return null;
    }

    const { total_points, gamification_level } = result.rows[0];
    const pointsToNextLevel = (gamification_level * 20) - total_points;

    return {
      totalPoints: total_points,
      currentLevel: gamification_level,
      pointsToNextLevel: pointsToNextLevel > 0 ? pointsToNextLevel : 0,
      arenaName: this.getArenaName(gamification_level)
    };
  }

  // ==================== STREAK & DAILY POINTS METHODS ====================

  /**
   * Update activity date and streak
   * - If last activity was yesterday: increment streak
   * - If last activity is today: no change
   * - If last activity is older than yesterday: reset streak to 1
   * Returns: { currentStreak, lastActivityDate }
   */
  static async updateActivityAndStreak(userId) {
    const query = `
      UPDATE users
      SET
        current_streak = CASE
          WHEN last_activity_date = CURRENT_DATE THEN current_streak
          WHEN last_activity_date = CURRENT_DATE - INTERVAL '1 day' THEN current_streak + 1
          ELSE 1
        END,
        last_activity_date = CURRENT_DATE
      WHERE id = $1
      RETURNING current_streak, last_activity_date
    `;

    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    return {
      currentStreak: result.rows[0].current_streak,
      lastActivityDate: result.rows[0].last_activity_date
    };
  }

  /**
   * Add points to today's total
   * Resets points_today if it's a new day
   * Returns: { pointsToday, pointsTodayDate }
   */
  static async addDailyPoints(userId, points) {
    const query = `
      UPDATE users
      SET
        points_today = CASE
          WHEN points_today_date = CURRENT_DATE THEN points_today + $1
          ELSE $1
        END,
        points_today_date = CURRENT_DATE
      WHERE id = $2
      RETURNING points_today, points_today_date
    `;

    const result = await pool.query(query, [points, userId]);

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    return {
      pointsToday: result.rows[0].points_today,
      pointsTodayDate: result.rows[0].points_today_date
    };
  }

  /**
   * Get daily statistics (streak and points today)
   * Returns: { currentStreak, pointsToday, lastActivityDate }
   */
  static async getDailyStats(userId) {
    const query = `
      SELECT current_streak, points_today, points_today_date, last_activity_date
      FROM users
      WHERE id = $1
    `;

    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return null;
    }

    const { current_streak, points_today, points_today_date, last_activity_date } = result.rows[0];

    // If points_today_date is not today, return 0 for points_today
    const isToday = points_today_date && new Date(points_today_date).toDateString() === new Date().toDateString();

    return {
      currentStreak: current_streak || 0,
      pointsToday: isToday ? points_today : 0,
      lastActivityDate: last_activity_date
    };
  }
}

module.exports = User;
