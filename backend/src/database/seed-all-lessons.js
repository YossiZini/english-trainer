const { pool } = require('../config/database');
const Lesson = require('../models/Lesson');
const Exercise = require('../models/Exercise');

// Import individual topic seed files
const topic1Data = require('./seeds/topic1-grammar-basics');
const topic2Data = require('./seeds/topic2-to-be');
const topic3Data = require('./seeds/topic3-personal-pronouns');
const topic4Data = require('./seeds/topic4-nouns');
const topic5Data = require('./seeds/topic5-articles');
const topic6Data = require('./seeds/topic6-demonstratives');
const topic7Data = require('./seeds/topic7-there-is-are');
const topic8Data = require('./seeds/topic8-adjectives');
const topic9Data = require('./seeds/topic9-present-simple');
const topic10Data = require('./seeds/topic10-question-words');
const topic11Data = require('./seeds/topic11-present-progressive');
const topic12Data = require('./seeds/topic12-can-could');
const topic13Data = require('./seeds/topic13-prepositions-place');
const topic14Data = require('./seeds/topic14-prepositions-time');
const topic15Data = require('./seeds/topic15-past-simple');

// Comprehensive lesson data for all topics (imported from seed files)
const lessonsData = [
  // ==================== TOPIC 1: GRAMMAR BASICS ====================
  // Imported from seeds/topic1-grammar-basics.js
  ...topic1Data.lessonsData,

  // ==================== TOPIC 2: VERB TO BE ====================
  // Imported from seeds/topic2-to-be.js
  ...topic2Data.lessonsData,

  // ==================== TOPIC 3: PERSONAL PRONOUNS ====================
  // Imported from seeds/topic3-personal-pronouns.js
  ...topic3Data.lessonsData,

  // ==================== TOPIC 4: NOUNS ====================
  // Imported from seeds/topic4-nouns.js
  ...topic4Data.lessonsData,

  // ==================== TOPIC 5: ARTICLES ====================
  // Imported from seeds/topic5-articles.js
  ...topic5Data.lessonsData,

  // ==================== TOPIC 6: DEMONSTRATIVES ====================
  // Imported from seeds/topic6-demonstratives.js
  ...topic6Data.lessonsData,

  // ==================== TOPIC 7: THERE IS / THERE ARE ====================
  // Imported from seeds/topic7-there-is-are.js
  ...topic7Data.lessonsData,

  // ==================== TOPIC 8: ADJECTIVES ====================
  // Imported from seeds/topic8-adjectives.js
  ...topic8Data.lessonsData,

  // ==================== TOPIC 9: PRESENT SIMPLE ====================
  // Imported from seeds/topic9-present-simple.js
  ...topic9Data.lessonsData,

  // ==================== TOPIC 10: QUESTION WORDS ====================
  // Imported from seeds/topic10-question-words.js
  ...topic10Data.lessonsData,

  // ==================== TOPIC 11: PRESENT PROGRESSIVE ====================
  // Imported from seeds/topic11-present-progressive.js
  ...topic11Data.lessonsData,

  // ==================== TOPIC 12: CAN / COULD ====================
  // Imported from seeds/topic12-can-could.js
  ...topic12Data.lessonsData,

  // ==================== TOPIC 13: PREPOSITIONS OF PLACE ====================
  // Imported from seeds/topic13-prepositions-place.js
  ...topic13Data.lessonsData,

  // ==================== TOPIC 14: PREPOSITIONS OF TIME ====================
  // Imported from seeds/topic14-prepositions-time.js
  ...topic14Data.lessonsData,

  // ==================== TOPIC 15: PAST SIMPLE ====================
  // Imported from seeds/topic15-past-simple.js
  ...topic15Data.lessonsData
];

// Seeding function
async function seedLessons() {
  console.log('🌱 Starting comprehensive lesson seeding...\n');

  try {
    await pool.query('BEGIN');

    for (const lessonData of lessonsData) {
      console.log(`Creating lesson ${lessonData.subtopicNumber}: ${lessonData.titleHe} (${lessonData.titleEn})...`);

      // Create the lesson
      const lesson = await Lesson.create({
        topicNumber: lessonData.topicNumber,
        subtopicNumber: lessonData.subtopicNumber,
        titleEn: lessonData.titleEn,
        titleHe: lessonData.titleHe,
        level: lessonData.level,
        orderIndex: lessonData.orderIndex,
        theoryContentHe: lessonData.theoryContentHe
      });

      // Create exercises for the lesson
      for (const exerciseData of lessonData.exercises) {
        await Exercise.create({
          lessonId: lesson.id,
          questionNumber: exerciseData.questionNumber,
          type: exerciseData.type,
          questionTextHe: exerciseData.questionTextHe,
          options: exerciseData.options || null,
          correctAnswer: exerciseData.correctAnswer,
          explanationHe: exerciseData.explanationHe,
          difficulty: exerciseData.difficulty
        });
      }

      console.log(`✅ Created lesson ${lessonData.subtopicNumber} with ${lessonData.exercises.length} exercises\n`);
    }

    await pool.query('COMMIT');
    console.log('✅ All lessons seeded successfully!');
    console.log(`   Total: ${lessonsData.length} lessons created`);

  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedLessons()
    .then(() => {
      console.log('\n🎉 Seeding complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { lessonsData, seedLessons };
