const WrongAnswer = require('../models/WrongAnswer');
const Exercise = require('../models/Exercise');
const Lesson = require('../models/Lesson');
const { db, withTransaction } = require('../config/database');
const { shuffleArray } = require('../utils/shuffle');
const { isCorrectAnswer } = require('../utils/answers');
const { SUBJECTS } = require('../config/subjects');

/** At most this many questions in one mistakes exam. */
const EXAM_SIZE = 20;
const subjectOf = (lesson) => lesson.subject || 'english';

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
    return withTransaction(async () => {
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

        const isCorrect = isCorrectAnswer(
          { type: mistake.type, correct_answer: mistake.correct_answer }, answer.userAnswer);

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
    });
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

  /** How many different questions wait to be fixed, per subject. */
  static async waitingBySubject(userId) {
    const waiting = Object.fromEntries(SUBJECTS.map(subject => [subject, 0]));
    for (const { lesson } of await WrongAnswer.unfixedQuestions(userId)) {
      waiting[subjectOf(lesson)] = (waiting[subjectOf(lesson)] || 0) + 1;
    }
    return waiting;
  }

  /**
   * A mistakes exam: up to EXAM_SIZE of the subject's unfixed mistakes, in
   * random order, with no other questions. `waiting` counts all of the
   * subject's. The website's exam and the bot's session both start here.
   */
  static async pickSubjectExam(userId, subject) {
    const all = (await WrongAnswer.unfixedQuestions(userId)).filter(q => subjectOf(q.lesson) === subject);
    return { subject, waiting: all.length, questions: shuffleArray(all).slice(0, EXAM_SIZE) };
  }

  /** The website's mistakes exam: the questions without answers, options shuffled. */
  static async subjectExam(userId, subject) {
    const { waiting, questions } = await this.pickSubjectExam(userId, subject);
    return {
      subject,
      waiting,
      exercises: questions.map(({ exercise, lesson }, index) => ({
        id: exercise.id,
        question_number: index + 1,
        type: exercise.type,
        question_text_he: exercise.question_text_he,
        options: exercise.type === 'multiple_choice' && exercise.options ? shuffleArray(exercise.options) : exercise.options,
        difficulty: exercise.difficulty || 'medium',
        lesson_title: lesson.title_he,
        subject
      }))
    };
  }

  /**
   * One answer to a mistake, graded with the question as it is now. A right
   * answer fixes the mistake: every unfixed record of that question.
   */
  static async gradeMistake(userId, { exercise }, userAnswer) {
    const isCorrect = isCorrectAnswer(exercise, userAnswer);
    if (isCorrect) await WrongAnswer.markAsCorrected(exercise.id, userId);
    return { isCorrect, correctAnswer: exercise.correct_answer, explanationHe: exercise.explanation_he || null };
  }

  /**
   * A finished mistakes exam from the website. Only answers to the student's
   * unfixed mistakes in the subject are graded, each question once; anything
   * else is ignored. Returns the graded answers and how many still wait.
   */
  static async submitSubjectExam(userId, subject, answers) {
    const unfixed = new Map((await WrongAnswer.unfixedQuestions(userId))
      .filter(q => subjectOf(q.lesson) === subject)
      .map(q => [q.exercise.id, q]));
    const results = [];
    for (const { exerciseId, userAnswer } of answers.slice(0, EXAM_SIZE)) {
      const question = unfixed.get(exerciseId);
      if (!question) continue;
      unfixed.delete(exerciseId);
      const graded = await this.gradeMistake(userId, question, userAnswer);
      results.push({
        exerciseId,
        userAnswer,
        questionTextHe: question.exercise.question_text_he,
        lessonTitle: question.lesson.title_he,
        ...graded
      });
    }
    const correct = results.filter(r => r.isCorrect).length;
    return {
      subject,
      total: results.length,
      correct,
      fixed: correct,
      waiting: unfixed.size + results.length - correct,
      results
    };
  }

  /**
   * Get exercises for retry (only uncorrected mistakes)
   */
  static async getExercisesForRetry(userId, lessonId) {
    const { visible } = await Exercise.overlay();
    const mistakes = (await WrongAnswer.findByUserAndLesson(userId, lessonId, true)).filter(m => visible(m.exercise_id));

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
        const titleMatch = block.match(/^(\d+\.\s*)?(.*?)<\/strong><\/p>/);
        if (titleMatch) {
          const title = titleMatch[2].trim();

          const exampleMatches = block.match(/<li[^>]*>(.*?)<\/li>/g);
          if (exampleMatches) {
            const examples = exampleMatches
              .slice(0, 4)
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

      const lines = examplesText.split('\n').map(line => line.trim()).filter(line => line);

      const exampleLines = [];
      let count = 0;

      for (const line of lines) {
        if (line.includes('**') && !line.includes('-')) {
          if (exampleLines.length > 0) {
            exampleLines.push('');
          }
          exampleLines.push(line);
        } else if (line.includes('-')) {
          exampleLines.push(line);
          count++;
          if (count >= 5) break;
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
    // Questions hidden for review (reported) or removed are never served.
    const { visible, apply } = await Exercise.overlay();

    // Get all uncorrected mistakes across all topics
    const uncorrectedMistakes = (await WrongAnswer.findByUser(userId, true)).filter(m => visible(m.exercise_id));

    // Get all corrected mistakes as backup
    const correctedMistakes = await WrongAnswer.findByUser(userId, false);
    const allCorrectedOnly = correctedMistakes.filter(m => m.is_corrected && visible(m.exercise_id));

    let selectedQuestions = [];

    // Prioritize uncorrected mistakes
    if (uncorrectedMistakes.length >= questionCount) {
      // We have enough uncorrected mistakes
      selectedQuestions = shuffleArray([...uncorrectedMistakes])
        .slice(0, questionCount);
    } else {
      // Add all uncorrected mistakes
      selectedQuestions = [...uncorrectedMistakes];

      // Fill remaining with corrected mistakes
      const remaining = questionCount - selectedQuestions.length;
      if (remaining > 0 && allCorrectedOnly.length > 0) {
        const additionalQuestions = shuffleArray([...allCorrectedOnly])
          .slice(0, remaining);
        selectedQuestions = [...selectedQuestions, ...additionalQuestions];
      }
    }

    const lessons = db.getCollection('lessons', true);
    const lessonMap = new Map(lessons.map(l => [l.id, l]));
    const subjectOf = (lessonId) => lessonMap.get(lessonId)?.subject || 'english';

    // If still not enough questions, pad with random exercises from the
    // subjects the student made mistakes in (English when there are none), so
    // an English test is not sprinkled with Math questions or vice versa.
    if (selectedQuestions.length < questionCount) {
      const existingExerciseIds = new Set(selectedQuestions.map(q => q.exercise_id));
      const subjects = new Set(selectedQuestions.map(q => subjectOf(q.lesson_id)));
      if (subjects.size === 0) subjects.add('english');

      // Get all exercises from static collection
      const allExercises = db.getCollection('exercises', true);

      // Filter out already selected exercises and shuffle
      const availableExercises = allExercises
        .filter(e => !existingExerciseIds.has(e.id) && subjects.has(subjectOf(e.lesson_id)) && visible(e.id))
        .map(apply)
        .map(e => ({
          exercise_id: e.id,
          question_number: e.question_number,
          type: e.type,
          question_text_he: e.question_text_he,
          options: e.options,
          correct_answer: e.correct_answer,
          explanation_he: e.explanation_he,
          explanation_en: e.explanation_en,
          difficulty: e.difficulty,
          lesson_id: e.lesson_id,
          lesson_title_he: lessonMap.get(e.lesson_id)?.title_he
        }));

      const shuffled = shuffleArray(availableExercises);
      const needed = questionCount - selectedQuestions.length;
      selectedQuestions = [...selectedQuestions, ...shuffled.slice(0, needed)];
    }

    // Transform to exercise format with shuffle and shuffle options
    const shuffledQuestions = shuffleArray(selectedQuestions);
    const exercises = shuffledQuestions
      .map((question, index) => ({
        id: question.exercise_id,
        question_number: index + 1,
        type: question.type,
        question_text_he: question.question_text_he,
        options: question.type === 'multiple_choice' && question.options ? shuffleArray(question.options) : question.options,
        difficulty: question.difficulty || 'medium',
        lesson_title: question.lesson_title_he || question.lesson_title,
        subject: subjectOf(question.lesson_id),
        is_from_mistakes: !!question.user_answer
      }));

    // Get unique topics with mistakes and their theory content
    const wrongAnswers = await db.find('wrong_answers', { user_id: userId });
    const lessonMistakeCounts = new Map();

    for (const wa of wrongAnswers) {
      if (!lessonMistakeCounts.has(wa.lesson_id)) {
        lessonMistakeCounts.set(wa.lesson_id, { total: 0, uncorrected: 0 });
      }
      lessonMistakeCounts.get(wa.lesson_id).total++;
      if (!wa.is_corrected) {
        lessonMistakeCounts.get(wa.lesson_id).uncorrected++;
      }
    }

    const topicSummaries = Array.from(lessonMistakeCounts.entries())
      .map(([lessonId, counts]) => {
        const lesson = lessonMap.get(lessonId);
        if (!lesson) return null;
        return {
          lessonId,
          titleHe: lesson.title_he,
          titleEn: lesson.title_en,
          mistakeCount: counts.total,
          uncorrectedCount: counts.uncorrected,
          theorySummary: this.extractTheorySummary(lesson.theory_content_he)
        };
      })
      .filter(s => s !== null)
      .sort((a, b) => b.uncorrectedCount - a.uncorrectedCount || b.mistakeCount - a.mistakeCount)
      .slice(0, 5);

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
module.exports.EXAM_SIZE = EXAM_SIZE;
