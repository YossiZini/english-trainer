const { pool } = require('../../config/database');
const Lesson = require('../../models/Lesson');
const Exercise = require('../../models/Exercise');

// Topic 14: Prepositions of Time (מילות יחס - זמן)
const lessonsData = [
  // ==================== SUBTOPIC 14.1: At (times, holidays) ====================
  {
    topicNumber: 14,
    subtopicNumber: '14.1',
    titleEn: 'At (times, holidays)',
    titleHe: 'ב- לשעות וחגים',
    level: 'beginner',
    orderIndex: 1,
    theoryContentHe: `
<h2>שימוש ב-AT לזמנים ספציפיים</h2>

<p>משתמשים ב-AT לשעות מדויקות, חגים ורגעים ספציפיים.</p>

<div class="rules">
  <h3><strong>AT לשעות:</strong></h3>
  <ul>
    <li>at 8 o'clock (בשעה 8)</li>
    <li>at 7:30 (בשעה 7:30)</li>
    <li>at noon (בצהריים)</li>
    <li>at midnight (בחצות)</li>
    <li>at night (בלילה)</li>
    <li>at sunrise (בזריחה)</li>
    <li>at sunset (בשקיעה)</li>
  </ul>

  <h3><strong>AT לחגים:</strong></h3>
  <ul>
    <li>at Christmas (בחג המולד)</li>
    <li>at Easter (בפסחא)</li>
    <li>at Hanukkah (בחנוכה)</li>
  </ul>

  <h3><strong>AT לביטויים מיוחדים:</strong></h3>
  <ul>
    <li>at the moment (ברגע זה)</li>
    <li>at present (כרגע)</li>
    <li>at the same time (באותו זמן)</li>
    <li>at the weekend (בסוף שבוע - British)</li>
  </ul>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'I wake up _____ 7 o\'clock every morning.',
        options: ['at', 'on', 'in', 'for'],
        correctAnswer: 'at',
        explanationHe: 'תשובה נכונה: at\nכלל: משתמשים ב-AT לשעות מדויקות (at 7 o\'clock, at 3:30, at noon).\nשים לב: AT משמש לזמנים ספציפיים ומדויקים, בניגוד ל-IN שמשמש לתקופות ארוכות.\nטעות נפוצה: תלמידים אומרים "in 7 o\'clock" אבל הנכון הוא AT לשעות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'The party starts _____ midnight.',
        options: ['in', 'on', 'at', 'for'],
        correctAnswer: 'at',
        explanationHe: 'תשובה נכונה: at\nכלל: midnight (חצות) ו-noon (צהריים) הם זמנים ספציפיים שדורשים AT.\nשים לב: גם at sunrise (בזריחה) ו-at sunset (בשקיעה) עובדים לפי אותו עקרון.\nטעות נפוצה: לומר "in midnight" במקום "at midnight".',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'We celebrate _____ Christmas every year.',
        correctAnswer: 'at',
        explanationHe: 'תשובה נכונה: at\nכלל: חגים מקבלים AT (at Christmas, at Easter, at Hanukkah, at Thanksgiving).\nשים לב: כאשר מדברים על יום חג ספציפי (Christmas Day) נשתמש ב-ON.\nטעות נפוצה: לומר "in Christmas" או "on Christmas" במקום "at Christmas".',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'It\'s dangerous to walk alone _____ night.',
        options: ['in', 'on', 'at', 'during'],
        correctAnswer: 'at',
        explanationHe: 'תשובה נכונה: at\nכלל: AT NIGHT הוא ביטוי קבוע וחריג - למרות שחלקי יום אחרים (morning, afternoon, evening) משתמשים ב-IN.\nשים לב: "in the night" יכול להיות נכון רק כשמדברים על זמן ספציפי בתוך הלילה.\nטעות נפוצה: לומר "in night" בגלל שאומרים "in the morning".',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'She can\'t talk _____ the moment, she\'s in a meeting.',
        correctAnswer: 'at',
        explanationHe: 'תשובה נכונה: at\nכלל: "at the moment" הוא ביטוי קבוע שפירושו "ברגע זה, כעת".\nשים לב: ביטויים דומים: at present (כרגע), at the same time (באותו זמן).\nטעות נפוצה: לומר "in the moment" במקום "at the moment".',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'The train arrives _____ 3:45 PM.',
        options: ['on', 'in', 'at', 'for'],
        correctAnswer: 'at',
        explanationHe: 'תשובה נכונה: at\nכלל: שעות עם דקות (3:45, 7:30, 11:15) תמיד מקבלות AT.\nשים לב: גם כשיש "PM" או "AM" אחרי השעה, עדיין משתמשים ב-AT.\nטעות נפוצה: לבלבל בין AT לשעות ו-ON לימים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'We always travel _____ Easter to visit family.',
        options: ['in', 'on', 'at', 'during'],
        correctAnswer: 'at',
        explanationHe: 'תשובה נכונה: at\nכלל: חגים דתיים וחגים גדולים מקבלים AT (at Easter, at Passover, at Ramadan).\nשים לב: DURING משמשת כש"במהלך" החג, AT משמש לחג עצמו.\nטעות נפוצה: להשתמש ב-DURING כשמתכוונים לחג עצמו ולא למהלך החג.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'Let\'s meet _____ noon at the café.',
        correctAnswer: 'at',
        explanationHe: 'תשובה נכונה: at\nכלל: noon (צהריים) הוא זמן ספציפי שדורש AT, כמו midnight.\nשים לב: "at midday" הוא נרדף ל-"at noon".\nטעות נפוצה: לחשוב ש-noon זה חלק מהיום ולהשתמש ב-IN.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'They work _____ night and sleep during the day.',
        options: ['in', 'on', 'at', 'for'],
        correctAnswer: 'at',
        explanationHe: 'תשובה נכונה: at\nכלל: AT NIGHT הוא החריג היחיד - כל חלקי היום האחרים (morning, afternoon, evening) משתמשים ב-IN.\nשים לב: זה ביטוי קבוע שצריך לשנן, אין הסבר לוגי למה זה שונה.\nטעות נפוצה: לומר "in night" מפני שאומרים "in the morning".',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'I usually go to the gym _____ the weekend.',
        correctAnswer: 'at',
        explanationHe: 'תשובה נכונה: at (British) או on (American)\nכלל: "at the weekend" בריטי, "on the weekend" אמריקאי - שניהם נכונים.\nשים לב: שימו לב להבדל האזורי, בבריטניה AT בארה"ב ON.\nטעות נפוצה: לשכוח את המילה "the" - צריך "at THE weekend".',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'The ceremony begins _____ sunrise tomorrow.',
        options: ['in', 'on', 'at', 'for'],
        correctAnswer: 'at',
        explanationHe: 'תשובה נכונה: at\nכלל: sunrise (זריחה) ו-sunset (שקיעה) הם רגעים ספציפיים שמקבלים AT.\nשים לב: למרות ש"זריחה" היא תהליך, אנחנו רואים אותה כנקודת זמן ספציפית.\nטעות נפוצה: להשתמש ב-IN בגלל שזה נשמע כמו תקופה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'She is busy _____ present, can you call back later?',
        correctAnswer: 'at',
        explanationHe: 'תשובה נכונה: at\nכלל: "at present" הוא ביטוי קבוע שפירושו "כרגע, בזמן הנוכחי".\nשים לב: זהה במשמעות ל-"at the moment" או "currently".\nטעות נפוצה: לומר "in present" במקום "at present".',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'The store closes _____ 9 o\'clock sharp.',
        options: ['in', 'on', 'at', 'by'],
        correctAnswer: 'at',
        explanationHe: 'תשובה נכונה: at\nכלל: כשמדברים על שעת סגירה או פתיחה מדויקת, משתמשים ב-AT.\nשים לב: "sharp" פירושו "בדיוק", אבל גם בלעדיו נשתמש ב-AT.\nטעות נפוצה: לבלבל עם BY (עד) - AT זה השעה המדויקת, BY זה המועד האחרון.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'multiple_choice',
        questionTextHe: 'Everyone arrived _____ the same time.',
        options: ['in', 'on', 'at', 'for'],
        correctAnswer: 'at',
        explanationHe: 'תשובה נכונה: at\nכלל: "at the same time" הוא ביטוי קבוע שפירושו "באותו זמן, במקביל".\nשים לב: יכול להיות גם "at the same time as" כשמשווים בין זמנים.\nטעות נפוצה: לומר "in the same time" במקום "at the same time".',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'fill_in_blank',
        questionTextHe: 'We light candles _____ Hanukkah.',
        correctAnswer: 'at',
        explanationHe: 'תשובה נכונה: at\nכלל: חגים יהודיים (Hanukkah, Passover, Rosh Hashanah) מקבלים AT כמו כל החגים.\nשים לב: זה נכון לכל החגים הגדולים מכל הדתות.\nטעות נפוצה: להשתמש ב-IN או ON במקום AT לחגים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'The baby was born _____ 11:47 PM.',
        options: ['in', 'on', 'at', 'for'],
        correctAnswer: 'at',
        explanationHe: 'תשובה נכונה: at\nכלל: שעת לידה מדויקת (או כל אירוע בשעה ספציפית) תמיד עם AT.\nשים לב: אם היינו מוסיפים גם תאריך, היינו אומרים "at 11:47 PM on March 5th".\nטעות נפוצה: לחשוב שצריך ON בגלל שזה אירוע חד-פעמי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'I feel most creative _____ night.',
        correctAnswer: 'at',
        explanationHe: 'תשובה נכונה: at\nכלל: AT NIGHT הוא תמיד החריג, גם כשמדברים בכלליות (לא על לילה ספציפי).\nשים לב: "at nights" (ברבים) גם נכון כשמדברים על הרבה לילות.\nטעות נפוצה: להשתמש ב-IN כמו ב"in the evening".',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'The flight departs _____ 6:30 AM.',
        options: ['in', 'on', 'at', 'by'],
        correctAnswer: 'at',
        explanationHe: 'תשובה נכונה: at\nכלל: שעות המראה ונחיתה של טיסות תמיד עם AT.\nשים לב: גם לרכבות, אוטובוסים וכל תחבורה ציבורית משתמשים ב-AT לשעות.\nטעות נפוצה: לבלבל עם BY שמשמעה "לא יאוחר מ-".',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'He started his new job _____ the age of 25.',
        options: ['in', 'on', 'at', 'by'],
        correctAnswer: 'at',
        explanationHe: 'תשובה נכונה: at\nכלל: ביטויי גיל משתמשים ב-AT (at age 10, at the age of 25).\nשים לב: יכול להיות "at age 25" או "at the age of 25" - שניהם נכונים.\nטעות נפוצה: לומר "in the age of" במקום "at the age of".',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'Please respond _____ once, it\'s urgent!',
        correctAnswer: 'at',
        explanationHe: 'תשובה נכונה: at\nכלל: "at once" הוא ביטוי קבוע שפירושו "מיד, מיידית".\nשים לב: ביטויים דומים: at last (סוף סוף), at first (בהתחלה).\nטעות נפוצה: לנסות להגיד "in once" או "on once".',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 14.2: On (days, dates) ====================
  {
    topicNumber: 14,
    subtopicNumber: '14.2',
    titleEn: 'On (days, dates)',
    titleHe: 'ב- לימים ותאריכים',
    level: 'beginner',
    orderIndex: 2,
    theoryContentHe: `
<h2>שימוש ב-ON לימים ותאריכים</h2>

<p>משתמשים ב-ON עבור ימים ספציפיים ותאריכים.</p>

<div class="rules">
  <h3><strong>ON לימים בשבוע:</strong></h3>
  <ul>
    <li>on Monday (ביום שני)</li>
    <li>on Tuesday (ביום שלישי)</li>
    <li>on Friday (ביום שישי)</li>
    <li>on the weekend (בסוף שבוע - American)</li>
    <li>on weekdays (בימי חול)</li>
    <li>on my birthday (ביום ההולדת שלי)</li>
  </ul>

  <h3><strong>ON לתאריכים:</strong></h3>
  <ul>
    <li>on July 4th (ב-4 ביולי)</li>
    <li>on January 1st (ב-1 בינואר)</li>
    <li>on December 25th (ב-25 בדצמבר)</li>
  </ul>

  <h3><strong>ON לימים ספציפיים:</strong></h3>
  <ul>
    <li>on Christmas Day (ביום חג המולד)</li>
    <li>on New Year\'s Day (ביום ראש השנה)</li>
    <li>on that day (באותו יום)</li>
  </ul>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'I don\'t go to school _____ Sunday.',
        options: ['in', 'at', 'on', 'for'],
        correctAnswer: 'on',
        explanationHe: 'תשובה נכונה: on\nכלל: ימים בשבוע (Monday, Tuesday, Sunday וכו\') תמיד מקבלים ON.\nשים לב: זה נכון גם ברבים - on Sundays פירושו "בימי ראשון" (באופן קבוע).\nטעות נפוצה: להשתמש ב-IN או AT לימי השבוע במקום ON.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'My birthday is _____ May 15th.',
        options: ['in', 'on', 'at', 'for'],
        correctAnswer: 'on',
        explanationHe: 'תשובה נכונה: on\nכלל: תאריכים ספציפיים (עם מספר היום) תמיד מקבלים ON.\nשים לב: אם היינו אומרים רק "in May" (בלי תאריך) היינו משתמשים ב-IN.\nטעות נפוצה: להשתמש ב-AT לתאריכים מפני ששועות מקבלות AT.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'We have a test _____ Friday.',
        correctAnswer: 'on',
        explanationHe: 'תשובה נכונה: on\nכלל: יום בשבוע ספציפי תמיד עם ON, גם אם אין תאריך.\nשים לב: "on Friday" = ביום שישי הקרוב, "on Fridays" = בכל יום שישי.\nטעות נפוצה: לחשוב שצריך AT כי זה זמן ספציפי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'She was born _____ December 3rd, 2010.',
        options: ['in', 'on', 'at', 'for'],
        correctAnswer: 'on',
        explanationHe: 'תשובה נכונה: on\nכלל: תאריך מלא (יום, חודש, שנה) מקבל ON - ההחלטה נקבעת לפי היום (3rd).\nשים לב: השנה לא משנה, כל עוד יש תאריך ספציפי - נשתמש ב-ON.\nטעות נפוצה: לחשוב שצריך IN בגלל השנה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'We always have a big meal _____ Thanksgiving Day.',
        options: ['in', 'on', 'at', 'during'],
        correctAnswer: 'on',
        explanationHe: 'תשובה נכונה: on\nכלל: כשאומרים יום חג ספציפי (Christmas Day, Independence Day) משתמשים ב-ON.\nשים לב: השווה ל-"at Christmas" (החג כללי) לעומת "on Christmas Day" (היום הספציפי).\nטעות נפוצה: לבלבל בין AT לחג הכללי ו-ON ליום החג.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'I usually work _____ weekdays.',
        correctAnswer: 'on',
        explanationHe: 'תשובה נכונה: on\nכלל: weekdays (ימי חול) ו-weekends (סופי שבוע) מקבלים ON.\nשים לב: זה הגיוני כי אלו קבוצות של ימים ספציפיים.\nטעות נפוצה: לומר "in weekdays" במקום "on weekdays".',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: '_____ that day, I decided to change my life.',
        options: ['In', 'On', 'At', 'For'],
        correctAnswer: 'On',
        explanationHe: 'תשובה נכונה: On\nכלל: "on that day" הוא ביטוי קבוע שפירושו "באותו יום".\nשים לב: דומה ל-"on this day" (ביום הזה), "on the day" (ביום).\nטעות נפוצה: לומר "in that day" בהשפעת עברית.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'The store is closed _____ Sundays but open _____ weekdays.',
        options: ['on, on', 'in, in', 'at, at', 'on, at'],
        correctAnswer: 'on, on',
        explanationHe: 'תשובה נכונה: on, on\nכלל: גם ימי שבוע ספציפיים (Sundays) וגם קבוצות ימים (weekdays) מקבלים ON.\nשים לב: "on Sundays" ברבים = בכל יום ראשון (באופן קבוע).\nטעות נפוצה: לחשוב שצריך מילות יחס שונות לשני המקרים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'We celebrate Independence Day _____ July 4th.',
        correctAnswer: 'on',
        explanationHe: 'תשובה נכונה: on\nכלל: תאריך ספציפי עם ON, גם כשזה חג לאומי.\nשים לב: July 4th הוא תאריך, לכן ON (לא "at Independence Day").\nטעות נפוצה: להשתמש ב-AT בגלל שזה חג.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'The meeting is scheduled _____ Monday morning.',
        options: ['in', 'on', 'at', 'for'],
        correctAnswer: 'on',
        explanationHe: 'תשובה נכונה: on\nכלל: כשמצרפים יום בשבוע + חלק יום (Monday morning, Friday evening) משתמשים ב-ON.\nשים לב: למרות ש"in the morning" לבד, כששמים יום לפני זה ON.\nטעות נפוצה: לומר "in Monday morning" מפני ש"in the morning" לבד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'fill_in_blank',
        questionTextHe: 'I was born _____ the 1st of January.',
        correctAnswer: 'on',
        explanationHe: 'תשובה נכונה: on\nכלל: תאריכים בצורת "the 1st of January" גם מקבלים ON.\nשים לב: זו הצורה הבריטית לומר תאריך (הצורה האמריקאית: January 1st).\nטעות נפוצה: להתבלבל בגלל "the" ולחשוב שצריך מילת יחס אחרת.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: 'Let\'s go to the beach _____ Saturday afternoon.',
        options: ['in', 'on', 'at', 'during'],
        correctAnswer: 'on',
        explanationHe: 'תשובה נכונה: on\nכלל: יום + חלק יום (Saturday afternoon, Sunday evening) = ON.\nשים לב: השילוב של יום וחלק יום תמיד מחייב ON.\nטעות נפוצה: לומר "in Saturday afternoon" בהשפעת "in the afternoon".',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'The exam is _____ June 20th.',
        options: ['in', 'on', 'at', 'by'],
        correctAnswer: 'on',
        explanationHe: 'תשובה נכונה: on\nכלל: תאריך עם מספר יום = ON, ללא קשר לחודש.\nשים לב: אם היינו אומרים רק "in June" (בלי יום) היינו משתמשים ב-IN.\nטעות נפוצה: לבלבל עם BY שמשמעה "עד לתאריך".',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'We always visit grandma _____ her birthday.',
        correctAnswer: 'on',
        explanationHe: 'תשובה נכונה: on\nכלל: ימי הולדת וימי נישואין הם ימים ספציפיים שמקבלים ON.\nשים לב: "on my birthday", "on their anniversary" - תמיד ON.\nטעות נפוצה: לומר "at her birthday" במקום "on her birthday".',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'The store opens _____ New Year\'s Day.',
        options: ['in', 'on', 'at', 'during'],
        correctAnswer: 'on',
        explanationHe: 'תשובה נכונה: on\nכלל: ימי חג ספציפיים עם המילה "Day" מקבלים ON.\nשים לב: ON New Year\'s Day (היום) אבל AT New Year (החג כתקופה).\nטעות נפוצה: לומר "at New Year\'s Day" כמו "at New Year".',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'I go to the gym _____ Mondays and Wednesdays.',
        options: ['in', 'on', 'at', 'every'],
        correctAnswer: 'on',
        explanationHe: 'תשובה נכונה: on\nכלל: ימים ברבים (Mondays, Tuesdays) מציינים חזרה קבועה ומקבלים ON.\nשים לב: "on Mondays" = בכל יום שני, לא רק פעם אחת.\nטעות נפוצה: לחשוב שצריך EVERY במקום ON.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'The concert is _____ Friday night.',
        correctAnswer: 'on',
        explanationHe: 'תשובה נכונה: on\nכלל: יום + night (Friday night, Saturday night) מקבל ON.\nשים לב: למרות שבדרך כלל "at night", כששמים יום לפני זה ON.\nטעות נפוצה: לומר "at Friday night" בהשפעת "at night".',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'School starts _____ September 1st every year.',
        options: ['in', 'on', 'at', 'by'],
        correctAnswer: 'on',
        explanationHe: 'תשובה נכונה: on\nכלל: תאריך חוזר (September 1st) עדיין תאריך ומקבל ON.\nשים לב: "every year" לא משנה את מילת היחס - התאריך הוא שקובע.\nטעות נפוצה: לחשוב שצריך IN בגלל "every year".',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'We have a party _____ the weekend.',
        options: ['in', 'on', 'at', 'during'],
        correctAnswer: 'on',
        explanationHe: 'תשובה נכונה: on (American) או at (British)\nכלל: "on the weekend" הוא השימוש האמריקאי הנפוץ יותר.\nשים לב: בבריטניה "at the weekend" נפוץ יותר - שניהם נכונים.\nטעות נפוצה: לשכוח את המילה "the" ולומר "on weekend".',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'The accident happened _____ Tuesday, March 3rd.',
        correctAnswer: 'on',
        explanationHe: 'תשובה נכונה: on\nכלל: כשיש גם יום וגם תאריך, ON מכסה את שניהם.\nשים לב: "on Tuesday" או "on March 3rd" או "on Tuesday, March 3rd" - תמיד ON.\nטעות נפוצה: לחשוב שצריך שתי מילות יחס שונות.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 14.3: In (months, years, seasons) ====================
  {
    topicNumber: 14,
    subtopicNumber: '14.3',
    titleEn: 'In (months, years, seasons)',
    titleHe: 'ב- לתקופות',
    level: 'beginner',
    orderIndex: 3,
    theoryContentHe: `
<h2>שימוש ב-IN לתקופות זמן ארוכות</h2>

<p>משתמשים ב-IN עבור חודשים, שנים, עונות וחלקי היום.</p>

<div class="rules">
  <h3><strong>IN לחודשים:</strong></h3>
  <ul>
    <li>in January (בינואר)</li>
    <li>in July (ביולי)</li>
    <li>in December (בדצמבר)</li>
  </ul>

  <h3><strong>IN לשנים:</strong></h3>
  <ul>
    <li>in 2024 (ב-2024)</li>
    <li>in 2010 (ב-2010)</li>
    <li>in the 1990s (בשנות ה-90)</li>
  </ul>

  <h3><strong>IN לעונות:</strong></h3>
  <ul>
    <li>in spring (באביב)</li>
    <li>in summer (בקיץ)</li>
    <li>in autumn/fall (בסתיו)</li>
    <li>in winter (בחורף)</li>
  </ul>

  <h3><strong>IN לחלקי היום:</strong></h3>
  <ul>
    <li>in the morning (בבוקר)</li>
    <li>in the afternoon (אחר הצהריים)</li>
    <li>in the evening (בערב)</li>
    <li><strong>חריג:</strong> at night (בלילה)</li>
  </ul>

  <h3><strong>IN למאות ותקופות:</strong></h3>
  <ul>
    <li>in the 21st century (במאה ה-21)</li>
    <li>in the past (בעבר)</li>
    <li>in the future (בעתיד)</li>
  </ul>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'It\'s very hot _____ summer.',
        options: ['at', 'on', 'in', 'for'],
        correctAnswer: 'in',
        explanationHe: 'תשובה נכונה: in\nכלל: עונות השנה (spring, summer, autumn/fall, winter) תמיד מקבלות IN.\nשים לב: זה נכון לכל העונות ללא יוצא מן הכלל.\nטעות נפוצה: להשתמש ב-AT או ON לעונות במקום IN.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'I was born _____ 2010.',
        options: ['at', 'on', 'in', 'for'],
        correctAnswer: 'in',
        explanationHe: 'תשובה נכונה: in\nכלל: שנים (2010, 1995, 2024) תמיד מקבלות IN.\nשים לב: גם כשאומרים "in the year 2010" נשתמש ב-IN.\nטעות נפוצה: להשתמש ב-ON כי זה תאריך לידה ספציפי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'School starts _____ September.',
        correctAnswer: 'in',
        explanationHe: 'תשובה נכונה: in\nכלל: חודשים (January, February... December) תמיד מקבלים IN.\nשים לב: אם היינו מוסיפים תאריך (September 1st) היינו משתמשים ב-ON.\nטעות נפוצה: לבלבל עם ON שמשמש לתאריכים ספציפיים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'I always drink coffee _____ the morning.',
        options: ['at', 'on', 'in', 'for'],
        correctAnswer: 'in',
        explanationHe: 'תשובה נכונה: in\nכלל: חלקי היום (morning, afternoon, evening) מקבלים IN - למעט night שמקבל AT.\nשים לב: צריך להגיד "in THE morning" עם THE.\nטעות נפוצה: לומר "at the morning" בהשפעת "at night".',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'The leaves fall _____ autumn.',
        options: ['at', 'on', 'in', 'for'],
        correctAnswer: 'in',
        explanationHe: 'תשובה נכונה: in\nכלל: autumn (fall באמריקאית) היא עונה ומקבלת IN.\nשים לב: "in autumn" או "in the autumn" - שניהם נכונים.\nטעות נפוצה: להתבלבל בין עונות (IN) לחגים (AT).',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'My grandparents were born _____ the 1950s.',
        correctAnswer: 'in',
        explanationHe: 'תשובה נכונה: in\nכלל: עשורים (the 1950s, the 90s, the twenties) מקבלים IN.\nשים לב: צריך להגיד "in THE 1950s" עם THE.\nטעות נפוצה: לשכוח את THE או להשתמש ב-AT.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: '_____ the past, people didn\'t have smartphones.',
        options: ['At', 'On', 'In', 'For'],
        correctAnswer: 'In',
        explanationHe: 'תשובה נכונה: In\nכלל: "in the past" הוא ביטוי קבוע שפירושו "בעבר".\nשים לב: דומה ל-"in the future" (בעתיד), "in the present" (בהווה).\nטעות נפוצה: לומר "at the past" או "on the past".',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'I study _____ the morning and work _____ the evening.',
        options: ['in, in', 'at, at', 'on, on', 'in, at'],
        correctAnswer: 'in, in',
        explanationHe: 'תשובה נכונה: in, in\nכלל: גם morning וגם evening מקבלים IN (רק night מקבל AT).\nשים לב: זה החריג היחיד - כל חלקי היום עם IN מלבד night.\nטעות נפוצה: לחשוב ש-evening מקבל AT כמו night.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: '_____ the 21st century, technology is advancing rapidly.',
        correctAnswer: 'In',
        explanationHe: 'תשובה נכונה: In\nכלל: מאות (the 21st century, the 1800s) מקבלות IN.\nשים לב: "in the 21st century" או "in the twenty-first century".\nטעות נפוצה: להשתמש ב-AT למאות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'It snows a lot _____ winter here.',
        options: ['at', 'on', 'in', 'during'],
        correctAnswer: 'in',
        explanationHe: 'תשובה נכונה: in\nכלל: עונת החורף (winter) כמו כל העונות מקבלת IN.\nשים לב: "in winter" או "in the winter" - שניהם נכונים.\nטעות נפוצה: להשתמש ב-DURING שמשמעותה "במהלך החורף".',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'fill_in_blank',
        questionTextHe: 'I will finish my studies _____ two years.',
        correctAnswer: 'in',
        explanationHe: 'תשובה נכונה: in\nכלל: IN + תקופת זמן מציין עתיד (in two years = בעוד שנתיים).\nשים לב: "in two years" = עתיד, "for two years" = משך זמן.\nטעות נפוצה: להשתמש ב-FOR כשמתכוונים לעתיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: 'The meeting will start _____ 10 minutes.',
        options: ['at', 'on', 'in', 'for'],
        correctAnswer: 'in',
        explanationHe: 'תשובה נכונה: in\nכלל: "in 10 minutes" פירושו "בעוד 10 דקות" - זמן עתידי.\nשים לב: זה שונה מ-"for 10 minutes" שפירושו "במשך 10 דקות".\nטעות נפוצה: לבלבל בין IN (עתיד) ו-FOR (משך).',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'People dressed differently _____ the 1920s.',
        options: ['at', 'on', 'in', 'during'],
        correctAnswer: 'in',
        explanationHe: 'תשובה נכונה: in\nכלל: עשורים כמו the 1920s מקבלים IN.\nשים לב: "in the 1920s" או "in the twenties" - שניהם נכונים.\nטעות נפוצה: להשתמש ב-DURING שמשמש לאירוע ספציפי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'I usually go to the beach _____ the afternoon.',
        correctAnswer: 'in',
        explanationHe: 'תשובה נכונה: in\nכלל: afternoon הוא חלק יום ומקבל IN (כמו morning ו-evening).\nשים לב: צריך "in THE afternoon" עם THE.\nטעות נפוצה: להשתמש ב-AT כי זה זמן ספציפי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'They got married _____ May last year.',
        options: ['at', 'on', 'in', 'during'],
        correctAnswer: 'in',
        explanationHe: 'תשובה נכונה: in\nכלל: חודש (May) מקבל IN, גם כשיש "last year" אחריו.\nשים לב: "last year" לא משנה את מילת היחס - החודש הוא שקובע.\nטעות נפוצה: להשתמש ב-ON כי זה אירוע חד-פעמי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'The flowers bloom _____ spring.',
        options: ['at', 'on', 'in', 'during'],
        correctAnswer: 'in',
        explanationHe: 'תשובה נכונה: in\nכלל: האביב (spring) הוא עונה ומקבל IN.\nשים לב: "in spring" או "in the spring" - שניהם תקינים.\nטעות נפוצה: להשתמש ב-DURING כשמדברים על תקופה כללית.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'Christopher Columbus discovered America _____ 1492.',
        correctAnswer: 'in',
        explanationHe: 'תשובה נכונה: in\nכלל: שנים היסטוריות (1492, 1776, 1945) תמיד מקבלות IN.\nשים לב: גם שנים עתיקות מקבלות IN.\nטעות נפוצה: להשתמש ב-ON כי זה אירוע היסטורי ספציפי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'We live _____ the 21st century, not in the past.',
        options: ['at', 'on', 'in', 'for'],
        correctAnswer: 'in',
        explanationHe: 'תשובה נכונה: in\nכלל: מאות (century) תמיד עם IN.\nשים לב: "in the 21st century" הוא הזמן הנוכחי שלנו.\nטעות נפוצה: להשתמש ב-AT למאות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'I\'ll call you back _____ a few minutes.',
        options: ['at', 'on', 'in', 'for'],
        correctAnswer: 'in',
        explanationHe: 'תשובה נכונה: in\nכלל: "in a few minutes" פירושו "בעוד כמה דקות" - זמן עתידי.\nשים לב: IN + period מציין מתי משהו יקרה בעתיד.\nטעות נפוצה: להשתמש ב-FOR שמציין משך זמן.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'My favorite time of day is _____ the evening.',
        correctAnswer: 'in',
        explanationHe: 'תשובה נכונה: in\nכלל: evening כמו morning ו-afternoon מקבל IN (רק night שונה).\nשים לב: "in the evening" עם THE - זה ביטוי קבוע.\nטעות נפוצה: לומר "at the evening" כמו "at night".',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 14.4: For, Since, During ====================
  {
    topicNumber: 14,
    subtopicNumber: '14.4',
    titleEn: 'For, Since, During',
    titleHe: 'במשך, מאז, במהלך',
    level: 'beginner',
    orderIndex: 4,
    theoryContentHe: `
<h2>For, Since, During - מילות יחס למשך זמן</h2>

<p>שלוש מילות יחס חשובות שמתארות זמן אבל בצורות שונות.</p>

<div class="rules">
  <h3><strong>FOR (במשך):</strong></h3>
  <p>משך זמן - כמה זמן:</p>
  <ul>
    <li>for two hours (במשך שעתיים)</li>
    <li>for three days (במשך שלושה ימים)</li>
    <li>for a week (במשך שבוע)</li>
    <li>for a long time (במשך זמן רב)</li>
    <li>for five years (במשך חמש שנים)</li>
  </ul>

  <h3><strong>SINCE (מאז):</strong></h3>
  <p>נקודת התחלה - מאימתי:</p>
  <ul>
    <li>since Monday (מאז יום שני)</li>
    <li>since 2020 (מאז 2020)</li>
    <li>since yesterday (מאז אתמול)</li>
    <li>since last week (מאז שבוע שעבר)</li>
    <li>since I was a child (מאז שהייתי ילד)</li>
  </ul>

  <h3><strong>DURING (במהלך):</strong></h3>
  <p>במהלך תקופה או אירוע:</p>
  <ul>
    <li>during the movie (במהלך הסרט)</li>
    <li>during class (במהלך השיעור)</li>
    <li>during the summer (במהלך הקיץ)</li>
    <li>during my vacation (במהלך החופשה שלי)</li>
  </ul>

  <div class="tip">
    <strong>טיפ:</strong> FOR = כמה זמן (2 hours, 3 days), SINCE = מאימתי (Monday, 2020), DURING = במהלך מה (the movie, summer)
  </div>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'I studied _____ three hours yesterday.',
        options: ['for', 'since', 'during', 'in'],
        correctAnswer: 'for',
        explanationHe: 'תשובה נכונה: for\nכלל: FOR משמש למשך זמן - כמה זמן משהו קרה (for 3 hours, for 2 days, for a week).\nשים לב: השאלה היא "כמה זמן?" (How long?) - התשובה תמיד עם FOR.\nטעות נפוצה: להשתמש ב-SINCE שמשמש לנקודת התחלה, לא למשך.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'She has lived here _____ 2015.',
        options: ['for', 'since', 'during', 'in'],
        correctAnswer: 'since',
        explanationHe: 'תשובה נכונה: since\nכלל: SINCE משמש לנקודת התחלה - מאימתי משהו התחיל (since 2015, since Monday, since then).\nשים לב: השאלה היא "מאימתי?" (Since when?) - התשובה תמיד עם SINCE.\nטעות נפוצה: להשתמש ב-FOR כשיש שנה או תאריך.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'Don\'t talk _____ the movie.',
        correctAnswer: 'during',
        explanationHe: 'תשובה נכונה: during\nכלל: DURING משמש לאירוע או תקופה ספציפית - במהלך מה (during the movie, during class).\nשים לב: DURING + שם עצם (noun), לא DURING + משפט.\nטעות נפוצה: להשתמש ב-WHILE שמתאים למשפטים (while I was watching).',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'I\'ve been waiting _____ 30 minutes.',
        correctAnswer: 'for',
        explanationHe: 'תשובה נכונה: for\nכלל: משך זמן מדויק (30 minutes, 2 hours) תמיד עם FOR.\nשים לב: Present perfect + for = פעולה שהתחילה בעבר וממשיכה עד עכשיו.\nטעות נפוצה: לומר "since 30 minutes" במקום "for 30 minutes".',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'We haven\'t seen them _____ last summer.',
        options: ['for', 'since', 'during', 'in'],
        correctAnswer: 'since',
        explanationHe: 'תשובה נכונה: since\nכלל: SINCE עם נקודת זמן ספציפית בעבר (last summer, yesterday, Monday).\nשים לב: "last summer" היא נקודת התחלה, לא משך זמן.\nטעות נפוצה: לחשוב ש-"last summer" זה תקופה ולכן צריך DURING.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'It rained a lot _____ our vacation.',
        options: ['for', 'since', 'during', 'in'],
        correctAnswer: 'during',
        explanationHe: 'תשובה נכונה: during\nכלל: DURING + תקופה או אירוע (during our vacation, during the war, during summer).\nשים לב: "our vacation" היא תקופה מוגדרת, לא משך זמן מדויק.\nטעות נפוצה: להשתמש ב-FOR שדורש מספר (for 2 weeks).',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'He has worked at this company _____ ten years.',
        correctAnswer: 'for',
        explanationHe: 'תשובה נכונה: for\nכלל: משך זמן עם מספר (10 years) = FOR.\nשים לב: Present perfect מצביע על זמן שמתחיל בעבר וממשיך עד היום.\nטעות נפוצה: לומר "since ten years" במקום "for ten years".',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'I fell asleep _____ the lecture.',
        options: ['for', 'since', 'during', 'at'],
        correctAnswer: 'during',
        explanationHe: 'תשובה נכונה: during\nכלל: DURING + אירוע (during the lecture, during the concert, during the meeting).\nשים לב: הפעולה (נרדמתי) קרתה במהלך האירוע (ההרצאה).\nטעות נפוצה: להשתמש ב-AT שמציין זמן ספציפי, לא תקופה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'They have been friends _____ they were children.',
        options: ['for', 'since', 'during', 'in'],
        correctAnswer: 'since',
        explanationHe: 'תשובה נכונה: since\nכלל: SINCE + משפט (since they were children, since I met her, since we moved here).\nשים לב: SINCE יכול לבוא לפני שם עצם או לפני משפט שלם.\nטעות נפוצה: להשתמש ב-FOR שדורש משך זמן מדויק.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'I lived in Paris _____ five years, _____ 2010 to 2015.',
        options: ['for, from', 'since, from', 'during, since', 'for, since'],
        correctAnswer: 'for, from',
        explanationHe: 'תשובה נכונה: for, from\nכלל: FOR למשך זמן (5 years), FROM...TO לטווח תאריכים (from 2010 to 2015).\nשים לב: "from...to" מציין תחילה וסוף של תקופה.\nטעות נפוצה: להשתמש ב-SINCE במקום FROM כשיש נקודת סיום.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'fill_in_blank',
        questionTextHe: 'I haven\'t eaten anything _____ breakfast.',
        correctAnswer: 'since',
        explanationHe: 'תשובה נכונה: since\nכלל: SINCE + אירוע או ארוחה שהיא נקודת התחלה (since breakfast, since lunch).\nשים לב: "breakfast" כאן היא נקודת הזמן שממנה התחלתי לא לאכול.\nטעות נפוצה: להשתמש ב-AFTER שמתאים למשפטים בזמן עבר פשוט.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: 'She called me several times _____ the meeting.',
        options: ['for', 'since', 'during', 'in'],
        correctAnswer: 'during',
        explanationHe: 'תשובה נכונה: during\nכלל: DURING משמש כשפעולה קרתה במהלך אירוע (during the meeting).\nשים לב: "several times" מראה שזה קרה יותר מפעם אחת במהלך הפגישה.\nטעות נפוצה: להשתמש ב-FOR שדורש משך זמן מספרי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'I have known her _____ we were in school together.',
        options: ['for', 'since', 'during', 'from'],
        correctAnswer: 'since',
        explanationHe: 'תשובה נכונה: since\nכלל: SINCE + משפט שמתאר מתי התחיל מצב (since we were in school).\nשים לב: Present perfect (have known) + since = התחיל בעבר וממשיך.\nטעות נפוצה: להשתמש ב-FOR שצריך משך זמן עם מספר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'The phone rang _____ dinner.',
        correctAnswer: 'during',
        explanationHe: 'תשובה נכונה: during\nכלל: DURING + ארוחה או אירוע (during dinner, during lunch, during breakfast).\nשים לב: הטלפון צלצל במהלך הארוחה, לא לפני ולא אחרי.\nטעות נפוצה: להשתמש ב-IN או AT במקום DURING.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'We\'ve been waiting _____ over an hour now.',
        options: ['for', 'since', 'during', 'from'],
        correctAnswer: 'for',
        explanationHe: 'תשובה נכונה: for\nכלל: FOR + משך זמן (over an hour, more than 2 days).\nשים לב: "over an hour" = יותר משעה - זה עדיין משך זמן.\nטעות נפוצה: לחשוב ש-"over" משנה את הכלל.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'I haven\'t smoked _____ January 1st.',
        options: ['for', 'since', 'during', 'from'],
        correctAnswer: 'since',
        explanationHe: 'תשובה נכונה: since\nכלל: SINCE + תאריך ספציפי (since January 1st, since May 5th).\nשים לב: התאריך הוא נקודת התחלה של ההפסקה מעישון.\nטעות נפוצה: להשתמש ב-FROM שמשמש בדרך כלל עם TO.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'He slept _____ the entire flight.',
        correctAnswer: 'during',
        explanationHe: 'תשובה נכונה: during\nכlll: DURING + אירוע או תקופה (during the flight, during the journey).\nשים לב: "the entire flight" = כל הטיסה - זו תקופה מוגדרת.\nטעות נפוצה: להשתמש ב-FOR למרות שאין מספר שעות מדויק.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'I\'ve lived in this house _____ a long time.',
        options: ['for', 'since', 'during', 'from'],
        correctAnswer: 'for',
        explanationHe: 'תשובה נכונה: for\nכלל: FOR + תקופה כללית (a long time, ages, years).\nשים לב: "a long time" הוא משך זמן, גם אם לא מדויק.\nטעות נפוצה: לחשוב שצריך SINCE כי אין מספר מדויק.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'Many things happened _____ the war.',
        options: ['for', 'since', 'during', 'in'],
        correctAnswer: 'during',
        explanationHe: 'תשובה נכונה: during\nכלל: DURING + תקופה היסטורית או אירוע (during the war, during the revolution).\nשים לב: המלחמה היא תקופה שבמהלכה דברים קרו.\nטעות נפוצה: להשתמש ב-IN למרות שזה אירוע ספציפי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'She has been a teacher _____ 15 years.',
        correctAnswer: 'for',
        explanationHe: 'תשובה נכונה: for\nכלל: FOR + מספר שנים/חודשים/ימים (for 15 years, for 6 months).\nשים לב: Present perfect מראה שהיא התחילה לפני 15 שנה וממשיכה להיות מורה.\nטעות נפוצה: לומר "since 15 years" - טעות נפוצה מאוד!',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 14.5: Before, After, Until ====================
  {
    topicNumber: 14,
    subtopicNumber: '14.5',
    titleEn: 'Before, After, Until',
    titleHe: 'לפני, אחרי, עד',
    level: 'beginner',
    orderIndex: 5,
    theoryContentHe: `
<h2>Before, After, Until - סדר וזמן</h2>

<p>מילות יחס שמתארות סדר אירועים וגבולות זמן.</p>

<div class="rules">
  <h3><strong>BEFORE (לפני):</strong></h3>
  <p>מוקדם יותר מ-:</p>
  <ul>
    <li>before breakfast (לפני ארוחת הבוקר)</li>
    <li>before school (לפני בית הספר)</li>
    <li>before 8 o'clock (לפני שעה 8)</li>
    <li>before Monday (לפני יום שני)</li>
    <li>the day before yesterday (שלשום)</li>
  </ul>

  <h3><strong>AFTER (אחרי):</strong></h3>
  <p>מאוחר יותר מ-:</p>
  <ul>
    <li>after lunch (אחרי ארוחת הצהריים)</li>
    <li>after school (אחרי בית הספר)</li>
    <li>after 5 o'clock (אחרי שעה 5)</li>
    <li>after the movie (אחרי הסרט)</li>
    <li>the day after tomorrow (מחרתיים)</li>
  </ul>

  <h3><strong>UNTIL / TILL (עד):</strong></h3>
  <p>עד זמן מסוים:</p>
  <ul>
    <li>until 5 o'clock (עד שעה 5)</li>
    <li>until Monday (עד יום שני)</li>
    <li>until next week (עד שבוע הבא)</li>
    <li>I'll wait until you come. (אחכה עד שתבוא)</li>
  </ul>

  <div class="tip">
    <strong>שים לב:</strong> UNTIL = עד זמן מסוים (משהו ממשיך עד הזמן הזה)
  </div>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'I brush my teeth _____ breakfast.',
        options: ['after', 'before', 'until', 'during'],
        correctAnswer: 'after',
        explanationHe: 'תשובה נכונה: after\nכלל: AFTER משמש "אחרי" - משהו שקורה מאוחר יותר (after breakfast, after school).\nשים לב: הסדר הלוגי הוא לאכול ואז לצחצח שיניים.\nטעות נפוצה: לבלבל עם BEFORE (לפני).',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'Please wait _____ I finish.',
        options: ['after', 'before', 'until', 'since'],
        correctAnswer: 'until',
        explanationHe: 'תשובה נכונה: until\nכלל: UNTIL משמש "עד" - הפעולה ממשיכה עד נקודת זמן (wait until I finish).\nשים לב: UNTIL + משפט (until I finish) או UNTIL + זמן (until 5 PM).\nטעות נפוצה: להשתמש ב-BEFORE שמציין סדר, לא המשכיות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'I always shower _____ going to bed.',
        correctAnswer: 'before',
        explanationHe: 'תשובה נכונה: before\nכלל: BEFORE משמש "לפני" - משהו שקורה מוקדם יותר (before bed, before dinner).\nשים לב: BEFORE + פועל עם -ing (before going, before eating).\nטעות נפוצה: להשתמש ב-UNTIL שמציין המשכיות עד נקודה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'The store is open _____ 9 PM.',
        options: ['after', 'before', 'until', 'since'],
        correctAnswer: 'until',
        explanationHe: 'תשובה נכונה: until\nכלל: UNTIL לנקודת סיום - החנות ממשיכה להיות פתוחה עד 9.\nשים לב: UNTIL מראה שמשהו ממשיך עד זמן מסוים.\nטעות נפוצה: לבלבל עם BY שפירושו "לא יאוחר מ-".',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'Let\'s meet _____ the class ends.',
        options: ['before', 'after', 'until', 'during'],
        correctAnswer: 'after',
        explanationHe: 'תשובה נכונה: after\nכלל: AFTER + אירוע = מתי משהו יקרה אחרי אירוע אחר.\nשים לב: "after the class ends" = אחרי שהשיעור נגמר.\nטעות נפוצה: להשתמש ב-UNTIL שמציין המשכיות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'You must finish the test _____ 12 o\'clock.',
        correctAnswer: 'before',
        explanationHe: 'תשובה נכונה: before\nכלל: BEFORE + זמן = לפני שעה מסוימת (before 12, before noon).\nשים לב: זה מועד אחרון - צריך לסיים לפני השעה הזו.\nטעות נפוצה: לבלבל עם BY שגם פירושו "לא יאוחר מ-".',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'I studied _____ midnight and went to bed _____ that.',
        options: ['until, after', 'after, until', 'before, after', 'until, before'],
        correctAnswer: 'until, after',
        explanationHe: 'תשובה נכונה: until, after\nכלל: UNTIL = המשכתי ללמוד עד חצות, AFTER = הלכתי לישון אחרי זה.\nשים לב: שני מצבים שונים - המשכיות (until) ואז סדר אירועים (after).\nטעות נפוצה: להשתמש ב-BEFORE במקום UNTIL להמשכיות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'Finish your homework _____ you go out to play.',
        options: ['after', 'until', 'before', 'during'],
        correctAnswer: 'before',
        explanationHe: 'תשובה נכונה: before\nכלל: BEFORE + משפט = עשה משהו לפני פעולה אחרת.\nשים לב: סדר: קודם שיעורים, אחר כך משחק.\nטעות נפוצה: להשתמש ב-UNTIL שמתאים להמשכיות, לא לסדר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'I won\'t leave _____ you come back.',
        correctAnswer: 'until',
        explanationHe: 'תשובה נכונה: until\nכלל: UNTIL מציין המשכיות של מצב עד שמשהו קורה.\nשים לב: "won\'t leave until" = אשאר כאן עד שתחזור.\nטעות נפוצה: להשתמש ב-BEFORE שמתאר סדר, לא המשכיות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'Call me _____ you arrive at the station.',
        options: ['after', 'before', 'until', 'since'],
        correctAnswer: 'after',
        explanationHe: 'תשובה נכונה: after\nכלל: AFTER משמש כש רוצים שמישהו יעשה משהו אחרי אירוע.\nשים לב: "after you arrive" = אחרי שתגיע.\nטעות נפוצה: להשתמש ב-WHEN שנכון גם, אבל AFTER ברור יותר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'fill_in_blank',
        questionTextHe: 'We can\'t start the meeting _____ everyone arrives.',
        correctAnswer: 'until',
        explanationHe: 'תשובה נכונה: until\nכלל: UNTIL עם משפט שלילי - לא נתחיל עד שכולם יגיעו.\nשים לב: "can\'t...until" הוא ביטוי נפוץ.\nטעות נפוצה: להשתמש ב-BEFORE שהופך את המשמעות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: 'I lived in London _____ moving to Paris.',
        options: ['after', 'before', 'until', 'since'],
        correctAnswer: 'before',
        explanationHe: 'תשובה נכונה: before\nכlll: BEFORE + -ing = לפני פעולה (before moving, before eating).\nשים לב: הסדר: קודם לונדון, אחר כך פריז.\nטעות נפוצה: להשתמש ב-UNTIL שמציין המשכיות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'Stay here _____ I get back.',
        options: ['after', 'before', 'until', 'since'],
        correctAnswer: 'until',
        explanationHe: 'תשובה נכונה: until\nכלל: UNTIL מציין המשכיות - הישאר כאן עד שאחזור.\nשים לב: "stay until" = המשך לשהות עד.\nטעות נפוצה: להשתמש ב-BEFORE שמשנה את המשמעות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'Think carefully _____ you answer.',
        correctAnswer: 'before',
        explanationHe: 'תשובה נכונה: before\nכלל: BEFORE + משפט = עשה משהו לפני פעולה אחרת.\nשים לב: קודם לחשוב, אחר כך לענות.\nטעות נפוצה: לשכוח את BEFORE כשהסדר חשוב.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'The movie starts _____ 10 minutes, so let\'s hurry.',
        options: ['after', 'before', 'in', 'until'],
        correctAnswer: 'in',
        explanationHe: 'תשובה נכונה: in\nכלל: IN + זמן = בעוד כמה זמן (in 10 minutes, in an hour).\nשים לב: זה שונה מ-UNTIL שמציין עד מתי, לא מתי.\nטעות נפוצה: להשתמש ב-AFTER או BEFORE שלא מתאימים לעתיד קרוב.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'I\'ll wait here _____ 6 o\'clock.',
        options: ['after', 'before', 'until', 'since'],
        correctAnswer: 'until',
        explanationHe: 'תשובה נכונה: until\nכלל: UNTIL + זמן ספציפי = המשכיות עד שעה מסוימת.\nשים לב: אמשיך להמתין עד שעה 6.\nטעות נפוצה: להשתמש ב-BY שפירושו "לא יאוחר מ-".',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'We arrived at the airport _____ the flight departed.',
        correctAnswer: 'before',
        explanationHe: 'תשובה נכונה: before\nכלל: BEFORE מתאר שאירוע אחד קרה לפני השני.\nשים לב: הגענו לפני שהטיסה המריאה - הספקנו.\nטעות נפוצה: להשתמש ב-AFTER שהופך את המשמעות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'They argued _____ they finally agreed.',
        options: ['after', 'before', 'until', 'since'],
        correctAnswer: 'until',
        explanationHe: 'תשובה נכונה: until\nכלל: UNTIL מראה שפעולה נמשכה עד שמשהו קרה.\nשים לב: המריבה נמשכה עד שהסכימו.\nטעות נפוצה: להשתמש ב-BEFORE שמתאר סדר, לא המשכיות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'Read the instructions _____ you start.',
        options: ['after', 'before', 'until', 'during'],
        correctAnswer: 'before',
        explanationHe: 'תשובה נכונה: before\nכלל: BEFORE + משפט = עשה משהו קודם.\nשים לב: קודם לקרוא הוראות, אחר כך להתחיל.\nטעות נפוצה: להתחיל בלי לקרוא הוראות!',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'Don\'t eat anything _____ dinner is ready.',
        correctAnswer: 'until',
        explanationHe: 'תשובה נכונה: until\nכלל: UNTIL עם שלילה - אל תעשה משהו עד ש...\nשים לב: "don\'t...until" הוא ביטוי נפוץ.\nטעות נפוצה: להשתמש ב-BEFORE עם שלילה שמשנה את המשמעות.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 14.6: Common Time Expressions ====================
  {
    topicNumber: 14,
    subtopicNumber: '14.6',
    titleEn: 'Common Time Expressions',
    titleHe: 'ביטויי זמן נפוצים',
    level: 'beginner',
    orderIndex: 6,
    theoryContentHe: `
<h2>ביטויי זמן נפוצים</h2>

<p>ביטויים קבועים שכדאי לשנן.</p>

<div class="rules">
  <h3><strong>ביטויים עם IN:</strong></h3>
  <ul>
    <li><strong>in time</strong> (בזמן, לא מאוחר): We arrived in time for the show.</li>
  </ul>

  <h3><strong>ביטויים עם ON:</strong></h3>
  <ul>
    <li><strong>on time</strong> (בדיוק בזמן): The bus is always on time.</li>
  </ul>

  <h3><strong>ביטויים עם FROM...TO:</strong></h3>
  <ul>
    <li><strong>from...to</strong> (מ...עד): from Monday to Friday</li>
    <li>from 9 to 5 (מ-9 עד 5)</li>
  </ul>

  <h3><strong>ביטויים עם BY:</strong></h3>
  <ul>
    <li><strong>by</strong> (עד, לא יאוחר מ-): Finish by 5 o'clock</li>
    <li>by tomorrow (עד מחר)</li>
  </ul>

  <h3><strong>ביטויים עם AGO:</strong></h3>
  <ul>
    <li><strong>ago</strong> (לפני - בעבר): two days ago (לפני יומיים)</li>
    <li>a week ago (לפני שבוע)</li>
  </ul>

  <h3><strong>ביטויים עם LAST/NEXT/THIS:</strong></h3>
  <ul>
    <li><strong>last</strong> (ה...שעבר): last week, last year</li>
    <li><strong>next</strong> (ה...הבא): next week, next month</li>
    <li><strong>this</strong> (ה...הזה): this week, this year</li>
  </ul>
</div>

<div class="tip">
  <strong>הבדל חשוב:</strong><br>
  IN TIME = בזמן (לא מאוחרים, הספקנו)<br>
  ON TIME = בדיוק בזמן (בשעה המדויקת)
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'The train left two hours _____.',
        options: ['last', 'next', 'ago', 'before'],
        correctAnswer: 'ago',
        explanationHe: 'תשובה נכונה: ago\nכלל: AGO משמש לזמן שעבר - לפני כמה זמן (two hours ago, a week ago).\nשים לב: AGO תמיד בא אחרי תקופת הזמן, לא לפני.\nטעות נפוצה: להשתמש ב-BEFORE שדורש הקשר של אירוע אחר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'I will call you _____ week.',
        options: ['last', 'next', 'ago', 'this'],
        correctAnswer: 'next',
        explanationHe: 'תשובה נכונה: next\nכלל: NEXT לזמן עתידי (next week, next month, next year) - ללא מילת יחס.\nשים לב: אין צורך ב-IN או ON לפני NEXT.\nטעות נפוצה: לומר "in next week" במקום "next week".',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'Please arrive _____ time for the meeting.',
        options: ['in', 'on', 'at', 'by'],
        correctAnswer: 'on',
        explanationHe: 'תשובה נכונה: on\nכלל: ON TIME = בדיוק בזמן, בשעה המדויקת (punctual).\nשים לב: שונה מ-IN TIME שפירושו "בזמן, הספקנו".\nטעות נפוצה: לבלבל בין ON TIME (punctual) ו-IN TIME (not late).',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'We work _____ Monday _____ Friday.',
        options: ['from, to', 'since, until', 'on, on', 'in, in'],
        correctAnswer: 'from, to',
        explanationHe: 'תשובה נכונה: from, to\nכלל: FROM...TO מציין טווח זמנים (from Monday to Friday, from 9 to 5).\nשים לב: זה מציין תחילה וסוף של תקופה.\nטעות נפוצה: להשתמש ב-SINCE...UNTIL שמתאים לזמן Present Perfect.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'I saw him _____ week, not this week.',
        correctAnswer: 'last',
        explanationHe: 'תשובה נכונה: last\nכלל: LAST לזמן עבר (last week, last month, last year) - ללא מילת יחס.\nשים לב: אין צורך ב-IN או ON לפני LAST.\nטעות נפוצה: לומר "in last week" במקום "last week".',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'We arrived _____ time to see the beginning of the movie.',
        options: ['on', 'in', 'at', 'by'],
        correctAnswer: 'in',
        explanationHe: 'תשובה נכונה: in\nכלל: IN TIME = בזמן, לא מאוחר, הספקנו (not late).\nשים לב: שונה מ-ON TIME שפירושו "בדיוק בזמן".\nטעות נפוצה: לבלבל בין IN TIME (not late) ו-ON TIME (exactly on time).',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'You must submit the report _____ Friday.',
        options: ['on', 'in', 'until', 'by'],
        correctAnswer: 'by',
        explanationHe: 'תשובה נכונה: by\nכלל: BY = לא יאוחר מ-, עד (deadline) - המועד האחרון.\nשים לב: BY שונה מ-UNTIL - BY זה deadline, UNTIL זה המשכיות.\nטעות נפוצה: להשתמש ב-UNTIL שמציין המשכיות לא deadline.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'The meeting was supposed to start _____ time, but it started late.',
        options: ['in', 'on', 'at', 'by'],
        correctAnswer: 'on',
        explanationHe: 'תשובה נכונה: on\nכlll: ON TIME = בדיוק בזמן, punctual, בשעה המדויקת.\nשים לב: "but it started late" מראה שלא היה on time.\nטעות נפוצה: לומר "in time" שמשמעותו שונה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'I started learning English three years _____.',
        correctAnswer: 'ago',
        explanationHe: 'תשובה נכונה: ago\nכלל: AGO עם זמן עבר פשוט (started...ago) - לפני כמה זמן.\nשים לב: AGO תמיד עם Past Simple, לא Present Perfect.\nטעות נפוצה: לומר "three years before" ללא הקשר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: '_____ Monday, I have to stay home.',
        options: ['Last', 'Next', 'This', 'Every'],
        correctAnswer: 'This',
        explanationHe: 'תשובה נכונה: This\nכלל: THIS + יום/שבוע = הקרוב (this Monday, this week) - ללא מילת יחס.\nשים לב: "this Monday" יכול להיות ביום שני הבא או ביום שני הנוכחי.\nטעות נפוצה: לומר "on this Monday" - לא צריך ON.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'fill_in_blank',
        questionTextHe: 'I haven\'t seen her _____ ages!',
        correctAnswer: 'for',
        explanationHe: 'תשובה נכונה: for\nכלל: FOR AGES = ביטוי קבוע שפירושו "זמן רב מאוד".\nשים לב: "ages" פירושו זמן ארוך, לא שנים מדויקות.\nטעות נפוצה: להשתמש ב-SINCE עם "ages".',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: 'At the beginning, it was difficult, but _____ the end, I succeeded.',
        options: ['in', 'on', 'at', 'by'],
        correctAnswer: 'in',
        explanationHe: 'תשובה נכונה: in\nכלל: AT THE BEGINNING (בהתחלה) אבל IN THE END (בסוף, לבסוף).\nשים לב: "at the end" = בקצה, "in the end" = לבסוף.\nטעות נפוצה: לומר "at the end" כשמתכוונים ל"לבסוף".',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'I go to the gym three times _____ week.',
        options: ['in', 'on', 'a', 'per'],
        correctAnswer: 'a',
        explanationHe: 'תשובה נכונה: a\nכלל: תדירות + A + תקופה (three times a week, twice a day, once a month).\nשים לב: "a" פה שווה ל-"per" - לכל.\nטעות נפוצה: לומר "three times in week" או "three times the week".',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'Call me _____ once! It\'s an emergency!',
        correctAnswer: 'at',
        explanationHe: 'תשובה נכונה: at\nכלל: AT ONCE = ביטוי קבוע שפירושו "מיד, מיידית".\nשים לב: דומה ל-"immediately" או "right away".\nטעות נפוצה: להשתמש ב-IN או ON במקום AT.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'I visited Paris two years _____ I moved to London.',
        options: ['ago', 'before', 'prior', 'earlier'],
        correctAnswer: 'before',
        explanationHe: 'תשובה נכונה: before\nכלל: BEFORE + משפט/אירוע = לפני אירוע אחר (two years before I moved).\nשים לב: AGO צריך להיות לבד ללא אירוע נוסף.\nטעות נפוצה: להשתמש ב-AGO שדורש רק זמן עבר פשוט.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: '_____ present, we don\'t have any vacancies.',
        options: ['In', 'On', 'At', 'For'],
        correctAnswer: 'At',
        explanationHe: 'תשובה נכונה: At\nכלל: AT PRESENT = ביטוי קבוע שפירושו "כרגע, בזמן הנוכחי".\nשים לב: זהה ל-"at the moment" או "currently".\nטעות נפוצה: לומר "in present" במקום "at present".',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'The project must be finished _____ the end of the month.',
        correctAnswer: 'by',
        explanationHe: 'תשובה נכונה: by\nכלל: BY THE END OF = עד סוף (deadline) - המועד האחרון.\nשים לב: BY מציין שצריך לסיים לפני או בזמן הזה.\nטעות נפוצה: להשתמש ב-AT שמציין נקודת זמן ספציפית.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'I eat breakfast _____ 7 and 8 in the morning.',
        options: ['from, to', 'between, and', 'at, and', 'in, and'],
        correctAnswer: 'between, and',
        explanationHe: 'תשובה נכונה: between, and\nכלל: BETWEEN...AND מציין טווח זמנים (between 7 and 8).\nשים לב: שונה מ-FROM...TO שמציין תחילה וסוף מדויקים.\nטעות נפוצה: לומר "between 7 to 8" במקום "between 7 and 8".',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: '_____, I didn\'t understand, but now it\'s clear.',
        options: ['At last', 'At first', 'At once', 'At present'],
        correctAnswer: 'At first',
        explanationHe: 'תשובה נכונה: At first\nכלל: AT FIRST = בהתחלה, בתחילה (at the beginning).\nשים לב: AT LAST = סוף סוף, AT ONCE = מיד.\nטעות נפוצה: לבלבל בין AT FIRST (בהתחלה) ו-AT LAST (סוף סוף).',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'I\'ll stay here _____ a while, then I\'ll go home.',
        correctAnswer: 'for',
        explanationHe: 'תשובה נכונה: for\nכלל: FOR A WHILE = ביטוי קבוע שפירושו "לזמן מה, לתקופה קצרה".\nשים לב: "a while" = זמן לא מוגדר אבל קצר יחסית.\nטעות נפוצה: להשתמש ב-IN במקום FOR.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 14.7: Common Mistakes ====================
  {
    topicNumber: 14,
    subtopicNumber: '14.7',
    titleEn: 'Common Mistakes',
    titleHe: 'טעויות נפוצות',
    level: 'beginner',
    orderIndex: 7,
    theoryContentHe: `
<h2>טעויות נפוצות במילות יחס של זמן</h2>

<p>טעויות שתלמידים עושים לעתים קרובות.</p>

<div class="mistakes">
  <h3><strong>טעויות נפוצות:</strong></h3>

  <p>❌ <strong>שגוי:</strong> in Monday<br>
  ✅ <strong>נכון:</strong> <strong>on</strong> Monday</p>
  <p class="explanation">ימים בשבוע עם on, לא in</p>

  <p>❌ <strong>שגוי:</strong> at July<br>
  ✅ <strong>נכון:</strong> <strong>in</strong> July</p>
  <p class="explanation">חודשים עם in, לא at</p>

  <p>❌ <strong>שגוי:</strong> on 8 o'clock<br>
  ✅ <strong>נכון:</strong> <strong>at</strong> 8 o'clock</p>
  <p class="explanation">שעות עם at, לא on</p>

  <p>❌ <strong>שגוי:</strong> in the night<br>
  ✅ <strong>נכון:</strong> <strong>at</strong> night</p>
  <p class="explanation">at night הוא ביטוי קבוע (חריג)</p>

  <p>❌ <strong>שגוי:</strong> in weekend<br>
  ✅ <strong>נכון:</strong> at/on <strong>the</strong> weekend</p>
  <p class="explanation">צריך "the" - at the weekend (UK) או on the weekend (US)</p>

  <p>❌ <strong>שגוי:</strong> since two hours<br>
  ✅ <strong>נכון:</strong> <strong>for</strong> two hours</p>
  <p class="explanation">משך זמן = for, לא since</p>

  <p>❌ <strong>שגוי:</strong> for Monday<br>
  ✅ <strong>נכון:</strong> <strong>since</strong> Monday</p>
  <p class="explanation">נקודת התחלה = since, לא for</p>

  <p>❌ <strong>שגוי:</strong> I study English since 3 years.<br>
  ✅ <strong>נכון:</strong> I study English <strong>for</strong> 3 years.</p>
  <p class="explanation">3 years הוא משך זמן, צריך for</p>

  <p>❌ <strong>שגוי:</strong> on the morning<br>
  ✅ <strong>נכון:</strong> <strong>in</strong> the morning</p>
  <p class="explanation">חלקי היום (morning, afternoon, evening) עם in</p>

  <p>❌ <strong>שגוי:</strong> at December 25th<br>
  ✅ <strong>נכון:</strong> <strong>on</strong> December 25th</p>
  <p class="explanation">תאריכים עם on, לא at</p>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'בחר את המשפט הנכון:',
        options: ['I wake up in 7 o\'clock.', 'I wake up on 7 o\'clock.', 'I wake up at 7 o\'clock.', 'I wake up for 7 o\'clock.'],
        correctAnswer: 'I wake up at 7 o\'clock.',
        explanationHe: 'תשובה נכונה: I wake up at 7 o\'clock\nכלל: שעות מדויקות תמיד עם AT, לא IN או ON.\nשים לב: IN לתקופות ארוכות, ON לימים, AT לשעות.\nטעות נפוצה: "in 7 o\'clock" - זו אחת הטעויות השכיחות ביותר!',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'בחר את המשפט הנכון:',
        options: ['My birthday is at May.', 'My birthday is on May.', 'My birthday is in May.', 'My birthday is for May.'],
        correctAnswer: 'My birthday is in May.',
        explanationHe: 'תשובה נכונה: My birthday is in May\nכלל: חודשים (January, May, December) תמיד עם IN.\nשים לב: אם היה תאריך (May 15th) היינו משתמשים ב-ON.\nטעות נפוצה: "at May" או "on May" - חודשים תמיד IN!',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'מה לא נכון במשפט? "I have lived here since 5 years."',
        options: ['צריך at במקום since', 'צריך for במקום since', 'צריך in במקום since', 'המשפט נכון'],
        correctAnswer: 'צריך for במקום since',
        explanationHe: 'תשובה נכונה: צריך for במקום since\nכלל: משך זמן (5 years) = FOR, נקודת התחלה (2019) = SINCE.\nשים לב: "since 2019" נכון, אבל "since 5 years" שגוי!\nטעות נפוצה: זו הטעות השכיחה ביותר עם SINCE/FOR!',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'בחר את המשפט הנכון:',
        options: ['I don\'t work in Sunday.', 'I don\'t work on Sunday.', 'I don\'t work at Sunday.', 'I don\'t work for Sunday.'],
        correctAnswer: 'I don\'t work on Sunday.',
        explanationHe: 'תשובה נכונה: I don\'t work on Sunday\nכלל: ימי השבוע (Monday, Sunday, Friday) תמיד עם ON.\nשים לב: ON לימים, IN לחודשים/שנים/עונות, AT לשעות.\nטעות נפוצה: "in Sunday" או "at Sunday" - ימים תמיד ON!',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'תקן את הטעות: "I drink coffee on the morning." → I drink coffee _____ the morning.',
        correctAnswer: 'in',
        explanationHe: 'תשובה נכונה: in\nכלל: חלקי יום (morning, afternoon, evening) עם IN - למעט night שעם AT.\nשים לב: IN the morning, IN the afternoon, IN the evening, אבל AT night.\nטעות נפוצה: "on the morning" - זו טעות נפוצה בהשפעת שפות אחרות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'מה לא בסדר במשפט? "I was born at December 3rd, 2010."',
        options: ['צריך in במקום at', 'צריך on במקום at', 'צריך for במקום at', 'המשפט נכון'],
        correctAnswer: 'צריך on במקום at',
        explanationHe: 'תשובה נכונה: צריך on במקום at\nכלל: תאריכים עם מספר יום (December 3rd) תמיד עם ON.\nשים לב: AT לשעות, ON לתאריכים וימים, IN לחודשים/שנים.\nטעות נפוצה: לבלבל בין AT לשעות ו-ON לתאריכים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'תקן את הטעות: "It\'s very dark in night."',
        options: ['צריך at במקום in', 'צריך on במקום in', 'צריך for במקום in', 'המשפט נכון'],
        correctAnswer: 'צריך at במקום in',
        explanationHe: 'תשובה נכונה: צריך at במקום in\nכלל: AT NIGHT הוא החריג היחיד - כל חלקי היום עם IN מלבד night.\nשים לב: IN the morning/afternoon/evening, אבל AT night.\nטעות נפוצה: "in night" - נשמע לוגי אבל שגוי!',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'בחר את המשפט הנכון:',
        options: ['I was born on 2010.', 'I was born at 2010.', 'I was born in 2010.', 'I was born for 2010.'],
        correctAnswer: 'I was born in 2010.',
        explanationHe: 'תשובה נכונה: I was born in 2010\nכלל: שנים (2010, 1995, 2024) תמיד עם IN.\nשים לב: IN לשנים וחודשים, ON לתאריכים וימים.\nטעות נפוצה: "on 2010" או "at 2010" - שנים תמיד IN!',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'מה לא נכון במשפט? "I study English during three hours every day."',
        options: ['צריך for במקום during', 'צריך since במקום during', 'צריך in במקום during', 'המשפט נכון'],
        correctAnswer: 'צריך for במקום during',
        explanationHe: 'תשובה נכונה: צריך for במקום during\nכלל: DURING + אירוע (during the movie), FOR + משך זמן (for 3 hours).\nשים לב: DURING לא משמש עם מספרים כמו "3 hours".\nטעות נפוצה: "during 3 hours" במקום "for 3 hours".',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'תקן את הטעות: "See you at Monday!" → See you _____ Monday!',
        correctAnswer: 'on',
        explanationHe: 'תשובה נכונה: on\nכלל: ימי שבוע תמיד עם ON, לא AT.\nשים לב: AT לשעות ולביטויים מיוחדים, ON לימים.\nטעות נפוצה: "at Monday" - ימים תמיד ON!',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'תקן את הטעות: "The store opens on 9 AM."',
        options: ['צריך at במקום on', 'צריך in במקום on', 'צריך for במקום on', 'המשפט נכון'],
        correctAnswer: 'צריך at במקום on',
        explanationHe: 'תשובה נכונה: צריך at במקום on\nכלל: שעות (9 AM, 3 PM) תמיד עם AT.\nשים לב: ON לימים ותאריכים, AT לשעות.\nטעות נפוצה: לבלבל בין ON ו-AT לזמנים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: 'מה לא בסדר במשפט? "We have been friends for Monday."',
        options: ['צריך since במקום for', 'צריך at במקום for', 'צריך in במקום for', 'המשפט נכון'],
        correctAnswer: 'צריך since במקום for',
        explanationHe: 'תשובה נכונה: צריך since במקום for\nכלל: FOR + משך (for 5 years), SINCE + נקודת זמן (since Monday).\nשים לב: Monday הוא נקודת זמן, לא משך זמן.\nטעות נפוצה: "for Monday" במקום "since Monday".',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'בחר את המשפט הנכון:',
        options: ['Let\'s meet in the weekend.', 'Let\'s meet at the weekend.', 'Let\'s meet for the weekend.', 'Let\'s meet weekend.'],
        correctAnswer: 'Let\'s meet at the weekend.',
        explanationHe: 'תשובה נכונה: Let\'s meet at the weekend (British) או on the weekend (American)\nכלל: AT/ON the weekend - צריך THE, ויש הבדל בין בריטית לאמריקאית.\nשים לב: בבריטניה AT, בארה"ב ON.\nטעות נפוצה: לשכוח את THE או לומר "in the weekend".',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'תקן את הטעות: "I\'ll see you in next week." → I\'ll see you _____ week.',
        correctAnswer: 'next',
        explanationHe: 'תשובה נכונה: next (ללא IN)\nכלל: NEXT/LAST/THIS + זמן = ללא מילת יחס.\nשים לב: next week, last Monday, this year - בלי IN/ON/AT.\nטעות נפוצה: "in next week" - לא צריך מילת יחס!',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'מה לא נכון במשפט? "Work by Friday until you finish."',
        options: ['צריך until במקום by', 'צריך on במקום by', 'צריך in במקום by', 'המשפט נכון'],
        correctAnswer: 'צריך until במקום by',
        explanationHe: 'תשובה נכונה: צריך until במקום by\nכלל: BY = deadline (סיים עד יום שישי), UNTIL = המשכיות (עבוד עד שתסיים).\nשים לב: BY למועד אחרון, UNTIL להמשכיות.\nטעות נפוצה: לבלבל בין BY (deadline) ו-UNTIL (continuity).',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'תקן את הטעות: "The meeting starts on 3:00 PM."',
        options: ['צריך at במקום on', 'צריך in במקום on', 'צריך for במקום on', 'המשפט נכון'],
        correctAnswer: 'צריך at במקום on',
        explanationHe: 'תשובה נכונה: צריך at במקום on\nכlll: שעות תמיד עם AT (at 3:00 PM), לא ON.\nשים לב: ON לימים ותאריכים, AT לשעות.\nטעות נפוצה: לבלבל בין AT לשעות ו-ON לימים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'תקן את הטעות: "I arrived in time but she arrived in time." → I arrived in time but she arrived _____ time.',
        correctAnswer: 'on',
        explanationHe: 'תשובה נכונה: on\nכלל: IN TIME = הספקנו (not late), ON TIME = בדיוק בזמן (punctual).\nשים לב: שתי משמעויות שונות - IN TIME = הספקנו, ON TIME = punctual.\nטעות נפוצה: לחשוב ש-IN TIME ו-ON TIME אותו דבר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'מה לא בסדר במשפט? "During I was sleeping, the phone rang."',
        options: ['צריך while במקום during', 'צריך when במקום during', 'שתי התשובות הראשונות נכונות', 'המשפט נכון'],
        correctAnswer: 'שתי התשובות הראשונות נכונות',
        explanationHe: 'תשובה נכונה: צריך while או when\nכלל: DURING + שם עצם (during the movie), WHILE/WHEN + משפט (while I was sleeping).\nשים לב: DURING לא יכול לבוא לפני משפט עם פועל.\nטעות נפוצה: "during I was..." במקום "while I was...".',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'בחר את המשפט הנכון:',
        options: ['I study English since two years.', 'I study English for two years.', 'I study English during two years.', 'I study English at two years.'],
        correctAnswer: 'I study English for two years.',
        explanationHe: 'תשובה נכונה: I study English for two years\nכלל: FOR + מספר/משך זמן (for 2 years), לא SINCE.\nשים לב: "since two years" היא הטעות השכיחה ביותר!\nטעות נפוצה: "since two years" - טעות קלאסית!',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'תקן את הטעות: "I woke up in 6:30 this morning." → I woke up _____ 6:30 this morning.',
        correctAnswer: 'at',
        explanationHe: 'תשובה נכונה: at\nכלל: שעות מדויקות (6:30, 7:00, 11:45) תמיד עם AT.\nשים לב: AT לשעות, IN לחלקי יום (in the morning).\nטעות נפוצה: "in 6:30" - שעות תמיד AT!',
        difficulty: 'hard'
      }
    ]
  }
];

async function seedTopic14() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    console.log('Starting Topic 14 seeding...');

    for (const lessonData of lessonsData) {
      const { exercises, ...lessonInfo } = lessonData;

      // Create lesson
      const lesson = await Lesson.create(lessonInfo);
      console.log(`Created lesson: ${lessonInfo.subtopicNumber} - ${lessonInfo.titleEn}`);

      // Create exercises for this lesson
      for (const exerciseData of exercises) {
        const exerciseInfo = {
          lessonId: lesson.id,
          ...exerciseData
        };
        await Exercise.create(exerciseInfo);
      }
      console.log(`  Added ${exercises.length} exercises`);
    }

    await client.query('COMMIT');
    console.log('✅ Topic 14: Prepositions of Time seeded successfully!');
    console.log(`📊 Total: ${lessonsData.length} lessons with ${lessonsData.reduce((sum, l) => sum + l.exercises.length, 0)} exercises`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding Topic 14:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  seedTopic14()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { lessonsData, seedTopic14 };
