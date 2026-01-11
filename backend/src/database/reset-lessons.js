const { pool } = require('../config/database');
const { seedLessons } = require('./seed-all-lessons');

async function resetAndReseed() {
  console.log('🔄 Starting database reset and reseed...\n');
  console.log('⚠️  WARNING: This will delete all existing lessons and exercises!');
  console.log('⚠️  User progress data will be preserved.\n');

  try {
    // Delete existing data
    await pool.query('BEGIN');

    console.log('🗑️  Deleting existing exercises...');
    const exercisesResult = await pool.query('DELETE FROM exercises RETURNING id');
    console.log(`✅ Deleted ${exercisesResult.rowCount} exercises\n`);

    console.log('🗑️  Deleting existing lessons...');
    const lessonsResult = await pool.query('DELETE FROM lessons RETURNING id');
    console.log(`✅ Deleted ${lessonsResult.rowCount} lessons\n`);

    await pool.query('COMMIT');
    console.log('✅ Database cleared successfully!\n');

    // Now seed new lessons (reuse the same pool)
    console.log('📝 Starting lesson seeding...\n');
    await seedLessons();

  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('❌ Reset failed:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  resetAndReseed()
    .then(() => {
      console.log('\n✅ Database reset and reseed completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Failed:', error.message);
      process.exit(1);
    });
}

module.exports = resetAndReseed;
