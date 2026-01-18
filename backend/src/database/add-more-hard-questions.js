const { pool } = require('../config/database');
const Exercise = require('../models/Exercise');

// Additional hard questions for Topic 1.2 (Affirmative Sentences) - to reach 20 hard questions
const topic12HardExercises = [
  {
    questionNumber: 21,
    type: 'multiple_choice',
    questionTextHe: 'The company _______ its employees every month.',
    options: ['pay', 'pays', 'payes', 'paying'],
    correctAnswer: 'pays',
    explanationHe: 'עם company (it) מוסיפים s: pays',
    difficulty: 'hard'
  },
  {
    questionNumber: 22,
    type: 'fill_in_blank',
    questionTextHe: 'She _______ (rely) on her friends for support.',
    correctAnswer: 'relies',
    explanationHe: 'rely מסתיים ב-y אחרי עיצור, משנים ל-ies: relies',
    difficulty: 'hard'
  },
  {
    questionNumber: 23,
    type: 'multiple_choice',
    questionTextHe: 'The machine _______ automatically.',
    options: ['switch', 'switches', 'switchs', 'switching'],
    correctAnswer: 'switches',
    explanationHe: 'switch מסתיים ב-ch, מוסיפים es: switches',
    difficulty: 'hard'
  },
  {
    questionNumber: 24,
    type: 'fill_in_blank',
    questionTextHe: 'He _______ (fix) computers for a living.',
    correctAnswer: 'fixes',
    explanationHe: 'fix מסתיים ב-x, מוסיפים es: fixes',
    difficulty: 'hard'
  },
  {
    questionNumber: 25,
    type: 'multiple_choice',
    questionTextHe: 'My brother _______ very hard at university.',
    options: ['study', 'studies', 'studys', 'studying'],
    correctAnswer: 'studies',
    explanationHe: 'study מסתיים ב-y אחרי עיצור, משנים ל-ies: studies',
    difficulty: 'hard'
  },
  {
    questionNumber: 26,
    type: 'fill_in_blank',
    questionTextHe: 'The train _______ (pass) through this station every hour.',
    correctAnswer: 'passes',
    explanationHe: 'pass מסתיים ב-ss, מוסיפים es: passes',
    difficulty: 'hard'
  },
  {
    questionNumber: 27,
    type: 'multiple_choice',
    questionTextHe: 'She _______ her mistakes and learns from them.',
    options: ['recognize', 'recognizes', 'recognizs', 'recognizing'],
    correctAnswer: 'recognizes',
    explanationHe: 'עם she מוסיפים s: recognizes',
    difficulty: 'hard'
  },
  {
    questionNumber: 28,
    type: 'fill_in_blank',
    questionTextHe: 'The dog _______ (catch) the ball every time.',
    correctAnswer: 'catches',
    explanationHe: 'catch מסתיים ב-ch, מוסיפים es: catches',
    difficulty: 'hard'
  },
  {
    questionNumber: 29,
    type: 'multiple_choice',
    questionTextHe: 'The shop _______ at 10 AM on weekdays.',
    options: ['open', 'opens', 'openes', 'opening'],
    correctAnswer: 'opens',
    explanationHe: 'עם shop (it) מוסיפים s: opens',
    difficulty: 'hard'
  }
];

