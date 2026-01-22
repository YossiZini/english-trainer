const Exercise = require('../models/Exercise');
const UserProgress = require('../models/UserProgress');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const WrongAnswer = require('../models/WrongAnswer');
const { db, withTransaction } = require('../config/database');
const AchievementService = require('./achievement.service');
const DailyChallengeService = require('./dailyChallenge.service');

class ExerciseService {
  /**
   * Check a single answer (for immediate feedback)
   */
  static async checkAnswer(exerciseId, userAnswer) {
    const result = await Exercise.checkAnswer(exerciseId, userAnswer);
    return result;
  }

  /**
   * Submit complete exercise and save results
   */
  static async submitExercise(userId, lessonId, answers, timeSpent, difficulty = 'easy') {
    // Determine next difficulty level
    const difficultyMap = {
      'easy': 'medium',
      'medium': 'hard',
      'hard': null // No next level after hard
    };
    const nextDifficulty = difficultyMap[difficulty];

    return withTransaction(async () => {
      // Get all exercises for this lesson to validate
      const exercises = await Exercise.findByLessonId(lessonId);

      if (exercises.length === 0) {
        throw new Error('No exercises found for this lesson');
      }

      // Check each answer
      const results = [];
      const wrongAnswers = [];

      for (const answer of answers) {
        const exercise = exercises.find(ex => ex.id === answer.exerciseId);

        if (!exercise) {
          continue; // Skip if exercise not found
        }

        const normalizedUserAnswer = answer.userAnswer.trim().toLowerCase();
        const normalizedCorrectAnswer = exercise.correct_answer.trim().toLowerCase();
        const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;

        results.push({
          exerciseId: answer.exerciseId,
          userAnswer: answer.userAnswer,
          correctAnswer: exercise.correct_answer,
          isCorrect
        });

        if (!isCorrect) {
          wrongAnswers.push({
            exerciseId: answer.exerciseId,
            userAnswer: answer.userAnswer,
            correctAnswer: exercise.correct_answer
          });
        }
      }

      const totalQuestions = results.length;
      const correctAnswers = results.filter(r => r.isCorrect).length;
      const wrongAnswersCount = totalQuestions - correctAnswers;
      const score = Math.round((correctAnswers / totalQuestions) * 100);

      // Get current attempt number
      const progress = await UserProgress.findOrCreate(userId, lessonId);
      const attemptNumber = progress.attempts + 1;

      // Save exercise result
      const resultRecord = db.insert('exercise_results', {
        user_id: userId,
        lesson_id: lessonId,
        attempt_number: attemptNumber,
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        wrong_answers: wrongAnswersCount,
        score,
        time_spent: timeSpent,
        difficulty,
        completed_at: new Date().toISOString()
      });

      // Save wrong answers for retry functionality
      for (const wrongAnswer of wrongAnswers) {
        await WrongAnswer.create({
          userId,
          lessonId,
          exerciseId: wrongAnswer.exerciseId,
          userAnswer: wrongAnswer.userAnswer,
          correctAnswer: wrongAnswer.correctAnswer,
          attemptNumber
        });
      }

      // Update user progress
      await UserProgress.updateProgress(userId, lessonId, score, Math.floor(timeSpent / 60));

      // Calculate and award gamification points
      let pointsEarned = 0;
      pointsEarned += correctAnswers * 1;      // +1 per correct answer
      pointsEarned += wrongAnswersCount * (-2); // -2 per wrong answer
      if (score >= 70) {
        pointsEarned += 3;                     // +3 bonus for completing questionnaire
      }

      // Get previous level before updating points
      const previousGamificationData = await User.getGamificationData(userId);

      // Update user points and level
      const newGamificationData = await User.addPoints(userId, pointsEarned);

      // Check if user leveled up
      const leveledUp = newGamificationData.gamification_level > newGamificationData.previousLevel;
      const arenaName = User.getArenaName(newGamificationData.gamification_level);

      // Check for new achievements
      const newAchievements = await AchievementService.checkAndUnlockAchievements(userId);

      // Update daily challenge progress
      await DailyChallengeService.checkChallengeProgress(userId, 'lesson_completed', 1);
      if (score === 100) {
        await DailyChallengeService.checkChallengeProgress(userId, 'perfect_score', 1);
      }
      await DailyChallengeService.checkChallengeProgress(userId, 'correct_answer', correctAnswers);
      await DailyChallengeService.checkChallengeProgress(userId, 'practice_minute', Math.floor(timeSpent / 60));

      // Get current lesson to find next/previous
      const currentLesson = await Lesson.findById(lessonId);

      // Get next lesson if passed
      let nextLesson = null;
      if (score >= 70 && currentLesson) {
        nextLesson = await Lesson.getNextLesson(currentLesson.order_index);
      }

      // Get previous lesson
      let previousLesson = null;
      if (currentLesson) {
        previousLesson = await Lesson.getPreviousLesson(currentLesson.order_index);
      }

      return {
        resultId: resultRecord.id,
        lessonId,
        attemptNumber,
        totalQuestions,
        correctAnswers,
        wrongAnswers: wrongAnswersCount,
        score,
        isPassed: score >= 70,
        timeSpent,
        results,
        nextLesson,
        previousLesson,
        currentDifficulty: difficulty,
        nextDifficulty: nextDifficulty,
        gamification: {
          pointsEarned,
          totalPoints: newGamificationData.total_points,
          currentLevel: newGamificationData.gamification_level,
          leveledUp,
          arenaName,
          pointsBreakdown: {
            correctPoints: correctAnswers * 1,
            wrongPoints: wrongAnswersCount * (-2),
            bonusPoints: score >= 70 ? 3 : 0
          }
        },
        achievements: {
          newlyUnlocked: newAchievements.map(a => ({
            id: a.id,
            key: a.key,
            name: a.name_he,
            description: a.description_he,
            icon: a.icon,
            tier: a.tier,
            pointsReward: a.points_reward
          }))
        }
      };
    });
  }

  /**
   * Get results for a specific attempt
   */
  static async getResultById(resultId, userId) {
    const result = db.findOne('exercise_results', { id: resultId, user_id: userId });

    if (!result) {
      return null;
    }

    // Get lesson info
    const lesson = await Lesson.findById(result.lesson_id);

    // Get next and previous lessons
    let nextLesson = null;
    let previousLesson = null;

    if (lesson) {
      nextLesson = await Lesson.getNextLesson(lesson.order_index);
      previousLesson = await Lesson.getPreviousLesson(lesson.order_index);
    }

    return {
      id: result.id,
      user_id: result.user_id,
      lesson_id: result.lesson_id,
      attempt_number: result.attempt_number,
      total_questions: result.total_questions,
      correct_answers: result.correct_answers,
      wrong_answers: result.wrong_answers,
      score: result.score,
      time_spent: result.time_spent,
      completed_at: result.completed_at,
      title_en: lesson?.title_en,
      title_he: lesson?.title_he,
      order_index: lesson?.order_index,
      nextLesson,
      previousLesson
    };
  }
}

module.exports = ExerciseService;
