const WrongAnswer = require('../models/WrongAnswer');
const Exercise = require('../models/Exercise');
const { pool } = require('../config/database');

class MistakesService {
  /**
   * Get all mistakes for a lesson
   */
  static async getMistakesByLesson(userId, lessonId, onlyUncorrected = false) {
    const mistakes = await WrongAnswer.findByUserAndLesson(userId, lessonId, onlyUncorrected);
    return mistakes;
  }

  /**
   * Get all mistakes for a user across all lessons
   */
  static async getAllMistakes(userId, onlyUncorrected = false) {
    const mistakes = await WrongAnswer.findByUser(userId, onlyUncorrected);
    return mistakes;
  }

  /**
   * Mark mistakes as reviewed
   */
  static async markMistakesAsReviewed(userId, lessonId) {
    const count = await WrongAnswer.markAsReviewed(userId, lessonId);
    return { reviewedCount: count };
  }

  /**
   * Submit retry attempt for wrong answers
   */
  static async submitRetry(userId, lessonId, answers) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Get all uncorrected mistakes for this lesson
      const mistakes = await WrongAnswer.findByUserAndLesson(userId, lessonId, true);

      if (mistakes.length === 0) {
        throw new Error('No uncorrected mistakes found for this lesson');
      }

      // Check each answer
      const results = [];
      let correctedCount = 0;

      for (const answer of answers) {
        const mistake = mistakes.find(m => m.exercise_id === answer.exerciseId);

        if (!mistake) {
          continue; // Skip if not found
        }

        const normalizedUserAnswer = answer.userAnswer.trim().toLowerCase();
        const normalizedCorrectAnswer = mistake.correct_answer.trim().toLowerCase();
        const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;

        results.push({
          exerciseId: answer.exerciseId,
          userAnswer: answer.userAnswer,
          correctAnswer: mistake.correct_answer,
          isCorrect,
          questionTextHe: mistake.question_text_he
        });

        // Mark as corrected if answered correctly
        if (isCorrect) {
          await WrongAnswer.markAsCorrected(answer.exerciseId, userId);
          correctedCount++;
        }
      }

      await client.query('COMMIT');

      const totalQuestions = results.length;
      const correctAnswers = results.filter(r => r.isCorrect).length;
      const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

      // Check if there are still uncorrected mistakes
      const hasMoreMistakes = await WrongAnswer.hasUncorrectedMistakes(userId, lessonId);

