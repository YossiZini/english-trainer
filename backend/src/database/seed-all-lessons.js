const { pool } = require('../config/database');
const Lesson = require('../models/Lesson');
const Exercise = require('../models/Exercise');

// Comprehensive lesson data for all 4 topics (17 subtopics total)
const lessonsData = [
  // ==================== TOPIC 1: PRESENT SIMPLE ====================
  {
    topicNumber: 1,
    subtopicNumber: '1.1',
    titleEn: 'Introduction & Usage',
    titleHe: 'מבוא ושימושים',
    level: 'beginner',
    orderIndex: 1,
    theoryContentHe: `
<h2>מהו זמן הווה פשוט (Present Simple)?</h2>

<p>זמן הווה פשוט משמש לתיאור:</p>
<ul>
  <li><strong>הרגלים ושגרה יומיומית</strong> - דברים שאנחנו עושים באופן קבוע</li>
  <li><strong>עובדות כלליות ואמיתות</strong> - דברים שתמיד נכונים</li>
  <li><strong>מצבים קבועים</strong> - מצב שלא משתנה</li>
</ul>

<h3>ביטויי זמן נפוצים (Time Expressions):</h3>
<ul>
  <li><strong>always</strong> (תמיד) - I always brush my teeth.</li>
  <li><strong>usually</strong> (בדרך כלל) - We usually eat dinner at 7.</li>
  <li><strong>often</strong> (לעתים קרובות) - They often play football.</li>
  <li><strong>sometimes</strong> (לפעמים) - She sometimes reads books.</li>
  <li><strong>never</strong> (אף פעם לא) - He never eats meat.</li>
</ul>

<div class="examples">
  <p><strong>הרגלים:</strong></p>
  <p>I wake up at 7 AM every day. - אני קם ב-7 בבוקר כל יום</p>
  <p>She drinks coffee in the morning. - היא שותה קפה בבוקר</p>

  <p><strong>עובדות:</strong></p>
  <p>The sun rises in the east. - השמש זורחת במזרח</p>
  <p>Water boils at 100 degrees. - מים רותחים ב-100 מעלות</p>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'מתי משתמשים בזמן הווה פשוט?',
        options: ['רק להווה', 'רק לעתיד', 'להרגלים ועובדות', 'רק לעבר'],
        correctAnswer: 'להרגלים ועובדות',
        explanationHe: 'זמן הווה פשוט משמש להרגלים, שגרה, ועובדות כלליות.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'איזה ביטוי מתאר תדירות של 100%?',
        options: ['sometimes', 'always', 'never', 'often'],
        correctAnswer: 'always',
        explanationHe: 'always פירושו תמיד - 100% מהזמן.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (play) football every Sunday.',
        correctAnswer: 'play',
        explanationHe: 'עם I משתמשים בצורת הבסיס של הפועל.',
        difficulty: 'easy'
      }
    ]
  },
  {
    topicNumber: 1,
    subtopicNumber: '1.2',
    titleEn: 'Affirmative - Adding s/es/ies',
    titleHe: 'משפטים חיוביים - הוספת s/es/ies',
    level: 'beginner',
    orderIndex: 2,
    theoryContentHe: `
<h2>חוקי הוספת s/es/ies לפועל</h2>

<p><strong>עם He / She / It צריך להוסיף s או es לפועל!</strong></p>

<div class="rules">
  <p><strong>1. רוב הפעלים - מוסיפים s:</strong></p>
  <ul>
    <li>play → play<strong>s</strong></li>
    <li>work → work<strong>s</strong></li>
    <li>eat → eat<strong>s</strong></li>
    <li>like → like<strong>s</strong></li>
  </ul>

  <p><strong>2. פעלים שמסתיימים ב-o, s, x, ch, sh - מוסיפים es:</strong></p>
  <ul>
    <li>go → go<strong>es</strong></li>
    <li>watch → watch<strong>es</strong></li>
    <li>pass → pass<strong>es</strong></li>
    <li>wash → wash<strong>es</strong></li>
  </ul>

  <p><strong>3. פעלים שמסתיימים ב-y אחרי עיצור - משנים ל-ies:</strong></p>
  <ul>
    <li>study → stud<strong>ies</strong></li>
    <li>fly → fl<strong>ies</strong></li>
    <li>cry → cr<strong>ies</strong></li>
  </ul>

  <p><strong>4. אבל! y אחרי תנועה - רק מוסיפים s:</strong></p>
  <ul>
    <li>play → play<strong>s</strong></li>
    <li>say → say<strong>s</strong></li>
  </ul>
</div>

<div class="examples">
  <p>He <strong>plays</strong> tennis. - הוא משחק טניס</p>
  <p>She <strong>watches</strong> TV. - היא צופה בטלוויזיה</p>
  <p>My brother <strong>studies</strong> math. - אחי לומד מתמטיקה</p>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'He _______ to school every day.',
        options: ['go', 'goes', 'going', 'gos'],
        correctAnswer: 'goes',
        explanationHe: 'עם he מוסיפים es לפועל go: goes',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (study) English.',
        correctAnswer: 'studies',
        explanationHe: 'study מסתיים ב-y אחרי עיצור, לכן משנים ל-ies: studies',
        difficulty: 'medium'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'The cat _______ (drink) milk.',
        correctAnswer: 'drinks',
        explanationHe: 'עם it מוסיפים s: drinks',
        difficulty: 'easy'
      }
    ]
  },
  {
    topicNumber: 1,
    subtopicNumber: '1.3',
    titleEn: 'Negative Sentences',
    titleHe: 'משפטים שליליים',
    level: 'beginner',
    orderIndex: 3,
    theoryContentHe: `
<h2>משפטים שליליים בזמן הווה פשוט</h2>

<div class="formula">
  <strong>Subject + do/does + not + verb (infinitive)</strong>
</div>

<div class="rules">
  <p><strong>I / You / We / They - משתמשים ב-do not (don't):</strong></p>
  <ul>
    <li>I <strong>don't</strong> like coffee.</li>
    <li>They <strong>don't</strong> work on weekends.</li>
  </ul>

  <p><strong>He / She / It - משתמשים ב-does not (doesn't):</strong></p>
  <ul>
    <li>She <strong>doesn't</strong> play tennis.</li>
    <li>He <strong>doesn't</strong> watch TV.</li>
  </ul>
</div>

<div class="warning">
  <strong>שים לב!</strong> הפועל אחרי doesn't תמיד בצורת הבסיס (בלי s)!<br>
  ❌ She doesn't plays<br>
  ✅ She doesn't play
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'She _______ like vegetables.',
        options: ["don't", "doesn't", "isn't", "not"],
        correctAnswer: "doesn't",
        explanationHe: 'עם she משתמשים ב-doesn\'t',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (not/play) football.',
        correctAnswer: "don't play",
        explanationHe: 'עם they משתמשים ב-don\'t + פועל בצורת הבסיס',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'He _______ work on Sundays.',
        options: ["don't", "doesn't", "isn't", "doesn't works"],
        correctAnswer: "doesn't",
        explanationHe: 'עם he משתמשים ב-doesn\'t (לא doesn\'t works!)',
        difficulty: 'medium'
      }
    ]
  },
  {
    topicNumber: 1,
    subtopicNumber: '1.4',
    titleEn: 'Questions',
    titleHe: 'שאלות',
    level: 'beginner',
    orderIndex: 4,
    theoryContentHe: `
<h2>שאלות בזמן הווה פשוט</h2>

<div class="formula">
  <strong>Do/Does + subject + verb (infinitive)?</strong>
</div>

<div class="rules">
  <p><strong>I / You / We / They - משתמשים ב-Do:</strong></p>
  <ul>
    <li><strong>Do</strong> you like pizza?</li>
    <li><strong>Do</strong> they work here?</li>
  </ul>

  <p><strong>He / She / It - משתמשים ב-Does:</strong></p>
  <ul>
    <li><strong>Does</strong> she play tennis?</li>
    <li><strong>Does</strong> he work on weekends?</li>
  </ul>
</div>

<div class="examples">
  <p>Do you like coffee? - אתה אוהב קפה?</p>
  <p>Does she speak English? - היא מדברת אנגלית?</p>
  <p>Do they live in Tel Aviv? - הם גרים בתל אביב?</p>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: '_______ she like pizza?',
        options: ['Do', 'Does', 'Is', 'Are'],
        correctAnswer: 'Does',
        explanationHe: 'עם she משתמשים ב-Does',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: '_______ you play football?',
        correctAnswer: 'Do',
        explanationHe: 'עם you משתמשים ב-Do',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: '_______ they work here?',
        options: ['Do', 'Does', 'Is', 'Are'],
        correctAnswer: 'Do',
        explanationHe: 'עם they משתמשים ב-Do',
        difficulty: 'easy'
      }
    ]
  },
  {
    topicNumber: 1,
    subtopicNumber: '1.5',
    titleEn: 'Short Answers',
    titleHe: 'תשובות קצרות',
    level: 'beginner',
    orderIndex: 5,
    theoryContentHe: `
<h2>תשובות קצרות</h2>

<p>בתשובות קצרות משתמשים ב-Yes/No + כינוי + do/does</p>

<div class="rules">
  <p><strong>I / You / We / They:</strong></p>
  <ul>
    <li>Yes, I <strong>do</strong> / No, I <strong>don't</strong></li>
    <li>Yes, we <strong>do</strong> / No, we <strong>don't</strong></li>
  </ul>

  <p><strong>He / She / It:</strong></p>
  <ul>
    <li>Yes, he <strong>does</strong> / No, he <strong>doesn't</strong></li>
    <li>Yes, she <strong>does</strong> / No, she <strong>doesn't</strong></li>
  </ul>
</div>

<div class="examples">
  <p>Do you like pizza? → Yes, I do.</p>
  <p>Does she speak English? → No, she doesn't.</p>
  <p>Do they live here? → Yes, they do.</p>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'Do you like coffee? → Yes, I _______.',
        options: ['do', 'does', 'am', 'like'],
        correctAnswer: 'do',
        explanationHe: 'עם I בתשובה קצרה משתמשים ב-do',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'Does he play tennis? → No, he _______.',
        options: ["don't", "doesn't", "isn't", "not"],
        correctAnswer: "doesn't",
        explanationHe: 'עם he בתשובה שלילית משתמשים ב-doesn\'t',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'Do they work here? → Yes, _______ _______.',
        correctAnswer: 'they do',
        explanationHe: 'עם they בתשובה חיובית: Yes, they do',
        difficulty: 'medium'
      }
    ]
  },

  // ==================== TOPIC 2: PAST SIMPLE ====================
  {
    topicNumber: 2,
    subtopicNumber: '2.1',
    titleEn: 'Introduction & Regular Verbs',
    titleHe: 'מבוא ופעלים רגילים',
    level: 'beginner',
    orderIndex: 6,
    theoryContentHe: `
<h2>זמן עבר פשוט (Past Simple)</h2>

<p>משמש לתיאור פעולות שהסתיימו בעבר</p>

<h3>פעלים רגילים - מוסיפים ed:</h3>
<div class="rules">
  <p><strong>1. רוב הפעלים - מוסיפים ed:</strong></p>
  <ul>
    <li>play → play<strong>ed</strong></li>
    <li>work → work<strong>ed</strong></li>
  </ul>

  <p><strong>2. פועל שמסתיים ב-e - מוסיפים רק d:</strong></p>
  <ul>
    <li>like → like<strong>d</strong></li>
    <li>live → live<strong>d</strong></li>
  </ul>

  <p><strong>3. פועל שמסתיים ב-y אחרי עיצור - משנים ל-ied:</strong></p>
  <ul>
    <li>study → stud<strong>ied</strong></li>
    <li>cry → cr<strong>ied</strong></li>
  </ul>
</div>

<div class="examples">
  <p>I <strong>played</strong> football yesterday.</p>
  <p>She <strong>worked</strong> hard last week.</p>
  <p>They <strong>studied</strong> English last night.</p>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (play) football yesterday.',
        correctAnswer: 'played',
        explanationHe: 'play הופך ל-played בעבר',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (study) last night.',
        correctAnswer: 'studied',
        explanationHe: 'study משנים ל-studied (y → ied)',
        difficulty: 'medium'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'They _______ in London last year.',
        options: ['live', 'lived', 'lives', 'living'],
        correctAnswer: 'lived',
        explanationHe: 'live הופך ל-lived',
        difficulty: 'easy'
      }
    ]
  },
  {
    topicNumber: 2,
    subtopicNumber: '2.2',
    titleEn: 'Irregular Verbs',
    titleHe: 'פעלים לא רגילים',
    level: 'beginner',
    orderIndex: 7,
    theoryContentHe: `
<h2>פעלים לא רגילים</h2>

<p>פעלים אלה לא מקבלים ed - יש להם צורה מיוחדת!</p>

<div class="rules">
  <p><strong>פעלים נפוצים:</strong></p>
  <ul>
    <li>go → <strong>went</strong></li>
    <li>eat → <strong>ate</strong></li>
    <li>see → <strong>saw</strong></li>
    <li>make → <strong>made</strong></li>
    <li>take → <strong>took</strong></li>
    <li>come → <strong>came</strong></li>
    <li>have → <strong>had</strong></li>
    <li>do → <strong>did</strong></li>
  </ul>
</div>

<div class="examples">
  <p>I <strong>went</strong> to school yesterday.</p>
  <p>She <strong>ate</strong> pizza last night.</p>
  <p>They <strong>saw</strong> a movie.</p>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'I _______ to the park yesterday.',
        options: ['go', 'went', 'goed', 'goes'],
        correctAnswer: 'went',
        explanationHe: 'go הופך ל-went בעבר (פועל לא רגיל)',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (eat) pizza last night.',
        correctAnswer: 'ate',
        explanationHe: 'eat הופך ל-ate',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'They _______ a movie.',
        options: ['see', 'seed', 'saw', 'seen'],
        correctAnswer: 'saw',
        explanationHe: 'see הופך ל-saw',
        difficulty: 'medium'
      }
    ]
  },
  {
    topicNumber: 2,
    subtopicNumber: '2.3',
    titleEn: 'Negative Sentences',
    titleHe: 'משפטים שליליים',
    level: 'beginner',
    orderIndex: 8,
    theoryContentHe: `
<h2>משפטים שליליים בעבר</h2>

<div class="formula">
  <strong>Subject + did not (didn't) + verb (infinitive)</strong>
</div>

<div class="rules">
  <p><strong>עם כל הכינויים משתמשים ב-didn't:</strong></p>
  <ul>
    <li>I <strong>didn't</strong> play</li>
    <li>She <strong>didn't</strong> go</li>
    <li>They <strong>didn't</strong> work</li>
  </ul>
</div>

<div class="warning">
  <strong>שים לב!</strong> הפועל אחרי didn't תמיד בצורת הבסיס!<br>
  ❌ I didn't played<br>
  ✅ I didn't play
</div>

<div class="examples">
  <p>I <strong>didn't play</strong> football yesterday.</p>
  <p>She <strong>didn't go</strong> to school.</p>
  <p>They <strong>didn't eat</strong> lunch.</p>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'I _______ play football yesterday.',
        options: ["don't", "doesn't", "didn't", "not"],
        correctAnswer: "didn't",
        explanationHe: 'בעבר שלילי משתמשים ב-didn\'t',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (not/go) to school.',
        correctAnswer: "didn't go",
        explanationHe: 'didn\'t + פועל בצורת הבסיס',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'They _______ eat lunch.',
        options: ["don't", "doesn't", "didn't", "didn't ate"],
        correctAnswer: "didn't",
        explanationHe: 'didn\'t (לא didn\'t ate!)',
        difficulty: 'medium'
      }
    ]
  },
  {
    topicNumber: 2,
    subtopicNumber: '2.4',
    titleEn: 'Questions',
    titleHe: 'שאלות',
    level: 'beginner',
    orderIndex: 9,
    theoryContentHe: `
<h2>שאלות בעבר</h2>

<div class="formula">
  <strong>Did + subject + verb (infinitive)?</strong>
</div>

<div class="rules">
  <p><strong>עם כל הכינויים משתמשים ב-Did:</strong></p>
  <ul>
    <li><strong>Did</strong> you play?</li>
    <li><strong>Did</strong> she go?</li>
    <li><strong>Did</strong> they work?</li>
  </ul>
</div>

<div class="examples">
  <p><strong>Did</strong> you play football yesterday?</p>
  <p><strong>Did</strong> she go to school?</p>
  <p><strong>Did</strong> they eat lunch?</p>
</div>

<h3>תשובות קצרות:</h3>
<p>Yes, I <strong>did</strong> / No, I <strong>didn't</strong></p>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: '_______ you play football yesterday?',
        options: ['Do', 'Does', 'Did', 'Done'],
        correctAnswer: 'Did',
        explanationHe: 'בשאלות בעבר משתמשים ב-Did',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: '_______ she go to school?',
        correctAnswer: 'Did',
        explanationHe: 'בשאלות בעבר משתמשים ב-Did',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'Did you eat lunch? → Yes, I _______.',
        options: ['do', 'does', 'did', 'done'],
        correctAnswer: 'did',
        explanationHe: 'בתשובה חיובית: Yes, I did',
        difficulty: 'easy'
      }
    ]
  },

  // ==================== TOPIC 3: PRESENT CONTINUOUS ====================
  {
    topicNumber: 3,
    subtopicNumber: '3.1',
    titleEn: 'Introduction & Formation',
    titleHe: 'מבוא ומבנה',
    level: 'beginner',
    orderIndex: 10,
    theoryContentHe: `
<h2>הווה ממושך (Present Continuous)</h2>

<p>משמש לתיאור פעולות שקורות עכשיו</p>

<div class="formula">
  <strong>Subject + am/is/are + verb-ing</strong>
</div>

<div class="rules">
  <p><strong>I - משתמשים ב-am:</strong></p>
  <ul>
    <li>I <strong>am playing</strong></li>
  </ul>

  <p><strong>He/She/It - משתמשים ב-is:</strong></p>
  <ul>
    <li>She <strong>is playing</strong></li>
  </ul>

  <p><strong>You/We/They - משתמשים ב-are:</strong></p>
  <ul>
    <li>They <strong>are playing</strong></li>
  </ul>
</div>

<div class="examples">
  <p>I <strong>am eating</strong> now. - אני אוכל עכשיו</p>
  <p>She <strong>is watching</strong> TV. - היא צופה בטלוויזיה</p>
  <p>They <strong>are playing</strong> football. - הם משחקים כדורגל</p>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'I _______ eating now.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'am',
        explanationHe: 'עם I משתמשים ב-am',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (watch) TV.',
        correctAnswer: 'is watching',
        explanationHe: 'עם she: is + verb-ing',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'They _______ playing football.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'are',
        explanationHe: 'עם they משתמשים ב-are',
        difficulty: 'easy'
      }
    ]
  },
  {
    topicNumber: 3,
    subtopicNumber: '3.2',
    titleEn: 'Spelling Rules',
    titleHe: 'כללי כתיב',
    level: 'beginner',
    orderIndex: 11,
    theoryContentHe: `
<h2>כללי הוספת ing</h2>

<div class="rules">
  <p><strong>1. רוב הפעלים - פשוט מוסיפים ing:</strong></p>
  <ul>
    <li>play → play<strong>ing</strong></li>
    <li>eat → eat<strong>ing</strong></li>
  </ul>

  <p><strong>2. פועל שמסתיים ב-e - מורידים את ה-e:</strong></p>
  <ul>
    <li>make → mak<strong>ing</strong></li>
    <li>write → writ<strong>ing</strong></li>
  </ul>

  <p><strong>3. פועל קצר (עיצור-תנועה-עיצור) - מכפילים את העיצור האחרון:</strong></p>
  <ul>
    <li>run → ru<strong>nn</strong>ing</li>
    <li>sit → si<strong>tt</strong>ing</li>
  </ul>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'fill_in_blank',
        questionTextHe: 'She is _______ (make) a cake.',
        correctAnswer: 'making',
        explanationHe: 'make → making (מורידים e)',
        difficulty: 'medium'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'They are _______ (run).',
        correctAnswer: 'running',
        explanationHe: 'run → running (מכפילים n)',
        difficulty: 'medium'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'I am _______ (play) football.',
        correctAnswer: 'playing',
        explanationHe: 'play → playing (רגיל)',
        difficulty: 'easy'
      }
    ]
  },
  {
    topicNumber: 3,
    subtopicNumber: '3.3',
    titleEn: 'Negative & Questions',
    titleHe: 'שלילה ושאלות',
    level: 'beginner',
    orderIndex: 12,
    theoryContentHe: `
<h2>שלילה ושאלות</h2>

<h3>משפטים שליליים:</h3>
<div class="formula">
  <strong>Subject + am/is/are + not + verb-ing</strong>
</div>

<div class="examples">
  <p>I <strong>am not</strong> playing.</p>
  <p>She <strong>isn't</strong> watching TV.</p>
  <p>They <strong>aren't</strong> working.</p>
</div>

<h3>שאלות:</h3>
<div class="formula">
  <strong>Am/Is/Are + subject + verb-ing?</strong>
</div>

<div class="examples">
  <p><strong>Are</strong> you playing?</p>
  <p><strong>Is</strong> she watching TV?</p>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'She _______ watching TV.',
        options: ["isn't", "aren't", "don't", "doesn't"],
        correctAnswer: "isn't",
        explanationHe: 'עם she משתמשים ב-isn\'t',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: '_______ you playing?',
        correctAnswer: 'Are',
        explanationHe: 'בשאלה עם you: Are you...?',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'They _______ working.',
        options: ["isn't", "aren't", "don't", "doesn't"],
        correctAnswer: "aren't",
        explanationHe: 'עם they משתמשים ב-aren\'t',
        difficulty: 'easy'
      }
    ]
  },
  {
    topicNumber: 3,
    subtopicNumber: '3.4',
    titleEn: 'Present Simple vs Progressive',
    titleHe: 'הווה פשוט מול הווה ממושך',
    level: 'beginner',
    orderIndex: 13,
    theoryContentHe: `
<h2>מתי להשתמש בכל זמן?</h2>

<div class="rules">
  <p><strong>הווה פשוט (Present Simple):</strong></p>
  <ul>
    <li>הרגלים - I play football every Sunday</li>
    <li>עובדות - The sun rises in the east</li>
  </ul>

  <p><strong>הווה ממושך (Present Continuous):</strong></p>
  <ul>
    <li>פעולה שקורה עכשיו - I am playing football now</li>
    <li>פעולה זמנית - She is studying this week</li>
  </ul>
</div>

<div class="examples">
  <p>I play football. (הרגל)</p>
  <p>I am playing football. (עכשיו)</p>

  <p>She works here. (קבוע)</p>
  <p>She is working now. (עכשיו)</p>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'I _______ football every Sunday.',
        options: ['play', 'am playing', 'plays', 'playing'],
        correctAnswer: 'play',
        explanationHe: 'הרגל - משתמשים בהווה פשוט',
        difficulty: 'medium'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'She _______ TV now.',
        options: ['watch', 'watches', 'is watching', 'watching'],
        correctAnswer: 'is watching',
        explanationHe: 'עכשיו - משתמשים בהווה ממושך',
        difficulty: 'medium'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'They usually _______ (go) to school by bus.',
        correctAnswer: 'go',
        explanationHe: 'usually מציין הרגל - הווה פשוט',
        difficulty: 'medium'
      }
    ]
  },

  // ==================== TOPIC 4: GRAMMAR BASICS ====================
  {
    topicNumber: 4,
    subtopicNumber: '4.1',
    titleEn: 'Imperatives',
    titleHe: 'ציווי',
    level: 'beginner',
    orderIndex: 14,
    theoryContentHe: `
<h2>ציווי (Imperatives)</h2>

<p>משתמשים לבקשות, הוראות וצווים</p>

<div class="rules">
  <p><strong>ציווי חיובי - פועל בצורת הבסיס:</strong></p>
  <ul>
    <li><strong>Go</strong> home!</li>
    <li><strong>Sit</strong> down!</li>
    <li><strong>Open</strong> the door!</li>
  </ul>

  <p><strong>ציווי שלילי - Don't + פועל:</strong></p>
  <ul>
    <li><strong>Don't</strong> run!</li>
    <li><strong>Don't</strong> talk!</li>
    <li><strong>Don't</strong> be late!</li>
  </ul>
</div>

<div class="examples">
  <p><strong>Listen</strong> to me! - הקשב לי!</p>
  <p><strong>Don't</strong> forget your bag! - אל תשכח את התיק!</p>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: '_______ the door!',
        options: ['Open', 'Opens', 'Opening', 'Opened'],
        correctAnswer: 'Open',
        explanationHe: 'בציווי משתמשים בפועל בצורת הבסיס',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: "_______ run! (don't)",
        correctAnswer: "Don't",
        explanationHe: 'ציווי שלילי: Don\'t + verb',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: '_______ your homework!',
        options: ['Do', 'Does', 'Doing', 'Did'],
        correctAnswer: 'Do',
        explanationHe: 'ציווי: Do (עשה)',
        difficulty: 'easy'
      }
    ]
  },
  {
    topicNumber: 4,
    subtopicNumber: '4.2',
    titleEn: 'Possessives',
    titleHe: 'שייכות',
    level: 'beginner',
    orderIndex: 15,
    theoryContentHe: `
<h2>שייכות (Possessives)</h2>

<div class="rules">
  <p><strong>כינויי שייכות:</strong></p>
  <ul>
    <li>I → <strong>my</strong> (שלי)</li>
    <li>you → <strong>your</strong> (שלך)</li>
    <li>he → <strong>his</strong> (שלו)</li>
    <li>she → <strong>her</strong> (שלה)</li>
    <li>it → <strong>its</strong> (שלו/ה - חפץ)</li>
    <li>we → <strong>our</strong> (שלנו)</li>
    <li>they → <strong>their</strong> (שלהם)</li>
  </ul>

  <p><strong>שייכות עם 's:</strong></p>
  <ul>
    <li>John<strong>'s</strong> book (הספר של ג'ון)</li>
    <li>My sister<strong>'s</strong> car (המכונית של אחותי)</li>
  </ul>
</div>

<div class="examples">
  <p>This is <strong>my</strong> book. - זה הספר שלי</p>
  <p><strong>Her</strong> name is Mary. - השם שלה מרי</p>
  <p>That's John<strong>'s</strong> car. - זאת המכונית של ג'ון</p>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'This is _______ book. (I)',
        options: ['my', 'me', 'I', 'mine'],
        correctAnswer: 'my',
        explanationHe: 'I → my (שלי)',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: "That's John_______ car.",
        correctAnswer: "'s",
        explanationHe: 'שייכות: John\'s car',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: '_______ name is Mary. (she)',
        options: ['She', 'Her', 'Hers', 'His'],
        correctAnswer: 'Her',
        explanationHe: 'she → her (שלה)',
        difficulty: 'easy'
      }
    ]
  },
  {
    topicNumber: 4,
    subtopicNumber: '4.3',
    titleEn: 'Articles',
    titleHe: 'תווי יידוע',
    level: 'beginner',
    orderIndex: 16,
    theoryContentHe: `
<h2>תווי יידוע (Articles)</h2>

<div class="rules">
  <p><strong>a/an - תו יידוע בלתי מוגדר:</strong></p>
  <ul>
    <li><strong>a</strong> - לפני עיצור: a book, a car</li>
    <li><strong>an</strong> - לפני תנועה: an apple, an hour</li>
  </ul>

  <p><strong>the - תו יידוע מוגדר:</strong></p>
  <ul>
    <li>דבר מוגדר/ספציפי: <strong>the</strong> book (הספר)</li>
  </ul>
</div>

<div class="examples">
  <p>I have <strong>a</strong> dog. - יש לי כלב (לא מוגדר)</p>
  <p><strong>The</strong> dog is big. - הכלב גדול (מוגדר)</p>
  <p>She is <strong>an</strong> engineer. - היא מהנדסת</p>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'I have _______ book.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'a',
        explanationHe: 'book מתחיל בעיצור: a book',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'She is _______ engineer.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'an',
        explanationHe: 'engineer מתחיל בתנועה: an engineer',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: '_______ sun is bright. (the)',
        correctAnswer: 'The',
        explanationHe: 'דבר ספציפי/מוגדר: the sun',
        difficulty: 'easy'
      }
    ]
  },
  {
    topicNumber: 4,
    subtopicNumber: '4.4',
    titleEn: 'Pronouns',
    titleHe: 'כינויי גוף',
    level: 'beginner',
    orderIndex: 17,
    theoryContentHe: `
<h2>כינויי גוף (Pronouns)</h2>

<div class="rules">
  <p><strong>כינויי נושא (Subject Pronouns):</strong></p>
  <ul>
    <li><strong>I</strong> - אני</li>
    <li><strong>you</strong> - אתה/את</li>
    <li><strong>he</strong> - הוא</li>
    <li><strong>she</strong> - היא</li>
    <li><strong>it</strong> - זה/זאת (חפץ/חיה)</li>
    <li><strong>we</strong> - אנחנו</li>
    <li><strong>they</strong> - הם/הן</li>
  </ul>

  <p><strong>כינויי מושא (Object Pronouns):</strong></p>
  <ul>
    <li><strong>me</strong> - אותי</li>
    <li><strong>you</strong> - אותך</li>
    <li><strong>him</strong> - אותו</li>
    <li><strong>her</strong> - אותה</li>
    <li><strong>us</strong> - אותנו</li>
    <li><strong>them</strong> - אותם/ן</li>
  </ul>
</div>

<div class="examples">
  <p><strong>I</strong> like pizza. - אני אוהב פיצה</p>
  <p>She loves <strong>me</strong>. - היא אוהבת אותי</p>
  <p><strong>They</strong> are students. - הם תלמידים</p>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: '_______ am a student.',
        options: ['I', 'Me', 'My', 'Mine'],
        correctAnswer: 'I',
        explanationHe: 'כינוי נושא: I',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'She loves _______. (I)',
        options: ['I', 'me', 'my', 'mine'],
        correctAnswer: 'me',
        explanationHe: 'כינוי מושא: me (אותי)',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: '_______ are students. (they)',
        correctAnswer: 'They',
        explanationHe: 'כינוי נושא: They',
        difficulty: 'easy'
      }
    ]
  }
];

// Seeding function
async function seedLessons() {
  console.log('🌱 Starting comprehensive lesson seeding...\n');

  try {
    await pool.query('BEGIN');

    for (const lessonData of lessonsData) {
      console.log(`Creating lesson ${lessonData.subtopicNumber}: ${lessonData.titleHe} (${lessonData.titleEn})...`);

      // Create the lesson
      const lesson = await Lesson.create({
        topicNumber: lessonData.topicNumber,
        subtopicNumber: lessonData.subtopicNumber,
        titleEn: lessonData.titleEn,
        titleHe: lessonData.titleHe,
        level: lessonData.level,
        orderIndex: lessonData.orderIndex,
        theoryContentHe: lessonData.theoryContentHe
      });

      // Create exercises for this lesson
      for (const exerciseData of lessonData.exercises) {
        await Exercise.create({
          lessonId: lesson.id,
          questionNumber: exerciseData.questionNumber,
          type: exerciseData.type,
          questionTextHe: exerciseData.questionTextHe,
          options: exerciseData.options,
          correctAnswer: exerciseData.correctAnswer,
          explanationHe: exerciseData.explanationHe,
          difficulty: exerciseData.difficulty
        });
      }

      console.log(`✅ Created lesson ${lessonData.subtopicNumber} with ${lessonData.exercises.length} exercises\n`);
    }

    await pool.query('COMMIT');
    console.log('✅ All lessons seeded successfully!');
    console.log(`\nSummary:`);
    console.log(`- Topic 1 (Present Simple): 5 subtopics`);
    console.log(`- Topic 2 (Past Simple): 4 subtopics`);
    console.log(`- Topic 3 (Present Continuous): 4 subtopics`);
    console.log(`- Topic 4 (Grammar Basics): 4 subtopics`);
    console.log(`- Total: 17 subtopics created`);

  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    // Only close pool if running standalone
    if (require.main === module) {
      await pool.end();
    }
  }
}

// Run seeding if executed directly
if (require.main === module) {
  seedLessons()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { lessonsData, seedLessons };
