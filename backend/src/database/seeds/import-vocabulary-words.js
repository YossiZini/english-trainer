const fs = require('fs');
const path = require('path');
const { pool } = require('../../config/database');

/**
 * Import vocabulary words from CSV file
 * CSV format: English Word, Hebrew Translation, Difficulty Level, Source
 */
async function importVocabularyWords() {
  const csvPath = path.join(__dirname, '../../../../docs/words/words.csv');

  try {
    console.log('Starting vocabulary words import...');
    console.log(`Reading CSV from: ${csvPath}`);

    // Read CSV file
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n');

    console.log(`Total lines in CSV: ${lines.length}`);

    // Skip header row
    const dataLines = lines.slice(1).filter(line => line.trim() !== '');

    console.log(`Data lines to process: ${dataLines.length}`);

    let imported = 0;
    let errors = 0;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (let i = 0; i < dataLines.length; i++) {
        const line = dataLines[i];

        try {
          // Parse CSV line (handle commas in quoted fields)
          const columns = parseCSVLine(line);

          if (columns.length < 4) {
            console.log(`Skipping invalid line ${i + 2}: ${line}`);
            errors++;
            continue;
          }

          const englishWord = columns[0].trim();
          const hebrewTranslation = columns[1].trim();
          const difficultyLevel = parseInt(columns[2].trim());
          const source = columns[3].trim();

          // Validate data
          if (!englishWord || !hebrewTranslation || isNaN(difficultyLevel) || !source) {
            console.log(`Skipping invalid data on line ${i + 2}`);
            errors++;
            continue;
          }

          if (difficultyLevel < 1 || difficultyLevel > 10) {
            console.log(`Invalid difficulty level ${difficultyLevel} on line ${i + 2}`);
            errors++;
            continue;
          }

          // Insert word
          const query = `
            INSERT INTO vocabulary_words (
              english_word, hebrew_translation, difficulty_level, source
            )
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (english_word, source) DO UPDATE
            SET hebrew_translation = EXCLUDED.hebrew_translation,
                difficulty_level = EXCLUDED.difficulty_level
          `;

          await client.query(query, [
            englishWord,
            hebrewTranslation,
            difficultyLevel,
            source
          ]);

          imported++;

          // Log progress every 100 words
          if (imported % 100 === 0) {
            console.log(`Imported ${imported} words...`);
          }
        } catch (error) {
          console.error(`Error processing line ${i + 2}:`, error.message);
          errors++;
        }
      }

      await client.query('COMMIT');
      console.log('\n=== Import Complete ===');
      console.log(`Successfully imported: ${imported} words`);
      console.log(`Errors: ${errors}`);

      // Get statistics
      const statsQuery = `
        SELECT difficulty_level, COUNT(*) as count
        FROM vocabulary_words
        GROUP BY difficulty_level
        ORDER BY difficulty_level
      `;
      const statsResult = await client.query(statsQuery);

      console.log('\nWords by difficulty level:');
      statsResult.rows.forEach(row => {
        console.log(`  Level ${row.difficulty_level}: ${row.count} words`);
      });

      const totalQuery = 'SELECT COUNT(*) as total FROM vocabulary_words';
      const totalResult = await client.query(totalQuery);
      console.log(`\nTotal words in database: ${totalResult.rows[0].total}`);

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Import failed:', error);
    throw error;
  }
}

/**
 * Parse a CSV line handling quoted fields with commas
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

// Run if called directly
if (require.main === module) {
  importVocabularyWords()
    .then(() => {
      console.log('Import script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Import script failed:', error);
      process.exit(1);
    });
}

module.exports = importVocabularyWords;
