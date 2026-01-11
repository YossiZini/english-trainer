const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

async function runMigration() {
  console.log('🔄 Starting database migration...\n');

  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute the schema
    await pool.query(schema);

    console.log('✅ Database schema created successfully!');
    console.log('✅ All 7 tables created:');
    console.log('   1. users');
    console.log('   2. lessons');
    console.log('   3. exercises');
    console.log('   4. user_progress');
    console.log('   5. exercise_results');
    console.log('   6. wrong_answers');
    console.log('   7. achievements + user_achievements');
    console.log('\n✅ Initial achievements seeded');
    console.log('\n🎉 Migration completed successfully!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('\nPlease ensure:');
    console.error('  1. PostgreSQL is installed and running');
    console.error('  2. Database "english_tutorial_dev" exists');
    console.error('  3. Database credentials in .env are correct\n');
    console.error('To create the database, run:');
    console.error('  createdb english_tutorial_dev\n');
    process.exit(1);
  }
}

runMigration();
