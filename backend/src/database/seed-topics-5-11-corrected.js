const { pool } = require('../config/database');

// Import all topic seeders
const topic5 = require('./seeds/topic5-nouns');
const topic6 = require('./seeds/topic6-to-be');
const topic7 = require('./seeds/topic7-there-is-are');
const topic8 = require('./seeds/topic8-demonstratives');
const topic9 = require('./seeds/topic9-adjectives');
const topic10 = require('./seeds/topic10-prepositions-place');
const topic11 = require('./seeds/topic11-prepositions-time');

async function seedAllTopics() {
  console.log('🌱 Seeding all Topics 5-11...\n');

  const startTime = Date.now();

  try {
    // Topic 5: Nouns
    console.log('📚 Topic 5: Nouns - Singular & Plural');
    await executeSeedData(topic5.lessonsData);

    // Topic 6: Verb To Be
    console.log('\n📚 Topic 6: Verb "To Be" - Present');
    await executeSeedData(topic6.lessonsData);

    // Topic 7: There is/are
    console.log('\n📚 Topic 7: There is / There are');
    await executeSeedData(topic7.lessonsData);

    // Topic 8: Demonstratives
    console.log('\n📚 Topic 8: Demonstratives');
    await executeSeedData(topic8.lessonsData);

    // Topic 9: Adjectives
    console.log('\n📚 Topic 9: Adjectives');
    await executeSeedData(topic9.lessonsData);

    // Topic 10: Prepositions of Place
    console.log('\n📚 Topic 10: Prepositions of Place');
    await executeSeedData(topic10.lessonsData);

    // Topic 11: Prepositions of Time
    console.log('\n📚 Topic 11: Prepositions of Time');
    await executeSeedData(topic11.lessonsData);

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n' + '='.repeat(60));
    console.log('✅ ALL TOPICS SEEDED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('📊 Summary:');
    console.log('   • Topics seeded: 7 (Topics 5-11)');
    console.log('   • Total lessons: 48');
    console.log('   • Total exercises: ~403');
    console.log(`   • Time taken: ${duration} seconds`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Error seeding topics:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

async function executeSeedData(lessonsData) {
  const Lesson = require('../models/Lesson');
  const Exercise = require('../models/Exercise');

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    let totalExercises = 0;

    for (const lessonData of lessonsData) {
      const { exercises, ...lessonInfo } = lessonData;

      // Create lesson
      const lesson = await Lesson.create(lessonInfo);
      console.log(`   ✓ ${lessonInfo.subtopicNumber} - ${lessonInfo.titleEn} (${exercises.length} exercises)`);

      // Create exercises for this lesson
      for (const exerciseData of exercises) {
        const exerciseInfo = {
          lessonId: lesson.id,
          ...exerciseData
        };
        await Exercise.create(exerciseInfo);
        totalExercises++;
      }
    }

    await client.query('COMMIT');
    console.log(`   📝 Total: ${lessonsData.length} lessons, ${totalExercises} exercises`);

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Run if called directly
if (require.main === module) {
  seedAllTopics()
    .then(() => {
      console.log('\n✨ Seeding completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedAllTopics };
