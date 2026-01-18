# How to Create Custom Unseen Paragraphs

This guide explains how to manually add new reading comprehension paragraphs to the Unseen system.

## Overview

Each unseen paragraph consists of:
- 2-3 paragraphs of English text
- 5 multiple-choice questions (4 options each)
- 1-2 hard words with Hebrew translations
- Complexity level (1-5)
- Topic category

---

## Step 1: Prepare Your Content

### 1.1 Write the Paragraph
- Write 2-3 paragraphs in English
- Age-appropriate for 12-14 year olds
- Choose a complexity level (1=Easy, 5=Advanced)
- Select a topic (Sports, Nature, Technology, Science, History, etc.)

### 1.2 Identify Hard Words
- Choose 1-2 challenging vocabulary words from your paragraph
- Provide Hebrew translations

### 1.3 Create 5 Questions
- Each question should have:
  - Question text in English
  - Optional question text in Hebrew
  - 4 multiple-choice options
  - Correct answer index (0-3)
  - Hebrew explanation

---

## Step 2: Using Failed Words (Optional)

If you want the paragraph to incorporate words from a user's failed vocabulary:

1. Query the user's failed words:
```sql
SELECT vw.english_word, vw.hebrew_translation
FROM vocabulary_failed_words vfw
JOIN vocabulary_words vw ON vfw.word_id = vw.id
WHERE vfw.user_id = '<user_uuid>' AND vfw.is_pending_review = true
LIMIT 5;
```

2. Incorporate these words into your paragraph naturally

3. Set `uses_failed_words = TRUE` when inserting

---

## Step 3: Insert the Paragraph

### 3.1 Insert Paragraph Record

```sql
INSERT INTO unseen_paragraphs (
  title_en,
  title_he,
  content,
  complexity_level,
  topic,
  hard_words,
  is_custom,
  uses_failed_words,
  created_by
)
VALUES (
  'Your Title in English',
  'הכותרת שלך בעברית',
  'Paragraph 1 text here.

Paragraph 2 text here.

Paragraph 3 text here.',
  3,  -- Complexity level 1-5
  'Your Topic',
  '[
    {"word": "ecosystem", "translation": "מערכת אקולוגית"},
    {"word": "biodiversity", "translation": "מגוון ביולוגי"}
  ]'::jsonb,
  true,  -- is_custom
  false,  -- uses_failed_words (set to true if using failed words)
  '<user_uuid_if_applicable>'  -- or NULL for system paragraphs
)
RETURNING id;
```

**Save the returned `id` for the next step!**

---

## Step 4: Insert Questions

For each of your 5 questions, insert a record:

```sql
INSERT INTO unseen_questions (
  paragraph_id,
  question_number,
  question_text_en,
  question_text_he,
  options,
  correct_answer,
  explanation_he
)
VALUES
  (
    '<paragraph_id_from_step_3>',
    1,
    'What is the main topic of the passage?',
    'מה הנושא המרכזי של הקטע?',
    '["Topic A", "Topic B", "Topic C", "Topic D"]'::jsonb,
    2,  -- Index of correct answer (0-based)
    'התשובה הנכונה היא Topic C כי...'
  ),
  (
    '<paragraph_id_from_step_3>',
    2,
    'According to the text, what happens when...?',
    'לפי הטקסט, מה קורה כאשר...?',
    '["Option 1", "Option 2", "Option 3", "Option 4"]'::jsonb,
    0,
    'ההסבר: התשובה הנכונה היא Option 1 כי...'
  ),
  -- ... continue for all 5 questions
;
```

---

## Step 5: Verify the Insert

Check that everything was inserted correctly:

```sql
-- View the paragraph
SELECT * FROM unseen_paragraphs WHERE id = '<your_paragraph_id>';

-- View the questions
SELECT * FROM unseen_questions WHERE paragraph_id = '<your_paragraph_id>' ORDER BY question_number;

-- Count questions (should be 5)
SELECT COUNT(*) FROM unseen_questions WHERE paragraph_id = '<your_paragraph_id>';
```

---

## Example: Complete Insert Script

