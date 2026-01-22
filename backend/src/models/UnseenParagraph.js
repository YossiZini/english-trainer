const { db } = require('../config/database');

class UnseenParagraph {
  /**
   * Find all paragraphs with optional filters
   */
  static async findAll(filters = {}) {
    const { complexity, topic, isCustom, limit = 100, offset = 0 } = filters;

    let paragraphs = db.find('unseen_paragraphs', {});

    // Apply filters
    if (complexity !== undefined) {
      paragraphs = paragraphs.filter(p => p.complexity_level === complexity);
    }

    if (topic) {
      paragraphs = paragraphs.filter(p => p.topic === topic);
    }

    if (isCustom !== undefined) {
      paragraphs = paragraphs.filter(p => p.is_custom === isCustom);
    }

    // Sort by complexity_level ascending, then by title_en ascending
    paragraphs.sort((a, b) => {
      if (a.complexity_level !== b.complexity_level) {
        return a.complexity_level - b.complexity_level;
      }
      return (a.title_en || '').localeCompare(b.title_en || '');
    });

    // Apply pagination
    const paginated = paragraphs.slice(offset, offset + limit);

    return paginated.map(p => ({
      id: p.id,
      title_en: p.title_en,
      title_he: p.title_he,
      content: p.content,
      complexity_level: p.complexity_level,
      topic: p.topic,
      hard_words: p.hard_words,
      is_custom: p.is_custom,
      uses_failed_words: p.uses_failed_words,
      created_at: p.created_at
    }));
  }

  /**
   * Find a single paragraph by ID
   */
  static async findById(id) {
    const paragraph = db.findById('unseen_paragraphs', id);
    if (!paragraph) return undefined;

    return {
      id: paragraph.id,
      title_en: paragraph.title_en,
      title_he: paragraph.title_he,
      content: paragraph.content,
      complexity_level: paragraph.complexity_level,
      topic: paragraph.topic,
      hard_words: paragraph.hard_words,
      is_custom: paragraph.is_custom,
      uses_failed_words: paragraph.uses_failed_words,
      created_at: paragraph.created_at
    };
  }

  /**
   * Create a new paragraph
   */
  static async create(paragraphData) {
    const {
      titleEn,
      titleHe = null,
      content,
      complexityLevel,
      topic = null,
      hardWords = [],
      isCustom = false,
      usesFailedWords = false,
      createdBy = null
    } = paragraphData;

    const timestamp = new Date().toISOString();

    const paragraph = db.insert('unseen_paragraphs', {
      title_en: titleEn,
      title_he: titleHe,
      content: content,
      complexity_level: complexityLevel,
      topic: topic,
      hard_words: hardWords,
      is_custom: isCustom,
      uses_failed_words: usesFailedWords,
      created_by: createdBy,
      created_at: timestamp
    });

    return {
      id: paragraph.id,
      title_en: paragraph.title_en,
      title_he: paragraph.title_he,
      complexity_level: paragraph.complexity_level,
      topic: paragraph.topic
    };
  }

  /**
   * Update an existing paragraph
   */
  static async update(id, paragraphData) {
    const {
      titleEn,
      titleHe,
      content,
      complexityLevel,
      topic,
      hardWords
    } = paragraphData;

    const existing = db.findById('unseen_paragraphs', id);
    if (!existing) return undefined;

    const updateData = {};

    if (titleEn !== undefined) updateData.title_en = titleEn;
    if (titleHe !== undefined) updateData.title_he = titleHe;
    if (content !== undefined) updateData.content = content;
    if (complexityLevel !== undefined) updateData.complexity_level = complexityLevel;
    if (topic !== undefined) updateData.topic = topic;
    if (hardWords !== undefined) updateData.hard_words = hardWords;

    db.updateById('unseen_paragraphs', id, updateData);

    const updated = db.findById('unseen_paragraphs', id);
    return {
      id: updated.id,
      title_en: updated.title_en,
      title_he: updated.title_he,
      complexity_level: updated.complexity_level,
      topic: updated.topic
    };
  }

  /**
   * Delete a paragraph
   */
  static async delete(id) {
    const existing = db.findById('unseen_paragraphs', id);
    if (!existing) return undefined;

    db.deleteById('unseen_paragraphs', id);
    return { id };
  }

  /**
   * Get count of paragraphs by complexity level
   */
  static async getCountByComplexity() {
    const paragraphs = db.find('unseen_paragraphs', {});

    // Group by complexity level
    const counts = new Map();
    for (const p of paragraphs) {
      const level = p.complexity_level;
      counts.set(level, (counts.get(level) || 0) + 1);
    }

    // Convert to array and sort
    const result = [];
    for (const [complexity_level, count] of counts) {
      result.push({ complexity_level, count });
    }
    result.sort((a, b) => a.complexity_level - b.complexity_level);

    return result;
  }

  /**
   * Get all unique topics
   */
  static async getAllTopics() {
    const paragraphs = db.find('unseen_paragraphs', {});

    // Get unique topics
    const topicSet = new Set();
    for (const p of paragraphs) {
      if (p.topic) {
        topicSet.add(p.topic);
      }
    }

    // Convert to sorted array
    const result = Array.from(topicSet);
    result.sort();

    return result;
  }

  /**
   * Get total paragraph count
   */
  static async getTotalCount() {
    return db.count('unseen_paragraphs');
  }
}

module.exports = UnseenParagraph;
