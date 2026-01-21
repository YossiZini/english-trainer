const { pool } = require('../../config/database');
const Lesson = require('../../models/Lesson');
const Exercise = require('../../models/Exercise');

// Topic 13: Prepositions of Place (מילות יחס - מקום)
const lessonsData = [
  // ==================== SUBTOPIC 13.1: In, On, At ====================
  {
    topicNumber: 13,
    subtopicNumber: '13.1',
    titleEn: 'In, On, At',
    titleHe: 'ב-, על, אצל',
    level: 'beginner',
    orderIndex: 1,
    theoryContentHe: `
<h2>מילות יחס של מקום: In, On, At</h2>

<p>שלוש מילות יחס בסיסיות שמציינות מיקום במרחב.</p>

<div class="rules">
  <h3><strong>IN (בתוך):</strong></h3>
  <p>משתמשים כשמשהו נמצא בתוך מיכל או חלל:</p>
  <ul>
    <li>in the box (בקופסה)</li>
    <li>in the room (בחדר)</li>
    <li>in the garden (בגינה)</li>
    <li>in the car (במכונית)</li>
    <li>in the bag (בתיק)</li>
    <li>in the water (במים)</li>
    <li>in the sky (בשמיים)</li>
  </ul>

  <h3><strong>ON (על):</strong></h3>
  <p>משתמשים כשמשהו נמצא על גבי משטח:</p>
  <ul>
    <li>on the table (על השולחן)</li>
    <li>on the wall (על הקיר)</li>
    <li>on the floor (על הרצפה)</li>
    <li>on the chair (על הכיסא)</li>
    <li>on the shelf (על המדף)</li>
    <li>on the page (על הדף)</li>
  </ul>

  <h3><strong>AT (אצל, ליד, ב-):</strong></h3>
  <p>משתמשים לנקודה מסוימת או מיקום ספציפי:</p>
  <ul>
    <li>at the door (ליד הדלת)</li>
    <li>at the window (ליד החלון)</li>
    <li>at the bus stop (בתחנת האוטובוס)</li>
    <li>at school (בבית הספר)</li>
    <li>at home (בבית)</li>
    <li>at work (בעבודה)</li>
  </ul>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'The documents are locked _____ the safe _____ the manager\'s office.',
        options: ['in, in', 'at, at', 'on, in', 'in, at'],
        correctAnswer: 'in, in',
        explanationHe: 'תשובה נכונה: in, in - המסמכים נעולים בכספת בתוך המשרד.\nכלל: IN משמש למקומות סגורים/מוקפים (כספת וגם משרד).\nשים לב: שתי ההיקפים שונים - הכספת קטנה והמשרד גדול, אבל שניהם מקומות מוקפים.\nטעות נפוצה: להשתמש ב-AT עבור משרד, אבל AT מתאים לנקודה ספציפית, לא חלל סגור.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'We\'re traveling _____ the bus, but we came here _____ a taxi.',
        correctAnswer: 'on, in',
        explanationHe: 'תשובה נכונה: on, in - נוסעים באוטובוס אבל הגענו במונית.\nכלל: תחבורה ציבורית גדולה (bus, train, plane) = ON, רכב פרטי קטן (car, taxi) = IN.\nשים לב: זו הבחנה חשובה - גודל הרכב קובע את מילת היחס.\nטעות נפוצה: להשתמש ב-IN עבור אוטובוס כי חושבים על פנים הרכב.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'She\'s waiting _____ the corner of Main Street and Fifth Avenue.',
        options: ['in', 'on', 'at', 'inside'],
        correctAnswer: 'at',
        explanationHe: 'תשובה נכונה: at - היא מחכה בפינת הרחובות.\nכלל: AT משמש לנקודות ספציפיות כמו פינות רחוב (corner).\nשים לב: יש הבדל בין "at the corner" (של רחוב) לבין "in the corner" (של חדר).\nטעות נפוצה: להשתמש ב-ON the corner (נפוץ באמריקאית אבל פחות פורמלי).',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'The kids are playing _____ the street outside.',
        options: ['in', 'at', 'on', 'inside'],
        correctAnswer: 'in',
        explanationHe: 'תשובה נכונה: in - הילדים משחקים ברחוב.\nכלל: IN the street (בריטית) vs ON the street (אמריקאית) - שתיהן נכונות.\nשים לב: כאן IN מתאימה יותר כי הילדים בתוך מרחב הרחוב.\nטעות נפוצה: לחשוב שרק ON נכונה - שתיהן תקפות לפי הניב.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'I left my phone _____ work. Can you stop _____ the office?',
        correctAnswer: 'at, at',
        explanationHe: 'תשובה נכונה: at, at - השארתי את הטלפון בעבודה, תוכל לעצור במשרד?\nכלל: AT work ו-AT the office הם ביטויים קבועים - מתייחסים לנקודה/מקום ספציפי.\nשים לב: גם כשזה בניין גדול, משתמשים ב-AT כי זה מיקום ספציפי בהקשר פעולה.\nטעות נפוצה: להשתמש ב-IN work או IN the office.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'There\'s a beautiful painting _____ the ceiling _____ the lobby.',
        options: ['on, in', 'at, at', 'in, on', 'on, on'],
        correctAnswer: 'on, in',
        explanationHe: 'תשובה נכונה: on, in - יש ציור יפה על התקרה בלובי.\nכלל: ON משמש למשטחים (תקרה היא משטח), IN למקומות סגורים (לובי).\nשים לב: תקרה היא משטח כמו רצפה או קיר - תמיד ON.\nטעות נפוצה: לחשוב שמשהו "מעל" אז צריך ABOVE במקום ON.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'Meet me _____ the entrance. I\'ll be standing _____ the door.',
        correctAnswer: 'at, at',
        explanationHe: 'תשובה נכונה: at, at - תפגוש אותי בכניסה, אני אעמוד ליד הדלת.\nכלל: AT משמש לנקודות ספציפיות כמו כניסות ודלתות.\nשים לב: גם "entrance" וגם "door" הם נקודות מוגדרות, לא משטחים או חללים.\nטעות נפוצה: להשתמש ב-IN the entrance או ON the door.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'The passengers are already _____ the plane, sitting _____ their seats.',
        options: ['on, in', 'in, on', 'on, on', 'in, in'],
        correctAnswer: 'on, in',
        explanationHe: 'תשובה נכונה: on, in - הנוסעים כבר במטוס, יושבים במושבים.\nכלל: מטוס הוא תחבורה גדולה = ON, אבל מושבים הם מקום סגור = IN.\nשים לב: למרות שאומרים ON the plane, כשמדברים על מושב אומרים IN your seat.\nטעות נפוצה: להשתמש ב-ON your seat (נכון לכיסא רגיל, לא למושב מטוס/רכב).',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'She keeps her jewelry _____ a box _____ the drawer.',
        correctAnswer: 'in, in',
        explanationHe: 'תשובה נכונה: in, in - היא שומרת את התכשיטים בקופסה במגירה.\nכלל: שני מיכלים/חללים סגורים - קופסה ומגירה.\nשים לב: מבנה של מיכלים מקוננים - הקופסה בתוך המגירה.\nטעות נפוצה: להשתמש ב-ON the drawer כי חושבים על המשטח העליון.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'The conference will be held _____ the hotel _____ the 5th floor.',
        options: ['in, on', 'at, in', 'on, at', 'at, at'],
        correctAnswer: 'in, on',
        explanationHe: 'תשובה נכונה: in, on - הכנס יתקיים במלון בקומה 5.\nכלל: IN למבנה/בניין (hotel), ON למספר קומה (floor).\nשים לב: קומות תמיד עם ON (on the 5th floor, on the ground floor).\nטעות נפוצה: להשתמש ב-AT the hotel (AT מתאים כשמדברים על הגעה, לא שהייה).',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'I\'ll wait for you _____ home. Call me when you arrive _____ the airport.',
        options: ['at, at', 'in, at', 'at, in', 'in, in'],
        correctAnswer: 'at, at',
        explanationHe: 'תשובה נכונה: at, at - אחכה לך בבית, תתקשר כשתגיע לשדה התעופה.\nכלל: AT home ו-AT the airport הם ביטויים קבועים - נקודות ספציפיות.\nשים לב: "at home" תמיד ללא "the", אבל "at the airport" עם "the".\nטעות נפוצה: להשתמש ב-IN home או IN the airport.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'There are fresh flowers _____ the vase _____ the dining table.',
        correctAnswer: 'in, on',
        explanationHe: 'תשובה נכונה: in, on - יש פרחים טריים באגרטל על שולחן האוכל.\nכלל: פרחים בתוך אגרטל = IN, אגרטל על השולחן = ON.\nשים לב: שתי רמות מרחביות שונות - הכלה (in) ומשטח (on).\nטעות נפוצה: להשתמש ב-ON the vase במקום IN.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'The store is located _____ the corner _____ King Street.',
        options: ['at, of', 'on, on', 'in, at', 'at, in'],
        correctAnswer: 'at, of',
        explanationHe: 'תשובה נכונה: at, of - החנות ממוקמת בפינת רחוב קינג.\nכלל: "at the corner" לפינת רחוב, ו-"of" מחבר לשם הרחוב.\nשים לב: המבנה הקבוע הוא "at the corner of [street name]".\nטעות נפוצה: להשתמש ב-ON the corner (אמריקאי) או IN the corner (לחדר, לא רחוב).',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'The cat is hiding somewhere _____ the building. I saw it _____ the stairs.',
        correctAnswer: 'in, on',
        explanationHe: 'תשובה נכונה: in, on - החתול מסתתר איפשהו בבניין, ראיתי אותו על המדרגות.\nכלל: IN building (בתוך המבנה), ON stairs (על משטח המדרגות).\nשים לב: מדרגות הן משטח שמטפסים עליו = ON.\nטעות נפוצה: להשתמש ב-IN the stairs.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'We had dinner _____ a nice restaurant _____ the city center.',
        options: ['in, in', 'at, in', 'in, at', 'at, at'],
        correctAnswer: 'at, in',
        explanationHe: 'תשובה נכונה: at, in - אכלנו במסעדה נחמדה במרכז העיר.\nכלל: AT restaurant (נקודה/מקום ספציפי לפעולה), IN city center (אזור).\nשים לב: AT משמש למסעדות כי זה מיקום ספציפי שבו עושים פעולה.\nטעות נפוצה: להשתמש ב-IN the restaurant (אפשרי אבל פחות נפוץ).',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'The information is _____ page 47 _____ the middle of the book.',
        options: ['on, in', 'in, on', 'at, in', 'on, at'],
        correctAnswer: 'on, in',
        explanationHe: 'תשובה נכונה: on, in - המידע בעמוד 47 באמצע הספר.\nכלל: ON page (משטח הדף), IN the book (בתוך הספר).\nשים לב: דפים תמיד עם ON כי הם משטחים.\nטעות נפוצה: להשתמש ב-IN page כי חושבים על "בתוך" הטקסט.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'There\'s a lovely garden _____ the back _____ the house.',
        correctAnswer: 'at, of',
        explanationHe: 'תשובה נכונה: at, of - יש גינה מקסימה בחלק האחורי של הבית.\nכלל: "at the back of" הוא ביטוי קבוע למיקום בחלק האחורי.\nשים לב: המבנה הקבוע משתמש ב-AT, לא IN, למיקום זה.\nטעות נפוצה: להשתמש ב-IN the back (אפשרי לרכב, לא לבית).',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'She\'s studying _____ the library. Her books are _____ the desk.',
        options: ['in, on', 'at, on', 'in, in', 'at, at'],
        correctAnswer: 'in, on',
        explanationHe: 'תשובה נכונה: in, on - היא לומדת בספרייה, הספרים שלה על השולחן.\nכלל: IN library (חלל גדול/מבנה), ON desk (משטח).\nשים לב: ספרייה היא מקום גדול שנמצאים בתוכו - IN.\nטעות נפוצה: להשתמש ב-AT the library (נכון לנקודת מפגש, לא שהייה).',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: 'The map shows that the treasure is buried _____ the ground _____ the old oak tree.',
        correctAnswer: 'in, under',
        explanationHe: 'תשובה נכונה: in, under - המפה מראה שהאוצר קבור באדמה מתחת לעץ האלון.\nכלל: IN the ground (בתוך האדמה), UNDER tree (מתחת לעץ).\nשים לב: שתי מילות יחס שונות - IN לחדירה לאדמה, UNDER למיקום ביחס לעץ.\nטעות נפוצה: להשתמש ב-ON the ground במקום IN.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'The tourists got _____ the train _____ platform 9.',
        options: ['on, at', 'in, on', 'on, on', 'in, at'],
        correctAnswer: 'on, at',
        explanationHe: 'תשובה נכונה: on, at - התיירים עלו לרכבת ברציף 9.\nכלל: ON train (תחבורה גדולה), AT platform (נקודה ספציפית בתחנה).\nשים לב: "get on" לעלייה לרכבת, ו-AT platform למיקום.\nטעות נפוצה: להשתמש ב-IN the train או ON platform.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 13.2: Under, Over, Above, Below ====================
  {
    topicNumber: 13,
    subtopicNumber: '13.2',
    titleEn: 'Under, Over, Above, Below',
    titleHe: 'מתחת, מעל',
    level: 'beginner',
    orderIndex: 2,
    theoryContentHe: `
<h2>מילות יחס: מתחת ומעל</h2>

<p>מילות יחס המתארות מיקום אנכי.</p>

<div class="rules">
  <h3><strong>UNDER (מתחת ל-):</strong></h3>
  <p>ישירות מתחת, עם מגע או קרוב מאוד:</p>
  <ul>
    <li>under the table (מתחת לשולחן)</li>
    <li>under the bed (מתחת למיטה)</li>
    <li>under the bridge (מתחת לגשר)</li>
    <li>under the tree (מתחת לעץ)</li>
  </ul>

  <h3><strong>OVER (מעל ל-):</strong></h3>
  <p>ישירות מעל, לעתים עם תנועה:</p>
  <ul>
    <li>over the bridge (מעל לגשר)</li>
    <li>over the table (מעל לשולחן)</li>
    <li>fly over the city (לטוס מעל העיר)</li>
    <li>jump over the wall (לקפוץ מעל הקיר)</li>
  </ul>

  <h3><strong>ABOVE (מעל ל-):</strong></h3>
  <p>גבוה יותר, לא בהכרח ישירות מעל:</p>
  <ul>
    <li>above the clouds (מעל העננים)</li>
    <li>above sea level (מעל פני הים)</li>
    <li>above the door (מעל הדלת)</li>
  </ul>

  <h3><strong>BELOW (מתחת ל-):</strong></h3>
  <p>נמוך יותר, לא בהכרח ישירות מתחת:</p>
  <ul>
    <li>below the surface (מתחת לפני השטח)</li>
    <li>below zero (מתחת לאפס)</li>
    <li>below average (מתחת לממוצע)</li>
  </ul>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'The submarine traveled _____ the surface for hours. The temperature _____ deck was freezing.',
        options: ['below, above', 'under, over', 'below, over', 'under, above'],
        correctAnswer: 'below, above',
        explanationHe: 'תשובה נכונה: below, above - הצוללת נסעה מתחת לפני השטח לשעות, הטמפרטורה על הסיפון הייתה קפואה.\nכלל: BELOW למיקום נמוך יותר לא ישיר, ABOVE למיקום גבוה יותר לא ישיר.\nשים לב: BELOW/ABOVE משמשים כשאין מגע ישיר או כיסוי מלא.\nטעות נפוצה: להשתמש ב-UNDER/OVER שמצריכים מיקום ישיר יותר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'The helicopter flew _____ the bridge. There was a boat passing _____ it.',
        correctAnswer: 'over, under',
        explanationHe: 'תשובה נכונה: over, under - המסוק טס מעל הגשר, הייתה סירה שעברה מתחתיו.\nכלל: OVER לתנועה מעל משהו, UNDER לתנועה/מיקום ישירות מתחת.\nשים לב: OVER מדגיש תנועה או מעבר, UNDER מיקום ישיר מתחת.\nטעות נפוצה: להשתמש ב-ABOVE במקום OVER כשיש תנועה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'The city is 500 meters _____ sea level, but the mountains _____ it reach 3000 meters.',
        options: ['above, above', 'over, over', 'above, over', 'over, above'],
        correctAnswer: 'above, above',
        explanationHe: 'תשובה נכונה: above, above - העיר 500 מטר מעל פני הים, אבל ההרים מעליה מגיעים ל-3000 מטר.\nכלל: ABOVE משמש למדידות גובה יחסי ולא למיקום ישיר.\nשים לב: "above sea level" הוא ביטוי קבוע למדידת גובה.\nטעות נפוצה: להשתמש ב-OVER שמתאים לכיסוי או תנועה ישירה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'Put a blanket _____ the baby to keep him warm. The thermometer shows _____ zero outside.',
        options: ['over, below', 'above, under', 'over, under', 'above, below'],
        correctAnswer: 'over, below',
        explanationHe: 'תשובה נכונה: over, below - שים שמיכה על התינוק לשמור עליו חם, המדחום מראה מתחת לאפס בחוץ.\nכלל: OVER לכיסוי מלא, BELOW לטמפרטורה מתחת לנקודה מסוימת.\nשים לב: "below zero" הוא ביטוי קבוע לטמפרטורה שלילית.\nטעות נפוצה: להשתמש ב-UNDER zero (שגוי - תמיד BELOW).',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'The lamp is hanging _____ the dining table. Don\'t put anything _____ it.',
        correctAnswer: 'above, under',
        explanationHe: 'תשובה נכונה: above, under - המנורה תלויה מעל שולחן האוכל, אל תשים שום דבר מתחתיה.\nכלל: ABOVE כשתלוי מעל לא בדיוק במרכז, UNDER כשישירות מתחת.\nשים לב: מנורה תלויה = ABOVE (לא מגע ישיר), מתחת למנורה = UNDER.\nטעות נפוצה: להשתמש ב-OVER למנורה תלויה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'His test score was _____ average, but still _____ the passing grade.',
        options: ['below, above', 'under, over', 'below, over', 'under, above'],
        correctAnswer: 'below, above',
        explanationHe: 'תשובה נכונה: below, above - ציון המבחן שלו היה מתחת לממוצע, אבל עדיין מעל ציון העבור.\nכלל: BELOW/ABOVE משמשים לערכים מופשטים כמו ציונים וממוצעים.\nשים לב: "below average" ו-"above the passing grade" הם ביטויים נפוצים.\nטעות נפוצה: להשתמש ב-UNDER/OVER לערכים מופשטים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'The clouds are _____ us. Look, there\'s a bird flying just _____ the clouds.',
        correctAnswer: 'above, below',
        explanationHe: 'תשובה נכונה: above, below - העננים מעלינו, תראה, יש ציפור שטסה ממש מתחת לעננים.\nכלל: ABOVE/BELOW למיקומים יחסיים בגובה ללא מגע ישיר.\nשים לב: כשמדברים על שמיים ועננים תמיד ABOVE/BELOW.\nטעות נפוצה: להשתמש ב-OVER/UNDER שמצריכים מיקום ישיר יותר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'The cat likes to hide _____ the sofa. Sometimes it jumps _____ it.',
        options: ['under, over', 'below, above', 'under, above', 'below, over'],
        correctAnswer: 'under, over',
        explanationHe: 'תשובה נכונה: under, over - החתול אוהב להתחבא מתחת לספה, לפעמים הוא קופץ מעליה.\nכלל: UNDER למיקום ישיר מתחת עם מגע/קרבה, OVER לתנועת קפיצה מעל.\nשים לב: UNDER מדגיש מיקום קבוע, OVER מדגיש תנועה.\nטעות נפוצה: להשתמש ב-BELOW/ABOVE למיקומים פיזיים ישירים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'The plane is flying _____ the storm clouds to avoid turbulence. The temperature up there is _____ freezing.',
        options: ['above, below', 'over, under', 'above, under', 'over, below'],
        correctAnswer: 'above, below',
        explanationHe: 'תשובה נכונה: above, below - המטוס טס מעל עננות הסערה כדי להימנע מטורבולנציה, הטמפרטורה שם למעלה מתחת לקפיאה.\nכלל: ABOVE לגובה יחסי, BELOW לטמפרטורה.\nשים לב: במטאורולוגיה משתמשים ב-ABOVE/BELOW לגבהים ולטמפרטורות.\nטעות נפוצה: להשתמש ב-OVER במקום ABOVE לגובה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'The sign hanging _____ the door says "No entry." The mat _____ your feet says "Welcome."',
        correctAnswer: 'above, under',
        explanationHe: 'תשובה נכונה: above, under - השלט התלוי מעל הדלת אומר "אסור בכניסה", השטיח מתחת לרגליים שלך אומר "ברוכים הבאים".\nכלל: ABOVE לתלייה מעל, UNDER למיקום ישיר מתחת עם מגע.\nשים לב: "above the door" לשלט תלוי, "under your feet" לשטיח.\nטעות נפוצה: להשתמש ב-OVER the door או BELOW your feet.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'The children are standing _____ the umbrella to stay dry. The rain is falling _____ them.',
        options: ['under, above', 'below, over', 'under, over', 'below, above'],
        correctAnswer: 'under, above',
        explanationHe: 'תשובה נכונה: under, above - הילדים עומדים מתחת למטריה כדי להישאר יבשים, הגשם יורד מעליהם.\nכלל: UNDER למחסה ישיר, ABOVE למיקום גבוה יותר.\nשים לב: מטריה מעניקה כיסוי ישיר = UNDER.\nטעות נפוצה: להשתמש ב-BELOW במקום UNDER למחסה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'The city built a tunnel _____ the mountain instead of going _____ it.',
        correctAnswer: 'under, over',
        explanationHe: 'תשובה נכונה: under, over - העיר בנתה מנהרה מתחת להר במקום לעבור מעליו.\nכלל: UNDER לחדירה/מעבר מתחת, OVER למעבר מעל.\nשים לב: מנהרה = UNDER (דרך מתחת), כביש מעל = OVER.\nטעות נפוצה: להשתמש ב-BELOW/ABOVE שפחות מתאימים לתשתיות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'His grades are _____ expectations, but not far _____ what we hoped for.',
        options: ['below, below', 'under, under', 'below, under', 'under, below'],
        correctAnswer: 'below, below',
        explanationHe: 'תשובה נכונה: below, below - הציונים שלו מתחת לציפיות, אבל לא רחוק מתחת למה שקיווינו.\nכלל: BELOW משמש לערכים מופשטים כמו ציפיות ותקוות.\nשים לב: בהקשרים מופשטים תמיד BELOW, לא UNDER.\nטעות נפוצה: להשתמש ב-UNDER לביטויים מופשטים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'Spread the tablecloth _____ the table. Make sure nothing falls _____ it.',
        correctAnswer: 'over, under',
        explanationHe: 'תשובה נכונה: over, under - פרוש את המפה על השולחן, תוודא ששום דבר לא ייפול מתחתיו.\nכלל: OVER לכיסוי מלא, UNDER למיקום מתחת לשולחן.\nשים לב: מפה מכסה = OVER, מתחת לשולחן = UNDER.\nטעות נפוצה: להשתמש ב-ABOVE במקום OVER לכיסוי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'The apartment _____ ours is very noisy. The one _____ is quiet.',
        options: ['above, below', 'over, under', 'above, under', 'over, below'],
        correctAnswer: 'above, below',
        explanationHe: 'תשובה נכונה: above, below - הדירה מעלינו רועשת מאוד, זו מתחת שקטה.\nכלל: ABOVE/BELOW לקומות בבניין (מיקום יחסי לא ישיר).\nשים לב: קומות בבניין = ABOVE/BELOW, לא OVER/UNDER.\nטעות נפוצה: להשתמש ב-OVER/UNDER לקומות בבניין.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'He wore a coat _____ his sweater. The temperature was _____ 5 degrees.',
        options: ['over, below', 'above, under', 'over, under', 'above, below'],
        correctAnswer: 'over, below',
        explanationHe: 'תשובה נכונה: over, below - הוא לבש מעיל מעל הסוודר שלו, הטמפרטורה הייתה מתחת ל-5 מעלות.\nכלל: OVER לבגד מעל בגד, BELOW לטמפרטורה.\nשים לב: שכבות בגדים = OVER, טמפרטורה = BELOW.\nטעות נפוצה: להשתמש ב-ABOVE לבגדים או UNDER לטמפרטורה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'The bird\'s nest is _____ the branch. We can see it from _____ the tree.',
        correctAnswer: 'above, below',
        explanationHe: 'תשובה נכונה: above, below - קן הציפור מעל הענף, אנחנו יכולים לראות אותו מתחת לעץ.\nכלל: ABOVE למיקום גבוה יותר, BELOW לצפייה מנקודה נמוכה.\nשים לב: קן על ענף עליון = ABOVE, צופים מלמטה = from BELOW.\nטעות נפוצה: להשתמש ב-OVER/UNDER למיקומים לא ישירים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'Jump _____ the rope when it comes _____ your feet.',
        options: ['over, under', 'above, below', 'over, below', 'above, under'],
        correctAnswer: 'over, under',
        explanationHe: 'תשובה נכונה: over, under - קפוץ מעל החבל כשהוא מגיע מתחת לרגליים שלך.\nכלל: OVER לתנועת קפיצה, UNDER למיקום מתחת לרגליים.\nשים לב: תנועות דינמיות משתמשות ב-OVER/UNDER.\nטעות נפוצה: להשתמש ב-ABOVE/BELOW לתנועות פיזיות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: 'The restaurant is _____ ground level, in the basement. The parking is _____ it.',
        correctAnswer: 'below, above',
        explanationHe: 'תשובה נכונה: below, above - המסעדה מתחת לרמת הקרקע, במרתף, החניה מעליה.\nכלל: BELOW למיקום מתחת לרמה מסוימת, ABOVE למיקום מעל.\nשים לב: "below ground level" הוא ביטוי קבוע למרתף.\nטעות נפוצה: להשתמש ב-UNDER ground level.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'Pull the curtain _____ the window. The sun is shining directly _____ us.',
        options: ['over, above', 'above, over', 'over, over', 'above, above'],
        correctAnswer: 'over, above',
        explanationHe: 'תשובה נכונה: over, above - משוך את הוילון על החלון, השמש זורחת ישירות מעלינו.\nכלל: OVER לכיסוי (וילון), ABOVE למיקום בשמיים.\nשים לב: וילון מכסה = OVER, שמש בשמיים = ABOVE.\nטעות נפוצה: להשתמש באותה מילה לשני המצבים.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 13.3: Next to, Beside, Between, Among ====================
  {
    topicNumber: 13,
    subtopicNumber: '13.3',
    titleEn: 'Next to, Beside, Between, Among',
    titleHe: 'ליד, בין',
    level: 'beginner',
    orderIndex: 3,
    theoryContentHe: `
<h2>מילות יחס: ליד ובין</h2>

<p>מילות יחס המתארות קרבה ויחסים בין עצמים.</p>

<div class="rules">
  <h3><strong>NEXT TO / BESIDE (ליד):</strong></h3>
  <p>בצד של משהו:</p>
  <ul>
    <li>next to the door (ליד הדלת)</li>
    <li>beside the window (ליד החלון)</li>
    <li>sit next to me (שב לידי)</li>
    <li>beside the school (ליד בית הספר)</li>
  </ul>

  <h3><strong>BETWEEN (בין):</strong></h3>
  <p>באמצע בין שני דברים:</p>
  <ul>
    <li>between the trees (בין שני עצים)</li>
    <li>between you and me (בינך לביני)</li>
    <li>between the houses (בין הבתים - שניים)</li>
    <li>between 5 and 6 o'clock (בין 5 ל-6)</li>
  </ul>

  <h3><strong>AMONG (בין, בתוך):</strong></h3>
  <p>באמצע של שלושה דברים או יותר:</p>
  <ul>
    <li>among the trees (בין העצים - הרבה)</li>
    <li>among friends (בין חברים)</li>
    <li>among the crowd (בתוך הקהל)</li>
  </ul>

  <div class="tip">
    <strong>טיפ:</strong> בין שניים = BETWEEN, בין שלושה או יותר = AMONG
  </div>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'The pharmacy is located _____ the supermarket and the bank, right _____ the post office.',
        options: ['between, beside', 'among, next to', 'between, among', 'beside, between'],
        correctAnswer: 'between, beside',
        explanationHe: 'תשובה נכונה: between, beside - בית המרקחת ממוקם בין הסופרמרקט והבנק, ממש ליד הדואר.\nכלל: BETWEEN לשניים, BESIDE/NEXT TO לצמוד.\nשים לב: BETWEEN כשיש שני דברים ספציפיים, BESIDE כשמדברים על קרבה צמודה.\nטעות נפוצה: להשתמש ב-AMONG כשיש רק שני דברים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'I found the book hidden _____ all the old magazines in the attic.',
        correctAnswer: 'among',
        explanationHe: 'תשובה נכונה: among - מצאתי את הספר מוסתר בין כל המגזינים הישנים בעליית הגג.\nכלל: AMONG לשלושה או יותר פריטים.\nשים לב: "all the magazines" מציין קבוצה גדולה = AMONG.\nטעות נפוצה: להשתמש ב-BETWEEN כשיש הרבה פריטים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'She sat down _____ her two best friends. They were sitting _____ a large group of students.',
        options: ['between, among', 'among, between', 'beside, between', 'next to, beside'],
        correctAnswer: 'between, among',
        explanationHe: 'תשובה נכונה: between, among - היא התיישבה בין שתי החברות הטובות ביותר שלה, הם ישבו בתוך קבוצה גדולה של תלמידים.\nכלל: BETWEEN לשני חברים, AMONG לקבוצה גדולה.\nשים לב: שתי רמות של יחסים - קרוב (between) ורחב (among).\nטעות נפוצה: להשתמש ב-AMONG לשני אנשים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'The decision must be made _____ the three partners. Each sits _____ the other.',
        options: ['among, beside', 'between, next to', 'among, between', 'between, among'],
        correctAnswer: 'among, beside',
        explanationHe: 'תשובה נכונה: among, beside - ההחלטה חייבת להתקבל בין שלושת השותפים, כל אחד יושב ליד השני.\nכלל: AMONG לשלושה שותפים, BESIDE למיקום צמוד.\nשים לב: שלושה שותפים = AMONG, ישיבה צמודה = BESIDE.\nטעות נפוצה: להשתמש ב-BETWEEN לשלושה אנשים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'This matter is strictly _____ you and me. Don\'t tell anyone else.',
        correctAnswer: 'between',
        explanationHe: 'תשובה נכונה: between - העניין הזה הוא אך ורק בינך לביני, אל תספר לאף אחד אחר.\nכלל: "between you and me" הוא ביטוי קבוע לסוד משותף.\nשים לב: זהו ביטוי אידיומטי נפוץ בשפה האנגלית.\nטעות נפוצה: להשתמש ב-AMONG במקום BETWEEN בביטוי זה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'The house is nestled _____ tall pine trees, with a small garden _____ it.',
        options: ['among, beside', 'between, next to', 'among, between', 'beside, among'],
        correctAnswer: 'among, beside',
        explanationHe: 'תשובה נכונה: among, beside - הבית שוכן בין עצי אורן גבוהים, עם גינה קטנה לידו.\nכלל: AMONG לעצים רבים, BESIDE לגינה צמודה.\nשים לב: "nestled among" הוא ביטוי נפוץ למשהו שמוקף.\nטעות נפוצה: להשתמש ב-BETWEEN לעצים רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'There\'s a small café _____ the two office buildings. Sit _____ me and I\'ll tell you about it.',
        correctAnswer: 'between, beside',
        explanationHe: 'תשובה נכונה: between, beside - יש בית קפה קטן בין שני בנייני המשרדים, שב לידי ואספר לך עליו.\nכלל: BETWEEN לשני בניינים, BESIDE למיקום צמוד לאדם.\nשים לב: BESIDE ו-NEXT TO ניתנים להחלפה במשפט זה.\nטעות נפוצה: להשתמש ב-AMONG לשני בניינים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'He feels comfortable _____ strangers, but nervous when standing _____ his two bosses.',
        options: ['among, between', 'between, among', 'beside, next to', 'next to, beside'],
        correctAnswer: 'among, between',
        explanationHe: 'תשובה נכונה: among, between - הוא מרגיש בנוח בין זרים, אבל עצבני כשעומד בין שני הבוסים שלו.\nכלל: AMONG לקבוצה גדולה (זרים), BETWEEN לשניים (שני בוסים).\nשים לב: AMONG מרמז על התמזגות בקבוצה, BETWEEN מרמז על מיקום מדויק.\nטעות נפוצה: להשתמש ב-BETWEEN לזרים רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'The museum is right _____ the library. You can choose _____ three different exhibitions.',
        options: ['next to, among', 'beside, between', 'next to, between', 'between, among'],
        correctAnswer: 'next to, among',
        explanationHe: 'תשובה נכונה: next to, among - המוזיאון ממש ליד הספרייה, אתה יכול לבחור בין שלוש תערוכות שונות.\nכלל: NEXT TO לסמיכות, AMONG לשלושה או יותר (choose among).\nשים לב: "choose among" משמש לבחירה מתוך שלושה או יותר אפשרויות.\nטעות נפוצה: להשתמש ב-BETWEEN כשיש יותר משתי אפשרויות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'The truth lies somewhere _____ these two versions. Walk _____ me so we can talk.',
        correctAnswer: 'between, beside',
        explanationHe: 'תשובה נכונה: between, beside - האמת נמצאת איפשהו בין שתי הגרסאות האלה, לך לידי כדי שנוכל לדבר.\nכלל: BETWEEN לשתי גרסאות, BESIDE למיקום צמוד בהליכה.\nשים לב: "between two versions" לאלטרנטיבות, "walk beside" ללכת לצד.\nטעות נפוצה: להשתמש ב-NEXT TO במקום BESIDE בהקשר תנועה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'She found her name _____ hundreds of others on the list. It was right _____ her sister\'s name.',
        options: ['among, beside', 'between, next to', 'among, between', 'beside, among'],
        correctAnswer: 'among, beside',
        explanationHe: 'תשובה נכונה: among, beside - היא מצאה את שמה בין מאות אחרים ברשימה, הוא היה ממש ליד שם אחותה.\nכלל: AMONG למאות שמות, BESIDE לשם הסמוך.\nשים לב: שתי רמות - רחבה (among hundreds) וספציפית (beside sister\'s name).\nטעות נפוצה: להשתמש ב-BETWEEN למאות פריטים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'The conversation _____ the four leaders lasted hours. Tensions _____ them were high.',
        correctAnswer: 'among, among',
        explanationHe: 'תשובה נכונה: among, among - השיחה בין ארבעת המנהיגים נמשכה שעות, המתחים ביניהם היו גבוהים.\nכלל: AMONG לארבעה או יותר אנשים בשתי הפעמים.\nשים לב: גם "conversation among" וגם "tensions among" נכונים לקבוצה.\nטעות נפוצה: להשתמש ב-BETWEEN לארבעה אנשים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'Park your car _____ mine. The space _____ the two cars should be enough.',
        options: ['beside, between', 'next to, among', 'between, beside', 'among, between'],
        correctAnswer: 'beside, between',
        explanationHe: 'תשובה נכונה: beside, between - תחנה את המכונית שלך ליד שלי, המרווח בין שתי המכוניות צריך להספיק.\nכלל: BESIDE לחנייה צמודה, BETWEEN למרווח בין שתי מכוניות.\nשים לב: BESIDE למיקום יחסי, BETWEEN למרווח פיזי.\nטעות נפוצה: להשתמש ב-AMONG לשתי מכוניות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'The restaurant stands _____ many cafés and shops. It\'s _____ a bookstore and a flower shop.',
        correctAnswer: 'among, between',
        explanationHe: 'תשובה נכונה: among, between - המסעדה ניצבת בין בתי קפה וחנויות רבים, היא בין חנות ספרים ולחנות פרחים.\nכלל: AMONG לקבוצה רחבה, BETWEEN לשני מקומות ספציפיים.\nשים לב: שתי רמות פירוט - כללית (among many) וספציפית (between two).\nטעות נפוצה: להשתמש ב-BETWEEN בשני המקרים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'She lives _____ the city\'s elite, in an apartment _____ two penthouses.',
        options: ['among, between', 'between, among', 'beside, next to', 'next to, beside'],
        correctAnswer: 'among, between',
        explanationHe: 'תשובה נכונה: among, between - היא גרה בין האליטה של העיר, בדירה בין שתי דירות פנטהאוז.\nכלל: AMONG לקבוצה חברתית, BETWEEN לשתי דירות.\nשים לב: "among the elite" הוא ביטוי נפוץ להשתייכות לקבוצה.\nטעות נפוצה: להשתמש ב-BETWEEN the elite.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'The teacher asked me to sit _____ the two strongest students. I felt lost _____ so many smart people.',
        options: ['between, among', 'among, between', 'beside, next to', 'next to, among'],
        correctAnswer: 'between, among',
        explanationHe: 'תשובה נכונה: between, among - המורה ביקש ממני לשבת בין שני התלמידים החזקים, הרגשתי אבוד בין כל כך הרבה אנשים חכמים.\nכלל: BETWEEN לשני תלמידים ספציפיים, AMONG לקבוצה גדולה.\nשים לב: "lost among" מבטא תחושת התמזגות בקבוצה גדולה.\nטעות נפוצה: להשתמש ב-AMONG the two students.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'The village is hidden _____ mountains. The main road runs _____ two tall peaks.',
        correctAnswer: 'among, between',
        explanationHe: 'תשובה נכונה: among, between - הכפר מוסתר בין הרים, הכביש הראשי עובר בין שני פסגות גבוהות.\nכלל: AMONG להרים רבים, BETWEEN לשתי פסגות ספציפיות.\nשים לב: "hidden among" לסביבה רחבה, "between two peaks" למיקום מדויק.\nטעות נפוצה: להשתמש ב-BETWEEN mountains כשיש הרבה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'Come sit _____ us! There\'s space _____ David and Sarah.',
        options: ['beside, between', 'among, between', 'next to, among', 'between, beside'],
        correctAnswer: 'beside, between',
        explanationHe: 'תשובה נכונה: beside, between - בוא תשב לידנו! יש מקום בין דוד לשרה.\nכלל: BESIDE לצירוף לקבוצה, BETWEEN לשני אנשים ספציפיים.\nשים לב: "sit beside us" להצטרפות, "between David and Sarah" למיקום מדויק.\nטעות נפוצה: להשתמש ב-AMONG במקום BESIDE לבקשה להצטרף.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: 'The compromise _____ the parties was reached. They sat _____ each other at the table.',
        correctAnswer: 'between, beside',
        explanationHe: 'תשובה נכונה: between, beside - הפשרה בין הצדדים הושגה, הם ישבו אחד ליד השני ליד השולחן.\nכלל: BETWEEN לשני צדדים בהסכם, BESIDE לישיבה צמודה.\nשים לב: "between parties" לצדדים במשא ומתן, "beside each other" לקרבה פיזית.\nטעות נפוצה: להשתמש ב-NEXT TO במקום BESIDE בהקשר פורמלי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'The treasure is buried _____ these ancient ruins. The map shows it\'s _____ the two largest pillars.',
        options: ['among, between', 'between, among', 'beside, next to', 'next to, beside'],
        correctAnswer: 'among, between',
        explanationHe: 'תשובה נכונה: among, between - האוצר קבור בין החורבות העתיקות האלה, המפה מראה שהוא בין שני העמודים הגדולים.\nכלל: AMONG לחורבות רבות, BETWEEN לשני עמודים.\nשים לב: שתי רמות דיוק - רחבה (among ruins) ומדויקת (between pillars).\nטעות נפוצה: להשתמש ב-BETWEEN the ruins.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 13.4: In front of, Behind ====================
  {
    topicNumber: 13,
    subtopicNumber: '13.4',
    titleEn: 'In front of, Behind',
    titleHe: 'מול, מאחורי',
    level: 'beginner',
    orderIndex: 4,
    theoryContentHe: `
<h2>מילות יחס: לפני ומאחורי</h2>

<p>מילות יחס המתארות מיקום מול או מאחורי משהו.</p>

<div class="rules">
  <h3><strong>IN FRONT OF (מול, לפני):</strong></h3>
  <p>בצד הקדמי:</p>
  <ul>
    <li>in front of the house (מול הבית)</li>
    <li>in front of the class (לפני הכיתה)</li>
    <li>stand in front of me (תעמוד לפני)</li>
    <li>in front of the mirror (מול המראה)</li>
  </ul>

  <h3><strong>BEHIND (מאחורי):</strong></h3>
  <p>בצד האחורי:</p>
  <ul>
    <li>behind the door (מאחורי הדלת)</li>
    <li>behind the tree (מאחורי העץ)</li>
    <li>sit behind me (שב מאחורי)</li>
    <li>behind the building (מאחורי הבניין)</li>
  </ul>

  <div class="tip">
    <strong>שים לב:</strong> in front of הוא ביטוי קבוע - לא אומרים "in front"
  </div>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'Please wait _____ the building. I\'ll meet you there, not _____ it.',
        options: ['in front of, behind', 'behind, in front of', 'beside, between', 'among, next to'],
        correctAnswer: 'in front of, behind',
        explanationHe: 'תשובה נכונה: in front of, behind - בבקשה תחכה מול הבניין, אפגוש אותך שם, לא מאחוריו.\nכלל: IN FRONT OF למיקום קדמי/פונה, BEHIND למיקום אחורי.\nשים לב: IN FRONT OF תמיד עם OF (לא in front).\nטעות נפוצה: לשכוח את ה-OF אחרי FRONT.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'The actor stood _____ the audience and bowed. The stage crew worked _____ the curtains.',
        correctAnswer: 'in front of, behind',
        explanationHe: 'תשובה נכונה: in front of, behind - השחקן עמד מול הקהל והשתחווה, צוות הבמה עבד מאחורי הווילונות.\nכלל: IN FRONT OF למיקום מול הצופים, BEHIND למיקום מאחורי מסך.\nשים לב: מיקומים מנוגדים - קדמי (מול הקהל) ואחורי (מאחורי הבמה).\nטעות נפוצה: להשתמש ב-BEFORE במקום IN FRONT OF למיקום פיזי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'She always sits _____ the class so she can see the board. I prefer sitting _____ where I can relax.',
        options: ['in front of, behind', 'behind, in front of', 'beside, next to', 'among, between'],
        correctAnswer: 'in front of, behind',
        explanationHe: 'תשובה נכונה: in front of, behind - היא תמיד יושבת בחזית הכיתה כדי שתוכל לראות את הלוח, אני מעדיף לשבת מאחור איפה שאני יכול להירגע.\nכלל: IN FRONT OF לחזית הכיתה, BEHIND לחלק האחורי.\nשים לב: העדפות ישיבה שונות - קדימה לראייה, אחורה לנוחות.\nטעות נפוצה: להשתמש ב-AT THE FRONT במקום IN FRONT.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'Park your car _____ mine, not _____ it where I can\'t see it.',
        options: ['in front of, behind', 'behind, in front of', 'beside, among', 'between, next to'],
        correctAnswer: 'in front of, behind',
        explanationHe: 'תשובה נכונה: in front of, behind - תחנה את המכונית שלך מול שלי, לא מאחוריה איפה שאני לא יכול לראות אותה.\nכלל: IN FRONT OF למיקום נראה (קדמי), BEHIND למיקום מוסתר (אחורי).\nשים לב: הדגשת ראות - מול (נראה) מול מאחור (מוסתר).\nטעות נפוצה: לבלבל בין קדמי לאחורי בהקשר חניה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'The teacher stood _____ the students. The troublemaker tried to hide _____ his friends.',
        correctAnswer: 'in front of, behind',
        explanationHe: 'תשובה נכונה: in front of, behind - המורה עמד מול התלמידים, עושה הצרות ניסה להתחבא מאחורי חבריו.\nכלל: IN FRONT OF לפני הכיתה (מורה), BEHIND להסתתרות מאחור.\nשים לב: מיקומים תפקידיים - מורה לפנים (סמכות), תלמיד מאחור (הסתרה).\nטעות נפוצה: להשתמש ב-BEFORE THE STUDENTS במקום IN FRONT OF.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'The children lined up _____ the school entrance. The playground is _____ the building.',
        options: ['in front of, behind', 'behind, in front of', 'beside, between', 'among, next to'],
        correctAnswer: 'in front of, behind',
        explanationHe: 'תשובה נכונה: in front of, behind - הילדים עמדו בשורה מול כניסת בית הספר, מגרש המשחקים מאחורי הבניין.\nכלל: IN FRONT OF לכניסה (חזית), BEHIND למגרש (אחורה).\nשים לב: מבנה טיפוסי של בית ספר - כניסה בחזית, מגרש מאחור.\nטעות נפוצה: להשתמש ב-AT THE ENTRANCE במקום IN FRONT OF.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'Stand _____ me in the photo. I don\'t want to be _____ anyone where you can\'t see me.',
        correctAnswer: 'in front of, behind',
        explanationHe: 'תשובה נכונה: in front of, behind - תעמוד לפני בתמונה, אני לא רוצה להיות מאחורי מישהו איפה שלא רואים אותי.\nכלל: IN FRONT OF למיקום בולט בתמונה, BEHIND למיקום מוסתר.\nשים לב: בצילום - לפנים (בולט), מאחור (מוסתר).\nטעות נפוצה: לבלבל בין קדמי לאחורי בהקשר צילום.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'The security guard stands _____ the gate. The staff entrance is _____ the main building.',
        options: ['in front of, behind', 'behind, in front of', 'beside, among', 'between, next to'],
        correctAnswer: 'in front of, behind',
        explanationHe: 'תשובה נכונה: in front of, behind - המאבטח עומד מול השער, כניסת הצוות מאחורי הבניין הראשי.\nכלל: IN FRONT OF לשמירה (מיקום גלוי), BEHIND למיקום שירות (מוסתר).\nשים לב: מיקומים תפקידיים - שמירה בחזית, שירות מאחור.\nטעות נפוצה: להשתמש ב-AT THE GATE במקום IN FRONT OF.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'He\'s always _____ schedule, never on time. But today he\'s actually _____ everyone else.',
        options: ['behind, in front of', 'in front of, behind', 'beside, between', 'among, next to'],
        correctAnswer: 'behind, in front of',
        explanationHe: 'תשובה נכונה: behind, in front of - הוא תמיד מאחורי לוח הזמנים, אף פעם לא בזמן, אבל היום הוא באמת לפני כולם.\nכלל: BEHIND schedule (מאחר/פיגור), IN FRONT OF (מקדים/מוביל).\nשים לב: שימוש מטפורי - BEHIND לפיגור בזמן, IN FRONT OF להקדמה.\nטעות נפוצה: להשתמש במילות יחס אלו רק למיקום פיזי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'The garden is _____ the house, and the garage is _____ it.',
        correctAnswer: 'in front of, behind',
        explanationHe: 'תשובה נכונה: in front of, behind - הגינה מול הבית, והמוסך מאחוריו.\nכלל: IN FRONT OF לגינה קדמית (חזית), BEHIND למוסך (אחורה).\nשים לב: סידור טיפוסי של בית - גינה בחזית, מוסך מאחור.\nטעות נפוצה: לבלבל בין מיקומי החזית והאחור של בית.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'The speaker stood _____ the microphone. The technicians worked _____ the scenes.',
        options: ['in front of, behind', 'behind, in front of', 'beside, between', 'among, next to'],
        correctAnswer: 'in front of, behind',
        explanationHe: 'תשובה נכונה: in front of, behind - הדובר עמד מול המיקרופון, הטכנאים עבדו מאחורי הקלעים.\nכלל: IN FRONT OF למיקום גלוי (דובר), BEHIND למיקום מאחורי הקלעים.\nשים לב: "behind the scenes" הוא ביטוי קבוע לעבודה מאחורי הקלעים.\nטעות נפוצה: להשתמש ב-AT THE MICROPHONE במקום IN FRONT OF.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'Don\'t walk _____ me, walk _____ me so I can see you.',
        correctAnswer: 'behind, in front of',
        explanationHe: 'תשובה נכונה: behind, in front of - אל תלך מאחורי, לך לפני כדי שאוכל לראות אותך.\nכלל: BEHIND למיקום מוסתר (מאחור), IN FRONT OF למיקום נראה (לפנים).\nשים לב: שינוי הנחיה - ממיקום מוסתר למיקום גלוי.\nטעות נפוצה: לשכוח את ה-OF אחרי FRONT.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'She hid the gift _____ her back. Then she brought it out _____ the children.',
        options: ['behind, in front of', 'in front of, behind', 'beside, between', 'among, next to'],
        correctAnswer: 'behind, in front of',
        explanationHe: 'תשובה נכונה: behind, in front of - היא הסתירה את המתנה מאחורי הגב שלה, אז הוציאה אותה מול הילדים.\nכלל: BEHIND למיקום מוסתר (מאחורי הגב), IN FRONT OF להצגה (מול הילדים).\nשים לב: מעבר מהסתרה לחשיפה - מאחור לפנים.\nטעות נפוצה: להשתמש ב-AT BACK במקום BEHIND.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'The dog always walks _____ its owner. It refuses to go _____ him.',
        correctAnswer: 'behind, in front of',
        explanationHe: 'תשובה נכונה: behind, in front of - הכלב תמיד הולך מאחורי בעליו, הוא מסרב ללכת לפניו.\nכלל: BEHIND למיקום בעקבות (מאחור), IN FRONT OF למיקום מוביל (לפנים).\nשים לב: התנהגות כלב - הליכה מאחורי הבעלים (כפיפות).\nטעות נפוצה: לבלבל את סדר ההליכה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'The statue stands _____ the museum. The parking lot is _____ the building.',
        options: ['in front of, behind', 'behind, in front of', 'beside, between', 'among, next to'],
        correctAnswer: 'in front of, behind',
        explanationHe: 'תשובה נכונה: in front of, behind - הפסל עומד מול המוזיאון, מגרש החניה מאחורי הבניין.\nכלל: IN FRONT OF למיקום מרכזי/נוי (פסל), BEHIND למיקום שירותי (חניה).\nשים לב: חלוקה טיפוסית - אטרקציה בחזית, שירות מאחור.\nטעות נפוצה: להשתמש ב-BEFORE THE MUSEUM במקום IN FRONT OF.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'He stood _____ the mirror and fixed his tie. She came up _____ him and surprised him.',
        options: ['in front of, behind', 'behind, in front of', 'beside, between', 'next to, among'],
        correctAnswer: 'in front of, behind',
        explanationHe: 'תשובה נכונה: in front of, behind - הוא עמד מול המראה ותיקן את העניבה שלו, היא ניגשה מאחוריו והפתיעה אותו.\nכלל: IN FRONT OF למול מראה (ראייה), BEHIND לגישה מאחור (הפתעה).\nשים לב: מיקום מול מראה ומיקום הפתעה מאחור.\nטעות נפוצה: להשתמש ב-AT THE MIRROR במקום IN FRONT OF.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'The company is _____ its competitors in sales. Last year it was far _____.',
        correctAnswer: 'in front of, behind',
        explanationHe: 'תשובה נכונה: in front of, behind - החברה לפני המתחרים שלה במכירות, בשנה שעברה היא הייתה הרבה מאחור.\nכלל: IN FRONT OF (מוביל/מקדים), BEHIND (מפגר/מאחר) בהקשר תחרותי.\nשים לב: שימוש מטפורי - מיקום במירוץ עסקי.\nטעות נפוצה: להשתמש במילות יחס אלו רק למיקום פיזי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'Please line up _____ the counter. Don\'t stand _____ other people.',
        options: ['in front of, behind', 'behind, in front of', 'beside, between', 'among, next to'],
        correctAnswer: 'in front of, behind',
        explanationHe: 'תשובה נכונה: in front of, behind - בבקשה תעמדו בשורה מול הדלפק, אל תעמדו מאחורי אנשים אחרים.\nכלל: IN FRONT OF למיקום מול דלפק, BEHIND להימנעות מחסימה.\nשים לב: הנחיות עמידה בתור - מול הדלפק, לא מאחורי אחרים.\nטעות נפוצה: לבלבל בין מיקום מול דלפק למיקום בתור.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: 'The ambulance stopped _____ the hospital entrance. Other cars had to park _____.',
        correctAnswer: 'in front of, behind',
        explanationHe: 'תשובה נכונה: in front of, behind - האמבולנס עצר מול כניסת בית החולים, מכוניות אחרות נאלצו לחנות מאחור.\nכלל: IN FRONT OF למיקום מועדף/דחוף (אמבולנס), BEHIND למיקום חלופי.\nשים לב: עדיפות - רכב חירום בחזית, אחרים מאחור.\nטעות נפוצה: להשתמש ב-AT THE ENTRANCE במקום IN FRONT OF.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'The CEO always sits _____ everyone else in meetings. Junior staff sit _____ the senior managers.',
        options: ['in front of, behind', 'behind, in front of', 'beside, between', 'among, next to'],
        correctAnswer: 'in front of, behind',
        explanationHe: 'תשובה נכונה: in front of, behind - המנכ"ל תמיד יושב לפני כולם בפגישות, צוות זוטר יושב מאחורי המנהלים הבכירים.\nכלל: IN FRONT OF למיקום בכיר/מוביל, BEHIND למיקום זוטר/תומך.\nשים לב: היררכיה במפגש - בכירים לפנים, זוטרים מאחור.\nטעות נפוצה: לא להבין את המשמעות ההיררכית של המיקומים.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 13.5: Near, Far from ====================
  {
    topicNumber: 13,
    subtopicNumber: '13.5',
    titleEn: 'Near, Far from',
    titleHe: 'קרוב, רחוק',
    level: 'beginner',
    orderIndex: 5,
    theoryContentHe: `
<h2>מילות יחס: קרוב ורחוק</h2>

<p>מילות יחס המתארות מרחק.</p>

<div class="rules">
  <h3><strong>NEAR (קרוב ל-):</strong></h3>
  <p>קרוב, לא רחוק:</p>
  <ul>
    <li>near the school (קרוב לבית הספר)</li>
    <li>near the park (קרוב לפארק)</li>
    <li>I live near here. (אני גר קרוב לכאן)</li>
    <li>near the city center (קרוב למרכז העיר)</li>
  </ul>

  <h3><strong>FAR FROM (רחוק מ-):</strong></h3>
  <p>לא קרוב, מרוחק:</p>
  <ul>
    <li>far from the city (רחוק מהעיר)</li>
    <li>far from home (רחוק מהבית)</li>
    <li>Is it far from here? (זה רחוק מכאן?)</li>
    <li>far from the beach (רחוק מהחוף)</li>
  </ul>

  <div class="tip">
    <strong>שים לב:</strong> far תמיד עם from בשאלות ושלילות. בחיוב משתמשים "a long way from"
  </div>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'We live quite _____ the train station, but _____ the city center.',
        options: ['near, far from', 'far from, near', 'near, near', 'far from, far from'],
        correctAnswer: 'near, far from',
        explanationHe: 'תשובה נכונה: near, far from - אנחנו גרים די קרוב לתחנת הרכבת, אבל רחוק ממרכז העיר.\nכלל: NEAR לקרבה (תחנה), FAR FROM למרחק (מרכז עיר).\nשים לב: NEAR יכול להיות ללא TO, או NEAR TO / CLOSE TO.\nטעות נפוצה: להשתמש ב-CLOSE FROM במקום FAR FROM.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'The hotel is very _____ the beach. You can walk there in 5 minutes. But it\'s _____ the mountains.',
        correctAnswer: 'near, far from',
        explanationHe: 'תשובה נכונה: near, far from - המלון קרוב מאוד לחוף, אתה יכול ללכת לשם ב-5 דקות, אבל הוא רחוק מההרים.\nכלל: NEAR לקרבה פיזית, FAR FROM למרחק גדול.\nשים לב: משך זמן הליכה מצביע על מרחק - 5 דקות = קרוב.\nטעות נפוצה: לשכוח את FROM אחרי FAR.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'Is there a hospital _____ here? The nearest one seems to be _____ the city.',
        options: ['near, far from', 'far from, near', 'near, near', 'close, near'],
        correctAnswer: 'near, far from',
        explanationHe: 'תשובה נכונה: near, far from - יש בית חולים קרוב לכאן? הקרוב ביותר נראה רחוק מהעיר.\nכלל: NEAR בשאלה (קרבה), FAR FROM במשפט (מרחק).\nשים לב: "the nearest one" משתמש בצורת העליונה של NEAR.\nטעות נפוצה: להשתמש ב-CLOSE במקום NEAR בשאלה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'They moved _____ their parents\' house. Now they\'re not _____ anymore.',
        options: ['far from, near', 'near, far from', 'near, near', 'close, far'],
        correctAnswer: 'far from, near',
        explanationHe: 'תשובה נכונה: far from, near - הם עברו רחוק מבית ההורים, עכשיו הם לא קרובים יותר.\nכלל: FAR FROM למרחק גדול, NEAR כשמדברים על קרבה בכלל.\nשים לב: שינוי במרחק - היו קרובים, עכשיו רחוקים.\nטעות נפוצה: לבלבל בין NEAR כשם תואר ל-NEAR כמילת יחס.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'The school is nowhere _____ ready for the inspection. We\'re _____ from being prepared.',
        correctAnswer: 'near, far',
        explanationHe: 'תשובה נכונה: near, far - בית הספר רחוק מאוד להיות מוכן לביקורת, אנחנו רחוקים מלהיות מוכנים.\nכלל: NOWHERE NEAR הוא ביטוי קבוע למשהו שלא קרוב בכלל, FAR FROM למרחק מטפורי.\nשים לב: שימוש מטפורי - לא מדברים על מרחק פיזי אלא על מוכנות.\nטעות נפוצה: להשתמש רק במילות יחס פיזיות, לא מופשטות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'The apartment is _____ the subway, which is convenient. But it\'s _____ any parks.',
        options: ['near, far from', 'far from, near', 'close, far', 'near, close to'],
        correctAnswer: 'near, far from',
        explanationHe: 'תשובה נכונה: near, far from - הדירה קרובה לרכבת התחתית, מה שנוח, אבל היא רחוקה מכל פארקים.\nכלל: NEAR ליתרון (רכבת תחתית), FAR FROM לחיסרון (פארקים).\nשים לב: ניגוד בין יתרון (קרבה לתחבורה) וחיסרון (ריחוק מטבע).\nטעות נפוצה: להשתמש ב-CLOSE במקום NEAR.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'She lives _____ her workplace, so she walks to work. Her brother lives _____ and has to drive.',
        correctAnswer: 'near, far',
        explanationHe: 'תשובה נכונה: near, far - היא גרה קרוב למקום העבודה שלה, אז היא הולכת לעבודה, אחיה גר רחוק וצריך לנסוע.\nכלל: NEAR לקרבה (הליכה אפשרית), FAR למרחק (נסיעה נדרשת).\nשים לב: FAR יכול להופיע בלי FROM כשהמשמעות ברורה מההקשר.\nטעות נפוצה: להוסיף FROM אחרי FAR כשזה לא נחוץ.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'The solution is _____ perfect, but it\'s _____ being useless.',
        options: ['far from, far from', 'near, near', 'far from, near', 'near, far from'],
        correctAnswer: 'far from, far from',
        explanationHe: 'תשובה נכונה: far from, far from - הפתרון רחוק מלהיות מושלם, אבל הוא רחוק מלהיות חסר תועלת.\nכלל: FAR FROM משמש לשני המקרים - רחוק מלהיות X (שלילי וחיובי).\nשים לב: FAR FROM משמש בביטויים מופשטים לא רק למרחק פיזי.\nטעות נפוצה: להשתמש ב-NEAR במקום FAR FROM בהקשר שלילי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'Is your house _____ the new shopping mall? Mine is unfortunately _____.',
        options: ['near, far', 'far, near', 'near, near', 'close, close'],
        correctAnswer: 'near, far',
        explanationHe: 'תשובה נכונה: near, far - הבית שלך קרוב לקניון החדש? שלי למרבה הצער רחוק.\nכלל: NEAR בשאלה, FAR בתשובה (ללא FROM כשהמשמעות ברורה).\nשים לב: FAR יכול להיות שם תואר בלי FROM כשעומד לבד.\nטעות נפוצה: להוסיף FROM אחרי FAR כשזה לא נחוץ.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'The restaurant is _____ here. Just a 2-minute walk. The other one is much _____.',
        correctAnswer: 'near, farther',
        explanationHe: 'תשובה נכונה: near, farther - המסעדה קרובה לכאן, רק 2 דקות הליכה, השנייה הרבה יותר רחוקה.\nכלל: NEAR לקרבה, FARTHER לצורת השוואה של רחוק.\nשים לב: FARTHER/FURTHER הן צורות ההשוואה של FAR.\nטעות נפוצה: להשתמש ב-MORE FAR במקום FARTHER.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'The deadline is getting _____. We\'re not _____ finishing yet.',
        options: ['near, near', 'near, far from', 'close, close to', 'near, close'],
        correctAnswer: 'near, near',
        explanationHe: 'תשובה נכונה: near, near - המועד האחרון מתקרב, אנחנו עדיין לא קרובים לסיים.\nכלל: NEAR כפועל (מתקרב) ו-NEAR כמילת יחס (קרובים ל-).\nשים לב: שימוש כפול ב-NEAR - פעם כפועל ופעם כמילת יחס.\nטעות נפוצה: לא להבין ש-NEAR יכול להיות גם פועל.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'His ideas are nowhere _____ practical. They\'re _____ from reality.',
        correctAnswer: 'near, far',
        explanationHe: 'תשובה נכונה: near, far - הרעיונות שלו בכלל לא קרובים להיות מעשיים, הם רחוקים מהמציאות.\nכלל: NOWHERE NEAR (בכלל לא קרוב), FAR FROM (רחוק מ-).\nשים לב: שני ביטויים מופשטים - nowhere near ו-far from reality.\nטעות נפוצה: להשתמש במילות יחס אלו רק למרחק פיזי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'The park is _____ the library, about a 10-minute walk. The museum is much _____.',
        options: ['near, farther', 'far, nearer', 'near, near', 'close, far'],
        correctAnswer: 'near, farther',
        explanationHe: 'תשובה נכונה: near, farther - הפארק קרוב לספרייה, בערך 10 דקות הליכה, המוזיאון הרבה יותר רחוק.\nכלל: NEAR לקרבה, FARTHER להשוואה (יותר רחוק).\nשים לב: משך הליכה מצביע על מרחק יחסי.\nטעות נפוצה: להשתמש ב-MORE FAR במקום FARTHER.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'We\'re in the _____ future going to move. But we\'re still _____ from making a decision.',
        correctAnswer: 'near, far',
        explanationHe: 'תשובה נכונה: near, far - בעתיד הקרוב אנחנו הולכים לעבור דירה, אבל אנחנו עדיין רחוקים מלקבל החלטה.\nכלל: NEAR future (עתיד קרוב - ביטוי קבוע), FAR FROM (רחוק מ-).\nשים לב: "in the near future" הוא ביטוי זמן נפוץ.\nטעות נפוצה: להשתמש ב-CLOSE future במקום NEAR.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'The airport is not _____ the hotel. How _____ is it exactly?',
        options: ['near, far', 'far, near', 'close, far', 'near, close'],
        correctAnswer: 'near, far',
        explanationHe: 'תשובה נכונה: near, far - שדה התעופה לא קרוב למלון, כמה רחוק הוא בדיוק?\nכלל: NEAR בשלילה, FAR בשאלה (כמה רחוק).\nשים לב: "how far" הוא ביטוי שאלה נפוץ למרחק.\nטעות נפוצה: להשתמש ב-HOW NEAR במקום HOW FAR.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'They bought a house _____ the school for their children. It\'s not _____ from shops either.',
        options: ['near, far', 'far, near', 'near, near', 'close, close'],
        correctAnswer: 'near, far',
        explanationHe: 'תשובה נכונה: near, far - הם קנו בית קרוב לבית הספר עבור הילדים שלהם, הוא גם לא רחוק מחנויות.\nכלל: NEAR לקרבה חיובית, NOT FAR FROM לקרבה בשלילה כפולה.\nשים לב: "not far from" = קרוב יחסית (ביטוי נפוץ).\nטעות נפוצה: להשתמש ב-NOT NEAR במקום NOT FAR FROM.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'The project is _____ completion. We\'re getting closer, but we\'re still _____ from done.',
        correctAnswer: 'near, far',
        explanationHe: 'תשובה נכונה: near, far - הפרויקט קרוב להשלמה, אנחנו מתקרבים, אבל אנחנו עדיין רחוקים מלסיים.\nכלל: NEAR completion (קרוב להשלמה), FAR FROM done (רחוק מלסיים).\nשים לב: שני ביטויים מופשטים על התקדמות בפרויקט.\nטעות נפוצה: להשתמש במילות יחס אלו רק למרחק פיזי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'The beach house is _____ the ocean. You can hear the waves. But it\'s _____ from town.',
        options: ['near, far', 'far, near', 'close, near', 'near, close'],
        correctAnswer: 'near, far',
        explanationHe: 'תשובה נכונה: near, far - בית החוף קרוב לאוקיינוס, אתה יכול לשמוע את הגלים, אבל הוא רחוק מהעיר.\nכלל: NEAR לקרבה מיידית (שומעים גלים), FAR FROM למרחק.\nשים לב: קרבה לטבע (חיובי) ריחוק מעיר (שלילי).\nטעות נפוצה: להשתמש ב-CLOSE במקום NEAR.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: 'The store is relatively _____ here. The _____ one is in the next town.',
        correctAnswer: 'near, nearest',
        explanationHe: 'תשובה נכונה: near, nearest - החנות יחסית קרובה לכאן, הקרובה ביותר היא בעיר הבאה.\nכלל: NEAR לקרבה יחסית, NEAREST לצורת העליונה (הקרוב ביותר).\nשים לב: NEAREST משמש לזיהוי המקום הקרוב ביותר.\nטעות נפוצה: להשתמש ב-MOST NEAR במקום NEAREST.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'His performance is _____ excellent, but _____ from terrible.',
        options: ['near, far', 'far, near', 'close, close', 'near, near'],
        correctAnswer: 'near, far',
        explanationHe: 'תשובה נכונה: near, far - הביצועים שלו קרובים למצוינים, אבל רחוקים מלהיות איומים.\nכלל: NEAR למשהו חיובי (מצוין), FAR FROM למשהו שלילי (נורא).\nשים לב: שימוש מטפורי לדירוג איכות - קרוב למצוינות, רחוק מגרוע.\nטעות נפוצה: לא להבין שימוש מטפורי של מילות יחס מרחק.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 13.6: Common Expressions ====================
  {
    topicNumber: 13,
    subtopicNumber: '13.6',
    titleEn: 'Common Expressions',
    titleHe: 'ביטויים נפוצים',
    level: 'beginner',
    orderIndex: 6,
    theoryContentHe: `
<h2>ביטויים נפוצים עם מילות יחס של מקום</h2>

<p>ביטויים קבועים שכדאי לשנן.</p>

<div class="rules">
  <h3><strong>ביטויים נפוצים:</strong></h3>
  <ul>
    <li><strong>at the top</strong> (בראש, בפסגה)</li>
    <li><strong>at the bottom</strong> (בתחתית)</li>
    <li><strong>in the middle</strong> (באמצע)</li>
    <li><strong>in the corner</strong> (בפינה - של חדר)</li>
    <li><strong>on the corner</strong> (בפינת הרחוב)</li>
    <li><strong>on the right</strong> (מימין)</li>
    <li><strong>on the left</strong> (משמאל)</li>
    <li><strong>in the center</strong> (במרכז)</li>
    <li><strong>inside</strong> (בפנים)</li>
    <li><strong>outside</strong> (בחוץ)</li>
    <li><strong>upstairs</strong> (למעלה, בקומה העליונה)</li>
    <li><strong>downstairs</strong> (למטה, בקומה התחתונה)</li>
  </ul>
</div>

<div class="examples">
  <h3>דוגמאות:</h3>
  <ul>
    <li>The cat is at the top of the tree. (החתול בראש העץ)</li>
    <li>My name is at the bottom of the list. (השם שלי בתחתית הרשימה)</li>
    <li>Meet me in the middle of the park. (תפגוש אותי באמצע הפארק)</li>
    <li>The chair is in the corner. (הכיסא בפינה)</li>
    <li>Turn right on the corner. (פנה ימינה בפינה)</li>
    <li>My bedroom is upstairs. (חדר השינה שלי למעלה)</li>
  </ul>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'Your office is _____, right? Mine is _____ on the ground floor.',
        options: ['upstairs, downstairs', 'downstairs, upstairs', 'inside, outside', 'outside, inside'],
        correctAnswer: 'upstairs, downstairs',
        explanationHe: 'תשובה נכונה: upstairs, downstairs - המשרד שלך למעלה, נכון? שלי למטה בקומת הקרקע.\nכלל: UPSTAIRS לקומות עליונות, DOWNSTAIRS לקומה תחתונה.\nשים לב: מילים אלו הן תיאורי מיקום ולא זקוקות למילת יחס נוספת.\nטעות נפוצה: להוסיף IN או TO לפני UPSTAIRS/DOWNSTAIRS.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'Put the lamp _____ of the room where it won\'t be in the way.',
        correctAnswer: 'in the corner',
        explanationHe: 'תשובה נכונה: in the corner - שים את המנורה בפינת החדר איפה שהיא לא תפריע.\nכלל: IN THE CORNER לפינת חדר (מקום סגור).\nשים לב: IN the corner (של חדר) שונה מ-ON the corner (של רחוב).\nטעות נפוצה: להשתמש ב-ON the corner לפינת חדר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'The coffee shop is _____ of Main Street and Oak Avenue. Turn _____.',
        options: ['on the corner, on the right', 'in the corner, right', 'at the corner, on the right', 'on the corner, right'],
        correctAnswer: 'on the corner, on the right',
        explanationHe: 'תשובה נכונה: on the corner, on the right - בית הקפה בפינת רחוב מיין ושדרת אוק, פנה ימינה.\nכלל: ON THE CORNER לפינת רחוב, ON THE RIGHT לכיוון ימין.\nשים לב: "on the corner" הוא אמריקאי, "at the corner" בריטי.\nטעות נפוצה: להשתמש ב-IN the corner לרחובות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'My name appears _____ of the list. Yours is _____ , near the end.',
        options: ['at the top, at the bottom', 'at the bottom, at the top', 'in the middle, at the top', 'on top, on bottom'],
        correctAnswer: 'at the top, at the bottom',
        explanationHe: 'תשובה נכונה: at the top, at the bottom - השם שלי מופיע בראש הרשימה, שלך בתחתית, קרוב לסוף.\nכלל: AT THE TOP לראש/פסגה, AT THE BOTTOM לתחתית.\nשים לב: תמיד AT (לא IN או ON) עם TOP/BOTTOM.\nטעות נפוצה: להשתמש ב-ON THE TOP או IN THE BOTTOM.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'Let\'s meet _____ of the park by the fountain.',
        correctAnswer: 'in the middle',
        explanationHe: 'תשובה נכונה: in the middle - בוא ניפגש באמצע הפארק ליד המזרקה.\nכלל: IN THE MIDDLE למרכז/אמצע של מקום.\nשים לב: IN the middle (לא AT או ON).\nטעות נפוצה: להשתמש ב-AT the middle או ON the middle.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'It\'s raining _____. Let\'s stay _____ where it\'s dry.',
        options: ['outside, inside', 'inside, outside', 'upstairs, downstairs', 'on the left, on the right'],
        correctAnswer: 'outside, inside',
        explanationHe: 'תשובה נכונה: outside, inside - יורד גשם בחוץ, בוא נישאר בפנים איפה שיבש.\nכלל: OUTSIDE לחוץ, INSIDE לפנים.\nשים לב: אלו תיאורי מיקום עצמאיים ללא מילת יחס נוספת.\nטעות נפוצה: להוסיף OF אחרי OUTSIDE או INSIDE.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'The living room is _____ and the bedrooms are _____.',
        correctAnswer: 'downstairs, upstairs',
        explanationHe: 'תשובה נכונה: downstairs, upstairs - הסלון למטה וחדרי השינה למעלה.\nכלל: DOWNSTAIRS לקומה תחתונה, UPSTAIRS לקומה עליונה.\nשים לב: סידור טיפוסי של בית - מרחבים משותפים למטה, חדרי שינה למעלה.\nטעות נפוצה: להוסיף TO או IN לפני המילים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'Walk straight and turn _____ at the traffic light. The store is _____ of the street.',
        options: ['on the left, in the middle', 'left, in the middle', 'on the left, in the center', 'left, in the center'],
        correctAnswer: 'on the left, in the middle',
        explanationHe: 'תשובה נכונה: on the left, in the middle - לך ישר ופנה שמאלה ברמזור, החנות באמצע הרחוב.\nכלל: ON THE LEFT/RIGHT לכיוונים, IN THE MIDDLE למיקום מרכזי.\nשים לב: "turn left" או "turn on the left" - שניהם נכונים.\nטעות נפוצה: לבלבל בין IN the middle ל-AT the middle.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'The restaurant is _____. The terrace seating is _____.',
        options: ['inside, outside', 'outside, inside', 'downstairs, upstairs', 'upstairs, downstairs'],
        correctAnswer: 'inside, outside',
        explanationHe: 'תשובה נכונה: inside, outside - המסעדה בפנים, הישיבה במרפסת בחוץ.\nכלל: INSIDE לחלל פנימי, OUTSIDE לחלל חיצוני.\nשים לב: ניגוד בין אוכל פנימי (מוגן) לחיצוני (טרסה).\nטעות נפוצה: להוסיף מילת יחס מיותרת.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'The pharmacy is _____ of Baker Street, next to the café.',
        correctAnswer: 'on the corner',
        explanationHe: 'תשובה נכונה: on the corner - בית המרקחת בפינת רחוב בייקר, ליד בית הקפה.\nכלל: ON THE CORNER לפינת רחוב (אמריקאית).\nשים לב: "at the corner" גם נכון (בריטית), אבל "on" נפוץ יותר באמריקאית.\nטעות נפוצה: להשתמש ב-IN the corner לרחובות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'Your signature should go _____ of the form. The date goes _____.',
        options: ['at the bottom, at the top', 'at the top, at the bottom', 'in the bottom, in the top', 'on the bottom, on the top'],
        correctAnswer: 'at the bottom, at the top',
        explanationHe: 'תשובה נכונה: at the bottom, at the top - החתימה שלך צריכה להיות בתחתית הטופס, התאריך בראש.\nכלל: AT THE BOTTOM לחתימה, AT THE TOP לתאריך.\nשים לב: במסמכים - תאריך למעלה, חתימה למטה.\nטעות נפוצה: להשתמש ב-IN או ON במקום AT.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'Park your car _____ on the street, not _____.',
        correctAnswer: 'on the right, on the left',
        explanationHe: 'תשובה נכונה: on the right, on the left - תחנה את המכונית בצד ימין של הרחוב, לא בשמאל.\nכלל: ON THE RIGHT/LEFT לצדי הרחוב.\nשים לב: "on the right/left side" הוא המלא, אבל "on the right/left" מספיק.\nטעות נפוצה: להשתמש ב-IN the right/left.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'The kids are playing _____. Call them _____ for dinner.',
        options: ['outside, inside', 'inside, outside', 'upstairs, downstairs', 'downstairs, upstairs'],
        correctAnswer: 'outside, inside',
        explanationHe: 'תשובה נכונה: outside, inside - הילדים משחקים בחוץ, תקרא להם פנימה לארוחת ערב.\nכלל: OUTSIDE למשחק חיצוני, INSIDE לכניסה לבית.\nשים לב: תנועה מחוץ (outside) לפנים (inside).\nטעות נפוצה: להוסיף TO או INTO מיותר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'The library is _____ of town. You need to go _____ through Main Street.',
        correctAnswer: 'in the center, straight',
        explanationHe: 'תשובה נכונה: in the center, straight - הספרייה במרכז העיר, אתה צריך ללכת ישר דרך רחוב מיין.\nכלל: IN THE CENTER למיקום מרכזי בעיר.\nשים לב: CENTER ו-MIDDLE דומים אבל CENTER לעיר/אזור גדול.\nטעות נפוצה: להשתמש ב-AT the center במקום IN.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'Stand _____ of the class so everyone can see you. Don\'t hide _____.',
        options: ['at the top, in the corner', 'in the middle, in the corner', 'at the bottom, in the center', 'in the corner, in the middle'],
        correctAnswer: 'at the top, in the corner',
        explanationHe: 'תשובה נכונה: at the top, in the corner - עמוד בחזית הכיתה כדי שכולם יוכלו לראות אותך, אל תתחבא בפינה.\nכלל: AT THE TOP לחזית/ראש, IN THE CORNER לפינה.\nשים לב: "at the top of the class" = בחזית הכיתה.\nטעות נפוצה: להשתמש ב-IN the top.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'The master bedroom is _____. The guest room is _____ next to the kitchen.',
        options: ['upstairs, downstairs', 'downstairs, upstairs', 'inside, outside', 'outside, inside'],
        correctAnswer: 'upstairs, downstairs',
        explanationHe: 'תשובה נכונה: upstairs, downstairs - חדר השינה הראשי למעלה, חדר האורחים למטה ליד המטבח.\nכלל: UPSTAIRS לחדר ראשי (פרטיות), DOWNSTAIRS לחדר אורחים (נגישות).\nשים לב: חלוקה טיפוסית - חדרים פרטיים למעלה, משותפים למטה.\nטעות נפוצה: להוסיף IN לפני המילים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'You\'ll find the information _____ of page 45, not _____.',
        correctAnswer: 'at the bottom, at the top',
        explanationHe: 'תשובה נכונה: at the bottom, at the top - תמצא את המידע בתחתית עמוד 45, לא בראש.\nכלל: AT THE BOTTOM לתחתית עמוד, AT THE TOP לראש עמוד.\nשים לב: מיקום מידע בעמוד - למעלה או למטה.\nטעות נפוצה: להשתמש ב-IN או ON במקום AT.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'The stairs are _____. The elevator is _____ to your left.',
        options: ['on the right, on the left', 'on the left, on the right', 'inside, outside', 'upstairs, downstairs'],
        correctAnswer: 'on the right, on the left',
        explanationHe: 'תשובה נכונה: on the right, on the left - המדרגות בצד ימין, המעלית בצד שמאל שלך.\nכלל: ON THE RIGHT/LEFT לכיוונים יחסיים.\nשים לב: "to your left/right" מוסיף הדגשה אישית.\nטעות נפוצה: להשתמש ב-IN או AT במקום ON.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: 'Put the desk _____ where there\'s more space. The chair can stay _____.',
        correctAnswer: 'in the corner, in the middle',
        explanationHe: 'תשובה נכונה: in the corner, in the middle - שים את השולחן בפינה איפה שיש יותר מקום, הכיסא יכול להישאר באמצע.\nכלל: IN THE CORNER למיקום בפינה, IN THE MIDDLE למיקום מרכזי.\nשים לב: ארגון ריהוט - פינה לחיסכון במקום, אמצע לנגישות.\nטעות נפוצה: להשתמש ב-AT the corner לחדר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'The basement is _____. The attic is _____, under the roof.',
        options: ['downstairs, upstairs', 'upstairs, downstairs', 'inside, outside', 'outside, inside'],
        correctAnswer: 'downstairs, upstairs',
        explanationHe: 'תשובה נכונה: downstairs, upstairs - המרתף למטה, העליית הגג למעלה, מתחת לגג.\nכלל: DOWNSTAIRS למרתף (קומה תחתונה), UPSTAIRS לעליית גג (קומה עליונה).\nשים לב: שתי הקצוות של בית - המרתף בתחתית, עליית הגג בראש.\nטעות נפוצה: לבלבל בין המיקומים של מרתף ועליית גג.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 13.7: Common Mistakes ====================
  {
    topicNumber: 13,
    subtopicNumber: '13.7',
    titleEn: 'Common Mistakes',
    titleHe: 'טעויות נפוצות',
    level: 'beginner',
    orderIndex: 7,
    theoryContentHe: `
<h2>טעויות נפוצות במילות יחס של מקום</h2>

<p>טעויות שתלמידים עושים לעתים קרובות.</p>

<div class="mistakes">
  <h3><strong>טעויות נפוצות:</strong></h3>

  <p>❌ <strong>שגוי:</strong> The book is in the table.<br>
  ✅ <strong>נכון:</strong> The book is <strong>on</strong> the table.</p>
  <p class="explanation">ספר נמצא על גבי השולחן, לא בתוכו</p>

  <p>❌ <strong>שגוי:</strong> I live at Tel Aviv.<br>
  ✅ <strong>נכון:</strong> I live <strong>in</strong> Tel Aviv.</p>
  <p class="explanation">ערים משתמשים עם in, לא at</p>

  <p>❌ <strong>שגוי:</strong> He sits in the chair.<br>
  ✅ <strong>נכון:</strong> He sits <strong>on</strong> the chair.</p>
  <p class="explanation">יושבים על כיסא, לא בתוכו</p>

  <p>❌ <strong>שגוי:</strong> The picture is in the wall.<br>
  ✅ <strong>נכון:</strong> The picture is <strong>on</strong> the wall.</p>
  <p class="explanation">תמונה תלויה על הקיר</p>

  <p>❌ <strong>שגוי:</strong> I am at the home.<br>
  ✅ <strong>נכון:</strong> I am <strong>at home</strong>.</p>
  <p class="explanation">at home הוא ביטוי קבוע ללא "the"</p>

  <p>❌ <strong>שגוי:</strong> Between three people.<br>
  ✅ <strong>נכון:</strong> <strong>Among</strong> three people.</p>
  <p class="explanation">בין שלושה או יותר = among</p>

  <p>❌ <strong>שגוי:</strong> The cat is under of the bed.<br>
  ✅ <strong>נכון:</strong> The cat is <strong>under</strong> the bed.</p>
  <p class="explanation">אין צורך ב-of אחרי under</p>

  <p>❌ <strong>שגוי:</strong> In front the house.<br>
  ✅ <strong>נכון:</strong> In front <strong>of</strong> the house.</p>
  <p class="explanation">תמיד in front OF (עם of)</p>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'מה לא בסדר? "The keys are in my bag."',
        options: ['צריך on במקום in', 'צריך at במקום in', 'המשפט נכון', 'צריך under במקום in'],
        correctAnswer: 'המשפט נכון',
        explanationHe: 'תשובה נכונה: המשפט נכון - המפתחות בתוך התיק.\nכלל: IN משמש למיכלים וחללים סגורים כמו תיק.\nשים לב: תיק הוא מיכל סגור, לכן IN הוא הנכון.\nטעות נפוצה: לחשוב שצריך ON כי התיק הוא משטח.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'תקן את הטעות: "She sits in the chair."',
        options: ['She sits on the chair.', 'She sits at the chair.', 'She sits under the chair.', 'אין טעות'],
        correctAnswer: 'She sits on the chair.',
        explanationHe: 'תשובה נכונה: She sits on the chair - היא יושבת על הכיסא.\nכלל: יושבים ON כיסא (על משטח), לא IN (בתוך).\nשים לב: רק כורסאות עמוקות משתמשות ב-IN (in an armchair).\nטעות נפוצה: להשתמש ב-IN לכל סוגי הכיסאות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "I\'m traveling in the bus." → I\'m traveling _____ the bus.',
        correctAnswer: 'on',
        explanationHe: 'תשובה נכונה: on - אני נוסע באוטובוס.\nכלל: תחבורה ציבורית גדולה (bus, train, plane) = ON, לא IN.\nשים לב: אוטובוס הוא תחבורה גדולה, לכן ON.\nטעות נפוצה: להשתמש ב-IN כי חושבים על פנים האוטובוס.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'מה לא נכון? "The picture is in the wall."',
        options: ['צריך on במקום in', 'צריך at במקום in', 'המשפט נכון', 'צריך above במקום in'],
        correctAnswer: 'צריך on במקום in',
        explanationHe: 'תשובה נכונה: צריך on במקום in - התמונה על הקיר.\nכלל: תמונות תלויות ON קיר (משטח), לא IN (בתוך).\nשים לב: ON לכל מה שמחובר למשטח הקיר.\nטעות נפוצה: להשתמש ב-IN כי חושבים שהתמונה "בתוך" החדר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'תקן: "I work at a hospital in London."',
        options: ['I work in a hospital in London.', 'I work on a hospital in London.', 'אין טעות', 'I work under a hospital in London.'],
        correctAnswer: 'I work in a hospital in London.',
        explanationHe: 'תשובה נכונה: I work in a hospital - אני עובד בבית חולים.\nכלל: IN למבנים/מקומות עבודה גדולים, AT למקומות ספציפיים/נקודות.\nשים לב: בית חולים הוא מבנה גדול = IN.\nטעות נפוצה: להשתמש ב-AT לכל מקומות עבודה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "He is at the home now." → He is _____ now.',
        correctAnswer: 'at home',
        explanationHe: 'תשובה נכונה: at home - הוא בבית עכשיו.\nכלל: "at home" הוא ביטוי קבוע ללא "the".\nשים לב: תמיד AT HOME בלי הכהנה.\nטעות נפוצה: להוסיף "the" לפני HOME.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'מה לא בסדר? "The meeting is between the three managers."',
        options: ['צריך among במקום between', 'צריך beside במקום between', 'המשפט נכון', 'צריך next to במקום between'],
        correctAnswer: 'צריך among במקום between',
        explanationHe: 'תשובה נכונה: צריך among - הפגישה בין שלושת המנהלים.\nכלל: BETWEEN לשניים, AMONG לשלושה או יותר.\nשים לב: שלושה מנהלים = AMONG, לא BETWEEN.\nטעות נפוצה: להשתמש ב-BETWEEN לכל מספר של אנשים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'תקן: "The cat is under of the bed."',
        options: ['The cat is under the bed.', 'The cat is below the bed.', 'אין טעות', 'The cat is beneath of the bed.'],
        correctAnswer: 'The cat is under the bed.',
        explanationHe: 'תשובה נכונה: The cat is under the bed - החתול מתחת למיטה.\nכלל: UNDER לא זקוק ל-OF אחריו.\nשים לב: OF מיותר - UNDER הוא מילת יחס שלמה.\nטעות נפוצה: להוסיף OF אחרי UNDER כמו ב-IN FRONT OF.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "The store is in front the bank." → The store is _____ the bank.',
        correctAnswer: 'in front of',
        explanationHe: 'תשובה נכונה: in front of - החנות מול הבנק.\nכלל: תמיד IN FRONT OF (עם OF), לא IN FRONT.\nשים לב: OF הוא חלק מההלהביטוי הקבוע.\nטעות נפוצה: לשכוח את ה-OF אחרי FRONT.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'מה לא נכון? "The temperature is under zero."',
        options: ['צריך below במקום under', 'צריך above במקום under', 'המשפט נכון', 'צריך over במקום under'],
        correctAnswer: 'צריך below במקום under',
        explanationHe: 'תשובה נכונה: צריך below - הטמפרטורה מתחת לאפס.\nכלל: טמפרטורה תמיד עם BELOW/ABOVE, לא UNDER/OVER.\nשים לב: "below zero" הוא ביטוי קבוע לטמפרטורה שלילית.\nטעות נפוצה: להשתמש ב-UNDER zero במקום BELOW.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'תקן: "I arrived at New York yesterday."',
        options: ['I arrived in New York yesterday.', 'I arrived on New York yesterday.', 'אין טעות', 'I arrived to New York yesterday.'],
        correctAnswer: 'I arrived in New York yesterday.',
        explanationHe: 'תשובה נכונה: I arrived in New York - הגעתי לניו יורק.\nכלל: ערים ומדינות עם IN, לא AT.\nשים לב: AT למקומות ספציפיים קטנים, IN לערים ואזורים.\nטעות נפוצה: להשתמש ב-AT לערים גדולות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "She\'s waiting in the bus stop." → She\'s waiting _____ the bus stop.',
        correctAnswer: 'at',
        explanationHe: 'תשובה נכונה: at - היא מחכה בתחנת האוטובוס.\nכלל: תחנות הן נקודות ספציפיות = AT, לא IN.\nשים לב: AT משמש לנקודות מפגש ותחנות.\nטעות נפוצה: להשתמש ב-IN כי חושבים על תחנה כמקום סגור.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'מה לא בסדר? "The lamp is hanging over the table."',
        options: ['צריך above במקום over', 'צריך on במקום over', 'המשפט נכון', 'צריך under במקום over'],
        correctAnswer: 'המשפט נכון',
        explanationHe: 'תשובה נכונה: המשפט נכון - המנורה תלויה מעל השולחן.\nכלל: OVER נכון למנורה תלויה כי יש כיסוי/מעבר ישיר.\nשים לב: OVER ו-ABOVE שניהם יכולים להיות נכונים כאן.\nטעות נפוצה: לחשוב שרק ABOVE נכון למנורה תלויה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'multiple_choice',
        questionTextHe: 'תקן: "Meet me at the corner of the room."',
        options: ['Meet me in the corner of the room.', 'Meet me on the corner of the room.', 'אין טעות', 'Meet me beside the corner of the room.'],
        correctAnswer: 'Meet me in the corner of the room.',
        explanationHe: 'תשובה נכונה: in the corner - תפגוש אותי בפינת החדר.\nכלל: IN the corner לחדרים, ON/AT the corner לרחובות.\nשים לב: פינת חדר = IN, פינת רחוב = ON/AT.\nטעות נפוצה: להשתמש ב-AT the corner גם לחדרים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "The plane is flying under the clouds." → The plane is flying _____ the clouds.',
        correctAnswer: 'above',
        explanationHe: 'תשובה נכונה: above - המטוס טס מעל העננים.\nכלל: ABOVE לגובה יחסי בשמיים, UNDER רק למשהו ישירות מתחת.\nשים לב: מטוס מעל עננים = ABOVE או OVER, לא UNDER.\nטעות נפוצה: לבלבל בין מעל למתחת.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'מה לא נכון? "He lives beside his parents."',
        options: ['צריך near במקום beside', 'צריך between במקום beside', 'המשפט נכון', 'צריך among במקום beside'],
        correctAnswer: 'המשפט נכון',
        explanationHe: 'תשובה נכונה: המשפט נכון - הוא גר ליד ההורים שלו.\nכלל: BESIDE/NEXT TO נכונים לקרבה פיזית.\nשים לב: BESIDE הוא מילת יחס תקינה לקרבה.\nטעות נפוצה: לחשוב ש-BESIDE הוא רק לאנשים שיושבים זה ליד זה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'תקן: "She put the book in the shelf."',
        options: ['She put the book on the shelf.', 'She put the book at the shelf.', 'אין טעות', 'She put the book under the shelf.'],
        correctAnswer: 'She put the book on the shelf.',
        explanationHe: 'תשובה נכונה: on the shelf - היא שמה את הספר על המדף.\nכלל: מדפים הם משטחים = ON, לא IN.\nשים לב: ON למדפים פתוחים, IN רק לארונות סגורים.\nטעות נפוצה: להשתמש ב-IN כי חושבים על הספרייה כמקום סגור.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "The restaurant is in the corner of Main Street." → The restaurant is _____ Main Street.',
        correctAnswer: 'on the corner of',
        explanationHe: 'תשובה נכונה: on the corner of - המסעדה בפינת רחוב מיין.\nכלל: ON/AT the corner לרחובות, IN the corner לחדרים.\nשים לב: רחובות = ON/AT, חדרים = IN.\nטעות נפוצה: להשתמש ב-IN the corner לפינות רחוב.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'מה לא בסדר? "She arrived to the airport early."',
        options: ['צריך at במקום to', 'צריך in במקום to', 'המשפט נכון', 'צריך on במקום to'],
        correctAnswer: 'צריך at במקום to',
        explanationHe: 'תשובה נכונה: צריך at - היא הגיעה לשדה התעופה מוקדם.\nכלל: ARRIVE AT למקומות ספציפיים, ARRIVE IN לערים/מדינות.\nשים לב: שדה תעופה הוא מקום ספציפי = AT.\nטעות נפוצה: להשתמש ב-TO אחרי ARRIVE.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'תקן: "The kids are playing at the street."',
        options: ['The kids are playing in the street.', 'The kids are playing on the street.', 'שתי התשובות 1 ו-2 נכונות', 'אין טעות'],
        correctAnswer: 'שתי התשובות 1 ו-2 נכונות',
        explanationHe: 'תשובה נכונה: שתי התשובות נכונות - הילדים משחקים ברחוב.\nכלל: IN the street (בריטית) ו-ON the street (אמריקאית) שתיהן נכונות.\nשים לב: AT לא נכון - AT משמש לנקודות ספציפיות, לא לרחובות.\nטעות נפוצה: להשתמש ב-AT the street.',
        difficulty: 'hard'
      }
    ]
  }
];

async function seedTopic13() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    console.log('Starting Topic 13 seeding...');

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
    console.log('✅ Topic 13: Prepositions of Place seeded successfully!');
    console.log(`📊 Total: ${lessonsData.length} lessons with ${lessonsData.reduce((sum, l) => sum + l.exercises.length, 0)} exercises`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding Topic 13:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  seedTopic13()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { lessonsData, seedTopic13 };
