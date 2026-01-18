const { pool } = require('../config/database');
const Exercise = require('../models/Exercise');

// New exercises for Topic 1.2 (Affirmative Sentences) - Questions 9-20
const topic12NewExercises = [
  {
    questionNumber: 9,
    type: 'multiple_choice',
    questionTextHe: 'The teacher _______ the homework every week.',
    options: ['correct', 'corrects', 'correctes', 'correcting'],
    correctAnswer: 'corrects',
    explanationHe: 'עם the teacher (he/she) מוסיפים s: corrects',
    difficulty: 'hard'
  },
  {
    questionNumber: 10,
    type: 'fill_in_blank',
    questionTextHe: 'My sister _______ (carry) her bag to school.',
    correctAnswer: 'carries',
    explanationHe: 'carry מסתיים ב-y אחרי עיצור, משנים ל-ies: carries',
    difficulty: 'hard'
  },
  {
    questionNumber: 11,
    type: 'multiple_choice',
    questionTextHe: 'The company _______ new products every year.',
    options: ['develop', 'develops', 'developpes', 'developing'],
    correctAnswer: 'develops',
    explanationHe: 'company היא it, לכן מוסיפים s: develops',
    difficulty: 'hard'
  },
  {
    questionNumber: 12,
    type: 'fill_in_blank',
    questionTextHe: 'She _______ (teach) mathematics at the university.',
    correctAnswer: 'teaches',
    explanationHe: 'teach מסתיים ב-ch, מוסיפים es: teaches',
    difficulty: 'hard'
  },
  {
    questionNumber: 13,
    type: 'multiple_choice',
    questionTextHe: 'The sun _______ every morning.',
    options: ['rise', 'rises', 'rizes', 'rising'],
    correctAnswer: 'rises',
    explanationHe: 'sun היא it, מוסיפים s: rises',
    difficulty: 'hard'
  },
  {
    questionNumber: 14,
    type: 'fill_in_blank',
    questionTextHe: 'He _______ (worry) about his exams.',
    correctAnswer: 'worries',
    explanationHe: 'worry מסתיים ב-y אחרי עיצור, משנים ל-ies: worries',
    difficulty: 'hard'
  },
  {
    questionNumber: 15,
    type: 'multiple_choice',
    questionTextHe: 'My father _______ to work by car.',
    options: ['go', 'gos', 'goes', 'going'],
    correctAnswer: 'goes',
    explanationHe: 'father הוא he, go מסתיים ב-o ולכן מוסיפים es: goes',
    difficulty: 'medium'
  },
  {
    questionNumber: 16,
    type: 'fill_in_blank',
    questionTextHe: 'The bird _______ (sing) beautifully.',
    correctAnswer: 'sings',
    explanationHe: 'bird היא it, מוסיפים s: sings',
    difficulty: 'hard'
  },
  {
    questionNumber: 17,
    type: 'multiple_choice',
    questionTextHe: 'She always _______ her homework on time.',
    options: ['finish', 'finishes', 'finishs', 'finishing'],
    correctAnswer: 'finishes',
    explanationHe: 'finish מסתיים ב-sh, מוסיפים es: finishes',
    difficulty: 'hard'
  },
  {
    questionNumber: 18,
    type: 'fill_in_blank',
    questionTextHe: 'The baby _______ (cry) when he is hungry.',
    correctAnswer: 'cries',
    explanationHe: 'cry מסתיים ב-y אחרי עיצור, משנים ל-ies: cries',
    difficulty: 'hard'
  },
  {
    questionNumber: 19,
    type: 'multiple_choice',
    questionTextHe: 'The museum _______ at 9 AM.',
    options: ['open', 'opens', 'openes', 'opening'],
    correctAnswer: 'opens',
    explanationHe: 'museum היא it, מוסיפים s: opens',
    difficulty: 'hard'
  },
  {
    questionNumber: 20,
    type: 'fill_in_blank',
    questionTextHe: 'He _______ (mix) the ingredients together.',
    correctAnswer: 'mixes',
    explanationHe: 'mix מסתיים ב-x, מוסיפים es: mixes',
    difficulty: 'hard'
  }
];

