const { pool } = require('../config/database');

// Get the lesson ID for Present Simple
async function addExercises() {
  const result = await pool.query("SELECT id FROM lessons WHERE subtopic_number = '1.1'");
  const lessonId = result.rows[0].id;

  console.log(`Adding exercises to lesson: ${lessonId}`);

  const exercises = [
    // BEGINNER LEVEL - Easy exercises (question 6-10)
    {
      questionNumber: 6,
      type: 'multiple_choice',
      questionTextHe: 'באיזה משפט משתמשים בזמן הווה פשוט?',
      options: ['אני הולך עכשיו', 'אני הולך כל יום', 'אני הלכתי אתמול', 'אני אלך מחר'],
      correctAnswer: 'אני הולך כל יום',
      explanationHe: 'זמן הווה פשוט מתאר הרגלים - "כל יום" מעיד על הרגל',
      difficulty: 'easy'
    },
    {
      questionNumber: 7,
      type: 'multiple_choice',
      questionTextHe: 'They _______ football.',
      options: ['play', 'plays', 'playing', 'played'],
      correctAnswer: 'play',
      explanationHe: 'עם they משתמשים בצורת הבסיס של הפועל',
      difficulty: 'easy'
    },
    {
      questionNumber: 8,
      type: 'fill_in_blank',
      questionTextHe: 'I _______ (like) pizza.',
      correctAnswer: 'like',
      explanationHe: 'עם I משתמשים בצורת הבסיס',
      difficulty: 'easy'
    },
    {
      questionNumber: 9,
      type: 'multiple_choice',
      questionTextHe: 'My mother _______ breakfast every day.',
      options: ['make', 'makes', 'making', 'maked'],
      correctAnswer: 'makes',
      explanationHe: 'my mother = she, לכן מוסיפים s',
      difficulty: 'easy'
    },
    {
      questionNumber: 10,
      type: 'fill_in_blank',
      questionTextHe: 'We _______ (study) English.',
      correctAnswer: 'study',
      explanationHe: 'עם we משתמשים בצורת הבסיס',
      difficulty: 'easy'
    },

    // INTERMEDIATE LEVEL - Medium exercises (question 11-20)
    {
      questionNumber: 11,
      type: 'multiple_choice',
      questionTextHe: 'She _______ to music in the evening.',
      options: ['listen', 'listens', 'listening', 'listened'],
      correctAnswer: 'listens',
      explanationHe: 'עם she מוסיפים s לפועל',
      difficulty: 'medium'
    },
    {
      questionNumber: 12,
      type: 'fill_in_blank',
      questionTextHe: 'He _______ (wash) his car every weekend.',
      correctAnswer: 'washes',
      explanationHe: 'wash מסתיים ב-sh, לכן מוסיפים es',
      difficulty: 'medium'
    },
    {
      questionNumber: 13,
      type: 'multiple_choice',
      questionTextHe: 'My friends _______ in Jerusalem.',
      options: ['lives', 'live', 'living', 'lived'],
      correctAnswer: 'live',
      explanationHe: 'my friends = they, משתמשים בצורת הבסיס',
      difficulty: 'medium'
    },
    {
      questionNumber: 14,
      type: 'fill_in_blank',
      questionTextHe: 'The baby _______ (cry) at night.',
      correctAnswer: 'cries',
      explanationHe: 'cry מסתיים ב-y אחרי עיצור, משנים ל-ies',
      difficulty: 'medium'
    },
    {
      questionNumber: 15,
      type: 'multiple_choice',
      questionTextHe: 'איזה משפט נכון?',
      options: ['She go to school', 'She goes to school', 'She going to school', 'She gos to school'],
      correctAnswer: 'She goes to school',
      explanationHe: 'עם she מוסיפים es לפועל go',
      difficulty: 'medium'
    },
    {
      questionNumber: 16,
      type: 'fill_in_blank',
      questionTextHe: 'It _______ (rain) a lot in winter.',
      correctAnswer: 'rains',
      explanationHe: 'עם it מוסיפים s',
      difficulty: 'medium'
    },
    {
      questionNumber: 17,
      type: 'multiple_choice',
      questionTextHe: 'We _______ dinner at 7 PM.',
      options: ['has', 'have', 'having', 'haves'],
      correctAnswer: 'have',
      explanationHe: 'עם we משתמשים ב-have (לא has)',
      difficulty: 'medium'
    },
    {
      questionNumber: 18,
      type: 'fill_in_blank',
      questionTextHe: 'She _______ (teach) English.',
      correctAnswer: 'teaches',
      explanationHe: 'teach מסתיים ב-ch, מוסיפים es',
      difficulty: 'medium'
    },
    {
      questionNumber: 19,
      type: 'multiple_choice',
      questionTextHe: 'The dog _______ in the garden.',
      options: ['run', 'runs', 'running', 'runned'],
      correctAnswer: 'runs',
      explanationHe: 'the dog = it, מוסיפים s',
      difficulty: 'medium'
    },
    {
      questionNumber: 20,
      type: 'fill_in_blank',
      questionTextHe: 'You _______ (do) your homework every day.',
      correctAnswer: 'do',
      explanationHe: 'עם you משתמשים בצורת הבסיס',
      difficulty: 'medium'
    },

    // ADVANCED LEVEL - Hard exercises (question 21-30)
    {
      questionNumber: 21,
      type: 'multiple_choice',
      questionTextHe: 'בחר את המשפט הנכון:',
      options: [
        'My sister study medicine at university',
        'My sister studies medicine at university',
        'My sister studys medicine at university',
        'My sister studying medicine at university'
      ],
      correctAnswer: 'My sister studies medicine at university',
      explanationHe: 'my sister = she, study מסתיים ב-y אחרי עיצור, משנים ל-ies',
      difficulty: 'hard'
    },
    {
      questionNumber: 22,
      type: 'fill_in_blank',
      questionTextHe: 'He _______ (fix) computers for a living.',
      correctAnswer: 'fixes',
      explanationHe: 'fix מסתיים ב-x, מוסיפים es',
      difficulty: 'hard'
    },
    {
      questionNumber: 23,
      type: 'multiple_choice',
      questionTextHe: 'איזה ביטוי זמן מתאים לזמן הווה פשוט?',
      options: ['right now', 'at the moment', 'every morning', 'yesterday'],
      correctAnswer: 'every morning',
      explanationHe: 'every morning מתאר הרגל יומיומי',
      difficulty: 'hard'
    },
    {
      questionNumber: 24,
      type: 'fill_in_blank',
      questionTextHe: 'The sun _______ (rise) in the east.',
      correctAnswer: 'rises',
      explanationHe: 'עובדה כללית, the sun = it, מוסיפים s',
      difficulty: 'hard'
    },
    {
      questionNumber: 25,
      type: 'multiple_choice',
      questionTextHe: 'איזה משפט שגוי?',
      options: [
        'Water freezes at 0 degrees',
        'He works in a bank',
        'They goes to school by bus',
        'She speaks three languages'
      ],
      correctAnswer: 'They goes to school by bus',
      explanationHe: 'עם they משתמשים ב-go (לא goes). הנכון: They go to school by bus',
      difficulty: 'hard'
    },
    {
      questionNumber: 26,
      type: 'fill_in_blank',
      questionTextHe: 'My father _______ (carry) a briefcase to work.',
      correctAnswer: 'carries',
      explanationHe: 'carry מסתיים ב-y אחרי עיצור, משנים ל-ies',
      difficulty: 'hard'
    },
    {
      questionNumber: 27,
      type: 'multiple_choice',
      questionTextHe: 'בחר את המשפט עם השימוש הנכון בזמן הווה פשוט:',
      options: [
        'I am knowing the answer',
        'I know the answer',
        'I knowing the answer',
        'I knows the answer'
      ],
      correctAnswer: 'I know the answer',
      explanationHe: 'know הוא פועל מצב (stative verb), לא משתמשים בו בהווה ממושך',
      difficulty: 'hard'
    },
    {
      questionNumber: 28,
      type: 'fill_in_blank',
      questionTextHe: 'She _______ (miss) her family.',
      correctAnswer: 'misses',
      explanationHe: 'miss מסתיים ב-ss, מוסיפים es',
      difficulty: 'hard'
    },
    {
      questionNumber: 29,
      type: 'multiple_choice',
      questionTextHe: 'The Earth _______ around the Sun.',
      options: ['move', 'moves', 'moving', 'is moving'],
      correctAnswer: 'moves',
      explanationHe: 'עובדה מדעית, the Earth = it, מוסיפים s',
      difficulty: 'hard'
    },
    {
      questionNumber: 30,
      type: 'fill_in_blank',
      questionTextHe: 'My brother _______ (try) to learn Hebrew.',
      correctAnswer: 'tries',
      explanationHe: 'try מסתיים ב-y אחרי עיצור, משנים ל-ies',
      difficulty: 'hard'
    }
  ];

  console.log(`\nAdding ${exercises.length} new exercises...\n`);

  for (const ex of exercises) {
    const query = `
      INSERT INTO exercises (
        lesson_id, question_number, type, question_text_he,
        question_text_en, options, correct_answer, explanation_he, difficulty
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;

    const values = [
      lessonId,
      ex.questionNumber,
      ex.type,
      ex.questionTextHe,
      ex.questionTextEn || null,
      ex.options ? JSON.stringify(ex.options) : null,
      ex.correctAnswer,
      ex.explanationHe,
      ex.difficulty
    ];

    await pool.query(query, values);
    console.log(`✓ Added question ${ex.questionNumber} (${ex.difficulty})`);
  }

  console.log(`\n✅ Successfully added ${exercises.length} exercises!`);

  // Show summary
  const summary = await pool.query(`
    SELECT difficulty, COUNT(*) as count
    FROM exercises
    WHERE lesson_id = $1
    GROUP BY difficulty
    ORDER BY difficulty
  `, [lessonId]);

  console.log('\n📊 Exercise Summary:');
  summary.rows.forEach(row => {
    console.log(`  ${row.difficulty}: ${row.count} exercises`);
  });

  process.exit(0);
}

addExercises().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
