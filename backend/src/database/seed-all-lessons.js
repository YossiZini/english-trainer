const { pool } = require('../config/database');
const Lesson = require('../models/Lesson');
const Exercise = require('../models/Exercise');

// Import individual topic seed files
const topic15Data = require('./seeds/topic15-past-simple');
const topic11Data = require('./seeds/topic11-present-progressive');

// Comprehensive lesson data for all topics
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
      // EASY (1-5): Basic habits and simple facts
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'I _______ to school every day.',
        options: ['go', 'goes', 'going', 'went'],
        correctAnswer: 'go',
        explanationHe: 'התשובה הנכונה היא go כי I לוקח את צורת הבסיס של הפועל בהווה פשוט.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'She _______ breakfast at 7 AM.',
        options: ['eat', 'eats', 'eating', 'ate'],
        correctAnswer: 'eats',
        explanationHe: 'התשובה הנכונה היא eats כי she לוקחת s בסוף הפועל בהווה פשוט.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (play) football on Sundays.',
        correctAnswer: 'play',
        explanationHe: 'התשובה הנכונה היא play כי they לוקח את צורת הבסיס של הפועל.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'The sun _______ in the east.',
        options: ['rise', 'rises', 'rising', 'rose'],
        correctAnswer: 'rises',
        explanationHe: 'התשובה הנכונה היא rises כי זו עובדה כללית ו-sun = it לוקח s.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (like) pizza.',
        correctAnswer: 'like',
        explanationHe: 'התשובה הנכונה היא like כי we לוקח את צורת הבסיס של הפועל.',
        difficulty: 'easy'
      },
      // MEDIUM (6-10): Frequency adverbs and time expressions
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'He always _______ his homework after dinner.',
        options: ['do', 'does', 'doing', 'did'],
        correctAnswer: 'does',
        explanationHe: 'always = תמיד הוא ביטוי תדירות. he לוקח does (לא do) בהווה פשוט.',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'My parents usually _______ (watch) TV in the evening.',
        correctAnswer: 'watch',
        explanationHe: 'usually = בדרך כלל מציין הרגל. parents = they לוקח watch ללא s.',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'She sometimes _______ to music while studying.',
        options: ['listen', 'listens', 'listening', 'listened'],
        correctAnswer: 'listens',
        explanationHe: 'sometimes = לפעמים הוא ביטוי תדירות שמופיע לפני הפועל. she + listens.',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'They often _______ (visit) their grandparents on weekends.',
        correctAnswer: 'visit',
        explanationHe: 'often = לעיתים קרובות מציין תדירות גבוהה. they לוקח visit ללא s.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'Water _______ at 100 degrees Celsius.',
        options: ['boil', 'boils', 'boiling', 'boiled'],
        correctAnswer: 'boils',
        explanationHe: 'זו עובדה מדעית שמשתמשת בהווה פשוט. water = it לוקח boils.',
        difficulty: 'medium'
      },
      // HARD (11-30): Stative verbs, scheduled future, advanced patterns
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'I _______ what you mean right now.',
        options: ['understand', 'understands', 'am understanding', 'understanding'],
        correctAnswer: 'understand',
        explanationHe: 'תשובה נכונה: understand\nכלל: understand הוא פועל סטטי (stative verb) שמתאר מצב מנטלי ולא משתמש בצורה ממושכת.\nשים לב: פעלי תפיסה (know, believe, understand, remember) כמעט תמיד בהווה פשוט.\nטעות נפוצה: להשתמש ב-am understanding כי "right now" נשמע כמו עכשיו, אבל understand תמיד פשוט.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'The train _______ (arrive) at 6:30 PM according to the schedule.',
        correctAnswer: 'arrives',
        explanationHe: 'תשובה נכונה: arrives\nכלל: לוחות זמנים קבועים משתמשים בהווה פשוט גם למשמעות עתיד.\nשים לב: "according to the schedule" מרמז על זמן מתוכנן - הווה פשוט.\nטעות נפוצה: להשתמש ב-will arrive כי זה נשמע כמו עתיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'She seldom _______ late to class.',
        options: ['come', 'comes', 'is coming', 'came'],
        correctAnswer: 'comes',
        explanationHe: 'תשובה נכונה: comes\nכלל: seldom = לעיתים רחוקות הוא ביטוי תדירות שמופיע לפני הפועל. she + s.\nשים לב: seldom חזק מ-sometimes אבל חלש מ-rarely.\nטעות נפוצה: לשכוח את ה-s בגלל המילה seldom שמסיחה את הדעת.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'My brother _______ (have) three children.',
        correctAnswer: 'has',
        explanationHe: 'תשובה נכונה: has\nכלל: have משתנה ל-has בגוף שלישי יחיד (he/she/it), לא haves!\nשים לב: have במשמעות "יש ל-" הוא פועל סטטי ולא ב-continuous.\nטעות נפוצה: לכתוב haves במקום has.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'Coffee _______ caffeine.',
        options: ['contain', 'contains', 'is containing', 'containing'],
        correctAnswer: 'contains',
        explanationHe: 'תשובה נכונה: contains\nכלל: contain הוא פועל סטטי שמתאר הרכב - לא ניתן לשימוש ב-continuous.\nשים לב: פעלים של הרכב ותכולה (contain, consist, include) תמיד סטטיים.\nטעות נפוצה: להשתמש ב-is containing - contain אף פעם לא ב-continuous.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'The shop _______ (open) at 9 AM daily.',
        correctAnswer: 'opens',
        explanationHe: 'תשובה נכונה: opens\nכלל: שעות פתיחה קבועות משתמשות בהווה פשוט. shop = it צריך s.\nשים לב: daily = יומית מחזק את השימוש בהווה פשוט לתיאור שגרה.\nטעות נפוצה: להשתמש ב-is opening שמתאר פעולה מתרחשת עכשיו.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'He hardly ever _______ TV.',
        options: ['watch', 'watches', 'is watching', 'watched'],
        correctAnswer: 'watches',
        explanationHe: 'תשובה נכונה: watches\nכלל: hardly ever = כמעט אף פעם לא הוא ביטוי תדירות שלילי. he + s.\nשים לב: hardly ever קרוב ל-never אבל לא לגמרי - זה כמעט שלילה מוחלטת.\nטעות נפוצה: לחשוב שהאופי השלילי מבטל את ה-s.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'Cats generally _______ (dislike) water.',
        correctAnswer: 'dislike',
        explanationHe: 'תשובה נכונה: dislike\nכלל: generally = באופן כללי מציין עובדה כללית. cats = they ללא s.\nשים לב: dislike הוא פועל סטטי רגשי - לא ב-continuous.\nטעות נפוצה: להוסיף s ל-dislike כי cats נשמע יחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'The earth _______ around the sun.',
        options: ['revolve', 'revolves', 'is revolving', 'revolved'],
        correctAnswer: 'revolves',
        explanationHe: 'תשובה נכונה: revolves\nכלל: עובדות מדעיות וטבעיות בהווה פשוט. earth = it צריך s.\nשים לב: revolve מסתיים ב-e, מוסיפים רק s.\nטעות נפוצה: להסס אם להוסיף s בגלל שזו עובדה מדעית.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'Once a week, she _______ (visit) her grandmother.',
        correctAnswer: 'visits',
        explanationHe: 'תשובה נכונה: visits\nכלל: once a week = פעם בשבוע הוא ביטוי תדירות - הווה פשוט. she + s.\nשים לב: ביטויים עם once/twice (once a month, twice a year) תמיד הווה פשוט.\nטעות נפוצה: להתבלבל בגלל "once" ולחשוב שזה עבר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'My parents rarely _______ out.',
        options: ['eat', 'eats', 'are eating', 'ate'],
        correctAnswer: 'eat',
        explanationHe: 'תשובה נכונה: eat\nכלל: rarely = לעיתים רחוקות הוא ביטוי תדירות. parents = they ללא s.\nשים לב: rarely חזק יותר מ-seldom - זה כמעט שלילה.\nטעות נפוצה: להוסיף s ל-eat כי parents נשמע רשמי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: 'Scientists _______ (believe) that climate change is real.',
        correctAnswer: 'believe',
        explanationHe: 'תשובה נכונה: believe\nכלל: believe הוא פועל סטטי מנטלי. scientists = they ללא s.\nשים לב: דעות מקצועיות משתמשות בהווה פשוט כי זו עמדה כללית.\nטעות נפוצה: להוסיף s ל-believe כי scientists נשמע רשמי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: 'The museum _______ at 10 AM.',
        options: ['open', 'opens', 'is opening', 'opened'],
        correctAnswer: 'opens',
        explanationHe: 'תשובה נכונה: opens\nכלל: שעות פעילות קבועות בהווה פשוט. museum = it צריך s.\nשים לב: לוחות זמנים של מוסדות תמיד בהווה פשוט.\nטעות נפוצה: להשתמש ב-is open (תואר) במקום opens (פועל).',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: 'Whenever it rains, the roof _______ (leak).',
        correctAnswer: 'leaks',
        explanationHe: 'תשובה נכונה: leaks\nכלל: whenever = בכל פעם ש- מציין מצב חוזר. roof = it צריך s.\nשים לב: המבנה "whenever + present, present" מתאר תבנית קבועה.\nטעות נפוצה: להשתמש ב-is leaking כי rains נשמע כמו עכשיו.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: 'She _______ two languages fluently.',
        options: ['speak', 'speaks', 'is speaking', 'spoke'],
        correctAnswer: 'speaks',
        explanationHe: 'תשובה נכונה: speaks\nכלל: יכולות קבועות בהווה פשוט. she + s.\nשים לב: fluently = בשטף מתאר יכולת קבועה, לא פעולה זמנית.\nטעות נפוצה: להשתמש ב-is speaking כי "מדברת" נשמע כמו פעולה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: 'Normally, he _______ (drive) to work.',
        correctAnswer: 'drives',
        explanationHe: 'תשובה נכונה: drives\nכלל: normally = בדרך כלל מציין הרגל קבוע. he + s.\nשים לב: normally, usually, generally כולם מחייבים הווה פשוט.\nטעות נפוצה: להתבלבל עם צורת עבר בגלל המשמעות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'The library _______ thousands of books.',
        options: ['house', 'houses', 'is housing', 'housed'],
        correctAnswer: 'houses',
        explanationHe: 'תשובה נכונה: houses\nכלל: house כפועל = מכיל/מאחסן. זה מצב קבוע. library = it צריך s.\nשים לב: house כשם עצם = בית, כפועל = מכיל.\nטעות נפוצה: לא להבין ש-house יכול להיות גם פועל.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: 'My sister frequently _______ (volunteer) at the shelter.',
        correctAnswer: 'volunteers',
        explanationHe: 'תשובה נכונה: volunteers\nכלל: frequently = לעיתים קרובות הוא ביטוי תדירות. sister = she צריך s.\nשים לב: volunteer כפועל לוקח s רגיל.\nטעות נפוצה: לשכוח את ה-s כי volunteer נראה כמו שם עצם.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: 'Every morning, the sun _______ in the east.',
        options: ['rise', 'rises', 'is rising', 'rose'],
        correctAnswer: 'rises',
        explanationHe: 'תשובה נכונה: rises\nכלל: עובדות טבע + ביטוי תדירות = הווה פשוט. sun = it צריך s.\nשים לב: rise מסתיים ב-e, מוסיפים רק s. אל תתבלבל עם raise.\nטעות נפוצה: לכתוב raises - raise זה פועל אחר (להרים משהו).',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: 'The movie _______ (start) at 8 PM tonight according to the schedule.',
        correctAnswer: 'starts',
        explanationHe: 'תשובה נכונה: starts\nכלל: לוחות זמנים של אירועים משתמשים בהווה פשוט גם למשמעות עתיד.\nשים לב: "according to the schedule" מרמז שזה זמן מתוכנן קבוע.\nטעות נפוצה: להשתמש ב-will start כי "tonight" נשמע כמו עתיד.',
        difficulty: 'hard'
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
      // EASY (1-5): Basic -s endings
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'He _______ football every day.',
        options: ['play', 'plays', 'playes', 'playing'],
        correctAnswer: 'plays',
        explanationHe: 'התשובה הנכונה היא plays כי he לוקח s בסוף הפועל.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'She _______ books.',
        options: ['read', 'reads', 'reades', 'reading'],
        correctAnswer: 'reads',
        explanationHe: 'התשובה הנכונה היא reads כי she לוקחת s בסוף הפועל.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'It _______ (rain) a lot here.',
        correctAnswer: 'rains',
        explanationHe: 'התשובה הנכונה היא rains כי it לוקח s בסוף הפועל.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'My sister _______ music.',
        options: ['like', 'likes', 'likees', 'liking'],
        correctAnswer: 'likes',
        explanationHe: 'התשובה הנכונה היא likes כי sister = she לוקחת s.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (work) hard.',
        correctAnswer: 'works',
        explanationHe: 'התשובה הנכונה היא works כי he לוקח s בסוף הפועל.',
        difficulty: 'easy'
      },
      // MEDIUM (6-10): -es and -ies patterns
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'She _______ to school by bus.',
        options: ['go', 'gos', 'goes', 'goe'],
        correctAnswer: 'goes',
        explanationHe: 'פעלים המסתיימים ב-o לוקחים es (לא s רגיל). go → goes.',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (watch) TV every evening.',
        correctAnswer: 'watches',
        explanationHe: 'פעלים המסתיימים ב-ch לוקחים es. watch → watches.',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'She _______ very hard for her tests.',
        options: ['study', 'studys', 'studies', 'studyes'],
        correctAnswer: 'studies',
        explanationHe: 'כאשר יש y אחרי עיצור, משנים ל-ies. study → studies.',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'My dog _______ (catch) the ball.',
        correctAnswer: 'catches',
        explanationHe: 'פעלים המסתיימים ב-ch לוקחים es. catch → catches.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'He _______ his homework quickly.',
        options: ['do', 'dos', 'does', 'doos'],
        correctAnswer: 'does',
        explanationHe: 'do היא צורה חריגה שהופכת ל-does (לא dos!).',
        difficulty: 'medium'
      },
      // HARD (11-30): Complex patterns, irregular forms, edge cases
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'She _______ (fix) computers for a living. בחר צורה נכונה לפועל המסתיים ב-x.',
        options: ['fix', 'fixs', 'fixes', 'fixies'],
        correctAnswer: 'fixes',
        explanationHe: 'תשובה נכונה: fixes\nכלל: פעלים המסתיימים ב-x, s, ch, sh, o מקבלים es (לא רק s). she = גוף שלישי יחיד.\nשים לב: fix מסתיים ב-x (עיצור שורק), לכן חייבים es. ההגייה: /ˈfɪksɪz/.\nטעות נפוצה: להוסיף רק s ולכתוב fixs - זה שגוי כי x דורש es.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'My father _______ (teach) mathematics at the university.',
        correctAnswer: 'teaches',
        explanationHe: 'תשובה נכונה: teaches\nכלל: teach מסתיים ב-ch (צליל שורק), לכן מוסיפים es. father = he.\nשים לב: ch תמיד לוקח es, לא משנה מה האות לפניו. ההגייה: /ˈtiːtʃɪז/.\nטעות נפוצה: לכתוב teachs - זה שגוי, ch תמיד דורש es.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'He _______ (try) very hard to succeed.',
        options: ['try', 'trys', 'tries', 'tryes'],
        correctAnswer: 'tries',
        explanationHe: 'תשובה נכונה: tries\nכלל: כשהפועל מסתיים ב-y אחרי עיצור (try: t+r+y), מורידים את ה-y ומוסיפים ies.\nשים לב: try → tries (לא trys!). הכלל הזה חל רק כשיש עיצור לפני ה-y.\nטעות נפוצה: להוסיף רק s ולכתוב trys - זה שגיאת איות נפוצה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'multiple_choice',
        questionTextHe: 'The baby _______ (cry) when he is hungry.',
        options: ['cry', 'crys', 'cries', 'cryes'],
        correctAnswer: 'cries',
        explanationHe: 'תשובה נכונה: cries\nכלל: cry מסתיים ב-y אחרי עיצור r, לכן y → ies. baby = it (גוף שלישי).\nשים לב: cry, fly, try, study - כולם פועלים בעלי אותה תבנית. ההגייה: /kraɪz/.\nטעות נפוצה: להתבלבל ולכתוב cryes - אין צורה כזו באנגלית.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (play) the piano beautifully.',
        correctAnswer: 'plays',
        explanationHe: 'תשובה נכונה: plays\nכלל: כש-y מגיע אחרי תנועה (play: a+y), פשוט מוסיפים s רגיל - לא משנים ל-ies!\nשים לב: play, say, buy, enjoy - כולם לוקחים s רגיל כי יש תנועה לפני ה-y.\nטעות נפוצה: לכתוב plaies או plais - שגיאה כי a היא תנועה, לא עיצור.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'It _______ (do) not matter to me.',
        options: ['do', 'dos', 'does', 'doos'],
        correctAnswer: 'does',
        explanationHe: 'תשובה נכונה: does\nכלל: do הוא פועל חריג! בגוף שלישי יחיד הוא הופך ל-does (מוסיפים es כי מסתיים ב-o).\nשים לב: do → does הוא אחד הפעלים החשובים ביותר באנגלית. ההגייה: /dʌz/.\nטעות נפוצה: לכתוב dos - זה נראה הגיוני אבל שגוי, הצורה הנכונה היא does.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (go) to the gym three times a week.',
        correctAnswer: 'goes',
        explanationHe: 'תשובה נכונה: goes\nכלל: go מסתיים ב-o, לכן מוסיפים es. זהו פועל נפוץ מאוד עם חריג איות.\nשים לב: go → goes (לא gos!). ההגייה: /ɡoʊz/. פועלים נוספים: do→does, echo→echoes.\nטעות נפוצה: לכתוב gos - נראה הגיוני אבל o בסוף תמיד לוקח es.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'She _______ (wash) her car every weekend.',
        options: ['wash', 'washs', 'washes', 'washies'],
        correctAnswer: 'washes',
        explanationHe: 'תשובה נכונה: washes\nכלל: sh הוא צליל שורק, לכן לוקח es. זה דומה ל-ch, x, s, o.\nשים לב: wash → washes. פעלים דומים: brush→brushes, push→pushes, finish→finishes.\nטעות נפוצה: לכתוב washs - sh תמיד דורש es, לא s בלבד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: 'My sister _______ (study) medicine at the university.',
        correctAnswer: 'studies',
        explanationHe: 'תשובה נכונה: studies\nכלל: study = y אחרי עיצור d, לכן y → ies. sister = she.\nשים לב: study → studies. פעלים דומים: carry→carries, worry→worries, hurry→hurries.\nטעות נפוצה: לכתוב studys - זה איות שגוי נפוץ מאוד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'He _______ (have) a beautiful garden.',
        options: ['have', 'haves', 'has', 'hases'],
        correctAnswer: 'has',
        explanationHe: 'תשובה נכונה: has\nכלל: have הוא פועל לגמרי חריג! בגוף שלישי יחיד הוא הופך ל-has (לא haves!).\nשים לב: have → has זו צורה חריגה שחייבים לשנן. זהו אחד הפעלים השכיחים ביותר.\nטעות נפוצה: לכתוב haves - לא קיימת מילה כזו באנגלית.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'fill_in_blank',
        questionTextHe: 'The dog _______ (catch) the ball in its mouth.',
        correctAnswer: 'catches',
        explanationHe: 'תשובה נכונה: catches\nכלל: catch מסתיים ב-ch (צליל שורק), לכן מוסיפים es. dog = it.\nשים לב: catch → catches. ההגייה: /ˈkætʃɪz/. פעלים דומים: match→matches, watch→watches.\nטעות נפוצה: לכתוב catchs - זה שגוי, ch תמיד דורש es.',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'multiple_choice',
        questionTextHe: 'She _______ (fly) to Paris twice a year.',
        options: ['fly', 'flys', 'flies', 'flyes'],
        correctAnswer: 'flies',
        explanationHe: 'תשובה נכונה: flies\nכלל: fly = y אחרי עיצור l, לכן y → ies. ההגייה: /flaɪz/.\nשים לב: fly → flies. פעלים דומים: apply→applies, reply→replies, supply→supplies.\nטעות נפוצה: לכתוב flys - נראה פשוט אבל שגוי, צריך ies.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: 'He always _______ (say) hello to everyone.',
        options: ['say', 'saies', 'says', 'sayes'],
        correctAnswer: 'says',
        explanationHe: 'תשובה נכונה: says\nכלל: say = y אחרי תנועה a, לכן רק מוסיפים s (לא ies!). ההגייה: /sez/ (לא /seɪz/).\nשים לב: say → says זו הגייה חריגה. פעלים דומים: pay→pays, stay→stays.\nטעות נפוצה: לכתוב saies - שגיאה כי a היא תנועה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: 'The company _______ (employ) over 500 people.',
        correctAnswer: 'employs',
        explanationHe: 'תשובה נכונה: employs\nכלל: employ = y אחרי תנועה o, לכן רק s. company = it.\nשים לב: employ → employs. פעלים דומים: enjoy→enjoys, destroy→destroys, annoy→annoys.\nטעות נפוצה: לכתוב emploies - שגוי כי o היא תנועה, לא עיצור.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: 'She _______ (miss) her family very much.',
        options: ['miss', 'misss', 'misses', 'missies'],
        correctAnswer: 'misses',
        explanationHe: 'תשובה נכונה: misses\nכלל: miss מסתיים ב-ss (צליל שורק), לכן מוסיפים es. ההגייה: /ˈmɪsɪz/.\nשים לב: miss → misses. פעלים דומים: kiss→kisses, pass→passes, press→presses.\nטעות נפוצה: לכתוב misss (שלוש s) - זה לא נכון, צריך רק es בסוף.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (worry) about his exams all the time.',
        correctAnswer: 'worries',
        explanationHe: 'תשובה נכונה: worries\nכלל: worry = y אחרי עיצור r, לכן y → ies. ההגייה: /ˈwʌriz/.\nשים לב: worry → worries. פעלים דומים: carry→carries, marry→marries, bury→buries.\nטעות נפוצה: לכתוב worrys - שכיח מאוד אבל שגוי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'The machine _______ (mix) the ingredients automatically.',
        options: ['mix', 'mixs', 'mixes', 'mixies'],
        correctAnswer: 'mixes',
        explanationHe: 'תשובה נכונה: mixes\nכלל: mix מסתיים ב-x (צליל שורק), לכן es. machine = it.\nשים לב: mix → mixes. פעלים דומים: fix→fixes, box→boxes, wax→waxes.\nטעות נפוצה: לכתוב mixs - x תמיד דורש es.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (deny) all the accusations against her.',
        correctAnswer: 'denies',
        explanationHe: 'תשובה נכונה: denies\nכלל: deny = y אחרי עיצור n, לכן y → ies. ההגייה: /dɪˈnaɪz/.\nשים לב: deny → denies. פעלים דומים: rely→relies, imply→implies, certify→certifies.\nטעות נפוצה: לכתוב denys - איות שגוי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: 'He _______ (echo) everything his friends say.',
        options: ['echo', 'echos', 'echoes', 'echois'],
        correctAnswer: 'echoes',
        explanationHe: 'תשובה נכונה: echoes\nכלל: echo מסתיים ב-o אחרי עיצור ch, לכן מוסיפים es. ההגייה: /ˈekoʊz/.\nשים לב: echo → echoes. פעלים דומים: do→does, go→goes, veto→vetoes.\nטעות נפוצה: לכתוב echos - נראה הגיוני אבל שגוי, o דורש es.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: 'The sun _______ (shine) brightly in the summer.',
        correctAnswer: 'shines',
        explanationHe: 'תשובה נכונה: shines\nכלל: shine מסתיים ב-e, לכן פשוט מוסיפים s (לא es!). sun = it.\nשים לב: shine → shines. פעלים דומים: smile→smiles, dance→dances, hope→hopes.\nטעות נפוצה: לכתוב shinies או להוסיף es - shine מסתיים ב-e רגיל, לא sh.',
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
<p class="subtitle">Negative Sentences in Present Simple</p>

