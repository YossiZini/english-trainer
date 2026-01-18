const { pool } = require('../config/database');

class VocabularyWord {
  /**
   * Find all words
   */
  static async findAll(limit = 100, offset = 0) {
    const query = `
      SELECT id, english_word, hebrew_translation, difficulty_level,
             source, sentence_en, sentence_he, created_at
      FROM vocabulary_words
      ORDER BY difficulty_level ASC, english_word ASC
      LIMIT $1 OFFSET $2
    `;

    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  /**
   * Find words by difficulty range, excluding specific word IDs
   * Used for quiz question selection
   */
  static async findByDifficultyRange(minLevel, maxLevel, excludeWordIds = [], limit = 100, source = null) {
    let query = `
      SELECT id, english_word, hebrew_translation, difficulty_level, source
      FROM vocabulary_words
      WHERE difficulty_level >= $1 AND difficulty_level <= $2
    `;

    const values = [minLevel, maxLevel];

    // Filter by source if provided
    if (source) {
      query += ` AND source = $${values.length + 1}`;
      values.push(source);
    }

    if (excludeWordIds.length > 0) {
      query += ` AND id NOT IN (${excludeWordIds.map((_, i) => `$${values.length + i + 1}`).join(', ')})`;
      values.push(...excludeWordIds);
    }

    query += ` ORDER BY RANDOM() LIMIT $${values.length + 1}`;
    values.push(limit);

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Find a single word by ID
   */
  static async findById(id) {
    const query = `
      SELECT id, english_word, hebrew_translation, difficulty_level,
             source, sentence_en, sentence_he
      FROM vocabulary_words
      WHERE id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Get random wrong options for multiple choice
   * Selects words from similar difficulty level (±2)
   */
  static async getRandomWrongOptions(correctWordId, correctDifficulty, count = 3, source = null) {
    const minDifficulty = Math.max(1, correctDifficulty - 2);
    const maxDifficulty = Math.min(10, correctDifficulty + 2);

    let query = `
      SELECT id, hebrew_translation
      FROM vocabulary_words
      WHERE id != $1
        AND difficulty_level >= $2
        AND difficulty_level <= $3
        AND hebrew_translation NOT IN (
          SELECT hebrew_translation
          FROM vocabulary_words
          WHERE id = $1
        )`;

    const values = [correctWordId, minDifficulty, maxDifficulty];

    if (source) {
      query += ` AND source = $${values.length + 1}`;
      values.push(source);
    }

    query += ` ORDER BY RANDOM() LIMIT $${values.length + 1}`;
    values.push(count);

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Find words with sentences (for review mode educational phase)
   */
  static async findWithSentences(wordIds) {
    if (!wordIds || wordIds.length === 0) {
      return [];
    }

    const query = `
      SELECT id, english_word, hebrew_translation, difficulty_level,
             sentence_en, sentence_he
      FROM vocabulary_words
      WHERE id = ANY($1)
      ORDER BY difficulty_level ASC
    `;

    const result = await pool.query(query, [wordIds]);
    return result.rows;
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

    const query = `
      INSERT INTO vocabulary_words (
        english_word, hebrew_translation, difficulty_level,
        source, sentence_en, sentence_he
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (english_word, source) DO UPDATE
      SET hebrew_translation = EXCLUDED.hebrew_translation,
          difficulty_level = EXCLUDED.difficulty_level,
          sentence_en = EXCLUDED.sentence_en,
          sentence_he = EXCLUDED.sentence_he
      RETURNING id, english_word, hebrew_translation, difficulty_level
    `;

    const values = [
      englishWord,
      hebrewTranslation,
      difficultyLevel,
      source,
      sentenceEn,
      sentenceHe
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Bulk insert vocabulary words
   * Used during CSV import
   */
  static async bulkCreate(wordsArray) {
    if (!wordsArray || wordsArray.length === 0) {
      return [];
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const insertedWords = [];
      for (const wordData of wordsArray) {
        const result = await client.query(
          `
          INSERT INTO vocabulary_words (
            english_word, hebrew_translation, difficulty_level,
            source, sentence_en, sentence_he
          )
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (english_word, source) DO UPDATE
          SET hebrew_translation = EXCLUDED.hebrew_translation,
              difficulty_level = EXCLUDED.difficulty_level,
              sentence_en = EXCLUDED.sentence_en,
              sentence_he = EXCLUDED.sentence_he
          RETURNING id
          `,
          [
            wordData.englishWord,
            wordData.hebrewTranslation,
            wordData.difficultyLevel,
            wordData.source,
            wordData.sentenceEn || null,
            wordData.sentenceHe || null
          ]
        );
        insertedWords.push(result.rows[0]);
      }

      await client.query('COMMIT');
      return insertedWords;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get count of words by difficulty level
   * Useful for statistics
   */
  static async getCountByDifficulty() {
    const query = `
      SELECT difficulty_level, COUNT(*) as count
      FROM vocabulary_words
      GROUP BY difficulty_level
      ORDER BY difficulty_level ASC
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Get total word count
   */
  static async getTotalCount() {
    const query = 'SELECT COUNT(*) as total FROM vocabulary_words';
    const result = await pool.query(query);
    return parseInt(result.rows[0].total);
  }
}

module.exports = VocabularyWord;
