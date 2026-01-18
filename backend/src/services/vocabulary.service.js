const VocabularyWord = require('../models/VocabularyWord');
const VocabularyUserHistory = require('../models/VocabularyUserHistory');
const VocabularyQuizSession = require('../models/VocabularyQuizSession');
const VocabularyFailedWords = require('../models/VocabularyFailedWords');
const VocabularyUserStats = require('../models/VocabularyUserStats');
const VocabularyWordScores = require('../models/VocabularyWordScores');
const User = require('../models/User');
const { shuffleArray } = require('../utils/shuffle');

/**
 * Vocabulary Service
 * Handles all vocabulary quiz business logic
 */
class VocabularyService {
  // Difficulty stage ranges
  static DIFFICULTY_STAGES = {
    1: { min: 1, max: 3 },    // Easy
    2: { min: 3, max: 5 },    // Medium
    3: { min: 5, max: 10 }    // Hard
  };

  /**
   * Start a new regular quiz
   */
  static async startQuiz(userId, quizSize, startingDifficulty = 1, source = null) {
    // Check if user has an active session
    const activeSession = await VocabularyQuizSession.getActiveSession(userId);
    if (activeSession) {
      // Validate that the active session has words available
      // If not, cancel it and allow creating a new one
      const sessionWordsAvailable = await VocabularyWord.findByDifficultyRange(
        activeSession.difficulty_range_start,
        activeSession.difficulty_range_end,
        [],
        5,
        activeSession.source
      );

      if (sessionWordsAvailable.length < 5) {
        // Cancel the invalid session
        await VocabularyQuizSession.cancelSession(activeSession.id);
        console.log(`Cancelled invalid session ${activeSession.id} with no available words`);
      } else {
        // Valid session exists, return it
        return {
          error: 'You already have an active quiz session',
          sessionId: activeSession.id
        };
      }
    }

    // Create new session starting at the selected difficulty level
    const stage = this.DIFFICULTY_STAGES[startingDifficulty];

    // Validate that there are enough words available for the selected source and difficulty
    const availableWords = await VocabularyWord.findByDifficultyRange(
      stage.min,
      stage.max,
      [],
      quizSize,
      source
    );

    if (availableWords.length < Math.min(5, quizSize)) {
      throw new Error(`Not enough words available for source "${source || 'all'}" at difficulty level ${startingDifficulty}. Please try a different difficulty level or source.`);
    }

    const session = await VocabularyQuizSession.create(
      userId,
      'regular',
      quizSize,
      stage.min,
      stage.max,
      source
    );

    // Get current accumulated fails
    const stats = await VocabularyUserStats.findOrCreate(userId);

    return {
      sessionId: session.id,
      quizSize: session.quiz_size,
      currentStage: session.current_difficulty_stage,
      difficultyRange: {
        min: session.difficulty_range_start,
        max: session.difficulty_range_end
      },
      source: session.source,
      accumulatedFails: stats.accumulated_fails
    };
  }

  /**
   * Get next question for a quiz session
   */
  static async getNextQuestion(sessionId, userId) {
    const session = await VocabularyQuizSession.findById(sessionId);

    if (!session) {
      throw new Error('Quiz session not found');
    }

    if (session.user_id !== userId) {
      throw new Error('Unauthorized access to quiz session');
    }

    if (session.status !== 'in_progress') {
      throw new Error('Quiz session is not active');
    }

    // Check if quiz is complete
    if (session.total_questions >= session.quiz_size) {
      return {
        quizComplete: true,
        sessionId: session.id
      };
    }

    // Get words user has already answered correctly
    const answeredWordIds = await VocabularyUserHistory.getCorrectlyAnsweredWordIds(userId);

    // Get available words from current difficulty range (filtered by source if specified)
    let words = await VocabularyWord.findByDifficultyRange(
      session.difficulty_range_start,
      session.difficulty_range_end,
      answeredWordIds,
      20,  // Get 20 random words
      session.source  // Filter by source if specified
    );

    // If not enough words, include previously answered words
    if (words.length === 0) {
      words = await VocabularyWord.findByDifficultyRange(
        session.difficulty_range_start,
        session.difficulty_range_end,
        [],
        20,
        session.source  // Filter by source if specified
      );
    }

    if (words.length === 0) {
      const sourceMsg = session.source ? ` for source "${session.source}"` : '';
      throw new Error(`No words available${sourceMsg} at difficulty range ${session.difficulty_range_start}-${session.difficulty_range_end}. Please end this quiz and start a new one with different settings.`);
    }

    // Select random word
    const correctWord = words[Math.floor(Math.random() * words.length)];

    // Generate wrong options
    const wrongOptions = await VocabularyWord.getRandomWrongOptions(
      correctWord.id,
      correctWord.difficulty_level,
      3,
      session.source  // Pass source to filter wrong options
    );

    // Validate we have enough wrong options
    if (wrongOptions.length < 3) {
      const sourceMsg = session.source ? ` from source "${session.source}"` : '';
      throw new Error(`Not enough vocabulary words${sourceMsg} at this difficulty level to generate multiple choice options. Please try a different source or difficulty level.`);
    }

    // Create multiple choice options
    const options = [
      { id: correctWord.id, hebrew: correctWord.hebrew_translation, isCorrect: true },
      ...wrongOptions.map(opt => ({ id: opt.id, hebrew: opt.hebrew_translation, isCorrect: false }))
    ];

    // Shuffle options using proper shuffle algorithm
    const shuffledOptions = shuffleArray(options);

    // Get current stats
    const stats = await VocabularyUserStats.getStats(userId);

    return {
      questionNumber: session.total_questions + 1,
      totalQuestions: session.quiz_size,
      word: {
        id: correctWord.id,
        english: correctWord.english_word,
        difficulty: correctWord.difficulty_level
      },
      options: shuffledOptions.map(({ id, hebrew }) => ({ id, hebrew })),
      currentStage: session.current_difficulty_stage,
      consecutiveCorrect: session.consecutive_correct,
      accumulatedFails: stats ? stats.accumulated_fails : 0
    };
  }

  /**
   * Submit answer for a question
   */
  static async submitAnswer(sessionId, userId, wordId, userAnswerId) {
    const session = await VocabularyQuizSession.findById(sessionId);

    if (!session || session.user_id !== userId) {
      throw new Error('Invalid session');
    }

    // Get the correct word
    const word = await VocabularyWord.findById(wordId);
    if (!word) {
      throw new Error('Word not found');
    }

    // Check if answer is correct
    const isCorrect = wordId === userAnswerId;

    // Record answer in history
    await VocabularyUserHistory.recordAnswer(userId, wordId, sessionId, isCorrect);

    // Record attempt in word scores for smart quiz building
    await VocabularyWordScores.recordAttempt(userId, wordId, isCorrect);

    // Update session progress
    let newCorrectCount = session.correct_answers;
    let newWrongCount = session.wrong_answers;
    let newConsecutiveCorrect = session.consecutive_correct;

    if (isCorrect) {
      newCorrectCount++;
      newConsecutiveCorrect++;
    } else {
      newWrongCount++;
      newConsecutiveCorrect = 0;

      // Add to failed words
      await VocabularyFailedWords.addOrIncrementFail(userId, wordId);

      // Increment accumulated fails
      await VocabularyUserStats.incrementFails(userId, 1);
    }

    // Check for difficulty progression
    let stageChanged = false;
    let newStage = session.current_difficulty_stage;
    let newDifficultyRange = {
      min: session.difficulty_range_start,
      max: session.difficulty_range_end
    };

    if (newConsecutiveCorrect >= 3 && session.current_difficulty_stage < 3) {
      // Progress to next stage
      newStage = session.current_difficulty_stage + 1;
      const stageRange = this.DIFFICULTY_STAGES[newStage];
      newDifficultyRange = { min: stageRange.min, max: stageRange.max };
      newConsecutiveCorrect = 0;  // Reset consecutive counter
      stageChanged = true;

      // Update difficulty range in session
      await VocabularyQuizSession.updateDifficultyRange(
        sessionId,
        newDifficultyRange.min,
        newDifficultyRange.max,
        newStage
      );
    }

    // Update session progress
    await VocabularyQuizSession.updateProgress(
      sessionId,
      newCorrectCount,
      newWrongCount,
      newConsecutiveCorrect,
      newStage
    );

    // Get updated stats
    const stats = await VocabularyUserStats.getStats(userId);

    // Get user answer word for response
    const userAnswerWord = await VocabularyWord.findById(userAnswerId);

    return {
      isCorrect,
      correctAnswer: {
        id: word.id,
        hebrew: word.hebrew_translation
      },
      userAnswer: {
        id: userAnswerWord.id,
        hebrew: userAnswerWord.hebrew_translation
      },
      consecutiveCorrect: newConsecutiveCorrect,
      stageChanged,
      newStage: stageChanged ? newStage : null,
      accumulatedFails: stats ? stats.accumulated_fails : 0,
      pointsEarned: isCorrect ? 1 : 0
    };
  }

