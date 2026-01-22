const { db, withTransaction } = require('../config/database');

class UnseenQuestion {
  /**
   * Find all questions for a paragraph
   */
  static async findByParagraphId(paragraphId) {
    const questions = db.find('unseen_questions', { paragraph_id: paragraphId });

    // Sort by question_number ascending
    questions.sort((a, b) => a.question_number - b.question_number);

    return questions.map(q => ({
      id: q.id,
      paragraph_id: q.paragraph_id,
      question_number: q.question_number,
      question_text_en: q.question_text_en,
      question_text_he: q.question_text_he,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation_he: q.explanation_he,
      created_at: q.created_at
    }));
  }

  /**
   * Find a single question by ID
   */
  static async findById(id) {
    const question = db.findById('unseen_questions', id);
    if (!question) return undefined;

    return {
      id: question.id,
      paragraph_id: question.paragraph_id,
      question_number: question.question_number,
      question_text_en: question.question_text_en,
      question_text_he: question.question_text_he,
      options: question.options,
      correct_answer: question.correct_answer,
      explanation_he: question.explanation_he,
      created_at: question.created_at
    };
  }

  /**
   * Create a new question
   */
  static async create(questionData) {
    const {
      paragraphId,
      questionNumber,
      questionTextEn,
      questionTextHe = null,
      options,
      correctAnswer,
      explanationHe = null
    } = questionData;

    const timestamp = new Date().toISOString();

    const question = db.insert('unseen_questions', {
      paragraph_id: paragraphId,
      question_number: questionNumber,
      question_text_en: questionTextEn,
      question_text_he: questionTextHe,
      options: options,
      correct_answer: correctAnswer,
      explanation_he: explanationHe,
      created_at: timestamp
    });

    return {
      id: question.id,
      paragraph_id: question.paragraph_id,
      question_number: question.question_number,
      question_text_en: question.question_text_en
    };
  }

  /**
   * Bulk create questions for a paragraph
   */
  static async bulkCreate(paragraphId, questionsArray) {
    if (!questionsArray || questionsArray.length === 0) {
      return [];
    }

    return withTransaction(async () => {
      const createdQuestions = [];

      for (const questionData of questionsArray) {
        const timestamp = new Date().toISOString();

        const question = db.insert('unseen_questions', {
          paragraph_id: paragraphId,
          question_number: questionData.questionNumber,
          question_text_en: questionData.questionTextEn,
          question_text_he: questionData.questionTextHe || null,
          options: questionData.options,
          correct_answer: questionData.correctAnswer,
          explanation_he: questionData.explanationHe || null,
          created_at: timestamp
        });

        createdQuestions.push({
          id: question.id,
          question_number: question.question_number
        });
      }

      return createdQuestions;
    });
  }

  /**
   * Update a question
   */
  static async update(id, questionData) {
    const {
      questionTextEn,
      questionTextHe,
      options,
      correctAnswer,
      explanationHe
    } = questionData;

    const existing = db.findById('unseen_questions', id);
    if (!existing) return undefined;

    const updateData = {};

    if (questionTextEn !== undefined) updateData.question_text_en = questionTextEn;
    if (questionTextHe !== undefined) updateData.question_text_he = questionTextHe;
    if (options !== undefined) updateData.options = options;
    if (correctAnswer !== undefined) updateData.correct_answer = correctAnswer;
    if (explanationHe !== undefined) updateData.explanation_he = explanationHe;

    db.updateById('unseen_questions', id, updateData);

    const updated = db.findById('unseen_questions', id);
    return {
      id: updated.id,
      paragraph_id: updated.paragraph_id,
      question_number: updated.question_number
    };
  }

  /**
   * Delete a question
   */
  static async delete(id) {
    const existing = db.findById('unseen_questions', id);
    if (!existing) return undefined;

    db.deleteById('unseen_questions', id);
    return { id };
  }

  /**
   * Delete all questions for a paragraph
   */
  static async deleteByParagraphId(paragraphId) {
    const questions = db.find('unseen_questions', { paragraph_id: paragraphId });

    const deleted = [];
    for (const q of questions) {
      db.deleteById('unseen_questions', q.id);
      deleted.push({ id: q.id });
    }

    return deleted;
  }

  /**
   * Get count of questions for a paragraph
   */
  static async getCountByParagraphId(paragraphId) {
    const questions = db.find('unseen_questions', { paragraph_id: paragraphId });
    return questions.length;
  }
}

module.exports = UnseenQuestion;
