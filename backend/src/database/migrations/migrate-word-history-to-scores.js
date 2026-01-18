const { pool } = require('../../config/database');

/**
 * Data Migration Script: Migrate vocabulary_user_history to vocabulary_word_scores
 *
 * This script:
 * 1. Aggregates data from vocabulary_user_history per (user_id, word_id)
 * 2. Counts successes and failures
 * 3. Builds chronological attempt history
 * 4. Calculates mastery level
 * 5. Inserts into vocabulary_word_scores table
 */

/**
 * Calculate mastery level based on attempt history
 */
function calculateMasteryLevel(attemptHistory, successCount) {
  if (!attemptHistory || attemptHistory.length === 0) {
    return 'not_started';
  }

  const last3 = attemptHistory.slice(-3);
  const last2 = attemptHistory.slice(-2);

  // Mastered: Last 3 attempts all success AND at least 3 total successes
  if (last3.length === 3 && last3.every(a => a === 'success') && successCount >= 3) {
    return 'mastered';
  }

  // Struggling: Last 2+ attempts are failures
  if (last2.length >= 2 && last2.every(a => a === 'failed')) {
    return 'struggling';
  }

  // Learning: Has attempts but not mastered or struggling
  if (successCount < 3) {
    return 'learning';
  }

  return 'learning';
}

/**
 * Main migration function
 */
async function migrate() {
  const client = await pool.connect();

  try {
    console.log('Starting vocabulary history migration...');
    await client.query('BEGIN');

    // Get all unique (user_id, word_id) combinations from history
    const historyQuery = `
      SELECT
        user_id,
        word_id,
        COUNT(*) as total_attempts,
        COUNT(*) FILTER (WHERE is_correct = true) as success_count,
        COUNT(*) FILTER (WHERE is_correct = false) as fail_count,
        ARRAY_AGG(
          CASE
            WHEN is_correct = true THEN 'success'
            ELSE 'failed'
          END
          ORDER BY answered_at ASC
        ) as attempt_history,
        MAX(answered_at) as last_attempt_at
      FROM vocabulary_user_history
      GROUP BY user_id, word_id
      ORDER BY user_id, word_id
    `;

    console.log('Fetching vocabulary history data...');
    const historyResult = await client.query(historyQuery);
    console.log(`Found ${historyResult.rows.length} unique (user, word) combinations`);

    // Insert into vocabulary_word_scores
    let insertedCount = 0;
    let skippedCount = 0;

    for (const row of historyResult.rows) {
      const {
        user_id,
        word_id,
        success_count,
        fail_count,
        attempt_history,
        last_attempt_at
      } = row;

      // Keep only last 50 attempts
      const limitedHistory = attempt_history.slice(-50);

      // Calculate mastery level
      const masteryLevel = calculateMasteryLevel(limitedHistory, parseInt(success_count));

      // Insert into vocabulary_word_scores
      const insertQuery = `
        INSERT INTO vocabulary_word_scores
          (user_id, word_id, success_count, fail_count, attempt_history, mastery_level, last_attempt_at)
        VALUES
          ($1, $2, $3, $4, $5::jsonb, $6, $7)
        ON CONFLICT (user_id, word_id) DO UPDATE SET
          success_count = $3,
          fail_count = $4,
          attempt_history = $5::jsonb,
          mastery_level = $6,
          last_attempt_at = $7,
          updated_at = CURRENT_TIMESTAMP
      `;

      try {
        await client.query(insertQuery, [
          user_id,
          word_id,
          success_count,
          fail_count,
          JSON.stringify(limitedHistory),
          masteryLevel,
          last_attempt_at
        ]);
        insertedCount++;

        if (insertedCount % 100 === 0) {
          console.log(`Migrated ${insertedCount} records...`);
        }
      } catch (err) {
        console.error(`Error migrating record for user ${user_id}, word ${word_id}:`, err.message);
        skippedCount++;
      }
    }

    // Update vocabulary_user_stats with unique word counts
    console.log('Updating user stats with unique word counts...');
    const statsUpdateQuery = `
      UPDATE vocabulary_user_stats vus
      SET
        total_unique_words_with_success = (
          SELECT COUNT(DISTINCT word_id)
          FROM vocabulary_word_scores
          WHERE user_id = vus.user_id AND success_count > 0
        ),
        total_unique_words_with_failure = (
          SELECT COUNT(DISTINCT word_id)
          FROM vocabulary_word_scores
          WHERE user_id = vus.user_id AND fail_count > 0
        )
    `;
    await client.query(statsUpdateQuery);

    await client.query('COMMIT');

    console.log('\n=== Migration Complete ===');
    console.log(`✓ Successfully migrated: ${insertedCount} records`);
    console.log(`✗ Skipped (errors): ${skippedCount} records`);
    console.log(`✓ Updated user statistics`);
    console.log('==========================\n');

    return { success: true, inserted: insertedCount, skipped: skippedCount };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Run migration if executed directly
 */
if (require.main === module) {
  migrate()
    .then((result) => {
      console.log('Migration completed successfully:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrate, calculateMasteryLevel };
