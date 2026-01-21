const { pool } = require('../../config/database');
const Lesson = require('../../models/Lesson');
const Exercise = require('../../models/Exercise');

// Topic 9: Present Simple Tense (זמן הווה פשוט)
const lessonsData = [
  // ==================== SUBTOPIC 9.1: Introduction to Present Simple ====================
  {
    topicNumber: 9,
    subtopicNumber: '9.1',
    titleEn: 'Introduction to Present Simple',
    titleHe: 'מבוא להווה פשוט',
    level: 'beginner',
    orderIndex: 1,
    theoryContentHe: `
<h2>מבוא לזמן הווה פשוט (Present Simple)</h2>

<p>זמן הווה פשוט הוא אחד הזמנים הבסיסיים והחשובים ביותר באנגלית.</p>

<div class="rules">
  <p><strong>מתי משתמשים בהווה פשוט?</strong></p>
  <ul>
    <li><strong>הרגלים ושגרה:</strong> פעולות שאנחנו עושים באופן קבוע</li>
    <li><strong>עובדות ואמיתות כלליות:</strong> דברים שתמיד נכונים</li>
    <li><strong>מצבים קבועים:</strong> מצב שלא משתנה</li>
    <li><strong>לוחות זמנים:</strong> רכבות, אוטובוסים, סרטים</li>
  </ul>
</div>

<div class="examples">
  <p><strong>הרגלים ושגרה:</strong></p>
  <p>I wake up at 7 AM every day. - אני קם ב-7 בבוקר כל יום</p>
  <p>She drinks coffee in the morning. - היא שותה קפה בבוקר</p>
  <p>We go to school by bus. - אנחנו נוסעים לבית הספר באוטובוס</p>

  <p><strong>עובדות ואמיתות:</strong></p>
  <p>The sun rises in the east. - השמש זורחת במזרח</p>
  <p>Water boils at 100 degrees. - מים רותחים ב-100 מעלות</p>
  <p>Cats like milk. - חתולים אוהבים חלב</p>

  <p><strong>לוחות זמנים:</strong></p>
  <p>The train leaves at 8 PM. - הרכבת יוצאת ב-8 בערב</p>
  <p>The movie starts at 7. - הסרט מתחיל ב-7</p>
</div>

<div class="warning">
  <strong>ביטויי זמן נפוצים (Time Expressions):</strong>
  <ul>
    <li>always (תמיד), usually (בדרך כלל), often (לעתים קרובות)</li>
    <li>sometimes (לפעמים), rarely (לעתים רחוקות), never (אף פעם לא)</li>
    <li>every day/week/month/year (כל יום/שבוע/חודש/שנה)</li>
    <li>on Mondays (בימי שני), in the morning (בבוקר)</li>
  </ul>
</div>
    `,
    exercises: [
      // EASY (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'מתי משתמשים בהווה פשוט?',
        options: ['רק לעבר', 'להרגלים ועובדות', 'רק לעתיד', 'רק לפעולות עכשיו'],
        correctAnswer: 'להרגלים ועובדות',
        explanationHe: 'הווה פשוט משמש להרגלים, שגרה, עובדות ואמיתות כלליות.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט הוא הרגל?',
        options: ['I am eating now.', 'I eat breakfast every day.', 'I ate yesterday.', 'I will eat later.'],
        correctAnswer: 'I eat breakfast every day.',
        explanationHe: 'every day = כל יום מציין הרגל. הווה פשוט: I eat.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'The sun _______ in the east. (rises/is rising)',
        correctAnswer: 'rises',
        explanationHe: 'זו עובדה כללית שתמיד נכונה, לכן הווה פשוט: rises.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'איזה ביטוי מציין הרגל?',
        options: ['right now', 'every morning', 'at this moment', 'currently'],
        correctAnswer: 'every morning',
        explanationHe: 'every morning = כל בוקר מציין הרגל ושגרה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'Water _______ at 100 degrees Celsius. (boils/is boiling)',
        correctAnswer: 'boils',
        explanationHe: 'זו עובדה מדעית, לכן הווה פשוט.',
        difficulty: 'easy'
      },
      // MEDIUM (6-10)
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'The train _______ at 6 PM. (leaves/is leaving)',
        options: ['leaves', 'is leaving', 'will leave', 'left'],
        correctAnswer: 'leaves',
        explanationHe: 'לוחות זמנים קבועים משתמשים בהווה פשוט גם לעתיד.',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ to work by bus every day.',
        correctAnswer: 'goes',
        explanationHe: 'every day = הרגל. She + goes (עם s בגוף שלישי).',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'מה ההבדל בין "I work" ו-"I am working"?',
        options: ['אין הבדל', 'I work = הרגל, I am working = עכשיו', 'I work = עכשיו, I am working = הרגל', 'שניהם לעבר'],
        correctAnswer: 'I work = הרגל, I am working = עכשיו',
        explanationHe: 'Present Simple (I work) = הרגל/כללי. Present Continuous (I am working) = עכשיו.',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'The movie _______ at 8 o\'clock tonight. (starts/is starting)',
        correctAnswer: 'starts',
        explanationHe: 'לוחות זמנים (סרטים, הופעות) משתמשים בהווה פשוט.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'I _______ English on Mondays. (study/am studying)',
        options: ['study', 'am studying', 'studied', 'will study'],
        correctAnswer: 'study',
        explanationHe: 'on Mondays = כל יום שני = הרגל, לכן הווה פשוט.',
        difficulty: 'medium'
      },
      // HARD (11-20)
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'I _______ what you mean. (understand/am understanding)',
        options: ['understand', 'am understanding', 'understood', 'will understand'],
        correctAnswer: 'understand',
        explanationHe: 'understand הוא פועל סטטי (stative verb) שלא משתמש ב-continuous.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'He rarely _______ TV. (watches/is watching)',
        correctAnswer: 'watches',
        explanationHe: 'rarely = לעתים רחוקות = תדירות, לכן הווה פשוט.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'איזה פועל לא יכול להיות ב-continuous?',
        options: ['run', 'eat', 'know', 'play'],
        correctAnswer: 'know',
        explanationHe: 'know הוא פועל סטטי שמתאר מצב מנטלי, לא פעולה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'The flight _______ at 10 AM tomorrow. (departs/will depart)',
        correctAnswer: 'departs',
        explanationHe: 'לוחות זמנים של טיסות משתמשים בהווה פשוט גם לעתיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'I _______ this coffee tastes strange. (think/am thinking)',
        options: ['think', 'am thinking', 'thought', 'will think'],
        correctAnswer: 'think',
        explanationHe: 'think במשמעות "סבור" הוא סטטי. "I am thinking" = אני חושב/מהרהר (פעולה).',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ three languages. (speaks/is speaking)',
        correctAnswer: 'speaks',
        explanationHe: 'יכולת קבועה = הווה פשוט. "She is speaking" = היא מדברת עכשיו.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'מה נכון? "The Earth _______ around the Sun."',
        options: ['goes', 'is going', 'went', 'will go'],
        correctAnswer: 'goes',
        explanationHe: 'עובדה מדעית קבועה = הווה פשוט.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ you. (believe/am believing)',
        correctAnswer: 'believe',
        explanationHe: 'believe הוא פועל סטטי שלא משתמש ב-continuous.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'מהם שני השימושים העיקריים של הווה פשוט?',
        options: ['עבר ועתיד', 'הרגלים ועובדות', 'פעולות עכשיו ותוכניות', 'בקשות והצעות'],
        correctAnswer: 'הרגלים ועובדות',
        explanationHe: 'הווה פשוט: 1) הרגלים ושגרה 2) עובדות ואמיתות כלליות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'The shop _______ at 9 AM. (opens/is opening)',
        options: ['opens', 'is opening', 'opened', 'will open'],
        correctAnswer: 'opens',
        explanationHe: 'שעות פתיחה קבועות = הווה פשוט.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 9.2: Affirmative Sentences ====================
  {
    topicNumber: 9,
    subtopicNumber: '9.2',
    titleEn: 'Affirmative Sentences',
    titleHe: 'משפטים חיוביים',
    level: 'beginner',
    orderIndex: 2,
    theoryContentHe: `
<h2>משפטים חיוביים בהווה פשוט</h2>

<p>המבנה הבסיסי: Subject + Verb (+ Object)</p>

<div class="rules">
  <p><strong>הכללים:</strong></p>
  <ul>
    <li><strong>I / You / We / They:</strong> פועל בצורת בסיס (ללא שינוי)</li>
    <li><strong>He / She / It:</strong> פועל + s/es/ies</li>
  </ul>

  <p><strong>כללי הוספת s/es/ies:</strong></p>
  <ul>
    <li>רוב הפעלים: + s (play → plays, eat → eats)</li>
    <li>פעלים שמסתיימים ב-s, sh, ch, x, o: + es (watch → watches, go → goes)</li>
    <li>פעלים שמסתיימים בעיצור + y: y → ies (study → studies, fly → flies)</li>
    <li>פעלים שמסתיימים בתנועה + y: + s (play → plays, say → says)</li>
  </ul>
</div>

<div class="examples">
  <p><strong>דוגמאות:</strong></p>
  <table>
    <tr><th>כינוי</th><th>דוגמה</th><th>תרגום</th></tr>
    <tr><td>I</td><td>I <strong>work</strong> every day.</td><td>אני עובד כל יום.</td></tr>
    <tr><td>You</td><td>You <strong>play</strong> football.</td><td>אתה משחק כדורגל.</td></tr>
    <tr><td>He</td><td>He <strong>works</strong> at a bank.</td><td>הוא עובד בבנק.</td></tr>
    <tr><td>She</td><td>She <strong>watches</strong> TV.</td><td>היא צופה בטלוויזיה.</td></tr>
    <tr><td>It</td><td>It <strong>rains</strong> a lot here.</td><td>יורד פה הרבה גשם.</td></tr>
    <tr><td>We</td><td>We <strong>study</strong> English.</td><td>אנחנו לומדים אנגלית.</td></tr>
    <tr><td>They</td><td>They <strong>live</strong> in Tel Aviv.</td><td>הם גרים בתל אביב.</td></tr>
  </table>
</div>

<div class="warning">
  <strong>חריגים חשובים:</strong>
  <ul>
    <li>have → has (He has a car.)</li>
    <li>do → does (She does her homework.)</li>
    <li>go → goes (He goes to school.)</li>
  </ul>
</div>
    `,
    exercises: [
      // EASY (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'I _______ to school every day.',
        options: ['go', 'goes', 'going', 'went'],
        correctAnswer: 'go',
        explanationHe: 'I לוקח את צורת הבסיס: go (ללא s).',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ English. (speak)',
        correctAnswer: 'speaks',
        explanationHe: 'She = גוף שלישי, לכן speak + s = speaks.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'They _______ football on Saturdays.',
        options: ['play', 'plays', 'playing', 'played'],
        correctAnswer: 'play',
        explanationHe: 'They לוקח את צורת הבסיס: play (ללא s).',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ TV every evening. (watch)',
        correctAnswer: 'watches',
        explanationHe: 'He + watch שמסתיים ב-ch = watches (es).',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'We _______ coffee in the morning.',
        options: ['drink', 'drinks', 'drinking', 'drank'],
        correctAnswer: 'drink',
        explanationHe: 'We לוקח את צורת הבסיס: drink.',
        difficulty: 'easy'
      },
      // MEDIUM (6-10)
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ hard for her exams. (study)',
        correctAnswer: 'studies',
        explanationHe: 'study מסתיים בעיצור + y, לכן y → ies: studies.',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'My father _______ to work by car.',
        options: ['go', 'goes', 'going', 'gone'],
        correctAnswer: 'goes',
        explanationHe: 'My father = He, לכן go → goes.',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'The baby _______ a lot. (cry)',
        correctAnswer: 'cries',
        explanationHe: 'The baby = It. cry מסתיים בעיצור + y → cries.',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'Tom _______ three languages.',
        options: ['speak', 'speaks', 'speaking', 'spoken'],
        correctAnswer: 'speaks',
        explanationHe: 'Tom = He, לכן speak + s = speaks.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ a car. (have)',
        correctAnswer: 'has',
        explanationHe: 'have הוא חריג: have → has בגוף שלישי.',
        difficulty: 'medium'
      },
      // HARD (11-20)
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'The bird _______ beautifully.',
        options: ['sing', 'sings', 'singing', 'sang'],
        correctAnswer: 'sings',
        explanationHe: 'The bird = It, לכן sing + s = sings.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'My sister _______ her homework every day. (do)',
        correctAnswer: 'does',
        explanationHe: 'do הוא חריג: do → does בגוף שלישי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'The cat _______ on the sofa.',
        options: ['sleep', 'sleeps', 'sleeping', 'slept'],
        correctAnswer: 'sleeps',
        explanationHe: 'The cat = It, לכן sleep + s = sleeps.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ the dishes after dinner. (wash)',
        correctAnswer: 'washes',
        explanationHe: 'wash מסתיים ב-sh, לכן + es = washes.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'The sun _______ every morning.',
        options: ['rise', 'rises', 'rising', 'rose'],
        correctAnswer: 'rises',
        explanationHe: 'The sun = It, לכן rise + s = rises.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ to music while working. (listen)',
        correctAnswer: 'listens',
        explanationHe: 'She = גוף שלישי, לכן listen + s = listens.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'My brother _______ karate.',
        options: ['teach', 'teaches', 'teaching', 'taught'],
        correctAnswer: 'teaches',
        explanationHe: 'My brother = He. teach מסתיים ב-ch → teaches.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'The bus _______ at 8 AM. (arrive)',
        correctAnswer: 'arrives',
        explanationHe: 'The bus = It, לכן arrive + s = arrives.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'She _______ yoga every morning.',
        options: ['practice', 'practices', 'practicing', 'practiced'],
        correctAnswer: 'practices',
        explanationHe: 'She + practice = practices.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ the bus to school. (miss)',
        correctAnswer: 'misses',
        explanationHe: 'miss מסתיים ב-ss, לכן + es = misses.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 9.3: Negative Sentences ====================
  {
    topicNumber: 9,
    subtopicNumber: '9.3',
    titleEn: 'Negative Sentences',
    titleHe: 'משפטים שליליים',
    level: 'beginner',
    orderIndex: 3,
    theoryContentHe: `
<h2>משפטים שליליים בהווה פשוט</h2>

<p>המבנה: Subject + do/does + not + base verb</p>

<div class="rules">
  <p><strong>הכללים:</strong></p>
  <ul>
    <li><strong>I / You / We / They:</strong> do not (don't) + פועל בסיס</li>
    <li><strong>He / She / It:</strong> does not (doesn't) + פועל בסיס</li>
  </ul>
  <p><strong>חשוב מאוד:</strong> הפועל חוזר לצורת בסיס אחרי don't/doesn't!</p>
</div>

<div class="examples">
  <p><strong>דוגמאות:</strong></p>
  <table>
    <tr><th>חיובי</th><th>שלילי</th></tr>
    <tr><td>I <strong>like</strong> coffee.</td><td>I <strong>don't like</strong> coffee.</td></tr>
    <tr><td>You <strong>play</strong> tennis.</td><td>You <strong>don't play</strong> tennis.</td></tr>
    <tr><td>He <strong>works</strong> here.</td><td>He <strong>doesn't work</strong> here.</td></tr>
    <tr><td>She <strong>eats</strong> meat.</td><td>She <strong>doesn't eat</strong> meat.</td></tr>
    <tr><td>We <strong>live</strong> in Tel Aviv.</td><td>We <strong>don't live</strong> in Tel Aviv.</td></tr>
    <tr><td>They <strong>speak</strong> French.</td><td>They <strong>don't speak</strong> French.</td></tr>
  </table>
</div>

<div class="warning">
  <strong>טעות נפוצה:</strong>
  <ul>
    <li>He doesn't <strong>works</strong>. ← שגוי!</li>
    <li>He doesn't <strong>work</strong>. ← נכון! (הפועל בצורת בסיס)</li>
  </ul>
</div>
    `,
    exercises: [
      // EASY (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'I _______ coffee. (לא אוהב)',
        options: ["don't like", "doesn't like", "not like", "don't likes"],
        correctAnswer: "don't like",
        explanationHe: "I + don't + פועל בסיס = don't like.",
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ meat. (לא אוכלת)',
        correctAnswer: "doesn't eat",
        explanationHe: "She + doesn't + פועל בסיס = doesn't eat.",
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'They _______ French.',
        options: ["don't speak", "doesn't speak", "not speak", "don't speaks"],
        correctAnswer: "don't speak",
        explanationHe: "They + don't + פועל בסיס = don't speak.",
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ here. (לא עובד)',
        correctAnswer: "doesn't work",
        explanationHe: "He + doesn't + פועל בסיס = doesn't work (לא works!).",
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'We _______ TV in the morning.',
        options: ["don't watch", "doesn't watch", "not watch", "don't watches"],
        correctAnswer: "don't watch",
        explanationHe: "We + don't + פועל בסיס = don't watch.",
        difficulty: 'easy'
      },
      // MEDIUM (6-10)
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'My sister _______ English.',
        options: ["don't speak", "doesn't speak", "doesn't speaks", "not speaks"],
        correctAnswer: "doesn't speak",
        explanationHe: "My sister = She, לכן doesn't + speak (לא speaks!).",
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'Tom _______ to school by bus. (לא הולך)',
        correctAnswer: "doesn't go",
        explanationHe: "Tom = He, לכן doesn't + go.",
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ["He doesn't works.", "He doesn't work.", "He don't work.", "He not work."],
        correctAnswer: "He doesn't work.",
        explanationHe: "אחרי doesn't הפועל חוזר לצורת בסיס: work (לא works).",
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'My parents _______ meat. (לא אוכלים)',
        correctAnswer: "don't eat",
        explanationHe: "My parents = They, לכן don't + eat.",
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'The cat _______ milk.',
        options: ["don't drink", "doesn't drink", "doesn't drinks", "not drink"],
        correctAnswer: "doesn't drink",
        explanationHe: "The cat = It, לכן doesn't + drink.",
        difficulty: 'medium'
      },
      // HARD (11-20)
      {
        questionNumber: 11,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ a car. (אין לה)',
        correctAnswer: "doesn't have",
        explanationHe: "She + doesn't + have (לא has!).",
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: 'מה הטעות? "She don\'t like pizza."',
        options: ["don't צריך להיות doesn't", "like צריך להיות likes", "pizza צריך the", "אין טעות"],
        correctAnswer: "don't צריך להיות doesn't",
        explanationHe: "She = גוף שלישי, לכן צריך doesn't (לא don't).",
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'fill_in_blank',
        questionTextHe: 'My brother _______ his homework. (לא עושה)',
        correctAnswer: "doesn't do",
        explanationHe: "My brother = He, לכן doesn't + do.",
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'multiple_choice',
        questionTextHe: 'מה נכון?',
        options: ["He doesn't goes.", "He doesn't go.", "He don't go.", "He not goes."],
        correctAnswer: "He doesn't go.",
        explanationHe: "doesn't + פועל בסיס = doesn't go.",
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'fill_in_blank',
        questionTextHe: 'The children _______ vegetables. (לא אוהבים)',
        correctAnswer: "don't like",
        explanationHe: "The children = They, לכן don't + like.",
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'תרגם: "היא לא לומדת צרפתית."',
        options: ["She don't study French.", "She doesn't studies French.", "She doesn't study French.", "She not study French."],
        correctAnswer: "She doesn't study French.",
        explanationHe: "She + doesn't + study (צורת בסיס).",
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'It _______ rain much in summer. (לא יורד)',
        correctAnswer: "doesn't",
        explanationHe: "It + doesn't + rain.",
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'The shop _______ on Sundays.',
        options: ["don't open", "doesn't open", "doesn't opens", "not open"],
        correctAnswer: "doesn't open",
        explanationHe: "The shop = It, לכן doesn't + open.",
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: 'My father _______ alcohol. (לא שותה)',
        correctAnswer: "doesn't drink",
        explanationHe: "My father = He, לכן doesn't + drink.",
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'למה הפועל חוזר לצורת בסיס אחרי doesn\'t?',
        options: ["כי doesn't כבר מכיל את ה-s", "כי זה שלילי", "כי זה הווה פשוט", "אין סיבה"],
        correctAnswer: "כי doesn't כבר מכיל את ה-s",
        explanationHe: "does כבר מראה גוף שלישי, לכן הפועל לא צריך s נוספת.",
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 9.4: Yes/No Questions ====================
  {
    topicNumber: 9,
    subtopicNumber: '9.4',
    titleEn: 'Yes/No Questions',
    titleHe: 'שאלות כן/לא',
    level: 'beginner',
    orderIndex: 4,
    theoryContentHe: `
<h2>שאלות כן/לא בהווה פשוט</h2>

<p>המבנה: Do/Does + Subject + base verb?</p>

<div class="rules">
  <p><strong>הכללים:</strong></p>
  <ul>
    <li><strong>Do + I / you / we / they + פועל בסיס?</strong></li>
    <li><strong>Does + he / she / it + פועל בסיס?</strong></li>
  </ul>
</div>

<div class="examples">
  <p><strong>דוגמאות:</strong></p>
  <table>
    <tr><th>שאלה</th><th>תשובה קצרה - כן</th><th>תשובה קצרה - לא</th></tr>
    <tr><td><strong>Do</strong> you like pizza?</td><td>Yes, I do.</td><td>No, I don't.</td></tr>
    <tr><td><strong>Do</strong> they live here?</td><td>Yes, they do.</td><td>No, they don't.</td></tr>
    <tr><td><strong>Does</strong> he work here?</td><td>Yes, he does.</td><td>No, he doesn't.</td></tr>
    <tr><td><strong>Does</strong> she speak English?</td><td>Yes, she does.</td><td>No, she doesn't.</td></tr>
  </table>
</div>

<div class="warning">
  <strong>טעויות נפוצות:</strong>
  <ul>
    <li>Does he <strong>works</strong>? ← שגוי!</li>
    <li>Does he <strong>work</strong>? ← נכון!</li>
    <li>Do he work? ← שגוי! (he צריך does)</li>
  </ul>
</div>
    `,
    exercises: [
      // EASY (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: '_______ you like pizza?',
        options: ['Do', 'Does', 'Is', 'Are'],
        correctAnswer: 'Do',
        explanationHe: 'you לוקח Do בשאלות הווה פשוט.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: '_______ she speak English?',
        correctAnswer: 'Does',
        explanationHe: 'she לוקח Does בשאלות.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: '_______ they live in Tel Aviv?',
        options: ['Do', 'Does', 'Is', 'Are'],
        correctAnswer: 'Do',
        explanationHe: 'they לוקח Do בשאלות.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: '_______ he play football?',
        correctAnswer: 'Does',
        explanationHe: 'he לוקח Does בשאלות.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'Do you like coffee? - Yes, _______.',
        options: ['I do', 'I am', 'I like', 'do I'],
        correctAnswer: 'I do',
        explanationHe: 'תשובה קצרה לשאלת Do: Yes, I do. / No, I don\'t.',
        difficulty: 'easy'
      },
      // MEDIUM (6-10)
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: '_______ your sister work here?',
        options: ['Do', 'Does', 'Is', 'Are'],
        correctAnswer: 'Does',
        explanationHe: 'your sister = she, לכן Does.',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'Does Tom play tennis? - No, he _______.',
        correctAnswer: "doesn't",
        explanationHe: "תשובה שלילית לשאלת Does: No, he doesn't.",
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['Does he works here?', 'Does he work here?', 'Do he work here?', 'Does he working here?'],
        correctAnswer: 'Does he work here?',
        explanationHe: 'Does + נושא + פועל בסיס (work, לא works).',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: '_______ the children like vegetables?',
        correctAnswer: 'Do',
        explanationHe: 'the children = they, לכן Do.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'Does she have a car? - Yes, _______.',
        options: ['she does', 'she has', 'she do', 'does she'],
        correctAnswer: 'she does',
        explanationHe: 'תשובה קצרה: Yes, she does. (לא Yes, she has.)',
        difficulty: 'medium'
      },
      // HARD (11-20)
      {
        questionNumber: 11,
        type: 'fill_in_blank',
        questionTextHe: '_______ it rain a lot here?',
        correctAnswer: 'Does',
        explanationHe: 'it לוקח Does בשאלות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: 'מה הטעות? "Do she likes pizza?"',
        options: ['Do צריך להיות Does', 'likes צריך להיות like', 'שתי הטעויות', 'אין טעות'],
        correctAnswer: 'שתי הטעויות',
        explanationHe: 'she צריכה Does, והפועל צריך להיות בצורת בסיס: Does she like pizza?',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'fill_in_blank',
        questionTextHe: '_______ your parents speak English?',
        correctAnswer: 'Do',
        explanationHe: 'your parents = they, לכן Do.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'multiple_choice',
        questionTextHe: 'Does the bus stop here? - No, _______.',
        options: ['it does', "it doesn't", 'it not', 'does it'],
        correctAnswer: "it doesn't",
        explanationHe: "תשובה שלילית: No, it doesn't.",
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'fill_in_blank',
        questionTextHe: '_______ she go to school on Saturdays?',
        correctAnswer: 'Does',
        explanationHe: 'she לוקח Does + go (צורת בסיס).',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'תרגם: "האם הם גרים כאן?"',
        options: ['Does they live here?', 'Do they live here?', 'Are they live here?', 'Do they lives here?'],
        correctAnswer: 'Do they live here?',
        explanationHe: 'they לוקח Do + פועל בסיס.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: '_______ your dog eat meat?',
        correctAnswer: 'Does',
        explanationHe: 'your dog = it, לכן Does.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'Do you work here? - Yes, I _______.',
        options: ['work', 'do', 'am', 'does'],
        correctAnswer: 'do',
        explanationHe: 'תשובה קצרה עם פועל העזר: Yes, I do.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: '_______ Mary have any brothers?',
        correctAnswer: 'Does',
        explanationHe: 'Mary = she, לכן Does + have (צורת בסיס).',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'למה אומרים "Does he work?" ולא "Does he works?"',
        options: ['כי does כבר מכיל את ה-s', 'כי work הוא חריג', 'כי זו שאלה', 'אין סיבה'],
        correctAnswer: 'כי does כבר מכיל את ה-s',
        explanationHe: 'does מראה גוף שלישי, לכן הפועל נשאר בצורת בסיס.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 9.5: Wh- Questions ====================
  {
    topicNumber: 9,
    subtopicNumber: '9.5',
    titleEn: 'Wh- Questions',
    titleHe: 'שאלות מידע',
    level: 'beginner',
    orderIndex: 5,
    theoryContentHe: `
<h2>שאלות מידע (Wh- Questions)</h2>

<p>המבנה: Wh-word + do/does + Subject + base verb?</p>

<div class="rules">
  <p><strong>מילות השאלה:</strong></p>
  <ul>
    <li><strong>What</strong> - מה? (What do you do? = מה אתה עושה/מה המקצוע שלך?)</li>
    <li><strong>Where</strong> - איפה? (Where do you live?)</li>
    <li><strong>When</strong> - מתי? (When does the movie start?)</li>
    <li><strong>Why</strong> - למה? (Why do you study English?)</li>
    <li><strong>How</strong> - איך? (How do you go to work?)</li>
    <li><strong>Who</strong> - מי? (Who do you like? / Who likes you?)</li>
    <li><strong>Which</strong> - איזה? (Which book do you prefer?)</li>
  </ul>
</div>

<div class="examples">
  <p><strong>דוגמאות:</strong></p>
  <p><strong>What</strong> do you do? - מה אתה עושה (בחיים/מקצוע)?</p>
  <p><strong>Where</strong> does she live? - איפה היא גרה?</p>
  <p><strong>When</strong> do they arrive? - מתי הם מגיעים?</p>
  <p><strong>Why</strong> does he study English? - למה הוא לומד אנגלית?</p>
  <p><strong>How</strong> do you get to work? - איך אתה מגיע לעבודה?</p>
</div>

<div class="warning">
  <strong>שאלות עם Who:</strong>
  <ul>
    <li><strong>Who</strong> do you love? - את מי אתה אוהב? (who = מושא)</li>
    <li><strong>Who</strong> loves you? - מי אוהב אותך? (who = נושא, אין do)</li>
  </ul>
</div>
    `,
    exercises: [
      // EASY (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: '_______ do you live?',
        options: ['What', 'Where', 'When', 'Why'],
        correctAnswer: 'Where',
        explanationHe: 'Where = איפה. שואלים על מקום.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: '_______ does the movie start?',
        correctAnswer: 'When',
        explanationHe: 'When = מתי. שואלים על זמן.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: '_______ do you do? (מקצוע)',
        options: ['What', 'Where', 'When', 'How'],
        correctAnswer: 'What',
        explanationHe: 'What do you do? = מה המקצוע שלך?',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: '_______ do you study English? (למה)',
        correctAnswer: 'Why',
        explanationHe: 'Why = למה. שואלים על סיבה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: '_______ do you get to work?',
        options: ['What', 'Where', 'When', 'How'],
        correctAnswer: 'How',
        explanationHe: 'How = איך. שואלים על אופן/דרך.',
        difficulty: 'easy'
      },
      // MEDIUM (6-10)
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'Where _______ she work?',
        options: ['do', 'does', 'is', 'are'],
        correctAnswer: 'does',
        explanationHe: 'she לוקח does בשאלות הווה פשוט.',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'What time _______ the bus arrive?',
        correctAnswer: 'does',
        explanationHe: 'the bus = it, לכן does.',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'Why _______ you like this movie?',
        options: ['do', 'does', 'is', 'are'],
        correctAnswer: 'do',
        explanationHe: 'you לוקח do בשאלות.',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'How often _______ he go to the gym?',
        correctAnswer: 'does',
        explanationHe: 'he לוקח does בשאלות.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'Which book _______ you prefer?',
        options: ['do', 'does', 'is', 'are'],
        correctAnswer: 'do',
        explanationHe: 'you לוקח do.',
        difficulty: 'medium'
      },
      // HARD (11-20)
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'Who _______ you? (מי אוהב אותך)',
        options: ['do love', 'does love', 'love', 'loves'],
        correctAnswer: 'loves',
        explanationHe: 'כש-Who הוא הנושא, אין צורך ב-do/does: Who loves you?',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'What _______ she do on weekends?',
        correctAnswer: 'does',
        explanationHe: 'she לוקח does.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'מה ההבדל בין "Who do you love?" ו-"Who loves you?"',
        options: ['אין הבדל', 'הראשון: את מי אתה אוהב, השני: מי אוהב אותך', 'הראשון שגוי', 'השני שגוי'],
        correctAnswer: 'הראשון: את מי אתה אוהב, השני: מי אוהב אותך',
        explanationHe: 'Who do you love? = who מושא. Who loves you? = who נושא.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'How many languages _______ she speak?',
        correctAnswer: 'does',
        explanationHe: 'she לוקח does.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'Who _______ you work with?',
        options: ['do', 'does', '-', 'are'],
        correctAnswer: 'do',
        explanationHe: 'Who do you work with? = עם מי אתה עובד? (who = מושא של with)',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'Where _______ your parents live?',
        correctAnswer: 'do',
        explanationHe: 'your parents = they, לכן do.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'What _______ this word mean?',
        options: ['do', 'does', 'is', 'are'],
        correctAnswer: 'does',
        explanationHe: 'this word = it, לכן does.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'Which team _______ (win) more often?',
        correctAnswer: 'wins',
        explanationHe: 'Which team = who/what כנושא, לכן הפועל עם s: Which team wins?',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'תרגם: "למה הוא לומד יפנית?"',
        options: ['Why he studies Japanese?', 'Why does he study Japanese?', 'Why does he studies Japanese?', 'Why do he study Japanese?'],
        correctAnswer: 'Why does he study Japanese?',
        explanationHe: 'Why + does + he + study (צורת בסיס).',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'What time _______ the sun rise?',
        options: ['do', 'does', 'is', '-'],
        correctAnswer: 'does',
        explanationHe: 'the sun = it, לכן does.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 9.6: Frequency Adverbs ====================
  {
    topicNumber: 9,
    subtopicNumber: '9.6',
    titleEn: 'Frequency Adverbs',
    titleHe: 'תארי תדירות',
    level: 'beginner',
    orderIndex: 6,
    theoryContentHe: `
<h2>תארי תדירות (Frequency Adverbs)</h2>

<p>תארי תדירות מתארים כמה פעמים משהו קורה.</p>

<div class="rules">
  <p><strong>תארי התדירות העיקריים (מ-100% ל-0%):</strong></p>
  <ul>
    <li><strong>always</strong> (100%) - תמיד</li>
    <li><strong>usually</strong> (80%) - בדרך כלל</li>
    <li><strong>often</strong> (60%) - לעתים קרובות</li>
    <li><strong>sometimes</strong> (40%) - לפעמים</li>
    <li><strong>rarely / seldom</strong> (20%) - לעתים רחוקות</li>
    <li><strong>never</strong> (0%) - אף פעם לא</li>
  </ul>

  <p><strong>מיקום במשפט:</strong></p>
  <ul>
    <li>לפני הפועל הראשי: I <strong>always</strong> eat breakfast.</li>
    <li>אחרי am/is/are: She <strong>is always</strong> late.</li>
  </ul>
</div>

<div class="examples">
  <p><strong>דוגמאות:</strong></p>
  <p>I <strong>always</strong> wake up at 7 AM. - אני תמיד קם ב-7</p>
  <p>She <strong>usually</strong> eats lunch at school. - היא בדרך כלל אוכלת צהריים בבית הספר</p>
  <p>They <strong>often</strong> play football on Saturdays. - הם לעתים קרובות משחקים כדורגל בשבתות</p>
  <p>He <strong>sometimes</strong> watches TV. - הוא לפעמים צופה בטלוויזיה</p>
  <p>We <strong>rarely</strong> eat out. - אנחנו לעתים רחוקות אוכלים בחוץ</p>
  <p>I <strong>never</strong> drink coffee. - אני אף פעם לא שותה קפה</p>
</div>

<div class="warning">
  <strong>שים לב:</strong>
  <ul>
    <li>never כבר שלילי - לא צריך don't: I never go (לא: I don't never go)</li>
    <li>עם am/is/are - התואר בא אחרי: He is always happy.</li>
  </ul>
</div>
    `,
    exercises: [
      // EASY (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'I _______ eat breakfast at 7 AM. (תמיד)',
        options: ['always', 'never', 'sometimes', 'rarely'],
        correctAnswer: 'always',
        explanationHe: 'always = תמיד (100%).',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ drinks coffee. (אף פעם לא)',
        correctAnswer: 'never',
        explanationHe: 'never = אף פעם לא (0%).',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'He _______ goes to the gym. (לפעמים)',
        options: ['always', 'never', 'sometimes', 'rarely'],
        correctAnswer: 'sometimes',
        explanationHe: 'sometimes = לפעמים (40%).',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ play tennis on Sundays. (בדרך כלל)',
        correctAnswer: 'usually',
        explanationHe: 'usually = בדרך כלל (80%).',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'איפה שמים את תואר התדירות?',
        options: ['בסוף המשפט', 'לפני הפועל הראשי', 'בתחילת המשפט בלבד', 'אחרי המושא'],
        correctAnswer: 'לפני הפועל הראשי',
        explanationHe: 'תואר התדירות בא לפני הפועל: I always eat...',
        difficulty: 'easy'
      },
      // MEDIUM (6-10)
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'She is _______ late to class.',
        options: ['always', 'always is', 'is always', 'late always'],
        correctAnswer: 'always',
        explanationHe: 'עם am/is/are: She is always late (תואר אחרי is).',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ eat out. (לעתים רחוקות)',
        correctAnswer: 'rarely',
        explanationHe: 'rarely / seldom = לעתים רחוקות (20%).',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['I always am happy.', 'I am always happy.', 'Always I am happy.', 'I am happy always.'],
        correctAnswer: 'I am always happy.',
        explanationHe: 'עם am/is/are תואר התדירות בא אחרי: am always.',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ visit their grandparents. (לעתים קרובות)',
        correctAnswer: 'often',
        explanationHe: 'often = לעתים קרובות (60%).',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'He _______ works on weekends.',
        options: ['never', 'don\'t never', 'doesn\'t never', 'not never'],
        correctAnswer: 'never',
        explanationHe: 'never כבר שלילי - לא צריך don\'t/doesn\'t.',
        difficulty: 'medium'
      },
      // HARD (11-20)
      {
        questionNumber: 11,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ eats meat. She\'s a vegetarian.',
        correctAnswer: 'never',
        explanationHe: 'צמחונית לא אוכלת בשר = never eats.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: 'מהו הסדר הנכון (מגבוה לנמוך)?',
        options: ['always, usually, often, sometimes, rarely, never', 'never, rarely, sometimes, often, usually, always', 'always, often, usually, sometimes, rarely, never', 'usually, always, often, sometimes, rarely, never'],
        correctAnswer: 'always, usually, often, sometimes, rarely, never',
        explanationHe: 'מ-100% ל-0%: always (100%) → usually (80%) → often (60%) → sometimes (40%) → rarely (20%) → never (0%).',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'fill_in_blank',
        questionTextHe: 'Do you ever eat fast food? - No, I _______ eat fast food.',
        correctAnswer: 'never',
        explanationHe: 'תשובה שלילית מוחלטת עם never.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'multiple_choice',
        questionTextHe: 'מה הטעות? "I don\'t never eat meat."',
        options: ['don\'t ו-never ביחד = כפל שלילה', 'never במקום הלא נכון', 'eat צריך להיות eats', 'אין טעות'],
        correctAnswer: 'don\'t ו-never ביחד = כפל שלילה',
        explanationHe: 'never כבר שלילי. נכון: I never eat meat.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'fill_in_blank',
        questionTextHe: 'He is _______ happy. He smiles all the time.',
        correctAnswer: 'always',
        explanationHe: 'מחייך כל הזמן = always happy.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'איפה שמים sometimes?',
        options: ['רק לפני הפועל', 'רק בתחילת המשפט', 'רק בסוף המשפט', 'בכל שלושת המקומות'],
        correctAnswer: 'בכל שלושת המקומות',
        explanationHe: 'sometimes גמיש: Sometimes I... / I sometimes... / I work sometimes.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ see each other. We live far apart.',
        correctAnswer: 'rarely',
        explanationHe: 'גרים רחוק = נפגשים לעתים רחוקות = rarely.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'She _______ late. She\'s very punctual.',
        options: ['is never', 'never is', 'is always not', 'doesn\'t never'],
        correctAnswer: 'is never',
        explanationHe: 'עם is: She is never late.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: 'How _______ do you exercise? - Three times a week.',
        correctAnswer: 'often',
        explanationHe: 'How often = כמה פעמים/באיזו תדירות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'תרגם: "הוא תמיד עייף."',
        options: ['He always is tired.', 'He is always tired.', 'Always he is tired.', 'He tired is always.'],
        correctAnswer: 'He is always tired.',
        explanationHe: 'עם am/is/are: He is always tired.',
        difficulty: 'hard'
      }
    ]
  }
];

