const { pool } = require('../config/database');

async function clearAndReseedTopics() {
  console.log('🗑️  Clearing Topics 5-11 from database...\n');

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Delete lessons and their exercises for Topics 5-11
    // Exercises will be deleted automatically via CASCADE
    const result = await client.query(`
      DELETE FROM lessons
      WHERE topic_number BETWEEN 5 AND 11
    `);

    console.log(`✅ Deleted ${result.rowCount} lessons (and their exercises) from Topics 5-11\n`);

    await client.query('COMMIT');

    // Now run the seeder
    console.log('🌱 Re-seeding Topics 5-11 with corrected content...\n');

    const { seedAllTopics } = require('./seed-topics-5-11-corrected');
    await seedAllTopics();

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', error);
    throw error;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  clearAndReseedTopics()
    .then(() => {
      console.log('\n✨ Clear and re-seed completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Failed:', error);
      process.exit(1);
    });
}

module.exports = { clearAndReseedTopics };