```sql
-- Step 1: Insert paragraph
INSERT INTO unseen_paragraphs (title_en, title_he, content, complexity_level, topic, hard_words, is_custom, uses_failed_words)
VALUES (
  'The Amazon Rainforest',
  'יער האמזונס',
  'The Amazon Rainforest is the world''s largest tropical rainforest. It covers over 5.5 million square kilometers and is home to millions of species. Scientists estimate that one in ten known species lives in the Amazon.

The rainforest plays a crucial role in regulating Earth''s climate. Trees absorb carbon dioxide and produce oxygen, making the Amazon the "lungs of the planet." However, deforestation threatens this vital ecosystem.

Conservation efforts are underway to protect the Amazon. Many countries and organizations work together to preserve this natural wonder. Protecting the rainforest is essential for maintaining biodiversity and combating climate change.',
  3,
  'Nature',
  '[
    {"word": "deforestation", "translation": "כריתת יערות"},
    {"word": "biodiversity", "translation": "מגוון ביולוגי"}
  ]'::jsonb,
  true,
  false
)
RETURNING id;

-- Assuming the returned id is: 'abc123-def456-...'

-- Step 2: Insert 5 questions
INSERT INTO unseen_questions (paragraph_id, question_number, question_text_en, question_text_he, options, correct_answer, explanation_he)
VALUES
  (
    'abc123-def456-...',
    1,
    'How large is the Amazon Rainforest?',
    'כמה גדול יער האמזונס?',
    '["1 million km²", "3 million km²", "Over 5.5 million km²", "10 million km²"]'::jsonb,
    2,
    'התשובה הנכונה: Over 5.5 million km². הטקסט אומר בפירוש: "It covers over 5.5 million square kilometers".'
  ),
  (
    'abc123-def456-...',
    2,
    'What percentage of known species live in the Amazon?',
    'כמה אחוזים מהמינים הידועים חיים באמזונס?',
    '["One in twenty", "One in ten", "One in five", "Half of all species"]'::jsonb,
    1,
    'התשובה הנכונה: One in ten. הטקסט מציין: "one in ten known species lives in the Amazon".'
  ),
  (
    'abc123-def456-...',
    3,
    'Why is the Amazon called the "lungs of the planet"?',
    'למה קוראים לאמזונס "ריאות הפלנטה"?',
    '["It''s very big", "It produces oxygen", "It has many animals", "It''s very old"]'::jsonb,
    1,
    'התשובה הנכונה: It produces oxygen. הטקסט מסביר: "Trees absorb carbon dioxide and produce oxygen".'
  ),
  (
    'abc123-def456-...',
    4,
    'What threatens the Amazon ecosystem?',
    'מה מאיים על המערכת האקולוגית של האמזונס?',
    '["Climate change", "Deforestation", "Tourism", "Research"]'::jsonb,
    1,
    'התשובה הנכונה: Deforestation. הטקסט אומר: "deforestation threatens this vital ecosystem".'
  ),
  (
    'abc123-def456-...',
    5,
    'According to the text, why is protecting the rainforest important?',
    'לפי הטקסט, למה חשוב להגן על היער?',
    '["For tourism", "For wood production", "For biodiversity and climate", "For farming"]'::jsonb,
    2,
    'התשובה הנכונה: For biodiversity and climate. הטקסט מסיים: "Protecting the rainforest is essential for maintaining biodiversity and combating climate change".'
  );
```

---

## Tips for Creating Quality Paragraphs

### Content Tips
- **Length**: 150-300 words total (2-3 paragraphs)
- **Vocabulary**: Age-appropriate but include 1-2 challenging words
- **Structure**: Clear beginning, middle, end
- **Topic**: Engaging and educational

### Question Tips
- **Mix difficulty**: Include easy recall and harder inference questions
- **Clear options**: Make distractors plausible but clearly wrong
- **Good explanations**: Help students understand why the answer is correct
- **Hebrew support**: Provide Hebrew translations for clarity

### Hard Words Selection
- Choose words that are:
  - Important to understanding the text
  - Not too common
  - Useful for vocabulary building
  - Can be explained clearly in Hebrew

---

## Integrating with Failed Vocabulary Words

### Strategy
When creating personalized paragraphs:

1. Get user's failed words
2. Select 3-5 words to incorporate
3. Write a paragraph that naturally uses these words
4. Ensure the context helps clarify word meanings
5. Set `uses_failed_words = TRUE`

### Example Query for Failed Words
```sql
SELECT
  vw.id,
  vw.english_word,
  vw.hebrew_translation,
  vw.difficulty_level,
  vfw.fail_count
FROM vocabulary_failed_words vfw
JOIN vocabulary_words vw ON vfw.word_id = vw.id
WHERE vfw.user_id = '<user_uuid>'
  AND vfw.is_pending_review = true
ORDER BY vfw.fail_count DESC, vfw.last_failed_at DESC
LIMIT 5;
```

---

## Troubleshooting

### Common Issues

**Issue**: JSONB format error
- **Solution**: Ensure arrays use double quotes: `["option1", "option2"]`
- Use `'::jsonb` cast at the end

**Issue**: Foreign key constraint fails
- **Solution**: Make sure the `paragraph_id` exists before inserting questions

**Issue**: Questions not showing in order
- **Solution**: Verify `question_number` is 1-5 and unique per paragraph

---

## Bulk Import Script Template

Create a file `my-custom-paragraphs.js` in `backend/src/database/seeds/`:

```javascript
const { pool } = require('../../config/database');

async function seedMyCustomParagraphs() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Insert your paragraph
    const paragraphResult = await client.query(
      `INSERT INTO unseen_paragraphs (...) VALUES (...) RETURNING id`
    );

    const paragraphId = paragraphResult.rows[0].id;

    // Insert your 5 questions
    for (const question of yourQuestions) {
      await client.query(
        `INSERT INTO unseen_questions (...) VALUES (...)`,
        [paragraphId, ...]
      );
    }

    await client.query('COMMIT');
    console.log('✅ Custom paragraphs added successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', error);
  } finally {
    client.release();
  }
}

seedMyCustomParagraphs();
```

Run with: `node backend/src/database/seeds/my-custom-paragraphs.js`

---

## Need Help?

For questions or issues with the Unseen paragraph system, refer to:
- **Database schema**: `backend/src/database/migrations/add-unseen-system.sql`
- **Example seed data**: `backend/src/database/seeds/seed-unseen-paragraphs.js`
- **Models**: `backend/src/models/Unseen*.js`

