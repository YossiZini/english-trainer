const { db, indexManager } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  /**
   * Create a new user
   */
  static async create({ name, email, password, age, studentName }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if email already exists
    if (email) {
      const existingUser = db.findOne('users', { email });
      if (existingUser) {
        throw new Error('Email already registered');
      }
    }

    // Check unique constraint
    const uniqueCheck = indexManager.checkUniqueConstraint('users', { email });
    if (uniqueCheck.violated) {
      throw new Error('Email already registered');
    }

    const timestamp = new Date().toISOString();

    const user = db.insert('users', {
      name,
      email: email || null,
      password_hash: hashedPassword,
      age: age || null,
      current_level: 'beginner',
      student_name: studentName || name,
      created_at: timestamp,
      last_login: null,
      total_time_spent: 0,
      current_streak: 0,
      total_points: 0,
      gamification_level: 1,
      last_activity_date: null,
      points_today: 0,
      points_today_date: null
    });

    // Return without password_hash
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    const users = db.findByIndex('users', 'email', email);
    return users[0] || null;
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    const user = db.findById('users', id);
    if (!user) return null;

    // Return without exposing password hash in standard findById
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Find user by name (for login without email)
   */
  static async findByName(name) {
    const users = db.findByIndex('users', 'name', name);
    return users[0] || null;
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
    const timestamp = new Date().toISOString();
    const result = db.updateById('users', userId, { last_login: timestamp });

    if (result.modified === 0) {
      throw new Error('User not found');
    }

    return { last_login: timestamp };
  }

  /**
   * Update user streak
   */
  static async updateStreak(userId, streak) {
    const result = db.updateById('users', userId, { current_streak: streak });

    if (result.modified === 0) {
      throw new Error('User not found');
    }

    return { current_streak: streak };
  }

  /**
   * Update total time spent
   */
  static async addTimeSpent(userId, minutes) {
    const user = db.findById('users', userId);
    if (!user) {
      throw new Error('User not found');
    }

    const newTotalTime = (user.total_time_spent || 0) + minutes;
    db.updateById('users', userId, { total_time_spent: newTotalTime });

    return { total_time_spent: newTotalTime };
  }

  /**
   * Update user level
   */
  static async updateLevel(userId, level) {
    const result = db.updateById('users', userId, { current_level: level });

    if (result.modified === 0) {
      throw new Error('User not found');
    }

    return { current_level: level };
  }

  /**
   * Get user statistics
   */
  static async getStats(userId) {
    const user = db.findById('users', userId);
    if (!user) return null;

    // Get user progress data
    const userProgress = db.find('user_progress', { user_id: userId });

    // Calculate statistics
    const completedProgress = userProgress.filter(p => p.status === 'completed');
    const completedLessons = completedProgress.length;
    const averageScore = completedProgress.length > 0
      ? completedProgress.reduce((sum, p) => sum + (p.best_score || 0), 0) / completedProgress.length
      : 0;

    return {
      name: user.name,
      current_level: user.current_level,
      total_time_spent: user.total_time_spent || 0,
      current_streak: user.current_streak || 0,
      completed_lessons: completedLessons,
      average_score: Math.round(averageScore * 100) / 100
    };
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
    const user = db.findById('users', userId);
    if (!user) {
      throw new Error('User not found');
    }

    const previousLevel = user.gamification_level || 1;
    const newTotalPoints = Math.max(0, (user.total_points || 0) + pointsToAdd);
    const newLevel = Math.max(1, Math.floor(newTotalPoints / 20) + 1);

    db.updateById('users', userId, {
      total_points: newTotalPoints,
      gamification_level: newLevel
    });

    return {
      total_points: newTotalPoints,
      gamification_level: newLevel,
      previousLevel
    };
  }

  /**
   * Get user's gamification data
   * Returns: { totalPoints, currentLevel, pointsToNextLevel, arenaName }
   */
  static async getGamificationData(userId) {
    const user = db.findById('users', userId);
    if (!user) {
      return null;
    }

    const totalPoints = user.total_points || 0;
    const currentLevel = user.gamification_level || 1;
    const pointsToNextLevel = Math.max(0, (currentLevel * 20) - totalPoints);

    return {
      totalPoints,
      currentLevel,
      pointsToNextLevel,
      arenaName: this.getArenaName(currentLevel)
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
    const user = db.findById('users', userId);
    if (!user) {
      throw new Error('User not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActivity = user.last_activity_date ? new Date(user.last_activity_date) : null;
    if (lastActivity) {
      lastActivity.setHours(0, 0, 0, 0);
    }

    let newStreak = user.current_streak || 0;

    if (!lastActivity) {
      // First activity
      newStreak = 1;
    } else {
      const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));

      if (daysDiff === 0) {
        // Same day, no change
      } else if (daysDiff === 1) {
        // Yesterday, increment streak
        newStreak = (user.current_streak || 0) + 1;
      } else {
        // More than 1 day, reset streak
        newStreak = 1;
      }
    }

    const todayStr = today.toISOString().split('T')[0];
    db.updateById('users', userId, {
      current_streak: newStreak,
      last_activity_date: todayStr
    });

    return {
      currentStreak: newStreak,
      lastActivityDate: todayStr
    };
  }

  /**
   * Add points to today's total
   * Resets points_today if it's a new day
   * Returns: { pointsToday, pointsTodayDate }
   */
  static async addDailyPoints(userId, points) {
    const user = db.findById('users', userId);
    if (!user) {
      throw new Error('User not found');
    }

    const today = new Date().toISOString().split('T')[0];
    const lastPointsDate = user.points_today_date;

    let newPointsToday;
    if (lastPointsDate === today) {
      // Same day, add to existing
      newPointsToday = (user.points_today || 0) + points;
    } else {
      // New day, reset counter
      newPointsToday = points;
    }

    db.updateById('users', userId, {
      points_today: newPointsToday,
      points_today_date: today
    });

    return {
      pointsToday: newPointsToday,
      pointsTodayDate: today
    };
  }

  /**
   * Get daily statistics (streak and points today)
   * Returns: { currentStreak, pointsToday, lastActivityDate }
   */
  static async getDailyStats(userId) {
    const user = db.findById('users', userId);
    if (!user) {
      return null;
    }

    const today = new Date().toISOString().split('T')[0];
    const isToday = user.points_today_date === today;

    return {
      currentStreak: user.current_streak || 0,
      pointsToday: isToday ? (user.points_today || 0) : 0,
      lastActivityDate: user.last_activity_date
    };
  }
}

module.exports = User;
