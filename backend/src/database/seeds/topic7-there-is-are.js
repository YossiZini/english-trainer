const { pool } = require('../../config/database');
const Lesson = require('../../models/Lesson');
const Exercise = require('../../models/Exercise');

// Topic 7: There is / There are (יש)
const lessonsData = [
  // ==================== SUBTOPIC 7.1: Affirmative ====================
  {
    topicNumber: 7,
    subtopicNumber: '7.1',
    titleEn: 'Affirmative Sentences',
    titleHe: 'משפטים חיוביים',
    level: 'beginner',
    orderIndex: 1,
    theoryContentHe: `
<h2>There is / There are - משפטים חיוביים</h2>

<p>משתמשים ב-"There is" ו-"There are" כדי לומר שמשהו קיים או נמצא במקום מסוים.</p>

<div class="rules">
  <p><strong>THERE IS</strong> + singular / uncountable:</p>
  <ul>
    <li>There <strong>is</strong> a book. - יש ספר</li>
    <li>There <strong>is</strong> a dog in the garden. - יש כלב בגינה</li>
    <li>There <strong>is</strong> water in the bottle. - יש מים בבקבוק</li>
    <li>There <strong>is</strong> one teacher. - יש מורה אחד</li>
  </ul>

  <p><strong>THERE ARE</strong> + plural:</p>
  <ul>
    <li>There <strong>are</strong> books. - יש ספרים</li>
    <li>There <strong>are</strong> three dogs. - יש שלושה כלבים</li>
    <li>There <strong>are</strong> many students. - יש הרבה תלמידים</li>
    <li>There <strong>are</strong> flowers in the garden. - יש פרחים בגינה</li>
  </ul>
</div>

<div class="warning">
  <strong>זכור:</strong> singular/uncountable = is, plural = are
</div>
    `,
    exercises: [
      // Advanced exercises (20 total)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'There _______ a lot of traffic on the highway today.',
        options: ['is', 'are', 'have', 'has'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: traffic הוא שם עצם שאינו בר ספירה (uncountable) ולוקח פועל יחיד. שים לב: "a lot of" יכול להופיע עם יחיד או רבים, אבל השם העצם שאחריו קובע. טעות נפוצה: לחשוב ש-"a lot of" תמיד דורש רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'There _______ (be) good news about your application.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: news נראה כמו רבים אבל הוא יחיד ותמיד לוקח פועל יחיד. שים לב: מילים כמו mathematics, physics, news נגמרות ב-s אבל הן יחיד. טעות נפוצה: לכתוב "are" בגלל ה-s בסוף.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'There _______ several reasons why I can\'t come.',
        options: ['is', 'are', 'has', 'have'],
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: several (כמה) תמיד מלווה בשם עצם רבים ולכן דורש are. שים לב: several = more than two but not many. טעות נפוצה: להתבלבל כי "several" נשמע כמו יחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'There _______ (be) furniture in every room.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: furniture הוא שם עצם שאינו בר ספירה (uncountable) ולא יכול להיות ברבים. שים לב: אומרים "a piece of furniture" לא "a furniture". טעות נפוצה: לכתוב "furnitures" או להשתמש ב-are.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'There _______ five apples and an orange on the table.',
        options: ['is', 'are', 'have', 'has'],
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: כשיש רשימת פריטים, הפועל מתאים לפריט הראשון (five apples - רבים). שים לב: זה נקרא "closest subject rule". טעות נפוצה: להתאים את הפועל לכל הרשימה במקום לפריט הראשון.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'There _______ (be) an apple and five oranges in the basket.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: הפועל מתאים לשם העצם הראשון אחרי there (an apple - יחיד). שים לב: לא משנה מה בא אחר כך ברשימה. טעות נפוצה: להשתמש ב-are בגלל "five oranges".',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'There _______ a hundred people waiting outside.',
        options: ['is', 'are', 'was', 'were'],
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: people תמיד רבים באנגלית (אפילו עם מספר). שים לב: person = יחיד, people = רבים (גם a hundred people). טעות נפוצה: להשתמש ב-is בגלל "a hundred".',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'There _______ (be) no water left in the bottle.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: water הוא uncountable ולוקח is גם עם "no". שים לב: "no water" = "not any water", שניהם משתמשים ב-is. טעות נפוצה: לחשוב ש-"no" דורש are.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'There _______ plenty of time before the meeting.',
        options: ['is', 'are', 'has', 'have'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: time כשם עצם כללי הוא uncountable ולוקח is. שים לב: "plenty of" יכול להופיע עם יחיד או רבים, השם העצם קובע. טעות נפוצה: לחשוב ש-plenty דורש are.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'There _______ (be) many difficulties in learning English.',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: difficulties הוא רבים של difficulty. שים לב: difficulty יכול להיות countable (= a problem) או uncountable (= the state of being hard). טעות נפוצה: לבלבל בין difficulty (יחיד/uncountable) ו-difficulties (רבים).',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'There _______ too much noise in the classroom.',
        options: ['is', 'are', 'has', 'have'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: noise הוא uncountable ולוקח is. שים לב: too much = יותר מדי, משמש עם uncountable. too many = עם countable. טעות נפוצה: לכתוב "too many noise".',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'There _______ (be) both advantages and disadvantages.',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: advantages ו-disadvantages שניהם רבים. שים לב: both...and תמיד מחבר שני דברים ודורש רבים. טעות נפוצה: להשתמש ב-is כי "both" נשמע כמו יחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'There _______ a pair of scissors on the desk.',
        options: ['is', 'are', 'has', 'have'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: "a pair of scissors" הוא יחיד (pair = יחיד), אבל "scissors" לבד הוא רבים. שים לב: pair תמיד יחיד. טעות נפוצה: להשתמש ב-are בגלל scissors.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'There _______ (be) lots of information on the website.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: information הוא uncountable באנגלית ולוקח is. שים לב: lots of יכול להופיע עם יחיד או רבים, השם העצם קובע. טעות נפוצה: לכתוב "informations" או להשתמש ב-are.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'There _______ hundreds of students at the university.',
        options: ['is', 'are', 'has', 'have'],
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: hundreds of + שם עצם רבים דורש are. שים לב: hundred/thousand/million עם "of" תמיד מלווה ברבים. טעות נפוצה: להתבלבל בין "a hundred students" (are) ו-"one hundred" (מספר).',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'There _______ (be) no chance of winning.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: chance הוא countable בצורת יחיד ("a chance" או "no chance"). שים לב: "no chance" = יחיד שלילי. טעות נפוצה: להשתמש ב-are עם "no".',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'There _______ a number of problems to solve.',
        options: ['is', 'are', 'has', 'have'],
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: "a number of" (כמה, מספר) משמעו "several" ולוקח רבים. שים לב: לא לבלבל עם "the number of" שלוקח יחיד. טעות נפוצה: לחשוב ש-number דורש is.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'There _______ (be) little hope for success.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: little (מעט) משמש עם uncountable ולוקח is. שים לב: little = not much (uncountable), few = not many (countable). טעות נפוצה: לבלבל little עם few.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'There _______ enough chairs for everyone.',
        options: ['is', 'are', 'has', 'have'],
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: chairs הוא רבים. שים לב: enough יכול להופיע עם יחיד או רבים, השם העצם קובע. טעות נפוצה: להתבלבל בגלל enough.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'There _______ (be) only one solution to this problem.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: one solution הוא יחיד. שים לב: only לא משנה את מספר השם העצם. טעות נפוצה: להשתמש ב-are כי המשפט מדבר על problems (רבים).',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 7.2: Negative ====================
  {
    topicNumber: 7,
    subtopicNumber: '7.2',
    titleEn: 'Negative Sentences',
    titleHe: 'משפטים שליליים',
    level: 'beginner',
    orderIndex: 2,
    theoryContentHe: `
<h2>There is / There are - משפטים שליליים</h2>

<p>ליצירת משפט שלילי, מוסיפים NOT אחרי is/are, או משתמשים בקיצור isn't/aren't.</p>

<div class="rules">
  <p><strong>THERE ISN'T (is not)</strong> + singular / uncountable:</p>
  <ul>
    <li>There <strong>isn't</strong> a book. - אין ספר</li>
    <li>There <strong>isn't</strong> any water. - אין מים</li>
    <li>There <strong>isn't</strong> a problem. - אין בעיה</li>
    <li>There <strong>isn't</strong> time. - אין זמן</li>
  </ul>

  <p><strong>THERE AREN'T (are not)</strong> + plural:</p>
  <ul>
    <li>There <strong>aren't</strong> any books. - אין ספרים</li>
    <li>There <strong>aren't</strong> three dogs. - אין שלושה כלבים</li>
    <li>There <strong>aren't</strong> many people. - אין הרבה אנשים</li>
    <li>There <strong>aren't</strong> any chairs. - אין כיסאות</li>
  </ul>
</div>

<div class="warning">
  <strong>זכור:</strong> singular/uncountable = isn't, plural = aren't
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'There _______ any information about the meeting.',
        options: ['isn\'t', 'aren\'t', 'not is', 'not are'],
        correctAnswer: 'isn\'t',
        explanationHe: 'תשובה נכונה: isn\'t. כלל: information הוא uncountable ולוקח isn\'t בשלילה. שים לב: אומרים "a piece of information" לא "an information". טעות נפוצה: לכתוב "informations" או להשתמש ב-aren\'t.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'There _______ (not be) any people in the office.',
        correctAnswer: 'aren\'t',
        explanationHe: 'תשובה נכונה: aren\'t. כלל: people תמיד רבים באנגלית, גם עם "any". שים לב: person = יחיד, people = רבים. טעות נפוצה: להשתמש ב-isn\'t עם people.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'There _______ much traffic today.',
        options: ['isn\'t', 'aren\'t', 'not is', 'not are'],
        correctAnswer: 'isn\'t',
        explanationHe: 'תשובה נכונה: isn\'t. כלל: traffic הוא uncountable ולוקח isn\'t. שים לב: much משמש עם uncountable בשלילה. טעות נפוצה: לחשוב ש-traffic יכול להיות ברבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'There _______ (not be) any furniture in the apartment.',
        correctAnswer: 'isn\'t',
        explanationHe: 'תשובה נכונה: isn\'t. כלל: furniture הוא uncountable ולא יכול להיות ברבים. שים לב: "any furniture" עדיין לוקח isn\'t. טעות נפוצה: לכתוב "furnitures" או להשתמש ב-aren\'t.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'There _______ any good news.',
        options: ['isn\'t', 'aren\'t', 'not is', 'not are'],
        correctAnswer: 'isn\'t',
        explanationHe: 'תשובה נכונה: isn\'t. כלל: news נראה כמו רבים אבל הוא יחיד ולוקח isn\'t. שים לב: mathematics, physics, news - כולם יחיד. טעות נפוצה: לכתוב aren\'t בגלל ה-s בסוף.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'There _______ (not be) many difficulties.',
        correctAnswer: 'aren\'t',
        explanationHe: 'תשובה נכונה: aren\'t. כלל: difficulties הוא רבים של difficulty. שים לב: many מצביע על רבים. טעות נפוצה: להשתמש ב-isn\'t בגלל "difficulty" ביחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'There _______ no water left.',
        options: ['is', 'isn\'t', 'are', 'aren\'t'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: "There is no" = "There isn\'t any" - שניהם נכונים ושווים. שים לב: no כבר שלילי, לא צריך isn\'t. טעות נפוצה: לכתוב "There isn\'t no water" (double negative).',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'There _______ (not be) any advice available.',
        correctAnswer: 'isn\'t',
        explanationHe: 'תשובה נכונה: isn\'t. כלל: advice הוא uncountable באנגלית ולוקח isn\'t. שים לב: אומרים "a piece of advice" לא "an advice". טעות נפוצה: לכתוב "advices".',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'There _______ many options to choose from.',
        options: ['is no', 'isn\'t', 'aren\'t', 'are no'],
        correctAnswer: 'aren\'t',
        explanationHe: 'תשובה נכונה: aren\'t. כלל: many מצביע על רבים, options רבים, לכן aren\'t. שים לב: many = countable plural. טעות נפוצה: להשתמש ב-isn\'t בגלל "many".',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'There _______ (not be) an apple and five oranges.',
        correctAnswer: 'isn\'t',
        explanationHe: 'תשובה נכונה: isn\'t. כלל: הפועל השלילי מתאים לפריט הראשון (an apple - יחיד). שים לב: "closest subject rule" חל גם בשלילה. טעות נפוצה: להשתמש ב-aren\'t בגלל "five oranges".',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'There _______ five apples and an orange.',
        options: ['is no', 'isn\'t', 'aren\'t', 'are no'],
        correctAnswer: 'aren\'t',
        explanationHe: 'תשובה נכונה: aren\'t. כלל: הפועל מתאים לפריט הראשון (five apples - רבים). שים לב: סדר הפריטים משנה את הפועל. טעות נפוצה: להשתמש ב-isn\'t.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'There _______ (not be) no hope.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: "There is no hope" נכון, אבל "There isn\'t no hope" הוא double negative ושגוי. שים לב: no כבר שלילי. טעות נפוצה: לכתוב isn\'t עם no (שלילה כפולה).',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'Which is correct: "There isn\'t any water" or "There is no water"?',
        options: ['Only the first', 'Only the second', 'Both are correct', 'Both are wrong'],
        correctAnswer: 'Both are correct',
        explanationHe: 'תשובה נכונה: Both are correct. כלל: "isn\'t any" = "is no" - שתי צורות שוות וחוקיות. שים לב: זו סגנון, לא טעות. טעות נפוצה: לחשוב שרק אחת נכונה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'There _______ (not be) much time left.',
        correctAnswer: 'isn\'t',
        explanationHe: 'תשובה נכונה: isn\'t. כלל: much משמש עם uncountable, time כשם כללי הוא uncountable. שים לב: much עם שלילה = not much. טעות נפוצה: להשתמש ב-aren\'t עם much.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'There _______ a hundred people at the event.',
        options: ['isn\'t', 'aren\'t', 'is no', 'are no'],
        correctAnswer: 'aren\'t',
        explanationHe: 'תשובה נכונה: aren\'t. כלל: people תמיד רבים, גם עם מספרים גדולים. שים לב: a hundred people = רבים. טעות נפוצה: להשתמש ב-isn\'t בגלל "a hundred".',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'There _______ (not be) any chairs or tables.',
        correctAnswer: 'aren\'t',
        explanationHe: 'תשובה נכונה: aren\'t. כלל: כשיש "or" בין שני פריטים רבים, משתמשים ב-aren\'t. שים לב: chairs ו-tables שניהם רבים. טעות נפוצה: להתבלבל בין and ל-or.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'There _______ a pair of scissors here.',
        options: ['isn\'t', 'aren\'t', 'is no', 'are no'],
        correctAnswer: 'isn\'t',
        explanationHe: 'תשובה נכונה: isn\'t. כלל: "a pair of" הוא יחיד, גם אם scissors רבים. שים לב: pair = יחיד תמיד. טעות נפוצה: להשתמש ב-aren\'t בגלל scissors.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'There _______ (not be) enough money.',
        correctAnswer: 'isn\'t',
        explanationHe: 'תשובה נכונה: isn\'t. כלל: money הוא uncountable באנגלית ולוקח isn\'t. שים לב: enough לא משנה את מספר השם העצם. טעות נפוצה: לחשוב ש-money יכול להיות ברבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'There is not _______ reason to worry.',
        options: ['some', 'any', 'no', 'many'],
        correctAnswer: 'any',
        explanationHe: 'תשובה נכונה: any. כלל: בשלילה משתמשים ב-any, לא ב-some. שים לב: "not...any" = שלילה אחת. טעות נפוצה: להשתמש ב-some בשלילה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'There _______ (not be) any homework today.',
        correctAnswer: 'isn\'t',
        explanationHe: 'תשובה נכונה: isn\'t. כלל: homework הוא uncountable באנגלית ולוקח isn\'t. שים לב: גם עם "any" נשאר isn\'t. טעות נפוצה: לכתוב "homeworks" או להשתמש ב-aren\'t.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 7.3: Questions ====================
  {
    topicNumber: 7,
    subtopicNumber: '7.3',
    titleEn: 'Questions',
    titleHe: 'שאלות',
    level: 'beginner',
    orderIndex: 3,
    theoryContentHe: `
<h2>There is / There are - שאלות</h2>

<p>ליצירת שאלה, מעבירים את is/are לפני there.</p>

<div class="rules">
  <p><strong>IS THERE</strong> + singular / uncountable?</p>
  <ul>
    <li><strong>Is there</strong> a book? - יש ספר?</li>
    <li><strong>Is there</strong> water? - יש מים?</li>
    <li><strong>Is there</strong> a problem? - יש בעיה?</li>
    <li><strong>Is there</strong> any coffee? - יש קפה?</li>
  </ul>

  <p><strong>ARE THERE</strong> + plural?</p>
  <ul>
    <li><strong>Are there</strong> books? - יש ספרים?</li>
    <li><strong>Are there</strong> any dogs? - יש כלבים?</li>
    <li><strong>Are there</strong> many people? - יש הרבה אנשים?</li>
    <li><strong>Are there</strong> chairs? - יש כיסאות?</li>
  </ul>
</div>

<div class="warning">
  <strong>זכור:</strong> שאלה = Is/Are + there + noun
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: '_______ any information about the meeting?',
        options: ['Is there', 'Are there', 'There is', 'There are'],
        correctAnswer: 'Is there',
        explanationHe: 'תשובה נכונה: Is there. כלל: information הוא uncountable ולוקח Is there בשאלות. שים לב: "any" משמש בשאלות עם uncountable. טעות נפוצה: להשתמש ב-Are there עם information.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: '_______ (be there) any people waiting?',
        correctAnswer: 'Are there',
        explanationHe: 'תשובה נכונה: Are there. כלל: people תמיד רבים באנגלית. שים לב: גם עם "any" צריך Are there. טעות נפוצה: להשתמש ב-Is there עם people.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'How _______ students are in the class?',
        options: ['many', 'much', 'often', 'long'],
        correctAnswer: 'many',
        explanationHe: 'תשובה נכונה: many. כלל: How many + plural noun לספירה. שים לב: השאלה המלאה: "How many students are there...?" טעות נפוצה: להשתמש ב-much עם countable.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'How _______ (much/many) water is there?',
        correctAnswer: 'much',
        explanationHe: 'תשובה נכונה: much. כלל: How much + uncountable noun. שים לב: water הוא uncountable, לכן much. טעות נפוצה: להשתמש ב-many עם uncountable.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: '_______ a bed and three chairs in the room?',
        options: ['Is there', 'Are there', 'There is', 'There are'],
        correctAnswer: 'Is there',
        explanationHe: 'תשובה נכונה: Is there. כלל: בשאלה, הפועל מתאים לפריט הראשון (a bed - יחיד). שים לב: "closest subject rule" חל גם בשאלות. טעות נפוצה: להשתמש ב-Are there בגלל הרשימה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: '_______ (be there) three chairs and a bed?',
        correctAnswer: 'Are there',
        explanationHe: 'תשובה נכונה: Are there. כלל: הפועל מתאים לפריט הראשון (three chairs - רבים). שים לב: סדר הפריטים משנה את הפועל. טעות נפוצה: להשתמש ב-Is there.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: '_______ any furniture in the apartment?',
        options: ['Is there', 'Are there', 'There is', 'There are'],
        correctAnswer: 'Is there',
        explanationHe: 'תשובה נכונה: Is there. כלל: furniture הוא uncountable ולוקח Is there. שים לב: "any furniture" עדיין יחיד. טעות נפוצה: לכתוב "furnitures" או להשתמש ב-Are there.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: '_______ (be there) any advice you can give?',
        correctAnswer: 'Is there',
        explanationHe: 'תשובה נכונה: Is there. כלל: advice הוא uncountable ולוקח Is there. שים לב: אומרים "a piece of advice" לא "an advice". טעות נפוצה: לכתוב "advices".',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: '_______ any news about the results?',
        options: ['Is there', 'Are there', 'There is', 'There are'],
        correctAnswer: 'Is there',
        explanationHe: 'תשובה נכונה: Is there. כלל: news נראה כמו רבים אבל הוא יחיד. שים לב: mathematics, physics, news - כולם יחיד. טעות נפוצה: לכתוב Are there בגלל ה-s בסוף.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'How _______ (much/many) traffic is there?',
        correctAnswer: 'much',
        explanationHe: 'תשובה נכונה: much. כלל: traffic הוא uncountable ולוקח How much. שים לב: How much לכמות, How many למספר. טעות נפוצה: להשתמש ב-many עם traffic.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'Would you like some coffee? (This is a/an _______)',
        options: ['offer - use some', 'question - use any', 'negative - use any', 'error'],
        correctAnswer: 'offer - use some',
        explanationHe: 'תשובה נכונה: offer - use some. כלל: בהצעות משתמשים ב-some גם בשאלות. שים לב: "Would you like some...?" הוא חריג לכלל. טעות נפוצה: להשתמש ב-any בהצעות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: '_______ (be there) anybody home?',
        correctAnswer: 'Is there',
        explanationHe: 'תשובה נכונה: Is there. כלל: anybody הוא יחיד ולוקח Is there. שים לב: anybody/anyone/anything = יחיד. טעות נפוצה: להשתמש ב-Are there עם anybody.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: '_______ a hundred people at the party?',
        options: ['Is there', 'Are there', 'Was there', 'Were there'],
        correctAnswer: 'Are there',
        explanationHe: 'תשובה נכונה: Are there. כלל: people תמיד רבים, גם עם מספרים גדולים. שים לב: a hundred people = רבים. טעות נפוצה: להשתמש ב-Is there בגלל "a hundred".',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'How _______ (much/many) homework is there today?',
        correctAnswer: 'much',
        explanationHe: 'תשובה נכונה: much. כלל: homework הוא uncountable ולוקח How much. שים לב: אומרים "a homework assignment" לא "a homework". טעות נפוצה: לכתוב "homeworks" או להשתמש ב-many.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: '_______ a pair of scissors in the drawer?',
        options: ['Is there', 'Are there', 'There is', 'There are'],
        correctAnswer: 'Is there',
        explanationHe: 'תשובה נכונה: Is there. כלל: "a pair of" הוא יחיד, גם אם scissors רבים. שים לב: pair = יחיד תמיד. טעות נפוצה: להשתמש ב-Are there בגלל scissors.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: '_______ (be there) enough chairs for everyone?',
        correctAnswer: 'Are there',
        explanationHe: 'תשובה נכונה: Are there. כלל: chairs הוא רבים. שים לב: enough לא משנה את מספר השם העצם. טעות נפוצה: להתבלבל בגלל enough.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'In formal English, which is more appropriate?',
        options: ['Is there any coffee?', 'There\'s coffee?', 'Coffee there is?', 'Any coffee is there?'],
        correctAnswer: 'Is there any coffee?',
        explanationHe: 'תשובה נכונה: Is there any coffee? כלל: בפורמלי משתמשים בסדר מילים מלא Is there + any. שים לב: "There\'s coffee?" הוא אינפורמלי. טעות נפוצה: להשתמש בסדר מילים של משפט חיובי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: '_______ (be there) any difficulties with the project?',
        correctAnswer: 'Are there',
        explanationHe: 'תשובה נכונה: Are there. כלל: difficulties הוא רבים של difficulty. שים לב: difficulty יכול להיות countable או uncountable. טעות נפוצה: להשתמש ב-Is there.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'How _______ time do we have?',
        options: ['much', 'many', 'long', 'often'],
        correctAnswer: 'much',
        explanationHe: 'תשובה נכונה: much. כלל: time כשם כללי הוא uncountable ולוקח How much. שים לב: השאלה המלאה: "How much time is there...?" טעות נפוצה: להשתמש ב-many עם time.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: '_______ (be there) anything I can do to help?',
        correctAnswer: 'Is there',
        explanationHe: 'תשובה נכונה: Is there. כלל: anything הוא יחיד ולוקח Is there. שים לב: anything/something/nothing = יחיד. טעות נפוצה: להשתמש ב-Are there עם anything.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 7.4: Short Answers ====================
  {
    topicNumber: 7,
    subtopicNumber: '7.4',
    titleEn: 'Short Answers',
    titleHe: 'תשובות קצרות',
    level: 'beginner',
    orderIndex: 4,
    theoryContentHe: `
<h2>There is / There are - תשובות קצרות</h2>

<p>תשובות קצרות לשאלות עם There is/are.</p>

<div class="rules">
  <p><strong>עם singular/uncountable:</strong></p>
  <ul>
    <li>Is there a book? → <strong>Yes, there is.</strong> (כן, יש)</li>
    <li>Is there water? → <strong>No, there isn't.</strong> (לא, אין)</li>
  </ul>

  <p><strong>עם plural:</strong></p>
  <ul>
    <li>Are there books? → <strong>Yes, there are.</strong> (כן, יש)</li>
    <li>Are there dogs? → <strong>No, there aren't.</strong> (לא, אין)</li>
  </ul>
</div>

<div class="examples">
  <p><strong>דוגמאות:</strong></p>
  <p>Q: Is there a park here? → A: Yes, there is.</p>
  <p>Q: Are there any chairs? → A: No, there aren't.</p>
</div>

<div class="warning">
  <strong>זכור:</strong> השתמש באותו is/are כמו בשאלה
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'Is there any information? → Yes, _______',
        options: ['there is', 'there are', 'it is', 'they are'],
        correctAnswer: 'there is',
        explanationHe: 'תשובה נכונה: there is. כלל: עונים באותו פועל כמו בשאלה - Is there → there is. שים לב: information uncountable, לכן is. טעות נפוצה: לענות "it is" במקום "there is".',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'Are there any people? → No, _______ (there not be)',
        correctAnswer: 'there aren\'t',
        explanationHe: 'תשובה נכונה: there aren\'t. כלל: people תמיד רבים, לכן aren\'t. שים לב: התשובה חייבת להתאים לשאלה Are there. טעות נפוצה: לענות "there isn\'t".',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'Is there a bed and three chairs? → Yes, _______',
        options: ['there is', 'there are', 'it is', 'they are'],
        correctAnswer: 'there is',
        explanationHe: 'תשובה נכונה: there is. כלל: התשובה מתאימה לשאלה. שים לב: השאלה התחילה ב-Is there, אז התשובה there is. טעות נפוצה: לענות "there are" בגלל הרשימה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'Are there any chairs? → Yes, _______ (there be)',
        correctAnswer: 'there are',
        explanationHe: 'תשובה נכונה: there are. כלל: התשובה מתאימה לשאלה Are there. שים לב: chairs רבים. טעות נפוצה: לענות "they are" במקום "there are".',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'Is there any furniture? → No, _______',
        options: ['there isn\'t', 'there aren\'t', 'it isn\'t', 'they aren\'t'],
        correctAnswer: 'there isn\'t',
        explanationHe: 'תשובה נכונה: there isn\'t. כלל: furniture uncountable ולוקח isn\'t. שים לב: התשובה מתאימה ל-Is there. טעות נפוצה: לענות "there aren\'t".',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'Is there any homework? → No, _______ (there not be)',
        correctAnswer: 'there isn\'t',
        explanationHe: 'תשובה נכונה: there isn\'t. כלל: homework uncountable ולוקח isn\'t. שים לב: גם עם "any" התשובה there isn\'t. טעות נפוצה: לכתוב "there aren\'t".',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'Are there a hundred people? → Yes, _______',
        options: ['there is', 'there are', 'it is', 'they are'],
        correctAnswer: 'there are',
        explanationHe: 'תשובה נכונה: there are. כלל: people תמיד רבים, גם עם מספרים. שים לב: השאלה Are there, התשובה there are. טעות נפוצה: לענות "there is".',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'Is there any news? → Yes, _______ (there be)',
        correctAnswer: 'there is',
        explanationHe: 'תשובה נכונה: there is. כלל: news נראה כמו רבים אבל הוא יחיד. שים לב: התשובה מתאימה ל-Is there. טעות נפוצה: לענות "there are".',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'Is there water? → Yes, _______. Which answer avoids redundancy?',
        options: ['there is water', 'there is some', 'there is', 'it is water'],
        correctAnswer: 'there is',
        explanationHe: 'תשובה נכונה: there is. כלל: תשובות קצרות לא חוזרות על השם העצם. שים לב: לא צריך להוסיף "water" או "some". טעות נפוצה: להוסיף מילים מיותרות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'Are there difficulties? → No, _______ (there not be)',
        correctAnswer: 'there aren\'t',
        explanationHe: 'תשובה נכונה: there aren\'t. כלל: difficulties רבים, לכן aren\'t. שים לב: התשובה מתאימה ל-Are there. טעות נפוצה: לענות "there isn\'t".',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'Is there a pair of scissors? → Yes, _______',
        options: ['there is', 'there are', 'it is', 'they are'],
        correctAnswer: 'there is',
        explanationHe: 'תשובה נכונה: there is. כלל: השאלה Is there, התשובה there is. שים לב: "a pair of" יחיד. טעות נפוצה: לענות "there are" בגלל scissors.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'Is there advice? → No, _______ (there not be)',
        correctAnswer: 'there isn\'t',
        explanationHe: 'תשובה נכונה: there isn\'t. כלל: advice uncountable ולוקח isn\'t. שים לב: התשובה מתאימה ל-Is there. טעות נפוצה: לכתוב "there aren\'t".',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'Which is the correct short answer to "Is there a problem?"',
        options: ['Yes, it is', 'Yes, there is a problem', 'Yes, there is', 'Yes, is there'],
        correctAnswer: 'Yes, there is',
        explanationHe: 'תשובה נכונה: Yes, there is. כלל: תשובה קצרה לא חוזרת על השם העצם. שים לב: "Yes, it is" שגוי כי השאלה "there". טעות נפוצה: לחזור על כל המשפט.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'Are there chairs or tables? → Yes, _______ (there be)',
        correctAnswer: 'there are',
        explanationHe: 'תשובה נכונה: there are. כלל: שני פריטים רבים עם "or" לוקחים are. שים לב: התשובה מתאימה ל-Are there. טעות נפוצה: לענות "there is".',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'Is there enough time? → No, _______',
        options: ['there isn\'t', 'there aren\'t', 'it isn\'t', 'they aren\'t'],
        correctAnswer: 'there isn\'t',
        explanationHe: 'תשובה נכונה: there isn\'t. כלל: time uncountable ולוקח isn\'t. שים לב: התשובה מתאימה ל-Is there. טעות נפוצה: לענות "it isn\'t".',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'Are there enough chairs? → No, _______ (there not be)',
        correctAnswer: 'there aren\'t',
        explanationHe: 'תשובה נכונה: there aren\'t. כלל: chairs רבים, לכן aren\'t. שים לב: enough לא משנה את התשובה. טעות נפוצה: לענות "there isn\'t".',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'Is there anybody home? → Yes, _______',
        options: ['there is', 'there are', 'it is', 'they are'],
        correctAnswer: 'there is',
        explanationHe: 'תשובה נכונה: there is. כלל: anybody יחיד ולוקח is. שים לב: התשובה מתאימה ל-Is there. טעות נפוצה: לענות "there are".',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'Is there anything to eat? → Yes, _______ (there be)',
        correctAnswer: 'there is',
        explanationHe: 'תשובה נכונה: there is. כלל: anything יחיד ולוקח is. שים לב: לא צריך לחזור על "to eat". טעות נפוצה: להוסיף מילים מיותרות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'Are there any options? → Yes, _______. What\'s wrong with "Yes, they are"?',
        options: ['Nothing, it\'s correct', 'Should be "there are"', 'Should be "there is"', 'Should be "it is"'],
        correctAnswer: 'Should be "there are"',
        explanationHe: 'תשובה נכונה: Should be "there are". כלל: עונים עם "there" לשאלות עם "there". שים לב: "they are" משמש לשאלות עם Are they. טעות נפוצה: לבלבל בין there are ו-they are.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'Is there traffic? → Yes, _______ (there be)',
        correctAnswer: 'there is',
        explanationHe: 'תשובה נכונה: there is. כלל: traffic uncountable ולוקח is. שים לב: התשובה מתאימה ל-Is there. טעות נפוצה: לענות "there are".',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 7.5: Some/Any ====================
  {
    topicNumber: 7,
    subtopicNumber: '7.5',
    titleEn: 'Some/Any Usage',
    titleHe: 'שימוש ב-Some/Any',
    level: 'beginner',
    orderIndex: 5,
    theoryContentHe: `
<h2>There is / There are עם Some/Any</h2>

<p>משתמשים ב-some ו-any עם There is/are כדי לציין כמות לא מדויקת.</p>

<div class="rules">
  <p><strong>SOME במשפטים חיוביים:</strong></p>
  <ul>
    <li>There is <strong>some</strong> water. - יש קצת מים</li>
    <li>There are <strong>some</strong> books. - יש כמה ספרים</li>
    <li>There is <strong>some</strong> food. - יש קצת אוכל</li>
  </ul>

  <p><strong>ANY בשאלות ושלילות:</strong></p>
  <ul>
    <li>Is there <strong>any</strong> water? - יש מים?</li>
    <li>There isn't <strong>any</strong> water. - אין מים</li>
    <li>Are there <strong>any</strong> books? - יש ספרים?</li>
    <li>There aren't <strong>any</strong> books. - אין ספרים</li>
  </ul>
</div>

<div class="warning">
  <strong>זכור:</strong> חיובי = some, שאלה/שלילה = any
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'There is _______ information available.',
        options: ['some', 'any', 'a', 'an'],
        correctAnswer: 'some',
        explanationHe: 'תשובה נכונה: some. כלל: במשפטים חיוביים משתמשים ב-some. שים לב: information uncountable, אבל עדיין some. טעות נפוצה: להשתמש ב-any במשפט חיובי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'Would you like _______ (some/any) coffee?',
        correctAnswer: 'some',
        explanationHe: 'תשובה נכונה: some. כלל: בהצעות (Would you like...?) משתמשים ב-some, לא ב-any. שים לב: זה חריג לכלל - שאלה אבל some. טעות נפוצה: להשתמש ב-any בהצעות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'There isn\'t _______ furniture in the room.',
        options: ['some', 'any', 'a', 'an'],
        correctAnswer: 'any',
        explanationHe: 'תשובה נכונה: any. כלל: במשפטים שליליים משתמשים ב-any. שים לב: furniture uncountable אבל עדיין any. טעות נפוצה: להשתמש ב-some בשלילה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'Is there _______ (some/any) advice you can give?',
        correctAnswer: 'any',
        explanationHe: 'תשובה נכונה: any. כלל: בשאלות רגילות משתמשים ב-any. שים לב: advice uncountable אבל עדיין any. טעות נפוצה: להשתמש ב-some בשאלות רגילות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'There are _______ people waiting.',
        options: ['some', 'any', 'a', 'an'],
        correctAnswer: 'some',
        explanationHe: 'תשובה נכונה: some. כלל: במשפט חיובי עם רבים משתמשים ב-some. שים לב: people תמיד רבים. טעות נפוצה: להשתמש ב-any במשפט חיובי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'There is no water. = There isn\'t _______ (some/any) water.',
        correctAnswer: 'any',
        explanationHe: 'תשובה נכונה: any. כלל: "no" = "not any", שתי צורות שוות. שים לב: no כבר שלילי, לכן עם isn\'t צריך any. טעות נפוצה: להשתמש ב-some.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'Is there _______ somebody at the door?',
        options: ['somebody', 'anybody', 'nobody', 'everybody'],
        correctAnswer: 'anybody',
        explanationHe: 'תשובה נכונה: anybody. כלל: בשאלות משתמשים ב-anybody, לא ב-somebody. שים לב: any-compounds בשאלות. טעות נפוצה: להשתמש ב-somebody בשאלות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'There is _______ (something/anything) I need to tell you.',
        correctAnswer: 'something',
        explanationHe: 'תשובה נכונה: something. כלל: במשפט חיובי משתמשים ב-something. שים לב: some-compounds בחיוב. טעות נפוצה: להשתמש ב-anything במשפט חיובי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'There aren\'t _______ chairs available.',
        options: ['some', 'any', 'no', 'none'],
        correctAnswer: 'any',
        explanationHe: 'תשובה נכונה: any. כלל: במשפט שלילי (aren\'t) משתמשים ב-any. שים לב: לא "no" כי aren\'t כבר שלילי. טעות נפוצה: לכתוב "aren\'t no" (double negative).',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'Can I have _______ (some/any) help?',
        correctAnswer: 'some',
        explanationHe: 'תשובה נכונה: some. כלל: בבקשות (Can I have...?) משתמשים ב-some, לא ב-any. שים לב: בקשות = חריג לכלל. טעות נפוצה: להשתמש ב-any בבקשות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'There isn\'t _______ in the box.',
        options: ['something', 'anything', 'nothing', 'everything'],
        correctAnswer: 'anything',
        explanationHe: 'תשובה נכונה: anything. כלל: בשלילה (isn\'t) משתמשים ב-anything. שים לב: any-compounds בשלילה. טעות נפוצה: להשתמש ב-nothing עם isn\'t (double negative).',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'There are _______ (some/any) difficulties we need to solve.',
        correctAnswer: 'some',
        explanationHe: 'תשובה נכונה: some. כלל: במשפט חיובי משתמשים ב-some. שים לב: difficulties רבים אבל עדיין some. טעות נפוצה: להשתמש ב-any במשפט חיובי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'Are there _______ questions?',
        options: ['some', 'any', 'a', 'an'],
        correctAnswer: 'any',
        explanationHe: 'תשובה נכונה: any. כלל: בשאלות רגילות משתמשים ב-any. שים לב: לא הצעה או בקשה, לכן any. טעות נפוצה: להשתמש ב-some בשאלות רגילות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'There isn\'t _______ (somebody/anybody) home.',
        correctAnswer: 'anybody',
        explanationHe: 'תשובה נכונה: anybody. כלל: בשלילה משתמשים ב-anybody. שים לב: any-compounds עם isn\'t. טעות נפוצה: להשתמש ב-somebody בשלילה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'There is _______ to worry about.',
        options: ['something', 'anything', 'nothing', 'everything'],
        correctAnswer: 'nothing',
        explanationHe: 'תשובה נכונה: nothing. כלל: "There is nothing" = משפט חיובי עם מילה שלילית. שים לב: nothing = not anything, אבל עם is לא isn\'t. טעות נפוצה: לכתוב "There isn\'t nothing".',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'Would you like _______ (something/anything) to eat?',
        correctAnswer: 'something',
        explanationHe: 'תשובה נכונה: something. כלל: בהצעות משתמשים ב-something. שים לב: Would you like...? = הצעה, לכן some-compounds. טעות נפוצה: להשתמש ב-anything בהצעות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'There aren\'t _______ people who know this.',
        options: ['much', 'many', 'some', 'any'],
        correctAnswer: 'many',
        explanationHe: 'תשובה נכונה: many. כלל: בשלילה עם countable משתמשים ב-many, לא ב-much. שים לב: people = countable, לכן many. טעות נפוצה: להשתמש ב-much עם people.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'There isn\'t _______ (much/many) time left.',
        correctAnswer: 'much',
        explanationHe: 'תשובה נכונה: much. כלל: בשלילה עם uncountable משתמשים ב-much. שים לב: time = uncountable, לכן much. טעות נפוצה: להשתמש ב-many עם time.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'Which is correct?',
        options: ['There is some water', 'There is any water', 'There isn\'t some water', 'Is there some water (normal question)?'],
        correctAnswer: 'There is some water',
        explanationHe: 'תשובה נכונה: There is some water. כלל: חיובי = some, שלילה/שאלה רגילה = any. שים לב: some במשפט חיובי בלבד. טעות נפוצה: להשתמש ב-any במשפט חיובי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'Could you give me _______ (some/any) information?',
        correctAnswer: 'some',
        explanationHe: 'תשובה נכונה: some. כלל: בבקשות (Could you...?) משתמשים ב-some. שים לב: בקשות = חריג לכלל, כמו הצעות. טעות נפוצה: להשתמש ב-any בבקשות.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 7.6: Describing Places ====================
  {
    topicNumber: 7,
    subtopicNumber: '7.6',
    titleEn: 'Describing Rooms and Places',
    titleHe: 'תיאור חדרים ומקומות',
    level: 'beginner',
    orderIndex: 6,
    theoryContentHe: `
<h2>תיאור חדרים ומקומות עם There is/are</h2>

<p>משתמשים ב-There is/are כדי לתאר מה יש במקום מסוים.</p>

<div class="examples">
  <p><strong>בחדר שלי (In my room):</strong></p>
  <ul>
    <li>There is a bed. - יש מיטה</li>
    <li>There is a desk. - יש שולחן</li>
    <li>There are two windows. - יש שני חלונות</li>
    <li>There are many books. - יש הרבה ספרים</li>
  </ul>

  <p><strong>בכיתה (In the classroom):</strong></p>
  <ul>
    <li>There is a board. - יש לוח</li>
    <li>There are thirty chairs. - יש שלושים כיסאות</li>
    <li>There is one teacher. - יש מורה אחד</li>
  </ul>

  <p><strong>בעיר (In the city):</strong></p>
  <ul>
    <li>There is a park. - יש פארק</li>
    <li>There are many shops. - יש הרבה חנויות</li>
    <li>There is a museum. - יש מוזיאון</li>
  </ul>
</div>

<div class="rules">
  <p><strong>מבנה:</strong> There is/are + noun + location</p>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'In the living room, there _______ a sofa and three chairs.',
        options: ['is', 'are', 'has', 'have'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: הפועל מתאים לפריט הראשון (a sofa - יחיד). שים לב: "closest subject rule" - התאמה לפריט הקרוב ביותר. טעות נפוצה: להשתמש ב-are בגלל הרשימה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'In my bedroom, there _______ (be) two beds and a desk.',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: הפועל מתאים לפריט הראשון (two beds - רבים). שים לב: סדר הפריטים משנה את הפועל. טעות נפוצה: להשתמש ב-is.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'In the kitchen, there _______ several cabinets and a refrigerator.',
        options: ['is', 'are', 'has', 'have'],
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: several (כמה) + cabinets רבים = are. שים לב: several תמיד עם רבים. טעות נפוצה: להשתמש ב-is בגלל refrigerator.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'On the wall, there _______ (be) a painting and many photos.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: הפועל מתאים לפריט הראשון (a painting - יחיד). שים לב: closest subject rule חשוב בתיאורי מקומות. טעות נפוצה: להשתמש ב-are בגלל photos.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'In the city center, there _______ many shops and restaurants.',
        options: ['is', 'are', 'has', 'have'],
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: many shops רבים = are. שים לב: שני פריטים רבים עם "and" לוקחים are. טעות נפוצה: להשתמש ב-is או have.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'In the park, there _______ (be) a few benches under the trees.',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: a few (כמה) + benches רבים = are. שים לב: a few תמיד עם countable plural. טעות נפוצה: להשתמש ב-is בגלל "a few".',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'On the desk, there _______ a little space left.',
        options: ['is', 'are', 'has', 'have'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: a little (מעט) + space uncountable = is. שים לב: a little עם uncountable, a few עם countable. טעות נפוצה: להשתמש ב-are או לבלבל little עם few.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'In the classroom, there _______ (be) thirty students and one teacher.',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: הפועל מתאים לפריט הראשון (thirty students - רבים). שים לב: students = people, תמיד רבים. טעות נפוצה: להשתמש ב-is.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'Near my house, there _______ a supermarket, a pharmacy, and a bank.',
        options: ['is', 'are', 'has', 'have'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: הפועל מתאים לפריט הראשון (a supermarket - יחיד). שים לב: גם עם שלושה פריטים, רק הראשון משנה. טעות נפוצה: להשתמש ב-are בגלל הרשימה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'In the office, there _______ (be) several computers on the desks.',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: several computers רבים = are. שים לב: מיקום (on the desks) לא משנה את הפועל. טעות נפוצה: להתבלבל בגלל מילת יחס.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'In the bathroom, there _______ a shower, a sink, and a mirror.',
        options: ['is', 'are', 'has', 'have'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: הפועל מתאים לפריט הראשון (a shower - יחיד). שים לב: closest subject rule בתיאור חדרים. טעות נפוצה: להשתמש ב-are בגלל הרשימה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'Around the building, there _______ (be) many trees and flowers.',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: many trees רבים = are. שים לב: מילת יחס (around) לא משנה את הכלל. טעות נפוצה: להתבלבל בגלל מיקום.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'In the library, there _______ thousands of books.',
        options: ['is', 'are', 'has', 'have'],
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: thousands of + books רבים = are. שים לב: מספרים גדולים עם "of" תמיד רבים. טעות נפוצה: להשתמש ב-is או have.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'In the center of the room, there _______ (be) a large table.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: a table יחיד = is. שים לב: "in the center of" לא משנה את הפועל. טעות נפוצה: להתבלבל בגלל מיקום מורכב.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'On each shelf, there _______ several books and magazines.',
        options: ['is', 'are', 'has', 'have'],
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: several books רבים = are. שים לב: "on each shelf" מדבר על כל מדף בנפרד, אבל הפועל מתאים לפריטים. טעות נפוצה: להשתמש ב-is בגלל "each".',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'In front of the school, there _______ (be) a big playground.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: a playground יחיד = is. שים לב: "in front of" לא משנה את הפועל. טעות נפוצה: להתבלבל בגלל מילות יחס מורכבות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'In this neighborhood, there _______ a lot of noise at night.',
        options: ['is', 'are', 'has', 'have'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: noise uncountable = is. שים לב: "a lot of" יכול להופיע עם יחיד או רבים, השם העצם קובע. טעות נפוצה: להשתמש ב-are בגלל "a lot of".',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'Between the two buildings, there _______ (be) a small garden.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: a garden יחיד = is. שים לב: "between the two buildings" לא משנה את הפועל. טעות נפוצה: להשתמש ב-are בגלל "two buildings".',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'In the shopping mall, there _______ hundreds of people every day.',
        options: ['is', 'are', 'has', 'have'],
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: people תמיד רבים, גם עם מספרים גדולים. שים לב: hundreds of people = רבים. טעות נפוצה: להשתמש ב-is או have.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'Throughout the city, there _______ (be) many beautiful buildings.',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: many buildings רבים = are. שים לב: throughout (לאורך כל) לא משנה את הפועל. טעות נפוצה: להתבלבל בגלל מילות יחס מורכבות.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 7.7: Common Mistakes ====================
  {
    topicNumber: 7,
    subtopicNumber: '7.7',
    titleEn: 'Common Mistakes',
    titleHe: 'טעויות נפוצות',
    level: 'beginner',
    orderIndex: 7,
    theoryContentHe: `
<h2>טעויות נפוצות עם There is/are</h2>

<p>הנה הטעויות הנפוצות ביותר וכיצד לתקן אותן:</p>

<div class="examples">
  <h3>טעויות בבחירת is/are:</h3>
  <p>❌ <strong>שגוי:</strong> There <strong>are</strong> a book.<br>
  ✅ <strong>נכון:</strong> There <strong>is</strong> a book. (singular)</p>
  <p>❌ <strong>שגוי:</strong> There <strong>is</strong> three dogs.<br>
  ✅ <strong>נכון:</strong> There <strong>are</strong> three dogs. (plural)</p>
  <p>❌ <strong>שגוי:</strong> Is there books?<br>
  ✅ <strong>נכון:</strong> Are there books? (plural)</p>
  <p>❌ <strong>שגוי:</strong> There isn't books.<br>
  ✅ <strong>נכון:</strong> There aren't books. (plural)</p>

  <h3>טעויות עם have:</h3>
  <p>❌ <strong>שגוי:</strong> There <strong>have</strong> a problem.<br>
  ✅ <strong>נכון:</strong> There <strong>is</strong> a problem. (not "have")</p>
  <p>❌ <strong>שגוי:</strong> There <strong>has</strong> many people.<br>
  ✅ <strong>נכון:</strong> There <strong>are</strong> many people. (not "has")</p>

  <h3>טעויות עם people:</h3>
  <p>❌ <strong>שגוי:</strong> There is many people.<br>
  ✅ <strong>נכון:</strong> There are many people. (people = plural)</p>
  <p>❌ <strong>שגוי:</strong> There is people.<br>
  ✅ <strong>נכון:</strong> There are people. (people = plural)</p>

  <h3>טעויות עם some/any:</h3>
  <p>❌ <strong>שגוי:</strong> Is there <strong>some</strong> water?<br>
  ✅ <strong>נכון:</strong> Is there <strong>any</strong> water? (questions = any)</p>
  <p>❌ <strong>שגוי:</strong> There aren't <strong>some</strong> chairs.<br>
  ✅ <strong>נכון:</strong> There aren't <strong>any</strong> chairs. (negative = any)</p>
</div>

<div class="rules">
  <p><strong>זכור תמיד:</strong></p>
  <ul>
    <li>Singular/uncountable → is</li>
    <li>Plural → are</li>
    <li>לא משתמשים ב-have/has עם There</li>
    <li>People תמיד רבים</li>
    <li>Questions & negatives → any</li>
  </ul>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'What is wrong? "There is people waiting."',
        options: ['Should be "are"', 'Should be "have"', 'Should be "was"', 'Nothing wrong'],
        correctAnswer: 'Should be "are"',
        explanationHe: 'תשובה נכונה: Should be "are". כלל: people תמיד רבים באנגלית ולוקח are. שים לב: person = יחיד, people = רבים תמיד. טעות נפוצה: להשתמש ב-is עם people.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'Fix the error: "There have a problem." → There _______ a problem.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: עם There אף פעם לא משתמשים ב-have/has, רק ב-is/are. שים לב: have משמש עם I/you/we/they, לא עם There. טעות נפוצה: להשתמש ב-have במקום is.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'What is wrong? "There are a book on the table."',
        options: ['Should be "is"', 'Should be "has"', 'Should be "was"', 'Nothing wrong'],
        correctAnswer: 'Should be "is"',
        explanationHe: 'תשובה נכונה: Should be "is". כלל: a book יחיד, לכן צריך is לא are. שים לב: התאמה בין is/are לשם העצם חובה. טעות נפוצה: להשתמש ב-are עם יחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'Fix: "Is there some water?" → Is there _______ water?',
        correctAnswer: 'any',
        explanationHe: 'תשובה נכונה: any. כלל: בשאלות רגילות משתמשים ב-any, לא ב-some. שים לב: some בשאלות רק בהצעות/בקשות. טעות נפוצה: להשתמש ב-some בשאלות רגילות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'What is wrong? "There has many students."',
        options: ['Should be "are"', 'Should be "is"', 'Should be "have"', 'Nothing wrong'],
        correctAnswer: 'Should be "are"',
        explanationHe: 'תשובה נכונה: Should be "are". כלל: אף פעם לא There has, רק There is/are. שים לב: students רבים, לכן are. טעות נפוצה: להשתמש ב-has במקום are.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'Fix: "There isn\'t books." → There _______ books.',
        correctAnswer: 'aren\'t',
        explanationHe: 'תשובה נכונה: aren\'t. כלל: books רבים, לכן צריך aren\'t לא isn\'t. שים לב: התאמה חובה גם בשלילה. טעות נפוצה: להשתמש ב-isn\'t עם רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'What is wrong? "There aren\'t some chairs."',
        options: ['Should be "any"', 'Should be "a"', 'Should be "is"', 'Nothing wrong'],
        correctAnswer: 'Should be "any"',
        explanationHe: 'תשובה נכונה: Should be "any". כלל: בשלילה משתמשים ב-any, לא ב-some. שים לב: aren\'t = שלילה, לכן any. טעות נפוצה: להשתמש ב-some בשלילה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'Fix: "There is many people." → There _______ many people.',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: people תמיד רבים ולוקח are. שים לב: many מצביע על רבים. טעות נפוצה: להשתמש ב-is עם people.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'What is wrong? "Is there books on the shelf?"',
        options: ['Should be "Are there"', 'Should be "Has there"', 'Should be "There is"', 'Nothing wrong'],
        correctAnswer: 'Should be "Are there"',
        explanationHe: 'תשובה נכונה: Should be "Are there". כלל: books רבים, לכן צריך Are there בשאלה. שים לב: התאמה חובה גם בשאלות. טעות נפוצה: להשתמש ב-Is there עם רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'Fix: "There isn\'t no water." → There _______ water.',
        correctAnswer: 'isn\'t any',
        explanationHe: 'תשובה נכונה: isn\'t any. כלל: "isn\'t no" הוא double negative ושגוי. שים לב: אפשר "There is no" או "There isn\'t any". טעות נפוצה: לכתוב שתי שליליות ביחד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'What is wrong? "There is three books."',
        options: ['Should be "are"', 'Should be "has"', 'Should be "was"', 'Nothing wrong'],
        correctAnswer: 'Should be "are"',
        explanationHe: 'תשובה נכונה: Should be "are". כלל: three books רבים, לכן are. שים לב: מספר + רבים = are. טעות נפוצה: להשתמש ב-is עם מספרים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'Fix: "There are a problem." → There _______ a problem.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: a problem יחיד, לכן is. שים לב: "a" מצביע על יחיד תמיד. טעות נפוצה: להשתמש ב-are עם "a".',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'What is wrong? "There isn\'t people."',
        options: ['Should be "aren\'t"', 'Should be "hasn\'t"', 'Should be "wasn\'t"', 'Nothing wrong'],
        correctAnswer: 'Should be "aren\'t"',
        explanationHe: 'תשובה נכונה: Should be "aren\'t". כלל: people רבים, צריך aren\'t גם בשלילה. שים לב: people תמיד רבים. טעות נפוצה: להשתמש ב-isn\'t עם people.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'Fix: "Are there a chair?" → _______ a chair?',
        correctAnswer: 'Is there',
        explanationHe: 'תשובה נכונה: Is there. כלל: a chair יחיד, לכן Is there. שים לב: "a" מצביע על יחיד. טעות נפוצה: להשתמש ב-Are there עם "a".',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'What is wrong? "There\'s thirty people."',
        options: ['Should be "are"', 'Should be "has"', 'Should be "is"', 'Nothing wrong'],
        correctAnswer: 'Should be "are"',
        explanationHe: 'תשובה נכונה: Should be "are". כלל: people רבים, לכן are. שים לב: There\'s = There is, לא מתאים לרבים. טעות נפוצה: להשתמש ב-There\'s עם people.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'Fix: "There have many options." → There _______ many options.',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: אף פעם לא There have, רק is/are. שים לב: options רבים, לכן are. טעות נפוצה: להשתמש ב-have במקום are.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'What is wrong? "There are some water."',
        options: ['Should be "is"', 'Should be "has"', 'Should be "have"', 'Nothing wrong'],
        correctAnswer: 'Should be "is"',
        explanationHe: 'תשובה נכונה: Should be "is". כלל: water uncountable, לכן is. שים לב: some יכול להיות עם יחיד או רבים, השם העצם קובע. טעות נפוצה: להשתמש ב-are עם uncountable.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'Fix: "There is people waiting." → There _______ people waiting.',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: people תמיד רבים באנגלית. שים לב: זו הטעות השכיחה ביותר עם There is/are. טעות נפוצה: להשתמש ב-is עם people.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'What is wrong? "There aren\'t no chairs."',
        options: ['Double negative - remove "no"', 'Should be "isn\'t"', 'Should be "haven\'t"', 'Nothing wrong'],
        correctAnswer: 'Double negative - remove "no"',
        explanationHe: 'תשובה נכונה: Double negative - remove "no". כלל: "aren\'t no" הוא שלילה כפולה. שים לב: צריך "aren\'t any" או "are no". טעות נפוצה: לכתוב שתי שליליות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'Fix: "There is informations." → There _______ information.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: information uncountable ולא יכול להיות ברבים. שים לב: "informations" לא קיים באנגלית. טעות נפוצה: להוסיף s ל-information.',
        difficulty: 'hard'
      }
    ]
  }
];

// Seed function
async function seedTopic7() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('Starting to seed Topic 7: There is/are...');

    for (const lessonData of lessonsData) {
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
    console.log('✅ Topic 7: There is/are seeded successfully!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding Topic 7:', error);
    throw error;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  seedTopic7()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedTopic7, lessonsData };
