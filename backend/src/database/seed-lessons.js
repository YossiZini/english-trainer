const { pool } = require('../config/database');
const Lesson = require('../models/Lesson');
const Exercise = require('../models/Exercise');

// Lesson data for first 3 lessons
const lessonsData = [
  {
    topicNumber: 1,
    subtopicNumber: '1.1',
    titleEn: 'Introduction to Present Simple',
    titleHe: 'מבוא לזמן הווה פשוט',
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

<h3>דוגמאות:</h3>
<div class="examples">
  <p><strong>הרגלים:</strong></p>
  <p>I wake up at 7 AM every day. - אני קם ב-7 בבוקר כל יום</p>
  <p>She drinks coffee in the morning. - היא שותה קפה בבוקר</p>

  <p><strong>עובדות:</strong></p>
  <p>The sun rises in the east. - השמש זורחת במזרח</p>
  <p>Water boils at 100 degrees. - מים רותחים ב-100 מעלות</p>

  <p><strong>מצבים קבועים:</strong></p>
  <p>I live in Tel Aviv. - אני גר בתל אביב</p>
  <p>He works as a teacher. - הוא עובד כמורה</p>
</div>

<h3>חוקי דקדוק חשובים:</h3>
<div class="rules">
  <p><strong>1. רוב הפעלים - מוסיפים s עם He/She/It:</strong></p>
  <ul>
    <li>I play → He play<strong>s</strong></li>
    <li>You work → She work<strong>s</strong></li>
    <li>We eat → It eat<strong>s</strong></li>
    <li>They like → He like<strong>s</strong></li>
  </ul>

  <p><strong>2. פעלים שמסתיימים ב-o, s, x, ch, sh - מוסיפים es:</strong></p>
  <ul>
    <li>go → She go<strong>es</strong> to school</li>
    <li>watch → He watch<strong>es</strong> TV</li>
    <li>pass → It pass<strong>es</strong> quickly</li>
    <li>wash → She wash<strong>es</strong> dishes</li>
  </ul>

  <p><strong>3. פעלים שמסתיימים ב-y אחרי עיצור - משנים ל-ies:</strong></p>
  <ul>
    <li>study → He stud<strong>ies</strong> English</li>
    <li>fly → The bird fl<strong>ies</strong> high</li>
    <li>cry → The baby cr<strong>ies</strong></li>
    <li>try → She tr<strong>ies</strong> hard</li>
  </ul>

  <p><strong>4. אבל! y אחרי תנועה (a,e,i,o,u) - רק מוסיפים s:</strong></p>
  <ul>
    <li>play → He play<strong>s</strong> football</li>
    <li>say → She say<strong>s</strong> hello</li>
    <li>buy → He buy<strong>s</strong> books</li>
  </ul>
</div>

<h3>ביטויי זמן נפוצים (Time Expressions):</h3>
<ul>
  <li><strong>always</strong> (תמיד) - I always brush my teeth.</li>
  <li><strong>usually</strong> (בדרך כלל) - We usually eat dinner at 7.</li>
  <li><strong>often</strong> (לעתים קרובות) - They often play football.</li>
  <li><strong>sometimes</strong> (לפעמים) - She sometimes reads books.</li>
  <li><strong>never</strong> (אף פעם לא) - He never eats meat.</li>
  <li><strong>every day/week/month</strong> (כל יום/שבוע/חודש)</li>
</ul>

<div class="tip">
  <strong>טיפ חשוב:</strong> זמן הווה פשוט הוא אחד הזמנים הכי נפוצים באנגלית. נשתמש בו הרבה בשיחות יומיומיות!
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
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט מתאר עובדה כללית?',
        options: ['I am eating now', 'Water boils at 100 degrees', 'I will go tomorrow', 'I went yesterday'],
        correctAnswer: 'Water boils at 100 degrees',
        explanationHe: 'זו עובדה כללית שתמיד נכונה, לכן משתמשים בזמן הווה פשוט.',
        difficulty: 'medium'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (drink) tea every morning.',
        correctAnswer: 'drinks',
        explanationHe: 'עם she (גוף שלישי יחיד) מוסיפים s לפועל: drink → drinks',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'איזה ביטוי מתאר הרגל?',
        options: ['now', 'every day', 'yesterday', 'tomorrow'],
        correctAnswer: 'every day',
        explanationHe: 'every day (כל יום) מתאר הרגל או שגרה.',
        difficulty: 'easy'
      }
    ]
  },
  {
    topicNumber: 1,
    subtopicNumber: '1.2',
    titleEn: 'Affirmative Sentences',
    titleHe: 'משפטים חיוביים',
    level: 'beginner',
    orderIndex: 2,
    theoryContentHe: `
<h2>משפטים חיוביים בזמן הווה פשוט</h2>

<h3>מבנה המשפט:</h3>
<div class="formula">
  <strong>Subject (נושא) + Verb (פועל) + Object (מושא)</strong>
</div>

<h3>עם I / You / We / They:</h3>
<p>השתמש בצורת הבסיס של הפועל (ללא שינוי)</p>
<div class="examples">
  <p>I <strong>play</strong> football. - אני משחק כדורגל</p>
  <p>You <strong>study</strong> English. - אתה לומד אנגלית</p>
  <p>We <strong>eat</strong> breakfast at 8. - אנחנו אוכלים ארוחת בוקר ב-8</p>
  <p>They <strong>live</strong> in Jerusalem. - הם גרים בירושלים</p>
</div>

<h3>עם He / She / It (גוף שלישי יחיד):</h3>
<p><strong>חשוב מאוד!</strong> צריך להוסיף <strong>s</strong> או <strong>es</strong> לפועל</p>

<h4>חוקי הוספת s/es:</h4>

<div class="rules">
  <p><strong>1. רוב הפעלים - מוסיפים s:</strong></p>
  <ul>
    <li>play → play<strong>s</strong></li>
    <li>eat → eat<strong>s</strong></li>
    <li>work → work<strong>s</strong></li>
    <li>like → like<strong>s</strong></li>
  </ul>

  <p><strong>2. פעלים שמסתיימים ב-o, s, x, ch, sh - מוסיפים es:</strong></p>
  <ul>
    <li>go → go<strong>es</strong></li>
    <li>do → do<strong>es</strong></li>
    <li>watch → watch<strong>es</strong></li>
    <li>pass → pass<strong>es</strong></li>
    <li>fix → fix<strong>es</strong></li>
    <li>wash → wash<strong>es</strong></li>
  </ul>

  <p><strong>3. פעלים שמסתיימים ב-y אחרי עיצור - משנים ל-ies:</strong></p>
  <ul>
    <li>study → stud<strong>ies</strong></li>
    <li>fly → fl<strong>ies</strong></li>
    <li>cry → cr<strong>ies</strong></li>
    <li>try → tr<strong>ies</strong></li>
  </ul>

  <p><strong>4. אבל! y אחרי תנועה - רק מוסיפים s:</strong></p>
  <ul>
    <li>play → play<strong>s</strong></li>
    <li>say → say<strong>s</strong></li>
    <li>buy → buy<strong>s</strong></li>
  </ul>
</div>

<h3>דוגמאות עם He/She/It:</h3>
<div class="examples">
  <p>He <strong>plays</strong> tennis. - הוא משחק טניס</p>
  <p>She <strong>watches</strong> TV. - היא צופה בטלוויזיה</p>
  <p>It <strong>works</strong> well. - זה עובד טוב</p>
  <p>My brother <strong>studies</strong> math. - אחי לומד מתמטיקה</p>
  <p>The cat <strong>drinks</strong> milk. - החתול שותה חלב</p>
</div>

<div class="warning">
  <strong>שגיאה נפוצה:</strong><br>
  ❌ He play football. (חסר s!)<br>
  ✅ He play<strong>s</strong> football.
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
        type: 'multiple_choice',
        questionTextHe: 'They _______ football on Sundays.',
        options: ['plays', 'play', 'playes', 'playing'],
        correctAnswer: 'play',
        explanationHe: 'עם they לא מוסיפים s - משתמשים בצורת הבסיס: play',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'My mother _______ (watch) TV in the evening.',
        correctAnswer: 'watches',
        explanationHe: 'watch מסתיים ב-ch, לכן מוסיפים es: watches',
        difficulty: 'medium'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'I _______ breakfast at 7 AM.',
        options: ['eats', 'eat', 'eating', 'eates'],
        correctAnswer: 'eat',
        explanationHe: 'עם I משתמשים בצורת הבסיס ללא שינוי: eat',
        difficulty: 'easy'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'The dog _______ (bark) at night.',
        correctAnswer: 'barks',
        explanationHe: 'עם the dog (it) מוסיפים s: barks',
        difficulty: 'easy'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'We _______ in Tel Aviv.',
        options: ['lives', 'live', 'living', 'lifes'],
        correctAnswer: 'live',
        explanationHe: 'עם we משתמשים בצורת הבסיס: live',
        difficulty: 'easy'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (fly) to London every month.',
        correctAnswer: 'flies',
        explanationHe: 'fly מסתיים ב-y אחרי עיצור, משנים ל-ies: flies',
        difficulty: 'medium'
      },
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

<h3>מבנה המשפט השלילי:</h3>
<div class="formula">
  <strong>Subject + do/does + not + base verb</strong><br>
  (נושא + do/does + not + פועל בצורת בסיס)
</div>

<h3>עם I / You / We / They - משתמשים ב-do not (don't):</h3>
<div class="examples">
  <p>I <strong>do not</strong> like coffee. = I <strong>don't</strong> like coffee.</p>
  <p class="translation">אני לא אוהב קפה</p>

  <p>You <strong>do not</strong> play tennis. = You <strong>don't</strong> play tennis.</p>
  <p class="translation">אתה לא משחק טניס</p>

  <p>We <strong>do not</strong> eat meat. = We <strong>don't</strong> eat meat.</p>
  <p class="translation">אנחנו לא אוכלים בשר</p>

  <p>They <strong>do not</strong> live here. = They <strong>don't</strong> live here.</p>
  <p class="translation">הם לא גרים פה</p>
</div>

<h3>עם He / She / It - משתמשים ב-does not (doesn't):</h3>
<div class="examples">
  <p>He <strong>does not</strong> watch TV. = He <strong>doesn't</strong> watch TV.</p>
  <p class="translation">הוא לא צופה בטלוויזיה</p>

  <p>She <strong>does not</strong> eat meat. = She <strong>doesn't</strong> eat meat.</p>
  <p class="translation">היא לא אוכלת בשר</p>

  <p>It <strong>does not</strong> work. = It <strong>doesn't</strong> work.</p>
  <p class="translation">זה לא עובד</p>

  <p>My sister <strong>doesn't</strong> like chocolate.</p>
  <p class="translation">אחותי לא אוהבת שוקולד</p>
</div>

<div class="warning">
  <h4>⚠️ שים לב מאוד!</h4>
  <p><strong>הפועל חוזר לצורת הבסיס!</strong></p>
  <p>כשמשתמשים ב-doesn't, הפועל הראשי לא מקבל s!</p>

  <div class="comparison">
    <p class="wrong">❌ He doesn't play<strong>s</strong> football.</p>
    <p class="correct">✅ He doesn't <strong>play</strong> football.</p>

    <p class="wrong">❌ She doesn't like<strong>s</strong> coffee.</p>
    <p class="correct">✅ She doesn't <strong>like</strong> coffee.</p>

    <p class="wrong">❌ It doesn't work<strong>s</strong>.</p>
    <p class="correct">✅ It doesn't <strong>work</strong>.</p>
  </div>
</div>

<h3>קיצורים נפוצים:</h3>
<table>
  <tr>
    <th>צורה מלאה</th>
    <th>קיצור</th>
  </tr>
  <tr>
    <td>do not</td>
    <td>don't</td>
  </tr>
  <tr>
    <td>does not</td>
    <td>doesn't</td>
  </tr>
</table>

<p><strong>בשפה המדוברת תמיד משתמשים בקיצור!</strong></p>

<h3>תרגול נוסף - משפטים נפוצים:</h3>
<div class="examples">
  <p>I don't understand. - אני לא מבין</p>
  <p>She doesn't speak Hebrew. - היא לא מדברת עברית</p>
  <p>We don't have time. - אין לנו זמן</p>
  <p>They don't know. - הם לא יודעים</p>
  <p>He doesn't like sports. - הוא לא אוהב ספורט</p>
  <p>It doesn't matter. - זה לא משנה</p>
</div>

<div class="tip">
  <strong>טיפ להצלחה:</strong> תמיד זכור - don't עם I/you/we/they, ו-doesn't עם he/she/it!
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'He _______ like coffee.',
        options: ["don't", "doesn't", "isn't", "not"],
        correctAnswer: "doesn't",
        explanationHe: "עם he משתמשים ב-doesn't. don't זה רק עם I/you/we/they",
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ play football on Mondays. (השלם עם don\'t או doesn\'t)',
        correctAnswer: "don't",
        explanationHe: "עם they משתמשים ב-don't (לא ב-doesn't)",
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'She _______ eat meat.',
        options: ["don't", "doesn't", "isn't", "aren't"],
        correctAnswer: "doesn't",
        explanationHe: "עם she משתמשים ב-doesn't",
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ understand English. (השלם עם don\'t או doesn\'t)',
        correctAnswer: "don't",
        explanationHe: "עם I משתמשים ב-don't",
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ["He doesn't likes pizza", "He doesn't like pizza", "He don't like pizza", "He doesn't liking pizza"],
        correctAnswer: "He doesn't like pizza",
        explanationHe: "הפועל חוזר לצורת הבסיס (like, לא likes) אחרי doesn't",
        difficulty: 'medium'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (not/live) in Jerusalem.',
        correctAnswer: "don't live",
        explanationHe: "עם we משתמשים ב-don't, והפועל בצורת בסיס: don't live",
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'The cat _______ drink milk.',
        options: ["don't", "doesn't", "isn't", "aren't"],
        correctAnswer: "doesn't",
        explanationHe: "the cat = it, לכן משתמשים ב-doesn't",
        difficulty: 'easy'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'My parents _______ (not/watch) TV in the morning.',
        correctAnswer: "don't watch",
        explanationHe: "my parents = they, לכן don't watch",
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט שגוי?',
        options: ["I don't like tea", "She doesn't speak English", "They doesn't play games", "We don't eat meat"],
        correctAnswer: "They doesn't play games",
        explanationHe: 'עם they צריך don\'t (לא doesn\'t). הנכון: "They don\'t play games"',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'It _______ (not/work) properly.',
        correctAnswer: "doesn't work",
        explanationHe: "עם it משתמשים ב-doesn't, והפועל בצורת בסיס: doesn't work",
        difficulty: 'easy'
      },
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
    ]
  }
];

async function seedLessons() {
  console.log('🌱 Starting lesson seeding...\n');

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const lessonData of lessonsData) {
      console.log(`Creating lesson: ${lessonData.titleHe} (${lessonData.titleEn})...`);

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

      console.log(`✓ Lesson created with ID: ${lesson.id}`);

      // Create exercises for this lesson
      console.log(`  Creating ${lessonData.exercises.length} exercises...`);

      for (const exerciseData of lessonData.exercises) {
        await Exercise.create({
          lessonId: lesson.id,
          ...exerciseData
        });
      }

      console.log(`✓ ${lessonData.exercises.length} exercises created\n`);
    }

    await client.query('COMMIT');

    console.log('✅ Lesson seeding completed successfully!');
    console.log(`\nTotal: ${lessonsData.length} lessons created`);
    console.log('You can now access these lessons through the API\n');

    process.exit(0);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    client.release();
  }
}

// Run seeding
seedLessons();
