const { pool } = require('../config/database');

// Mapping: old topic number -> new topic number
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

async function fixSubtopicNumbers() {
  console.log('🔧 Fixing subtopic numbers...\n');

  try {
    await pool.query('BEGIN');

    // For each mapping, update the subtopic_number string
    for (const [oldNum, newNum] of Object.entries(dbTopicMapping)) {
      // Update subtopic_number from "oldNum.X" to "newNum.X"
      const result = await pool.query(
        `UPDATE lessons
         SET subtopic_number = REPLACE(subtopic_number, $1, $2)
         WHERE topic_number = $3`,
        [`${oldNum}.`, `${newNum}.`, newNum]
      );

      console.log(`Updated Topic ${newNum}: Changed "${oldNum}.X" → "${newNum}.X" (${result.rowCount} lessons)`);
    }

    await pool.query('COMMIT');
    console.log('\n✅ Subtopic numbers fixed successfully!');

    // Verify
    console.log('\nVerification samples:');
    const samples = await pool.query(`
      SELECT topic_number, subtopic_number, title_en
      FROM lessons
      WHERE topic_number IN (2, 3, 9, 11, 15)
      ORDER BY topic_number, order_index
      LIMIT 15
    `);

    samples.rows.forEach(row => {
      console.log(`  Topic ${row.topic_number}, Subtopic ${row.subtopic_number}: ${row.title_en}`);
    });

  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('\n❌ Fix failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run fix
if (require.main === module) {
  fixSubtopicNumbers()
    .then(() => {
      console.log('\n🎉 Subtopic number fix complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Fix failed:', error);
      process.exit(1);
    });
}

module.exports = { fixSubtopicNumbers };