  /**
   * Complete a quiz session
   */
  static async completeQuiz(sessionId, userId) {
    const session = await VocabularyQuizSession.findById(sessionId);

    if (!session || session.user_id !== userId) {
      throw new Error('Invalid session');
    }

    // Calculate total points (1 point per correct answer)
    const pointsEarned = session.correct_answers;

    // Complete the session
    await VocabularyQuizSession.complete(sessionId, pointsEarned);

    // Award points to user
    await User.addPoints(userId, pointsEarned);

    // Update user stats
    await VocabularyUserStats.incrementQuizzesCompleted(userId);

    // Update words learned count
    const wordsLearnedCount = await VocabularyUserHistory.getCorrectlyAnsweredWordIds(userId);
    await VocabularyUserStats.updateWordsLearned(userId, wordsLearnedCount.length);

    // Get final stats
    const stats = await VocabularyUserStats.getStats(userId);

    return {
      sessionId: session.id,
      totalQuestions: session.total_questions,
      correctAnswers: session.correct_answers,
      wrongAnswers: session.wrong_answers,
      score: Math.round((session.correct_answers / session.total_questions) * 100),
      pointsEarned,
      accumulatedFails: stats.accumulated_fails,
      reviewRequired: stats.accumulated_fails >= 10
    };
  }

  /**
   * Check if review mode should be triggered
   */
  static async checkReviewModeTrigger(userId) {
    const stats = await VocabularyUserStats.findOrCreate(userId);
    const failedWords = await VocabularyFailedWords.getPendingReviewWords(userId);

    return {
      reviewRequired: stats.accumulated_fails >= 10,
      accumulatedFails: stats.accumulated_fails,
      failedWordsCount: failedWords.length
    };
  }

  /**
   * Start a review session
   */
  static async startReviewSession(userId) {
    // Get failed words
    const failedWords = await VocabularyFailedWords.getPendingReviewWords(userId);

    if (failedWords.length === 0) {
      throw new Error('No failed words to review');
    }

    // Create review session
    const quizSize = Math.min(failedWords.length, 20);  // Max 20 words per review
    const session = await VocabularyQuizSession.create(
      userId,
      'review',
      quizSize,
      1,  // Review includes all difficulties
      10
    );

    return {
      sessionId: session.id,
      quizSize,
      failedWordsCount: failedWords.length
    };
  }

  /**
   * Get sentences for review mode educational phase
   */
  static async getReviewSentences(userId) {
    const failedWords = await VocabularyFailedWords.getPendingReviewWords(userId, 20);
    const wordIds = failedWords.map(fw => fw.word_id);

    const wordsWithSentences = await VocabularyWord.findWithSentences(wordIds);

    return {
      words: wordsWithSentences.map(w => ({
        id: w.id,
        english: w.english_word,
        hebrew: w.hebrew_translation,
        sentenceEn: w.sentence_en || `Example sentence with "${w.english_word}"`,
        sentenceHe: w.sentence_he || `משפט לדוגמה עם המילה "${w.english_word}"`
      }))
    };
  }

  /**
   * Submit answer for review quiz (2x points)
   */
  static async submitReviewAnswer(sessionId, userId, wordId, userAnswerId) {
    // Use same logic as regular answer
    const result = await this.submitAnswer(sessionId, userId, wordId, userAnswerId);

    // Double the points for review mode
    if (result.isCorrect) {
      result.pointsEarned = 2;

      // Mark word as reviewed successfully
      await VocabularyFailedWords.resetWordStatus(userId, wordId);
    }

    return result;
  }

  /**
   * Complete a review session
   */
  static async completeReviewSession(sessionId, userId) {
    const session = await VocabularyQuizSession.findById(sessionId);

    if (!session || session.user_id !== userId) {
      throw new Error('Invalid session');
    }

    // Calculate total points (2 points per correct answer in review)
    const pointsEarned = session.correct_answers * 2;

    // Complete the session
    await VocabularyQuizSession.complete(sessionId, pointsEarned);

    // Award points to user
    await User.addPoints(userId, pointsEarned);

    // Update accumulated fails: new_fails = 10 - correct_answers
    const correctCount = session.correct_answers;
    const newAccumulatedFails = Math.max(0, 10 - correctCount);
    await VocabularyUserStats.setFails(userId, newAccumulatedFails);

    // Update user stats
    await VocabularyUserStats.incrementReviewSessions(userId);

    // Get final stats
    const stats = await VocabularyUserStats.getStats(userId);

    return {
      sessionId: session.id,
      totalQuestions: session.total_questions,
      correctAnswers: session.correct_answers,
      wrongAnswers: session.wrong_answers,
      score: Math.round((session.correct_answers / session.total_questions) * 100),
      pointsEarned,
      accumulatedFails: stats.accumulated_fails,
      failsCleared: correctCount
    };
  }

  /**
   * Get user vocabulary statistics
   */
  static async getUserVocabularyStats(userId) {
    const stats = await VocabularyUserStats.findOrCreate(userId);
    const sessionStats = await VocabularyQuizSession.getUserSessionStats(userId);
    const failedStats = await VocabularyFailedWords.getUserFailedStats(userId);
    const progressByDifficulty = await VocabularyUserHistory.getProgressByDifficulty(userId);

    return {
      accumulatedFails: stats.accumulated_fails,
      totalWordsLearned: stats.total_words_learned,
      totalQuizzesCompleted: stats.total_quizzes_completed,
      totalReviewSessions: stats.total_review_sessions,
      sessionStats: {
        totalSessions: parseInt(sessionStats.total_sessions),
        completedSessions: parseInt(sessionStats.completed_sessions),
        reviewSessions: parseInt(sessionStats.review_sessions),
        averageScore: Math.round(parseFloat(sessionStats.average_score)),
        totalPointsEarned: parseInt(sessionStats.total_points_earned)
      },
      failedStats: {
        totalFailedWords: parseInt(failedStats.total_failed_words),
        pendingReviewWords: parseInt(failedStats.pending_review_words),
        reviewedWords: parseInt(failedStats.reviewed_words),
        totalFails: parseInt(failedStats.total_fails)
      },
      progressByDifficulty
    };
  }

  /**
   * Start a smart quiz (30% failed words, 70% new words)
   */
  static async startSmartQuiz(userId, quizSize, startingDifficulty = 1, source = null) {
    // Check if user has an active session
    const activeSession = await VocabularyQuizSession.getActiveSession(userId);
    if (activeSession) {
      return {
        error: 'You already have an active quiz session',
        sessionId: activeSession.id
      };
    }

    const failedWordCount = Math.ceil(quizSize * 0.3);  // 30% failed words
    const newWordCount = quizSize - failedWordCount;    // 70% new words

    // Get prioritized failed words from ANY difficulty level
    const failedWords = await VocabularyWordScores.getPrioritizedFailedWords(userId, failedWordCount);

    // Get new words (never attempted) from selected difficulty range
    const stage = this.DIFFICULTY_STAGES[startingDifficulty];
    const attemptedIds = await VocabularyWordScores.getAllAttemptedWordIds(userId);

    const newWords = await VocabularyWord.findByDifficultyRange(
      stage.min,
      stage.max,
      attemptedIds,
      newWordCount,
      source
    );

    // If we don't have enough new words, fill with any unattempted words
    if (newWords.length < newWordCount && newWordCount > 0) {
      const additionalNeeded = newWordCount - newWords.length;
      const additionalWords = await VocabularyWord.findByDifficultyRange(
        1,
        10,
        attemptedIds,
        additionalNeeded,
        source
      );
      newWords.push(...additionalWords);
    }

    // Create session
    const session = await VocabularyQuizSession.create(
      userId,
      'smart',  // New quiz type
      quizSize,
      stage.min,
      stage.max,
      source
    );

    return {
      sessionId: session.id,
      quizSize: session.quiz_size,
      currentStage: session.current_difficulty_stage,
      difficultyRange: {
        min: session.difficulty_range_start,
        max: session.difficulty_range_end
      },
      source: session.source,
      failedWordsIncluded: failedWords.length,
      newWordsIncluded: newWords.length
    };
  }

