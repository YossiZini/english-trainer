const { pool } = require('../config/database');

const topics = [
  {
    topicNumber: 2,
    subtopicNumber: '2.1',
    titleEn: 'Past Simple',
    titleHe: 'עבר פשוט',
    level: 'beginner',
    orderIndex: 2,
    theoryContentHe: `
<h2>זמן עבר פשוט (Past Simple)</h2>

<h3>מתי משתמשים?</h3>
<ul>
  <li><strong>פעולה שהסתיימה בעבר</strong> - I played football yesterday</li>
  <li><strong>אירועים שקרו בזמן מסוים בעבר</strong> - She visited London last year</li>
  <li><strong>הרגלים בעבר</strong> - We walked to school every day</li>
</ul>

<h3>פעלים רגילים (Regular Verbs)</h3>
<p>רוב הפעלים: <strong>פועל + ed</strong></p>
<div class="examples">
  <p>play → play<strong>ed</strong> - I played tennis yesterday</p>
  <p>work → work<strong>ed</strong> - She worked hard last week</p>
  <p>watch → watch<strong>ed</strong> - They watched a movie</p>
</div>

<h3>חוקים מיוחדים:</h3>
<ul>
  <li>פועל מסתיים ב-e: add + <strong>d</strong> → liked, lived, loved</li>
  <li>פועל קצר + עיצור אחרון: הכפל עיצור + <strong>ed</strong> → stopped, planned</li>
  <li>פועל מסתיים ב-y אחרי עיצור: <strong>ied</strong> → studied, tried, cried</li>
</ul>

<h3>ביטויי זמן נפוצים:</h3>
<ul>
  <li><strong>yesterday</strong> - אתמול</li>
  <li><strong>last week/month/year</strong> - שבוע/חודש/שנה שעברו</li>
  <li><strong>ago</strong> - לפני (two days ago)</li>
  <li><strong>in 2020</strong> - ב-2020</li>
</ul>
    `,
    exercises: [
      // EASY - 8 exercises
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'I _______ football yesterday.',
        options: ['play', 'played', 'plays', 'playing'],
        correctAnswer: 'played',
        explanationHe: 'עבר פשוט: play + ed = played',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (watch) TV last night.',
        correctAnswer: 'watched',
        explanationHe: 'watch + ed = watched',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'They _______ in London last year.',
        options: ['live', 'lived', 'lives', 'living'],
        correctAnswer: 'lived',
        explanationHe: 'live מסתיים ב-e, מוסיפים רק d',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (walk) to school yesterday.',
        correctAnswer: 'walked',
        explanationHe: 'walk + ed = walked',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'He _______ his homework.',
        options: ['finish', 'finished', 'finishes', 'finishing'],
        correctAnswer: 'finished',
        explanationHe: 'finish + ed = finished',
        difficulty: 'easy'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (like) the movie.',
        correctAnswer: 'liked',
        explanationHe: 'like מסתיים ב-e, מוסיפים d: liked',
        difficulty: 'easy'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'She _______ a book last week.',
        options: ['start', 'started', 'starts', 'starting'],
        correctAnswer: 'started',
        explanationHe: 'start + ed = started',
        difficulty: 'easy'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (visit) their grandparents.',
        correctAnswer: 'visited',
        explanationHe: 'visit + ed = visited',
        difficulty: 'easy'
      },
      // MEDIUM - 10 exercises
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'I _______ math last year.',
        options: ['study', 'studied', 'studyed', 'studies'],
        correctAnswer: 'studied',
        explanationHe: 'study מסתיים ב-y אחרי עיצור: y→ied = studied',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'The bus _______ (stop) at the station.',
        correctAnswer: 'stopped',
        explanationHe: 'stop: פועל קצר, מכפילים p: stopped',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'She _______ when she heard the news.',
        options: ['cry', 'cried', 'cryed', 'cries'],
        correctAnswer: 'cried',
        explanationHe: 'cry: y אחרי עיצור → ied = cried',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (plan) a trip last month.',
        correctAnswer: 'planned',
        explanationHe: 'plan: פועל קצר, מכפילים n: planned',
        difficulty: 'medium'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'He _______ hard for the exam.',
        options: ['try', 'tried', 'tryed', 'tries'],
        correctAnswer: 'tried',
        explanationHe: 'try: y אחרי עיצור → ied = tried',
        difficulty: 'medium'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (carry) the bags.',
        correctAnswer: 'carried',
        explanationHe: 'carry: y אחרי עיצור → ied = carried',
        difficulty: 'medium'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'I _______ to help him.',
        options: ['want', 'wanted', 'wants', 'wanting'],
        correctAnswer: 'wanted',
        explanationHe: 'want + ed = wanted',
        difficulty: 'medium'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (dance) at the party.',
        correctAnswer: 'danced',
        explanationHe: 'dance מסתיים ב-e, מוסיפים d: danced',
        difficulty: 'medium'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'We _______ the concert last night.',
        options: ['enjoy', 'enjoyed', 'enjoys', 'enjoying'],
        correctAnswer: 'enjoyed',
        explanationHe: 'enjoy: y אחרי תנועה, רק ed: enjoyed',
        difficulty: 'medium'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'The teacher _______ (explain) the lesson.',
        correctAnswer: 'explained',
        explanationHe: 'explain + ed = explained',
        difficulty: 'medium'
      },
      // HARD - 7 exercises
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['I stoped at the shop', 'I stopped at the shop', 'I stoppped at the shop', 'I stopted at the shop'],
        correctAnswer: 'I stopped at the shop',
        explanationHe: 'stop: מכפילים p לפני ed',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (travel) to Paris in 2020.',
        correctAnswer: 'travelled',
        explanationHe: 'travel: יכול להיות travelled או traveled (שניהם נכונים)',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'She _______ very hard last semester.',
        options: ['studyed', 'studied', 'studyied', 'studys'],
        correctAnswer: 'studied',
        explanationHe: 'study: y אחרי עיצור → ied',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (worry) about the test.',
        correctAnswer: 'worried',
        explanationHe: 'worry: y אחרי עיצור → ied = worried',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט שגוי?',
        options: ['He played tennis', 'She liked the movie', 'They enjoied the party', 'We watched TV'],
        correctAnswer: 'They enjoied the party',
        explanationHe: 'enjoy: y אחרי תנועה, רק ed: enjoyed (לא enjoied)',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: 'The company _______ (develop) a new product.',
        correctAnswer: 'developed',
        explanationHe: 'develop + ed = developed',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: 'I _______ my friend two days ago.',
        options: ['visit', 'visited', 'visits', 'visiting'],
        correctAnswer: 'visited',
        explanationHe: 'ago מעיד על עבר: visited',
        difficulty: 'hard'
      }
    ]
  },
  {
    topicNumber: 3,
    subtopicNumber: '3.1',
    titleEn: 'Present Continuous',
    titleHe: 'הווה ממושך',
    level: 'beginner',
    orderIndex: 3,
    theoryContentHe: `
<h2>זמן הווה ממושך (Present Continuous)</h2>

<h3>מתי משתמשים?</h3>
<ul>
  <li><strong>פעולה שקורה עכשיו</strong> - I am eating now</li>
  <li><strong>פעולה זמנית</strong> - She is studying this week</li>
  <li><strong>תוכניות עתידיות</strong> - We are traveling tomorrow</li>
</ul>

<h3>מבנה המשפט:</h3>
<div class="formula">
  <strong>Subject + am/is/are + verb-ing</strong>
</div>

<h3>הפעלים המסייעים:</h3>
<ul>
  <li><strong>I → am</strong> - I am reading</li>
  <li><strong>He/She/It → is</strong> - She is playing</li>
  <li><strong>You/We/They → are</strong> - They are running</li>
</ul>

<h3>חוקי הוספת ing:</h3>
<div class="rules">
  <p><strong>1. רוב הפעלים - מוסיפים ing:</strong></p>
  <p>play → playing, eat → eating, read → reading</p>

  <p><strong>2. פועל מסתיים ב-e - מורידים e ומוסיפים ing:</strong></p>
  <p>make → making, write → writing, come → coming</p>

  <p><strong>3. פועל קצר (עיצור-תנועה-עיצור) - מכפילים עיצור:</strong></p>
  <p>run → running, sit → sitting, swim → swimming</p>
</div>

<h3>ביטויי זמן:</h3>
<ul>
  <li><strong>now</strong> - עכשיו</li>
  <li><strong>at the moment</strong> - ברגע זה</li>
  <li><strong>right now</strong> - ממש עכשיו</li>
  <li><strong>this week/month</strong> - השבוע/החודש</li>
</ul>
    `,
    exercises: [
      // EASY - 8 exercises
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'I _______ TV now.',
        options: ['watch', 'watching', 'am watching', 'is watching'],
        correctAnswer: 'am watching',
        explanationHe: 'עם I משתמשים ב-am: am watching',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (read) a book.',
        correctAnswer: 'is reading',
        explanationHe: 'עם she משתמשים ב-is: is reading',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'They _______ football.',
        options: ['play', 'plays', 'are playing', 'is playing'],
        correctAnswer: 'are playing',
        explanationHe: 'עם they משתמשים ב-are: are playing',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (eat) lunch.',
        correctAnswer: 'are eating',
        explanationHe: 'עם we משתמשים ב-are: are eating',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'He _______ to music.',
        options: ['listen', 'listening', 'is listening', 'are listening'],
        correctAnswer: 'is listening',
        explanationHe: 'עם he משתמשים ב-is: is listening',
        difficulty: 'easy'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'You _______ (work) hard.',
        correctAnswer: 'are working',
        explanationHe: 'עם you משתמשים ב-are: are working',
        difficulty: 'easy'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'It _______ outside.',
        options: ['rain', 'raining', 'is raining', 'are raining'],
        correctAnswer: 'is raining',
        explanationHe: 'עם it משתמשים ב-is: is raining',
        difficulty: 'easy'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (study) English.',
        correctAnswer: 'am studying',
        explanationHe: 'עם I משתמשים ב-am: am studying',
        difficulty: 'easy'
      },
      // MEDIUM - 9 exercises
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'She _______ a letter.',
        options: ['write', 'writing', 'is writeing', 'is writing'],
        correctAnswer: 'is writing',
        explanationHe: 'write מסתיים ב-e, מורידים e: writing',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (make) dinner.',
        correctAnswer: 'are making',
        explanationHe: 'make מסתיים ב-e, מורידים e: making',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'He _______ very fast.',
        options: ['run', 'runing', 'running', 'is running'],
        correctAnswer: 'is running',
        explanationHe: 'run: מכפילים n לפני ing: running',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (sit) on the chair.',
        correctAnswer: 'am sitting',
        explanationHe: 'sit: מכפילים t: sitting',
        difficulty: 'medium'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'We _______ to the beach.',
        options: ['go', 'going', 'are going', 'is going'],
        correctAnswer: 'are going',
        explanationHe: 'go מסתיים ב-o, רק ing: going',
        difficulty: 'medium'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (come) home.',
        correctAnswer: 'is coming',
        explanationHe: 'come מסתיים ב-e, מורידים e: coming',
        difficulty: 'medium'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'They _______ in the pool.',
        options: ['swim', 'swiming', 'swimming', 'are swimming'],
        correctAnswer: 'are swimming',
        explanationHe: 'swim: מכפילים m: swimming',
        difficulty: 'medium'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'You _______ (dance) well.',
        correctAnswer: 'are dancing',
        explanationHe: 'dance מסתיים ב-e, מורידים e: dancing',
        difficulty: 'medium'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'He _______ a book.',
        options: ['carry', 'carrying', 'is carrying', 'are carrying'],
        correctAnswer: 'is carrying',
        explanationHe: 'carry: רק ing (y אחרי עיצור לא משתנה בהווה ממושך)',
        difficulty: 'medium'
      },
      // HARD - 8 exercises
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['She is runing fast', 'She is running fast', 'She is runnning fast', 'She running fast'],
        correctAnswer: 'She is running fast',
        explanationHe: 'run: מכפילים n אחד: running',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (plan) my vacation.',
        correctAnswer: 'am planning',
        explanationHe: 'plan: מכפילים n: planning',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'They _______ their homework.',
        options: ['do', 'doing', 'are doing', 'is doing'],
        correctAnswer: 'are doing',
        explanationHe: 'do: רק ing, עם they: are doing',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (get) ready.',
        correctAnswer: 'is getting',
        explanationHe: 'get: מכפילים t: getting',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט שגוי?',
        options: ['I am writing', 'She is makeing dinner', 'They are playing', 'He is running'],
        correctAnswer: 'She is makeing dinner',
        explanationHe: 'make מסתיים ב-e, מורידים e: making (לא makeing)',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (travel) tomorrow.',
        correctAnswer: 'are travelling',
        explanationHe: 'travel: travelling או traveling (שניהם נכונים)',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'multiple_choice',
        questionTextHe: 'He _______ a new job next week.',
        options: ['start', 'starting', 'is starting', 'are starting'],
        correctAnswer: 'is starting',
        explanationHe: 'הווה ממושך לתוכניות עתידיות: is starting',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (lie) on the bed.',
        correctAnswer: 'am lying',
        explanationHe: 'lie: ie → ying: lying',
        difficulty: 'hard'
      }
    ]
  }
];

