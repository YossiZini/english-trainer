const { db, withTransaction } = require('../config/database');
const { shuffleArray } = require('../data/loadStaticData');

class VocabularyWord {
  /**
   * Find all words
   */
  static async findAll(limit = 100, offset = 0) {
    const words = db.find('vocabulary_words', {}, {
      sort: { difficulty_level: 'asc', english_word: 'asc' },
      offset,
      limit
    });

    return words;
  }

  /**
   * Find words by difficulty range, excluding specific word IDs
   * Used for quiz question selection
   */
  static async findByDifficultyRange(minLevel, maxLevel, excludeWordIds = [], limit = 100, source = null) {
    let allWords = db.getCollection('vocabulary_words', true);

    // Filter by difficulty range
    let filtered = allWords.filter(w =>
      w.difficulty_level >= minLevel && w.difficulty_level <= maxLevel
    );

    // Filter by source if provided
    if (source) {
      filtered = filtered.filter(w => w.source === source);
    }

    // Exclude specific word IDs
    if (excludeWordIds.length > 0) {
      const excludeSet = new Set(excludeWordIds);
      filtered = filtered.filter(w => !excludeSet.has(w.id));
    }

    // Shuffle for randomness
    shuffleArray(filtered);

    // Limit results
    const result = filtered.slice(0, limit);

    // Return only needed fields
    return result.map(w => ({
      id: w.id,
      english_word: w.english_word,
      hebrew_translation: w.hebrew_translation,
      difficulty_level: w.difficulty_level,
      source: w.source
    }));
  }

  /**
   * Find a single word by ID
   */
  static async findById(id) {
    const word = db.findById('vocabulary_words', id);
    if (!word) return null;

    return {
      id: word.id,
      english_word: word.english_word,
      hebrew_translation: word.hebrew_translation,
      difficulty_level: word.difficulty_level,
      source: word.source,
      sentence_en: word.sentence_en,
      sentence_he: word.sentence_he
    };
  }

  /**
   * Get random wrong options for multiple choice
   * Selects words from similar difficulty level (±2)
   */
  static async getRandomWrongOptions(correctWordId, correctDifficulty, count = 3, source = null) {
    const minDifficulty = Math.max(1, correctDifficulty - 2);
    const maxDifficulty = Math.min(10, correctDifficulty + 2);

    // Get the correct word's translation to exclude it
    const correctWord = db.findById('vocabulary_words', correctWordId);
    const correctTranslation = correctWord?.hebrew_translation;

    let allWords = db.getCollection('vocabulary_words', true);

    // Filter by criteria
    let filtered = allWords.filter(w =>
      w.id !== correctWordId &&
      w.difficulty_level >= minDifficulty &&
      w.difficulty_level <= maxDifficulty &&
      w.hebrew_translation !== correctTranslation
    );

    // Filter by source if provided
    if (source) {
      filtered = filtered.filter(w => w.source === source);
    }

    // Shuffle and take count
    shuffleArray(filtered);
    const result = filtered.slice(0, count);

    return result.map(w => ({
      id: w.id,
      hebrew_translation: w.hebrew_translation
    }));
  }

  /**
   * Find words with sentences (for review mode educational phase)
   */
  static async findWithSentences(wordIds) {
    if (!wordIds || wordIds.length === 0) {
      return [];
    }

    const wordIdSet = new Set(wordIds);
    const allWords = db.getCollection('vocabulary_words', true);

    const result = allWords
      .filter(w => wordIdSet.has(w.id))
      .map(w => ({
        id: w.id,
        english_word: w.english_word,
        hebrew_translation: w.hebrew_translation,
        difficulty_level: w.difficulty_level,
        sentence_en: w.sentence_en,
        sentence_he: w.sentence_he
      }));

    // Sort by difficulty
    result.sort((a, b) => a.difficulty_level - b.difficulty_level);

    return result;
  }

  /**
   * Create a new vocabulary word
   */
  static async create(wordData) {
    const {
      englishWord,
      hebrewTranslation,
      difficultyLevel,
      source,
      sentenceEn = null,
      sentenceHe = null
    } = wordData;

    // Check if word already exists (upsert)
    const existing = db.findOne('vocabulary_words', {
      english_word: englishWord,
      source
    });

    if (existing) {
      db.updateById('vocabulary_words', existing.id, {
        hebrew_translation: hebrewTranslation,
        difficulty_level: difficultyLevel,
        sentence_en: sentenceEn,
        sentence_he: sentenceHe
      });
      return {
        id: existing.id,
        english_word: englishWord,
        hebrew_translation: hebrewTranslation,
        difficulty_level: difficultyLevel
      };
    }

    const word = db.insert('vocabulary_words', {
      english_word: englishWord,
      hebrew_translation: hebrewTranslation,
      difficulty_level: difficultyLevel,
      source,
      sentence_en: sentenceEn,
      sentence_he: sentenceHe,
      created_at: new Date().toISOString()
    });

    return {
      id: word.id,
      english_word: word.english_word,
      hebrew_translation: word.hebrew_translation,
      difficulty_level: word.difficulty_level
    };
  }

  /**
   * Bulk insert vocabulary words
   * Used during CSV import
   */
  static async bulkCreate(wordsArray) {
    if (!wordsArray || wordsArray.length === 0) {
      return [];
    }

    return withTransaction(async () => {
      const insertedWords = [];

      for (const wordData of wordsArray) {
        const result = await this.create(wordData);
        insertedWords.push(result);
      }

      return insertedWords;
    });
  }

  /**
   * Get count of words by difficulty level
   * Useful for statistics
   */
  static async getCountByDifficulty() {
    const allWords = db.getCollection('vocabulary_words', true);

    // Group by difficulty level
    const counts = new Map();
    for (const word of allWords) {
      const level = word.difficulty_level;
      counts.set(level, (counts.get(level) || 0) + 1);
    }

    // Convert to array and sort
    const result = [];
    for (const [difficulty_level, count] of counts) {
      result.push({ difficulty_level, count });
    }
    result.sort((a, b) => a.difficulty_level - b.difficulty_level);

    return result;
  }

  /**
   * Get total word count
   */
  static async getTotalCount() {
    return db.count('vocabulary_words');
  }
}

module.exports = VocabularyWord;
