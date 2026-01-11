const User = require('../models/User');

/**
 * Gamification Service
 * Handles all gamification-related business logic
 */
class GamificationService {
  /**
   * Get full gamification status for a user
   * Returns: { totalPoints, currentLevel, pointsToNextLevel, arenaName, levelImagePath }
   */
  static async getUserGamificationStatus(userId) {
    const data = await User.getGamificationData(userId);

    if (!data) {
      return null;
    }

    return {
      ...data,
      levelImagePath: this.getLevelImagePath(data.currentLevel)
    };
  }

  /**
   * Award points for completing an exercise
   * Returns full gamification response with level-up detection
   */
  static async awardExercisePoints(userId, correctCount, wrongCount, score) {
    // Calculate points
    let pointsEarned = 0;
    pointsEarned += correctCount * 1;      // +1 per correct
    pointsEarned += wrongCount * (-2);     // -2 per wrong
    if (score >= 70) {
      pointsEarned += 3;                   // +3 bonus for completing
    }

    // Get previous data for level-up detection
    const previousData = await User.getGamificationData(userId);

    // Update user points
    const newData = await User.addPoints(userId, pointsEarned);

    return {
      pointsEarned,
      totalPoints: newData.total_points,
      currentLevel: newData.gamification_level,
      leveledUp: newData.gamification_level > newData.previousLevel,
      arenaName: User.getArenaName(newData.gamification_level),
      levelImagePath: this.getLevelImagePath(newData.gamification_level),
      pointsBreakdown: this.calculatePointsBreakdown(correctCount, wrongCount, score)
    };
  }

  /**
   * Get level image path
   * Images are stored in /frontend/public/images/levels/
   * Cap at level 6 image (highest available)
   * Currently using SVG placeholders - replace with PNG when AI images are generated
   */
  static getLevelImagePath(level) {
    const imageLevel = Math.min(level, 6);
    return `/images/levels/level-${imageLevel}.svg`;
  }

  /**
   * Calculate points breakdown for transparency
   * Shows exactly where points came from
   */
  static calculatePointsBreakdown(correctCount, wrongCount, score) {
    const correctPoints = correctCount * 1;
    const wrongPoints = wrongCount * (-2);
    const bonusPoints = score >= 70 ? 3 : 0;
    const total = Math.max(0, correctPoints + wrongPoints + bonusPoints);

    return {
      correctPoints,
      wrongPoints,
      bonusPoints,
      totalEarned: total,
      breakdown: [
        { type: 'correct', count: correctCount, points: correctPoints },
        { type: 'wrong', count: wrongCount, points: wrongPoints },
        { type: 'bonus', awarded: score >= 70, points: bonusPoints }
      ]
    };
  }

  /**
   * Get all arena names and their level requirements
   * Useful for displaying progression path to users
   */
  static getAllArenas() {
    return [
      { level: 1, name: 'Training Camp', pointsRequired: 0 },
      { level: 2, name: 'Goblin Stadium', pointsRequired: 20 },
      { level: 3, name: 'Bone Pit', pointsRequired: 40 },
      { level: 4, name: 'Barbarian Bowl', pointsRequired: 60 },
      { level: 5, name: "P.E.K.K.A's Playhouse", pointsRequired: 80 },
      { level: 6, name: 'Royal Arena', pointsRequired: 100 }
    ];
  }

  /**
   * Calculate progress percentage to next level
   * Returns 0-100
   */
  static getProgressToNextLevel(totalPoints, currentLevel) {
    const pointsInCurrentLevel = totalPoints - ((currentLevel - 1) * 20);
    return Math.min(100, (pointsInCurrentLevel / 20) * 100);
  }

  /**
   * Get detailed stats for gamification dashboard
   * Includes level info, progress, and achievement predictions
   */
  static async getGamificationStats(userId) {
    const status = await this.getUserGamificationStatus(userId);

    if (!status) {
      return null;
    }

    const progressPercent = this.getProgressToNextLevel(status.totalPoints, status.currentLevel);
    const pointsInCurrentLevel = status.totalPoints - ((status.currentLevel - 1) * 20);

    return {
      ...status,
      progress: {
        pointsInCurrentLevel,
        pointsNeededForNextLevel: status.pointsToNextLevel,
        progressPercent
      },
      nextArena: status.currentLevel < 6 ? {
        level: status.currentLevel + 1,
        name: User.getArenaName(status.currentLevel + 1),
        pointsRequired: status.currentLevel * 20
      } : null,
      allArenas: this.getAllArenas()
    };
  }
}

module.exports = GamificationService;
