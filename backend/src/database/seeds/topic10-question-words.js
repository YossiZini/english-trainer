const { pool } = require('../../config/database');
const Lesson = require('../../models/Lesson');
const Exercise = require('../../models/Exercise');

// Topic 10: Question Words & Question Formation (מילות שאלה ויצירת שאלות)
const lessonsData = [
  // ==================== SUBTOPIC 10.1: Question Words Overview ====================
  {
    topicNumber: 10,
    subtopicNumber: '10.1',
    titleEn: 'Question Words Overview',
    titleHe: 'סקירת מילות השאלה',
    level: 'beginner',
    orderIndex: 1,
    theoryContentHe: `
<h2>מילות שאלה באנגלית</h2>

<p>מילות שאלה (Question Words או Wh-words) משמשות ליצירת שאלות פתוחות - שאלות שהתשובה עליהן היא לא רק "כן" או "לא".</p>

<div class="rules">
  <h3>מילות השאלה העיקריות:</h3>
  <ul>
    <li><strong>What</strong> - מה</li>
    <li><strong>Where</strong> - איפה / לאן</li>
    <li><strong>When</strong> - מתי</li>
    <li><strong>Who</strong> - מי</li>
    <li><strong>Why</strong> - למה / מדוע</li>
    <li><strong>How</strong> - איך / כיצד</li>
    <li><strong>Which</strong> - איזה / אילו</li>
  </ul>
</div>

<div class="examples">
  <h3>דוגמאות:</h3>
  <p><strong>What</strong> is your name?</p>
  <p>מה שמך?</p>

  <p><strong>Where</strong> do you live?</p>
  <p>איפה אתה גר?</p>

  <p><strong>When</strong> is your birthday?</p>
  <p>מתי יום ההולדת שלך?</p>

  <p><strong>Who</strong> is your teacher?</p>
  <p>מי המורה שלך?</p>

  <p><strong>Why</strong> are you late?</p>
  <p>למה איחרת?</p>

  <p><strong>How</strong> are you?</p>
  <p>מה שלומך? (איך אתה?)</p>

  <p><strong>Which</strong> color do you like?</p>
  <p>איזה צבע אתה אוהב?</p>
</div>

<div class="rules">
  <h3>מבנה בסיסי:</h3>
  <p><strong>Question Word + Auxiliary Verb + Subject + Main Verb?</strong></p>
  <p>מילת שאלה + פועל עזר + נושא + פועל עיקרי?</p>
</div>

<div class="warning">
  <strong>זכור:</strong> מילות שאלה תמיד באות בתחילת המשפט!
</div>
    `,
    exercises: [
      // Easy exercises (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'מה המשמעות של "What"?',
        options: ['איפה', 'מה', 'מתי', 'מי'],
        correctAnswer: 'מה',
        explanationHe: 'תשובה נכונה: מה. What משמש לשאול על דברים או מידע.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'מה המשמעות של "Where"?',
        options: ['מה', 'מתי', 'איפה', 'למה'],
        correctAnswer: 'איפה',
        explanationHe: 'תשובה נכונה: איפה. Where משמש לשאול על מקום.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: '_______ is your name? (מה)',
        correctAnswer: 'What',
        explanationHe: 'תשובה נכונה: What. שואלים "מה שמך?" עם What.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'מה המשמעות של "Who"?',
        options: ['איך', 'מי', 'למה', 'מתי'],
        correctAnswer: 'מי',
        explanationHe: 'תשובה נכונה: מי. Who משמש לשאול על אנשים.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: '_______ do you live? (איפה)',
        correctAnswer: 'Where',
        explanationHe: 'תשובה נכונה: Where. שואלים על מקום מגורים עם Where.',
        difficulty: 'easy'
      },
      // Medium exercises (6-12)
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'מה המשמעות של "When"?',
        options: ['איפה', 'מי', 'מתי', 'איך'],
        correctAnswer: 'מתי',
        explanationHe: 'תשובה נכונה: מתי. When משמש לשאול על זמן.',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: '_______ are you late? (למה)',
        correctAnswer: 'Why',
        explanationHe: 'תשובה נכונה: Why. שואלים על סיבה עם Why.',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'מה המשמעות של "How"?',
        options: ['מה', 'איך', 'מי', 'איפה'],
        correctAnswer: 'איך',
        explanationHe: 'תשובה נכונה: איך. How משמש לשאול על אופן או מצב.',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: '_______ is your teacher? (מי)',
        correctAnswer: 'Who',
        explanationHe: 'תשובה נכונה: Who. שואלים על אדם עם Who.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'מה המשמעות של "Which"?',
        options: ['למה', 'מתי', 'איזה', 'איפה'],
        correctAnswer: 'איזה',
        explanationHe: 'תשובה נכונה: איזה. Which משמש לבחירה בין אפשרויות.',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'fill_in_blank',
        questionTextHe: '_______ is your birthday? (מתי)',
        correctAnswer: 'When',
        explanationHe: 'תשובה נכונה: When. שואלים על תאריך/זמן עם When.',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: 'באיזו מילת שאלה משתמשים לשאול על סיבה?',
        options: ['What', 'Where', 'Why', 'How'],
        correctAnswer: 'Why',
        explanationHe: 'תשובה נכונה: Why. Why משמש לשאול "למה?" או "מדוע?".',
        difficulty: 'medium'
      },
      // Hard exercises (13-20)
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: '_______ book do you want - the red one or the blue one?',
        options: ['What', 'Which', 'Who', 'Where'],
        correctAnswer: 'Which',
        explanationHe: 'תשובה נכונה: Which. משתמשים ב-Which כשיש בחירה מוגדרת בין אפשרויות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: '_______ do you go to school? By bus or on foot?',
        correctAnswer: 'How',
        explanationHe: 'תשובה נכונה: How. שואלים על אופן הגעה עם How.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'מה ההבדל בין What לבין Which?',
        options: ['אין הבדל', 'What לזמן, Which למקום', 'Which לבחירה מוגדרת, What לשאלה כללית', 'What לאנשים, Which לדברים'],
        correctAnswer: 'Which לבחירה מוגדרת, What לשאלה כללית',
        explanationHe: 'תשובה נכונה: Which לבחירה מוגדרת, What לשאלה כללית. Which משמש כשיש אפשרויות ידועות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: '_______ called you last night?',
        correctAnswer: 'Who',
        explanationHe: 'תשובה נכונה: Who. שואלים מי התקשר עם Who.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'איפה צריכה להיות מילת השאלה במשפט?',
        options: ['באמצע המשפט', 'בסוף המשפט', 'בתחילת המשפט', 'בכל מקום'],
        correctAnswer: 'בתחילת המשפט',
        explanationHe: 'תשובה נכונה: בתחילת המשפט. מילות שאלה תמיד באות ראשונות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: '_______ color is your car? (איזה)',
        correctAnswer: 'What',
        explanationHe: 'תשובה נכונה: What. כששואלים על צבע באופן כללי משתמשים ב-What color.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'השלם: "_______ is the capital of Israel?"',
        options: ['Where', 'What', 'When', 'Who'],
        correctAnswer: 'What',
        explanationHe: 'תשובה נכונה: What. שואלים "מה בירת ישראל?" עם What.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: '_______ did you learn English? At school or at home?',
        correctAnswer: 'Where',
        explanationHe: 'תשובה נכונה: Where. שואלים על מקום הלמידה עם Where.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 10.2: What Questions ====================
  {
    topicNumber: 10,
    subtopicNumber: '10.2',
    titleEn: 'What Questions',
    titleHe: 'שאלות עם What',
    level: 'beginner',
    orderIndex: 2,
    theoryContentHe: `
<h2>שאלות עם What</h2>

<p>מילת השאלה <strong>What</strong> (מה) היא אחת הנפוצות ביותר באנגלית. היא משמשת לשאול על דברים, מידע, פעולות ועוד.</p>

<div class="rules">
  <h3>שימושים עיקריים של What:</h3>
  <ul>
    <li>שאלה על דברים או מידע כללי</li>
    <li>שאלה על מקצוע או עיסוק</li>
    <li>שאלה על פעולות</li>
    <li>בצירופים כמו What time, What color, What kind</li>
  </ul>
</div>

<div class="examples">
  <h3>דוגמאות - מידע כללי:</h3>
  <p><strong>What</strong> is your name?</p>
  <p>מה שמך?</p>

  <p><strong>What</strong> is your phone number?</p>
  <p>מה מספר הטלפון שלך?</p>

  <p><strong>What</strong> is this?</p>
  <p>מה זה?</p>
</div>

<div class="examples">
  <h3>דוגמאות - מקצוע ועיסוק:</h3>
  <p><strong>What</strong> do you do?</p>
  <p>מה אתה עושה? (מה המקצוע שלך?)</p>

  <p><strong>What</strong> does she do?</p>
  <p>מה היא עושה? (מה המקצוע שלה?)</p>
</div>

<div class="examples">
  <h3>דוגמאות - פעולות:</h3>
  <p><strong>What</strong> are you doing?</p>
  <p>מה אתה עושה (עכשיו)?</p>

  <p><strong>What</strong> did you eat?</p>
  <p>מה אכלת?</p>

  <p><strong>What</strong> will you do tomorrow?</p>
  <p>מה תעשה מחר?</p>
</div>

<div class="examples">
  <h3>צירופים עם What:</h3>
  <p><strong>What time</strong> is it?</p>
  <p>מה השעה?</p>

  <p><strong>What color</strong> is your bag?</p>
  <p>באיזה צבע התיק שלך?</p>

  <p><strong>What kind of</strong> music do you like?</p>
  <p>איזה סוג מוזיקה אתה אוהב?</p>
</div>

<div class="warning">
  <strong>שימו לב:</strong> "What do you do?" שואל על מקצוע, אבל "What are you doing?" שואל על פעולה נוכחית!
</div>
    `,
    exercises: [
      // Easy exercises (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: '_______ is your name?',
        options: ['What', 'Where', 'When', 'Who'],
        correctAnswer: 'What',
        explanationHe: 'תשובה נכונה: What. שואלים "מה שמך?" עם What.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: '_______ is this? (מה)',
        correctAnswer: 'What',
        explanationHe: 'תשובה נכונה: What. "מה זה?" - What is this?',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: '_______ do you do?',
        options: ['What', 'Where', 'Who', 'When'],
        correctAnswer: 'What',
        explanationHe: 'תשובה נכונה: What. שאלה על מקצוע - "מה אתה עושה (בחיים)?".',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: '_______ time is it?',
        correctAnswer: 'What',
        explanationHe: 'תשובה נכונה: What. "מה השעה?" - What time is it?',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: '_______ is your favorite color?',
        options: ['What', 'Where', 'Who', 'How'],
        correctAnswer: 'What',
        explanationHe: 'תשובה נכונה: What. שואלים על צבע אהוב עם What.',
        difficulty: 'easy'
      },
      // Medium exercises (6-12)
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'מה ההבדל בין "What do you do?" לבין "What are you doing?"',
        options: ['אין הבדל', 'הראשון על מקצוע, השני על פעולה נוכחית', 'הראשון על עבר, השני על הווה', 'הראשון פורמלי, השני לא פורמלי'],
        correctAnswer: 'הראשון על מקצוע, השני על פעולה נוכחית',
        explanationHe: 'תשובה נכונה: What do you do שואל על מקצוע, What are you doing שואל מה עושים כרגע.',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: '_______ are you doing right now?',
        correctAnswer: 'What',
        explanationHe: 'תשובה נכונה: What. שואלים על פעולה נוכחית.',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: '_______ did you eat for breakfast?',
        options: ['What', 'Where', 'Who', 'Why'],
        correctAnswer: 'What',
        explanationHe: 'תשובה נכונה: What. שואלים מה אכלת עם What.',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: '_______ kind of music do you like?',
        correctAnswer: 'What',
        explanationHe: 'תשובה נכונה: What. "איזה סוג מוזיקה?" - What kind of.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: '_______ does she do? - She is a doctor.',
        options: ['What', 'Where', 'Who', 'How'],
        correctAnswer: 'What',
        explanationHe: 'תשובה נכונה: What. שאלה על מקצוע - התשובה היא שהיא רופאה.',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'fill_in_blank',
        questionTextHe: '_______ is your phone number?',
        correctAnswer: 'What',
        explanationHe: 'תשובה נכונה: What. שואלים על מספר טלפון עם What.',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: '_______ will you do tomorrow?',
        options: ['What', 'Where', 'When', 'Who'],
        correctAnswer: 'What',
        explanationHe: 'תשובה נכונה: What. שואלים על תוכניות - מה תעשה מחר.',
        difficulty: 'medium'
      },
      // Hard exercises (13-20)
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: '_______ happened yesterday?',
        options: ['What', 'Where', 'Why', 'Who'],
        correctAnswer: 'What',
        explanationHe: 'תשובה נכונה: What. שואלים מה קרה עם What.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: '_______ does this word mean?',
        correctAnswer: 'What',
        explanationHe: 'תשובה נכונה: What. שואלים על משמעות עם What.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: '_______ is the weather like today?',
        options: ['What', 'How', 'Where', 'When'],
        correctAnswer: 'What',
        explanationHe: 'תשובה נכונה: What. "מה מזג האוויר?" - What is the weather like?',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: '_______ size shoes do you wear?',
        correctAnswer: 'What',
        explanationHe: 'תשובה נכונה: What. שואלים על מידה עם What size.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: '_______ makes you happy?',
        options: ['What', 'Who', 'Where', 'When'],
        correctAnswer: 'What',
        explanationHe: 'תשובה נכונה: What. שואלים מה משמח אותך עם What.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: '_______ languages can you speak?',
        correctAnswer: 'What',
        explanationHe: 'תשובה נכונה: What. שואלים אילו שפות אתה יודע עם What.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'תרגם: "מה אתה חושב?"',
        options: ['What do you think?', 'Where do you think?', 'How do you think?', 'Who do you think?'],
        correctAnswer: 'What do you think?',
        explanationHe: 'תשובה נכונה: What do you think? שואלים על דעה עם What.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: '_______ is wrong with you?',
        correctAnswer: 'What',
        explanationHe: 'תשובה נכונה: What. "מה לא בסדר?" - What is wrong?',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 10.3: Where, When, Who Questions ====================
  {
    topicNumber: 10,
    subtopicNumber: '10.3',
    titleEn: 'Where, When, Who Questions',
    titleHe: 'שאלות עם Where, When, Who',
    level: 'beginner',
    orderIndex: 3,
    theoryContentHe: `
<h2>שאלות עם Where, When, Who</h2>

<p>שלוש מילות שאלה חשובות: Where (איפה), When (מתי), Who (מי).</p>

<div class="rules">
  <h3>Where - איפה / לאן</h3>
  <p>משמש לשאול על מקום</p>
</div>

<div class="examples">
  <h3>דוגמאות - Where:</h3>
  <p><strong>Where</strong> do you live?</p>
  <p>איפה אתה גר?</p>

  <p><strong>Where</strong> is the bank?</p>
  <p>איפה הבנק?</p>

  <p><strong>Where</strong> are you going?</p>
  <p>לאן אתה הולך?</p>

  <p><strong>Where</strong> did you buy this?</p>
  <p>איפה קנית את זה?</p>
</div>

<div class="rules">
  <h3>When - מתי</h3>
  <p>משמש לשאול על זמן</p>
</div>

<div class="examples">
  <h3>דוגמאות - When:</h3>
  <p><strong>When</strong> is your birthday?</p>
  <p>מתי יום ההולדת שלך?</p>

  <p><strong>When</strong> do you wake up?</p>
  <p>מתי אתה קם?</p>

  <p><strong>When</strong> did you arrive?</p>
  <p>מתי הגעת?</p>

  <p><strong>When</strong> will the meeting start?</p>
  <p>מתי הפגישה תתחיל?</p>
</div>

<div class="rules">
  <h3>Who - מי</h3>
  <p>משמש לשאול על אנשים</p>
</div>

<div class="examples">
  <h3>דוגמאות - Who:</h3>
  <p><strong>Who</strong> is your best friend?</p>
  <p>מי החבר הכי טוב שלך?</p>

  <p><strong>Who</strong> called you?</p>
  <p>מי התקשר אליך?</p>

  <p><strong>Who</strong> are you talking to?</p>
  <p>עם מי אתה מדבר?</p>

  <p><strong>Who</strong> won the game?</p>
  <p>מי ניצח במשחק?</p>
</div>

<div class="warning">
  <strong>שימו לב:</strong> כש-Who הוא הנושא של המשפט, לא צריך פועל עזר!
  <p>Who called you? (ולא: Who did call you?)</p>
</div>
    `,
    exercises: [
      // Easy exercises (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: '_______ do you live?',
        options: ['Where', 'When', 'Who', 'What'],
        correctAnswer: 'Where',
        explanationHe: 'תשובה נכונה: Where. שואלים על מקום מגורים עם Where.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: '_______ is your birthday? (מתי)',
        correctAnswer: 'When',
        explanationHe: 'תשובה נכונה: When. שואלים על תאריך עם When.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: '_______ is your teacher?',
        options: ['Who', 'What', 'Where', 'When'],
        correctAnswer: 'Who',
        explanationHe: 'תשובה נכונה: Who. שואלים על אדם עם Who.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: '_______ is the bank? (איפה)',
        correctAnswer: 'Where',
        explanationHe: 'תשובה נכונה: Where. שואלים על מיקום עם Where.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: '_______ do you wake up?',
        options: ['When', 'Where', 'Who', 'What'],
        correctAnswer: 'When',
        explanationHe: 'תשובה נכונה: When. שואלים על זמן ההשכמה עם When.',
        difficulty: 'easy'
      },
      // Medium exercises (6-12)
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: '_______ called you last night?',
        correctAnswer: 'Who',
        explanationHe: 'תשובה נכונה: Who. שואלים מי התקשר עם Who.',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: '_______ are you going?',
        options: ['Where', 'When', 'Who', 'What'],
        correctAnswer: 'Where',
        explanationHe: 'תשובה נכונה: Where. שואלים לאן הולכים עם Where.',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: '_______ did you arrive?',
        correctAnswer: 'When',
        explanationHe: 'תשובה נכונה: When. שואלים על זמן ההגעה עם When.',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: '_______ is your best friend?',
        options: ['Who', 'What', 'Where', 'When'],
        correctAnswer: 'Who',
        explanationHe: 'תשובה נכונה: Who. שואלים על אדם עם Who.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: '_______ did you buy this shirt?',
        correctAnswer: 'Where',
        explanationHe: 'תשובה נכונה: Where. שואלים איפה קנית עם Where.',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: '_______ will the party start?',
        options: ['When', 'Where', 'Who', 'What'],
        correctAnswer: 'When',
        explanationHe: 'תשובה נכונה: When. שואלים על זמן תחילת המסיבה.',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: '_______ are you talking to?',
        correctAnswer: 'Who',
        explanationHe: 'תשובה נכונה: Who. שואלים עם מי מדברים.',
        difficulty: 'medium'
      },
      // Hard exercises (13-20)
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: '_______ won the game?',
        options: ['Who', 'What', 'Where', 'When'],
        correctAnswer: 'Who',
        explanationHe: 'תשובה נכונה: Who. שואלים מי ניצח עם Who.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: '_______ were you born?',
        correctAnswer: 'Where',
        explanationHe: 'תשובה נכונה: Where. שואלים על מקום הלידה עם Where.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'למה בשאלה "Who called you?" אין פועל עזר?',
        options: ['זו טעות', 'כי Who הוא הנושא', 'כי זה עבר', 'כי זו שאלה קצרה'],
        correctAnswer: 'כי Who הוא הנושא',
        explanationHe: 'תשובה נכונה: כי Who הוא הנושא. כש-Who הוא הנושא, לא צריך פועל עזר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: '_______ is the meeting? - In room 5.',
        correctAnswer: 'Where',
        explanationHe: 'תשובה נכונה: Where. התשובה היא מקום (חדר 5).',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: '_______ did Shakespeare live?',
        options: ['When', 'Where', 'Who', 'What'],
        correctAnswer: 'When',
        explanationHe: 'תשובה נכונה: When. שואלים מתי שייקספיר חי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: '_______ taught you English?',
        correctAnswer: 'Who',
        explanationHe: 'תשובה נכונה: Who. שואלים מי לימד אותך.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'תרגם: "מתי הטיסה?"',
        options: ['What is the flight?', 'Where is the flight?', 'When is the flight?', 'Who is the flight?'],
        correctAnswer: 'When is the flight?',
        explanationHe: 'תשובה נכונה: When is the flight? שואלים על זמן הטיסה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: '_______ do you usually have lunch? - At 1 PM.',
        correctAnswer: 'When',
        explanationHe: 'תשובה נכונה: When. התשובה היא זמן (בשעה 1).',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 10.4: Why and How Questions ====================
  {
    topicNumber: 10,
    subtopicNumber: '10.4',
    titleEn: 'Why and How Questions',
    titleHe: 'שאלות עם Why ו-How',
    level: 'beginner',
    orderIndex: 4,
    theoryContentHe: `
<h2>שאלות עם Why ו-How</h2>

<p>שתי מילות שאלה חשובות: Why (למה) ו-How (איך).</p>

<div class="rules">
  <h3>Why - למה / מדוע</h3>
  <p>משמש לשאול על סיבות</p>
</div>

<div class="examples">
  <h3>דוגמאות - Why:</h3>
  <p><strong>Why</strong> are you late?</p>
  <p>למה איחרת?</p>

  <p><strong>Why</strong> did you leave?</p>
  <p>למה עזבת?</p>

  <p><strong>Why</strong> do you like pizza?</p>
  <p>למה אתה אוהב פיצה?</p>

  <p><strong>Why</strong> is the sky blue?</p>
  <p>למה השמיים כחולים?</p>
</div>

<div class="rules">
  <h3>How - איך / כיצד</h3>
  <p>משמש לשאול על אופן או מצב</p>
</div>

<div class="examples">
  <h3>דוגמאות - How:</h3>
  <p><strong>How</strong> are you?</p>
  <p>מה שלומך?</p>

  <p><strong>How</strong> do you spell your name?</p>
  <p>איך מאייתים את השם שלך?</p>

  <p><strong>How</strong> did you get here?</p>
  <p>איך הגעת לכאן?</p>

  <p><strong>How</strong> does this work?</p>
  <p>איך זה עובד?</p>
</div>

<div class="rules">
  <h3>צירופים עם How:</h3>
  <ul>
    <li><strong>How old</strong> - בן כמה</li>
    <li><strong>How much</strong> - כמה (לא ספיר)</li>
    <li><strong>How many</strong> - כמה (ספיר)</li>
    <li><strong>How long</strong> - כמה זמן</li>
    <li><strong>How often</strong> - כמה פעמים / באיזו תדירות</li>
    <li><strong>How far</strong> - כמה רחוק</li>
  </ul>
</div>

<div class="examples">
  <h3>דוגמאות - צירופים עם How:</h3>
  <p><strong>How old</strong> are you?</p>
  <p>בן כמה אתה?</p>

  <p><strong>How much</strong> does it cost?</p>
  <p>כמה זה עולה?</p>

  <p><strong>How many</strong> brothers do you have?</p>
  <p>כמה אחים יש לך?</p>

  <p><strong>How long</strong> have you been here?</p>
  <p>כמה זמן אתה כאן?</p>

  <p><strong>How often</strong> do you exercise?</p>
  <p>כמה פעמים אתה מתאמן?</p>

  <p><strong>How far</strong> is the airport?</p>
  <p>כמה רחוק שדה התעופה?</p>
</div>

<div class="warning">
  <strong>שימו לב:</strong> How much לדברים שלא סופרים (מים, כסף), How many לדברים שסופרים (ספרים, אנשים).
</div>
    `,
    exercises: [
      // Easy exercises (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: '_______ are you late?',
        options: ['Why', 'How', 'What', 'Where'],
        correctAnswer: 'Why',
        explanationHe: 'תשובה נכונה: Why. שואלים על סיבה - "למה איחרת?".',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: '_______ are you? (מה שלומך)',
        correctAnswer: 'How',
        explanationHe: 'תשובה נכונה: How. "How are you?" = "מה שלומך?".',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: '_______ old are you?',
        options: ['How', 'Why', 'What', 'Where'],
        correctAnswer: 'How',
        explanationHe: 'תשובה נכונה: How. "How old" = "בן כמה".',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: '_______ did you leave the party? (למה)',
        correctAnswer: 'Why',
        explanationHe: 'תשובה נכונה: Why. שואלים על סיבת העזיבה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: '_______ does this work?',
        options: ['How', 'Why', 'Who', 'When'],
        correctAnswer: 'How',
        explanationHe: 'תשובה נכונה: How. שואלים איך משהו עובד.',
        difficulty: 'easy'
      },
      // Medium exercises (6-12)
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: '_______ much does it cost?',
        options: ['How', 'Why', 'What', 'Where'],
        correctAnswer: 'How',
        explanationHe: 'תשובה נכונה: How. "How much" לשאול על מחיר.',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: '_______ many brothers do you have?',
        correctAnswer: 'How',
        explanationHe: 'תשובה נכונה: How. "How many" לכמות של דברים ספירים.',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: '_______ do you like pizza?',
        options: ['Why', 'How', 'What', 'Where'],
        correctAnswer: 'Why',
        explanationHe: 'תשובה נכונה: Why. שואלים על הסיבה שאוהבים פיצה.',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: '_______ long have you been waiting?',
        correctAnswer: 'How',
        explanationHe: 'תשובה נכונה: How. "How long" לשאול על משך זמן.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: '_______ often do you go to the gym?',
        options: ['How', 'Why', 'What', 'When'],
        correctAnswer: 'How',
        explanationHe: 'תשובה נכונה: How. "How often" לשאול על תדירות.',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'fill_in_blank',
        questionTextHe: '_______ is the sky blue? (למה)',
        correctAnswer: 'Why',
        explanationHe: 'תשובה נכונה: Why. שאלה על סיבה.',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: '_______ far is the airport?',
        options: ['How', 'Why', 'What', 'Where'],
        correctAnswer: 'How',
        explanationHe: 'תשובה נכונה: How. "How far" לשאול על מרחק.',
        difficulty: 'medium'
      },
      // Hard exercises (13-20)
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'מתי משתמשים ב-How much ומתי ב-How many?',
        options: ['אין הבדל', 'How much לספירים, How many ללא ספירים', 'How much ללא ספירים, How many לספירים', 'How much לכסף בלבד'],
        correctAnswer: 'How much ללא ספירים, How many לספירים',
        explanationHe: 'תשובה נכונה: How much לדברים שלא סופרים (מים, כסף), How many לדברים שסופרים (ספרים).',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: '_______ do you spell your name?',
        correctAnswer: 'How',
        explanationHe: 'תשובה נכונה: How. שואלים איך מאייתים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: '_______ didn\'t you call me?',
        options: ['Why', 'How', 'What', 'When'],
        correctAnswer: 'Why',
        explanationHe: 'תשובה נכונה: Why. שואלים על הסיבה שלא התקשרת.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: '_______ _______ water do you drink a day?',
        correctAnswer: 'How much',
        explanationHe: 'תשובה נכונה: How much. מים הם לא ספירים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: '_______ did you get here? - By bus.',
        options: ['How', 'Why', 'What', 'Where'],
        correctAnswer: 'How',
        explanationHe: 'תשובה נכונה: How. התשובה היא אופן הגעה (באוטובוס).',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: '_______ _______ books did you read last year?',
        correctAnswer: 'How many',
        explanationHe: 'תשובה נכונה: How many. ספרים הם ספירים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'תרגם: "למה אתה עצוב?"',
        options: ['How are you sad?', 'Why are you sad?', 'What are you sad?', 'When are you sad?'],
        correctAnswer: 'Why are you sad?',
        explanationHe: 'תשובה נכונה: Why are you sad? שואלים על סיבה עם Why.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: '_______ come you didn\'t tell me?',
        correctAnswer: 'How',
        explanationHe: 'תשובה נכונה: How. "How come" היא דרך לא פורמלית לשאול "למה?".',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 10.5: Question Formation in Different Tenses ====================
  {
    topicNumber: 10,
    subtopicNumber: '10.5',
    titleEn: 'Question Formation in Different Tenses',
    titleHe: 'יצירת שאלות בזמנים שונים',
    level: 'beginner',
    orderIndex: 5,
    theoryContentHe: `
<h2>יצירת שאלות בזמנים שונים</h2>

<p>בכל זמן באנגלית, יש מבנה ספציפי ליצירת שאלות.</p>

<div class="rules">
  <h3>Present Simple - הווה פשוט</h3>
  <p><strong>Question Word + Do/Does + Subject + Base Verb?</strong></p>
</div>

<div class="examples">
  <h3>דוגמאות - Present Simple:</h3>
  <p><strong>Where do you</strong> live?</p>
  <p>איפה אתה גר?</p>

  <p><strong>What does she</strong> eat for breakfast?</p>
  <p>מה היא אוכלת לארוחת בוקר?</p>

  <p><strong>When do they</strong> start work?</p>
  <p>מתי הם מתחילים לעבוד?</p>
</div>

<div class="rules">
  <h3>Past Simple - עבר פשוט</h3>
  <p><strong>Question Word + Did + Subject + Base Verb?</strong></p>
</div>

<div class="examples">
  <h3>דוגמאות - Past Simple:</h3>
  <p><strong>Where did you</strong> go yesterday?</p>
  <p>לאן הלכת אתמול?</p>

  <p><strong>What did she</strong> buy?</p>
  <p>מה היא קנתה?</p>

  <p><strong>When did they</strong> arrive?</p>
  <p>מתי הם הגיעו?</p>
</div>

<div class="rules">
  <h3>Present Progressive - הווה מתמשך</h3>
  <p><strong>Question Word + Am/Is/Are + Subject + Verb-ing?</strong></p>
</div>

<div class="examples">
  <h3>דוגמאות - Present Progressive:</h3>
  <p><strong>What are you</strong> doing?</p>
  <p>מה אתה עושה?</p>

  <p><strong>Where is he</strong> going?</p>
  <p>לאן הוא הולך?</p>

  <p><strong>Why are they</strong> laughing?</p>
  <p>למה הם צוחקים?</p>
</div>

<div class="rules">
  <h3>Future with Will - עתיד</h3>
  <p><strong>Question Word + Will + Subject + Base Verb?</strong></p>
</div>

<div class="examples">
  <h3>דוגמאות - Future:</h3>
  <p><strong>What will you</strong> do tomorrow?</p>
  <p>מה תעשה מחר?</p>

  <p><strong>Where will they</strong> live?</p>
  <p>איפה הם יגורו?</p>

  <p><strong>When will she</strong> arrive?</p>
  <p>מתי היא תגיע?</p>
</div>

<div class="warning">
  <strong>זכור:</strong> אחרי did הפועל תמיד בצורת בסיס! (Where did you go? ולא: Where did you went?)
</div>
    `,
    exercises: [
      // Easy exercises (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'Where _______ you live? (Present Simple)',
        options: ['do', 'does', 'did', 'are'],
        correctAnswer: 'do',
        explanationHe: 'תשובה נכונה: do. בהווה פשוט עם you משתמשים ב-do.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'What _______ she eat for breakfast? (Present Simple)',
        correctAnswer: 'does',
        explanationHe: 'תשובה נכונה: does. בהווה פשוט עם she משתמשים ב-does.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'Where _______ you go yesterday? (Past Simple)',
        options: ['did', 'do', 'does', 'are'],
        correctAnswer: 'did',
        explanationHe: 'תשובה נכונה: did. בעבר פשוט משתמשים ב-did.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'What _______ you doing? (Present Progressive)',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. בהווה מתמשך עם you משתמשים ב-are.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'What _______ you do tomorrow? (Future)',
        options: ['will', 'do', 'did', 'are'],
        correctAnswer: 'will',
        explanationHe: 'תשובה נכונה: will. בעתיד משתמשים ב-will.',
        difficulty: 'easy'
      },
      // Medium exercises (6-12)
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'When _______ they arrive? (Past Simple)',
        options: ['did', 'do', 'does', 'will'],
        correctAnswer: 'did',
        explanationHe: 'תשובה נכונה: did. שואלים על העבר עם did.',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'Where _______ he going? (Present Progressive)',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. בהווה מתמשך עם he משתמשים ב-is.',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'Why _______ they laughing? (Present Progressive)',
        options: ['are', 'do', 'did', 'will'],
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. בהווה מתמשך עם they משתמשים ב-are.',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'What _______ she buy yesterday? (Past Simple)',
        correctAnswer: 'did',
        explanationHe: 'תשובה נכונה: did. בעבר משתמשים ב-did.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'When _______ she arrive? (Future)',
        options: ['will', 'do', 'did', 'is'],
        correctAnswer: 'will',
        explanationHe: 'תשובה נכונה: will. שואלים על העתיד עם will.',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'fill_in_blank',
        questionTextHe: 'How _______ he get to work? (Present Simple)',
        correctAnswer: 'does',
        explanationHe: 'תשובה נכונה: does. בהווה פשוט עם he משתמשים ב-does.',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: 'Where did you _______ ? (Past Simple)',
        options: ['go', 'went', 'going', 'goes'],
        correctAnswer: 'go',
        explanationHe: 'תשובה נכונה: go. אחרי did הפועל בצורת בסיס!',
        difficulty: 'medium'
      },
      // Hard exercises (13-20)
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'מה הטעות במשפט: "Where did you went?"',
        options: ['צריך where', 'צריך go במקום went', 'צריך does במקום did', 'אין טעות'],
        correctAnswer: 'צריך go במקום went',
        explanationHe: 'תשובה נכונה: אחרי did הפועל בצורת בסיס (go), לא בעבר (went).',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'What time _______ the movie start? (Present Simple)',
        correctAnswer: 'does',
        explanationHe: 'תשובה נכונה: does. "the movie" הוא גוף שלישי יחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'Why _______ you leave early yesterday?',
        options: ['did', 'do', 'does', 'are'],
        correctAnswer: 'did',
        explanationHe: 'תשובה נכונה: did. "yesterday" מציין עבר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'How _______ they travelling to Paris? (Present Progressive)',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. הווה מתמשך עם they.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'What _______ you studying next year?',
        options: ['will', 'do', 'did', 'are'],
        correctAnswer: 'will',
        explanationHe: 'תשובה נכונה: will. "next year" מציין עתיד. (או "will you be studying")',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'Who _______ you waiting for? (Present Progressive)',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. הווה מתמשך עם you.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['What did he bought?', 'What did he buy?', 'What he did buy?', 'What he bought?'],
        correctAnswer: 'What did he buy?',
        explanationHe: 'תשובה נכונה: What did he buy? סדר נכון + צורת בסיס אחרי did.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'Where _______ they live before they moved here? (Past Simple)',
        correctAnswer: 'did',
        explanationHe: 'תשובה נכונה: did. "before they moved" מציין עבר.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 10.6: Yes/No Questions vs. Wh- Questions ====================
  {
    topicNumber: 10,
    subtopicNumber: '10.6',
    titleEn: 'Yes/No Questions vs. Wh- Questions',
    titleHe: 'שאלות כן/לא לעומת שאלות מידע',
    level: 'beginner',
    orderIndex: 6,
    theoryContentHe: `
<h2>שאלות כן/לא לעומת שאלות מידע</h2>

<p>באנגלית יש שני סוגים עיקריים של שאלות:</p>

<div class="rules">
  <h3>Yes/No Questions - שאלות כן/לא</h3>
  <p>שאלות שהתשובה עליהן היא "כן" או "לא"</p>
  <p><strong>מבנה: Auxiliary Verb + Subject + Main Verb?</strong></p>
</div>

<div class="examples">
  <h3>דוגמאות - Yes/No Questions:</h3>
  <p><strong>Do</strong> you speak English?</p>
  <p>אתה מדבר אנגלית?</p>
  <p>תשובה: Yes, I do. / No, I don't.</p>

  <p><strong>Is</strong> she your sister?</p>
  <p>היא האחות שלך?</p>
  <p>תשובה: Yes, she is. / No, she isn't.</p>

  <p><strong>Did</strong> they come?</p>
  <p>הם באו?</p>
  <p>תשובה: Yes, they did. / No, they didn't.</p>

  <p><strong>Will</strong> you help me?</p>
  <p>תעזור לי?</p>
  <p>תשובה: Yes, I will. / No, I won't.</p>
</div>

<div class="rules">
  <h3>Wh- Questions - שאלות מידע</h3>
  <p>שאלות שדורשות תשובה עם מידע</p>
  <p><strong>מבנה: Question Word + Auxiliary Verb + Subject + Main Verb?</strong></p>
</div>

<div class="examples">
  <h3>דוגמאות - Wh- Questions:</h3>
  <p><strong>Where do</strong> you live?</p>
  <p>איפה אתה גר?</p>
  <p>תשובה: I live in Tel Aviv.</p>

  <p><strong>What is</strong> your name?</p>
  <p>מה שמך?</p>
  <p>תשובה: My name is David.</p>

  <p><strong>When did</strong> they arrive?</p>
  <p>מתי הם הגיעו?</p>
  <p>תשובה: They arrived yesterday.</p>
</div>

<div class="rules">
  <h3>ההבדל העיקרי:</h3>
  <table>
    <tr>
      <th>Yes/No Questions</th>
      <th>Wh- Questions</th>
    </tr>
    <tr>
      <td>מתחילות בפועל עזר</td>
      <td>מתחילות במילת שאלה</td>
    </tr>
    <tr>
      <td>תשובה: כן/לא</td>
      <td>תשובה: מידע</td>
    </tr>
  </table>
</div>

<div class="warning">
  <strong>זכור:</strong> שאלות כן/לא מתחילות בפועל עזר, שאלות Wh מתחילות במילת שאלה!
</div>
    `,
    exercises: [
      // Easy exercises (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'איזו שאלה היא Yes/No Question?',
        options: ['Where do you live?', 'Do you like pizza?', 'What is your name?', 'Why are you late?'],
        correctAnswer: 'Do you like pizza?',
        explanationHe: 'תשובה נכונה: Do you like pizza? התשובה היא Yes או No.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: '_______ you speak English? (שאלת כן/לא)',
        correctAnswer: 'Do',
        explanationHe: 'תשובה נכונה: Do. שאלת כן/לא מתחילה בפועל עזר.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'איזו שאלה היא Wh- Question?',
        options: ['Is she coming?', 'Did you eat?', 'Where do you work?', 'Can you help?'],
        correctAnswer: 'Where do you work?',
        explanationHe: 'תשובה נכונה: Where do you work? מתחילה במילת שאלה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: '_______ she your sister? (שאלת כן/לא)',
        correctAnswer: 'Is',
        explanationHe: 'תשובה נכונה: Is. שאלת כן/לא עם to be.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'מה התשובה המתאימה ל: "Do you like coffee?"',
        options: ['I like coffee', 'Yes, I do', 'Coffee', 'In the morning'],
        correctAnswer: 'Yes, I do',
        explanationHe: 'תשובה נכונה: Yes, I do. שאלת כן/לא דורשת תשובה כן/לא.',
        difficulty: 'easy'
      },
      // Medium exercises (6-12)
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'במה מתחילות שאלות Yes/No?',
        options: ['במילת שאלה', 'בפועל עזר', 'בנושא', 'בפועל עיקרי'],
        correctAnswer: 'בפועל עזר',
        explanationHe: 'תשובה נכונה: בפועל עזר (Do, Does, Is, Are, Did, Will...).',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: '_______ they come to the party? - Yes, they did.',
        correctAnswer: 'Did',
        explanationHe: 'תשובה נכונה: Did. התשובה Yes, they did מראה שזו שאלת כן/לא.',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'מה התשובה המתאימה ל: "Where do you live?"',
        options: ['Yes, I do', 'No, I don\'t', 'I live in Haifa', 'I do live'],
        correctAnswer: 'I live in Haifa',
        explanationHe: 'תשובה נכונה: I live in Haifa. שאלת מידע דורשת תשובה עם מידע.',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: '_______ you help me? - Sure, I will.',
        correctAnswer: 'Will',
        explanationHe: 'תשובה נכונה: Will. התשובה מציינת שזו שאלת כן/לא.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'איזו שאלה דורשת מידע בתשובה?',
        options: ['Is he tall?', 'Can you swim?', 'What time is it?', 'Do they work here?'],
        correctAnswer: 'What time is it?',
        explanationHe: 'תשובה נכונה: What time is it? דורשת תשובה עם השעה.',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'fill_in_blank',
        questionTextHe: '_______ is your teacher? - Mr. Cohen is my teacher.',
        correctAnswer: 'Who',
        explanationHe: 'תשובה נכונה: Who. התשובה נותנת מידע (שם המורה).',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: 'השלם: "_______ she like chocolate?"',
        options: ['What does', 'Does', 'Is', 'What is'],
        correctAnswer: 'Does',
        explanationHe: 'תשובה נכונה: Does. שאלת כן/לא על אהבה לשוקולד.',
        difficulty: 'medium'
      },
      // Hard exercises (13-20)
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'מה ההבדל המבני העיקרי בין שני סוגי השאלות?',
        options: ['פועל העזר', 'מיקום מילת השאלה', 'סוג התשובה', 'שאלות Wh מתחילות במילת שאלה, Yes/No בפועל עזר'],
        correctAnswer: 'שאלות Wh מתחילות במילת שאלה, Yes/No בפועל עזר',
        explanationHe: 'תשובה נכונה: ההבדל העיקרי הוא במה השאלה מתחילה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: '_______ you finish the homework? - Yes, I did.',
        correctAnswer: 'Did',
        explanationHe: 'תשובה נכונה: Did. התשובה "Yes, I did" מאשרת שזו שאלת כן/לא.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'הפוך את השאלה לשאלת מידע: "Did she buy a dress?" → "_______ did she buy?"',
        options: ['When', 'What', 'Why', 'How'],
        correctAnswer: 'What',
        explanationHe: 'תשובה נכונה: What did she buy? שואלים מה היא קנתה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: '_______ do you wake up? - At 7 AM.',
        correctAnswer: 'When',
        explanationHe: 'תשובה נכונה: When. התשובה נותנת זמן.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'השלם כדי ליצור שאלת כן/לא: "_______ the children playing outside?"',
        options: ['What are', 'Are', 'Where are', 'Why are'],
        correctAnswer: 'Are',
        explanationHe: 'תשובה נכונה: Are. שאלת כן/לא מתחילה בפועל עזר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: '_______ the bus coming soon? - Yes, it is.',
        correctAnswer: 'Is',
        explanationHe: 'תשובה נכונה: Is. התשובה Yes, it is מאשרת שאלת כן/לא.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'איזו שאלה מתאימה לתשובה: "She went to the store"?',
        options: ['Did she go?', 'Where did she go?', 'Is she going?', 'Can she go?'],
        correctAnswer: 'Where did she go?',
        explanationHe: 'תשובה נכונה: Where did she go? התשובה נותנת מיקום.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'הפוך לשאלת מידע: "Is he tall?" → "_______ tall is he?"',
        correctAnswer: 'How',
        explanationHe: 'תשובה נכונה: How tall is he? שואלים על גובה ספציפי.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 10.7: Common Mistakes ====================
  {
    topicNumber: 10,
    subtopicNumber: '10.7',
    titleEn: 'Common Mistakes',
    titleHe: 'טעויות נפוצות',
    level: 'beginner',
    orderIndex: 7,
    theoryContentHe: `
<h2>טעויות נפוצות ביצירת שאלות</h2>

<p>הנה הטעויות הנפוצות ביותר והדרך לתקן אותן:</p>

<div class="rules">
  <h3>טעות 1: שכחת פועל עזר</h3>
  <p>Where you live?</p>
  <p>Where <strong>do</strong> you live?</p>
  <p><em>חייבים פועל עזר בשאלות!</em></p>
</div>

<div class="rules">
  <h3>טעות 2: סדר מילים שגוי</h3>
  <p>What you do?</p>
  <p>What <strong>do you</strong> do?</p>
  <p><em>פועל עזר לפני הנושא!</em></p>
</div>

<div class="rules">
  <h3>טעות 3: שימוש בפועל בעבר אחרי did</h3>
  <p>Where did you <strong>went</strong>?</p>
  <p>Where did you <strong>go</strong>?</p>
  <p><em>אחרי did הפועל בצורת בסיס!</em></p>
</div>

<div class="rules">
  <h3>טעות 4: שימוש ב-do עם to be</h3>
  <p><strong>Do</strong> you <strong>are</strong> happy?</p>
  <p><strong>Are</strong> you happy?</p>
  <p><em>To be לא צריך do!</em></p>
</div>

<div class="rules">
  <h3>טעות 5: שכחת s ב-does</h3>
  <p>Where <strong>do</strong> she live?</p>
  <p>Where <strong>does</strong> she live?</p>
  <p><em>עם he/she/it משתמשים ב-does!</em></p>
</div>

<div class="rules">
  <h3>טעות 6: שימוש ב-do/does עם Who כנושא</h3>
  <p>Who <strong>does</strong> call you?</p>
  <p>Who called you?</p>
  <p><em>כש-Who הוא הנושא, לא צריך פועל עזר!</em></p>
</div>

<div class="examples">
  <h3>סיכום - משפטים נכונים:</h3>
  <p><strong>Where do you</strong> live?</p>
  <p>איפה אתה גר?</p>

  <p><strong>What did she</strong> buy?</p>
  <p>מה היא קנתה?</p>

  <p><strong>Are</strong> you happy?</p>
  <p>אתה שמח?</p>

  <p><strong>Who</strong> called you?</p>
  <p>מי התקשר אליך?</p>
</div>

<div class="warning">
  <strong>טיפ:</strong> תמיד בדוק - יש פועל עזר? הסדר נכון? הזמן מתאים?
</div>
    `,
    exercises: [
      // Easy exercises (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['Where you live?', 'Where do you live?', 'Where you do live?', 'Where live you?'],
        correctAnswer: 'Where do you live?',
        explanationHe: 'תשובה נכונה: Where do you live? סדר נכון עם פועל עזר.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "What you do?" → What _______ you do?',
        correctAnswer: 'do',
        explanationHe: 'תשובה נכונה: do. חייבים פועל עזר בשאלות.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'מה הטעות ב: "Where did you went?"',
        options: ['צריך Where', 'צריך go במקום went', 'צריך do במקום did', 'אין טעות'],
        correctAnswer: 'צריך go במקום went',
        explanationHe: 'תשובה נכונה: אחרי did הפועל בצורת בסיס (go), לא בעבר (went).',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "Do you are happy?" → _______ you happy?',
        correctAnswer: 'Are',
        explanationHe: 'תשובה נכונה: Are. עם to be לא משתמשים ב-do.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['What does she wants?', 'What does she want?', 'What do she want?', 'What she wants?'],
        correctAnswer: 'What does she want?',
        explanationHe: 'תשובה נכונה: What does she want? does עם she, והפועל בצורת בסיס.',
        difficulty: 'easy'
      },
      // Medium exercises (6-12)
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'מה הטעות ב: "Where do she live?"',
        options: ['צריך does במקום do', 'צריך lives במקום live', 'צריך did', 'אין טעות'],
        correctAnswer: 'צריך does במקום do',
        explanationHe: 'תשובה נכונה: עם she משתמשים ב-does, לא do.',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "What you are doing?" → What _______ you doing?',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. סדר נכון: What are you doing?',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'איזו שאלה נכונה?',
        options: ['Who did call you?', 'Who called you?', 'Who does called you?', 'Who you called?'],
        correctAnswer: 'Who called you?',
        explanationHe: 'תשובה נכונה: Who called you? כש-Who הנושא, לא צריך פועל עזר.',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "When she did arrive?" → When _______ she arrive?',
        correctAnswer: 'did',
        explanationHe: 'תשובה נכונה: did. הסדר הנכון: When did she arrive?',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'מה הטעות ב: "How many books does he has?"',
        options: ['צריך do במקום does', 'צריך have במקום has', 'צריך How much', 'אין טעות'],
        correctAnswer: 'צריך have במקום has',
        explanationHe: 'תשובה נכונה: אחרי does הפועל בצורת בסיס (have), לא has.',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "Why you are late?" → Why _______ you late?',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. סדר נכון: Why are you late?',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['Is she can swim?', 'Can she swim?', 'Does she can swim?', 'Can she swims?'],
        correctAnswer: 'Can she swim?',
        explanationHe: 'תשובה נכונה: Can she swim? עם can לא צריך do/does, והפועל בצורת בסיס.',
        difficulty: 'medium'
      },
      // Hard exercises (13-20)
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'כמה טעויות יש במשפט: "Where you did went yesterday?"',
        options: ['אחת', 'שתיים', 'שלוש', 'אין טעויות'],
        correctAnswer: 'שתיים',
        explanationHe: 'תשובה נכונה: 2 טעויות. 1) סדר: Where did you... 2) went צריך להיות go.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "Who does lives here?" → Who _______ here?',
        correctAnswer: 'lives',
        explanationHe: 'תשובה נכונה: lives. כש-Who הנושא: Who lives here? (בלי does).',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'מצא את המשפט הנכון היחיד:',
        options: ['What time does the movie starts?', 'What time the movie starts?', 'What time does the movie start?', 'What time do the movie start?'],
        correctAnswer: 'What time does the movie start?',
        explanationHe: 'תשובה נכונה: What time does the movie start? does + צורת בסיס.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "How much books you have?" → How _______ books do you have?',
        correctAnswer: 'many',
        explanationHe: 'תשובה נכונה: many. ספרים ספירים, לכן How many + פועל עזר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['Do he is your brother?', 'Is he your brother?', 'Does he is your brother?', 'He is your brother?'],
        correctAnswer: 'Is he your brother?',
        explanationHe: 'תשובה נכונה: Is he your brother? עם to be לא משתמשים ב-do/does.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'תקן את כל הטעויות: "What she does do?" → What _______ she do?',
        correctAnswer: 'does',
        explanationHe: 'תשובה נכונה: What does she do? סדר נכון.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'מה הטעות ב: "Why did she cried?"',
        options: ['צריך do במקום did', 'צריך cry במקום cried', 'צריך was במקום did', 'אין טעות'],
        correctAnswer: 'צריך cry במקום cried',
        explanationHe: 'תשובה נכונה: אחרי did הפועל בצורת בסיס (cry).',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'בחר את התיקון הנכון ל: "When you will come?"',
        options: ['When will you come?', 'When do you will come?', 'When you come?', 'When will you coming?'],
        correctAnswer: 'When will you come?',
        explanationHe: 'תשובה נכונה: When will you come? פועל עזר לפני הנושא.',
        difficulty: 'hard'
      }
    ]
  }
];

// Seed function
async function seedTopic10() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    console.log('Starting to seed Topic 10: Question Words...');

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
    console.log('Topic 10: Question Words seeded successfully!');
    console.log(`   Total: ${lessonsData.length} lessons created`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding Topic 10:', error);
    throw error;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  seedTopic10()
    .then(() => {
      console.log('Seeding complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedTopic10, lessonsData };