      return {
        totalQuestions,
        correctAnswers,
        wrongAnswers: totalQuestions - correctAnswers,
        score,
        correctedCount,
        hasMoreMistakes,
        results
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get mistake statistics
   */
  static async getStatistics(userId) {
    const stats = await WrongAnswer.getStatistics(userId);
    const byLesson = await WrongAnswer.getMistakesByLesson(userId);

    return {
      overall: stats,
      byLesson
    };
  }

  /**
   * Get exercises for retry (only uncorrected mistakes)
   */
  static async getExercisesForRetry(userId, lessonId) {
    const mistakes = await WrongAnswer.findByUserAndLesson(userId, lessonId, true);

    if (mistakes.length === 0) {
      return [];
    }

    // Transform mistakes into exercise format for the frontend
    const exercises = mistakes.map(mistake => ({
      id: mistake.exercise_id,
      questionNumber: mistake.question_number,
      type: mistake.type,
      questionTextHe: mistake.question_text_he,
      options: mistake.options,
      correctAnswer: mistake.correct_answer,
      explanationHe: mistake.explanation_he,
      explanationEn: mistake.explanation_en,
      previousWrongAnswer: mistake.user_answer,
      attemptNumber: mistake.attempt_number
    }));

    return exercises;
  }

  /**
   * Extract a comprehensive summary from HTML theory content
   * Includes main concept, rules/structure, and examples
   */
  static extractTheorySummary(htmlContent, maxLength = 1200) {
    if (!htmlContent) return null;

    let summary = '';

    // 1. Extract main concept (first paragraph or list after h2)
    const mainConceptMatch = htmlContent.match(/<h2[^>]*>.*?<\/h2>([\s\S]*?)(?=<h3|<h2|$)/i);
    if (mainConceptMatch) {
      let conceptText = mainConceptMatch[1]
        .replace(/<\/li>/g, '• ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (conceptText) {
        summary += conceptText.substring(0, 250) + '\n\n';
      }
    }

    // 2. Extract formula/structure (div.formula or first strong pattern)
    const formulaMatch = htmlContent.match(/<div class="formula"[^>]*>([\s\S]*?)<\/div>/i);
    if (formulaMatch) {
      const formula = formulaMatch[1]
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      summary += `📐 ${formula}\n\n`;
    }

    // 3. Extract key rules (from div.rules or ul under specific headers)
    const rulesMatch = htmlContent.match(/<div class="rules"[^>]*>([\s\S]*?)<\/div>/i);
    if (rulesMatch) {
      const rulesHtml = rulesMatch[1];

      // Extract each rule with its title and examples
      const ruleBlocks = rulesHtml.split(/<p><strong>/).filter(block => block.trim());
      const formattedRules = [];

      for (const block of ruleBlocks.slice(0, 3)) { // Take first 3 rule blocks
        // Extract the rule title (handles both "1. Title" and "Title" formats)
        const titleMatch = block.match(/^(\d+\.\s*)?(.*?)<\/strong><\/p>/);
        if (titleMatch) {
          const title = titleMatch[2].trim();

          // Extract examples (items in ul/li)
          const exampleMatches = block.match(/<li[^>]*>(.*?)<\/li>/g);
          if (exampleMatches) {
            const examples = exampleMatches
              .slice(0, 4) // Take first 4 examples per rule
              .map(ex => ex.replace(/<[^>]+>/g, '').trim())
              .filter(ex => ex)
              .join(', ');

            if (examples) {
              formattedRules.push(`📌 ${title}\n   ${examples}`);
            }
          } else {
            formattedRules.push(`📌 ${title}`);
          }
        }
      }

      if (formattedRules.length > 0) {
        summary += `חוקי דקדוק:\n${formattedRules.join('\n\n')}\n\n`;
      }
    } else {
      // If no formal rules section, try to extract useful lists from h3 sections
      // Look for sections like "Time Expressions", "Key Points", etc.
      const h3Sections = htmlContent.match(/<h3[^>]*>(.*?)<\/h3>([\s\S]*?)(?=<h3|<h2|$)/gi);
      if (h3Sections && h3Sections.length > 0) {
        const usefulSections = [];

        for (const section of h3Sections.slice(0, 2)) { // Take first 2 h3 sections
          const titleMatch = section.match(/<h3[^>]*>(.*?)<\/h3>/i);
          const contentMatch = section.match(/<h3[^>]*>.*?<\/h3>([\s\S]*)/i);

          if (titleMatch && contentMatch) {
            const title = titleMatch[1].replace(/<[^>]+>/g, '').trim();
            const content = contentMatch[1];

            // Extract list items
            const listItems = content.match(/<li[^>]*>(.*?)<\/li>/g);
            if (listItems && listItems.length > 0) {
              const items = listItems
                .slice(0, 5)
                .map(li => {
                  const text = li.replace(/<[^>]+>/g, '').trim();
                  return `• ${text}`;
                })
                .join('\n');

              if (items) {
                usefulSections.push(`**${title}**\n${items}`);
              }
            }
          }
        }

        if (usefulSections.length > 0) {
          summary += `מידע שימושי:\n${usefulSections.join('\n\n')}\n\n`;
        }
      }
    }

    // 4. Extract examples (from div.examples)
    const examplesMatch = htmlContent.match(/<div class="examples"[^>]*>([\s\S]*?)<\/div>/i);
    if (examplesMatch) {
      let examplesText = examplesMatch[1]
        .replace(/<\/p>/g, '\n')
        .replace(/<strong>/g, '**')
        .replace(/<\/strong>/g, '**')
        .replace(/<[^>]+>/g, '')
        .trim();

      // Split by newlines and filter for lines with content
      const lines = examplesText.split('\n').map(line => line.trim()).filter(line => line);

      // Group examples: take first 5-6 examples with their categories
      const exampleLines = [];
      let count = 0;
      let lastWasCategory = false;

      for (const line of lines) {
        if (line.includes('**') && !line.includes('-')) {
          // This is a category label (like "הרגלים:" or "עובדות:")
          if (exampleLines.length > 0) {
            exampleLines.push(''); // Add spacing between categories
          }
          exampleLines.push(line);
          lastWasCategory = true;
        } else if (line.includes('-')) {
          // This is an actual example with translation
          exampleLines.push(line);
          count++;
          lastWasCategory = false;
          if (count >= 5) break; // Take up to 5 examples total
        }
      }

      if (exampleLines.length > 0) {
        summary += `דוגמאות לשימוש:\n${exampleLines.join('\n')}`;
      }
    }

    // Trim to max length if needed
    if (summary.length > maxLength) {
      summary = summary.substring(0, maxLength).trim() + '...';
    }

    return {
      heading: null,
      content: summary.trim() || 'תיאוריה זמינה בשיעור המלא'
    };
  }

  /**
   * Get exercises for cross-topic test (mix of all topics, prioritizing wrong answers)
   */
  static async getCrossTopicTest(userId, questionCount = 20) {
    // Get all uncorrected mistakes across all topics
    const uncorrectedMistakes = await WrongAnswer.findByUser(userId, true);

    // Get all corrected mistakes as backup
    const correctedMistakes = await WrongAnswer.findByUser(userId, false);
    const allCorrectedOnly = correctedMistakes.filter(m => m.is_corrected);

    let selectedQuestions = [];

    // Prioritize uncorrected mistakes
    if (uncorrectedMistakes.length >= questionCount) {
      // We have enough uncorrected mistakes
      selectedQuestions = [...uncorrectedMistakes]
        .sort(() => Math.random() - 0.5)
        .slice(0, questionCount);
    } else {
      // Add all uncorrected mistakes
      selectedQuestions = [...uncorrectedMistakes];

      // Fill remaining with corrected mistakes
      const remaining = questionCount - selectedQuestions.length;
      if (remaining > 0 && allCorrectedOnly.length > 0) {
        const additionalQuestions = [...allCorrectedOnly]
          .sort(() => Math.random() - 0.5)
          .slice(0, remaining);
        selectedQuestions = [...selectedQuestions, ...additionalQuestions];
      }
    }

    // If still not enough questions, get some random exercises from all lessons
    if (selectedQuestions.length < questionCount) {
      const existingExerciseIds = selectedQuestions.map(q => q.exercise_id);

      // Get random exercises from database
      const query = `
        SELECT e.id as exercise_id, e.question_number, e.type,
               e.question_text_he, e.options, e.correct_answer,
               e.explanation_he, e.explanation_en, e.difficulty,
               l.id as lesson_id, l.title_he as lesson_title_he
        FROM exercises e
        JOIN lessons l ON e.lesson_id = l.id
        WHERE e.id NOT IN (${existingExerciseIds.length > 0 ? existingExerciseIds.map((_, i) => `$${i + 1}`).join(',') : 'NULL'})
        ORDER BY RANDOM()
        LIMIT $${existingExerciseIds.length + 1}
      `;

      const params = [...existingExerciseIds, questionCount - selectedQuestions.length];
      const result = await pool.query(query, params);

      selectedQuestions = [...selectedQuestions, ...result.rows];
    }

    // Transform to exercise format with snake_case and shuffle
    const exercises = selectedQuestions
      .sort(() => Math.random() - 0.5)
      .map((question, index) => ({
        id: question.exercise_id,
        question_number: index + 1,
        type: question.type,
        question_text_he: question.question_text_he,
        options: question.options,
        difficulty: question.difficulty || 'medium',
        lesson_title: question.lesson_title_he || question.lesson_title,
        is_from_mistakes: !!question.user_answer
      }));

    // Get unique topics with mistakes and their theory content
    const topicsQuery = `
      SELECT DISTINCT
        l.id as lesson_id,
        l.title_he,
        l.title_en,
        l.theory_content_he,
        COUNT(wa.id) as mistake_count,
        COUNT(CASE WHEN wa.is_corrected = FALSE THEN 1 END) as uncorrected_count
      FROM wrong_answers wa
      JOIN lessons l ON wa.lesson_id = l.id
      WHERE wa.user_id = $1
      GROUP BY l.id, l.title_he, l.title_en, l.theory_content_he
      ORDER BY uncorrected_count DESC, mistake_count DESC
      LIMIT 5
    `;

    const topicsResult = await pool.query(topicsQuery, [userId]);

    const topicSummaries = topicsResult.rows.map(topic => ({
      lessonId: topic.lesson_id,
      titleHe: topic.title_he,
      titleEn: topic.title_en,
      mistakeCount: parseInt(topic.mistake_count),
      uncorrectedCount: parseInt(topic.uncorrected_count),
      theorySummary: this.extractTheorySummary(topic.theory_content_he)
    }));

    return {
      totalQuestions: exercises.length,
      exercises,
      mistakeCount: uncorrectedMistakes.length,
      description: 'מבחן משולב מכל הנושאים',
      topicsWithTheory: topicSummaries
    };
  }
}

module.exports = MistakesService;