// Additional hard questions for Topic 1.7 (Possession) - to reach 20 hard questions
const topic17HardExercises = [
  {
    questionNumber: 21,
    type: 'multiple_choice',
    questionTextHe: "_______ house is the biggest on the street.",
    options: ["Their's", "They're", "Their", "There"],
    correctAnswer: "Their",
    explanationHe: "Their = שלהם (בעלות). They're = they are, Their's לא קיים",
    difficulty: 'hard'
  },
  {
    questionNumber: 22,
    type: 'fill_in_blank',
    questionTextHe: 'The responsibility is _______ (our), not _______ (your).',
    correctAnswer: 'ours, yours',
    explanationHe: 'ours = שלנו (עצמאי), yours = שלך/שלכם (עצמאי)',
    difficulty: 'hard'
  },
  {
    questionNumber: 23,
    type: 'multiple_choice',
    questionTextHe: 'Is this pen _______ or _______?',
    options: ['your, her', 'yours, hers', 'your, hers', 'yours, her'],
    correctAnswer: 'yours, hers',
    explanationHe: 'אחרי is צריך צורה עצמאית: yours, hers',
    difficulty: 'hard'
  },
  {
    questionNumber: 24,
    type: 'fill_in_blank',
    questionTextHe: "The children played with _______ (they) toys all day.",
    correctAnswer: 'their',
    explanationHe: 'their = שלהם (לפני שם עצם: toys)',
    difficulty: 'hard'
  },
  {
    questionNumber: 25,
    type: 'multiple_choice',
    questionTextHe: 'The decision was _______ to make.',
    options: ['our', 'ours', 'us', 'we'],
    correctAnswer: 'ours',
    explanationHe: 'אחרי was צריך צורה עצמאית: ours',
    difficulty: 'hard'
  },
  {
    questionNumber: 26,
    type: 'fill_in_blank',
    questionTextHe: 'The cat licked _______ (it) paws clean.',
    correctAnswer: 'its',
    explanationHe: "its = שלו/שלה (בעלות). it's = it is",
    difficulty: 'hard'
  },
  {
    questionNumber: 27,
    type: 'multiple_choice',
    questionTextHe: 'These books are _______, not _______.',
    options: ['my, your', 'mine, yours', 'my, yours', 'mine, your'],
    correctAnswer: 'mine, yours',
    explanationHe: 'אחרי are צריך צורה עצמאית: mine, yours',
    difficulty: 'hard'
  },
  {
    questionNumber: 28,
    type: 'fill_in_blank',
    questionTextHe: 'We need to respect each other\'s opinions and defend _______ (we) own.',
    correctAnswer: 'our',
    explanationHe: 'our = שלנו (לפני שם עצם: opinions)',
    difficulty: 'hard'
  },
  {
    questionNumber: 29,
    type: 'multiple_choice',
    questionTextHe: 'The victory was _______, we earned it.',
    options: ['our', 'ours', 'us', 'ourselves'],
    correctAnswer: 'ours',
    explanationHe: 'אחרי was צריך צורה עצמאית: ours = שלנו',
    difficulty: 'hard'
  },
  {
    questionNumber: 30,
    type: 'fill_in_blank',
    questionTextHe: "A friend of _______ (I) is coming to visit.",
    correctAnswer: 'mine',
    explanationHe: 'after "of" צריך צורה עצמאית: a friend of mine',
    difficulty: 'hard'
  }
];

async function addMoreHardQuestions() {
  console.log('🌱 Adding more hard questions to topics 1.2 and 1.7 to reach 20 hard questions each...\n');

  try {
    // Get lesson IDs for topics 1.2 and 1.7
    const lessonQuery = `
      SELECT id, subtopic_number, title_he
      FROM lessons
      WHERE topic_number = 1 AND subtopic_number IN ('1.2', '1.7')
      ORDER BY subtopic_number
    `;

    const result = await pool.query(lessonQuery);
    const lessons = result.rows;

    if (lessons.length !== 2) {
      throw new Error('Could not find both lessons 1.2 and 1.7');
    }

    const lesson12 = lessons.find(l => l.subtopic_number === '1.2');
    const lesson17 = lessons.find(l => l.subtopic_number === '1.7');

    console.log(`Found lesson 1.2: ${lesson12.title_he} (${lesson12.id})`);
    console.log(`Found lesson 1.7: ${lesson17.title_he} (${lesson17.id})`);

    // Add hard exercises for topic 1.2
    console.log('\nAdding hard exercises for Topic 1.2...');
    for (const exercise of topic12HardExercises) {
      await Exercise.create({
        lessonId: lesson12.id,
        ...exercise
      });
      console.log(`  ✅ Added hard question ${exercise.questionNumber}: ${exercise.questionTextHe.substring(0, 50)}...`);
    }

    // Add hard exercises for topic 1.7
    console.log('\nAdding hard exercises for Topic 1.7...');
    for (const exercise of topic17HardExercises) {
      await Exercise.create({
        lessonId: lesson17.id,
        ...exercise
      });
      console.log(`  ✅ Added hard question ${exercise.questionNumber}: ${exercise.questionTextHe.substring(0, 50)}...`);
    }

    // Verify final counts
    const countQuery = `
      SELECT l.subtopic_number, l.title_he, e.difficulty, COUNT(e.id) as count
      FROM lessons l
      JOIN exercises e ON l.id = e.lesson_id
      WHERE l.subtopic_number IN ('1.2', '1.7')
      GROUP BY l.subtopic_number, l.title_he, e.difficulty
      ORDER BY l.subtopic_number, e.difficulty
    `;

    const counts = await pool.query(countQuery);

    console.log('\n📊 Final question counts:');
    console.log('========================');
    counts.rows.forEach(row => {
      console.log(`${row.subtopic_number} (${row.title_he}): ${row.difficulty} = ${row.count}`);
    });

    console.log('\n✅ Successfully added all hard questions!');
    console.log('   Topic 1.2 should now have 20 hard questions');
    console.log('   Topic 1.7 should now have 20 hard questions');

  } catch (error) {
    console.error('❌ Failed to add questions:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

addMoreHardQuestions();
