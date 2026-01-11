# Adding Lessons to the System

This guide explains how to add new lessons at different difficulty levels and manage the progression system.

## Difficulty Level System

The system has **4 difficulty levels**:

1. **beginner** (מתחיל) - Green badge - For absolute beginners
2. **elementary** (בסיסי) - Blue badge - Basic level
3. **intermediate** (בינוני) - Yellow/Orange badge - Intermediate level
4. **advanced** (מתקדם) - Red badge - Advanced level

Each lesson can have any of these levels, and users must complete lessons with 70%+ score to unlock the next lesson.

## How to Add New Lessons

### Method 1: Using the Seed Script Template

1. Open `/backend/src/database/seed-lessons.js`

2. Add a new lesson object to the `lessonsData` array:

```javascript
{
  topicNumber: 2,                    // Topic grouping number
  subtopicNumber: '2.1',             // Subtopic display number
  titleEn: 'Past Simple - Regular Verbs',
  titleHe: 'עבר פשוט - פעלים רגילים',
  level: 'intermediate',             // beginner, elementary, intermediate, or advanced
  orderIndex: 4,                     // Sequential order (must be unique)
  theoryContentHe: `
    <h2>זמן עבר פשוט - פעלים רגילים</h2>
    <p>Your Hebrew content here...</p>
  `,
  exercises: [
    {
      questionNumber: 1,
      type: 'multiple_choice',       // or 'fill_in_blank'
      questionTextHe: 'איזה פועל בזמן עבר?',
      options: ['walk', 'walked', 'walking', 'walks'],  // for multiple_choice only
      correctAnswer: 'walked',
      explanationHe: 'מוסיפים ed לפועל רגיל בזמן עבר',
      difficulty: 'easy'             // easy, medium, or hard
    },
    {
      questionNumber: 2,
      type: 'fill_in_blank',
      questionTextHe: 'She _______ (play) tennis yesterday.',
      correctAnswer: 'played',
      explanationHe: 'play + ed = played',
      difficulty: 'medium'
    }
  ]
}
```

3. Run the seed script:
```bash
cd /Users/Yossi.Zini/development/eng-tu/backend
node src/database/seed-lessons.js
```

### Method 2: Direct Database Insert

You can also insert lessons directly using SQL:

```bash
psql -d english_tutorial_dev
```

```sql
-- Insert a lesson
INSERT INTO lessons (topic_number, subtopic_number, title_en, title_he, level, order_index, theory_content_he)
VALUES (2, '2.1', 'Past Simple', 'עבר פשוט', 'intermediate', 4, '<h2>Content here</h2>');

-- Get the lesson ID
SELECT id FROM lessons WHERE subtopic_number = '2.1';

-- Insert exercises for that lesson
INSERT INTO exercises (lesson_id, question_number, type, question_text_he, correct_answer, explanation_he, difficulty)
VALUES
  ('lesson-id-here', 1, 'multiple_choice', 'Question text', 'answer', 'Explanation', 'easy'),
  ('lesson-id-here', 2, 'fill_in_blank', 'Question text', 'answer', 'Explanation', 'medium');
```

## Managing Difficulty Levels

### View Current Levels

```bash
cd /Users/Yossi.Zini/development/eng-tu/backend
node src/database/update-levels.js show
```

### Update All Lessons to a Level

```bash
node src/database/update-levels.js update-all intermediate
```

### Update a Specific Lesson

```bash
# By subtopic number
node src/database/update-levels.js update-lesson 1.1 advanced

# By lesson ID
node src/database/update-levels.js update-by-id <lesson-id> intermediate
```

### Update Exercise Difficulty

```bash
node src/database/update-levels.js update-exercises <lesson-id> hard
```

## Exercise Types

### 1. Multiple Choice

```javascript
{
  questionNumber: 1,
  type: 'multiple_choice',
  questionTextHe: 'השאלה בעברית?',
  questionTextEn: 'Question in English?',  // Optional
  options: ['option1', 'option2', 'option3', 'option4'],
  correctAnswer: 'option2',
  explanationHe: 'ההסבר בעברית',
  difficulty: 'easy'  // easy, medium, or hard
}
```

### 2. Fill in the Blank

```javascript
{
  questionNumber: 2,
  type: 'fill_in_blank',
  questionTextHe: 'She _______ (go) to school.',
  correctAnswer: 'goes',
  explanationHe: 'עם she מוסיפים es',
  difficulty: 'medium'
}
```

## Progression System

The system automatically enforces progression:

1. **First lesson** (order_index = 1) is always accessible
2. **Subsequent lessons** require the previous lesson to be:
   - Completed (status = 'completed')
   - With a score of **70% or higher**

This ensures students master each level before progressing to the next.

## Best Practices

### Lesson Ordering

- Start with `beginner` lessons (order_index 1-10)
- Move to `elementary` lessons (order_index 11-20)
- Then `intermediate` (order_index 21-30)
- Finally `advanced` (order_index 31+)

### Exercise Distribution

For each lesson, include:
- **Beginner lessons**: 4-6 exercises (mostly easy, some medium)
- **Elementary lessons**: 6-8 exercises (mix of easy and medium)
- **Intermediate lessons**: 8-10 exercises (medium with some hard)
- **Advanced lessons**: 10-12 exercises (medium and hard)

### Content Guidelines

1. **Theory Content**: Write in clear Hebrew with examples
2. **Questions**: Start simple, gradually increase difficulty
3. **Explanations**: Always provide detailed explanations in Hebrew
4. **Progressive Difficulty**: Each lesson should build on previous ones

## Example: Adding a Complete Topic

Let's say you want to add "Present Continuous" at elementary level:

```javascript
{
  topicNumber: 3,
  subtopicNumber: '3.1',
  titleEn: 'Present Continuous - Affirmative',
  titleHe: 'הווה ממושך - משפטים חיוביים',
  level: 'elementary',
  orderIndex: 11,
  theoryContentHe: `
    <h2>זמן הווה ממושך (Present Continuous)</h2>
    <h3>שימושים:</h3>
    <ul>
      <li>פעולה שקורה עכשיו - I am eating now</li>
      <li>פעולה זמנית - She is working this week</li>
    </ul>
    <h3>מבנה:</h3>
    <p><strong>Subject + am/is/are + verb-ing</strong></p>
  `,
  exercises: [
    {
      questionNumber: 1,
      type: 'multiple_choice',
      questionTextHe: 'I _______ TV now.',
      options: ['watch', 'watching', 'am watching', 'watches'],
      correctAnswer: 'am watching',
      explanationHe: 'עם I משתמשים ב-am + verb-ing',
      difficulty: 'easy'
    },
    // Add 5-7 more exercises...
  ]
}
```

## Testing New Lessons

After adding lessons:

1. Restart the backend server
2. Refresh the frontend
3. Log in and check the topics page
4. Verify:
   - Lessons appear in correct order
   - Level badges display correctly
   - Progression system works (complete lesson 1 to unlock lesson 2)
   - Exercises load and submit correctly

## Current Lesson Structure

As of now, the system has:

- **Lesson 1.1**: מבוא לזמן הווה פשוט (beginner)
- **Lesson 1.2**: משפטים חיוביים (intermediate)
- **Lesson 1.3**: משפטים שליליים (advanced)

All lessons are unlocked sequentially based on 70% completion of the previous lesson.