<div class="formula">
  <div class="formula-title">מבנה המשפט:</div>
  <div class="formula-content" dir="ltr">Subject + do/does + not + verb (infinitive)</div>
  <div class="formula-explanation">(נושא + do/does + not + פועל בצורת הבסיס)</div>
</div>

<div class="rules">
  <h3>כללים:</h3>

  <div class="rule-section">
    <p class="rule-header"><strong>עם I / You / We / They:</strong></p>
    <p class="rule-explanation">משתמשים ב-<span dir="ltr"><strong>do not</strong></span> (או בקיצור: <span dir="ltr"><strong>don't</strong></span>)</p>
    <div class="examples" dir="ltr">
      <p>• I <strong>don't</strong> like coffee.</p>
      <p>• They <strong>don't</strong> work on weekends.</p>
    </div>
  </div>

  <div class="rule-section">
    <p class="rule-header"><strong>עם He / She / It:</strong></p>
    <p class="rule-explanation">משתמשים ב-<span dir="ltr"><strong>does not</strong></span> (או בקיצור: <span dir="ltr"><strong>doesn't</strong></span>)</p>
    <div class="examples" dir="ltr">
      <p>• She <strong>doesn't</strong> play tennis.</p>
      <p>• He <strong>doesn't</strong> watch TV.</p>
    </div>
  </div>
</div>

<div class="warning">
  <strong>⚠️ חשוב לזכור!</strong>
  <p>הפועל אחרי <span dir="ltr">doesn't</span> תמיד בצורת הבסיס (ללא s)!</p>
  <div class="comparison">
    <p class="wrong">❌ <span dir="ltr">She doesn't plays</span></p>
    <p class="correct">✅ <span dir="ltr">She doesn't play</span></p>
  </div>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'She _______ speak Chinese, only English. בחר שלילה נכונה עם פועל רגיל.',
        options: ["don't", "doesn't", "isn't", "not speak"],
        correctAnswer: "doesn't",
        explanationHe: 'תשובה נכונה: doesn\'t\nכלל: בהווה פשוט שלילי עם he/she/it משתמשים ב-doesn\'t + פועל בצורת בסיס (speak, לא speaks).\nשים לב: אחרי doesn\'t הפועל תמיד ללא s, גם אם הנושא הוא she/he/it.\nטעות נפוצה: לכתוב "doesn\'t speaks" - הפועל אחרי doesn\'t חייב להיות בצורת בסיס.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'My parents _______ (not/work) on weekends.',
        correctAnswer: "don't work",
        explanationHe: 'תשובה נכונה: don\'t work\nכלל: עם כינוי רבים (parents = they) משתמשים ב-don\'t + פועל בסיס.\nשים לב: parents הוא תמיד רבים, לכן don\'t (לא doesn\'t).\nטעות נפוצה: לכתוב doesn\'t work כי parents נשמע יחידני, אבל זה תמיד רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'He _______ believe in ghosts. תרחיש עם פועל סטטי.',
        options: ["don't", "doesn't", "isn't", "doesn't believes"],
        correctAnswer: "doesn't",
        explanationHe: 'תשובה נכונה: doesn\'t\nכלל: believe הוא פועל סטטי, אך בשלילה משתמשים ב-doesn\'t בדיוק כמו פעלים רגילים.\nשים לב: גם פעלים סטטיים (know, believe, want) משתמשים ב-don\'t/doesn\'t בשלילה.\nטעות נפוצה: לכתוב "doesn\'t believes" - הפועל אחרי doesn\'t תמיד בסיס.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'I _______ understand this grammar rule. שלילה עם I.',
        options: ["doesn't", "don't", "am not", "not"],
        correctAnswer: "don't",
        explanationHe: 'תשובה נכונה: don\'t\nכלל: עם I משתמשים ב-don\'t (לא doesn\'t!), גם אם זה נושא יחיד.\nשים לב: I/you/we/they → don\'t; he/she/it → doesn\'t.\nטעות נפוצה: לכתוב "am not understand" - understand הוא פועל רגיל, לא be.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'The museum _______ (not/open) on Mondays.',
        correctAnswer: "doesn't open",
        explanationHe: 'תשובה נכונה: doesn\'t open\nכלל: museum = it (יחיד), לכן doesn\'t. הפועל open נשאר בצורת בסיס.\nשים לב: open כאן הוא פועל (נפתח), לא תואר (פתוח).\nטעות נפוצה: לכתוב "doesn\'t opens" או "isn\'t open" - הראשון שגוי דקדוקית, השני משנה משמעות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'We _______ have time for this right now. שלילה עם have.',
        options: ["doesn't", "don't", "haven't", "aren't"],
        correctAnswer: "don't",
        explanationHe: 'תשובה נכונה: don\'t\nכלל: have במשמעות "יש ל-" משתמש ב-don\'t/doesn\'t בשלילה (לא haven\'t!).\nשים לב: haven\'t משמש בזמן present perfect, לא בהווה פשוט.\nטעות נפוצה: לכתוב haven\'t - זה זמן אחר לגמרי (present perfect).',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'The children _______ (not/like) vegetables very much.',
        correctAnswer: "don't like",
        explanationHe: 'תשובה נכונה: don\'t like\nכלל: children = they (רבים), לכן don\'t. like הוא פועל סטטי אבל משתמש ב-don\'t בשלילה.\nשים לב: children נראה מיוחד אבל הוא פשוט צורת רבים של child.\nטעות נפוצה: לכתוב doesn\'t like - children הוא רבים!',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'It _______ matter what you think. שלילה עם it.',
        options: ["don't", "doesn't", "isn't", "not"],
        correctAnswer: "doesn't",
        explanationHe: 'תשובה נכונה: doesn\'t\nכלל: it = גוף שלישי יחיד, לכן doesn\'t. matter הוא פועל רגיל.\nשים לב: "It doesn\'t matter" = זה לא משנה - ביטוי נפוץ מאוד.\nטעות נפוצה: לכתוב don\'t - it דורש doesn\'t.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'You _______ need to come if you are busy. שלילה עם you.',
        options: ["doesn't", "don't", "aren't", "not"],
        correctAnswer: "don't",
        explanationHe: 'תשובה נכונה: don\'t\nכלל: you משתמש ב-don\'t (לא doesn\'t), גם כשמדברים לאדם אחד.\nשים לב: you תמיד לוקח don\'t, גם ביחיד וגם ברבים.\nטעות נפוצה: לכתוב doesn\'t עם you כשמדברים לאדם אחד - you תמיד עם don\'t.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'My best friend _______ (not/drink) coffee at all.',
        correctAnswer: "doesn't drink",
        explanationHe: 'תשובה נכונה: doesn\'t drink\nכלל: friend = he/she (יחיד), לכן doesn\'t. drink נשאר בצורת בסיס.\nשים לב: "at all" = בכלל, מחזק את השלילה.\nטעות נפוצה: לכתוב "doesn\'t drinks" - הפועל אחרי doesn\'t תמיד בסיס.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'They _______ want to participate in the competition. שלילה עם want.',
        options: ["doesn't", "don't", "aren't", "not want"],
        correctAnswer: "don't",
        explanationHe: 'תשובה נכונה: don\'t\nכלל: they = רבים, לכן don\'t. want הוא פועל סטטי אבל משתמש ב-don\'t בשלילה.\nשים לב: want, need, like - כל הפעלים הסטטיים משתמשים ב-don\'t/doesn\'t.\nטעות נפוצה: לכתוב "not want" בלי do - חייבים don\'t לפני הפועל.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (not/remember) my name.',
        correctAnswer: "doesn't remember",
        explanationHe: 'תשובה נכונה: doesn\'t remember\nכלל: she = יחיד, לכן doesn\'t. remember הוא פועל סטטי מנטלי אבל משתמש ב-doesn\'t.\nשים לב: פעלי זיכרון וחשיבה (remember, forget, know) משתמשים ב-don\'t/doesn\'t בשלילה.\nטעות נפוצה: לכתוב "doesn\'t remembers" - אחרי doesn\'t הפועל תמיד בסיס.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'The train _______ stop at this station. שלילה עם נושא יחיד.',
        options: ["don't", "doesn't", "isn't", "not stops"],
        correctAnswer: "doesn't",
        explanationHe: 'תשובה נכונה: doesn\'t\nכלל: train = it (יחיד), לכן doesn\'t. stop נשאר בצורת בסיס.\nשים לב: כלי תחבורה ומכונות נחשבים ל-it.\nטעות נפוצה: לכתוב don\'t - train הוא יחיד (it), לא רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'multiple_choice',
        questionTextHe: 'I _______ care what people say about me. שלילה עם care.',
        options: ["doesn't", "don't", "am not", "not"],
        correctAnswer: "don't",
        explanationHe: 'תשובה נכונה: don\'t\nכלל: I משתמש ב-don\'t (אף פעם לא doesn\'t!). care הוא פועל רגיל.\nשים לב: "I don\'t care" = לא אכפת לי - ביטוי נפוץ מאוד.\nטעות נפוצה: לכתוב "am not care" - care הוא פועל רגיל, לא תואר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'fill_in_blank',
        questionTextHe: 'The company _______ (not/allow) employees to work from home.',
        correctAnswer: "doesn't allow",
        explanationHe: 'תשובה נכונה: doesn\'t allow\nכלל: company = it (יחיד), לכן doesn\'t. allow נשאר בצורת בסיס.\nשים לב: ארגונים וחברות נחשבים ל-it (יחיד) באנגלית אמריקאית.\nטעות נפוצה: לכתוב "doesn\'t allows" - הפועל אחרי doesn\'t תמיד בסיס.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'Dogs _______ see colors the way humans do. שלילה עם נושא רבים.',
        options: ["doesn't", "don't", "aren't", "isn't"],
        correctAnswer: "don't",
        explanationHe: 'תשובה נכונה: don\'t\nכלל: dogs = they (רבים), לכן don\'t. see נשאר בצורת בסיס.\nשים לב: כשמדברים על בעלי חיים בכלליות (dogs, cats) זה תמיד רבים.\nטעות נפוצה: לכתוב doesn\'t - dogs הוא רבים!',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (not/own) a car; he uses public transportation.',
        correctAnswer: "doesn't own",
        explanationHe: 'תשובה נכונה: doesn\'t own\nכלל: he = יחיד, לכן doesn\'t. own הוא פועל סטטי של בעלות אבל משתמש ב-doesn\'t.\nשים לב: own, possess, belong - פעלי בעלות משתמשים ב-don\'t/doesn\'t בשלילה.\nטעות נפוצה: לכתוב "doesn\'t owns" - הפועל אחרי doesn\'t תמיד בסיס.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'We _______ usually eat out during the week. מיקום usually בשלילה.',
        options: ["doesn't", "don't", "aren't", "not"],
        correctAnswer: "don't",
        explanationHe: 'תשובה נכונה: don\'t\nכלל: we = רבים, לכן don\'t. usually יכול לבוא לפני או אחרי don\'t.\nשים לב: בשלילה, usually בדרך כלל מופיע אחרי don\'t: "don\'t usually" או לפניו: "usually don\'t".\nטעות נפוצה: לשכוח את ה-don\'t ולכתוב רק "usually eat" בשלילה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: 'The store _______ (not/accept) credit cards, only cash.',
        correctAnswer: "doesn't accept",
        explanationHe: 'תשובה נכונה: doesn\'t accept\nכלל: store = it (יחיד), לכן doesn\'t. accept נשאר בצורת בסיס.\nשים לב: מקומות עסקיים (store, shop, restaurant) נחשבים ל-it.\nטעות נפוצה: לכתוב "doesn\'t accepts" - הפועל אחרי doesn\'t תמיד בסיס.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'My teacher _______ give homework on Fridays. שלילה עם נושא מיוחד.',
        options: ["don't", "doesn't", "isn't", "not give"],
        correctAnswer: "doesn't",
        explanationHe: 'תשובה נכונה: doesn\'t\nכלל: teacher = he/she (יחיד), לכן doesn\'t. give נשאר בצורת בסיס.\nשים לב: תפקידים ומקצועות ביחיד (teacher, doctor, manager) לוקחים doesn\'t.\nטעות נפוצה: לכתוב don\'t - teacher הוא יחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'fill_in_blank',
        questionTextHe: 'Cats _______ (not/bark), they meow.',
        correctAnswer: "don't bark",
        explanationHe: 'תשובה נכונה: don\'t bark\nכלל: cats = they (רבים), לכן don\'t. bark נשאר בצורת בסיס.\nשים לב: כשמשווים בין בעלי חיים, משתמשים בהווה פשוט לעובדות כלליות.\nטעות נפוצה: לכתוב doesn\'t bark - cats הוא רבים!',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'multiple_choice',
        questionTextHe: 'The sun _______ shine at night.',
        options: ["don't", "doesn't", "isn't", "not shines"],
        correctAnswer: "doesn't",
        explanationHe: 'תשובה נכונה: doesn\'t\nכלל: sun = it (יחיד), לכן doesn\'t. shine נשאר בצורת בסיס.\nשים לב: עובדות טבע משתמשות בהווה פשוט, גם בשלילה.\nטעות נפוצה: לכתוב "doesn\'t shines" - הפועל אחרי doesn\'t תמיד בסיס.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (not/think) this is a good idea.',
        correctAnswer: "don't think",
        explanationHe: 'תשובה נכונה: don\'t think\nכלל: I משתמש ב-don\'t. think הוא פועל מנטלי אבל משתמש ב-don\'t בשלילה.\nשים לב: "I don\'t think" = אני לא חושב - ביטוי נפוץ מאוד להבעת דעה.\nטעות נפוצה: לכתוב "am not think" - think הוא פועל רגיל, לא be.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'multiple_choice',
        questionTextHe: 'These shoes _______ fit me properly.',
        options: ["doesn't", "don't", "isn't", "aren't"],
        correctAnswer: "don't",
        explanationHe: 'תשובה נכונה: don\'t\nכלל: shoes = they (תמיד רבים!), לכן don\'t. fit נשאר בצורת בסיס.\nשים לב: shoes, pants, glasses - תמיד רבים באנגלית, גם אם זה זוג אחד.\nטעות נפוצה: לכתוב doesn\'t - shoes הוא תמיד רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'fill_in_blank',
        questionTextHe: 'My brother _______ (not/play) video games anymore.',
        correctAnswer: "doesn't play",
        explanationHe: 'תשובה נכונה: doesn\'t play\nכלל: brother = he (יחיד), לכן doesn\'t. play נשאר בצורת בסיס.\nשים לב: "anymore" = יותר, מופיע בדרך כלל בסוף משפט שלילי.\nטעות נפוצה: לכתוב "doesn\'t plays" - הפועל אחרי doesn\'t תמיד בסיס.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'multiple_choice',
        questionTextHe: 'We _______ agree with your decision.',
        options: ["doesn't", "don't", "aren't", "not"],
        correctAnswer: "don't",
        explanationHe: 'תשובה נכונה: don\'t\nכלל: we = רבים, לכן don\'t. agree הוא פועל רגיל.\nשים לב: agree עם with = להסכים עם.\nטעות נפוצה: לכתוב "not agree" בלי do - חייבים don\'t לפני הפועל.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'fill_in_blank',
        questionTextHe: 'The government _______ (not/support) this proposal.',
        correctAnswer: "doesn't support",
        explanationHe: 'תשובה נכונה: doesn\'t support\nכלל: government = it (יחיד באנגלית אמריקאית), לכן doesn\'t. support נשאר בצורת בסיס.\nשים לב: ארגונים ממשלתיים נחשבים ל-it (יחיד) באנגלית אמריקאית.\nטעות נפוצה: לכתוב don\'t - government הוא יחיד באנגלית אמריקאית.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'multiple_choice',
        questionTextHe: 'You _______ seem very happy today.',
        options: ["doesn't", "don't", "aren't", "isn't"],
        correctAnswer: "don't",
        explanationHe: 'תשובה נכונה: don\'t\nכלל: you משתמש ב-don\'t. seem הוא פועל חיבור אבל משתמש ב-don\'t בשלילה.\nשים לב: seem = להיראות/להישמע, פועל שמתאר תפיסה.\nטעות נפוצה: לכתוב "aren\'t" - seem הוא פועל רגיל, לא be.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'fill_in_blank',
        questionTextHe: 'This app _______ (not/work) on my phone.',
        correctAnswer: "doesn't work",
        explanationHe: 'תשובה נכונה: doesn\'t work\nכלל: app = it (יחיד), לכן doesn\'t. work נשאר בצורת בסיס.\nשים לב: אפליקציות ותוכנות נחשבות ל-it.\nטעות נפוצה: לכתוב "doesn\'t works" - הפועל אחרי doesn\'t תמיד בסיס.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'multiple_choice',
        questionTextHe: 'People _______ always tell the truth.',
        options: ["doesn't", "don't", "isn't", "aren't"],
        correctAnswer: "don't",
        explanationHe: 'תשובה נכונה: don\'t\nכלל: people = they (תמיד רבים!), לכן don\'t. tell נשאר בצורת בסיס.\nשים לב: people הוא צורת רבים של person, תמיד לוקח don\'t.\nטעות נפוצה: לכתוב doesn\'t - people הוא תמיד רבים.',
        difficulty: 'hard'
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
        questionTextHe: '_______ your brother speak French? שאלה עם נושא יחיד.',
        options: ['Do', 'Does', 'Is', 'Are'],
        correctAnswer: 'Does',
        explanationHe: 'תשובה נכונה: Does\nכלל: brother = he (גוף שלישי יחיד), לכן משתמשים ב-Does בשאלה. הפועל speak נשאר בצורת בסיס.\nשים לב: מבנה השאלה: Does + נושא + פועל בסיס + שאר המשפט?\nטעות נפוצה: לכתוב "Does your brother speaks" - הפועל אחרי Does תמיד בסיס.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: '_______ the students understand the lesson?',
        correctAnswer: 'Do',
        explanationHe: 'תשובה נכונה: Do\nכלל: students = they (רבים), לכן Do. understand נשאר בצורת בסיס.\nשים לב: students הוא רבים, לכן Do (לא Does).\nטעות נפוצה: לכתוב Does כי students נשמע רשמי - אבל זה רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'Where _______ she work? שאלת מידע עם wh-.',
        options: ['do', 'does', 'is', 'are'],
        correctAnswer: 'does',
        explanationHe: 'תשובה נכונה: does\nכלל: במילות שאלה (where, when, why), מבנה: Wh- + do/does + נושא + פועל? she = does.\nשים לב: מיקום: Where does she work? (לא Where she works?)\nטעות נפוצה: לכתוב "Where does she works" - הפועל אחרי does תמיד בסיס.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'What time _______ the store open? שאלה על זמן.',
        options: ['do', 'does', 'is', 'are'],
        correctAnswer: 'does',
        explanationHe: 'תשובה נכונה: does\nכלל: store = it (יחיד), לכן does. "What time" = באיזו שעה.\nשים לב: What time does + יחיד / What time do + רבים.\nטעות נפוצה: לכתוב is - store open כאן זה פועל (נפתח), לא תואר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'How often _______ you exercise?',
        correctAnswer: 'do',
        explanationHe: 'תשובה נכונה: do\nכלל: you תמיד לוקח do (לא does!). "How often" = באיזו תדירות.\nשים לב: How often מציין תדירות ודורש הווה פשוט.\nטעות נפוצה: לכתוב does עם you - you תמיד עם do.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: '_______ it rain a lot in your country? שאלה עם it.',
        options: ['Do', 'Does', 'Is', 'Are'],
        correctAnswer: 'Does',
        explanationHe: 'תשובה נכונה: Does\nכלל: it = גוף שלישי יחיד, לכן Does. rain כאן הוא פועל (יורד גשם).\nשים לב: it בשאלות מזג אוויר תמיד לוקח does.\nטעות נפוצה: לכתוב Is - rain כאן פועל, לא שם עצם.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'Why _______ they always arrive late?',
        correctAnswer: 'do',
        explanationHe: 'תשובה נכונה: do\nכלל: they = רבים, לכן do. תדירות (always) מופיעה אחרי הנושא בשאלה.\nשים לב: מבנה: Why do + נושא + always/usually + פועל?\nטעות נפוצה: לכתוב does - they תמיד עם do.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: '_______ your sister have a car? שאלה עם have.',
        options: ['Do', 'Does', 'Has', 'Is'],
        correctAnswer: 'Does',
        explanationHe: 'תשובה נכונה: Does\nכלל: sister = she (יחיד), לכן Does. have נשאר בצורת בסיס (לא has!).\nשים לב: בשאלה: Does she have? (לא Has she? באנגלית מודרנית)\nטעות נפוצה: לכתוב Has - זה סגנון בריטי ישן, במודרני משתמשים ב-Does.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'When _______ the train leave? שאלת זמן.',
        options: ['do', 'does', 'is', 'are'],
        correctAnswer: 'does',
        explanationHe: 'תשובה נכונה: does\nכלל: train = it (יחיד), לכן does. When = מתי.\nשים לב: לוחות זמנים משתמשים בהווה פשוט, לכן צריך does.\nטעות נפוצה: לכתוב do - train הוא יחיד (it).',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: '_______ I need to bring anything to the party?',
        correctAnswer: 'Do',
        explanationHe: 'תשובה נכונה: Do\nכלל: I משתמש ב-Do (לא Does!). need הוא פועל סטטי אבל משתמש ב-do בשאלות.\nשים לב: I/you/we/they → Do; he/she/it → Does.\nטעות נפוצה: לכתוב Does עם I - תמיד Do.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'How _______ this machine work? שאלת אופן.',
        options: ['do', 'does', 'is', 'are'],
        correctAnswer: 'does',
        explanationHe: 'תשובה נכונה: does\nכלל: machine = it (יחיד), לכן does. How = איך.\nשים לב: How does + יחיד מציין אופן פעולה.\nטעות נפוצה: לכתוב do - machine הוא יחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: '_______ we have to finish this today?',
        correctAnswer: 'Do',
        explanationHe: 'תשובה נכונה: Do\nכלל: we = רבים, לכן Do. "have to" = חייבים.\nשים לב: Do we have to = האם אנחנו חייבים - ביטוי נפוץ.\nטעות נפוצה: לכתוב Does - we תמיד עם Do.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'What _______ he want for his birthday? שאלת מושא.',
        options: ['do', 'does', 'is', 'are'],
        correctAnswer: 'does',
        explanationHe: 'תשובה נכונה: does\nכלל: he = יחיד, לכן does. What = מה.\nשים לב: What does he want? - what הוא מושא, לא נושא.\nטעות נפוצה: לכתוב "What does he wants" - הפועל אחרי does תמיד בסיס.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'multiple_choice',
        questionTextHe: '_______ the children play outside every day? שאלה עם children.',
        options: ['Do', 'Does', 'Is', 'Are'],
        correctAnswer: 'Do',
        explanationHe: 'תשובה נכונה: Do\nכלל: children = they (רבים), לכן Do.\nשים לב: children נראה מיוחד אבל זה פשוט רבים של child.\nטעות נפוצה: לכתוב Does - children הוא רבים!',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'fill_in_blank',
        questionTextHe: 'Which bus _______ go to the airport?',
        correctAnswer: 'does',
        explanationHe: 'תשובה נכונה: does\nכלל: bus = it (יחיד), לכן does. Which = איזה.\nשים לב: Which bus asks about selection from options.\nטעות נפוצה: לכתוב do - bus הוא יחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: '_______ you and your wife work together? שאלה עם נושא מורכב.',
        options: ['Do', 'Does', 'Is', 'Are'],
        correctAnswer: 'Do',
        explanationHe: 'תשובה נכונה: Do\nכלל: "you and your wife" = you (רבים), לכן Do.\nשים לב: כשיש "and" בנושא, זה רבים.\nטעות נפוצה: לכתוב Does - נושאים מחוברים ב-and תמיד רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'Who _______ in this office?',
        correctAnswer: 'works',
        explanationHe: 'תשובה נכונה: works\nכלל: כש-who הוא הנושא (לא מושא), הפועל לוקח s (כאילו זה he/she). לא צריך does!\nשים לב: Who works? (לא Who does work?) - who כנושא לא דורש does.\nטעות נפוצה: לכתוב "Who does work" - כש-who הוא נושא, משתמשים בפועל ישיר עם s.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'How many languages _______ she speak? שאלת כמות.',
        options: ['do', 'does', 'is', 'are'],
        correctAnswer: 'does',
        explanationHe: 'תשובה נכונה: does\nכלל: she = יחיד, לכן does. "How many" = כמה.\nשים לב: How many + שם עצם רבים + does + יחיד?\nטעות נפוצה: לכתוב do בגלל languages (רבים), אבל הנושא הוא she.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: '_______ anyone know the answer?',
        correctAnswer: 'Does',
        explanationHe: 'תשובה נכונה: Does\nכלל: anyone = anybody = מישהו (יחיד), לכן Does.\nשים לב: anyone, everyone, someone, no one - כולם יחיד ולוקחים does.\nטעות נפוצה: לכתוב Do - anyone נשמע רבים אבל הוא יחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'Where _______ your parents live? שאלת מקום עם נושא רבים.',
        options: ['do', 'does', 'is', 'are'],
        correctAnswer: 'do',
        explanationHe: 'תשובה נכונה: do\nכלל: parents = they (רבים), לכן do. Where = איפה.\nשים לב: Where do they live? - סדר מילים קבוע בשאלה.\nטעות נפוצה: לכתוב does - parents הוא רבים!',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'fill_in_blank',
        questionTextHe: '_______ everybody understand the instructions?',
        correctAnswer: 'Does',
        explanationHe: 'תשובה נכונה: Does\nכלל: everybody = everyone (יחיד), לכן Does.\nשים לב: everybody, everyone, everything - כולם יחיד ולוקחים does.\nטעות נפוצה: לכתוב Do - everybody נשמע רבים אבל דקדוקית הוא יחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'multiple_choice',
        questionTextHe: 'Why _______ people believe that?',
        options: ['do', 'does', 'is', 'are'],
        correctAnswer: 'do',
        explanationHe: 'תשובה נכונה: do\nכלל: people = they (תמיד רבים!), לכן do.\nשים לב: people הוא צורת רבים של person.\nטעות נפוצה: לכתוב does - people תמיד רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'fill_in_blank',
        questionTextHe: 'What kind of music _______ you like?',
        correctAnswer: 'do',
        explanationHe: 'תשובה נכונה: do\nכלל: you תמיד לוקח do. "What kind of" = איזה סוג של.\nשים לב: What kind of + שם עצם + do/does + נושא + פועל?\nטעות נפוצה: לכתוב does עם you - תמיד do.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'multiple_choice',
        questionTextHe: '_______ the library close on Sundays?',
        options: ['Do', 'Does', 'Is', 'Are'],
        correctAnswer: 'Does',
        explanationHe: 'תשובה נכונה: Does\nכלל: library = it (יחיד), לכן Does. close כאן הוא פועל (נסגר).\nשים לב: לוחות זמנים של מקומות משתמשים בהווה פשוט.\nטעות נפוצה: לכתוב Is - close כאן פועל, לא תואר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'fill_in_blank',
        questionTextHe: 'How much _______ this cost?',
        correctAnswer: 'does',
        explanationHe: 'תשובה נכונה: does\nכלל: this = it (יחיד), לכן does. "How much" = כמה עולה.\nשים לב: How much does + יחיד / How much do + רבים.\nטעות נפוצה: לכתוב is - cost כאן פועל (עולה), לא שם עצם.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'multiple_choice',
        questionTextHe: '_______ Tom and Sarah work for the same company?',
        options: ['Do', 'Does', 'Is', 'Are'],
        correctAnswer: 'Do',
        explanationHe: 'תשובה נכונה: Do\nכלל: Tom and Sarah = they (רבים), לכן Do.\nשים לב: שני נושאים מחוברים ב-and = רבים.\nטעות נפוצה: לכתוב Does - שני נושאים עם and תמיד רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'fill_in_blank',
        questionTextHe: 'What time _______ you usually wake up?',
        correctAnswer: 'do',
        explanationHe: 'תשובה נכונה: do\nכלל: you תמיד לוקח do. usually מופיע אחרי הנושא בשאלה.\nשים לב: מבנה: What time do + נושא + usually + פועל?\nטעות נפוצה: לכתוב does עם you - תמיד do.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'multiple_choice',
        questionTextHe: '_______ nobody want to volunteer?',
        options: ['Do', 'Does', 'Is', 'Are'],
        correctAnswer: 'Does',
        explanationHe: 'תשובה נכונה: Does\nכלל: nobody = no one (יחיד), לכן Does.\nשים לב: nobody, no one, nothing - כולם יחיד ולוקחים does.\nטעות נפוצה: לכתוב Do - nobody נשמע כמו רבים אבל הוא יחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'fill_in_blank',
        questionTextHe: 'Who _______ you call when you need help?',
        correctAnswer: 'do',
        explanationHe: 'תשובה נכונה: do\nכלל: כש-who הוא מושא (לא נושא), משתמשים ב-do/does רגיל. you = do.\nשים לב: Who do you call? (who = מושא) ≠ Who calls you? (who = נושא)\nטעות נפוצה: לא להבחין בין who כנושא (אין do) ל-who כמושא (צריך do).',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'multiple_choice',
        questionTextHe: '_______ these scissors work properly?',
        options: ['Do', 'Does', 'Is', 'Are'],
        correctAnswer: 'Do',
        explanationHe: 'תשובה נכונה: Do\nכלל: scissors = they (תמיד רבים!), לכן Do.\nשים לב: scissors, pants, glasses - תמיד רבים באנגלית.\nטעות נפוצה: לכתוב Does - scissors הוא תמיד רבים.',
        difficulty: 'hard'
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
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'Does she like pizza? → Yes, she _______.',
        options: ['do', 'does', 'is', 'likes'],
        correctAnswer: 'does',
        explanationHe: 'עם she בתשובה חיובית משתמשים ב-does',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'Do you speak Spanish? → No, _______ _______.',
        correctAnswer: "I don't",
        explanationHe: 'עם I בתשובה שלילית: No, I don\'t',
        difficulty: 'easy'
      },
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'Does your brother work here? → No, he _______.',
        options: ["don't", "doesn't", "isn't", "not"],
        correctAnswer: "doesn't",
        explanationHe: 'brother = he, בתשובה שלילית: doesn\'t',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'Do your parents live nearby? → Yes, _______ _______.',
        correctAnswer: 'they do',
        explanationHe: 'parents = they, בתשובה חיובית: Yes, they do',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'Does it rain a lot here? → Yes, it _______.',
        options: ['do', 'does', 'is', 'rains'],
        correctAnswer: 'does',
        explanationHe: 'עם it בתשובה חיובית משתמשים ב-does',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'Do we need to hurry? → No, _______ _______.',
        correctAnswer: "we don't",
        explanationHe: 'עם we בתשובה שלילית: No, we don\'t',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'Does the museum open on Mondays? → No, it _______.',
        options: ["don't", "doesn't", "isn't", "not"],
        correctAnswer: "doesn't",
        explanationHe: 'museum = it, בתשובה שלילית: doesn\'t',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'fill_in_blank',
        questionTextHe: 'Do you and your sister get along? → Yes, _______ _______.',
        correctAnswer: 'we do',
        explanationHe: 'תשובה נכונה: we do\nכלל: "you and your sister" = we (רבים), לכן do.\nשים לב: כשמדברים אליך ועוד מישהו, התשובה היא we.\nטעות נפוצה: לכתוב "yes, they do" - התשובה צריכה להיות we כי זה כולל אותך.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: 'Does anyone know the answer? → Yes, someone _______.',
        options: ['do', 'does', 'is', 'knows'],
        correctAnswer: 'does',
        explanationHe: 'תשובה נכונה: does\nכלל: anyone/someone = יחיד, לכן does.\nשים לב: someone, somebody, anyone, anybody - כולם יחיד.\nטעות נפוצה: לכתוב do - אלו כינויים יחידים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'fill_in_blank',
        questionTextHe: 'Do the children play outside? → Yes, _______ _______.',
        correctAnswer: 'they do',
        explanationHe: 'תשובה נכונה: they do\nכלל: children = they (רבים), לכן do.\nשים לב: children תמיד מקבל תשובה עם they do.\nטעות נפוצה: לכתוב "yes, it does" - children הוא רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'multiple_choice',
        questionTextHe: 'Does everybody understand? → No, not everyone _______.',
        options: ['do', 'does', 'is', 'understands'],
        correctAnswer: 'does',
        explanationHe: 'תשובה נכונה: does\nכלל: everybody/everyone = יחיד, לכן does.\nשים לב: "not everyone" = לא כולם - תשובה חלקית.\nטעות נפוצה: לכתוב do - everybody הוא יחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'fill_in_blank',
        questionTextHe: 'Does your teacher give homework? → Yes, _______ _______.',
        correctAnswer: 'she does',
        explanationHe: 'תשובה נכונה: she does (או he does)\nכלל: teacher = he/she (יחיד), לכן does.\nשים לב: צריך להשתמש בכינוי המתאים (he/she) בהתאם למין.\nטעות נפוצה: לכתוב "yes, teacher does" - צריך כינוי, לא שם עצם.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'Do people often make this mistake? → Yes, they _______.',
        options: ['do', 'does', 'are', 'make'],
        correctAnswer: 'do',
        explanationHe: 'תשובה נכונה: do\nכלל: people = they (תמיד רבים!), לכן do.\nשים לב: people תמיד מקבל תשובה עם they do/don\'t.\nטעות נפוצה: לכתוב does - people הוא רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'Does the train stop here? → No, _______ _______.',
        correctAnswer: "it doesn't",
        explanationHe: 'תשובה נכונה: it doesn\'t\nכלל: train = it (יחיד), לכן doesn\'t.\nשים לב: כלי תחבורה מקבלים תשובה עם it.\nטעות נפוצה: לכתוב "no, they don\'t" - train הוא יחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'Do you both agree? → Yes, we _______.',
        options: ['do', 'does', 'are', 'agree'],
        correctAnswer: 'do',
        explanationHe: 'תשובה נכונה: do\nכלל: "you both" = you (רבים), התשובה היא we do.\nשים לב: כשמדברים לשני אנשים, התשובה היא we.\nטעות נפוצה: לכתוב "yes, they do" - כשמדברים אליך צריך we.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: 'Does this make sense? → Yes, _______ _______.',
        correctAnswer: 'it does',
        explanationHe: 'תשובה נכונה: it does\nכלל: this = it (יחיד), לכן does.\nשים לב: this, that, everything - כולם מקבלים it does/doesn\'t.\nטעות נפוצה: לכתוב "yes, this does" - צריך כינוי it.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'Do Tom and Sarah know each other? → Yes, they _______.',
        options: ['do', 'does', 'are', 'know'],
        correctAnswer: 'do',
        explanationHe: 'תשובה נכונה: do\nכלל: שני נושאים עם and = they (רבים), לכן do.\nשים לב: שמות מחוברים ב-and מקבלים תשובה עם they.\nטעות נפוצה: לכתוב does - שני נושאים תמיד רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'fill_in_blank',
        questionTextHe: 'Does nobody care? → No, someone _______.',
        correctAnswer: 'does',
        explanationHe: 'תשובה נכונה: does\nכלל: nobody/someone = יחיד, לכן does.\nשים לב: תשובה על nobody יכולה להיות someone does.\nטעות נפוצה: לכתוב do - אלו כינויים יחידים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'multiple_choice',
        questionTextHe: 'Do these shoes fit? → No, they _______.',
        options: ["don't", "doesn't", "aren't", "not"],
        correctAnswer: "don't",
        explanationHe: 'תשובה נכונה: don\'t\nכלל: shoes = they (תמיד רבים!), לכן don\'t.\nשים לב: shoes, pants, glasses - תמיד רבים, תמיד they.\nטעות נפוצה: לכתוב doesn\'t - shoes הוא תמיד רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'fill_in_blank',
        questionTextHe: 'Does the company offer benefits? → Yes, _______ _______.',
        correctAnswer: 'it does',
        explanationHe: 'תשובה נכונה: it does\nכלל: company = it (יחיד באנגלית אמריקאית), לכן does.\nשים לב: ארגונים וחברות = it באנגלית אמריקאית.\nטעות נפוצה: לכתוב they do - company הוא יחיד באנגלית אמריקאית.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'multiple_choice',
        questionTextHe: 'Do I have to come? → No, you _______.',
        options: ["don't", "doesn't", "aren't", "not"],
        correctAnswer: "don't",
        explanationHe: 'תשובה נכונה: don\'t\nכלל: כשהשאלה על "I", התשובה היא "you".\nשים לב: Do I...? → No, you don\'t. (מחליפים את הכינויים)\nטעות נפוצה: לכתוב "no, I don\'t" - התשובה צריכה להיות you.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'fill_in_blank',
        questionTextHe: 'Does everything work properly? → Yes, _______ _______.',
        correctAnswer: 'it does',
        explanationHe: 'תשובה נכונה: it does\nכלל: everything = it (יחיד), לכן does.\nשים לב: everything, something, nothing - כולם it.\nטעות נפוצה: לכתוב they do - everything הוא יחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'multiple_choice',
        questionTextHe: 'Do most students pass the exam? → Yes, they _______.',
        options: ['do', 'does', 'are', 'pass'],
        correctAnswer: 'do',
        explanationHe: 'תשובה נכונה: do\nכלל: students = they (רבים), לכן do.\nשים לב: "most students" עדיין רבים, לכן they do.\nטעות נפוצה: לכתוב does בגלל "most" - עדיין רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'fill_in_blank',
        questionTextHe: 'Does either option work? → Yes, _______ _______.',
        correctAnswer: 'it does',
        explanationHe: 'תשובה נכונה: it does\nכלל: either = אחת מהן (יחיד), לכן does.\nשים לב: either/neither תמיד יחיד ולוקח does.\nטעות נפוצה: לכתוב they do - either הוא יחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'multiple_choice',
        questionTextHe: 'Does none of them work? → Yes, none of them _______.',
        options: ['do', 'does', 'is', 'works'],
        correctAnswer: 'does',
        explanationHe: 'תשובה נכונה: does\nכלל: none = אף אחד (יחיד), לכן does.\nשים לב: "none of them" דקדוקית יחיד, אם כי יש ויכוח.\nטעות נפוצה: לכתוב do - דקדוקית none הוא יחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'fill_in_blank',
        questionTextHe: 'Does the team practice daily? → Yes, _______ _______.',
        correctAnswer: 'it does',
        explanationHe: 'תשובה נכונה: it does (אמריקאי) או they do (בריטי)\nכלל: team = it (אמריקאי) או they (בריטי).\nשים לב: באנגלית אמריקאית, team = it. בבריטית, team = they.\nטעות נפוצה: לבלבל בין השימוש האמריקאי והבריטי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'multiple_choice',
        questionTextHe: 'Do you remember me? → Yes, I _______.',
        options: ['do', 'does', 'am', 'remember'],
        correctAnswer: 'do',
        explanationHe: 'תשובה נכונה: do\nכלל: כשהשאלה "Do you...?", התשובה היא "Yes, I do".\nשים לב: Do you...? → Yes, I do. (מחליפים you ל-I)\nטעות נפוצה: לכתוב "yes, you do" - צריך להחליף את הכינוי.',
        difficulty: 'hard'
      }
    ]
  },

  // New subtopic: Imperatives
  {
    topicNumber: 1,
    subtopicNumber: '1.6',
    titleEn: 'Imperatives',
    titleHe: 'ציווי ופקודות',
    level: 'beginner',
    orderIndex: 6,
    theoryContentHe: `
<h2>ציווי ופקודות באנגלית</h2>
<p class="subtitle">Imperatives in English</p>

<div class="formula">
  <div class="formula-title">מבנה משפט ציווי:</div>
  <div class="formula-content" dir="ltr">Verb (infinitive without 'to') + rest of sentence</div>
  <div class="formula-explanation">(פועל בצורת הבסיס + המשך המשפט)</div>
</div>

<div class="rules">
  <h3>כללים:</h3>

  <div class="rule-section">
    <h4>1. ציווי חיובי (Positive Imperatives):</h4>
    <p>משתמשים בצורת הבסיס של הפועל בלי 'to'</p>
    <ul>
      <li><strong>Open</strong> the door. - פתח את הדלת</li>
      <li><strong>Sit</strong> down, please. - שב, בבקשה</li>
      <li><strong>Listen</strong> carefully. - הקשב היטב</li>
      <li><strong>Come</strong> here. - בוא לכאן</li>
    </ul>
  </div>

  <div class="rule-section">
    <h4>2. ציווי שלילי (Negative Imperatives):</h4>
    <p>משתמשים ב-Don't + צורת הבסיס של הפועל</p>
    <ul>
      <li><strong>Don't</strong> open the door. - אל תפתח את הדלת</li>
      <li><strong>Don't</strong> be late. - אל תאחר</li>
      <li><strong>Don't</strong> worry. - אל תדאג</li>
      <li><strong>Don't</strong> forget. - אל תשכח</li>
    </ul>
  </div>

  <div class="rule-section">
    <h4>3. ציווי מנומס עם Please:</h4>
    <p>מוסיפים Please בהתחלה או בסוף למשפט מנומס יותר</p>
    <ul>
      <li><strong>Please</strong> close the window. - סגור את החלון, בבקשה</li>
      <li>Wait here, <strong>please</strong>. - חכה כאן, בבקשה</li>
    </ul>
  </div>

  <div class="rule-section">
    <h4>4. ציווי עם Let's (הצעה):</h4>
    <p>Let's = Let us - משמש להצעה לעשות משהו ביחד</p>
    <ul>
      <li><strong>Let's</strong> go to the park. - בוא נלך לפארק</li>
      <li><strong>Let's</strong> eat lunch. - בוא נאכל ארוחת צהריים</li>
      <li><strong>Let's not</strong> be late. - בוא לא נאחר (שלילי)</li>
    </ul>
  </div>
</div>

<div class="examples">
  <p><strong>שימושים נפוצים:</strong></p>
  <p>הוראות: <strong>Turn</strong> left, then <strong>go</strong> straight.</p>
  <p>בקשות: <strong>Help</strong> me, please.</p>
  <p>עצות: <strong>Study</strong> hard for the test.</p>
  <p>אזהרות: <strong>Be</strong> careful! / <strong>Don't touch</strong> that!</p>
</div>
    `,
    exercises: [
      // EASY (1-5): Basic imperatives
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: '_______ the door, please.',
        options: ['Close', 'Closes', 'Closing', 'To close'],
        correctAnswer: 'Close',
        explanationHe: 'בציווי משתמשים בצורת הבסיס של הפועל - Close',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: '_______ quietly in the library.',
        options: ['Talk', 'Talks', 'Talking', 'To talk'],
        correctAnswer: 'Talk',
        explanationHe: 'בציווי משתמשים בצורת הבסיס - Talk',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: "_______ (sit) down, please.",
        correctAnswer: 'Sit',
        explanationHe: 'בציווי: Sit (צורת הבסיס)',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: "Don't _______ late.",
        options: ['be', 'is', 'are', 'being'],
        correctAnswer: 'be',
        explanationHe: "בציווי שלילי: Don't + צורת בסיס = Don't be",
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: "_______ (listen) carefully.",
        correctAnswer: 'Listen',
        explanationHe: 'בציווי משתמשים בצורת הבסיס - Listen',
        difficulty: 'easy'
      },
      // MEDIUM (6-15): Negative imperatives and polite forms
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: "_______ forget your homework.",
        options: ["Don't", "Doesn't", "Not", "Aren't"],
        correctAnswer: "Don't",
        explanationHe: "ציווי שלילי: Don't + פועל בסיס",
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: "_______ here, please. (wait)",
        correctAnswer: 'Wait',
        explanationHe: 'ציווי מנומס: Wait + please',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: "Let's _______ to the movies.",
        options: ['go', 'goes', 'going', 'to go'],
        correctAnswer: 'go',
        explanationHe: "Let's + צורת בסיס = Let's go",
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: "_______ _______ the window. (not open)",
        correctAnswer: "Don't open",
        explanationHe: "ציווי שלילי: Don't open",
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: "_______ careful when crossing the street.",
        options: ['Be', 'Is', 'Are', 'Being'],
        correctAnswer: 'Be',
        explanationHe: 'ציווי עם be: Be careful',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'fill_in_blank',
        questionTextHe: "Please _______ your name here. (write)",
        correctAnswer: 'write',
        explanationHe: 'ציווי מנומס: Please write',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: "_______ eat too much candy.",
        options: ["Don't", "Doesn't", "Not", "Aren't"],
        correctAnswer: "Don't",
        explanationHe: "ציווי שלילי: Don't eat",
        difficulty: 'medium'
      },
      {
        questionNumber: 13,
        type: 'fill_in_blank',
        questionTextHe: "_______ _______ for the test. (study hard)",
        correctAnswer: 'Study hard',
        explanationHe: 'ציווי: Study hard (בצורת הבסיס)',
        difficulty: 'medium'
      },
      {
        questionNumber: 14,
        type: 'multiple_choice',
        questionTextHe: "Let's _______ lunch together.",
        options: ['have', 'has', 'having', 'to have'],
        correctAnswer: 'have',
        explanationHe: "Let's + בסיס = Let's have",
        difficulty: 'medium'
      },
      {
        questionNumber: 15,
        type: 'fill_in_blank',
        questionTextHe: "_______ me your phone, please. (show)",
        correctAnswer: 'Show',
        explanationHe: 'ציווי: Show (בצורת הבסיס)',
        difficulty: 'medium'
      },
      // HARD (16-25): Complex imperatives and mixed forms
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: "_______ patient with your little brother.",
        options: ['Be', 'Is', 'Are', 'Being'],
        correctAnswer: 'Be',
        explanationHe: 'ציווי עם תואר: Be patient (היה סבלני)',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: "_______ _______ nervous about the exam. (not be)",
        correctAnswer: "Don't be",
        explanationHe: "ציווי שלילי עם be: Don't be nervous",
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: "Let's _______ be late for class.",
        options: ['not', "don't", 'no', "isn't"],
        correctAnswer: 'not',
        explanationHe: "Let's not + בסיס = Let's not be (הצעה שלילית)",
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: "_______ left at the traffic light, then _______ straight. (turn, go)",
        correctAnswer: 'Turn, go',
        explanationHe: 'רצף פקודות: Turn left, then go straight',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: "_______ yourself to some cake.",
        options: ['Help', 'Helps', 'Helping', 'To help'],
        correctAnswer: 'Help',
        explanationHe: 'ביטוי מיוחד: Help yourself = תשרת את עצמך',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'fill_in_blank',
        questionTextHe: "_______ _______ that mistake again. (not make)",
        correctAnswer: "Don't make",
        explanationHe: "ציווי שלילי: Don't make",
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'multiple_choice',
        questionTextHe: "_______ me know if you need help.",
        options: ['Let', 'Lets', 'Letting', 'To let'],
        correctAnswer: 'Let',
        explanationHe: 'ביטוי: Let me know = תודיע לי',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'fill_in_blank',
        questionTextHe: "_______ a break and _______ some water. (take, drink)",
        correctAnswer: 'Take, drink',
        explanationHe: 'שני ציוויים: Take a break and drink',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'multiple_choice',
        questionTextHe: "_______ worry, everything will be fine.",
        options: ["Don't", "Doesn't", "Not", "Aren't"],
        correctAnswer: "Don't",
        explanationHe: "ביטוי נפוץ: Don't worry = אל תדאג",
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'fill_in_blank',
        questionTextHe: "_______ the rules and _______ _______ cheat. (follow, not)",
        correctAnswer: "Follow, don't cheat",
        explanationHe: 'שילוב של ציווי חיובי ושלילי: Follow... and don\'t cheat',
        difficulty: 'hard'
      }
    ]
  },

  // New subtopic: Possessives
  {
    topicNumber: 1,
    subtopicNumber: '1.7',
    titleEn: 'Possessives',
    titleHe: 'שייכות',
    level: 'beginner',
    orderIndex: 7,
    theoryContentHe: `
<h2>ביטוי שייכות באנגלית</h2>
<p class="subtitle">Possessives in English</p>

<div class="rules">
  <h3>1. כינויי שייכות (Possessive Adjectives):</h3>
  <p>באים לפני שם עצם ומתארים שייכות</p>

  <table class="grammar-table">
    <tr>
      <th>כינוי גוף</th>
      <th>כינוי שייכות</th>
      <th>דוגמה</th>
    </tr>
    <tr>
      <td>I</td>
      <td><strong>my</strong></td>
      <td>my book - הספר שלי</td>
    </tr>
    <tr>
      <td>you</td>
      <td><strong>your</strong></td>
      <td>your car - המכונית שלך</td>
    </tr>
    <tr>
      <td>he</td>
      <td><strong>his</strong></td>
      <td>his name - השם שלו</td>
    </tr>
    <tr>
      <td>she</td>
      <td><strong>her</strong></td>
      <td>her house - הבית שלה</td>
    </tr>
    <tr>
      <td>it</td>
      <td><strong>its</strong></td>
      <td>its tail - הזנב שלו (של בעל חיים)</td>
    </tr>
    <tr>
      <td>we</td>
      <td><strong>our</strong></td>
      <td>our teacher - המורה שלנו</td>
    </tr>
    <tr>
      <td>they</td>
      <td><strong>their</strong></td>
      <td>their school - בית הספר שלהם</td>
    </tr>
  </table>

  <h3>2. שייכות עם 's (Possessive 's):</h3>
  <p>מוסיפים 's לשם עצם כדי להראות שייכות</p>

  <div class="rule-section">
    <h4>יחיד (Singular):</h4>
    <ul>
      <li>Tom<strong>'s</strong> book - הספר של טום</li>
      <li>The teacher<strong>'s</strong> desk - השולחן של המורה</li>
      <li>My sister<strong>'s</strong> room - החדר של אחותי</li>
    </ul>
  </div>

  <div class="rule-section">
    <h4>רבים המסתיים ב-s (Plural ending in 's'):</h4>
    <p>מוסיפים רק ' (גרש בלבד)</p>
    <ul>
      <li>The students<strong>'</strong> books - הספרים של התלמידים</li>
      <li>My parents<strong>'</strong> car - המכונית של הורי</li>
      <li>The teachers<strong>'</strong> room - חדר המורים</li>
    </ul>
  </div>

  <div class="rule-section">
    <h4>רבים לא מסתיים ב-s (Irregular plural):</h4>
    <p>מוסיפים 's כרגיל</p>
    <ul>
      <li>The children<strong>'s</strong> toys - הצעצועים של הילדים</li>
      <li>The men<strong>'s</strong> room - חדר הגברים</li>
      <li>The people<strong>'s</strong> choice - הבחירה של האנשים</li>
    </ul>
  </div>

  <h3>3. הבדל בין its ו-it's:</h3>
  <div class="warning-box">
    <p><strong>its</strong> = שייכות (שלו/שלה של דבר/בעל חיים)</p>
    <p>The dog wagged <strong>its</strong> tail. - הכלב כשכש בזנב שלו</p>

    <p><strong>it's</strong> = קיצור של it is או it has</p>
    <p><strong>It's</strong> raining. = It is raining. - יורד גשם</p>
  </div>
</div>

<div class="examples">
  <p><strong>דוגמאות נוספות:</strong></p>
  <p>This is <strong>my</strong> friend. - זה החבר שלי</p>
  <p><strong>Sarah's</strong> mother is a doctor. - אמא של שרה היא רופאה</p>
  <p>Where is <strong>your</strong> homework? - איפה שיעורי הבית שלך?</p>
  <p>The <strong>cat's</strong> food is on the table. - האוכל של החתול על השולחן</p>
</div>
    `,
    exercises: [
      // EASY (1-5): Basic possessive adjectives
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'This is _______ book.',
        options: ['my', 'me', 'I', 'mine'],
        correctAnswer: 'my',
        explanationHe: 'כינוי שייכות של I הוא my',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'Where is _______ car? (you)',
        options: ['your', 'you', 'yours', 'yous'],
        correctAnswer: 'your',
        explanationHe: 'כינוי שייכות של you הוא your',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'He loves _______ mother. (he)',
        correctAnswer: 'his',
        explanationHe: 'כינוי שייכות של he הוא his',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'She is reading _______ book.',
        options: ['her', 'she', 'hers', 'his'],
        correctAnswer: 'her',
        explanationHe: 'כינוי שייכות של she הוא her',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'We play in _______ garden. (we)',
        correctAnswer: 'our',
        explanationHe: 'כינוי שייכות של we הוא our',
        difficulty: 'easy'
      },
      // MEDIUM (6-15): Possessive 's and more complex forms
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'They love _______ school.',
        options: ['their', 'they', 'theirs', 'them'],
        correctAnswer: 'their',
        explanationHe: 'כינוי שייכות של they הוא their',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: "This is _______ book. (Tom)",
        correctAnswer: "Tom's",
        explanationHe: "שייכות עם 's: Tom's book",
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'The dog wagged _______ tail.',
        options: ['its', "it's", 'his', 'their'],
        correctAnswer: 'its',
        explanationHe: 'its = שלו (של בעל חיים/דבר), ללא גרש',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: "The _______ car is red. (teacher)",
        correctAnswer: "teacher's",
        explanationHe: "שייכות ליחיד: teacher's",
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: "_______ a beautiful day today.",
        options: ["It's", "Its", "It", "Is"],
        correctAnswer: "It's",
        explanationHe: "It's = It is (קיצור), עם גרש",
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'fill_in_blank',
        questionTextHe: "My _______ house is big. (parents)",
        correctAnswer: "parents'",
        explanationHe: 'רבים מסתיים ב-s: parents\' (רק גרש)',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: 'The _______ toys are on the floor.',
        options: ["children's", "childrens'", "childrens", "children"],
        correctAnswer: "children's",
        explanationHe: 'רבים לא מסתיים ב-s: children\'s (עם \'s)',
        difficulty: 'medium'
      },
      {
        questionNumber: 13,
        type: 'fill_in_blank',
        questionTextHe: "This is _______ sister. (Sarah)",
        correctAnswer: "Sarah's",
        explanationHe: "שייכות עם 's: Sarah's sister",
        difficulty: 'medium'
      },
      {
        questionNumber: 14,
        type: 'multiple_choice',
        questionTextHe: 'The cat lost _______ collar.',
        options: ['its', "it's", 'his', 'her'],
        correctAnswer: 'its',
        explanationHe: 'its = שייכות (ללא גרש) לבעל חיים',
        difficulty: 'medium'
      },
      {
        questionNumber: 15,
        type: 'fill_in_blank',
        questionTextHe: "The _______ room is upstairs. (students)",
        correctAnswer: "students'",
        explanationHe: 'רבים מסתיים ב-s: students\' (רק גרש)',
        difficulty: 'medium'
      },
      // HARD (16-25): Complex possessives and tricky cases
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: "The _______ shoes are expensive.",
        options: ["men's", "mens'", "mens", "men"],
        correctAnswer: "men's",
        explanationHe: 'רבים לא רגיל (men): men\'s shoes',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: "_______ raining outside. (It is)",
        correctAnswer: "It's",
        explanationHe: "It's = It is (עם גרש, לא שייכות)",
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'This is _______ and _______ house.',
        options: ['John and Mary\'s', 'John\'s and Mary\'s', 'Johns and Marys', 'John and Marys\''],
        correctAnswer: 'John and Mary\'s',
        explanationHe: 'שייכות משותפת: \'s רק בסוף (John and Mary\'s house)',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: "My _______ names are David and Sarah. (brothers)",
        correctAnswer: "brothers'",
        explanationHe: 'שני אחים (רבים): brothers\' names',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'The bird built _______ nest in the tree.',
        options: ['its', "it's", 'his', "bird's"],
        correctAnswer: 'its',
        explanationHe: 'its = שייכות (הקן שלו), ללא גרש',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'fill_in_blank',
        questionTextHe: "The _______ meeting is tomorrow. (teachers)",
        correctAnswer: "teachers'",
        explanationHe: 'רבים: teachers\' meeting (רק גרש)',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'multiple_choice',
        questionTextHe: "I forgot _______ lunch at home.",
        options: ['my', 'me', 'I', 'mine'],
        correctAnswer: 'my',
        explanationHe: 'כינוי שייכות לפני שם עצם: my lunch',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'fill_in_blank',
        questionTextHe: "The _______ tails are very long. (mice)",
        correctAnswer: "mice's",
        explanationHe: 'רבים לא רגיל (mice): mice\'s tails',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'multiple_choice',
        questionTextHe: "_______ time to go home.",
        options: ["It's", "Its", "It", "Is"],
        correctAnswer: "It's",
        explanationHe: "It's = It is (קיצור עם גרש)",
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'fill_in_blank',
        questionTextHe: "This is _______ jacket and that is _______ . (my brother, mine)",
        correctAnswer: "my brother's, mine",
        explanationHe: 'שייכות: my brother\'s jacket, mine = שלי (ללא שם עצם)',
        difficulty: 'hard'
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
    orderIndex: 8,
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
      // EASY (1-5)
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
        type: 'multiple_choice',
        questionTextHe: 'They _______ in London last year.',
        options: ['live', 'lived', 'lives', 'living'],
        correctAnswer: 'lived',
        explanationHe: 'live הופך ל-lived',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (watch) a movie yesterday.',
        correctAnswer: 'watched',
        explanationHe: 'watch הופך ל-watched בעבר (מוסיפים ed)',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'She _______ at home last night.',
        options: ['stay', 'stayed', 'stays', 'staying'],
        correctAnswer: 'stayed',
        explanationHe: 'stay הופך ל-stayed בעבר',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (walk) to school yesterday.',
        correctAnswer: 'walked',
        explanationHe: 'walk הופך ל-walked בעבר',
        difficulty: 'easy'
      },
      // MEDIUM (6-10)
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (study) last night.',
        correctAnswer: 'studied',
        explanationHe: 'study משנים ל-studied (y אחרי עיצור משתנה ל-ied)',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'They _______ hard yesterday.',
        options: ['work', 'worked', 'working', 'works'],
        correctAnswer: 'worked',
        explanationHe: 'פועל רגיל: work + ed = worked',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (try) to call you.',
        correctAnswer: 'tried',
        explanationHe: 'try משתנה ל-tried (y אחרי עיצור → ied)',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'We _______ pizza last night.',
        options: ['like', 'liked', 'likes', 'liking'],
        correctAnswer: 'liked',
        explanationHe: 'like מסתיים ב-e לכן רק מוסיפים d',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'The baby _______ (cry) all night.',
        correctAnswer: 'cried',
        explanationHe: 'cry משתנה ל-cried (y אחרי עיצור משתנה ל-ied)',
        difficulty: 'medium'
      },
      // HARD (11-30)
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'My brother _______ his room yesterday morning.',
        options: ['clean', 'cleaned', 'cleans', 'cleaning'],
        correctAnswer: 'cleaned',
        explanationHe: 'תשובה נכונה: cleaned. כלל: פעלים רגילים מקבלים ed בעבר פשוט. שים לב: yesterday morning מציין זמן עבר. טעות נפוצה: להשתמש בהווה clean במקום בעבר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (carry) the bags to the car.',
        correctAnswer: 'carried',
        explanationHe: 'תשובה נכונה: carried. כלל: פעלים שמסתיימים ב-y אחרי עיצור משנים ל-ied. שים לב: carry → carried (y משתנה ל-i). טעות נפוצה: לכתוב carryed במקום carried.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'We _______ to music all evening.',
        options: ['listen', 'listened', 'listening', 'listens'],
        correctAnswer: 'listened',
        explanationHe: 'תשובה נכונה: listened. כלל: all evening מצביע על פרק זמן שהסתיים בעבר ולכן משתמשים בעבר פשוט. שים לב: פועל רגיל listen + ed. טעות נפוצה: להתבלבל עם הווה ממושך.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'The teacher _______ (explain) the lesson carefully.',
        correctAnswer: 'explained',
        explanationHe: 'תשובה נכונה: explained. כלל: explain הוא פועל רגיל שמקבל ed. שים לב: הפועל מתאר פעולה שהסתיימה. טעות נפוצה: לשכוח להוסיף ed.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'I _______ my homework before dinner.',
        options: ['finish', 'finished', 'finishing', 'finishes'],
        correctAnswer: 'finished',
        explanationHe: 'תשובה נכונה: finished. כלל: before dinner מציין זמן בעבר ולכן נדרש עבר פשוט. שים לב: finish + ed = finished. טעות נפוצה: להשתמש בהווה finish.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (dance) at the party last Saturday.',
        correctAnswer: 'danced',
        explanationHe: 'תשובה נכונה: danced. כלל: פועל שמסתיים ב-e רק מוסיף d. שים לב: dance → danced (לא danceed). טעות נפוצה: להוסיף ed במקום רק d.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'My parents _______ a new house last year.',
        options: ['paint', 'painted', 'paints', 'painting'],
        correctAnswer: 'painted',
        explanationHe: 'תשובה נכונה: painted. כלל: last year מציין זמן עבר מוגדר. שים לב: paint + ed = painted. טעות נפוצה: להשתמש בהווה פשוט.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'The students _______ (worry) about the test.',
        correctAnswer: 'worried',
        explanationHe: 'תשובה נכונה: worried. כלל: worry מסתיים ב-y אחרי עיצור ולכן משתנה ל-ied. שים לב: worry → worried. טעות נפוצה: לכתוב worryied או worryed.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'She _______ her friend last week.',
        options: ['visit', 'visited', 'visits', 'visiting'],
        correctAnswer: 'visited',
        explanationHe: 'תשובה נכונה: visited. כלל: last week מציין זמן עבר ספציפי. שים לב: visit + ed = visited. טעות נפוצה: להתבלבל בין הווה לעבר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (enjoy) the concert very much.',
        correctAnswer: 'enjoyed',
        explanationHe: 'תשובה נכונה: enjoyed. כלל: enjoy הוא פועל רגיל - מוסיפים ed. שים לב: enjoy → enjoyed (y אחרי תנועה לא משתנה). טעות נפוצה: לחשוב ש-y משתנה גם אחרי תנועות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'The dog _______ at the mailman.',
        options: ['bark', 'barked', 'barks', 'barking'],
        correctAnswer: 'barked',
        explanationHe: 'תשובה נכונה: barked. כלל: מתאר פעולה שהסתיימה בעבר. שים לב: bark + ed = barked. טעות נפוצה: להשתמש בהווה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (bake) cookies yesterday afternoon.',
        correctAnswer: 'baked',
        explanationHe: 'תשובה נכונה: baked. כלל: פועל שמסתיים ב-e מוסיף רק d. שים לב: bake → baked. טעות נפוצה: לכתוב bakeed.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: 'They _______ their names on the paper.',
        options: ['copy', 'copied', 'copies', 'copying'],
        correctAnswer: 'copied',
        explanationHe: 'תשובה נכונה: copied. כלל: copy מסתיים ב-y אחרי עיצור ומשתנה ל-ied. שים לב: copy → copied. טעות נפוצה: לכתוב copyed.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: 'My sister _______ (talk) to her teacher after class.',
        correctAnswer: 'talked',
        explanationHe: 'תשובה נכונה: talked. כלל: after class מציין זמן בעבר. שים לב: talk + ed = talked. טעות נפוצה: לשכוח את ed.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: 'We _______ our car last month.',
        options: ['wash', 'washed', 'washes', 'washing'],
        correctAnswer: 'washed',
        explanationHe: 'תשובה נכונה: washed. כלל: last month מציין זמן עבר מוגדר. שים לב: wash + ed = washed. טעות נפוצה: להשתמש בהווה פשוט.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: 'The children _______ (jump) on the bed.',
        correctAnswer: 'jumped',
        explanationHe: 'תשובה נכונה: jumped. כלל: פועל רגיל שמקבל ed בעבר. שים לב: jump + ed = jumped. טעות נפוצה: לבלבל עם הווה ממושך.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'She _______ the door quietly.',
        options: ['close', 'closed', 'closes', 'closing'],
        correctAnswer: 'closed',
        explanationHe: 'תשובה נכונה: closed. כלל: close מסתיים ב-e ולכן מוסיף רק d. שים לב: close → closed. טעות נפוצה: לכתוב closeed.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (reply) to her email immediately.',
        correctAnswer: 'replied',
        explanationHe: 'תשובה נכונה: replied. כלל: reply מסתיים ב-y אחרי עיצור ומשתנה ל-ied. שים לב: reply → replied. טעות נפוצה: לכתוב replyed.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: 'They _______ hard for the exam.',
        options: ['prepare', 'prepared', 'prepares', 'preparing'],
        correctAnswer: 'prepared',
        explanationHe: 'תשובה נכונה: prepared. כלל: מתאר הכנה שהסתיימה בעבר. שים לב: prepare + d = prepared (מסתיים ב-e). טעות נפוצה: לכתוב prepareed.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (move) to a new apartment last summer.',
        correctAnswer: 'moved',
        explanationHe: 'תשובה נכונה: moved. כלל: last summer מציין זמן עבר. שים לב: move מסתיים ב-e ולכן רק מוסיף d. טעות נפוצה: לכתוב moveed.',
        difficulty: 'hard'
      }
    ]
  },
  {
    topicNumber: 2,
    subtopicNumber: '2.2',
    titleEn: 'Irregular Verbs',
    titleHe: 'פעלים לא רגילים',
    level: 'beginner',
    orderIndex: 9,
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
      // EASY (1-5)
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
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (have) lunch at noon.',
        correctAnswer: 'had',
        explanationHe: 'have הופך ל-had בעבר',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'He _______ his homework yesterday.',
        options: ['do', 'did', 'done', 'does'],
        correctAnswer: 'did',
        explanationHe: 'do הופך ל-did בעבר',
        difficulty: 'easy'
      },
      // MEDIUM (6-10)
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (make) a cake yesterday.',
        correctAnswer: 'made',
        explanationHe: 'make הופך ל-made בעבר (פועל לא רגיל)',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'She _______ to school by bus.',
        options: ['come', 'came', 'comed', 'comes'],
        correctAnswer: 'came',
        explanationHe: 'come הופך ל-came בעבר',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (take) the bus home.',
        correctAnswer: 'took',
        explanationHe: 'take הופך ל-took בעבר (פועל לא רגיל)',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'We _______ the answer.',
        options: ['know', 'knew', 'knowed', 'knows'],
        correctAnswer: 'knew',
        explanationHe: 'know הופך ל-knew בעבר',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (write) a letter.',
        correctAnswer: 'wrote',
        explanationHe: 'write הופך ל-wrote בעבר',
        difficulty: 'medium'
      },
      // HARD (11-30)
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'My sister _______ a beautiful song at the concert.',
        options: ['sing', 'sang', 'sung', 'singed'],
        correctAnswer: 'sang',
        explanationHe: 'תשובה נכונה: sang. כלל: sing הוא פועל לא רגיל שהופך ל-sang בעבר פשוט. שים לב: לא מוסיפים ed לפעלים לא רגילים. טעות נפוצה: לכתוב singed או sung.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (buy) a new phone last week.',
        correctAnswer: 'bought',
        explanationHe: 'תשובה נכונה: bought. כלל: buy הוא פועל לא רגיל שהופך ל-bought. שים לב: האיות משתנה לחלוטין. טעות נפוצה: לכתוב buyed.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'They _______ their car to work yesterday.',
        options: ['drive', 'drove', 'driven', 'drived'],
        correctAnswer: 'drove',
        explanationHe: 'תשובה נכונה: drove. כלל: drive הופך ל-drove בעבר פשוט. שים לב: אל תוסיף ed לפעלים לא רגילים. טעות נפוצה: לכתוב drived.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (drink) all the juice.',
        correctAnswer: 'drank',
        explanationHe: 'תשובה נכונה: drank. כלל: drink משתנה ל-drank בעבר. שים לב: התנועה משתנה מ-i ל-a. טעות נפוצה: לכתוב drinked או drunk.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'We _______ early this morning.',
        options: ['wake', 'woke', 'waked', 'woken'],
        correctAnswer: 'woke',
        explanationHe: 'תשובה נכונה: woke. כלל: wake הופך ל-woke בעבר פשוט. שים לב: פועל לא רגיל. טעות נפוצה: לכתוב waked.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (read) the book in one day.',
        correctAnswer: 'read',
        explanationHe: 'תשובה נכונה: read. כלל: read נכתב אותו דבר בהווה ובעבר אבל נהגה read (רד) בעבר. שים לב: האיות זהה אבל ההגייה שונה. טעות נפוצה: לחשוב שצריך להוסיף ed.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'I _______ my keys at home.',
        options: ['forget', 'forgot', 'forgotten', 'forgetted'],
        correctAnswer: 'forgot',
        explanationHe: 'תשובה נכונה: forgot. כלל: forget הופך ל-forgot בעבר פשוט. שים לב: פועל לא רגיל. טעות נפוצה: לכתוב forgetted.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (begin) her homework at 5 PM.',
        correctAnswer: 'began',
        explanationHe: 'תשובה נכונה: began. כלל: begin משתנה ל-began בעבר. שים לב: התנועה משתנה מ-i ל-a. טעות נפוצה: לכתוב beginned.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'They _______ the race.',
        options: ['win', 'won', 'winned', 'winning'],
        correctAnswer: 'won',
        explanationHe: 'תשובה נכונה: won. כלל: win הופך ל-won בעבר. שים לב: פועל לא רגיל, לא מוסיפים ed. טעות נפוצה: לכתוב winned.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (find) the treasure.',
        correctAnswer: 'found',
        explanationHe: 'תשובה נכונה: found. כלל: find הופך ל-found בעבר. שים לב: האיות משתנה. טעות נפוצה: לכתוב finded.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'He _______ on the chair.',
        options: ['sit', 'sat', 'sitted', 'sitting'],
        correctAnswer: 'sat',
        explanationHe: 'תשובה נכונה: sat. כלל: sit הופך ל-sat בעבר פשוט. שים לב: פועל לא רגיל. טעות נפוצה: לכתוב sitted.',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (give) her a present.',
        correctAnswer: 'gave',
        explanationHe: 'תשובה נכונה: gave. כלל: give משתנה ל-gave בעבר. שים לב: התנועה משתנה. טעות נפוצה: לכתוב gived.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: 'She _______ very fast.',
        options: ['run', 'ran', 'runned', 'running'],
        correctAnswer: 'ran',
        explanationHe: 'תשובה נכונה: ran. כלל: run הופך ל-ran בעבר פשוט. שים לב: פועל לא רגיל. טעות נפוצה: לכתוב runned.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (break) the window by accident.',
        correctAnswer: 'broke',
        explanationHe: 'תשובה נכונה: broke. כלל: break הופך ל-broke בעבר. שים לב: התנועה משתנה. טעות נפוצה: לכתוב breaked.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: 'I _______ him at the store.',
        options: ['meet', 'met', 'meeted', 'meeting'],
        correctAnswer: 'met',
        explanationHe: 'תשובה נכונה: met. כלל: meet הופך ל-met בעבר פשוט. שים לב: פועל לא רגיל. טעות נפוצה: לכתוב meeted.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (choose) the blue one.',
        correctAnswer: 'chose',
        explanationHe: 'תשובה נכונה: chose. כלל: choose הופך ל-chose בעבר. שים לב: האיות משתנה. טעות נפוצה: לכתוב choosed.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'She _______ the story to us.',
        options: ['tell', 'told', 'telled', 'telling'],
        correctAnswer: 'told',
        explanationHe: 'תשובה נכונה: told. כלל: tell הופך ל-told בעבר פשוט. שים לב: פועל לא רגיל. טעות נפוצה: לכתוב telled.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (bring) his dog to the park.',
        correctAnswer: 'brought',
        explanationHe: 'תשובה נכונה: brought. כלל: bring הופך ל-brought בעבר. שים לב: האיות משתנה לחלוטין. טעות נפוצה: לכתוב bringed.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: 'They _______ the truth.',
        options: ['understand', 'understood', 'understanded', 'understanding'],
        correctAnswer: 'understood',
        explanationHe: 'תשובה נכונה: understood. כלל: understand הופך ל-understood בעבר. שים לב: פועל לא רגיל. טעות נפוצה: לכתוב understanded.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (think) about you.',
        correctAnswer: 'thought',
        explanationHe: 'תשובה נכונה: thought. כלל: think הופך ל-thought בעבר. שים לב: האיות משתנה. טעות נפוצה: לכתוב thinked.',
        difficulty: 'hard'
      }
    ]
  },
  {
    topicNumber: 2,
    subtopicNumber: '2.3',
    titleEn: 'Negative Sentences',
    titleHe: 'משפטים שליליים',
    level: 'beginner',
    orderIndex: 10,
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
      // EASY (1-5)
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
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (not/watch) TV last night.',
        correctAnswer: "didn't watch",
        explanationHe: 'didn\'t + watch (צורת הבסיס)',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'He _______ come to the party.',
        options: ["don't", "doesn't", "didn't", "not"],
        correctAnswer: "didn't",
        explanationHe: 'בעבר שלילי: didn\'t',
        difficulty: 'easy'
      },
      // MEDIUM (6-10)
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (not/see) him yesterday.',
        correctAnswer: "didn't see",
        explanationHe: 'didn\'t + see (לא saw! הפועל חוזר לצורת הבסיס)',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'She _______ finish her homework.',
        options: ["didn't", "didn't finished", "doesn't", "not finished"],
        correctAnswer: "didn't",
        explanationHe: 'didn\'t + finish (הפועל בצורת הבסיס)',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (not/have) time.',
        correctAnswer: "didn't have",
        explanationHe: 'didn\'t + have (לא had! חוזר לצורת בסיס)',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'We _______ the answer.',
        options: ["didn't know", "didn't knew", "doesn't know", "not knew"],
        correctAnswer: "didn't know",
        explanationHe: 'didn\'t know (לא knew)',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (not/write) the letter.',
        correctAnswer: "didn't write",
        explanationHe: 'didn\'t + write (צורת הבסיס, לא wrote)',
        difficulty: 'medium'
      },
      // HARD (11-30)
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'My brother _______ his room yesterday.',
        options: ["didn't clean", "didn't cleaned", "doesn't clean", "not cleaned"],
        correctAnswer: "didn't clean",
        explanationHe: 'תשובה נכונה: didn\'t clean. כלל: didn\'t + פועל בצורת הבסיס (infinitive). שים לב: הפועל תמיד בצורת הבסיס אחרי didn\'t. טעות נפוצה: לכתוב didn\'t cleaned.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (not/study) for the test.',
        correctAnswer: "didn't study",
        explanationHe: 'תשובה נכונה: didn\'t study. כלל: בשלילה בעבר הפועל חוזר לצורת הבסיס. שים לב: didn\'t + study (לא studied). טעות נפוצה: לכתוב didn\'t studied.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'They _______ to the concert last night.',
        options: ["didn't go", "didn't went", "doesn't go", "not went"],
        correctAnswer: "didn't go",
        explanationHe: 'תשובה נכונה: didn\'t go. כלל: didn\'t + go (צורת בסיס). שים לב: go לא went אחרי didn\'t. טעות נפוצה: לכתוב didn\'t went.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (not/understand) the question.',
        correctAnswer: "didn't understand",
        explanationHe: 'תשובה נכונה: didn\'t understand. כלל: הפועל בצורת הבסיס אחרי didn\'t. שים לב: understand לא understood. טעות נפוצה: לכתוב didn\'t understood.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'We _______ any mistakes.',
        options: ["didn't make", "didn't made", "doesn't make", "not made"],
        correctAnswer: "didn't make",
        explanationHe: 'תשובה נכונה: didn\'t make. כלל: didn\'t + make (בסיס). שים לב: הפועל בצורת הבסיס. טעות נפוצה: לכתוב didn\'t made.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (not/bring) his bag.',
        correctAnswer: "didn't bring",
        explanationHe: 'תשובה נכונה: didn\'t bring. כלל: didn\'t + bring (בסיס, לא brought). שים לב: הפועל חוזר לצורת הבסיס. טעות נפוצה: לכתוב didn\'t brought.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'She _______ the book.',
        options: ["didn't read", "didn't readed", "doesn't read", "not read"],
        correctAnswer: "didn't read",
        explanationHe: 'תשובה נכונה: didn\'t read. כלל: didn\'t + read (צורת בסיס). שים לב: read בצורת הבסיס. טעות נפוצה: לכתוב didn\'t readed.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (not/take) the bus.',
        correctAnswer: "didn't take",
        explanationHe: 'תשובה נכונה: didn\'t take. כלל: didn\'t + take (לא took). שים לב: הפועל בצורת הבסיס אחרי didn\'t. טעות נפוצה: לכתוב didn\'t took.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'I _______ my homework.',
        options: ["didn't do", "didn't did", "doesn't do", "not did"],
        correctAnswer: "didn't do",
        explanationHe: 'תשובה נכונה: didn\'t do. כלל: didn\'t + do (בסיס, לא did). שים לב: do לא did אחרי didn\'t. טעות נפוצה: לכתוב didn\'t did.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (not/see) that movie.',
        correctAnswer: "didn't see",
        explanationHe: 'תשובה נכונה: didn\'t see. כלל: didn\'t + see (לא saw). שים לב: הפועל בצורת הבסיס. טעות נפוצה: לכתוב didn\'t saw.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'She _______ at the party.',
        options: ["didn't sing", "didn't sang", "doesn't sing", "not sang"],
        correctAnswer: "didn't sing",
        explanationHe: 'תשובה נכונה: didn\'t sing. כלל: didn\'t + sing (בסיס). שים לב: sing לא sang. טעות נפוצה: לכתוב didn\'t sang.',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (not/eat) breakfast.',
        correctAnswer: "didn't eat",
        explanationHe: 'תשובה נכונה: didn\'t eat. כלל: didn\'t + eat (לא ate). שים לב: הפועל בצורת הבסיס. טעות נפוצה: לכתוב didn\'t ate.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: 'They _______ their names.',
        options: ["didn't write", "didn't wrote", "doesn't write", "not wrote"],
        correctAnswer: "didn't write",
        explanationHe: 'תשובה נכונה: didn\'t write. כלל: didn\'t + write (בסיס, לא wrote). שים לב: הפועל בצורת הבסיס. טעות נפוצה: לכתוב didn\'t wrote.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (not/forget) your birthday.',
        correctAnswer: "didn't forget",
        explanationHe: 'תשובה נכונה: didn\'t forget. כלל: didn\'t + forget (לא forgot). שים לב: הפועל חוזר לצורת הבסיס. טעות נפוצה: לכתוב didn\'t forgot.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: 'We _______ the answer.',
        options: ["didn't find", "didn't found", "doesn't find", "not found"],
        correctAnswer: "didn't find",
        explanationHe: 'תשובה נכונה: didn\'t find. כלל: didn\'t + find (בסיס). שים לב: find לא found אחרי didn\'t. טעות נפוצה: לכתוב didn\'t found.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (not/come) to school.',
        correctAnswer: "didn't come",
        explanationHe: 'תשובה נכונה: didn\'t come. כלל: didn\'t + come (לא came). שים לב: הפועל בצורת הבסיס. טעות נפוצה: לכתוב didn\'t came.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'He _______ the race.',
        options: ["didn't win", "didn't won", "doesn't win", "not won"],
        correctAnswer: "didn't win",
        explanationHe: 'תשובה נכונה: didn\'t win. כלל: didn\'t + win (בסיס, לא won). שים לב: הפועל בצורת הבסיס. טעות נפוצה: לכתוב didn\'t won.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (not/drink) coffee.',
        correctAnswer: "didn't drink",
        explanationHe: 'תשובה נכונה: didn\'t drink. כלל: didn\'t + drink (לא drank). שים לב: הפועל חוזר לצורת הבסיס. טעות נפוצה: לכתוב didn\'t drank.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: 'I _______ the meeting.',
        options: ["didn't forget", "didn't forgot", "doesn't forget", "not forgot"],
        correctAnswer: "didn't forget",
        explanationHe: 'תשובה נכונה: didn\'t forget. כלל: didn\'t + forget (בסיס). שים לב: forget לא forgot. טעות נפוצה: לכתוב didn\'t forgot.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (not/hear) the news.',
        correctAnswer: "didn't hear",
        explanationHe: 'תשובה נכונה: didn\'t hear. כלל: didn\'t + hear (לא heard). שים לב: הפועל בצורת הבסיס. טעות נפוצה: לכתוב didn\'t heard.',
        difficulty: 'hard'
      }
    ]
  },
  {
    topicNumber: 2,
    subtopicNumber: '2.4',
    titleEn: 'Questions',
    titleHe: 'שאלות',
    level: 'beginner',
    orderIndex: 11,
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
      // EASY (1-5)
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
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: '_______ they watch TV last night?',
        correctAnswer: 'Did',
        explanationHe: 'בשאלות בעבר: Did + they',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'Did he come? → No, he _______.',
        options: ["don't", "doesn't", "didn't", "not"],
        correctAnswer: "didn't",
        explanationHe: 'בתשובה שלילית: No, he didn\'t',
        difficulty: 'easy'
      },
      // MEDIUM (6-10)
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: '_______ you see the movie?',
        correctAnswer: 'Did',
        explanationHe: 'Did + you + see (צורת בסיס)',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: '_______ she study last night?',
        options: ['Do', 'Does', 'Did', 'Done'],
        correctAnswer: 'Did',
        explanationHe: 'בעבר משתמשים ב-Did עם כל הכינויים',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'Did they have lunch? → Yes, they _______.',
        correctAnswer: 'did',
        explanationHe: 'תשובה קצרה חיובית: Yes, they did',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: '_______ he finish his homework?',
        options: ['Do', 'Does', 'Did', 'Done'],
        correctAnswer: 'Did',
        explanationHe: 'Did + he + finish (בסיס)',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'Did you go? → No, I _______.',
        correctAnswer: "didn't",
        explanationHe: 'תשובה קצרה שלילית: No, I didn\'t',
        difficulty: 'medium'
      },
      // HARD (11-30)
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: '_______ your brother clean his room yesterday?',
        options: ['Do', 'Does', 'Did', 'Done'],
        correctAnswer: 'Did',
        explanationHe: 'תשובה נכונה: Did. כלל: בשאלות בעבר משתמשים ב-Did עם כל הכינויים. שים לב: Did + subject + verb (בסיס). טעות נפוצה: להשתמש ב-Does או Do.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: '_______ she write the letter?',
        correctAnswer: 'Did',
        explanationHe: 'תשובה נכונה: Did. כלל: Did + subject + verb בצורת הבסיס. שים לב: write לא wrote בשאלה. טעות נפוצה: לשכוח את Did.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'Did they go to the party? → Yes, they _______.',
        options: ['do', 'does', 'did', 'went'],
        correctAnswer: 'did',
        explanationHe: 'תשובה נכונה: did. כלל: בתשובות קצרות משתמשים ב-did/didn\'t. שים לב: Yes, they did (לא went). טעות נפוצה: לענות Yes, they went.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: '_______ you understand the lesson?',
        correctAnswer: 'Did',
        explanationHe: 'תשובה נכונה: Did. כלל: Did + you + understand (בסיס). שים לב: understand לא understood בשאלה. טעות נפוצה: לכתוב understood במקום understand.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'Did she eat breakfast? → No, she _______.',
        options: ["don't", "doesn't", "didn't", "not"],
        correctAnswer: "didn't",
        explanationHe: 'תשובה נכונה: didn\'t. כלל: בתשובות שליליות קצרות משתמשים ב-didn\'t. שים לב: No, she didn\'t. טעות נפוצה: להשתמש ב-doesn\'t.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: '_______ he bring his book?',
        correctAnswer: 'Did',
        explanationHe: 'תשובה נכונה: Did. כלל: Did + he + bring (בסיס, לא brought). שים לב: הפועל בצורת הבסיס. טעות נפוצה: לכתוב brought במקום bring.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: '_______ they see the movie?',
        options: ['Do', 'Does', 'Did', 'Done'],
        correctAnswer: 'Did',
        explanationHe: 'תשובה נכונה: Did. כלל: בשאלות בעבר משתמשים ב-Did. שים לב: see לא saw בשאלה. טעות נפוצה: לכתוב saw במקום see.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'Did you have fun? → Yes, I _______.',
        correctAnswer: 'did',
        explanationHe: 'תשובה נכונה: did. כלל: תשובה קצרה חיובית בעבר. שים לב: Yes, I did. טעות נפוצה: לענות Yes, I had.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: '_______ she know the answer?',
        options: ['Do', 'Does', 'Did', 'Known'],
        correctAnswer: 'Did',
        explanationHe: 'תשובה נכונה: Did. כלל: Did + she + know (בסיס). שים לב: know לא knew בשאלה. טעות נפוצה: לכתוב knew במקום know.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: '_______ we win the game?',
        correctAnswer: 'Did',
        explanationHe: 'תשובה נכונה: Did. כלל: Did + we + win (בסיס, לא won). שים לב: הפועל בצורת הבסיס. טעות נפוצה: לכתוב won במקום win.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'Did he come home? → No, he _______.',
        options: ["don't", "doesn't", "didn't", "not came"],
        correctAnswer: "didn't",
        explanationHe: 'תשובה נכונה: didn\'t. כלל: תשובה קצרה שלילית. שים לב: No, he didn\'t (לא not came). טעות נפוצה: לכתוב doesn\'t.',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: '_______ they finish their work?',
        correctAnswer: 'Did',
        explanationHe: 'תשובה נכונה: Did. כלל: Did + they + finish (בסיס). שים לב: finish לא finished בשאלה. טעות נפוצה: לכתוב finished במקום finish.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: '_______ you take the bus?',
        options: ['Do', 'Does', 'Did', 'Took'],
        correctAnswer: 'Did',
        explanationHe: 'תשובה נכונה: Did. כלל: Did + you + take (בסיס, לא took). שים לב: הפועל בצורת הבסיס. טעות נפוצה: לכתוב took במקום take.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: 'Did she sing? → Yes, she _______.',
        correctAnswer: 'did',
        explanationHe: 'תשובה נכונה: did. כלל: תשובה קצרה חיובית. שים לב: Yes, she did (לא sang). טעות נפוצה: לענות Yes, she sang.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: '_______ he read the book?',
        options: ['Do', 'Does', 'Did', 'Read'],
        correctAnswer: 'Did',
        explanationHe: 'תשובה נכונה: Did. כלל: Did + he + read (בסיס). שים לב: read בצורת הבסיס. טעות נפוצה: להתבלבל עם הגייה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: '_______ we make a mistake?',
        correctAnswer: 'Did',
        explanationHe: 'תשובה נכונה: Did. כלל: Did + we + make (בסיס, לא made). שים לב: הפועל בצורת הבסיס. טעות נפוצה: לכתוב made במקום make.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'Did you buy it? → No, I _______.',
        options: ["don't", "doesn't", "didn't", "not bought"],
        correctAnswer: "didn't",
        explanationHe: 'תשובה נכונה: didn\'t. כלל: תשובה קצרה שלילית. שים לב: No, I didn\'t (לא not bought). טעות נפוצה: להשתמש ב-don\'t.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: '_______ she tell you?',
        correctAnswer: 'Did',
        explanationHe: 'תשובה נכונה: Did. כלל: Did + she + tell (בסיס, לא told). שים לב: הפועל בצורת הבסיס. טעות נפוצה: לכתוב told במקום tell.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: '_______ they find it?',
        options: ['Do', 'Does', 'Did', 'Found'],
        correctAnswer: 'Did',
        explanationHe: 'תשובה נכונה: Did. כלל: Did + they + find (בסיס). שים לב: find לא found בשאלה. טעות נפוצה: לכתוב found במקום find.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: 'Did he help? → Yes, he _______.',
        correctAnswer: 'did',
        explanationHe: 'תשובה נכונה: did. כלל: תשובה קצרה חיובית בעבר. שים לב: Yes, he did. טעות נפוצה: לענות Yes, he helped.',
        difficulty: 'hard'
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
    orderIndex: 12,
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
      // EASY (1-5)
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
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (read) a book.',
        correctAnswer: 'is reading',
        explanationHe: 'עם he: is + reading',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'We _______ studying English.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'are',
        explanationHe: 'עם we משתמשים ב-are',
        difficulty: 'easy'
      },
      // MEDIUM (6-10)
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'You _______ (listen) to music.',
        correctAnswer: 'are listening',
        explanationHe: 'עם you: are + listening (הווה ממושך)',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'My sister _______ cooking dinner.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'is',
        explanationHe: 'my sister = she, לכן is',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'The children _______ (play) outside.',
        correctAnswer: 'are playing',
        explanationHe: 'children = they, לכן are + playing',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'It _______ raining now.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'is',
        explanationHe: 'עם it משתמשים ב-is',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'My parents _______ (work) at home.',
        correctAnswer: 'are working',
        explanationHe: 'parents = they, לכן are + working',
        difficulty: 'medium'
      },
      // HARD (11-30)
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'The teacher _______ explaining the lesson right now.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: the teacher = he/she (יחיד), לכן משתמשים ב-is. שים לב: right now מציין פעולה שקורה ברגע זה. טעות נפוצה: להשתמש ב-are.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (do) my homework at the moment.',
        correctAnswer: 'am doing',
        explanationHe: 'תשובה נכונה: am doing. כלל: I + am + verb-ing בהווה ממושך. שים לב: at the moment מציין זמן עכשיו. טעות נפוצה: להשתמש ב-is doing.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'My friends _______ waiting for me.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: friends = they (רבים), לכן are. שים לב: waiting מציין פעולה מתמשכת. טעות נפוצה: להשתמש ב-is.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'The baby _______ (sleep) now.',
        correctAnswer: 'is sleeping',
        explanationHe: 'תשובה נכונה: is sleeping. כלל: baby = it (יחיד), לכן is + verb-ing. שים לב: now מציין פעולה הקורית עכשיו. טעות נפוצה: להשתמש ב-are sleeping.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'You _______ talking too loudly!',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: you תמיד לוקח are בהווה ממושך. שים לב: משפט מתאר פעולה שקורה כעת. טעות נפוצה: להשתמש ב-is.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'My brother _______ (study) for his exam.',
        correctAnswer: 'is studying',
        explanationHe: 'תשובה נכונה: is studying. כלל: brother = he (יחיד), לכן is + studying. שים לב: y אחרי תנועה לא משתנה. טעות נפוצה: להשתמש ב-are studying.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'The birds _______ singing in the tree.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: birds = they (רבים), לכן are. שים לב: מתאר פעולה שקורה עכשיו. טעות נפוצה: להשתמש ב-is.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (have) lunch right now.',
        correctAnswer: 'are having',
        explanationHe: 'תשובה נכונה: are having. כלל: we + are + verb-ing. שים לב: right now מציין פעולה הקורית ברגע זה. טעות נפוצה: להשתמש ב-is having.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'The dog _______ barking at the mailman.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: dog = it (יחיד), לכן is. שים לב: barking מתאר פעולה מתמשכת. טעות נפוצה: להשתמש ב-are.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (write) an email.',
        correctAnswer: 'am writing',
        explanationHe: 'תשובה נכונה: am writing. כלל: I + am + verb-ing. שים לב: write → writing (מורידים e). טעות נפוצה: להשתמש ב-is writing.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'The students _______ taking a test.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: students = they (רבים), לכן are. שים לב: taking מתאר פעולה בתהליך. טעות נפוצה: להשתמש ב-is.',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (talk) on the phone.',
        correctAnswer: 'is talking',
        explanationHe: 'תשובה נכונה: is talking. כלל: she + is + verb-ing. שים לב: talk + ing = talking. טעות נפוצה: להשתמש ב-are talking.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: 'My father _______ driving to work.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: father = he (יחיד), לכן is. שים לב: drive → driving (מורידים e). טעות נפוצה: להשתמש ב-are.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (clean) their room.',
        correctAnswer: 'are cleaning',
        explanationHe: 'תשובה נכונה: are cleaning. כלל: they + are + verb-ing. שים לב: clean + ing = cleaning. טעות נפוצה: להשתמש ב-is cleaning.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: 'The cat _______ sleeping on the sofa.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: cat = it (יחיד), לכן is. שים לב: sleep + ing = sleeping. טעות נפוצה: להשתמש ב-are.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (learn) English this year.',
        correctAnswer: 'are learning',
        explanationHe: 'תשובה נכונה: are learning. כלל: we + are + verb-ing. שים לב: this year מציין תקופה זמנית. טעות נפוצה: להשתמש ב-is learning.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'The children _______ drawing pictures.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: children = they (רבים), לכן are. שים לב: draw → drawing. טעות נפוצה: להשתמש ב-is.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (sing) a song.',
        correctAnswer: 'is singing',
        explanationHe: 'תשובה נכונה: is singing. כלל: he + is + verb-ing. שים לב: sing + ing = singing. טעות נפוצה: להשתמש ב-are singing.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: 'I _______ feeling tired today.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'am',
        explanationHe: 'תשובה נכונה: am. כלל: I + am + verb-ing. שים לב: feeling מתאר מצב זמני. טעות נפוצה: להשתמש ב-is.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: 'The sun _______ (shine) brightly.',
        correctAnswer: 'is shining',
        explanationHe: 'תשובה נכונה: is shining. כלל: sun = it (יחיד), לכן is + shining. שים לב: shine → shining (מורידים e). טעות נפוצה: להשתמש ב-are shining.',
        difficulty: 'hard'
      }
    ]
  },
  {
    topicNumber: 3,
    subtopicNumber: '3.2',
    titleEn: 'Spelling Rules',
    titleHe: 'כללי כתיב',
    level: 'beginner',
    orderIndex: 13,
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
      // EASY (1-5)
      {
        questionNumber: 1,
        type: 'fill_in_blank',
        questionTextHe: 'I am _______ (play) football.',
        correctAnswer: 'playing',
        explanationHe: 'play → playing (רגיל)',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'She is _______ (eat) lunch.',
        correctAnswer: 'eating',
        explanationHe: 'eat → eating (רגיל)',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'They are _______ (read) books.',
        correctAnswer: 'reading',
        explanationHe: 'read → reading (רגיל)',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'He is _______ (watch) TV.',
        correctAnswer: 'watching',
        explanationHe: 'watch → watching (רגיל)',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'We are _______ (study) English.',
        correctAnswer: 'studying',
        explanationHe: 'study → studying (y אחרי תנועה לא משתנה)',
        difficulty: 'easy'
      },
      // MEDIUM (6-10)
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'She is _______ (make) a cake.',
        correctAnswer: 'making',
        explanationHe: 'make → making (מורידים e)',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'They are _______ (run).',
        correctAnswer: 'running',
        explanationHe: 'run → running (מכפילים n)',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'I am _______ (write) a letter.',
        correctAnswer: 'writing',
        explanationHe: 'write → writing (מורידים e)',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'He is _______ (sit) down.',
        correctAnswer: 'sitting',
        explanationHe: 'sit → sitting (מכפילים t)',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'We are _______ (dance).',
        correctAnswer: 'dancing',
        explanationHe: 'dance → dancing (מורידים e)',
        difficulty: 'medium'
      },
      // HARD (11-30)
      {
        questionNumber: 11,
        type: 'fill_in_blank',
        questionTextHe: 'She is _______ (swim) in the pool.',
        correctAnswer: 'swimming',
        explanationHe: 'תשובה נכונה: swimming. כלל: פועל עיצור-תנועה-עיצור מכפיל את העיצור האחרון. שים לב: swim → swimming (מכפילים m). טעות נפוצה: לכתוב swiming.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'They are _______ (come) to the party.',
        correctAnswer: 'coming',
        explanationHe: 'תשובה נכונה: coming. כלל: פועל שמסתיים ב-e מורידים את ה-e לפני ing. שים לב: come → coming. טעות נפוצה: לכתוב comeing.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'fill_in_blank',
        questionTextHe: 'I am _______ (get) ready.',
        correctAnswer: 'getting',
        explanationHe: 'תשובה נכונה: getting. כלל: get הוא עיצור-תנועה-עיצור ומכפיל את ה-t. שים לב: get → getting. טעות נפוצה: לכתוב geting.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'He is _______ (drive) carefully.',
        correctAnswer: 'driving',
        explanationHe: 'תשובה נכונה: driving. כלל: drive מסתיים ב-e ולכן מורידים אותו. שים לב: drive → driving. טעות נפוצה: לכתוב driveing.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'fill_in_blank',
        questionTextHe: 'We are _______ (put) the books away.',
        correctAnswer: 'putting',
        explanationHe: 'תשובה נכונה: putting. כלל: put הוא פועל קצר שמכפיל את העיצור האחרון. שים לב: put → putting. טעות נפוצה: לכתוב puting.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'She is _______ (take) pictures.',
        correctAnswer: 'taking',
        explanationHe: 'תשובה נכונה: taking. כלל: take מסתיים ב-e ולכן מורידים אותו לפני ing. שים לב: take → taking. טעות נפוצה: לכתוב takeing.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'They are _______ (stop) at the red light.',
        correctAnswer: 'stopping',
        explanationHe: 'תשובה נכונה: stopping. כלל: stop הוא עיצור-תנועה-עיצור שמכפיל את ה-p. שים לב: stop → stopping. טעות נפוצה: לכתוב stoping.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'I am _______ (hope) for good news.',
        correctAnswer: 'hoping',
        explanationHe: 'תשובה נכונה: hoping. כלל: hope מסתיים ב-e ולכן מורידים אותו. שים לב: hope → hoping. טעות נפוצה: לכתוב hopeing.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: 'He is _______ (cut) the paper.',
        correctAnswer: 'cutting',
        explanationHe: 'תשובה נכונה: cutting. כלל: cut הוא פועל קצר שמכפיל את ה-t. שים לב: cut → cutting. טעות נפוצה: לכתוב cuting.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'We are _______ (smile) for the photo.',
        correctAnswer: 'smiling',
        explanationHe: 'תשובה נכונה: smiling. כלל: smile מסתיים ב-e ולכן מורידים אותו לפני ing. שים לב: smile → smiling. טעות נפוצה: לכתוב smileing.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'fill_in_blank',
        questionTextHe: 'She is _______ (shop) for clothes.',
        correctAnswer: 'shopping',
        explanationHe: 'תשובה נכונה: shopping. כלל: shop הוא עיצור-תנועה-עיצור שמכפיל את ה-p. שים לב: shop → shopping. טעות נפוצה: לכתוב shoping.',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: 'They are _______ (move) to a new house.',
        correctAnswer: 'moving',
        explanationHe: 'תשובה נכונה: moving. כלל: move מסתיים ב-e ולכן מורידים אותו. שים לב: move → moving. טעות נפוצה: לכתוב moveing.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'fill_in_blank',
        questionTextHe: 'I am _______ (plan) my vacation.',
        correctAnswer: 'planning',
        explanationHe: 'תשובה נכונה: planning. כלל: plan הוא עיצור-תנועה-עיצור שמכפיל את ה-n. שים לב: plan → planning. טעות נפוצה: לכתוב planing.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: 'He is _______ (give) a presentation.',
        correctAnswer: 'giving',
        explanationHe: 'תשובה נכונה: giving. כלל: give מסתיים ב-e ולכן מורידים אותו לפני ing. שים לב: give → giving. טעות נפוצה: לכתוב giveing.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'fill_in_blank',
        questionTextHe: 'We are _______ (enjoy) the party.',
        correctAnswer: 'enjoying',
        explanationHe: 'תשובה נכונה: enjoying. כלל: enjoy מסתיים ב-y אחרי תנועה ולכן לא משתנה. שים לב: enjoy → enjoying (y לא משתנה). טעות נפוצה: לחשוב ש-y משתנה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: 'She is _______ (win) the race.',
        correctAnswer: 'winning',
        explanationHe: 'תשובה נכונה: winning. כלל: win הוא עיצור-תנועה-עיצור שמכפיל את ה-n. שים לב: win → winning. טעות נפוצה: לכתוב wining.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'fill_in_blank',
        questionTextHe: 'They are _______ (hide) from us.',
        correctAnswer: 'hiding',
        explanationHe: 'תשובה נכונה: hiding. כלל: hide מסתיים ב-e ולכן מורידים אותו. שים לב: hide → hiding. טעות נפוצה: לכתוב hideing.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: 'I am _______ (begin) to understand.',
        correctAnswer: 'beginning',
        explanationHe: 'תשובה נכונה: beginning. כלל: begin מסתיים בעיצור-תנועה-עיצור ומכפיל את ה-n. שים לב: begin → beginning. טעות נפוצה: לכתוב begining.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'fill_in_blank',
        questionTextHe: 'He is _______ (use) the computer.',
        correctAnswer: 'using',
        explanationHe: 'תשובה נכונה: using. כלל: use מסתיים ב-e ולכן מורידים אותו לפני ing. שים לב: use → using. טעות נפוצה: לכתוב useing.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: 'We are _______ (let) them play.',
        correctAnswer: 'letting',
        explanationHe: 'תשובה נכונה: letting. כלל: let הוא פועל קצר שמכפיל את ה-t. שים לב: let → letting. טעות נפוצה: לכתוב leting.',
        difficulty: 'hard'
      }
    ]
  },
  {
    topicNumber: 3,
    subtopicNumber: '3.3',
    titleEn: 'Negative & Questions',
    titleHe: 'שלילה ושאלות',
    level: 'beginner',
    orderIndex: 14,
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
      // EASY (1-5)
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
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: '_______ he reading?',
        correctAnswer: 'Is',
        explanationHe: 'בשאלה עם he: Is he...?',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'I _______ eating now.',
        options: ["am not", "isn't", "aren't", "don't"],
        correctAnswer: "am not",
        explanationHe: 'עם I משתמשים ב-am not',
        difficulty: 'easy'
      },
      // MEDIUM (6-10)
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: '_______ they playing football?',
        correctAnswer: 'Are',
        explanationHe: 'בשאלה עם they: Are they...?',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'We _______ studying right now.',
        options: ["am not", "isn't", "aren't", "don't"],
        correctAnswer: "aren't",
        explanationHe: 'עם we: are not = aren\'t',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: '_______ she sleeping?',
        correctAnswer: 'Is',
        explanationHe: 'בשאלה: Is + she + verb-ing?',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'He _______ listening to music.',
        options: ["am not", "isn't", "aren't", "don't"],
        correctAnswer: "isn't",
        explanationHe: 'עם he: is not = isn\'t',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: '_______ we going home?',
        correctAnswer: 'Are',
        explanationHe: 'בשאלה: Are + we + verb-ing?',
        difficulty: 'medium'
      },
      // HARD (11-30)
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'The children _______ playing outside.',
        options: ["am not", "isn't", "aren't", "don't"],
        correctAnswer: "aren't",
        explanationHe: 'תשובה נכונה: aren\'t. כלל: children = they (רבים), לכן are not. שים לב: aren\'t = are not. טעות נפוצה: להשתמש ב-isn\'t.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: '_______ your brother working today?',
        correctAnswer: 'Is',
        explanationHe: 'תשובה נכונה: Is. כלל: brother = he (יחיד), לכן Is + subject + verb-ing. שים לב: הסדר בשאלה. טעות נפוצה: להשתמש ב-Are.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'My parents _______ watching TV now.',
        options: ["am not", "isn't", "aren't", "don't"],
        correctAnswer: "aren't",
        explanationHe: 'תשובה נכונה: aren\'t. כלל: parents = they (רבים), לכן are not. שים לב: משפט שלילי בהווה ממושך. טעות נפוצה: להשתמש ב-isn\'t או don\'t.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: '_______ the baby crying?',
        correctAnswer: 'Is',
        explanationHe: 'תשובה נכונה: Is. כלל: baby = it (יחיד), לכן Is. שים לב: שאלה בהווה ממושך. טעות נפוצה: להשתמש ב-Are.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'I _______ feeling well today.',
        options: ["am not", "isn't", "aren't", "don't"],
        correctAnswer: "am not",
        explanationHe: 'תשובה נכונה: am not. כלל: I + am not + verb-ing. שים לב: משפט שלילי. טעות נפוצה: להשתמש ב-don\'t.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: '_______ you listening to me?',
        correctAnswer: 'Are',
        explanationHe: 'תשובה נכונה: Are. כלל: you תמיד לוקח Are בשאלה. שים לב: Are + you + verb-ing? טעות נפוצה: להשתמש ב-Is.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'The dog _______ barking now.',
        options: ["am not", "isn't", "aren't", "don't"],
        correctAnswer: "isn't",
        explanationHe: 'תשובה נכונה: isn\'t. כלל: dog = it (יחיד), לכן is not. שים לב: משפט שלילי. טעות נפוצה: להשתמש ב-aren\'t או don\'t.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: '_______ they coming to the party?',
        correctAnswer: 'Are',
        explanationHe: 'תשובה נכונה: Are. כלל: they + Are בשאלה. שים לב: Are + they + verb-ing? טעות נפוצה: להשתמש ב-Is.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'She _______ doing her homework right now.',
        options: ["am not", "isn't", "aren't", "don't"],
        correctAnswer: "isn't",
        explanationHe: 'תשובה נכונה: isn\'t. כלל: she + is not. שים לב: right now מציין עכשיו. טעות נפוצה: להשתמש ב-don\'t.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: '_______ it raining outside?',
        correctAnswer: 'Is',
        explanationHe: 'תשובה נכונה: Is. כלל: it + Is בשאלה. שים לב: Is + it + verb-ing? טעות נפוצה: להשתמש ב-Are.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'We _______ going to school today.',
        options: ["am not", "isn't", "aren't", "don't"],
        correctAnswer: "aren't",
        explanationHe: 'תשובה נכונה: aren\'t. כלל: we + are not. שים לב: משפט שלילי בהווה ממושך. טעות נפוצה: להשתמש ב-don\'t.',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: '_______ he studying for the test?',
        correctAnswer: 'Is',
        explanationHe: 'תשובה נכונה: Is. כלל: he + Is בשאלה. שים לב: Is + he + verb-ing? טעות נפוצה: להשתמש ב-Are.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: 'The students _______ paying attention.',
        options: ["am not", "isn't", "aren't", "don't"],
        correctAnswer: "aren't",
        explanationHe: 'תשובה נכונה: aren\'t. כלל: students = they (רבים), לכן are not. שים לב: משפט שלילי. טעות נפוצה: להשתמש ב-isn\'t.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: '_______ your sister coming with us?',
        correctAnswer: 'Is',
        explanationHe: 'תשובה נכונה: Is. כלל: sister = she (יחיד), לכן Is. שים לב: Is + subject + verb-ing? טעות נפוצה: להשתמש ב-Are.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: 'My father _______ working today.',
        options: ["am not", "isn't", "aren't", "don't"],
        correctAnswer: "isn't",
        explanationHe: 'תשובה נכונה: isn\'t. כלל: father = he (יחיד), לכן is not. שים לב: משפט שלילי. טעות נפוצה: להשתמש ב-don\'t.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: '_______ I talking too fast?',
        correctAnswer: 'Am',
        explanationHe: 'תשובה נכונה: Am. כלל: I + Am בשאלה. שים לב: Am + I + verb-ing? טעות נפוצה: להשתמש ב-Is או Are.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'The birds _______ singing now.',
        options: ["am not", "isn't", "aren't", "don't"],
        correctAnswer: "aren't",
        explanationHe: 'תשובה נכונה: aren\'t. כלל: birds = they (רבים), לכן are not. שים לב: משפט שלילי. טעות נפוצה: להשתמש ב-isn\'t.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: '_______ the teacher explaining the lesson?',
        correctAnswer: 'Is',
        explanationHe: 'תשובה נכונה: Is. כלל: teacher = he/she (יחיד), לכן Is. שים לב: Is + subject + verb-ing? טעות נפוצה: להשתמש ב-Are.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: 'You _______ helping me at all!',
        options: ["am not", "isn't", "aren't", "don't"],
        correctAnswer: "aren't",
        explanationHe: 'תשובה נכונה: aren\'t. כלל: you + are not. שים לב: משפט שלילי (תלונה). טעות נפוצה: להשתמש ב-don\'t.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: '_______ we making a mistake?',
        correctAnswer: 'Are',
        explanationHe: 'תשובה נכונה: Are. כלל: we + Are בשאלה. שים לב: Are + we + verb-ing? טעות נפוצה: להשתמש ב-Is.',
        difficulty: 'hard'
      }
    ]
  },
  {
    topicNumber: 3,
    subtopicNumber: '3.4',
    titleEn: 'Present Simple vs Progressive',
    titleHe: 'הווה פשוט מול הווה ממושך',
    level: 'beginner',
    orderIndex: 15,
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
      // EASY (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'I _______ football every Sunday.',
        options: ['play', 'am playing', 'plays', 'playing'],
        correctAnswer: 'play',
        explanationHe: 'every Sunday = הרגל - הווה פשוט',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'She _______ TV now.',
        options: ['watch', 'watches', 'is watching', 'watching'],
        correctAnswer: 'is watching',
        explanationHe: 'now = עכשיו - הווה ממושך',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'They _______ at the moment.',
        options: ['study', 'studies', 'are studying', 'studying'],
        correctAnswer: 'are studying',
        explanationHe: 'at the moment = עכשיו - הווה ממושך',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'He always _______ (eat) breakfast.',
        correctAnswer: 'eats',
        explanationHe: 'always = תמיד (הרגל) - הווה פשוט',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'We _______ right now.',
        options: ['work', 'works', 'are working', 'working'],
        correctAnswer: 'are working',
        explanationHe: 'right now = ברגע זה - הווה ממושך',
        difficulty: 'easy'
      },
      // MEDIUM (6-10)
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'They usually _______ (go) to school by bus.',
        correctAnswer: 'go',
        explanationHe: 'usually = בדרך כלל (הרגל) - הווה פשוט',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'I _______ a book at the moment.',
        options: ['read', 'reads', 'am reading', 'reading'],
        correctAnswer: 'am reading',
        explanationHe: 'at the moment מציין פעולה שקורה עכשיו - הווה ממושך',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (like) chocolate.',
        correctAnswer: 'likes',
        explanationHe: 'עובדה/העדפה קבועה - הווה פשוט',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'The children _______ in the garden now.',
        options: ['play', 'plays', 'are playing', 'playing'],
        correctAnswer: 'are playing',
        explanationHe: 'now = עכשיו - הווה ממושך',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'My father _______ (work) in a bank.',
        correctAnswer: 'works',
        explanationHe: 'מצב קבוע - הווה פשוט',
        difficulty: 'medium'
      },
      // HARD (11-30)
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'I _______ English every day, but today I _______ math.',
        options: ['study / study', 'study / am studying', 'am studying / study', 'studies / studying'],
        correctAnswer: 'study / am studying',
        explanationHe: 'תשובה נכונה: study / am studying. כלל: every day = הרגל (הווה פשוט), today = עכשיו (הווה ממושך). שים לב: שילוב שני זמנים באותו משפט. טעות נפוצה: להשתמש באותו זמן לשתי הפעולות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'The sun _______ (rise) in the east.',
        correctAnswer: 'rises',
        explanationHe: 'תשובה נכונה: rises. כלל: עובדה כללית משתמשים בהווה פשוט. שים לב: אמת אוניברסלית. טעות נפוצה: להשתמש בהווה ממושך is rising.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'She _______ to work by car, but this week she _______ the bus.',
        options: ['goes / takes', 'goes / is taking', 'is going / takes', 'go / taking'],
        correctAnswer: 'goes / is taking',
        explanationHe: 'תשובה נכונה: goes / is taking. כלל: הרגל (goes) מול פעולה זמנית (this week). שים לב: this week מציין שינוי זמני. טעות נפוצה: להשתמש בהווה פשוט לשניהם.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'Listen! Someone _______ (knock) on the door.',
        correctAnswer: 'is knocking',
        explanationHe: 'תשובה נכונה: is knocking. כלל: Listen מצביע על פעולה שקורה עכשיו - הווה ממושך. שים לב: מילות אות כמו listen, look מצביעות על הווה ממושך. טעות נפוצה: להשתמש ב-knocks.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'Water _______ at 100 degrees Celsius.',
        options: ['boil', 'boils', 'is boiling', 'boiling'],
        correctAnswer: 'boils',
        explanationHe: 'תשובה נכונה: boils. כלל: עובדה מדעית - הווה פשוט. שים לב: אמת מדעית קבועה. טעות נפוצה: להשתמש בהווה ממושך.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'Look! The baby _______ (sleep).',
        correctAnswer: 'is sleeping',
        explanationHe: 'תשובה נכונה: is sleeping. כלל: Look מצביע על פעולה בזמן אמת - הווה ממושך. שים לב: Look/Listen מצביעים על הווה ממושך. טעות נפוצה: להשתמש ב-sleeps.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'My sister often _______ to music, but right now she _______ a book.',
        options: ['listens / reads', 'listens / is reading', 'is listening / reads', 'listen / reading'],
        correctAnswer: 'listens / is reading',
        explanationHe: 'תשובה נכונה: listens / is reading. כלל: often = הרגל (הווה פשוט), right now = עכשיו (הווה ממושך). שים לב: שילוב הרגל ופעולה מתרחשת. טעות נפוצה: להשתמש באותו זמן לשניהם.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (understand) the lesson now.',
        correctAnswer: 'understand',
        explanationHe: 'תשובה נכונה: understand. כלל: פעלי חשיבה/תחושה לא משתמשים בהווה ממושך. שים לב: understand, know, like תמיד בהווה פשוט. טעות נפוצה: לכתוב am understanding.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'The Earth _______ around the Sun.',
        options: ['move', 'moves', 'is moving', 'moving'],
        correctAnswer: 'moves',
        explanationHe: 'תשובה נכונה: moves. כלל: עובדה מדעית קבועה - הווה פשוט. שים לב: אמת אסטרונומית. טעות נפוצה: להשתמש בהווה ממושך.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'Be quiet! I _______ (try) to concentrate.',
        correctAnswer: 'am trying',
        explanationHe: 'תשובה נכונה: am trying. כלל: פעולה שקורה ברגע זה - הווה ממושך. שים לב: Be quiet מצביע על פעולה מתרחשת עכשיו. טעות נפוצה: להשתמש ב-try.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'I _______ this movie. It\'s boring.',
        options: ["don't like", "doesn't like", "am not liking", "not like"],
        correctAnswer: "don't like",
        explanationHe: 'תשובה נכונה: don\'t like. כלל: like הוא פועל מצב ולא משתמשים בו בהווה ממושך. שים לב: פעלי העדפה תמיד בהווה פשוט. טעות נפוצה: לכתוב am not liking.',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (stay) with us this month.',
        correctAnswer: 'is staying',
        explanationHe: 'תשובה נכונה: is staying. כלל: this month מצביע על פעולה זמנית - הווה ממושך. שים לב: מצב זמני לא קבוע. טעות נפוצה: להשתמש ב-stays.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: 'He usually _______ coffee, but today he _______ tea.',
        options: ['drinks / drinks', 'drinks / is drinking', 'is drinking / drinks', 'drink / drinking'],
        correctAnswer: 'drinks / is drinking',
        explanationHe: 'תשובה נכונה: drinks / is drinking. כלל: usually = הרגל, today = שינוי זמני. שים לב: ניגוד בין הרגל לפעולה זמנית. טעות נפוצה: להשתמש באותו זמן.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (know) the answer.',
        correctAnswer: 'know',
        explanationHe: 'תשובה נכונה: know. כלל: know הוא פועל מצב ולא משתמשים בו בהווה ממושך. שים לב: פעלי ידע תמיד בהווה פשוט. טעות נפוצה: לכתוב am knowing.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: 'The train _______ at 9 AM every day.',
        options: ['leave', 'leaves', 'is leaving', 'leaving'],
        correctAnswer: 'leaves',
        explanationHe: 'תשובה נכונה: leaves. כלל: לוח זמנים קבוע - הווה פשוט. שים לב: every day מצביע על הרגל. טעות נפוצה: להשתמש בהווה ממושך.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: 'Shh! The children _______ (sleep).',
        correctAnswer: 'are sleeping',
        explanationHe: 'תשובה נכונה: are sleeping. כלל: Shh מצביע על פעולה עכשיו - הווה ממושך. שים לב: קריאות כמו Shh, Listen, Look. טעות נפוצה: להשתמש ב-sleep.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'I _______ what you mean.',
        options: ['see', 'sees', 'am seeing', 'seeing'],
        correctAnswer: 'see',
        explanationHe: 'תשובה נכונה: see. כלל: see במובן של "להבין" הוא פועל מצב - הווה פשוט. שים לב: I see = אני מבין/רואה (הבנה). טעות נפוצה: לכתוב am seeing.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (learn) about verbs this week.',
        correctAnswer: 'are learning',
        explanationHe: 'תשובה נכונה: are learning. כלל: this week מצביע על פעולה זמנית - הווה ממושך. שים לב: תקופה זמנית מוגדרת. טעות נפוצה: להשתמש ב-learn.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: 'My brother _______ in London.',
        options: ['live', 'lives', 'is living', 'living'],
        correctAnswer: 'lives',
        explanationHe: 'תשובה נכונה: lives. כלל: מצב קבוע - הווה פשוט. שים לב: מקום מגורים קבוע. טעות נפוצה: להשתמש בהווה ממושך.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: 'The price of food _______ (go up) these days.',
        correctAnswer: 'is going up',
        explanationHe: 'תשובה נכונה: is going up. כלל: these days = ימים אלה (תקופה זמנית) - הווה ממושך. שים לב: שינוי זמני/מתמשך. טעות נפוצה: להשתמש ב-goes up.',
        difficulty: 'hard'
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
    orderIndex: 16,
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
      // EASY (1-5)
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
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: '_______ (sit) down, please.',
        correctAnswer: 'Sit',
        explanationHe: 'ציווי מנומס: Sit (שב)',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: "_______ be late!",
        options: ["Don't", "Doesn't", "Not", "Didn't"],
        correctAnswer: "Don't",
        explanationHe: 'ציווי שלילי: Don\'t + be',
        difficulty: 'easy'
      },
      // MEDIUM (6-10)
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: '_______ (listen) carefully!',
        correctAnswer: 'Listen',
        explanationHe: 'ציווי: Listen (הקשב) - פועל בצורת בסיס',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: "_______ touch that!",
        options: ["Don't", "Doesn't", "Not", "Didn't"],
        correctAnswer: "Don't",
        explanationHe: 'ציווי שלילי: Don\'t + touch',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: '_______ (close) the window, please.',
        correctAnswer: 'Close',
        explanationHe: 'ציווי מנומס: Close + please',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: "_______ worry!",
        options: ["Don't", "Doesn't", "Not", "Didn't"],
        correctAnswer: "Don't",
        explanationHe: 'ציווי שלילי: Don\'t worry (אל תדאג)',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: '_______ (wait) here.',
        correctAnswer: 'Wait',
        explanationHe: 'ציווי: Wait (חכה) בצורת בסיס',
        difficulty: 'medium'
      },
      // HARD (11-30)
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: '_______ quietly in the library!',
        options: ['Work', 'Works', 'Working', 'Worked'],
        correctAnswer: 'Work',
        explanationHe: 'תשובה נכונה: Work. כלל: ציווי תמיד בצורת הבסיס של הפועל. שים לב: אין הבדל בין ציווי ליחיד או רבים. טעות נפוצה: להוסיף s או ing.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: "_______ forget your keys! (don't)",
        correctAnswer: "Don't forget",
        explanationHe: 'תשובה נכונה: Don\'t forget. כלל: ציווי שלילי = Don\'t + verb. שים לב: הפועל תמיד בצורת בסיס. טעות נפוצה: לכתוב doesn\'t או didn\'t.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: "_______ patient with the children!",
        options: ['Be', 'Are', 'Being', 'Been'],
        correctAnswer: 'Be',
        explanationHe: 'תשובה נכונה: Be. כלל: גם הפועל be בציווי משתמשים בצורת הבסיס. שים לב: Be patient = היה סבלני. טעות נפוצה: להשתמש ב-Are.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: '_______ (turn) left at the corner.',
        correctAnswer: 'Turn',
        explanationHe: 'תשובה נכונה: Turn. כלל: הוראות ניווט בציווי. שים לב: Turn left = פנה שמאלה. טעות נפוצה: להוסיף to לפני הפועל.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: "_______ make noise!",
        options: ["Don't", "Doesn't", "Not", "Didn't"],
        correctAnswer: "Don't",
        explanationHe: 'תשובה נכונה: Don\'t. כלל: ציווי שלילי. שים לב: Don\'t make noise = אל תעשה רעש. טעות נפוצה: להשתמש ב-Not או Doesn\'t.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: '_______ (help) your mother.',
        correctAnswer: 'Help',
        explanationHe: 'תשובה נכונה: Help. כלל: ציווי חיובי = פועל בבסיס. שים לב: Help = עזור. טעות נפוצה: להוסיף to לפני help.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: "_______ careful when crossing the street!",
        options: ['Be', 'Are', 'Being', 'Been'],
        correctAnswer: 'Be',
        explanationHe: 'תשובה נכונה: Be. כלל: be בציווי נשאר be. שים לב: Be careful = היה זהיר. טעות נפוצה: להשתמש ב-Being או Are.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: "_______ talk in class! (don't)",
        correctAnswer: "Don't talk",
        explanationHe: 'תשובה נכונה: Don\'t talk. כלל: ציווי שלילי בהוראה. שים לב: Don\'t + verb בבסיס. טעות נפוצה: לכתוב doesn\'t talk.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: '_______ the instructions carefully!',
        options: ['Read', 'Reads', 'Reading', 'To read'],
        correctAnswer: 'Read',
        explanationHe: 'תשובה נכונה: Read. כלל: ציווי = פועל בבסיס. שים לב: Read carefully = קרא בעיון. טעות נפוצה: להוסיף to לפני read.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: '_______ (take) your medicine.',
        correctAnswer: 'Take',
        explanationHe: 'תשובה נכונה: Take. כלל: ציווי להוראה. שים לב: Take = קח. טעות נפוצה: לכתוב takes.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: "_______ afraid!",
        options: ["Don't be", "Doesn't be", "Not be", "Didn't be"],
        correctAnswer: "Don't be",
        explanationHe: 'תשובה נכונה: Don\'t be. כלל: ציווי שלילי עם be. שים לב: Don\'t be afraid = אל תפחד. טעות נפוצה: לכתוב doesn\'t be.',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: '_______ (study) hard for the exam.',
        correctAnswer: 'Study',
        explanationHe: 'תשובה נכונה: Study. כלל: ציווי = עצה/המלצה. שים לב: Study hard = למד קשה. טעות נפוצה: לכתוב studies.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: '_______ some rest!',
        options: ['Get', 'Gets', 'Getting', 'Got'],
        correctAnswer: 'Get',
        explanationHe: 'תשובה נכונה: Get. כלל: ציווי לעצה. שים לב: Get some rest = תנוח קצת. טעות נפוצה: להשתמש בעבר got.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: "_______ use your phone while driving! (don't)",
        correctAnswer: "Don't use",
        explanationHe: 'תשובה נכונה: Don\'t use. כלל: ציווי שלילי לאזהרה. שים לב: Don\'t + verb. טעות נפוצה: לכתוב doesn\'t use.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: '_______ polite to everyone!',
        options: ['Be', 'Are', 'Being', 'Been'],
        correctAnswer: 'Be',
        explanationHe: 'תשובה נכונה: Be. כלל: be בציווי. שים לב: Be polite = היה מנומס. טעות נפוצה: להשתמש ב-Are או Being.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: '_______ (try) your best!',
        correctAnswer: 'Try',
        explanationHe: 'תשובה נכונה: Try. כלל: ציווי לעידוד. שים לב: Try your best = תעשה כמיטב יכולתך. טעות נפוצה: לכתוב tries.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: "_______ give up!",
        options: ["Don't", "Doesn't", "Not", "Didn't"],
        correctAnswer: "Don't",
        explanationHe: 'תשובה נכונה: Don\'t. כלל: ציווי שלילי לעידוד. שים לב: Don\'t give up = אל תוותר. טעות נפוצה: להשתמש ב-Not או Doesn\'t.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: '_______ (enjoy) your meal!',
        correctAnswer: 'Enjoy',
        explanationHe: 'תשובה נכונה: Enjoy. כלל: ציווי לברכה. שים לב: Enjoy your meal = בתאבון. טעות נפוצה: לכתוב enjoys.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: '_______ right at the traffic light!',
        options: ['Turn', 'Turns', 'Turning', 'Turned'],
        correctAnswer: 'Turn',
        explanationHe: 'תשובה נכונה: Turn. כלל: ציווי להוראת ניווט. שים לב: Turn right = פנה ימינה. טעות נפוצה: להוסיף s או ing.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: "_______ tell anyone! (don't)",
        correctAnswer: "Don't tell",
        explanationHe: 'תשובה נכונה: Don\'t tell. כלל: ציווי שלילי לסוד. שים לב: Don\'t tell = אל תגיד. טעות נפוצה: לכתוב doesn\'t tell.',
        difficulty: 'hard'
      }
    ]
  },
  {
    topicNumber: 4,
    subtopicNumber: '4.2',
    titleEn: 'Possessives',
    titleHe: 'שייכות',
    level: 'beginner',
    orderIndex: 17,
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
      // EASY (1-5)
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
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'This is _______ (we) house.',
        correctAnswer: 'our',
        explanationHe: 'we → our (שלנו)',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: '_______ dog is very friendly. (they)',
        options: ['They', 'Them', 'Their', 'Theirs'],
        correctAnswer: 'Their',
        explanationHe: 'they → their (שלהם)',
        difficulty: 'easy'
      },
      // MEDIUM (6-10)
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'Is this _______ (you) pen?',
        correctAnswer: 'your',
        explanationHe: 'you → your (שלך)',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: "The cat is washing _______ paws.",
        options: ['it', 'its', "it's", 'his'],
        correctAnswer: 'its',
        explanationHe: 'it → its (שלו/ה לחפץ/חיה)',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: "That's my teacher_______ desk.",
        correctAnswer: "'s",
        explanationHe: 'שייכות: teacher\'s desk',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: '_______ brother is a doctor. (he)',
        options: ['He', 'Him', 'His', 'Hers'],
        correctAnswer: 'His',
        explanationHe: 'he → his (שלו)',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'These are _______ (I) friends.',
        correctAnswer: 'my',
        explanationHe: 'I → my (החברים שלי)',
        difficulty: 'medium'
      },
      // HARD (11-30)
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: "The children's_______ toys are everywhere.",
        options: ['', "'s", 's', 'es'],
        correctAnswer: '',
        explanationHe: 'תשובה נכונה: (ללא כלום). כלל: children כבר רבים ומסתיים ב-n, מוסיפים רק \'s אבל הוא כבר כלול. שים לב: children\'s = של הילדים. טעות נפוצה: להוסיף s נוסף.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'This book is _______ (she), not mine.',
        correctAnswer: 'hers',
        explanationHe: 'תשובה נכונה: hers. כלל: כינוי שייכות עצמאי (לא לפני שם עצם). שים לב: her book אבל the book is hers. טעות נפוצה: לכתוב her.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: "My sister_______ car is red.",
        options: ['', "'s", 's', 'es'],
        correctAnswer: "'s",
        explanationHe: 'תשובה נכונה: \'s. כלל: שייכות ליחיד מוסיפים \'s. שים לב: sister\'s car = המכונית של אחותי. טעות נפוצה: לשכוח את האפוסטרוף.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'That house is _______ (they), not ours.',
        correctAnswer: 'theirs',
        explanationHe: 'תשובה נכונה: theirs. כלל: כינוי שייכות עצמאי. שים לב: their house אבל the house is theirs. טעות נפוצה: לכתוב their.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: "The students_______ homework is difficult.",
        options: ['', "'s", "s'", 'es'],
        correctAnswer: "s'",
        explanationHe: 'תשובה נכונה: s\'. כלל: שם עצם רבים שמסתיים ב-s מוסיפים רק \'. שים לב: students\' = של התלמידים. טעות נפוצה: להוסיף \'s.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'Is this pen _______ (you) or mine?',
        correctAnswer: 'yours',
        explanationHe: 'תשובה נכונה: yours. כלל: כינוי שייכות עצמאי. שים לב: your pen אבל the pen is yours. טעות נפוצה: לכתוב your.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: "My parents_______ house is big.",
        options: ['', "'s", "s'", 'es'],
        correctAnswer: "'",
        explanationHe: 'תשובה נכונה: \'. כלל: parents מסתיים ב-s (רבים) ולכן רק \'. שים לב: parents\' house. טעות נפוצה: להוסיף \'s.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'The dog wagged _______ (it) tail.',
        correctAnswer: 'its',
        explanationHe: 'תשובה נכונה: its. כלל: it → its (שייכות). שים לב: its = של זה (לא it\'s = it is). טעות נפוצה: לכתוב it\'s.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'This bag is _______. (I)',
        options: ['my', 'me', 'mine', 'I'],
        correctAnswer: 'mine',
        explanationHe: 'תשובה נכונה: mine. כלל: כינוי שייכות עצמאי. שים לב: my bag אבל the bag is mine. טעות נפוצה: לכתוב my.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: "The boys_______ room is messy.",
        correctAnswer: "'",
        explanationHe: 'תשובה נכונה: \'. כלל: boys מסתיים ב-s ולכן רק \'. שים לב: boys\' room = החדר של הבנים. טעות נפוצה: להוסיף \'s.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'These keys are _______. (he)',
        options: ['he', 'him', 'his', 'her'],
        correctAnswer: 'his',
        explanationHe: 'תשובה נכונה: his. כלל: his משמש גם לפני שם עצם וגם בעצמו. שים לב: his keys וגם the keys are his. טעות נפוצה: להשתמש ב-him.',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: 'We should respect _______ (people) opinions.',
        correctAnswer: "people's",
        explanationHe: 'תשובה נכונה: people\'s. כלל: people הוא רבים מיוחד ולוקח \'s. שים לב: people\'s opinions. טעות נפוצה: לכתוב peoples\'.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: 'The car is _______. (we)',
        options: ['we', 'us', 'our', 'ours'],
        correctAnswer: 'ours',
        explanationHe: 'תשובה נכונה: ours. כלל: כינוי שייכות עצמאי. שים לב: our car אבל the car is ours. טעות נפוצה: לכתוב our.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: "James_______ sister is my friend.",
        correctAnswer: "'s",
        explanationHe: 'תשובה נכונה: \'s. כלל: שמות יחיד לוקחים \'s. שים לב: James\'s או James\' (שניהם נכונים). טעות נפוצה: לשכוח את השייכות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: '_______ responsibility is this? (who)',
        options: ['Who', 'Whom', 'Whose', 'Whos'],
        correctAnswer: 'Whose',
        explanationHe: 'תשובה נכונה: Whose. כלל: Whose שואל על שייכות. שים לב: Whose = של מי. טעות נפוצה: להשתמש ב-Who\'s.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: 'The company_______ profits increased.',
        correctAnswer: "'s",
        explanationHe: 'תשובה נכונה: \'s. כלל: גם חברה/ארגון יכול לקבל \'s. שים לב: company\'s profits. טעות נפוצה: לא להוסיף שייכות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'This is not my phone. It must be _______. (she)',
        options: ['she', 'her', 'hers', 'his'],
        correctAnswer: 'hers',
        explanationHe: 'תשובה נכונה: hers. כלל: כינוי שייכות עצמאי (עומד לבד). שים לב: ללא שם עצם אחרי. טעות נפוצה: לכתוב her.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: "The babies_______ bottles are on the table.",
        correctAnswer: "'",
        explanationHe: 'תשובה נכונה: \'. כלל: babies מסתיים ב-s ולכן רק \'. שים לב: babies\' bottles. טעות נפוצה: להוסיף \'s.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: '_______ decision was it to leave early?',
        options: ['Who', 'Whom', 'Whose', "Who's"],
        correctAnswer: 'Whose',
        explanationHe: 'תשובה נכונה: Whose. כלל: שואלים על שייכות של החלטה. שים לב: Whose decision = ההחלטה של מי. טעות נפוצה: להשתמש ב-Who.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: "That's my father_______ car, not mine.",
        correctAnswer: "'s",
        explanationHe: 'תשובה נכונה: \'s. כלל: שייכות ליחיד. שים לב: father\'s car = המכונית של אבא שלי. טעות נפוצה: לשכוח את האפוסטרוף.',
        difficulty: 'hard'
      }
    ]
  },
  {
    topicNumber: 4,
    subtopicNumber: '4.3',
    titleEn: 'Articles',
    titleHe: 'תווי יידוע',
    level: 'beginner',
    orderIndex: 18,
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
      // EASY (1-5)
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
        questionTextHe: '_______ sun is bright.',
        correctAnswer: 'The',
        explanationHe: 'דבר ספציפי/יחיד: the sun',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'I saw _______ cat in the garden.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'a',
        explanationHe: 'cat מתחיל בעיצור: a cat',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'He is _______ doctor.',
        correctAnswer: 'a',
        explanationHe: 'doctor מתחיל בעיצור: a doctor',
        difficulty: 'easy'
      },
      // MEDIUM (6-10)
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'I need _______ umbrella.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'an',
        explanationHe: 'umbrella מתחיל בתנועה: an umbrella',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: '_______ moon is beautiful tonight.',
        correctAnswer: 'The',
        explanationHe: 'הירח - דבר ייחודי/מוגדר: the moon',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'She is _______ honest person.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'an',
        explanationHe: 'honest מתחיל בתנועה (h שקט): an honest',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'I saw _______ movie. _______ movie was great!',
        correctAnswer: 'a, The',
        explanationHe: 'ראשון: a movie (לא מוגדר), שני: the movie (כבר מוגדר)',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'He plays _______ piano.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'the',
        explanationHe: 'כלי נגינה: the piano',
        difficulty: 'medium'
      },
      // HARD (11-30)
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'I need _______ hour to finish.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'an',
        explanationHe: 'תשובה נכונה: an. כלל: hour מתחיל בתנועה (h שקט). שים לב: an hour (נשמע "אור"). טעות נפוצה: לכתוב a hour.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'She is _______ best student in class.',
        correctAnswer: 'the',
        explanationHe: 'תשובה נכונה: the. כלל: עם תארי עילוי (best, biggest) תמיד the. שים לב: the best = הטוב ביותר. טעות נפוצה: להשתמש ב-a.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'He is _______ university student.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'a',
        explanationHe: 'תשובה נכונה: a. כלל: university מתחיל בצליל y (עיצור). שים לב: a university (נשמע "יוניברסיטי"). טעות נפוצה: לכתוב an.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'I play _______ guitar.',
        correctAnswer: 'the',
        explanationHe: 'תשובה נכונה: the. כלל: כלי נגינה תמיד עם the. שים לב: the guitar, the piano. טעות נפוצה: להשמיט את the.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: '_______ Earth revolves around _______ sun.',
        options: ['The, the', 'A, a', 'The, a', 'A, the'],
        correctAnswer: 'The, the',
        explanationHe: 'תשובה נכונה: The, the. כלל: גופים שמימיים יחידים עם the. שים לב: the Earth, the sun. טעות נפוצה: להשמיט את the.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'I go to _______ school every day.',
        correctAnswer: '-',
        explanationHe: 'תשובה נכונה: (ללא). כלל: מוסדות כללים ללא תו יידוע. שים לב: go to school, go to work. טעות נפוצה: להוסיף the.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'She is _______ European.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'a',
        explanationHe: 'תשובה נכונה: a. כלל: European מתחיל בצליל y (עיצור). שים לב: a European (נשמע "יורופיאן"). טעות נפוצה: לכתוב an.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'We had _______ lunch at noon.',
        correctAnswer: '-',
        explanationHe: 'תשובה נכונה: (ללא). כלל: ארוחות ללא תו יידוע. שים לב: have breakfast, lunch, dinner. טעות נפוצה: להוסיף a או the.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'This is _______ one-way street.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'a',
        explanationHe: 'תשובה נכונה: a. כלל: one מתחיל בצליל w (עיצור). שים לב: a one-way (נשמע "וואן"). טעות נפוצה: לכתוב an.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'I love _______ music.',
        correctAnswer: '-',
        explanationHe: 'תשובה נכונה: (ללא). כלל: מושגים כלליים ללא תו יידוע. שים לב: love music, love sports. טעות נפוצה: להוסיף the.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'He is _______ only child.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'the',
        explanationHe: 'תשובה נכונה: the. כלל: only מצביע על יחידות ולוקח the. שים לב: the only child = הילד היחיד. טעות נפוצה: להשתמש ב-an.',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: 'She plays _______ basketball.',
        correctAnswer: '-',
        explanationHe: 'תשובה נכונה: (ללא). כלל: ספורט ללא תו יידוע. שים לב: play basketball, play football. טעות נפוצה: להוסיף the.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: '_______ Nile is _______ longest river.',
        options: ['The, the', 'A, a', '-, the', 'The, -'],
        correctAnswer: 'The, the',
        explanationHe: 'תשובה נכונה: The, the. כלל: שמות נהרות ותארי עילוי עם the. שים לב: the Nile, the longest. טעות נפוצה: להשמיט את the.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: 'I go to _______ bed at 10 PM.',
        correctAnswer: '-',
        explanationHe: 'תשובה נכונה: (ללא). כלל: ביטויים קבועים ללא תו יידוע. שים לב: go to bed, go to work. טעות נפוצה: להוסיף the.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: 'She is _______ same age as me.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'the',
        explanationHe: 'תשובה נכונה: the. כלל: same תמיד עם the. שים לב: the same age = אותו גיל. טעות נפוצה: להשתמש ב-a.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: 'I need _______ information about the course.',
        correctAnswer: '-',
        explanationHe: 'תשובה נכונה: (ללא). כלל: information הוא בלתי ספיר ולא לוקח a/an. שים לב: information, advice ללא תו יידוע. טעות נפוצה: להוסיף an.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'We live in _______ United States.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'the',
        explanationHe: 'תשובה נכונה: the. כלל: מדינות עם states/kingdom לוקחים the. שים לב: the United States, the UK. טעות נפוצה: להשמיט את the.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: 'She speaks _______ English fluently.',
        correctAnswer: '-',
        explanationHe: 'תשובה נכונה: (ללא). כלל: שפות ללא תו יידוע. שים לב: speak English, speak Hebrew. טעות נפוצה: להוסיף the.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: 'He is _______ most intelligent student.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'the',
        explanationHe: 'תשובה נכונה: the. כלל: most (תואר עילוי) תמיד עם the. שים לב: the most intelligent. טעות נפוצה: להשתמש ב-a.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: 'I usually have _______ breakfast at 7 AM.',
        correctAnswer: '-',
        explanationHe: 'תשובה נכונה: (ללא). כלל: ארוחות ללא תו יידוע. שים לב: have breakfast (ללא the או a). טעות נפוצה: להוסיף the.',
        difficulty: 'hard'
      }
    ]
  },
  {
    topicNumber: 4,
    subtopicNumber: '4.4',
    titleEn: 'Pronouns',
    titleHe: 'כינויי גוף',
    level: 'beginner',
    orderIndex: 19,
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
      // EASY (1-5)
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
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'I like _______. (she)',
        correctAnswer: 'her',
        explanationHe: 'כינוי מושא: her (אותה)',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: '_______ is my friend.',
        options: ['He', 'Him', 'His', 'Hers'],
        correctAnswer: 'He',
        explanationHe: 'כינוי נושא: He',
        difficulty: 'easy'
      },
      // MEDIUM (6-10)
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'Can you help _______? (we)',
        correctAnswer: 'us',
        explanationHe: 'כינוי מושא: us (אותנו)',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'I saw _______ at the park.',
        options: ['he', 'him', 'his', "he's"],
        correctAnswer: 'him',
        explanationHe: 'כינוי מושא אחרי saw: him',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: '_______ (we) are going home.',
        correctAnswer: 'We',
        explanationHe: 'כינוי נושא: We',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'Tell _______ the truth.',
        options: ['they', 'them', 'their', 'theirs'],
        correctAnswer: 'them',
        explanationHe: 'כינוי מושא: them (להם)',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: '_______ (you) can do it!',
        correctAnswer: 'You',
        explanationHe: 'כינוי נושא: You',
        difficulty: 'medium'
      },
      // HARD (11-30)
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'Between you and _______, I think she\'s right.',
        options: ['I', 'me', 'my', 'mine'],
        correctAnswer: 'me',
        explanationHe: 'תשובה נכונה: me. כלל: אחרי מילות יחס (between, with, for) משתמשים בכינוי מושא. שים לב: between you and me (לא I). טעות נפוצה: לכתוב I.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: '_______ and John are best friends. (I)',
        correctAnswer: 'John and I',
        explanationHe: 'תשובה נכונה: John and I. כלל: בנושא המשפט משתמשים ב-I (לא me). שים לב: John ואני הנושאים. טעות נפוצה: לכתוב me and John.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'This is a secret between _______ and _______.',
        options: ['she, I', 'her, me', 'she, me', 'her, I'],
        correctAnswer: 'her, me',
        explanationHe: 'תשובה נכונה: her, me. כלל: אחרי between משתמשים בכינויי מושא. שים לב: between her and me. טעות נפוצה: להשתמש בכינויי נושא.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'My sister and _______ went shopping. (I)',
        correctAnswer: 'I',
        explanationHe: 'תשובה נכונה: I. כלל: כינוי נושא במשפט. שים לב: My sister and I went (לא me). טעות נפוצה: לכתוב me.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'The teacher gave _______ a book.',
        options: ['I', 'me', 'my', 'mine'],
        correctAnswer: 'me',
        explanationHe: 'תשובה נכונה: me. כלל: אחרי gave משתמשים בכינוי מושא. שים לב: gave me (לא I). טעות נפוצה: להשתמש ב-I.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'It was _______ who called. (he)',
        correctAnswer: 'he',
        explanationHe: 'תשובה נכונה: he. כלל: אחרי was במשפט זיהוי משתמשים בכינוי נושא. שים לב: It was he (פורמלי). טעות נפוצה: לכתוב him.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'The gift is for _______.',
        options: ['they', 'them', 'their', 'theirs'],
        correctAnswer: 'them',
        explanationHe: 'תשובה נכונה: them. כלל: אחרי for משתמשים בכינוי מושא. שים לב: for them (לא they). טעות נפוצה: להשתמש ב-they.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'Nobody knows better than _______. (she)',
        correctAnswer: 'her',
        explanationHe: 'תשובה נכונה: her. כלל: אחרי than משתמשים בכינוי מושא (בדיבור). שים לב: than her. טעות נפוצה: לכתוב she.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: '_______ and _______ will go together.',
        options: ['She, I', 'Her, me', 'She, me', 'Her, I'],
        correctAnswer: 'She, I',
        explanationHe: 'תשובה נכונה: She, I. כלל: נושאי המשפט בכינויי נושא. שים לב: She and I will go. טעות נפוצה: להשתמש בכינויי מושא.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'Let _______ help you. (I)',
        correctAnswer: 'me',
        explanationHe: 'תשובה נכונה: me. כלל: אחרי let משתמשים בכינוי מושא. שים לב: Let me help (לא I). טעות נפוצה: לכתוב I.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'This is between _______ and _______.',
        options: ['you, I', 'you, me', 'your, I', 'your, me'],
        correctAnswer: 'you, me',
        explanationHe: 'תשובה נכונה: you, me. כלל: אחרי between כינויי מושא. שים לב: between you and me. טעות נפוצה: לכתוב you and I.',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: 'My friends and _______ are planning a trip. (I)',
        correctAnswer: 'I',
        explanationHe: 'תשובה נכונה: I. כלל: כינוי נושא במשפט. שים לב: friends and I are planning. טעות נפוצה: לכתוב me.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: 'The teacher asked _______ to wait.',
        options: ['we', 'us', 'our', 'ours'],
        correctAnswer: 'us',
        explanationHe: 'תשובה נכונה: us. כלל: אחרי asked כינוי מושא. שים לב: asked us (לא we). טעות נפוצה: להשתמש ב-we.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: 'Give the book to _______. (I)',
        correctAnswer: 'me',
        explanationHe: 'תשובה נכונה: me. כלל: אחרי to משתמשים בכינוי מושא. שים לב: to me (לא I). טעות נפוצה: לכתוב I.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: '_______ and _______ brother are twins.',
        options: ['He, his', 'Him, his', 'He, him', 'His, he'],
        correctAnswer: 'He, his',
        explanationHe: 'תשובה נכונה: He, his. כלל: He = כינוי נושא, his = כינוי שייכות. שים לב: He and his brother. טעות נפוצה: לבלבל בין השניים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: 'Come with _______! (we)',
        correctAnswer: 'us',
        explanationHe: 'תשובה נכונה: us. כלל: אחרי with משתמשים בכינוי מושא. שים לב: with us (לא we). טעות נפוצה: לכתוב we.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'Who is calling? It\'s _______.',
        options: ['I', 'me', 'my', 'mine'],
        correctAnswer: 'me',
        explanationHe: 'תשובה נכונה: me. כלל: בדיבור יומיומי משתמשים ב-me אחרי It\'s. שים לב: It\'s me (בדיבור). טעות נפוצה: להיות פורמלי מדי עם I.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: 'Neither _______ nor John knows the answer. (she)',
        correctAnswer: 'she',
        explanationHe: 'תשובה נכונה: she. כלל: אחרי neither משתמשים בכינוי נושא. שים לב: Neither she nor John. טעות נפוצה: לכתוב her.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: 'The coach chose _______ for the team.',
        options: ['he', 'him', 'his', "he's"],
        correctAnswer: 'him',
        explanationHe: 'תשובה נכונה: him. כלל: אחרי chose כינוי מושא. שים לב: chose him (לא he). טעות נפוצה: להשתמש ב-he.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: 'Nobody helped _______ with the work. (they)',
        correctAnswer: 'them',
        explanationHe: 'תשובה נכונה: them. כלל: אחרי helped כינוי מושא. שים לב: helped them (לא they). טעות נפוצה: לכתוב they.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== TOPIC 11: PRESENT PROGRESSIVE ====================
  // Imported from seeds/topic11-present-progressive.js
  ...topic11Data.lessonsData,

  // ==================== TOPIC 15: PAST SIMPLE ====================
  // Imported from seeds/topic15-past-simple.js
  ...topic15Data.lessonsData
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
    console.log(`- Topic 1 (Present Simple): 7 subtopics`);
    console.log(`- Topic 2 (Past Simple): 4 subtopics`);
    console.log(`- Topic 3 (Present Continuous): 4 subtopics`);
    console.log(`- Topic 4 (Grammar Basics): 4 subtopics`);
    console.log(`- Topic 11 (Past Simple - Elementary): 7 subtopics`);
    console.log(`- Topic 12 (Present Progressive - Elementary): 7 subtopics`);
    console.log(`- Total: 33 subtopics created`);

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
