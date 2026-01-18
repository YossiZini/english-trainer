const { pool } = require('../config/database');

async function fixOrderIndex() {
  console.log('🔧 Fixing order_index for all lessons...\n');

  try {
    // Get all lessons ordered by topic_number and original order_index
    const result = await pool.query(`
      SELECT id, topic_number, subtopic_number, title_en, order_index
      FROM lessons
      ORDER BY topic_number ASC, order_index ASC, subtopic_number ASC
    `);

    console.log(`Found ${result.rows.length} lessons\n`);

    // Update order_index sequentially
    let globalOrderIndex = 1;

    for (const lesson of result.rows) {
      await pool.query(
        'UPDATE lessons SET order_index = $1 WHERE id = $2',
        [globalOrderIndex, lesson.id]
      );

      console.log(`✓ Updated ${lesson.topic_number}.${lesson.subtopic_number} - ${lesson.title_en} → order_index = ${globalOrderIndex}`);
      globalOrderIndex++;
    }

    console.log(`\n✅ Successfully updated order_index for ${result.rows.length} lessons!`);

    // Verify the fix
    console.log('\n📊 Verification - First 15 lessons:');
    const verify = await pool.query(`
      SELECT topic_number, subtopic_number, title_en, order_index
      FROM lessons
      ORDER BY order_index ASC
      LIMIT 15
    `);
    console.table(verify.rows);

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  fixOrderIndex()
    .then(() => {
      console.log('\n✨ Order index fix completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Failed:', error);
      process.exit(1);
    });
}

module.exports = { fixOrderIndex };
