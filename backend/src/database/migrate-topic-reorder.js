const { pool } = require('../config/database');

// Mapping: old topic number -> new topic number (for existing DB topics 1-12)
const dbTopicMapping = {
  1: 9,   // Present Simple
  2: 3,   // Personal Pronouns
  3: 5,   // Articles
  4: 4,   // Nouns (stays same)
  5: 2,   // Verb To Be
  6: 7,   // There is/are
  7: 6,   // Demonstratives
  8: 8,   // Adjectives (stays same)
  9: 13,  // Prepositions of Place
  10: 14, // Prepositions of Time
  11: 15, // Past Simple
  12: 11  // Present Progressive
};

async function migrateTopicNumbers() {
  console.log('🔄 Starting topic renumbering migration...\n');

  try {
    await pool.query('BEGIN');

    console.log('Step 1: Move all topics to temporary numbers (100+)');
    for (const oldNum of Object.keys(dbTopicMapping).sort((a, b) => a - b)) {
      const tempNum = 100 + parseInt(oldNum);
      const result = await pool.query(
        'UPDATE lessons SET topic_number = $1 WHERE topic_number = $2',
        [tempNum, oldNum]
      );
      console.log(`  Moved Topic ${oldNum} → Temp ${tempNum} (${result.rowCount} lessons)`);
    }

    console.log('\nStep 2: Move from temporary to final positions');
    for (const [oldNum, newNum] of Object.entries(dbTopicMapping)) {
      const tempNum = 100 + parseInt(oldNum);
      const result = await pool.query(
        'UPDATE lessons SET topic_number = $1 WHERE topic_number = $2',
        [newNum, tempNum]
      );
      console.log(`  Moved Temp ${tempNum} → Topic ${newNum} (${result.rowCount} lessons)`);
    }

    await pool.query('COMMIT');
    console.log('\n✅ Migration completed successfully!');

    // Verify
    console.log('\nVerification:');
    const result = await pool.query(
      'SELECT topic_number, COUNT(*) as lesson_count FROM lessons GROUP BY topic_number ORDER BY topic_number'
    );
    result.rows.forEach(row => {
      console.log(`  Topic ${row.topic_number}: ${row.lesson_count} lessons`);
    });

  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('\n❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run migration
if (require.main === module) {
  migrateTopicNumbers()
    .then(() => {
      console.log('\n🎉 Database migration complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateTopicNumbers };
