const User = require('../models/User');
const { generateToken } = require('../config/jwt');

class AuthService {
  /**
   * Register a new user
   */
  static async register({ name, email, password, age, studentName }) {
    // Validate required fields
    if (!name || !password) {
      throw new Error('Name and password are required');
    }

    // Check if user already exists by email
    if (email) {
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        throw new Error('Email already registered');
      }
    }

    // Check if user already exists by name
    const existingUserByName = await User.findByName(name);
    if (existingUserByName) {
      throw new Error('Username already taken');
    }

    // Create user
    const user = await User.create({ name, email, password, age, studentName });

    // Generate token
    const token = generateToken({ userId: user.id, name: user.name });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        age: user.age,
        currentLevel: user.current_level,
        studentName: user.student_name
      },
      token
    };
  }

  /**
   * Login user
   */
  static async login({ identifier, password }) {
    // identifier can be email or name
    if (!identifier || !password) {
      throw new Error('Identifier and password are required');
    }

    // Try to find user by email first, then by name
    let user;
    if (identifier.includes('@')) {
      user = await User.findByEmail(identifier);
    } else {
      user = await User.findByName(identifier);
    }

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await User.verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    await User.updateLastLogin(user.id);

    // Update streak (simple logic for now)
    await this.updateUserStreak(user);

    // Generate token
    const token = generateToken({ userId: user.id, name: user.name });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        age: user.age,
        currentLevel: user.current_level,
        currentStreak: user.current_streak,
        studentName: user.student_name
      },
      token
    };
  }

  /**
   * Get current user info
   */
  static async getCurrentUser(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      currentLevel: user.current_level,
      totalTimeSpent: user.total_time_spent,
      currentStreak: user.current_streak,
      lastLogin: user.last_login,
      studentName: user.student_name
    };
  }

  /**
   * Update user streak logic
   * Simple implementation: check if last login was yesterday
   */
  static async updateUserStreak(user) {
    if (!user.last_login) {
      // First login
      await User.updateStreak(user.id, 1);
      return;
    }

    const lastLogin = new Date(user.last_login);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastLogin.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((today - lastLogin) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
      // Same day - no change
      return;
    } else if (daysDiff === 1) {
      // Yesterday - continue streak
      await User.updateStreak(user.id, user.current_streak + 1);
    } else {
      // Streak broken - reset to 1
      await User.updateStreak(user.id, 1);
    }
  }
}

module.exports = AuthService;