  /**
   * Start a failed words quiz (only struggling words)
   */
  static async startFailedWordsQuiz(userId) {
    // Check if user has an active session
    const activeSession = await VocabularyQuizSession.getActiveSession(userId);
    if (activeSession) {
      return {
        error: 'You already have an active quiz session',
        sessionId: activeSession.id
      };
    }

    // Get all struggling words (last 2+ attempts failed)
    const failedWords = await VocabularyWordScores.getRecentlyFailedWords(userId);

    if (failedWords.length === 0) {
      throw new Error('אין מילים קשות לחזרה. כל הכבוד!');
    }

    // Limit to 30 words max per quiz
    const quizSize = Math.min(failedWords.length, 30);

    // Create session
    const session = await VocabularyQuizSession.create(
      userId,
      'failed_words',  // New quiz type
      quizSize,
      1,  // Include all difficulty levels
      10,
      null  // All sources
    );

    return {
      sessionId: session.id,
      quizSize,
      totalFailedWords: failedWords.length,
      reviewMode: true
    };
  }

  /**
   * Start a past errors quiz (words with 1+ failures in history)
   * This includes words that may now be mastered but had failures along the way
   */
  static async startPastErrorsQuiz(userId, quizSize = 20, minFailures = 1) {
    // Check if user has an active session
    const activeSession = await VocabularyQuizSession.getActiveSession(userId);
    if (activeSession) {
      return {
        error: 'You already have an active quiz session',
        sessionId: activeSession.id
      };
    }

    // Get words with past errors
    const wordsWithErrors = await VocabularyWordScores.getWordsWithPastErrors(userId, minFailures);

    if (wordsWithErrors.length === 0) {
      throw new Error('לא נמצאו מילים עם טעויות קודמות. כל הכבוד!');
    }

    // Limit to requested quiz size
    const actualQuizSize = Math.min(wordsWithErrors.length, quizSize);

    // Create session
    const session = await VocabularyQuizSession.create(
      userId,
      'past_errors',  // New quiz type
      actualQuizSize,
      1,  // Include all difficulty levels
      10,
      null  // All sources
    );

    return {
      sessionId: session.id,
      quizSize: actualQuizSize,
      totalWordsWithErrors: wordsWithErrors.length,
      minFailures
    };
  }

  /**
   * Get detailed user statistics including mastery breakdown
   */
  static async getDetailedUserStats(userId) {
    const baseStats = await this.getUserVocabularyStats(userId);

    // Add word score statistics
    const wordScoreStats = await VocabularyWordScores.getStatsSummary(userId);
    const topStrugglingWords = await VocabularyWordScores.getTopStrugglingWords(userId, 10);
    const recentlyMasteredWords = await VocabularyWordScores.getRecentlyMastered(userId, 5);

    return {
      ...baseStats,
      uniqueWordsWithSuccess: wordScoreStats.wordsWithSuccess,
      uniqueWordsWithFailure: wordScoreStats.wordsWithFailure,
      wordsByMastery: wordScoreStats.byMastery,
      topStrugglingWords: topStrugglingWords.map(w => ({
        id: w.word_id,
        english: w.english_word,
        hebrew: w.hebrew_translation,
        difficulty: w.difficulty_level,
        failCount: w.fail_count,
        successCount: w.success_count
      })),
      recentlyMasteredWords: recentlyMasteredWords.map(w => ({
        id: w.word_id,
        english: w.english_word,
        hebrew: w.hebrew_translation,
        difficulty: w.difficulty_level,
        masteredAt: w.last_attempt_at
      }))
    };
  }
}

module.exports = VocabularyService;
