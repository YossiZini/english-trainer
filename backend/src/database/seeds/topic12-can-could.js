const { pool } = require('../../config/database');
const Lesson = require('../../models/Lesson');
const Exercise = require('../../models/Exercise');

// Topic 12: Can / Could (Ability & Permission) (יכול / יכול היה)
const lessonsData = [
  // ==================== SUBTOPIC 12.1: Introduction to Modal Verbs ====================
  {
    topicNumber: 12,
    subtopicNumber: '12.1',
    titleEn: 'Introduction to Modal Verbs',
    titleHe: 'מבוא לפעלים מודאליים',
    level: 'beginner',
    orderIndex: 1,
    theoryContentHe: `
<h2>מהם פעלים מודאליים?</h2>

<p>פעלים מודאליים (Modal Verbs) הם פעלי עזר מיוחדים שמוסיפים משמעות לפועל העיקרי במשפט.</p>

<div class="rules">
  <h3>פעלים מודאליים נפוצים:</h3>
  <ul>
    <li><strong>can</strong> - יכול (יכולת, אפשרות, רשות)</li>
    <li><strong>could</strong> - יכול היה / היה יכול (יכולת בעבר, בקשה מנומסת)</li>
    <li><strong>may</strong> - יכול / מותר (רשות, אפשרות)</li>
    <li><strong>might</strong> - אולי יכול (אפשרות נמוכה)</li>
    <li><strong>must</strong> - חייב (חובה)</li>
    <li><strong>should</strong> - צריך (המלצה)</li>
    <li><strong>will</strong> - (עתיד)</li>
    <li><strong>would</strong> - היה (תנאי, בקשה מנומסת)</li>
  </ul>
</div>

<div class="rules">
  <h3>כללים חשובים לפעלים מודאליים:</h3>
  <ul>
    <li><strong>אין להם צורת -s</strong> בגוף שלישי: He can (לא: He cans)</li>
    <li><strong>אחריהם בא פועל בצורת בסיס</strong> (infinitive בלי to): I can swim (לא: I can to swim)</li>
    <li><strong>בשלילה מוסיפים not</strong>: cannot, could not</li>
    <li><strong>בשאלה הם באים לפני הנושא</strong>: Can you...?</li>
  </ul>
</div>

<div class="examples">
  <h3>דוגמאות:</h3>
  <p>I <strong>can</strong> speak English.</p>
  <p>אני יכול לדבר אנגלית.</p>

  <p>She <strong>can</strong> play the piano.</p>
  <p>היא יכולה לנגן בפסנתר.</p>

  <p><strong>Can</strong> you help me?</p>
  <p>אתה יכול לעזור לי?</p>
</div>

<div class="warning">
  <strong>זכור:</strong> פעלים מודאליים לא משתנים לפי הגוף - הם תמיד באותה צורה!
</div>
    `,
    exercises: [
      // Easy exercises (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'מהו פועל מודאלי?',
        options: ['פועל עיקרי', 'פועל עזר מיוחד', 'שם תואר', 'שם עצם'],
        correctAnswer: 'פועל עזר מיוחד',
        explanationHe: 'תשובה נכונה: פועל עזר מיוחד. פעלים מודאליים הם פעלי עזר שמוסיפים משמעות כמו יכולת, רשות או חובה לפועל העיקרי.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'איזה מהבאים הוא פועל מודאלי?',
        options: ['run', 'can', 'beautiful', 'quickly'],
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. זהו פועל מודאלי שמבטא יכולת. run הוא פועל רגיל, beautiful הוא תואר, quickly הוא תואר הפועל.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'He _______ swim very well.',
        options: ['can', 'cans', 'can to', 'caning'],
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. פעלים מודאליים לא מקבלים s בגוף שלישי. "He can" ולא "He cans".',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (can) play the guitar.',
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. פועל מודאלי נשאר באותה צורה לכל הגופים.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'I can _______ English.',
        options: ['speak', 'to speak', 'speaks', 'speaking'],
        correctAnswer: 'speak',
        explanationHe: 'תשובה נכונה: speak. אחרי פועל מודאלי בא הפועל בצורת בסיס (בלי to).',
        difficulty: 'easy'
      },
      // Medium exercises (6-12)
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['She cans dance', 'She can dances', 'She can dance', 'She can to dance'],
        correctAnswer: 'She can dance',
        explanationHe: 'תשובה נכונה: She can dance. פועל מודאלי לא מקבל s, והפועל אחריו בצורת בסיס.',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (can) speak three languages.',
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. הפועל המודאלי זהה לכל הגופים.',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'Birds _______ fly.',
        options: ['can', 'cans', 'can to', 'canning'],
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. פעלים מודאליים לא משתנים - גם עם birds (רבים) נשאר can.',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'מה ההבדל בין can לבין could?',
        options: ['אין הבדל', 'can להווה, could לעבר או בקשות מנומסות', 'could להווה, can לעבר', 'שניהם רק לעבר'],
        correctAnswer: 'can להווה, could לעבר או בקשות מנומסות',
        explanationHe: 'תשובה נכונה: can משמש ליכולת בהווה, could משמש ליכולת בעבר או לבקשות מנומסות.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'My brother _______ (can) ride a bike.',
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. פועל מודאלי לא משתנה גם עם "my brother" (גוף שלישי).',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'We _______ see the mountains from here.',
        options: ['can', 'cans', 'could to', 'canning'],
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. מבטא יכולת לראות את ההרים מכאן.',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'The children _______ (can) read already.',
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. פועל מודאלי זהה גם ליחיד וגם לרבים.',
        difficulty: 'medium'
      },
      // Hard exercises (13-20)
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'איזה מהמשפטים הבאים שגוי?',
        options: ['She can swim', 'He can plays tennis', 'They can cook', 'I can drive'],
        correctAnswer: 'He can plays tennis',
        explanationHe: 'תשובה נכונה: He can plays tennis שגוי. אחרי can הפועל חייב להיות בצורת בסיס (play), לא plays.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'תקן את המשפט: "She can to sing." → She can _______.',
        correctAnswer: 'sing',
        explanationHe: 'תשובה נכונה: sing. אחרי פועל מודאלי לא באה to - רק צורת הבסיס של הפועל.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'איזה כלל נכון לגבי פעלים מודאליים?',
        options: ['מוסיפים s בגוף שלישי', 'אחריהם בא to + פועל', 'לא משתנים לפי הגוף', 'משמשים רק בעבר'],
        correctAnswer: 'לא משתנים לפי הגוף',
        explanationHe: 'תשובה נכונה: פעלים מודאליים לא משתנים לפי הגוף - הם תמיד באותה צורה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'My grandmother _______ speak five languages when she was young.',
        options: ['can', 'could', 'cans', 'coulds'],
        correctAnswer: 'could',
        explanationHe: 'תשובה נכונה: could. כשמדברים על יכולת בעבר (when she was young) משתמשים ב-could.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'איזה פועל מודאלי מבטא חובה? _______',
        correctAnswer: 'must',
        explanationHe: 'תשובה נכונה: must. הפועל המודאלי must מבטא חובה או הכרח.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'השלם: "_______ you help me, please?"',
        options: ['Can', 'Cans', 'Can to', 'Does can'],
        correctAnswer: 'Can',
        explanationHe: 'תשובה נכונה: Can. בשאלות, הפועל המודאלי בא לפני הנושא: Can you...?',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: 'Neither my sister nor I _______ (can) cook well.',
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. פועל מודאלי לא משתנה בשום מבנה משפט.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'מהי צורת השלילה של can?',
        options: ['can not', 'cannot / can\'t', 'no can', 'don\'t can'],
        correctAnswer: 'cannot / can\'t',
        explanationHe: 'תשובה נכונה: cannot או can\'t. השלילה נוצרת על ידי הוספת not (cannot או can\'t).',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 12.2: Can - Present Ability ====================
  {
    topicNumber: 12,
    subtopicNumber: '12.2',
    titleEn: 'Can - Present Ability',
    titleHe: 'Can - יכולת בהווה',
    level: 'beginner',
    orderIndex: 2,
    theoryContentHe: `
<h2>Can - יכולת בהווה</h2>

<p>הפועל המודאלי <strong>can</strong> משמש לביטוי יכולת או כישרון בהווה.</p>

<div class="rules">
  <h3>מבנה:</h3>
  <p><strong>Subject + can + base verb</strong></p>
  <p>נושא + can + פועל בצורת בסיס</p>
</div>

<div class="examples">
  <h3>דוגמאות - יכולת פיזית:</h3>
  <p>I <strong>can swim</strong>.</p>
  <p>אני יכול לשחות.</p>

  <p>She <strong>can run</strong> very fast.</p>
  <p>היא יכולה לרוץ מהר מאוד.</p>

  <p>He <strong>can jump</strong> high.</p>
  <p>הוא יכול לקפוץ גבוה.</p>
</div>

<div class="examples">
  <h3>דוגמאות - כישרונות ומיומנויות:</h3>
  <p>I <strong>can speak</strong> English.</p>
  <p>אני יכול לדבר אנגלית.</p>

  <p>She <strong>can play</strong> the piano.</p>
  <p>היא יכולה לנגן בפסנתר.</p>

  <p>He <strong>can cook</strong> Italian food.</p>
  <p>הוא יכול לבשל אוכל איטלקי.</p>

  <p>They <strong>can dance</strong> salsa.</p>
  <p>הם יכולים לרקוד סלסה.</p>
</div>

<div class="examples">
  <h3>דוגמאות - יכולות אחרות:</h3>
  <p>I <strong>can see</strong> the mountains from here.</p>
  <p>אני יכול לראות את ההרים מכאן.</p>

  <p>She <strong>can hear</strong> the music.</p>
  <p>היא יכולה לשמוע את המוזיקה.</p>

  <p>We <strong>can understand</strong> the teacher.</p>
  <p>אנחנו יכולים להבין את המורה.</p>
</div>

<div class="warning">
  <strong>זכור:</strong> אחרי can תמיד בא הפועל בצורת בסיס - בלי to ובלי s!
</div>
    `,
    exercises: [
      // Easy exercises (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'I _______ swim.',
        options: ['can', 'cans', 'can to', 'canning'],
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. מבטא יכולת לשחות.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (can) speak English.',
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. פועל מודאלי לא משתנה לפי הגוף.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'He can _______ the piano.',
        options: ['play', 'plays', 'to play', 'playing'],
        correctAnswer: 'play',
        explanationHe: 'תשובה נכונה: play. אחרי can בא הפועל בצורת בסיס.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'They _______ run fast.',
        options: ['can', 'cans', 'can to', 'does can'],
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. מבטא יכולת לרוץ מהר.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (can) see the stars tonight.',
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. יכולת לראות את הכוכבים.',
        difficulty: 'easy'
      },
      // Medium exercises (6-12)
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'My sister _______ cook very well.',
        options: ['can', 'cans', 'can to', 'is can'],
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. פועל מודאלי לא מקבל s גם בגוף שלישי.',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'The children _______ (can) read already.',
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. מבטא יכולת קריאה.',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['She can sings', 'She can sing', 'She cans sing', 'She can to sing'],
        correctAnswer: 'She can sing',
        explanationHe: 'תשובה נכונה: She can sing. can לא מקבל s והפועל אחריו בצורת בסיס.',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'Birds _______ fly.',
        options: ['can', 'cans', 'can to', 'are can'],
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. ציפורים יכולות לעוף - יכולת טבעית.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'My dog _______ (can) do tricks.',
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. הכלב יכול לעשות טריקים.',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'Tom and Jerry _______ play tennis.',
        options: ['can', 'cans', 'can to', 'does can'],
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. פועל מודאלי זהה גם ליחיד וגם לרבים.',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (can) drive a car.',
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. יכולת נהיגה.',
        difficulty: 'medium'
      },
      // Hard exercises (13-20)
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'My grandmother _______ speak five languages fluently.',
        options: ['can', 'cans', 'can to', 'is able'],
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. מבטא יכולת לדבר חמש שפות בשטף.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'The new employee _______ (can) use all the software programs.',
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. העובד החדש יכול להשתמש בכל התוכנות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט מבטא יכולת?',
        options: ['I can go tomorrow', 'I can swim', 'Can I leave?', 'Can you pass the salt?'],
        correctAnswer: 'I can swim',
        explanationHe: 'תשובה נכונה: I can swim מבטא יכולת. השאר מבטאים אפשרות, רשות או בקשה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'Neither Tom nor his brothers _______ (can) fix the car.',
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. פועל מודאלי לא משתנה בשום מבנה משפט.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'Professional athletes _______ perform at very high levels.',
        options: ['can', 'cans', 'can to', 'are can'],
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. ספורטאים מקצועיים יכולים לבצע ברמות גבוהות מאוד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'Each student _______ (can) choose their own project topic.',
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. כל תלמיד יכול לבחור את נושא הפרויקט שלו.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'מה המשמעות של "I can see you"?',
        options: ['אני רואה אותך (יכולת)', 'אני אראה אותך (עתיד)', 'אני ראיתי אותך (עבר)', 'אני צריך לראות אותך'],
        correctAnswer: 'אני רואה אותך (יכולת)',
        explanationHe: 'תשובה נכונה: can see מבטא יכולת לראות בהווה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'The latest smartphones _______ (can) do almost anything.',
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. הסמארטפונים החדשים יכולים לעשות כמעט הכל.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 12.3: Can - Permission and Requests ====================
  {
    topicNumber: 12,
    subtopicNumber: '12.3',
    titleEn: 'Can - Permission and Requests',
    titleHe: 'Can - רשות ובקשות',
    level: 'beginner',
    orderIndex: 3,
    theoryContentHe: `
<h2>Can - רשות ובקשות</h2>

<p>הפועל המודאלי <strong>can</strong> משמש גם לבקשת רשות ולבקשות.</p>

<div class="rules">
  <h3>בקשת רשות - Can I...?</h3>
  <p><strong>Can I + base verb...?</strong></p>
  <p>האם אני יכול/מותר לי...?</p>
</div>

<div class="examples">
  <h3>דוגמאות - בקשת רשות:</h3>
  <p><strong>Can I</strong> go to the bathroom?</p>
  <p>אפשר ללכת לשירותים?</p>

  <p><strong>Can I</strong> use your phone?</p>
  <p>אפשר להשתמש בטלפון שלך?</p>

  <p><strong>Can I</strong> sit here?</p>
  <p>אפשר לשבת פה?</p>

  <p><strong>Can I</strong> open the window?</p>
  <p>אפשר לפתוח את החלון?</p>
</div>

<div class="rules">
  <h3>בקשות - Can you...?</h3>
  <p><strong>Can you + base verb...?</strong></p>
  <p>אתה יכול...?</p>
</div>

<div class="examples">
  <h3>דוגמאות - בקשות:</h3>
  <p><strong>Can you</strong> help me?</p>
  <p>אתה יכול לעזור לי?</p>

  <p><strong>Can you</strong> pass the salt?</p>
  <p>אתה יכול להעביר את המלח?</p>

  <p><strong>Can you</strong> close the door?</p>
  <p>אתה יכול לסגור את הדלת?</p>

  <p><strong>Can you</strong> wait a moment?</p>
  <p>אתה יכול לחכות רגע?</p>
</div>

<div class="rules">
  <h3>מתן רשות - You can...</h3>
  <p><strong>You can + base verb</strong></p>
  <p>אתה יכול / מותר לך...</p>
</div>

<div class="examples">
  <h3>דוגמאות - מתן רשות:</h3>
  <p><strong>You can</strong> go now.</p>
  <p>אתה יכול ללכת עכשיו.</p>

  <p><strong>You can</strong> use my computer.</p>
  <p>אתה יכול להשתמש במחשב שלי.</p>
</div>

<div class="warning">
  <strong>טיפ:</strong> Can הוא פחות פורמלי מ-May. בשיחה יומיומית משתמשים יותר ב-Can.
</div>
    `,
    exercises: [
      // Easy exercises (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: '_______ I go to the bathroom?',
        options: ['Can', 'Cans', 'Do can', 'Am can'],
        correctAnswer: 'Can',
        explanationHe: 'תשובה נכונה: Can. בקשת רשות: Can I...?',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: '_______ (Can) you help me?',
        correctAnswer: 'Can',
        explanationHe: 'תשובה נכונה: Can. בקשה: Can you...?',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'Can I _______ here?',
        options: ['sit', 'sits', 'to sit', 'sitting'],
        correctAnswer: 'sit',
        explanationHe: 'תשובה נכונה: sit. אחרי can בא הפועל בצורת בסיס.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'Can you _______ the window?',
        options: ['open', 'opens', 'to open', 'opening'],
        correctAnswer: 'open',
        explanationHe: 'תשובה נכונה: open. אחרי can בא הפועל בצורת בסיס.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: '_______ (Can) I use your pen?',
        correctAnswer: 'Can',
        explanationHe: 'תשובה נכונה: Can. בקשת רשות להשתמש בעט.',
        difficulty: 'easy'
      },
      // Medium exercises (6-12)
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'מה המשמעות של "Can I leave early?"',
        options: ['אני יכול לעזוב מוקדם?', 'מותר לי לעזוב מוקדם?', 'אני עוזב מוקדם', 'אני עזבתי מוקדם'],
        correctAnswer: 'מותר לי לעזוב מוקדם?',
        explanationHe: 'תשובה נכונה: מותר לי לעזוב מוקדם? Can I משמש לבקשת רשות.',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: '_______ (Can) you pass me the book?',
        correctAnswer: 'Can',
        explanationHe: 'תשובה נכונה: Can. בקשה להעביר את הספר.',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'You _______ go home now. Class is over.',
        options: ['can', 'cans', 'can to', 'are can'],
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. מתן רשות ללכת הביתה.',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: '_______ I borrow your calculator?',
        options: ['Can', 'Cans', 'Do can', 'Is can'],
        correctAnswer: 'Can',
        explanationHe: 'תשובה נכונה: Can. בקשת רשות לשאול מחשבון.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: '_______ (Can) you turn down the music?',
        correctAnswer: 'Can',
        explanationHe: 'תשובה נכונה: Can. בקשה להנמיך את המוזיקה.',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: '_______ we take a break?',
        options: ['Can', 'Cans', 'Do can', 'Are can'],
        correctAnswer: 'Can',
        explanationHe: 'תשובה נכונה: Can. בקשת רשות לקחת הפסקה.',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'You _______ (can) eat the cake. I made it for you.',
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. מתן רשות לאכול את העוגה.',
        difficulty: 'medium'
      },
      // Hard exercises (13-20)
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'מה ההבדל בין "Can I...?" לבין "May I...?"',
        options: ['אין הבדל', 'May פורמלי יותר', 'Can פורמלי יותר', 'May רק לעבר'],
        correctAnswer: 'May פורמלי יותר',
        explanationHe: 'תשובה נכונה: May פורמלי יותר. Can יותר נפוץ בשיחה יומיומית.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'Excuse me, _______ (can) I ask you a question?',
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. בקשת רשות לשאול שאלה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט מבטא בקשה?',
        options: ['I can swim', 'Can you help me?', 'She can dance', 'We can see the stars'],
        correctAnswer: 'Can you help me?',
        explanationHe: 'תשובה נכונה: Can you help me? זו בקשה. השאר מבטאים יכולת.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'Students _______ use dictionaries during the test.',
        options: ['can', 'cans', 'can to', 'cannot to'],
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. התלמידים מורשים/יכולים להשתמש במילונים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: '_______ (Can) I have your attention, please?',
        correctAnswer: 'Can',
        explanationHe: 'תשובה נכונה: Can. בקשת תשומת לב.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט מבטא מתן רשות?',
        options: ['Can I go?', 'You can go', 'Can you go?', 'I can go'],
        correctAnswer: 'You can go',
        explanationHe: 'תשובה נכונה: You can go מבטא מתן רשות. Can I שואל רשות, Can you זו בקשה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: '_______ (Can) I speak to the manager, please?',
        correctAnswer: 'Can',
        explanationHe: 'תשובה נכונה: Can. בקשה לדבר עם המנהל.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'You _______ park here. It\'s a free parking zone.',
        options: ['can', 'cans', 'can to', 'must to'],
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. מותר לחנות כאן - זו אזור חניה חופשי.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 12.4: Could - Past Ability ====================
  {
    topicNumber: 12,
    subtopicNumber: '12.4',
    titleEn: 'Could - Past Ability',
    titleHe: 'Could - יכולת בעבר',
    level: 'beginner',
    orderIndex: 4,
    theoryContentHe: `
<h2>Could - יכולת בעבר</h2>

<p>הפועל המודאלי <strong>could</strong> משמש לביטוי יכולת שהייתה בעבר.</p>

<div class="rules">
  <h3>מבנה:</h3>
  <p><strong>Subject + could + base verb</strong></p>
  <p>נושא + could + פועל בצורת בסיס</p>
</div>

<div class="examples">
  <h3>דוגמאות - יכולת בעבר:</h3>
  <p>When I was young, I <strong>could run</strong> very fast.</p>
  <p>כשהייתי צעיר, יכולתי לרוץ מהר מאוד.</p>

  <p>She <strong>could swim</strong> before she was five.</p>
  <p>היא יכלה לשחות לפני גיל חמש.</p>

  <p>My grandfather <strong>could speak</strong> six languages.</p>
  <p>סבא שלי יכול היה לדבר שש שפות.</p>

  <p>When I was a child, I <strong>could climb</strong> trees easily.</p>
  <p>כשהייתי ילד, יכולתי לטפס על עצים בקלות.</p>
</div>

<div class="examples">
  <h3>עוד דוגמאות:</h3>
  <p>My mother <strong>could play</strong> the piano when she was young.</p>
  <p>אמא שלי יכלה לנגן בפסנתר כשהייתה צעירה.</p>

  <p>In the past, people <strong>could not</strong> fly.</p>
  <p>בעבר, אנשים לא יכלו לעוף.</p>

  <p>He <strong>could read</strong> before he started school.</p>
  <p>הוא יכול היה לקרוא לפני שהתחיל בית ספר.</p>
</div>

<div class="warning">
  <strong>זכור:</strong> could הוא צורת העבר של can. משתמשים בו כשמדברים על יכולת שהייתה בעבר.
</div>
    `,
    exercises: [
      // Easy exercises (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'When I was young, I _______ run fast.',
        options: ['can', 'could', 'cans', 'coulds'],
        correctAnswer: 'could',
        explanationHe: 'תשובה נכונה: could. יכולת בעבר (when I was young).',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (could) swim when she was five.',
        correctAnswer: 'could',
        explanationHe: 'תשובה נכונה: could. יכולת בעבר.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'My grandmother _______ speak French.',
        options: ['can', 'could', 'cans', 'coulds'],
        correctAnswer: 'could',
        explanationHe: 'תשובה נכונה: could. סבתא יכלה לדבר צרפתית (בעבר).',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'He could _______ very well as a child.',
        options: ['sing', 'sings', 'to sing', 'singing'],
        correctAnswer: 'sing',
        explanationHe: 'תשובה נכונה: sing. אחרי could בא הפועל בצורת בסיס.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (could) play chess when they were young.',
        correctAnswer: 'could',
        explanationHe: 'תשובה נכונה: could. יכולת בעבר.',
        difficulty: 'easy'
      },
      // Medium exercises (6-12)
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'When I was a baby, I _______ not walk.',
        options: ['can', 'could', 'cans', 'coulds'],
        correctAnswer: 'could',
        explanationHe: 'תשובה נכונה: could not. חוסר יכולת בעבר.',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'Before the accident, he _______ (could) dance.',
        correctAnswer: 'could',
        explanationHe: 'תשובה נכונה: could. יכולת שהייתה לפני התאונה.',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'My father _______ fix anything when he was younger.',
        options: ['can', 'could', 'cans', 'coulds'],
        correctAnswer: 'could',
        explanationHe: 'תשובה נכונה: could. יכולת בעבר (when he was younger).',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['She could sings', 'She could sang', 'She could sing', 'She could to sing'],
        correctAnswer: 'She could sing',
        explanationHe: 'תשובה נכונה: She could sing. אחרי could בא הפועל בצורת בסיס.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'In ancient times, people _______ (could) not fly.',
        correctAnswer: 'could',
        explanationHe: 'תשובה נכונה: could not. חוסר יכולת בעבר.',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'The children _______ read before they started school.',
        options: ['can', 'could', 'cans', 'coulds'],
        correctAnswer: 'could',
        explanationHe: 'תשובה נכונה: could. יכולת לפני תחילת בית הספר (עבר).',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'Last year, I _______ (could) not speak English well.',
        correctAnswer: 'could',
        explanationHe: 'תשובה נכונה: could not. חוסר יכולת בשנה שעברה.',
        difficulty: 'medium'
      },
      // Hard exercises (13-20)
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'Before computers, people _______ calculate faster.',
        options: ['can not', 'could not', 'cannot', 'could\'nt'],
        correctAnswer: 'could not',
        explanationHe: 'תשובה נכונה: could not. חוסר יכולת בעבר (לפני מחשבים).',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'When my grandfather was young, he _______ (could) work 16 hours a day.',
        correctAnswer: 'could',
        explanationHe: 'תשובה נכונה: could. יכולת בעבר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'מה ההבדל בין can לבין could כשמדברים על יכולת?',
        options: ['אין הבדל', 'can להווה, could לעבר', 'could להווה, can לעבר', 'שניהם רק להווה'],
        correctAnswer: 'can להווה, could לעבר',
        explanationHe: 'תשובה נכונה: can מבטא יכולת בהווה, could מבטא יכולת בעבר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט מבטא יכולת בעבר?',
        options: ['I can swim', 'I could swim when I was five', 'Can you swim?', 'I will swim'],
        correctAnswer: 'I could swim when I was five',
        explanationHe: 'תשובה נכונה: I could swim when I was five מבטא יכולת בעבר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'Athletes in the past _______ (could) not run as fast as today.',
        correctAnswer: 'could',
        explanationHe: 'תשובה נכונה: could not. השוואה ליכולות בעבר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'Before she lost her voice, she _______ sing beautifully.',
        options: ['can', 'could', 'cans', 'coulds'],
        correctAnswer: 'could',
        explanationHe: 'תשובה נכונה: could. יכולת שהייתה לפני שאיבדה את קולה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: 'My great-grandmother _______ (could) remember everything.',
        correctAnswer: 'could',
        explanationHe: 'תשובה נכונה: could. יכולת של סבתא רבא (עבר).',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'תרגם: "כשהייתי צעיר, יכולתי לרקוד כל הלילה"',
        options: ['When I am young, I can dance all night', 'When I was young, I could dance all night', 'When I was young, I can dance all night', 'When I am young, I could dance all night'],
        correctAnswer: 'When I was young, I could dance all night',
        explanationHe: 'תשובה נכונה: When I was young, I could dance all night. עבר + could.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 12.5: Could - Polite Requests ====================
  {
    topicNumber: 12,
    subtopicNumber: '12.5',
    titleEn: 'Could - Polite Requests',
    titleHe: 'Could - בקשות מנומסות',
    level: 'beginner',
    orderIndex: 5,
    theoryContentHe: `
<h2>Could - בקשות מנומסות</h2>

<p>הפועל המודאלי <strong>could</strong> משמש גם לבקשות מנומסות - יותר מנומס מ-can!</p>

<div class="rules">
  <h3>מבנה:</h3>
  <p><strong>Could you + base verb...?</strong></p>
  <p>האם תוכל...? (מנומס)</p>

  <p><strong>Could I + base verb...?</strong></p>
  <p>האם אוכל...? (מנומס)</p>
</div>

<div class="examples">
  <h3>דוגמאות - בקשות מנומסות:</h3>
  <p><strong>Could you</strong> help me, please?</p>
  <p>האם תוכל לעזור לי, בבקשה?</p>

  <p><strong>Could you</strong> pass the salt?</p>
  <p>האם תוכל להעביר את המלח?</p>

  <p><strong>Could you</strong> speak more slowly?</p>
  <p>האם תוכל לדבר יותר לאט?</p>

  <p><strong>Could you</strong> repeat that?</p>
  <p>האם תוכל לחזור על זה?</p>
</div>

<div class="examples">
  <h3>בקשת רשות מנומסת:</h3>
  <p><strong>Could I</strong> use your phone?</p>
  <p>האם אוכל להשתמש בטלפון שלך?</p>

  <p><strong>Could I</strong> ask you a question?</p>
  <p>האם אוכל לשאול אותך שאלה?</p>

  <p><strong>Could I</strong> sit here?</p>
  <p>האם אוכל לשבת כאן?</p>
</div>

<div class="rules">
  <h3>Can vs Could - השוואה:</h3>
  <ul>
    <li><strong>Can you help?</strong> - פחות פורמלי, יומיומי</li>
    <li><strong>Could you help?</strong> - יותר מנומס ופורמלי</li>
  </ul>
</div>

<div class="warning">
  <strong>טיפ:</strong> השתמש ב-could כשאתה רוצה להיות מנומס יותר, למשל עם זרים או בסיטואציות רשמיות.
</div>
    `,
    exercises: [
      // Easy exercises (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: '_______ you help me, please?',
        options: ['Can', 'Could', 'Cans', 'Coulds'],
        correctAnswer: 'Could',
        explanationHe: 'תשובה נכונה: Could. בקשה מנומסת.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: '_______ (Could) you pass the salt?',
        correctAnswer: 'Could',
        explanationHe: 'תשובה נכונה: Could. בקשה מנומסת להעביר את המלח.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'Could I _______ your pen?',
        options: ['use', 'uses', 'to use', 'using'],
        correctAnswer: 'use',
        explanationHe: 'תשובה נכונה: use. אחרי could בא הפועל בצורת בסיס.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: '_______ I ask you a question?',
        options: ['Can', 'Could', 'Cans', 'Coulds'],
        correctAnswer: 'Could',
        explanationHe: 'תשובה נכונה: Could. בקשה מנומסת לשאול שאלה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: '_______ (Could) you speak more slowly?',
        correctAnswer: 'Could',
        explanationHe: 'תשובה נכונה: Could. בקשה מנומסת לדבר לאט יותר.',
        difficulty: 'easy'
      },
      // Medium exercises (6-12)
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'מה יותר מנומס?',
        options: ['Can you help?', 'Could you help?', 'Help me!', 'You help'],
        correctAnswer: 'Could you help?',
        explanationHe: 'תשובה נכונה: Could you help? Could מנומס יותר מ-Can.',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'Excuse me, _______ (could) you tell me the time?',
        correctAnswer: 'could',
        explanationHe: 'תשובה נכונה: could. בקשה מנומסת לשאול מה השעה.',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: '_______ I have a glass of water, please?',
        options: ['Can', 'Could', 'Cans', 'Coulds'],
        correctAnswer: 'Could',
        explanationHe: 'תשובה נכונה: Could. בקשה מנומסת לקבל כוס מים.',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: '_______ you repeat that, please?',
        options: ['Can', 'Could', 'Cans', 'Coulds'],
        correctAnswer: 'Could',
        explanationHe: 'תשובה נכונה: Could. בקשה מנומסת לחזור.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: '_______ (Could) you open the window?',
        correctAnswer: 'Could',
        explanationHe: 'תשובה נכונה: Could. בקשה מנומסת לפתוח את החלון.',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: '_______ I borrow your book?',
        options: ['Can', 'Could', 'Cans', 'Coulds'],
        correctAnswer: 'Could',
        explanationHe: 'תשובה נכונה: Could. בקשה מנומסת לשאול ספר.',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: '_______ (Could) you move a little, please?',
        correctAnswer: 'Could',
        explanationHe: 'תשובה נכונה: Could. בקשה מנומסת לזוז קצת.',
        difficulty: 'medium'
      },
      // Hard exercises (13-20)
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'באיזה מצב תשתמש ב-could במקום can?',
        options: ['כשמדברים על יכולת', 'כשרוצים להיות מנומסים', 'כשמדברים על עתיד', 'כשמדברים על חובה'],
        correctAnswer: 'כשרוצים להיות מנומסים',
        explanationHe: 'תשובה נכונה: כשרוצים להיות מנומסים. Could מנומס יותר מ-can בבקשות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'I was wondering if you _______ (could) help me with this.',
        correctAnswer: 'could',
        explanationHe: 'תשובה נכונה: could. ביטוי מאוד מנומס לבקשת עזרה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט הכי מנומס?',
        options: ['Help me!', 'Can you help?', 'Could you help?', 'Could you possibly help me?'],
        correctAnswer: 'Could you possibly help me?',
        explanationHe: 'תשובה נכונה: Could you possibly help me? הכי מנומס עם possibly.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: '_______ you mind closing the door?',
        options: ['Can', 'Could', 'Would', 'Could או Would'],
        correctAnswer: 'Could או Would',
        explanationHe: 'תשובה נכונה: Could או Would. שניהם מתאימים לבקשה מנומסת עם mind.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: '_______ (Could) I possibly use your phone for a moment?',
        correctAnswer: 'Could',
        explanationHe: 'תשובה נכונה: Could. possibly מוסיף עוד יותר נימוס.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'במשרד, מה תגיד למנהל?',
        options: ['Can I leave early?', 'Could I leave early?', 'I leave early', 'I can leave early'],
        correctAnswer: 'Could I leave early?',
        explanationHe: 'תשובה נכונה: Could I leave early? יותר מנומס כלפי הבוס.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: 'Excuse me, _______ (could) I have a moment of your time?',
        correctAnswer: 'could',
        explanationHe: 'תשובה נכונה: could. בקשה מנומסת לזמן של מישהו.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'תרגם בצורה מנומסת: "אפשר להשתמש בשירותים?"',
        options: ['Can I use the bathroom?', 'Could I use the bathroom?', 'I use the bathroom', 'Use bathroom?'],
        correctAnswer: 'Could I use the bathroom?',
        explanationHe: 'תשובה נכונה: Could I use the bathroom? יותר מנומס.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 12.6: Negative Forms ====================
  {
    topicNumber: 12,
    subtopicNumber: '12.6',
    titleEn: 'Negative Forms',
    titleHe: 'צורות שליליות',
    level: 'beginner',
    orderIndex: 6,
    theoryContentHe: `
<h2>צורות שליליות - Can't / Cannot / Couldn't</h2>

<p>לשלול יכולת, מוסיפים <strong>not</strong> לפועל המודאלי.</p>

<div class="rules">
  <h3>שלילה של Can:</h3>
  <ul>
    <li><strong>cannot</strong> (מילה אחת!) - פורמלי</li>
    <li><strong>can't</strong> - קיצור, נפוץ יותר</li>
    <li><strong>can not</strong> (שתי מילים) - נדיר, רק להדגשה</li>
  </ul>
</div>

<div class="examples">
  <h3>דוגמאות - Can't / Cannot:</h3>
  <p>I <strong>can't</strong> swim.</p>
  <p>אני לא יכול לשחות.</p>

  <p>She <strong>cannot</strong> come today.</p>
  <p>היא לא יכולה לבוא היום.</p>

  <p>We <strong>can't</strong> see anything.</p>
  <p>אנחנו לא יכולים לראות כלום.</p>

  <p>He <strong>can't</strong> speak French.</p>
  <p>הוא לא יכול לדבר צרפתית.</p>
</div>

<div class="rules">
  <h3>שלילה של Could:</h3>
  <ul>
    <li><strong>could not</strong> - פורמלי</li>
    <li><strong>couldn't</strong> - קיצור, נפוץ יותר</li>
  </ul>
</div>

<div class="examples">
  <h3>דוגמאות - Couldn't / Could not:</h3>
  <p>I <strong>couldn't</strong> sleep last night.</p>
  <p>לא יכולתי לישון אתמול בלילה.</p>

  <p>She <strong>couldn't</strong> find her keys.</p>
  <p>היא לא יכלה למצוא את המפתחות שלה.</p>

  <p>We <strong>could not</strong> understand him.</p>
  <p>לא יכולנו להבין אותו.</p>

  <p>They <strong>couldn't</strong> come to the party.</p>
  <p>הם לא יכלו לבוא למסיבה.</p>
</div>

<div class="warning">
  <strong>זכור:</strong> cannot נכתבת כמילה אחת! (לא can not)
</div>
    `,
    exercises: [
      // Easy exercises (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'I _______ swim.',
        options: ['can\'t', 'can not\'t', 'cans\'t', 'not can'],
        correctAnswer: 'can\'t',
        explanationHe: 'תשובה נכונה: can\'t. קיצור של cannot.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (cannot) come today.',
        correctAnswer: 'cannot',
        explanationHe: 'תשובה נכונה: cannot. שלילה של can.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'We _______ see anything.',
        options: ['can\'t', 'cans\'t', 'not can', 'can\'t to'],
        correctAnswer: 'can\'t',
        explanationHe: 'תשובה נכונה: can\'t. אנחנו לא יכולים לראות.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'I _______ sleep last night.',
        options: ['couldn\'t', 'could not\'t', 'not could', 'couldn\'t to'],
        correctAnswer: 'couldn\'t',
        explanationHe: 'תשובה נכונה: couldn\'t. לא יכולתי לישון בלילה שעבר.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (can\'t) speak French.',
        correctAnswer: 'can\'t',
        explanationHe: 'תשובה נכונה: can\'t. הוא לא יכול לדבר צרפתית.',
        difficulty: 'easy'
      },
      // Medium exercises (6-12)
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'איך כותבים נכון את השלילה של can?',
        options: ['can not', 'cannot', 'can\'t', 'cannot ו-can\'t נכונים'],
        correctAnswer: 'cannot ו-can\'t נכונים',
        explanationHe: 'תשובה נכונה: cannot ו-can\'t שניהם נכונים. cannot פורמלי יותר.',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (couldn\'t) find the answer.',
        correctAnswer: 'couldn\'t',
        explanationHe: 'תשובה נכונה: couldn\'t. הם לא יכלו למצוא את התשובה.',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'She _______ understand the question.',
        options: ['can\'t', 'cans\'t', 'don\'t can', 'not can'],
        correctAnswer: 'can\'t',
        explanationHe: 'תשובה נכונה: can\'t. היא לא יכולה להבין את השאלה.',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'When I was young, I _______ ride a bike.',
        options: ['can\'t', 'couldn\'t', 'cans\'t', 'don\'t could'],
        correctAnswer: 'couldn\'t',
        explanationHe: 'תשובה נכונה: couldn\'t. חוסר יכולת בעבר.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (can\'t) hear you. Speak louder!',
        correctAnswer: 'can\'t',
        explanationHe: 'תשובה נכונה: can\'t. אנחנו לא יכולים לשמוע אותך.',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'My grandmother _______ use a computer.',
        options: ['can\'t', 'cans\'t', 'not can', 'doesn\'t can'],
        correctAnswer: 'can\'t',
        explanationHe: 'תשובה נכונה: can\'t. סבתא לא יכולה להשתמש במחשב.',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'Sorry, I _______ (couldn\'t) come yesterday.',
        correctAnswer: 'couldn\'t',
        explanationHe: 'תשובה נכונה: couldn\'t. לא יכולתי לבוא אתמול.',
        difficulty: 'medium'
      },
      // Hard exercises (13-20)
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט שגוי?',
        options: ['I can\'t swim', 'She cannot come', 'He can not\'t go', 'We couldn\'t see'],
        correctAnswer: 'He can not\'t go',
        explanationHe: 'תשובה נכונה: He can not\'t go שגוי. אין צורה כזו.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'The students _______ (cannot) use phones during the exam.',
        correctAnswer: 'cannot',
        explanationHe: 'תשובה נכונה: cannot. התלמידים לא יכולים להשתמש בטלפונים במבחן.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'מה ההבדל בין cannot לבין can\'t?',
        options: ['אין הבדל במשמעות', 'cannot לעבר, can\'t להווה', 'cannot שלילי יותר', 'can\'t פורמלי יותר'],
        correctAnswer: 'אין הבדל במשמעות',
        explanationHe: 'תשובה נכונה: אין הבדל במשמעות. cannot פורמלי יותר, can\'t נפוץ יותר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'Before the operation, he _______ walk.',
        options: ['can\'t', 'couldn\'t', 'cans\'t', 'don\'t could'],
        correctAnswer: 'couldn\'t',
        explanationHe: 'תשובה נכונה: couldn\'t. לפני הניתוח (עבר) הוא לא יכול היה ללכת.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'Neither of them _______ (can\'t) solve the problem.',
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can (לא can\'t). Neither כבר שלילי, לכן לא צריך שלילה נוספת.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'תרגם: "לא יכולתי להאמין לעיניי"',
        options: ['I can\'t believe my eyes', 'I couldn\'t believe my eyes', 'I not could believe my eyes', 'I could not\'t believe my eyes'],
        correctAnswer: 'I couldn\'t believe my eyes',
        explanationHe: 'תשובה נכונה: I couldn\'t believe my eyes. חוסר יכולת בעבר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (can\'t) understand why she left.',
        correctAnswer: 'can\'t',
        explanationHe: 'תשובה נכונה: can\'t. אני לא יכול להבין למה היא עזבה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'You _______ park here. It\'s forbidden.',
        options: ['can\'t', 'couldn\'t', 'can', 'could'],
        correctAnswer: 'can\'t',
        explanationHe: 'תשובה נכונה: can\'t. אסור לחנות כאן - זה אסור (הווה).',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 12.7: Common Mistakes ====================
  {
    topicNumber: 12,
    subtopicNumber: '12.7',
    titleEn: 'Common Mistakes',
    titleHe: 'טעויות נפוצות',
    level: 'beginner',
    orderIndex: 7,
    theoryContentHe: `
<h2>טעויות נפוצות עם Can ו-Could</h2>

<p>הנה הטעויות הנפוצות ביותר והדרך לתקן אותן:</p>

<div class="rules">
  <h3>טעות 1: הוספת s בגוף שלישי</h3>
  <p>❌ She <strong>cans</strong> swim.</p>
  <p>✅ She <strong>can</strong> swim.</p>
  <p><em>פעלים מודאליים לא מקבלים s!</em></p>
</div>

<div class="rules">
  <h3>טעות 2: הוספת to אחרי can/could</h3>
  <p>❌ I can <strong>to</strong> speak English.</p>
  <p>✅ I can speak English.</p>
  <p><em>אחרי פועל מודאלי בא הפועל בצורת בסיס, בלי to!</em></p>
</div>

<div class="rules">
  <h3>טעות 3: שימוש ב-do/does בשאלות</h3>
  <p>❌ <strong>Do</strong> you can swim?</p>
  <p>✅ <strong>Can</strong> you swim?</p>
  <p><em>פעלים מודאליים לא צריכים do/does בשאלות!</em></p>
</div>

<div class="rules">
  <h3>טעות 4: שימוש ב-don't/doesn't בשלילה</h3>
  <p>❌ I <strong>don't can</strong> swim.</p>
  <p>✅ I <strong>can't</strong> swim.</p>
  <p><em>השלילה נוצרת על ידי הוספת not לפועל המודאלי!</em></p>
</div>

<div class="rules">
  <h3>טעות 5: כתיבת can not במקום cannot</h3>
  <p>❌ I <strong>can not</strong> come. (נדיר)</p>
  <p>✅ I <strong>cannot</strong> come.</p>
  <p>✅ I <strong>can't</strong> come.</p>
  <p><em>cannot נכתבת כמילה אחת!</em></p>
</div>

<div class="rules">
  <h3>טעות 6: בלבול בין can לבין could</h3>
  <p>❌ When I was young, I <strong>can</strong> run fast.</p>
  <p>✅ When I was young, I <strong>could</strong> run fast.</p>
  <p><em>can להווה, could לעבר!</em></p>
</div>

<div class="warning">
  <strong>זכור:</strong> פעלים מודאליים הם מיוחדים - הם לא מתנהגים כמו פעלים רגילים!
</div>
    `,
    exercises: [
      // Easy exercises (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['She cans swim', 'She can swim', 'She can swims', 'She can to swim'],
        correctAnswer: 'She can swim',
        explanationHe: 'תשובה נכונה: She can swim. can לא מקבל s והפועל אחריו בצורת בסיס.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט שגוי?',
        options: ['I can speak', 'He can to run', 'We can see', 'They can hear'],
        correctAnswer: 'He can to run',
        explanationHe: 'תשובה נכונה: He can to run שגוי. אחרי can לא באה to.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "She cans dance." → She _______ dance.',
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. פועל מודאלי לא מקבל s.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'איזו שאלה נכונה?',
        options: ['Do you can swim?', 'Can you swim?', 'Does he can swim?', 'Can he swims?'],
        correctAnswer: 'Can you swim?',
        explanationHe: 'תשובה נכונה: Can you swim? לא צריך do/does עם פעלים מודאליים.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "I don\'t can swim." → I _______ swim.',
        correctAnswer: 'can\'t',
        explanationHe: 'תשובה נכונה: can\'t. השלילה היא can\'t, לא don\'t can.',
        difficulty: 'easy'
      },
      // Medium exercises (6-12)
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'איזו שלילה נכונה?',
        options: ['I don\'t can', 'I can\'t', 'I no can', 'I can not\'t'],
        correctAnswer: 'I can\'t',
        explanationHe: 'תשובה נכונה: I can\'t. השלילה נוצרת עם cannot/can\'t.',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "He can to play piano." → He can _______ piano.',
        correctAnswer: 'play',
        explanationHe: 'תשובה נכונה: play. אחרי can בא הפועל בצורת בסיס, בלי to.',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'When I was young, I _______ run very fast.',
        options: ['can', 'could', 'cans', 'coulds'],
        correctAnswer: 'could',
        explanationHe: 'תשובה נכונה: could. יכולת בעבר (when I was young).',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'מה הטעות במשפט "Do she can cook?"',
        options: ['צריך Does', 'לא צריך Do/Does כלל', 'צריך cans', 'צריך cooking'],
        correctAnswer: 'לא צריך Do/Does כלל',
        explanationHe: 'תשובה נכונה: לא צריך Do/Does. השאלה הנכונה: Can she cook?',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "She doesn\'t can swim." → She _______ swim.',
        correctAnswer: 'can\'t',
        explanationHe: 'תשובה נכונה: can\'t. לא משתמשים ב-doesn\'t עם פעלים מודאליים.',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['I can not swim', 'I cannot swim', 'I can\'t swim', 'cannot ו-can\'t נכונים'],
        correctAnswer: 'cannot ו-can\'t נכונים',
        explanationHe: 'תשובה נכונה: cannot ו-can\'t שניהם נכונים. can not (שתי מילים) נדיר.',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "My brother cans drive." → My brother _______ drive.',
        correctAnswer: 'can',
        explanationHe: 'תשובה נכונה: can. פועל מודאלי לא מקבל s בגוף שלישי.',
        difficulty: 'medium'
      },
      // Hard exercises (13-20)
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'זהה את כל הטעויות: "She cans to swim"',
        options: ['cans שגוי', 'to שגוי', 'שתי הטעויות', 'אין טעויות'],
        correctAnswer: 'שתי הטעויות',
        explanationHe: 'תשובה נכונה: שתי הטעויות. can לא מקבל s ולא באה אחריו to.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "Does he can speak English?" → _______ he speak English?',
        correctAnswer: 'Can',
        explanationHe: 'תשובה נכונה: Can. לא צריך Does עם פעלים מודאליים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'מצא את המשפט הנכון היחיד:',
        options: ['She cans speak French', 'She can to speak French', 'She can speaks French', 'She can speak French'],
        correctAnswer: 'She can speak French',
        explanationHe: 'תשובה נכונה: She can speak French. היחיד ללא טעויות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'מהי הטעות ב: "Last year I can not swim"?',
        options: ['צריך could במקום can', 'צריך cannot', 'שתיהן', 'אין טעות'],
        correctAnswer: 'שתיהן',
        explanationHe: 'תשובה נכונה: שתי הטעויות. צריך could (עבר) ו-could not/couldn\'t.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "When I was a child, I can run fast." → When I was a child, I _______ run fast.',
        correctAnswer: 'could',
        explanationHe: 'תשובה נכונה: could. יכולת בעבר דורשת could, לא can.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'כמה טעויות יש במשפט: "She don\'t cans to swim"?',
        options: ['אחת', 'שתיים', 'שלוש', 'ארבע'],
        correctAnswer: 'שלוש',
        explanationHe: 'תשובה נכונה: 3 טעויות. 1) don\'t לא נדרש 2) cans צריך להיות can 3) to מיותר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: 'תקן את כל הטעויות: "He cans to plays piano" → He _______ _______ piano.',
        correctAnswer: 'can play',
        explanationHe: 'תשובה נכונה: can play. הסרת s מ-can, הסרת to, הסרת s מ-play.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'בחר את התיקון הנכון ל: "They doesn\'t can come"',
        options: ['They don\'t can come', 'They can\'t come', 'They cannot to come', 'They cans not come'],
        correctAnswer: 'They can\'t come',
        explanationHe: 'תשובה נכונה: They can\'t come. השלילה הנכונה היא can\'t/cannot.',
        difficulty: 'hard'
      }
    ]
  }
];

// Seed function
async function seedTopic12() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    console.log('Starting to seed Topic 12: Can / Could...');

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
    console.log('✅ Topic 12: Can / Could seeded successfully!');
    console.log(`   Total: ${lessonsData.length} lessons created`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding Topic 12:', error);
    throw error;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  seedTopic12()
    .then(() => {
      console.log('Seeding complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedTopic12, lessonsData };
