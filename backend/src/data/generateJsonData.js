const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Generate JSON data files from seed scripts
 * This script converts all PostgreSQL seed data to JSON files
 */

const dataDir = path.join(__dirname, '../../data');
const staticDir = path.join(dataDir, 'static');
const dynamicDir = path.join(dataDir, 'dynamic');
const seedsDir = path.join(__dirname, '../database/seeds');

// Ensure directories exist
[dataDir, staticDir, dynamicDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

function generateId() {
  return crypto.randomUUID();
}

function getCurrentTimestamp() {
  return new Date().toISOString();
}

/**
 * Generate lessons and exercises JSON from topic seed files
 */
async function generateLessonsAndExercises() {
  console.log('Generating lessons and exercises...');

  const topicFiles = [
    'topic1-grammar-basics.js',
    'topic2-to-be.js',
    'topic3-personal-pronouns.js',
    'topic4-nouns.js',
    'topic5-articles.js',
    'topic6-demonstratives.js',
    'topic7-there-is-are.js',
    'topic8-adjectives.js',
    'topic9-present-simple.js',
    'topic10-question-words.js',
    'topic11-present-progressive.js',
    'topic12-can-could.js',
    'topic13-prepositions-place.js',
    'topic14-prepositions-time.js',
    'topic15-past-simple.js'
  ];

  const allLessons = [];
  const allExercises = [];

  for (const file of topicFiles) {
    const filePath = path.join(seedsDir, file);
    if (!fs.existsSync(filePath)) {
      console.log(`  Skipping ${file} (not found)`);
      continue;
    }

    try {
      // Read the file content and extract lessonsData
      const fileContent = fs.readFileSync(filePath, 'utf8');

      // Extract lessonsData array from file content
      const lessonsDataMatch = fileContent.match(/const lessonsData = \[([\s\S]*?)\n\];/);
      if (!lessonsDataMatch) {
        console.log(`  Skipping ${file} (no lessonsData found)`);
        continue;
      }

      // Use a different approach - require the file and look for exported data
      // Actually, let's parse the data more reliably
      const lessons = extractLessonsFromFile(fileContent);

      lessons.forEach(lessonData => {
        const lessonId = generateId();
        const timestamp = getCurrentTimestamp();

        const lesson = {
          id: lessonId,
          topic_number: lessonData.topicNumber,
          subtopic_number: lessonData.subtopicNumber,
          title_en: lessonData.titleEn,
          title_he: lessonData.titleHe,
          level: lessonData.level || 'beginner',
          order_index: lessonData.orderIndex,
          theory_content_he: lessonData.theoryContentHe,
          theory_content_en: lessonData.theoryContentEn || null,
          created_at: timestamp
        };

        allLessons.push(lesson);

        // Generate exercises for this lesson
        if (lessonData.exercises && Array.isArray(lessonData.exercises)) {
          lessonData.exercises.forEach(exerciseData => {
            const exercise = {
              id: generateId(),
              lesson_id: lessonId,
              question_number: exerciseData.questionNumber,
              type: exerciseData.type,
              question_text_he: exerciseData.questionTextHe,
              question_text_en: exerciseData.questionTextEn || null,
              options: exerciseData.options || null,
              correct_answer: exerciseData.correctAnswer,
              explanation_he: exerciseData.explanationHe || null,
              explanation_en: exerciseData.explanationEn || null,
              difficulty: exerciseData.difficulty || 'medium',
              created_at: timestamp
            };

            allExercises.push(exercise);
          });
        }
      });

      console.log(`  Processed ${file}: ${lessons.length} lessons`);
    } catch (error) {
      console.error(`  Error processing ${file}:`, error.message);
    }
  }

  // Sort lessons by order_index
  allLessons.sort((a, b) => a.order_index - b.order_index);

  // Write to JSON files
  fs.writeFileSync(
    path.join(staticDir, 'lessons.json'),
    JSON.stringify(allLessons, null, 2)
  );
  fs.writeFileSync(
    path.join(staticDir, 'exercises.json'),
    JSON.stringify(allExercises, null, 2)
  );

  console.log(`Generated: ${allLessons.length} lessons, ${allExercises.length} exercises`);
  return { lessons: allLessons, exercises: allExercises };
}

/**
 * Parse lesson data from seed file content
 */
function extractLessonsFromFile(content) {
  const lessons = [];

  // Match each lesson object in lessonsData
  const lessonRegex = /\{\s*topicNumber:\s*(\d+),\s*subtopicNumber:\s*['"]([^'"]+)['"],\s*titleEn:\s*['"]([^'"]+)['"],\s*titleHe:\s*['"]([^'"]+)['"],\s*level:\s*['"]([^'"]+)['"],\s*orderIndex:\s*(\d+),\s*theoryContentHe:\s*`([\s\S]*?)`,\s*exercises:\s*\[([\s\S]*?)\]\s*\}/g;

  let match;
  while ((match = lessonRegex.exec(content)) !== null) {
    const exercises = parseExercises(match[8]);

    lessons.push({
      topicNumber: parseInt(match[1]),
      subtopicNumber: match[2],
      titleEn: match[3],
      titleHe: match[4],
      level: match[5],
      orderIndex: parseInt(match[6]),
      theoryContentHe: match[7].trim(),
      exercises
    });
  }

  // If regex didn't work, try a simpler approach
  if (lessons.length === 0) {
    // Look for lessonsData and try to evaluate it safely
    const lessonsDataStart = content.indexOf('const lessonsData = [');
    if (lessonsDataStart !== -1) {
      // Find matching bracket
      let depth = 0;
      let start = content.indexOf('[', lessonsDataStart);
      let end = start;
      for (let i = start; i < content.length; i++) {
        if (content[i] === '[') depth++;
        if (content[i] === ']') {
          depth--;
          if (depth === 0) {
            end = i + 1;
            break;
          }
        }
      }

      if (end > start) {
        try {
          // Use Function constructor to safely evaluate
          const arrayStr = content.slice(start, end);
          // This is a simplified parser - in production you'd want something more robust
          const lessonsData = eval(arrayStr);
          return lessonsData;
        } catch (e) {
          console.log('  Could not parse lessonsData, using manual extraction');
        }
      }
    }
  }

  return lessons;
}

/**
 * Parse exercises from string
 */
function parseExercises(exercisesStr) {
  const exercises = [];
  const exerciseRegex = /\{\s*questionNumber:\s*(\d+),\s*type:\s*['"]([^'"]+)['"],\s*questionTextHe:\s*['"]([^'"]+)['"],\s*(?:questionTextEn:\s*['"]([^'"]*)['"]\s*,\s*)?(?:options:\s*\[([^\]]+)\],\s*)?correctAnswer:\s*['"]([^'"]+)['"],\s*(?:explanationHe:\s*['"]([^'"]*)['"]\s*,?\s*)?(?:explanationEn:\s*['"]([^'"]*)['"]\s*,?\s*)?difficulty:\s*['"]([^'"]+)['"]\s*\}/g;

  let match;
  while ((match = exerciseRegex.exec(exercisesStr)) !== null) {
    const options = match[5]
      ? match[5].split(',').map(o => o.trim().replace(/['"]/g, ''))
      : null;

    exercises.push({
      questionNumber: parseInt(match[1]),
      type: match[2],
      questionTextHe: match[3],
      questionTextEn: match[4] || null,
      options,
      correctAnswer: match[6],
      explanationHe: match[7] || null,
      explanationEn: match[8] || null,
      difficulty: match[9]
    });
  }

  return exercises;
}

/**
 * Generate vocabulary words JSON from CSV file
 */
async function generateVocabularyWords() {
  console.log('Generating vocabulary words...');

  const csvPath = path.join(__dirname, '../../../../docs/words/words.csv');
  if (!fs.existsSync(csvPath)) {
    console.log('  words.csv not found, skipping vocabulary generation');
    return [];
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n');
  const dataLines = lines.slice(1).filter(line => line.trim() !== '');

  const words = [];
  const wordMap = new Map(); // For deduplication by english_word + source

  for (const line of dataLines) {
    const columns = parseCSVLine(line);
    if (columns.length < 4) continue;

    const englishWord = columns[0].trim();
    const hebrewTranslation = columns[1].trim();
    const difficultyLevel = parseInt(columns[2].trim());
    const source = columns[3].trim();

    if (!englishWord || !hebrewTranslation || isNaN(difficultyLevel) || !source) continue;
    if (difficultyLevel < 1 || difficultyLevel > 10) continue;

    const key = `${englishWord}::${source}`;
    if (wordMap.has(key)) {
      // Update existing
      const existing = wordMap.get(key);
      existing.hebrew_translation = hebrewTranslation;
      existing.difficulty_level = difficultyLevel;
    } else {
      const word = {
        id: generateId(),
        english_word: englishWord,
        hebrew_translation: hebrewTranslation,
        difficulty_level: difficultyLevel,
        source,
        sentence_en: columns[4] ? columns[4].trim() : null,
        sentence_he: columns[5] ? columns[5].trim() : null,
        created_at: getCurrentTimestamp()
      };
      wordMap.set(key, word);
      words.push(word);
    }
  }

  fs.writeFileSync(
    path.join(staticDir, 'vocabulary_words.json'),
    JSON.stringify(words, null, 2)
  );

  console.log(`Generated: ${words.length} vocabulary words`);
  return words;
}

/**
 * Parse a CSV line handling quoted fields with commas
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

/**
 * Generate unseen paragraphs and questions JSON
 */
async function generateUnseenData() {
  console.log('Generating unseen paragraphs and questions...');

  const seedPath = path.join(seedsDir, 'seed-unseen-paragraphs.js');
  if (!fs.existsSync(seedPath)) {
    console.log('  seed-unseen-paragraphs.js not found, skipping');
    return { paragraphs: [], questions: [] };
  }

  // Import the getParagraphsData function
  const seedContent = fs.readFileSync(seedPath, 'utf-8');

  // Find and execute getParagraphsData function
  const funcMatch = seedContent.match(/function getParagraphsData\(\) \{[\s\S]*?return \[([\s\S]*?)\];\s*\}/);

  if (!funcMatch) {
    console.log('  Could not find getParagraphsData function');
    return { paragraphs: [], questions: [] };
  }

  // Try to require the module
  try {
    // Clear require cache to get fresh data
    delete require.cache[require.resolve(seedPath)];

    // Create a temporary version without the pool dependency
    const tempPath = path.join(__dirname, 'temp-unseen-seed.js');
    const modifiedContent = seedContent
      .replace(/const \{ pool \} = require.*?;/g, '// pool removed')
      .replace(/async function seedUnseenParagraphs.*?module\.exports/s, 'module.exports');

    // Add getParagraphsData export
    const exportContent = `
${modifiedContent.replace('module.exports = { seedUnseenParagraphs };', '')}

module.exports = { getParagraphsData };
`;

    fs.writeFileSync(tempPath, exportContent);

    // Now require the temp file
    const { getParagraphsData } = require(tempPath);
    const paragraphsData = getParagraphsData();

    const paragraphs = [];
    const questions = [];

    for (const pData of paragraphsData) {
      const paragraphId = generateId();
      const timestamp = getCurrentTimestamp();

      paragraphs.push({
        id: paragraphId,
        title_en: pData.titleEn,
        title_he: pData.titleHe,
        content: pData.content,
        complexity_level: pData.complexityLevel,
        topic: pData.topic,
        hard_words: pData.hardWords,
        is_custom: false,
        uses_failed_words: false,
        created_at: timestamp
      });

      for (const qData of pData.questions) {
        questions.push({
          id: generateId(),
          paragraph_id: paragraphId,
          question_number: qData.questionNumber,
          question_text_en: qData.questionTextEn,
          question_text_he: qData.questionTextHe,
          options: qData.options,
          correct_answer: qData.correctAnswer,
          explanation_he: qData.explanationHe,
          created_at: timestamp
        });
      }
    }

    // Clean up temp file
    fs.unlinkSync(tempPath);

    fs.writeFileSync(
      path.join(staticDir, 'unseen_paragraphs.json'),
      JSON.stringify(paragraphs, null, 2)
    );
    fs.writeFileSync(
      path.join(staticDir, 'unseen_questions.json'),
      JSON.stringify(questions, null, 2)
    );

    console.log(`Generated: ${paragraphs.length} paragraphs, ${questions.length} questions`);
    return { paragraphs, questions };

  } catch (error) {
    console.error('  Error generating unseen data:', error.message);
    return { paragraphs: [], questions: [] };
  }
}

/**
 * Generate achievements JSON
 */
async function generateAchievements() {
  console.log('Generating achievements...');

  const achievements = [
    {
      id: generateId(),
      name_en: 'First Steps',
      name_he: 'צעדים ראשונים',
      description_en: 'Complete your first lesson',
      description_he: 'השלם את השיעור הראשון שלך',
      icon: '🎯',
      requirement_type: 'lessons_completed',
      requirement_value: 1,
      points: 10,
      created_at: getCurrentTimestamp()
    },
    {
      id: generateId(),
      name_en: 'Getting Started',
      name_he: 'בדרך הנכונה',
      description_en: 'Complete 5 lessons',
      description_he: 'השלם 5 שיעורים',
      icon: '⭐',
      requirement_type: 'lessons_completed',
      requirement_value: 5,
      points: 25,
      created_at: getCurrentTimestamp()
    },
    {
      id: generateId(),
      name_en: 'Dedicated Learner',
      name_he: 'לומד מסור',
      description_en: 'Complete 10 lessons',
      description_he: 'השלם 10 שיעורים',
      icon: '🌟',
      requirement_type: 'lessons_completed',
      requirement_value: 10,
      points: 50,
      created_at: getCurrentTimestamp()
    },
    {
      id: generateId(),
      name_en: 'Perfect Score',
      name_he: 'ציון מושלם',
      description_en: 'Get 100% on any lesson',
      description_he: 'קבל 100% בשיעור כלשהו',
      icon: '💯',
      requirement_type: 'perfect_score',
      requirement_value: 1,
      points: 30,
      created_at: getCurrentTimestamp()
    },
    {
      id: generateId(),
      name_en: 'Streak Master',
      name_he: 'אלוף הרצף',
      description_en: 'Maintain a 7-day streak',
      description_he: 'שמור על רצף של 7 ימים',
      icon: '🔥',
      requirement_type: 'streak_days',
      requirement_value: 7,
      points: 50,
      created_at: getCurrentTimestamp()
    },
    {
      id: generateId(),
      name_en: 'Vocabulary Builder',
      name_he: 'בונה אוצר מילים',
      description_en: 'Learn 50 vocabulary words',
      description_he: 'למד 50 מילים',
      icon: '📚',
      requirement_type: 'words_learned',
      requirement_value: 50,
      points: 40,
      created_at: getCurrentTimestamp()
    },
    {
      id: generateId(),
      name_en: 'Word Master',
      name_he: 'מאסטר מילים',
      description_en: 'Learn 200 vocabulary words',
      description_he: 'למד 200 מילים',
      icon: '🏆',
      requirement_type: 'words_learned',
      requirement_value: 200,
      points: 100,
      created_at: getCurrentTimestamp()
    },
    {
      id: generateId(),
      name_en: 'Quiz Champion',
      name_he: 'אלוף החידונים',
      description_en: 'Complete 10 vocabulary quizzes',
      description_he: 'השלם 10 חידוני אוצר מילים',
      icon: '🎓',
      requirement_type: 'quizzes_completed',
      requirement_value: 10,
      points: 35,
      created_at: getCurrentTimestamp()
    },
    {
      id: generateId(),
      name_en: 'Time Warrior',
      name_he: 'לוחם הזמן',
      description_en: 'Study for 60 minutes total',
      description_he: 'למד 60 דקות סה״כ',
      icon: '⏰',
      requirement_type: 'time_spent',
      requirement_value: 60,
      points: 25,
      created_at: getCurrentTimestamp()
    },
    {
      id: generateId(),
      name_en: 'Mistake Fixer',
      name_he: 'מתקן שגיאות',
      description_en: 'Review and fix 20 mistakes',
      description_he: 'עבור על 20 שגיאות ותקן אותן',
      icon: '✏️',
      requirement_type: 'mistakes_fixed',
      requirement_value: 20,
      points: 30,
      created_at: getCurrentTimestamp()
    }
  ];

  fs.writeFileSync(
    path.join(staticDir, 'achievements.json'),
    JSON.stringify(achievements, null, 2)
  );

  console.log(`Generated: ${achievements.length} achievements`);
  return achievements;
}

/**
 * Initialize empty dynamic data files
 */
async function initializeDynamicFiles() {
  console.log('Initializing dynamic data files...');

  const dynamicFiles = [
    'users.json',
    'user_progress.json',
    'exercise_results.json',
    'wrong_answers.json',
    'user_achievements.json',
    'vocabulary_quiz_sessions.json',
    'vocabulary_word_scores.json',
    'vocabulary_user_stats.json',
    'vocabulary_user_history.json',
    'vocabulary_failed_words.json',
    'unseen_sessions.json',
    'unseen_answers.json',
    'unseen_user_progress.json',
    'daily_challenges.json',
    'user_daily_challenges.json',
    'vocabulary_kanban_tasks.json'
  ];

  for (const file of dynamicFiles) {
    const filePath = path.join(dynamicDir, file);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '[]');
      console.log(`  Created: ${file}`);
    } else {
      console.log(`  Exists: ${file}`);
    }
  }
}

/**
 * Main function to generate all JSON data
 */
async function main() {
  console.log('='.repeat(50));
  console.log('JSON Data Generator');
  console.log('='.repeat(50));
  console.log();

  try {
    await generateLessonsAndExercises();
    console.log();

    await generateVocabularyWords();
    console.log();

    await generateUnseenData();
    console.log();

    await generateAchievements();
    console.log();

    await initializeDynamicFiles();
    console.log();

    console.log('='.repeat(50));
    console.log('JSON data generation complete!');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('Error generating JSON data:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = {
  generateLessonsAndExercises,
  generateVocabularyWords,
  generateUnseenData,
  generateAchievements,
  initializeDynamicFiles
};