async function addTopics() {
  console.log('🌱 Adding new topics...\n');

  for (const topicData of topics) {
    try {
      console.log(`Creating topic: ${topicData.titleHe} (${topicData.titleEn})...`);

      // Insert lesson
      const lessonQuery = `
        INSERT INTO lessons (topic_number, subtopic_number, title_en, title_he, level, order_index, theory_content_he)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `;

      const lessonResult = await pool.query(lessonQuery, [
        topicData.topicNumber,
        topicData.subtopicNumber,
        topicData.titleEn,
        topicData.titleHe,
        topicData.level,
        topicData.orderIndex,
        topicData.theoryContentHe
      ]);

      const lessonId = lessonResult.rows[0].id;
      console.log(`✓ Lesson created with ID: ${lessonId}`);

      // Insert exercises
      console.log(`  Adding ${topicData.exercises.length} exercises...`);

      for (const ex of topicData.exercises) {
        const exerciseQuery = `
          INSERT INTO exercises (
            lesson_id, question_number, type, question_text_he,
            question_text_en, options, correct_answer, explanation_he, difficulty
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `;

        await pool.query(exerciseQuery, [
          lessonId,
          ex.questionNumber,
          ex.type,
          ex.questionTextHe,
          ex.questionTextEn || null,
          ex.options ? JSON.stringify(ex.options) : null,
          ex.correctAnswer,
          ex.explanationHe,
          ex.difficulty
        ]);
      }

      console.log(`✓ ${topicData.exercises.length} exercises added\n`);

    } catch (error) {
      console.error(`Error adding topic ${topicData.titleHe}:`, error);
    }
  }

  // Show summary
  const summary = await pool.query(`
    SELECT topic_number, title_he, title_en, COUNT(e.id) as exercise_count
    FROM lessons l
    LEFT JOIN exercises e ON l.id = e.lesson_id
    GROUP BY l.topic_number, l.title_he, l.title_en
    ORDER BY l.topic_number
  `);

  console.log('\n📊 All Topics Summary:');
  summary.rows.forEach(row => {
    console.log(`  Topic ${row.topic_number}: ${row.title_he} (${row.title_en}) - ${row.exercise_count} exercises`);
  });

  process.exit(0);
}

addTopics().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