// New exercises for Topic 1.3 (Negative Sentences) - Questions 11-20
const topic13NewExercises = [
  {
    questionNumber: 11,
    type: 'multiple_choice',
    questionTextHe: 'The students _______ understand the lesson.',
    options: ["doesn't", "don't", "not", "aren't"],
    correctAnswer: "don't",
    explanationHe: "עם students (they) משתמשים ב-don't: don't understand",
    difficulty: 'hard'
  },
  {
    questionNumber: 12,
    type: 'fill_in_blank',
    questionTextHe: 'She _______ (not/believe) in ghosts.',
    correctAnswer: "doesn't believe",
    explanationHe: "עם she משתמשים ב-doesn't והפועל בצורת בסיס: doesn't believe",
    difficulty: 'hard'
  },
  {
    questionNumber: 13,
    type: 'multiple_choice',
    questionTextHe: 'My parents _______ allow me to go out late.',
    options: ["doesn't", "don't", "not", "isn't"],
    correctAnswer: "don't",
    explanationHe: "עם parents (they) משתמשים ב-don't: don't allow",
    difficulty: 'hard'
  },
  {
    questionNumber: 14,
    type: 'fill_in_blank',
    questionTextHe: 'The computer _______ (not/start) in the morning.',
    correctAnswer: "doesn't start",
    explanationHe: "עם computer (it) משתמשים ב-doesn't: doesn't start",
    difficulty: 'hard'
  },
  {
    questionNumber: 15,
    type: 'multiple_choice',
    questionTextHe: 'He _______ speak Chinese.',
    options: ["don't", "doesn't", "not", "isn't"],
    correctAnswer: "doesn't",
    explanationHe: "עם he משתמשים ב-doesn't: doesn't speak",
    difficulty: 'hard'
  },
  {
    questionNumber: 16,
    type: 'fill_in_blank',
    questionTextHe: 'They _______ (not/agree) with the decision.',
    correctAnswer: "don't agree",
    explanationHe: "עם they משתמשים ב-don't והפועל בצורת בסיס: don't agree",
    difficulty: 'hard'
  },
  {
    questionNumber: 17,
    type: 'multiple_choice',
    questionTextHe: 'The restaurant _______ serve breakfast.',
    options: ["don't", "doesn't", "not", "aren't"],
    correctAnswer: "doesn't",
    explanationHe: "עם restaurant (it) משתמשים ב-doesn't: doesn't serve",
    difficulty: 'hard'
  },
  {
    questionNumber: 18,
    type: 'fill_in_blank',
    questionTextHe: 'I _______ (not/understand) this question.',
    correctAnswer: "don't understand",
    explanationHe: "עם I משתמשים ב-don't: don't understand",
    difficulty: 'medium'
  },
  {
    questionNumber: 19,
    type: 'multiple_choice',
    questionTextHe: 'The children _______ like vegetables.',
    options: ["doesn't", "don't", "not", "isn't"],
    correctAnswer: "don't",
    explanationHe: "עם children (they) משתמשים ב-don't: don't like",
    difficulty: 'hard'
  },
  {
    questionNumber: 20,
    type: 'fill_in_blank',
    questionTextHe: 'My sister _______ (not/drink) coffee.',
    correctAnswer: "doesn't drink",
    explanationHe: "עם sister (she) משתמשים ב-doesn't והפועל בצורת בסיס: doesn't drink",
    difficulty: 'hard'
  }
];

async function addAdvancedQuestions() {
  console.log('🌱 Adding advanced questions to topics 1.2 and 1.3...\n');

  try {
    // Get lesson IDs for topics 1.2 and 1.3
    const lessonQuery = `
      SELECT id, subtopic_number, title_he
      FROM lessons
      WHERE topic_number = 1 AND subtopic_number IN ('1.2', '1.3')
      ORDER BY subtopic_number
    `;

    const result = await pool.query(lessonQuery);
    const lessons = result.rows;

    if (lessons.length !== 2) {
      throw new Error('Could not find both lessons 1.2 and 1.3');
    }

    const lesson12 = lessons.find(l => l.subtopic_number === '1.2');
    const lesson13 = lessons.find(l => l.subtopic_number === '1.3');

    console.log(`Found lesson 1.2: ${lesson12.title_he} (${lesson12.id})`);
    console.log(`Found lesson 1.3: ${lesson13.title_he} (${lesson13.id})`);

    // Add exercises for topic 1.2
    console.log('\nAdding exercises for Topic 1.2...');
    for (const exercise of topic12NewExercises) {
      await Exercise.create({
        lessonId: lesson12.id,
        ...exercise
      });
      console.log(`  ✅ Added question ${exercise.questionNumber}: ${exercise.questionTextHe.substring(0, 50)}...`);
    }

    // Add exercises for topic 1.3
    console.log('\nAdding exercises for Topic 1.3...');
    for (const exercise of topic13NewExercises) {
      await Exercise.create({
        lessonId: lesson13.id,
        ...exercise
      });
      console.log(`  ✅ Added question ${exercise.questionNumber}: ${exercise.questionTextHe.substring(0, 50)}...`);
    }

    console.log('\n✅ Successfully added all advanced questions!');
    console.log(`   Topic 1.2 now has 20 questions`);
    console.log(`   Topic 1.3 now has 20 questions`);

  } catch (error) {
    console.error('❌ Failed to add questions:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

addAdvancedQuestions();