// Seed function
async function seedTopic9() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    console.log('Starting to seed Topic 9: Present Simple Tense...');

    for (const lessonData of lessonsData) {
      // Create lesson
      const lesson = await Lesson.create({
        topicNumber: lessonData.topicNumber,
        subtopicNumber: lessonData.subtopicNumber,
        titleEn: lessonData.titleEn,
        titleHe: lessonData.titleHe,
        level: lessonData.level,
        orderIndex: lessonData.orderIndex,
        theoryContentHe: lessonData.theoryContentHe
      });

      console.log(`  Created lesson: ${lessonData.subtopicNumber} - ${lessonData.titleEn}`);

      // Create exercises for this lesson
      for (const exerciseData of lessonData.exercises) {
        await Exercise.create({
          lessonId: lesson.id,
          questionNumber: exerciseData.questionNumber,
          type: exerciseData.type,
          questionTextHe: exerciseData.questionTextHe,
          options: exerciseData.options || null,
          correctAnswer: exerciseData.correctAnswer,
          explanationHe: exerciseData.explanationHe,
          difficulty: exerciseData.difficulty
        });
      }

      console.log(`    Created ${lessonData.exercises.length} exercises`);
    }

    await client.query('COMMIT');
    console.log('Topic 9: Present Simple Tense seeded successfully!');
    console.log(`   Total: ${lessonsData.length} lessons created`);
    console.log(`   Total exercises: ${lessonsData.reduce((sum, l) => sum + l.exercises.length, 0)}`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding Topic 9:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run if called directly
if (require.main === module) {
  seedTopic9()
    .then(() => {
      console.log('Seeding complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedTopic9, lessonsData };
