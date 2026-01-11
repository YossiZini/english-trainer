const { pool } = require('../config/database');

/**
 * Utility script to update lesson and exercise difficulty levels
 */

const VALID_LEVELS = ['beginner', 'intermediate', 'advanced'];
const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'];

async function showCurrentLevels() {
  console.log('\n📊 Current Lesson Levels:\n');

  const result = await pool.query(`
    SELECT
      id,
      topic_number,
      subtopic_number,
      title_he,
      title_en,
      level,
      order_index
    FROM lessons
    ORDER BY order_index
  `);

  result.rows.forEach(lesson => {
    console.log(`${lesson.order_index}. ${lesson.subtopic_number} - ${lesson.title_he}`);
    console.log(`   Level: ${lesson.level}`);
    console.log(`   ID: ${lesson.id}\n`);
  });
}

async function updateAllLessonsLevel(newLevel) {
  if (!VALID_LEVELS.includes(newLevel)) {
    throw new Error(`Invalid level. Must be one of: ${VALID_LEVELS.join(', ')}`);
  }

  const result = await pool.query(
    'UPDATE lessons SET level = $1 RETURNING *',
    [newLevel]
  );

  console.log(`✅ Updated ${result.rowCount} lessons to level: ${newLevel}`);
}

async function updateLessonByTopicNumber(topicNumber, subtopicNumber, newLevel) {
  if (!VALID_LEVELS.includes(newLevel)) {
    throw new Error(`Invalid level. Must be one of: ${VALID_LEVELS.join(', ')}`);
  }

  const result = await pool.query(
    'UPDATE lessons SET level = $1 WHERE topic_number = $2 AND subtopic_number = $3 RETURNING *',
    [newLevel, topicNumber, subtopicNumber]
  );

  if (result.rowCount === 0) {
    console.log(`❌ No lesson found with topic ${topicNumber}.${subtopicNumber}`);
  } else {
    console.log(`✅ Updated lesson ${topicNumber}.${subtopicNumber} to level: ${newLevel}`);
  }
}

async function updateLessonById(lessonId, newLevel) {
  if (!VALID_LEVELS.includes(newLevel)) {
    throw new Error(`Invalid level. Must be one of: ${VALID_LEVELS.join(', ')}`);
  }

  const result = await pool.query(
    'UPDATE lessons SET level = $1 WHERE id = $2 RETURNING *',
    [newLevel, lessonId]
  );

  if (result.rowCount === 0) {
    console.log(`❌ No lesson found with ID: ${lessonId}`);
  } else {
    console.log(`✅ Updated lesson ${result.rows[0].title_he} to level: ${newLevel}`);
  }
}

async function updateExerciseDifficulty(lessonId, newDifficulty) {
  if (!VALID_DIFFICULTIES.includes(newDifficulty)) {
    throw new Error(`Invalid difficulty. Must be one of: ${VALID_DIFFICULTIES.join(', ')}`);
  }

  const result = await pool.query(
    'UPDATE exercises SET difficulty = $1 WHERE lesson_id = $2 RETURNING *',
    [newDifficulty, lessonId]
  );

  console.log(`✅ Updated ${result.rowCount} exercises to difficulty: ${newDifficulty}`);
}

// Main execution
async function main() {
  try {
    const args = process.argv.slice(2);
    const command = args[0];

    if (!command || command === 'show') {
      await showCurrentLevels();
      return;
    }

    switch (command) {
      case 'update-all':
        // node update-levels.js update-all intermediate
        const level = args[1];
        await updateAllLessonsLevel(level);
        await showCurrentLevels();
        break;

      case 'update-lesson':
        // node update-levels.js update-lesson 1.1 intermediate
        const subtopic = args[1]; // e.g., "1.1"
        const newLevel = args[2];
        const [topic, subtopicNum] = subtopic.split('.');
        await updateLessonByTopicNumber(parseInt(topic), subtopic, newLevel);
        await showCurrentLevels();
        break;

      case 'update-by-id':
        // node update-levels.js update-by-id <lesson-id> intermediate
        const lessonId = args[1];
        const levelById = args[2];
        await updateLessonById(lessonId, levelById);
        await showCurrentLevels();
        break;

      case 'update-exercises':
        // node update-levels.js update-exercises <lesson-id> hard
        const lessonIdForEx = args[1];
        const difficulty = args[2];
        await updateExerciseDifficulty(lessonIdForEx, difficulty);
        break;

      default:
        console.log(`
📚 Lesson Level Management Tool

Usage:
  node update-levels.js [command] [options]

Commands:
  show                                    Show current levels (default)
  update-all <level>                      Update all lessons to a level
  update-lesson <subtopic> <level>        Update specific lesson (e.g., 1.1)
  update-by-id <lesson-id> <level>        Update lesson by ID
  update-exercises <lesson-id> <difficulty>  Update exercise difficulty

Levels: beginner, intermediate, advanced
Difficulties: easy, medium, hard

Examples:
  node update-levels.js show
  node update-levels.js update-all intermediate
  node update-levels.js update-lesson 1.2 advanced
  node update-levels.js update-exercises <lesson-id> hard
        `);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
