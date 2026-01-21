const { pool } = require('../../config/database');
const Lesson = require('../../models/Lesson');
const Exercise = require('../../models/Exercise');

// Topic 6: Demonstratives (מילות הצבעה)
const lessonsData = [
  // ==================== SUBTOPIC 6.1: This (singular, near) ====================
  {
    topicNumber: 6,
    subtopicNumber: '6.1',
    titleEn: 'This - Singular, Near',
    titleHe: 'This - יחיד, קרוב',
    level: 'beginner',
    orderIndex: 1,
    theoryContentHe: `
<h2>This - זה/זאת (יחיד, קרוב)</h2>

<p>המילה "This" משמשת להצביע על דבר אחד שקרוב אלינו.</p>

<div class="rules">
  <p><strong>כללי שימוש:</strong></p>
  <ul>
    <li>מצביעים על דבר <strong>אחד</strong> (singular)</li>
    <li>הדבר נמצא <strong>קרוב</strong> אלינו</li>
    <li>This + שם עצם יחיד</li>
    <li>This כשם תואר: This book (הספר הזה)</li>
    <li>This ככינוי: This is my pen. (זה העט שלי)</li>
  </ul>
</div>

<div class="examples">
  <p><strong>דוגמאות:</strong></p>
  <p><strong>This book</strong> is mine. - הספר הזה שלי</p>
  <p><strong>This</strong> is my pen. - זה העט שלי</p>
  <p><strong>This apple</strong> is red. - התפוח הזה אדום</p>
  <p><strong>This</strong> is my friend Tom. - זה החבר שלי טום</p>
  <p>I like <strong>this song</strong>. - אני אוהב את השיר הזה</p>
</div>

<div class="warning">
  <strong>זכור:</strong> This הוא רק ליחיד! לרבים משתמשים ב-These
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: '_______ music is too loud! Can you turn it down?',
        options: ['This', 'These', 'Those', 'It'],
        correctAnswer: 'This',
        explanationHe: 'תשובה נכונה: This\nכלל: This משמש עם שמות עצם בלתי ספירים (uncountable nouns) כמו music, water, information כאשר מדברים על משהו קרוב.\nשים לב: למרות ש-music הוא בלתי ספיר, אנחנו משתמשים ב-This (ולא These) כי זה תמיד נחשב ליחיד.\nטעות נפוצה: תלמידים חושבים שצריך These כי "מוזיקה" נשמעת כמו רבים, אבל היא תמיד יחיד באנגלית.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: '_______ information you gave me was very helpful.',
        options: ['This', 'These', 'Those', 'They'],
        correctAnswer: 'This',
        explanationHe: 'תשובה נכונה: This\nכלל: information היא שם עצם בלתי ספיר שתמיד בצורת יחיד, לכן משתמשים ב-This כשהיא קרובה בזמן או בהקשר.\nשים לב: למרות שמדברים על "מידע" שיכול להכיל פריטים רבים, המילה information היא תמיד יחיד באנגלית.\nטעות נפוצה: להשתמש ב-These כי חושבים על "מידעים" ברבים, אך באנגלית זה תמיד information ביחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: '_______ (this/it) is the book I was telling you about.',
        correctAnswer: 'This',
        explanationHe: 'תשובה נכונה: This\nכלל: משתמשים ב-This כשם כינוי (pronoun) כשמציגים או מצביעים על משהו לראשונה, במיוחד כשמראים אותו למישהו. It משמש כשכבר דיברנו על הדבר.\nשים לב: This משמש להצגה ולהדגשה (introducing/emphasizing), בעוד It משמש להמשך התייחסות לאחר שכבר הוצג הדבר.\nטעות נפוצה: להשתמש ב-It במקום This כשרוצים להציג או להראות משהו חדש לראשונה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'בחר את המשפט הנכון: _______ friend of mine is a doctor.',
        options: ['This', 'This is', 'These', 'Those'],
        correctAnswer: 'This',
        explanationHe: 'תשובה נכונה: This\nכלל: כאשר This בא לפני שם עצם (This friend), הוא משמש כשם תואר (adjective) ולא ככינוי, לכן לא צריך פועל אחריו ישירות.\nשים לב: ההבדל בין "This friend is..." (This כתואר) לבין "This is my friend" (This ככינוי). כאן This מתאר את friend.\nטעות נפוצה: להוסיף is אחרי This כשיש שם עצם, מה שיוצר "This is friend" - משפט שגוי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: '_______ morning I woke up at 6 AM.',
        options: ['This', 'These', 'That', 'Those'],
        correctAnswer: 'This',
        explanationHe: 'תשובה נכונה: This\nכלל: This משמש בביטויי זמן כשמדברים על התקופה הנוכחית: this morning, this week, this month, this year.\nשים לב: "This morning" פירושו "הבוקר" (של היום הנוכחי), בעוד "That morning" פירושו "באותו בוקר" (בעבר).\nטעות נפוצה: להשתמש ב-That כשמדברים על הבוקר של היום הנוכחי, במקום This.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: '_______ (this/these) week has been very busy for me.',
        correctAnswer: 'This',
        explanationHe: 'תשובה נכונה: This\nכלל: week הוא שם עצם יחיד, ובביטויי זמן נוכחיים משתמשים ב-this week (השבוע), this month (החודש), וכו\'.\nשים לב: למרות שבעברית אומרים "השבוע", באנגלית אין את ה-the אלא This week.\nטעות נפוצה: להשתמש ב-These בגלל שבעברית "שבוע" נשמע כאילו יכול להיות רבים, אבל a week הוא תמיד יחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'Who is _______? - _______ is my colleague.',
        options: ['this/This', 'this/He', 'these/They', 'that/That'],
        correctAnswer: 'this/This',
        explanationHe: 'תשובה נכונה: this/This\nכלל: בשאלות "Who is this?" ובתשובות משתמשים ב-This עבור אנשים קרובים (גם פיזית וגם בהקשר). This מתאים יותר מ-He/She כשמציגים מישהו.\nשים לב: למרות שמדובר באדם, אנחנו משתמשים ב-This (ולא He/She) כשמציגים או שואלים "מי זה?", כי This משמש להצגה.\nטעות נפוצה: להשתמש ב-He/She במקום This בשאלות והצגות של אנשים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'I need _______ (this/it) pen right now. Where did I put it?',
        correctAnswer: 'this',
        explanationHe: 'תשובה נכונה: this\nכלל: כאשר רוצים להתייחס לדבר ספציפי שקרוב או רלוונטי כרגע, משתמשים ב-this pen (כשם תואר), ולא "it pen".\nשים לב: this pen = העט הספציפי הזה, בעוד it pen הוא שגוי דקדוקית. It יכול להופיע רק ככינוי עצמאי, לא לפני שם עצם.\nטעות נפוצה: לנסות להשתמש ב-it לפני שם עצם, אך it יכול להיות רק כינוי עצמאי (it is good), לא שם תואר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'The pronunciation of "this" is: /ðɪs/. Where is the stress?',
        options: ['אין הטעמה, זו מילה של הברה אחת', 'על ה-th', 'על ה-is', 'על שתי ההברות'],
        correctAnswer: 'אין הטעמה, זו מילה של הברה אחת',
        explanationHe: 'תשובה נכונה: אין הטעמה, זו מילה של הברה אחת\nכלל: This היא מילת הצבעה של הברה אחת (/ðɪs/), ולכן אין בעיית הטעמה. יש להקפיד על ההגייה הנכונה של צליל ה-th.\nשים לב: הצליל /ð/ (th רך) הוא חשוב - הלשון יוצאת קלות בין השיניים. זה לא /d/ או /z/.\nטעות נפוצה: להגות This כמו "dis" במקום עם צליל ה-th הנכון, או לחפש הטעמה במילה של הברה אחת.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: '_______ (this/these) advice was really useful.',
        correctAnswer: 'This',
        explanationHe: 'תשובה נכונה: This\nכלל: advice היא שם עצם בלתי ספיר שתמיד בצורת יחיד, לכן משתמשים ב-This (לא These).\nשים לב: למרות שבעברית "עצות" הוא רבים, באנגלית advice היא תמיד יחיד. רבים יהיה pieces of advice או some advice.\nטעות נפוצה: להשתמש ב-These כי בעברית חושבים על "עצות" ברבים, אבל באנגלית advice תמיד יחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'בחר שימוש נכון של This כשם כינוי (pronoun):',
        options: ['This book is great', 'This is great', 'This great book', 'This the book'],
        correctAnswer: 'This is great',
        explanationHe: 'תשובה נכונה: This is great\nכלל: כשם כינוי, This עומד לבד ואחריו פועל (is/was וכו\'), ללא שם עצם ישירות אחריו.\nשים לב: "This book" = This כשם תואר, "This is" = This כשם כינוי. הכינוי תמיד בא עם פועל, לא עם שם עצם.\nטעות נפוצה: לבלבל בין This כשם תואר (This book) לבין This כשם כינוי (This is).',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: '_______ year we are planning to travel to Japan.',
        options: ['This', 'These', 'That', 'The'],
        correctAnswer: 'This',
        explanationHe: 'תשובה נכונה: This\nכלל: בביטויי זמן עתידיים או נוכחיים קרובים משתמשים ב-this: this year, this summer, this coming Monday.\nשים לב: "This year" משמש גם לשנה הנוכחית וגם לשנה הקרובה בתכנון עתידי, בהתאם להקשר.\nטעות נפוצה: להשתמש ב-the year כשמתכוונים לשנה הנוכחית, במקום ההבעה הנכונה this year.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'fill_in_blank',
        questionTextHe: 'Is _______ (this/it) your first time in New York? (in a conversation)',
        correctAnswer: 'this',
        explanationHe: 'תשובה נכונה: this\nכלל: בשאלות הצגה או כשמתייחסים למצב/חוויה נוכחיים, This טבעי יותר מ-it. "Is this your first time?" הוא ביטוי מקובל.\nשים לב: This מתאים למצבים של "עכשיו", "הפעם הזאת", בעוד It מתאים יותר להתייחסות כללית או לאחר שכבר הוקם ההקשר.\nטעות נפוצה: להשתמש ב-it בשאלות הצגה, אבל this טבעי ומקובל יותר כשמציגים נושא או מצב חדש.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'multiple_choice',
        questionTextHe: 'באיזה משפט This משמש עם אדם בצורה נכונה?',
        options: ['This man he is my teacher', 'This is my teacher', 'This are my teacher', 'This teacher is he'],
        correctAnswer: 'This is my teacher',
        explanationHe: 'תשובה נכונה: This is my teacher\nכלל: כשמציגים אדם, משתמשים ב-"This is + [person]" כאשר This הוא כינוי, או "This + [person] is..." כאשר This הוא שם תואר.\nשים לב: אסור להשתמש ב-This וב-he/she ביחד באותו משפט ("This man he..." - שגוי). בוחרים אחד מהם.\nטעות נפוצה: לשלב This עם כינוי אישי (he/she) באותו משפט, מה שיוצר כפילות שגויה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'fill_in_blank',
        questionTextHe: 'I love _______ (this/these) song! It\'s my favorite.',
        correctAnswer: 'this',
        explanationHe: 'תשובה נכונה: this\nכלל: song הוא שם עצם ספיר יחיד, לכן משתמשים ב-this (לא these שהוא לרבים).\nשים לב: כאשר this בא לפני שם עצם (this song), הוא מתפקד כשם תואר ומגדיר איזה שיר בדיוק.\nטעות נפוצה: להתבלבל ולחשוב ש-song יכול להיות רבים, אבל song הוא יחיד ו-songs הוא רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט מראה שימוש נכון של This עם uncountable noun?',
        options: ['This waters are clean', 'These water is clean', 'This water is clean', 'This water are clean'],
        correctAnswer: 'This water is clean',
        explanationHe: 'תשובה נכונה: This water is clean\nכלל: water הוא שם עצם בלתי ספיר ותמיד יחיד, לכן: This water + is (לא are, לא these).\nשים לב: עם uncountable nouns תמיד משתמשים ב-This/That (יחיד) ובפועל יחיד (is), אף פעם לא These/Those או are.\nטעות נפוצה: לחשוב ש-water יכול להיות רבים, או להשתמש ב-are כי מדובר ב"מים" שברבים בעברית.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: '_______ (this/these) coffee tastes amazing!',
        correctAnswer: 'This',
        explanationHe: 'תשובה נכונה: This\nכלל: coffee (כמשקה) הוא שם עצם בלתי ספיר ביחיד, לכן This. גם הפועל הוא tastes (יחיד), לא taste.\nשים לב: coffee יכול להיות ספיר (a coffee = כוס קפה אחת) או בלתי ספיר (coffee = הקפה כחומר). כאן, "tastes" מצביע על יחיד.\nטעות נפוצה: להשתמש ב-These כי חושבים על כמות או כוסות מרובות, אבל כאן coffee הוא יחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'בחר את ההבדל הנכון בין this לבין it:',
        options: [
          'this = רחוק, it = קרוב',
          'this = הצגה/הדגשה, it = התייחסות רגילה',
          'this = רבים, it = יחיד',
          'this = פועל, it = שם עצם'
        ],
        correctAnswer: 'this = הצגה/הדגשה, it = התייחסות רגילה',
        explanationHe: 'תשובה נכונה: this = הצגה/הדגשה, it = התייחסות רגילה\nכלל: This משמש כשרוצים להציג, להראות, או להדגיש משהו. It משמש להתייחסות רגילה לאחר שהדבר כבר הוזכר.\nשים לב: "This is a book" (מציגים לראשונה), "It is interesting" (מתייחסים לספר שכבר הוזכר).\nטעות נפוצה: להשתמש ב-it בהצגות ראשוניות, כשמציגים או מראים משהו חדש לראשונה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: 'Listen to _______ (this/these)! This is amazing news.',
        correctAnswer: 'this',
        explanationHe: 'תשובה נכונה: this\nכלל: כשאומרים "Listen to this!" - This משמש ככינוי עצמאי המתייחס למידע, סיטואציה, או חדשות. זה לא מתייחס לשם עצם ספציפי.\nשים לב: "Listen to this" הוא ביטוי מקובל שמשמעו "תקשיב לזה", "שמע את זה". This כאן הוא כינוי, לא שם תואר.\nטעות נפוצה: לחשוב שצריך these כי מדובר ב"חדשות" שנשמע רבים, אבל This כאן מתייחס למידע כללי או למצב.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'בחר משפט שבו This משמש בהקשר של זמן (temporal context):',
        options: [
          'This book is on the table',
          'This person is my friend',
          'This summer we went to the beach',
          'This car is expensive'
        ],
        correctAnswer: 'This summer we went to the beach',
        explanationHe: 'תשובה נכונה: This summer we went to the beach\nכלל: This משמש בביטויי זמן כמו: this morning, this week, this month, this year, this summer - כולם מתייחסים לתקופה נוכחית או קרובה.\nשים לב: "This summer" יכול להתייחס לקיץ הנוכחי (if currently summer) או לקיץ הקרוב/האחרון (בהתאם להקשר).\nטעות נפוצה: לא להכיר בשימוש של This בביטויי זמן, ולחשוב שהוא רק למיקום פיזי קרוב.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 6.2: That (singular, far) ====================
  {
    topicNumber: 6,
    subtopicNumber: '6.2',
    titleEn: 'That - Singular, Far',
    titleHe: 'That - יחיד, רחוק',
    level: 'beginner',
    orderIndex: 2,
    theoryContentHe: `
<h2>That - ההוא/ההיא (יחיד, רחוק)</h2>

<p>המילה "That" משמשת להצביע על דבר אחד שרחוק מאיתנו.</p>

<div class="rules">
  <p><strong>כללי שימוש:</strong></p>
  <ul>
    <li>מצביעים על דבר <strong>אחד</strong> (singular)</li>
    <li>הדבר נמצא <strong>רחוק</strong> מאיתנו</li>
    <li>That + שם עצם יחיד</li>
    <li>That כשם תואר: That book (הספר ההוא)</li>
    <li>That ככינוי: That is my house. (זה הבית שלי)</li>
  </ul>
</div>

<div class="examples">
  <p><strong>דוגמאות:</strong></p>
  <p><strong>That book</strong> is yours. - הספר ההוא שלך</p>
  <p><strong>That</strong> is your pen. - זה העט שלך</p>
  <p><strong>That car</strong> is expensive. - המכונית ההיא יקרה</p>
  <p><strong>That</strong> is my house. - זה הבית שלי (רחוק)</p>
  <p>I don't like <strong>that movie</strong>. - אני לא אוהב את הסרט ההוא</p>
</div>

<div class="warning">
  <strong>זכור:</strong> That הוא רק ליחיד! לרבים משתמשים ב-Those
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'Do you see _______ building over there? It looks very old.',
        options: ['that', 'this', 'those', 'these'],
        correctAnswer: 'that',
        explanationHe: 'תשובה נכונה: that\nכלל: That משמש עם שם עצם יחיד ספיר כשהדבר רחוק פיזית (over there מצביע על מרחק).\nשים לב: "over there" הוא ביטוי שמעיד על מרחק, ולכן תמיד נשתמש ב-That/Those, לא This/These.\nטעות נפוצה: להשתמש ב-this כשיש ביטוי של מרחק כמו "over there", אבל this הוא רק לדברים קרובים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: '_______ water in the lake looks dirty. (The lake is far away)',
        options: ['That', 'These', 'Those', 'This'],
        correctAnswer: 'That',
        explanationHe: 'תשובה נכונה: That\nכלל: water הוא שם עצם בלתי ספיר ותמיד יחיד, לכן משתמשים ב-That (לא Those) כשהוא רחוק.\nשים לב: גם עם uncountable nouns רחוקים משתמשים ב-That (יחיד), לא ב-Those שהוא לרבים בלבד.\nטעות נפוצה: לחשוב שצריך Those כי "מים" נשמע רבים בעברית, אבל water תמיד יחיד באנגלית.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: '_______ (that/it) was the best day of my life. (referring to a specific past day)',
        correctAnswer: 'That',
        explanationHe: 'תשובה נכונה: That\nכלל: That משמש כשמתייחסים לזמן רחוק (בעבר), במיוחד כשרוצים להדגיש או להצביע על יום/תקופה ספציפית.\nשים לב: That מדגיש ומצביע על "אותו יום", בעוד It היה פחות מדגיש. That מוסיף משמעות של "אותו יום הספציפי".\nטעות נפוצה: להשתמש רק ב-It ולא להכיר באפשרות להשתמש ב-That כשרוצים להדגיש זמן או אירוע ספציפי בעבר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'I will never forget _______ moment when we first met.',
        options: ['that', 'this', 'those', 'these'],
        correctAnswer: 'that',
        explanationHe: 'תשובה נכונה: that\nכלל: That משמש כשמתייחסים לרגע או אירוע בעבר, במיוחד כשהוא רחוק בזמן או בזיכרון.\nשים לב: למרות שמדברים על זיכרון, משתמשים ב-that (לא this) כי הרגע כבר עבר והוא "רחוק" בזמן.\nטעות נפוצה: להשתמש ב-this לזיכרונות או אירועים בעבר, אבל this מתאים לדברים נוכחיים או קרובים בזמן.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'The book _______ I read last year was amazing. (that as relative pronoun)',
        options: ['that', 'what', 'which', 'כל התשובות נכונות'],
        correctAnswer: 'that',
        explanationHe: 'תשובה נכונה: that\nכלל: That יכול לשמש גם ככינוי יחסי (relative pronoun) שמחבר בין שני חלקי משפט, בדומה ל-which.\nשים לב: That ככינוי יחסי (the book that I read) זה שימוש שונה מ-That כמילת הצבעה (that book). שניהם נכונים אבל תפקידים שונים.\nטעות נפוצה: לא להבחין בין that כמילת הצבעה לבין that ככינוי יחסי, או לחשוב ש-what יכול לשמש כאן.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: '_______ (that/those) information seems outdated. (distant/old)',
        correctAnswer: 'That',
        explanationHe: 'תשובה נכונה: That\nכלל: information היא שם עצם בלתי ספיר שתמיד יחיד, לכן That (לא Those). המרחק כאן הוא זמני (ישן/מיושן).\nשים לב: מרחק יכול להיות פיזי (רחוק במרחב) או זמני (רחוק בזמן, ישן). שניהם משתמשים ב-That/Those.\nטעות נפוצה: להשתמש ב-Those עם information, אבל זה תמיד יחיד ולכן דורש That.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'In _______ time, people believed the earth was flat.',
        options: ['that', 'this', 'those', 'these'],
        correctAnswer: 'that',
        explanationHe: 'תשובה נכונה: that\nכלל: "That time" או "at that time" משמשים כביטוי זמן המתייחס לעבר רחוק, לתקופה שעברה.\nשים לב: "that time" = אותה תקופה (בעבר), "this time" = הפעם, עכשיו (נוכח). ההבדל הוא במרחק הזמני.\nטעות נפוצה: להשתמש ב-this כשמדברים על עבר, אבל this מתאים לזמן נוכחי או קרוב.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'Who is _______ (that/this) person standing by the door? (far from speaker)',
        correctAnswer: 'that',
        explanationHe: 'תשובה נכונה: that\nכלל: כשמצביעים על אדם שנמצא רחוק מהדובר, משתמשים ב-that (לא this). המרחק הפיזי קובע.\nשים לב: למרות שמדובר באדם, That הוא נכון כי האדם רחוק. This היה נכון אם האדם היה קרוב.\nטעות נפוצה: לחשוב ש-that אינו מנומס כשמדברים על אנשים, אבל זה תקין וקובע לפי מרחק.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: '_______ was a difficult decision to make. (past decision)',
        options: ['That', 'This', 'It', 'That/It שניהם נכונים'],
        correctAnswer: 'That/It שניהם נכונים',
        explanationHe: 'תשובה נכונה: That/It שניהם נכונים\nכלל: כשמתייחסים להחלטה או למצב בעבר, אפשר להשתמש ב-That (מדגיש את אותה החלטה) או ב-It (התייחסות רגילה).\nשים לב: That מוסיף הדגשה והצבעה ספציפית, בעוד It נייטרלי יותר. שניהם תקינים דקדוקית.\nטעות נפוצה: לחשוב שרק אחד מהם נכון, אבל בהקשרים מסוימים שניהם אפשריים עם הבדל עדין במשמעות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: '_______ (that/this) car over there is mine.',
        correctAnswer: 'That',
        explanationHe: 'תשובה נכונה: That\nכלל: "over there" מעיד על מרחק פיזי, לכן That car (לא This car).\nשים לב: הביטוי "over there" הוא רמז ברור שצריך That/Those כי הוא מתאר מרחק.\nטעות נפוצה: להתעלם מביטויי המרחק במשפט ולהשתמש ב-This אוטומטית.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'What is _______? I can\'t see it clearly from here.',
        options: ['that', 'this', 'those', 'these'],
        correctAnswer: 'that',
        explanationHe: 'תשובה נכונה: that\nכלל: כשאנו רחוקים מהאובייקט (from here מעיד על מרחק) ושואלים "מה זה?", משתמשים ב-that.\nשים לב: "from here" מדגיש שיש מרחק בין הדובר לבין האובייקט, ולכן that מתאים יותר מ-this.\nטעות נפוצה: להשתמש ב-this אוטומטית בשאלות "What is...?", מבלי לשים לב למרחק בין הדובר לאובייקט.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'Remember _______ (that/this) day we went to the beach? (past memory)',
        correctAnswer: 'that',
        explanationHe: 'תשובה נכונה: that\nכלל: כשמתייחסים לזיכרון מהעבר, משתמשים ב-that day (אותו יום), לא this day.\nשים לב: "that day" משמש לאירוע ספציפי בעבר, בעוד "this day" לא מקובל באנגלית (אומרים "today" במקום).\nטעות נפוצה: להשתמש ב-this כשמדברים על זיכרונות, אבל זיכרונות הם "רחוקים" בזמן ולכן דורשים that.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: '_______ mountain in the distance looks beautiful.',
        options: ['That', 'This', 'Those', 'These'],
        correctAnswer: 'That',
        explanationHe: 'תשובה נכונה: That\nכלל: mountain הוא יחיד, ו-"in the distance" מעיד על מרחק רב, לכן That.\nשים לב: "in the distance" הוא ביטוי שתמיד מצריך That/Those כי הוא מתאר דבר רחוק מאוד.\nטעות נפוצה: להשתמש ב-This למרות ביטוי המרחק הברור במשפט.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'At _______ (that/this) moment, I realized I was wrong. (specific past moment)',
        correctAnswer: 'that',
        explanationHe: 'תשובה נכונה: that\nכלל: "at that moment" הוא ביטוי מקובל לרגע ספציפי בעבר. That מתאים למרחק זמני.\nשים לב: "at that moment" = באותו רגע (עבר), "at this moment" = ברגע זה (נוכח).\nטעות נפוצה: להשתמש ב-this גם כשמדברים בעבר, אבל this מתאים לנוכח.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט מראה את that כ-relative pronoun (not demonstrative)?',
        options: [
          'That book is interesting',
          'I like the book that you gave me',
          'That is my book',
          'Look at that over there'
        ],
        correctAnswer: 'I like the book that you gave me',
        explanationHe: 'תשובה נכונה: I like the book that you gave me\nכלל: that ככינוי יחסי מחבר בין שני חלקי משפט (the book + you gave me). זה לא מילת הצבעה כאן.\nשים לב: "the book that you gave me" = הספר ש-/אשר נתת לי. ה-that כאן מחליף את which או who.\nטעות נפוצה: לבלבל בין that כמילת הצבעה (that book) לבין that ככינוי יחסי (the book that...).',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: '_______ (that/those) advice you gave me was wrong. (old advice)',
        correctAnswer: 'That',
        explanationHe: 'תשובה נכונה: That\nכלל: advice היא בלתי ספירה ותמיד יחיד, לכן That (לא Those). הייעוץ רחוק בזמן (ישן).\nשים לב: advice + was (פועל יחיד), לא were. זה מאשר שצריך That ולא Those.\nטעות נפוצה: להשתמש ב-Those כי "עצות" נשמע רבים, אבל advice תמיד יחיד באנגלית.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'Can you pass me _______ book on the top shelf? (shelf is high and far)',
        options: ['this', 'that', 'these', 'those'],
        correctAnswer: 'that',
        explanationHe: 'תשובה נכונה: that\nכלל: book הוא יחיד, והוא רחוק (על מדף גבוה), לכן that book.\nשים לב: "top shelf" מרמז על מרחק (גובה וריחוק), ולכן דורש that/those.\nטעות נפוצה: להשתמש ב-this כי מבקשים את הספר "לפה", אבל הקריטריון הוא איפה הספר נמצא עכשיו, לא לאן הוא הולך.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'I prefer _______ (that/this) music to modern music. (old/classical music)',
        correctAnswer: 'that',
        explanationHe: 'תשובה נכונה: that\nכלל: music הוא בלתי ספיר ויחיד. כשמתייחסים למוזיקה ישנה/קלאסית (רחוקה בזמן), that מתאים.\nשים לב: המרחק הזמני (מוזיקה ישנה) מצדיק שימוש ב-that. זה לא מרחק פיזי אלא זמני.\nטעות נפוצה: לחשוב ש-that רק למרחק פיזי, אבל זה גם למרחק זמני או תרבותי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'איזה ביטוי מראה שימוש נכון של that בהקשר זמני?',
        options: ['That morning (future)', 'That day (past)', 'That week (now)', 'That year (next year)'],
        correctAnswer: 'That day (past)',
        explanationHe: 'תשובה נכונה: That day (past)\nכלל: ביטויי זמן עם That מתייחסים לעבר: that day, that morning, that year = אותו יום/בוקר/שנה (שכבר עבר).\nשים לב: This משמש לנוכח/עתיד קרוב (this week, this year), בעוד That משמש לעבר (that day, at that time).\nטעות נפוצה: להשתמש ב-That לעתיד או נוכח, אבל זה לעבר. לעתיד/נוכח משתמשים ב-This.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'Look at _______ (that/this) star in the sky! Can you see it?',
        correctAnswer: 'that',
        explanationHe: 'תשובה נכונה: that\nכלל: star הוא יחיד, והוא רחוק מאוד (בשמיים), לכן that star.\nשים לב: כוכבים, הרים רחוקים, עננים - כל דברים שרחוקים באופן טבעי מקבלים that/those.\nטעות נפוצה: להשתמש ב-this כשמצביעים על משהו, גם אם הוא רחוק. צריך לשים לב למרחק בפועל.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 6.3: These (plural, near) ====================
  {
    topicNumber: 6,
    subtopicNumber: '6.3',
    titleEn: 'These - Plural, Near',
    titleHe: 'These - רבים, קרוב',
    level: 'beginner',
    orderIndex: 3,
    theoryContentHe: `
<h2>These - אלה (רבים, קרוב)</h2>

<p>המילה "These" משמשת להצביע על כמה דברים שקרובים אלינו.</p>

<div class="rules">
  <p><strong>כללי שימוש:</strong></p>
  <ul>
    <li>מצביעים על <strong>כמה דברים</strong> (plural)</li>
    <li>הדברים נמצאים <strong>קרוב</strong> אלינו</li>
    <li>These + שם עצם רבים</li>
    <li>These כשם תואר: These books (הספרים האלה)</li>
    <li>These ככינוי: These are my pens. (אלה העטים שלי)</li>
  </ul>
</div>

<div class="examples">
  <p><strong>דוגמאות:</strong></p>
  <p><strong>These books</strong> are mine. - הספרים האלה שלי</p>
  <p><strong>These</strong> are my pens. - אלה העטים שלי</p>
  <p><strong>These apples</strong> are fresh. - התפוחים האלה טריים</p>
  <p><strong>These</strong> are my friends. - אלה החברים שלי</p>
  <p>I like <strong>these shoes</strong>. - אני אוהב את הנעליים האלה</p>
</div>

<div class="warning">
  <strong>זכור:</strong> These הוא רק לרבים! ליחיד משתמשים ב-This
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: '_______ books are mine. I bought them yesterday.',
        options: ['This', 'These', 'That', 'Those'],
        correctAnswer: 'These',
        explanationHe: 'תשובה נכונה: These\nכלל: books הוא שם עצם רבים, והספרים קרובים לדובר (הם שלו, אצלו), לכן These.\nשים לב: These משמש רק עם שמות עצם רבים. עם יחיד היינו משתמשים ב-This.\nטעות נפוצה: להשתמש ב-This עם רבים, אבל This הוא רק ליחיד. לרבים קרובים תמיד These.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: '_______ children are playing in the park near us.',
        options: ['This', 'These', 'That', 'Those'],
        correctAnswer: 'These',
        explanationHe: 'תשובה נכונה: These\nכלל: children הוא רבים לא תקין (irregular plural של child), ו-"near us" מעיד על קרבה, לכן These.\nשים לב: children, people, men, women - כולם רבים לא תקינים שדורשים These (קרוב) או Those (רחוק).\nטעות נפוצה: להתבלבל עם רבים לא תקינים ולהשתמש ב-This, אבל אם זה רבים - תמיד These/Those.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: '_______ (these/they) are my best friends.',
        correctAnswer: 'These',
        explanationHe: 'תשובה נכונה: These\nכלל: כשמציגים אנשים או דברים, משתמשים ב-These are (לא They are). These משמש להצגה והצבעה.\nשים לב: "These are my friends" = אלה החברים שלי (הצגה). "They are my friends" = הם החברים שלי (התייחסות רגילה).\nטעות נפוצה: להשתמש ב-They במקום These בהצגות, אבל These מתאים יותר כשמצביעים או מציגים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'I love _______ shoes! Where did you buy them?',
        options: ['this', 'these', 'that', 'those'],
        correctAnswer: 'these',
        explanationHe: 'תשובה נכונה: these\nכלל: shoes הוא רבים (נעליים תמיד זוג), והנעליים קרובות (מסתכלים עליהן, אצל מישהו קרוב), לכן these.\nשים לב: shoes, pants, glasses, scissors - כולם תמיד רבים באנגלית, ולכן דורשים these/those.\nטעות נפוצה: לחשוב ש-shoes יכול להיות יחיד, אבל באנגלית זה תמיד רבים (a pair of shoes ביחיד).',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: '_______ (these/this) people are very nice.',
        correctAnswer: 'These',
        explanationHe: 'תשובה נכונה: These\nכלל: people הוא רבים של person, לכן These (לא This). גם הפועל are (רבים) מאשר זאת.\nשים לב: people + are = רבים, ולכן These. person + is = יחיד, ולכן This/That.\nטעות נפוצה: להשתמש ב-This עם people כי "אנשים" נשמע כמו מילה אחת, אבל זה רבים באנגלית.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: '_______ are the best apples in the market! (pointing to nearby apples)',
        options: ['This', 'These', 'They', 'Those'],
        correctAnswer: 'These',
        explanationHe: 'תשובה נכונה: These\nכלל: apples הוא רבים, וכשמצביעים על משהו קרוב (in the market, nearby), משתמשים ב-These.\nשים לב: These משמש הן כשם תואר (these apples) והן ככינוי (These are...). כאן הוא ככינוי.\nטעות נפוצה: להשתמש ב-They כי חושבים על "הם", אבל These מתאים יותר כשמצביעים על משהו.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: '_______ (these/those) days I am very busy with work. (referring to current period)',
        correctAnswer: 'These',
        explanationHe: 'תשובה נכונה: These\nכלל: "These days" הוא ביטוי קבוע שמשמעו "בימים אלה", "לאחרונה", "בתקופה האחרונה" (זמן נוכחי).\nשים לב: "These days" = עכשיו, לאחרונה. "Those days" = בימים ההם (בעבר רחוק).\nטעות נפוצה: להשתמש ב-Those כשמדברים על ההווה, אבל Those מתאים לעבר רחוק.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'Can you help me carry _______ bags? They are heavy.',
        options: ['this', 'these', 'that', 'those'],
        correctAnswer: 'these',
        explanationHe: 'תשובה נכונה: these\nכלל: bags הוא רבים, והתיקים קרובים (אצל הדובר, שלו), לכן these bags.\nשים לב: "They are heavy" מאשר שמדובר ברבים (They, לא It), וזה תואם ל-these.\nטעות נפוצה: להשתמש ב-this כי חושבים על "התיקים" כקבוצה אחת, אבל bags הוא רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: '_______ (these/this) flowers smell wonderful!',
        correctAnswer: 'These',
        explanationHe: 'תשובה נכונה: These\nכלל: flowers הוא רבים, ולכן These. גם הפועל smell (ללא s) מעיד על רבים.\nשים לב: flowers + smell = רבים, לכן These. flower + smells = יחיד, לכן This/That.\nטעות נפוצה: להשתמש ב-This כי חושבים על "זר פרחים" כדבר אחד, אבל flowers הוא רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט מראה שימוש נכון של These כשם כינוי?',
        options: ['These books are good', 'These are good', 'These good books', 'These is good'],
        correctAnswer: 'These are good',
        explanationHe: 'תשובה נכונה: These are good\nכלל: כשם כינוי, These עומד לבד ואחריו פועל (are), ללא שם עצם ישירות אחריו.\nשים לב: "These books" = These כשם תואר. "These are" = These כשם כינוי.\nטעות נפוצה: לבלבל בין These כשם תואר (These books) לבין These כשם כינוי (These are).',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'fill_in_blank',
        questionTextHe: '_______ (these/they) glasses are mine. I left them here.',
        correctAnswer: 'These',
        explanationHe: 'תשובה נכונה: These\nכלל: glasses (משקפיים) הוא תמיד רבים באנגלית, וכשמצביעים עליהם קרוב משתמשים ב-These.\nשים לב: glasses, pants, scissors - שמות עצם שתמיד רבים ודורשים these/those (לא this/that).\nטעות נפוצה: להשתמש ב-They כי משקפיים הם "הם", אבל These מדויק יותר כשמצביעים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: '_______ men are my colleagues.',
        options: ['This', 'These', 'That', 'Those'],
        correctAnswer: 'These',
        explanationHe: 'תשובה נכונה: These\nכלל: men הוא רבים לא תקין של man, וכשהאנשים קרובים (עמיתים שלי, אצלי), משתמשים ב-These.\nשים לב: man = יחיד (This/That man), men = רבים (These/Those men).\nטעות נפוצה: להתבלבל עם רבים לא תקינים ולהשתמש ב-This, אבל men הוא בבירור רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'fill_in_blank',
        questionTextHe: 'Look at _______ (these/this) beautiful photos!',
        correctAnswer: 'these',
        explanationHe: 'תשובה נכונה: these\nכלל: photos הוא רבים (צורת הרבים של photo), וכשמראים אותם (Look at) הם קרובים, לכן these.\nשים לב: photo = יחיד, photos = רבים. photos דורש these/those.\nטעות נפוצה: להשתמש ב-this כי חושבים על "אלבום תמונות", אבל photos הוא רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'multiple_choice',
        questionTextHe: '_______ times are difficult for everyone. (current difficult period)',
        options: ['This', 'These', 'That', 'Those'],
        correctAnswer: 'These',
        explanationHe: 'תשובה נכונה: These\nכלל: "These times" הוא ביטוי שמתייחס לתקופה נוכחית, "הזמנים האלה", "התקופה הנוכחית".\nשים לב: times (זמנים/תקופות) הוא רבים, ו-These מתאים לתקופה נוכחית/קרובה.\nטעות נפוצה: להשתמש ב-Those למרות שמדברים על ההווה, אבל These מתאים לנוכח.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'fill_in_blank',
        questionTextHe: '_______ (these/those) are my keys. I found them!',
        correctAnswer: 'These',
        explanationHe: 'תשובה נכונה: These\nכלל: keys הוא רבים, ועכשיו הם קרובים (מצאתי אותם, אצלי), לכן These.\nשים לב: כשמוצאים או מחזיקים משהו, זה נחשב קרוב, לכן These/This (לא Those/That).\nטעות נפוצה: להשתמש ב-Those למרות שהמפתחות עכשיו קרובים (מצאתי אותם).',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'בחר את המשפט עם התאמה נכונה בין These לפועל:',
        options: ['These is my books', 'These are my books', 'These am my books', 'These be my books'],
        correctAnswer: 'These are my books',
        explanationHe: 'תשובה נכונה: These are my books\nכלל: These (רבים) תמיד בא עם פועל רבים: are (לא is, am, או be).\nשים לב: These/Those + are, This/That + is. זה כלל קבוע.\nטעות נפוצה: להשתמש ב-is אחרי These, אבל These דורש are.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: '_______ (these/this) women are doctors.',
        correctAnswer: 'These',
        explanationHe: 'תשובה נכונה: These\nכלל: women הוא רבים לא תקין של woman, לכן These (לא This).\nשים לב: woman = יחיד (This/That woman), women = רבים (These/Those women).\nטעות נפוצה: להתבלבל בין woman ו-women ולהשתמש ב-This עם women.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: '_______ pants are too tight. I need a bigger size.',
        options: ['This', 'These', 'That', 'Those'],
        correctAnswer: 'These',
        explanationHe: 'תשובה נכונה: These\nכלל: pants (מכנסיים) הוא תמיד רבים באנגלית, והם קרובים (אני לובש אותם), לכן These.\nשים לב: pants, jeans, shorts, trousers - כולם תמיד רבים ודורשים These/Those.\nטעות נפוצה: להשתמש ב-This כי "מכנסיים" נראה כפריט אחד, אבל באנגלית זה תמיד רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: '_______ (these/they) are exactly what I was looking for!',
        correctAnswer: 'These',
        explanationHe: 'תשובה נכונה: These\nכלל: כשמצביעים על משהו שמצאנו או מראים, These מתאים יותר מ-They כי הוא מדגיש הצבעה.\nשים לב: These מדגיש "אלה בדיוק", "הדברים האלה", בעוד They פשוט "הם".\nטעות נפוצה: להשתמש רק ב-They ולא להכיר באפשרות של These שמוסיף הדגשה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט משתמש ב-These בצורה נכונה עם irregular plural?',
        options: ['These childs are happy', 'These children are happy', 'These child are happy', 'This children are happy'],
        correctAnswer: 'These children are happy',
        explanationHe: 'תשובה נכונה: These children are happy\nכלל: children הוא הצורה הנכונה של רבים (לא childs), ולכן These children (לא This children).\nשים לב: child = יחיד, children = רבים (לא תקין). children תמיד דורש These/Those.\nטעות נפוצה: להשתמש ב-childs כרבים או ב-This עם children, אבל שניהם שגויים.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 6.4: Those (plural, far) ====================
  {
    topicNumber: 6,
    subtopicNumber: '6.4',
    titleEn: 'Those - Plural, Far',
    titleHe: 'Those - רבים, רחוק',
    level: 'beginner',
    orderIndex: 4,
    theoryContentHe: `
<h2>Those - ההם/ההן (רבים, רחוק)</h2>

<p>המילה "Those" משמשת להצביע על כמה דברים שרחוקים מאיתנו.</p>

<div class="rules">
  <p><strong>כללי שימוש:</strong></p>
  <ul>
    <li>מצביעים על <strong>כמה דברים</strong> (plural)</li>
    <li>הדברים נמצאים <strong>רחוק</strong> מאיתנו</li>
    <li>Those + שם עצם רבים</li>
    <li>Those כשם תואר: Those books (הספרים ההם)</li>
    <li>Those ככינוי: Those are yours. (אלה שלך)</li>
  </ul>
</div>

<div class="examples">
  <p><strong>דוגמאות:</strong></p>
  <p><strong>Those books</strong> are yours. - הספרים ההם שלך</p>
  <p><strong>Those</strong> are your pens. - אלה העטים שלך (רחוק)</p>
  <p><strong>Those cars</strong> are expensive. - המכוניות ההן יקרות</p>
  <p><strong>Those</strong> are my neighbors. - אלה השכנים שלי (רחוק)</p>
  <p>I don't like <strong>those colors</strong>. - אני לא אוהב את הצבעים ההם</p>
</div>

<div class="warning">
  <strong>זכור:</strong> Those הוא רק לרבים! ליחיד משתמשים ב-That
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'Do you see _______ mountains in the distance?',
        options: ['this', 'these', 'that', 'those'],
        correctAnswer: 'those',
        explanationHe: 'תשובה נכונה: those\nכלל: mountains הוא רבים, ו-"in the distance" מעיד על מרחק רב, לכן those.\nשים לב: "in the distance" הוא ביטוי שתמיד מצריך That/Those כי הוא מציין דבר רחוק מאוד.\nטעות נפוצה: להשתמש ב-these למרות ביטוי המרחק הברור במשפט.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: '_______ people over there are waiting for the bus.',
        options: ['This', 'These', 'That', 'Those'],
        correctAnswer: 'Those',
        explanationHe: 'תשובה נכונה: Those\nכלל: people הוא רבים (של person), ו-"over there" מעיד על מרחק, לכן Those people.\nשים לב: people + are = רבים, וצירוף "over there" מצריך Those (לא These).\nטעות נפוצה: להשתמש ב-These למרות שהאנשים רחוקים (over there).',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: '_______ (those/these) birds flying high in the sky are beautiful.',
        correctAnswer: 'Those',
        explanationHe: 'תשובה נכונה: Those\nכלל: birds הוא רבים, והציפורים רחוקות (גבוה בשמיים), לכן Those.\nשים לב: דברים בשמיים, רחוק מאוד, או במרחקים - תמיד Those/That.\nטעות נפוצה: להשתמש ב-These כי מצביעים על הציפורים, אבל המרחק קובע.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'In _______ days, people didn\'t have smartphones.',
        options: ['this', 'these', 'that', 'those'],
        correctAnswer: 'those',
        explanationHe: 'תשובה נכונה: those\nכלל: "In those days" הוא ביטוי קבוע שמתייחס לעבר רחוק, "בימים ההם", "באותה תקופה".\nשים לב: days הוא רבים, ומתייחס לעבר, לכן those days (לא these days שהוא נוכח).\nטעות נפוצה: להשתמש ב-these כשמדברים על עבר, אבל these days מתאים רק לנוכח.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: '_______ (those/these) were the best times of my life. (past times)',
        correctAnswer: 'Those',
        explanationHe: 'תשובה נכונה: Those\nכלל: times הוא רבים, וכשמתייחסים לזמנים/תקופות בעבר משתמשים ב-Those (לא These).\nשים לב: were (עבר) מעיד שמדובר בעבר, ולכן Those מתאים (מרחק זמני).\nטעות נפוצה: להשתמש ב-These למרות שמדברים בעבר (were), אבל These לנוכח.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'Can you pass me _______ books on the top shelf?',
        options: ['this', 'these', 'that', 'those'],
        correctAnswer: 'those',
        explanationHe: 'תשובה נכונה: those\nכלל: books הוא רבים, והספרים רחוקים (על מדף גבוה, לא בהישג יד), לכן those.\nשים לב: "top shelf" מעיד על מרחק (גובה), ולכן דורש those (לא these).\nטעות נפוצה: להשתמש ב-these כי מבקשים את הספרים "לפה", אבל הקריטריון הוא איפה הם עכשיו.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'I remember _______ (those/these) happy moments we shared. (past memories)',
        correctAnswer: 'those',
        explanationHe: 'תשובה נכונה: those\nכלל: moments הוא רבים, וכשמתייחסים לזיכרונות מהעבר משתמשים ב-those (מרחק זמני).\nשים לב: זיכרונות ואירועי עבר תמיד "רחוקים" בזמן, לכן That/Those.\nטעות נפוצה: להשתמש ב-these לזיכרונות, אבל זיכרונות דורשים those.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: '_______ stars are millions of light years away.',
        options: ['This', 'These', 'That', 'Those'],
        correctAnswer: 'Those',
        explanationHe: 'תשובה נכונה: Those\nכלל: stars הוא רבים, והכוכבים רחוקים מאוד (millions of light years), לכן Those.\nשים לב: המשפט עצמו מדגיש מרחק אדיר, ולכן בוודאות Those.\nטעות נפוצה: להשתמש ב-These כי "רואים" את הכוכבים, אבל המרחק הפיזי קובע.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: '_______ (those/they) are my neighbors across the street.',
        correctAnswer: 'Those',
        explanationHe: 'תשובה נכונה: Those\nכלל: neighbors הוא רבים, ו-"across the street" מעיד על מרחק, לכן Those (לא They).\nשים לב: Those משמש להצגה והצבעה של דברים/אנשים רחוקים, בעוד They התייחסות רגילה.\nטעות נפוצה: להשתמש רק ב-They ולא להכיר ב-Those שמוסיף הצבעה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'Who are _______ children playing in the park far away?',
        options: ['this', 'these', 'that', 'those'],
        correctAnswer: 'those',
        explanationHe: 'תשובה נכונה: those\nכלל: children הוא רבים (של child), ו-"far away" מעיד בבירור על מרחק, לכן those.\nשים לב: children + are = רבים, ו-"far away" מחייב those.\nטעות נפוצה: להשתמש ב-these בשאלות על ילדים, מבלי לשים לב למרחק.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'fill_in_blank',
        questionTextHe: 'At _______ (those/these) times, we had no choice but to wait. (specific past times)',
        correctAnswer: 'those',
        explanationHe: 'תשובה נכונה: those\nכלל: "At those times" הוא ביטוי שמתייחס לזמנים ספציפיים בעבר, "באותם זמנים".\nשים לב: times הוא רבים, והפועל had (עבר) מאשר שמדובר בעבר, לכן those.\nטעות נפוצה: להשתמש ב-these למרות שמדברים בעבר (had).',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: 'I don\'t like _______ shoes in the window display. (store window, far)',
        options: ['this', 'these', 'that', 'those'],
        correctAnswer: 'those',
        explanationHe: 'תשובה נכונה: those\nכלל: shoes הוא רבים, והנעליים רחוקות (בחלון ראווה, לא בהישג יד), לכן those.\nשים לב: shoes, pants, glasses - תמיד רבים, ובמרחק דורשים those.\nטעות נפוצה: להשתמש ב-these כי הנעליים נראות, אבל המרחק (בחלון) קובע.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'fill_in_blank',
        questionTextHe: '_______ (those/these) clouds over there look like rain.',
        correctAnswer: 'Those',
        explanationHe: 'תשובה נכונה: Those\nכלל: clouds הוא רבים, ו-"over there" מעיד על מרחק, לכן Those.\nשים לב: עננים, כוכבים, הרים - דברים שבשמיים או רחוקים טבעית - תמיד That/Those.\nטעות נפוצה: להשתמש ב-These למרות "over there" שמעיד בבירור על מרחק.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'multiple_choice',
        questionTextHe: 'בחר את המשפט עם התאמה נכונה בין Those לפועל:',
        options: ['Those is my friends', 'Those are my friends', 'Those am my friends', 'Those be my friends'],
        correctAnswer: 'Those are my friends',
        explanationHe: 'תשובה נכונה: Those are my friends\nכלל: Those (רבים) תמיד בא עם פועל רבים: are (לא is, am, או be).\nשים לב: These/Those + are, This/That + is. זה כלל קבוע.\nטעות נפוצה: להשתמש ב-is אחרי Those, אבל Those דורש are.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'fill_in_blank',
        questionTextHe: '_______ (those/these) men standing by the gate are security guards. (far gate)',
        correctAnswer: 'Those',
        explanationHe: 'תשובה נכונה: Those\nכלל: men הוא רבים (של man), והשער רחוק, לכן Those men.\nשים לב: man = יחיד (That man), men = רבים (Those men).\nטעות נפוצה: להתבלבל עם רבים לא תקינים (men) ולהשתמש ב-These למרות המרחק.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'Do you remember _______ days when we were young? (nostalgic past)',
        options: ['this', 'these', 'that', 'those'],
        correctAnswer: 'those',
        explanationHe: 'תשובה נכונה: those\nכלל: days הוא רבים, וכשמתייחסים לנוסטלגיה ועבר רחוק משתמשים ב-those days.\nשים לב: "those days when..." הוא ביטוי נוסטלגי מקובל שמתייחס לעבר.\nטעות נפוצה: להשתמש ב-these למרות שמדברים על עבר רחוק ונוסטלגי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: '_______ (those/these) women across the room are my aunts.',
        correctAnswer: 'Those',
        explanationHe: 'תשובה נכונה: Those\nכlל: women הוא רבים (של woman), ו-"across the room" מעיד על מרחק, לכן Those.\nשים לב: woman = יחיד (That woman), women = רבים (Those women).\nטעות נפוצה: להתבלבל בין woman ו-women, או להשתמש ב-These למרות המרחק.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: '_______ houses on the hill are very expensive.',
        options: ['This', 'These', 'That', 'Those'],
        correctAnswer: 'Those',
        explanationHe: 'תשובה נכונה: Those\nכלל: houses הוא רבים, ו-"on the hill" מעיד על מרחק (על גבעה, רחוק), לכן Those.\nשים לב: דברים על גבעות, הרים, או במרומים - בדרך כלל רחוקים ודורשים That/Those.\nטעות נפוצה: להשתמש ב-These כי רואים את הבתים, אבל המיקום (על גבעה) מעיד על מרחק.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: 'I miss _______ (those/these) old times. (nostalgia for past)',
        correctAnswer: 'those',
        explanationHe: 'תשובה נכונה: those\nכlל: times הוא רבים, ובהקשר נוסטלגי של עבר משתמשים ב-those old times.\nשים לב: "miss those old times" הוא ביטוי מקובל של געגועים לעבר.\nטעות נפוצה: להשתמש ב-these למרות שמדברים על עבר שעבר ואיננו (miss מעיד על כך).',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט משתמש ב-Those בצורה נכונה עם irregular plural?',
        options: ['Those childs are playing', 'Those children are playing', 'Those child are playing', 'These children far away'],
        correctAnswer: 'Those children are playing',
        explanationHe: 'תשובה נכונה: Those children are playing\nכלל: children הוא רבים לא תקין (של child), ולכן Those children (לא Those childs).\nשים לב: child = יחיד, children = רבים. children דורש These/Those לפי מרחק.\nטעות נפוצה: להשתמש ב-childs כרבים, אבל הצורה הנכונה היא children.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 6.5: Adjectives vs Pronouns ====================
  {
    topicNumber: 6,
    subtopicNumber: '6.5',
    titleEn: 'As Adjectives vs Pronouns',
    titleHe: 'תארים או כינויים',
    level: 'beginner',
    orderIndex: 5,
    theoryContentHe: `
<h2>מילות הצבעה - תארים או כינויים</h2>

<p>מילות ההצבעה יכולות לשמש כשני תפקידים שונים:</p>

<div class="rules">
  <h3>כשמות תואר (Adjectives) - לפני שם עצם:</h3>
  <ul>
    <li><strong>This book</strong> - הספר הזה</li>
    <li><strong>That car</strong> - המכונית ההיא</li>
    <li><strong>These apples</strong> - התפוחים האלה</li>
    <li><strong>Those houses</strong> - הבתים ההם</li>
  </ul>

  <h3>ככינויים (Pronouns) - עומדים לבד:</h3>
  <ul>
    <li><strong>This</strong> is my book. - זה הספר שלי</li>
    <li><strong>That</strong> is expensive. - זה יקר</li>
    <li><strong>These</strong> are fresh. - אלה טריים</li>
    <li><strong>Those</strong> are beautiful. - אלה יפים</li>
  </ul>
</div>

<div class="examples">
  <h3>השוואה:</h3>
  <p><strong>כשם תואר:</strong> I like <strong>this book</strong>. (הספר הזה)</p>
  <p><strong>ככינוי:</strong> I like <strong>this</strong>. (זה)</p>

  <p><strong>כשם תואר:</strong> <strong>Those cars</strong> are fast. (המכוניות ההן)</p>
  <p><strong>ככינוי:</strong> <strong>Those</strong> are fast. (אלה)</p>
</div>

<div class="warning">
  <strong>זכור:</strong> כשם תואר תמיד יש שם עצם אחריו, ככינוי המילה עומדת לבד
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'זהה את תפקיד "This" ב: "This book is interesting."',
        options: ['כינוי (pronoun)', 'שם תואר (adjective)', 'פועל (verb)', 'תואר (adverb)'],
        correctAnswer: 'שם תואר (adjective)',
        explanationHe: 'תשובה נכונה: שם תואר (adjective)\nכלל: כאשר This/That/These/Those באים לפני שם עצם (This book), הם משמשים כשמות תואר המתארים ומצביעים על שם העצם.\nשים לב: שם תואר = לפני שם עצם. כינוי = עומד לבד + פועל.\nטעות נפוצה: לבלבל בין "This book" (תואר) ל-"This is a book" (כינוי).',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'זהה את תפקיד "These" ב: "These are my favorite songs."',
        options: ['כינוי (pronoun)', 'שם תואר (adjective)', 'שם עצם (noun)', 'פועל עזר (auxiliary)'],
        correctAnswer: 'כינוי (pronoun)',
        explanationHe: 'תשובה נכונה: כינוי (pronoun)\nכלל: כאשר These/Those עומדים לבד כנושא המשפט ומלווים בפועל (are), הם משמשים ככינויים.\nשים לב: "These are..." = כינוי. "These songs are..." = שם תואר.\nטעות נפוצה: לחשוב ש-These הוא תמיד שם תואר, אבל זה תלוי בהקשר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'המשפט "_______ (Those/Those houses) are expensive" מכיל demonstrative כ-_______.',
        correctAnswer: 'Those',
        explanationHe: 'תשובה נכונה: Those\nכלל: כשהמילה Those עומדת לבד לפני are (ללא שם עצם), היא ככינוי. "Those are expensive" = אלה יקרים.\nשים לב: אם היה "Those houses are expensive", אז Those היה שם תואר.\nטעות נפוצה: להוסיף שם עצם כשהמשפט דורש כינוי עצמאי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'באיזה משפט demonstrative משמש כשם תואר?',
        options: [
          'That is mine',
          'These are beautiful',
          'This car is fast',
          'Those are expensive'
        ],
        correctAnswer: 'This car is fast',
        explanationHe: 'תשובה נכונה: This car is fast\nכלל: שם תואר = demonstrative + שם עצם. "This car" - This מתאר את car.\nשים לב: בשאר האפשרויות, ה-demonstrative עומד לבד ככינוי (That is, These are, Those are).\nטעות נפוצה: לא להבחין בין demonstrative לפני שם עצם (תואר) לבין demonstrative לבדו (כינוי).',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'השלם: "I want _______ (that/that book) on the shelf." (demonstrative adjective)',
        correctAnswer: 'that book',
        explanationHe: 'תשובה נכונה: that book\nכלל: כשם תואר, demonstrative חייב לבוא עם שם עצם אחריו. "that book" = הספר ההוא.\nשים לב: "I want that" (כינוי) גם נכון, אבל השאלה ביקשה adjective, לכן צריך "that book".\nטעות נפוצה: להשתמש ב-that לבד כששואלים ספציפית על שימוש כשם תואר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'בחר את המשפט שבו "This" הוא כינוי (pronoun):',
        options: [
          'This apple is red',
          'I like this music',
          'This is delicious',
          'Look at this picture'
        ],
        correctAnswer: 'This is delicious',
        explanationHe: 'תשובה נכונה: This is delicious\nכלל: ככינוי, This עומד לבד לפני פועל (This is), ללא שם עצם אחריו ישירות.\nשים לב: בכל שאר האפשרויות, This בא לפני שם עצם (apple, music, picture), ולכן הוא שם תואר.\nטעות נפוצה: לחשוב ש-"This is" הוא תמיד שם תואר, אבל זה בדיוק ההיפך - זה כינוי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'המשפט "Those flowers smell nice" מכיל "Those" כ_______ (adjective/pronoun).',
        correctAnswer: 'adjective',
        explanationHe: 'תשובה נכונה: adjective\nכלל: Those בא לפני flowers (שם עצם), לכן הוא שם תואר שמתאר אילו פרחים.\nשים לב: "Those flowers" = שם תואר. "Those smell nice" = כינוי (ללא flowers).\nטעות נפוצה: לחשוב שכל demonstrative לפני פועל הוא כינוי, אבל אם יש שם עצם ביניהם - זה תואר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'איזה זוג משפטים מדגים נכון את שני השימושים של demonstrative?',
        options: [
          'These books / These are books',
          'This are good / This book good',
          'Those car / Those cars are',
          'That books / That is book'
        ],
        correctAnswer: 'These books / These are books',
        explanationHe: 'תשובה נכונה: These books / These are books\nכלל: "These books" = adjective (These מתאר books). "These are books" = pronoun (These עומד לבד כנושא).\nשים לב: שני המשפטים נכונים דקדוקית ומראים את ההבדל בין תואר לכינוי.\nטעות נפוצה: לבלבל בין שני התפקידים ולחשוב שרק אחד מהם נכון.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'הפוך את "This is my pen" למשפט עם This כשם תואר: "_______ (This/This pen) is mine."',
        correctAnswer: 'This pen',
        explanationHe: 'תשובה נכונה: This pen\nכlל: כדי להפוך This מכינוי לשם תואר, צריך להוסיף שם עצם אחריו. This + pen = שם תואר.\nשים לב: "This is my pen" (כינוי) → "This pen is mine" (תואר). שני המשפטים נכונים אבל מבנים שונים.\nטעות נפוצה: להשאיר "This is" ולחשוב שזה אותו דבר, אבל זה שומר על This ככינוי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'בחר משפט שבו demonstrative הוא כינוי ומלווה בפועל רבים:',
        options: [
          'This is good',
          'Those are mine',
          'That book is old',
          'These shoes are'
        ],
        correctAnswer: 'Those are mine',
        explanationHe: 'תשובה נכונה: Those are mine\nכלל: Those (כינוי) + are (פועל רבים). Those עומד לבד ללא שם עצם, ולכן הוא כינוי.\nשים לב: "This is" = יחיד, "Those are/These are" = רבים. הפועל חייב להתאים למספר של ה-demonstrative.\nטעות נפוצה: לחשוב ש-"These shoes are" הוא כינוי, אבל shoes שם עצם ולכן These כאן הוא תואר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'fill_in_blank',
        questionTextHe: 'זהה: "That car over there is mine." - That הוא _______ (adjective/pronoun).',
        correctAnswer: 'adjective',
        explanationHe: 'תשובה נכונה: adjective\nכלל: That בא לפני car (שם עצם), לכן הוא שם תואר. "That car" = המכונית ההיא.\nשים לב: "over there" מוסיף מידע על מיקום, אבל לא משנה שThat הוא שם תואר (That + car).\nטעות נפוצה: לחשוב שהמרחק ("over there") הופך את That לכינוי, אבל המבנה הדקדוקי קובע.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: 'מהו הפועל הנכון אחרי demonstrative pronoun רבים?',
        options: ['is', 'am', 'are', 'be'],
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are\nכלל: demonstrative pronouns רבים (These/Those) תמיד באים עם are. This/That (יחיד) באים עם is.\nשים לב: These are / Those are = נכון. These is / Those is = שגוי.\nטעות נפוצה: להשתמש ב-is אחרי These/Those, אבל הם דורשים are.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'fill_in_blank',
        questionTextHe: 'השלם: "_______ (These/These apples) are delicious." (רוצים demonstrative pronoun)',
        correctAnswer: 'These',
        explanationHe: 'תשובה נכונה: These\nכלל: כשרוצים demonstrative pronoun (ולא adjective), משתמשים ב-These לבד, ללא שם עצם אחריו.\nשים לב: "These are delicious" (כינוי) vs "These apples are delicious" (תואר). השאלה ביקשה pronoun.\nטעות נפוצה: להוסיף שם עצם כששואלים ספציפית על שימוש ככינוי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'multiple_choice',
        questionTextHe: 'באיזה מקרה demonstrative חייב להיות adjective (ולא pronoun)?',
        options: [
          'כשבא לפני פועל',
          'כשבא לפני שם עצם',
          'כשבא בסוף משפט',
          'כשמדברים על רבים'
        ],
        correctAnswer: 'כשבא לפני שם עצם',
        explanationHe: 'תשובה נכונה: כשבא לפני שם עצם\nכלל: demonstrative + שם עצם = תמיד adjective. זה המבנה היחיד שבו demonstrative חייב להיות תואר.\nשים לב: "This book", "Those cars" - התואר מצביע על שם העצם ומתאר אותו.\nטעות נפוצה: לחשוב ש-demonstrative יכול להיות כינוי גם כשיש שם עצם אחריו, אבל זה תמיד תואר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'fill_in_blank',
        questionTextHe: 'הפוך "Those are expensive" למשפט עם adjective: "_______ (Those/Those cars) are expensive."',
        correctAnswer: 'Those cars',
        explanationHe: 'תשובה נכונה: Those cars\nכלל: כדי להפוך demonstrative מכינוי לתואר, מוסיפים שם עצם אחריו.\nשים לב: "Those are expensive" (כינוי) → "Those cars are expensive" (תואר). המשמעות דומה אבל המבנה שונה.\nטעות נפוצה: לחשוב שאפשר פשוט להוסיף שם עצם בסוף, אבל הוא חייב לבוא מיד אחרי demonstrative.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'זהה את ההבדל: "This is a book" vs "This book is good"',
        options: [
          'שניהם This הוא כינוי',
          'שניהם This הוא תואר',
          'ראשון כינוי, שני תואר',
          'ראשון תואר, שני כינוי'
        ],
        correctAnswer: 'ראשון כינוי, שני תואר',
        explanationHe: 'תשובה נכונה: ראשון כינוי, שני תואר\nכלל: "This is" = This כינוי (לבד). "This book" = This תואר (לפני שם עצם).\nשים לב: המיקום של שם העצם קובע: לפני הפועל (book is) = תואר. אחרי הפועל (is a book) = כינוי.\nטעות נפוצה: לחשוב ש-"This is" הוא תמיד תואר כי יש is, אבל זה דווקא כינוי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'כשאומרים "I like this", המילה this היא _______ (adjective/pronoun/object pronoun).',
        correctAnswer: 'pronoun',
        explanationHe: 'תשובה נכונה: pronoun\nכלל: this עומד לבד כאובייקט של הפועל like, ללא שם עצם, לכן הוא כינוי.\nשים לב: "I like this" (כינוי) vs "I like this book" (תואר). שניהם נכונים אבל תפקידים שונים.\nטעות נפוצה: לחשוב ש-this אחרי like הוא תואר, אבל אם אין שם עצם - זה כינוי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'באיזה משפט demonstrative משמש ככינוי במיקום של אובייקט (לא נושא)?',
        options: [
          'These are good',
          'I want that',
          'Those people are nice',
          'This car is fast'
        ],
        correctAnswer: 'I want that',
        explanationHe: 'תשובה נכונה: I want that\nכלל: that הוא כינוי שמשמש כאובייקט של want. "I want that" = אני רוצה את זה.\nשים לב: demonstrative יכול להיות כינוי גם בתפקיד נושא (These are) וגם בתפקיד אובייקט (I want that).\nטעות נפוצה: לחשוב ש-demonstrative pronoun תמיד נושא המשפט, אבל הוא יכול להיות גם אובייקט.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "These book is good" → "_______ (These books are/This book is) good."',
        correctAnswer: 'This book is',
        explanationHe: 'תשובה נכונה: This book is\nכלל: book הוא יחיד, לכן This (לא These). והפועל is (לא are). או: books רבים + These are.\nשים לב: צריך התאמה: This/That + singular + is. These/Those + plural + are.\nטעות נפוצה: לתקן רק את These ל-This מבלי לתקן גם את is, או להיפך.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'מה נכון לגבי demonstratives בתפקיד adjective?',
        options: [
          'תמיד באים עם are',
          'תמיד באים לפני שם עצם',
          'תמיד באים בסוף משפט',
          'תמיד מתייחסים לרבים'
        ],
        correctAnswer: 'תמיד באים לפני שם עצם',
        explanationHe: 'תשובה נכונה: תמיד באים לפני שם עצם\nכלל: demonstrative adjective = demonstrative + noun. זה המבנה התמידי של שם תואר.\nשים לב: "This book", "Those cars" - תמיד demonstrative מיד לפני שם עצם.\nטעות נפוצה: לחשוב שהפועל קובע אם זה adjective, אבל הקריטריון הוא האם יש שם עצם אחרי demonstrative.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 6.6: Common Expressions ====================
  {
    topicNumber: 6,
    subtopicNumber: '6.6',
    titleEn: 'Common Expressions',
    titleHe: 'ביטויים נפוצים',
    level: 'beginner',
    orderIndex: 6,
    theoryContentHe: `
<h2>ביטויים נפוצים עם מילות הצבעה</h2>

<p>יש הרבה ביטויים קבועים שמשתמשים במילות הצבעה:</p>

<div class="rules">
  <h3>ביטויי זמן:</h3>
  <ul>
    <li><strong>This morning</strong> - הבוקר</li>
    <li><strong>This week</strong> - השבוע</li>
    <li><strong>This year</strong> - השנה (הזאת)</li>
    <li><strong>That day</strong> - היום ההוא</li>
    <li><strong>In those days</strong> - בימים ההם</li>
    <li><strong>These days</strong> - בימים אלה (עכשיו)</li>
  </ul>

  <h3>ביטויים יומיומיים:</h3>
  <ul>
    <li><strong>That's right!</strong> - נכון!</li>
    <li><strong>That's wrong!</strong> - זה לא נכון!</li>
    <li><strong>This is it!</strong> - זהו!</li>
    <li><strong>What is this?</strong> - מה זה?</li>
    <li><strong>Who is that?</strong> - מי זה?</li>
  </ul>
</div>

<div class="examples">
  <h3>דוגמאות במשפטים:</h3>
  <p><strong>This morning</strong> I went to school. - הבוקר הלכתי לבית הספר</p>
  <p><strong>That's right!</strong> Good job! - נכון! עבודה טובה!</p>
  <p><strong>These days</strong> I'm very busy. - בימים אלה אני מאוד עסוק</p>
  <p><strong>What is this?</strong> It's a book. - מה זה? זה ספר</p>
  <p><strong>Who is that?</strong> That's my teacher. - מי זה? זה המורה שלי</p>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: '_______ morning I went to the doctor.',
        options: ['This', 'These', 'That', 'The'],
        correctAnswer: 'This',
        explanationHe: 'תשובה נכונה: This\nכלל: "This morning" הוא ביטוי זמן קבוע שמשמעו "הבוקר" (של היום). זה הביטוי המקובל באנגלית.\nשים לב: אין "the morning" בהקשר זה. הביטוי הנכון הוא this morning, this afternoon, this evening.\nטעות נפוצה: לומר "the morning" במקום "this morning", אבל באנגלית זה תמיד "this morning".',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: '_______ (this/that) week I have three exams.',
        correctAnswer: 'This',
        explanationHe: 'תשובה נכונה: This\nכלל: "This week" = השבוע (הנוכחי). זהו ביטוי זמן קבוע לתקופה נוכחית.\nשים לב: this week, this month, this year - כולם מתייחסים לתקופה הנוכחית.\nטעות נפוצה: להשתמש ב-that week כשמדברים על השבוע הנוכחי, אבל that מתאים רק לעבר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: "_______ right! You got it!",
        options: ["That's", "This is", "These are", "Those are"],
        correctAnswer: "That's",
        explanationHe: 'תשובה נכונה: That\'s\nכלל: "That\'s right!" הוא ביטוי קבוע שמשמעו "נכון!", "בדיוק!", "מצוין!". זה הביטוי המקובל לאישור.\nשים לב: That\'s = That is (מקוצר). משתמשים ב-That (לא This) בביטוי הזה.\nטעות נפוצה: לומר "This is right" במקום "That\'s right", אבל הביטוי המקובל הוא That\'s.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'What is _______ (this/these)? - It\'s my new phone.',
        correctAnswer: 'this',
        explanationHe: 'תשובה נכונה: this\nכלל: "What is this?" הוא שאלה נפוצה שמשמעה "מה זה?". משתמשים ב-this (יחיד) עם is.\nשים לב: "What is this?" (יחיד) vs "What are these?" (רבים). התשובה It\'s מאשרת שצריך יחיד.\nטעות נפוצה: להשתמש ב-these בשאלה יחידה, אבל these דורש "What are these?" + They\'re.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'Who is _______? - That\'s my brother.',
        options: ['this', 'these', 'that', 'those'],
        correctAnswer: 'that',
        explanationHe: 'תשובה נכונה: that\nכלל: "Who is that?" הוא שאלה נפוצה על זהות אדם רחוק. התשובה "That\'s..." מאשרת את השימוש ב-that.\nשים לב: "Who is this?" (אדם קרוב), "Who is that?" (אדם רחוק). השאלה והתשובה משתמשים באותו demonstrative.\nטעות נפוצה: לא להתאים בין השאלה לתשובה, או להשתמש ב-this כש-that מתאים יותר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: '_______ (these/those) days everyone has a smartphone. (nowadays)',
        correctAnswer: 'These',
        explanationHe: 'תשובה נכונה: These\nכלל: "These days" הוא ביטוי קבוע שמשמעו "בימים אלה", "לאחרונה", "כיום" - מתייחס לתקופה הנוכחית.\nשים לב: "These days" = עכשיו, כיום. "Those days" / "In those days" = אז, בעבר.\nטעות נפוצה: להשתמש ב-those days כשמדברים על ההווה, אבל those מתאים רק לעבר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'In _______ days, there was no internet.',
        options: ['this', 'these', 'that', 'those'],
        correctAnswer: 'those',
        explanationHe: 'תשובה נכונה: those\nכלל: "In those days" הוא ביטוי קבוע לעבר רחוק, "בימים ההם", "באותה תקופה".\nשים לב: הפועל was (עבר) מאשר שמדובר בעבר, ולכן those days (לא these days).\nטעות נפוצה: להשתמש ב-these days עם פועל עבר, אבל these days מתאים רק להווה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: "_______ (this/that) is it! We're finished!",
        correctAnswer: 'This',
        explanationHe: 'תשובה נכונה: This\nכלל: "This is it!" הוא ביטוי קבוע שמשמעו "זהו!", "הגענו!", "סיימנו!". משמש כהכרזה על סיום או הגעה למטרה.\nשים לב: This is it! (נוכח, עכשיו הגענו) vs That was it! (עבר, זה היה).\nטעות נפוצה: להשתמש ב-that במקום this בביטוי הזה, אבל הביטוי המקובל הוא This is it.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: "_______ wrong! Try again.",
        options: ["This is", "That's", "These are", "Those are"],
        correctAnswer: "That's",
        explanationHe: 'תשובה נכונה: That\'s\nכלל: "That\'s wrong!" הוא ביטוי קבוע שמשמעו "זה לא נכון!", "שגוי!". זוהי צורת השלילה של "That\'s right!".\nשים לב: That\'s right! (נכון) ↔ That\'s wrong! (שגוי). שניהם משתמשים ב-That\'s.\nטעות נפוצה: לומר "This is wrong" במקום "That\'s wrong", אבל הביטוי המקובל הוא That\'s.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: '_______ (this/that) year we are planning a big vacation.',
        correctAnswer: 'This',
        explanationHe: 'תשובה נכונה: This\nכלל: "This year" משמש לשנה הנוכחית או לתכניות בשנה הקרובה. זהו ביטוי זמן נוכחי.\nשים לב: this year (השנה), last year (אשתקד), next year (בשנה הבאה).\nטעות נפוצה: להשתמש ב-that year לשנה הנוכחית, אבל that year מתאים רק לשנה ספציפית בעבר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'What are _______? - They\'re my keys.',
        options: ['this', 'that', 'these', 'those'],
        correctAnswer: 'these',
        explanationHe: 'תשובה נכונה: these\nכלל: "What are these?" הוא שאלה נפוצה על דברים רבים קרובים. התשובה They\'re מאשרת שמדובר ברבים.\nשים לב: "What are these?" (רבים, קרוב) vs "What are those?" (רבים, רחוק). They\'re מעיד על רבים.\nטעות נפוצה: להשתמש ב-this/that ברבים, אבל עם are צריך these/those.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'Who are _______ (this/these) people? (pointing nearby)',
        correctAnswer: 'these',
        explanationHe: 'תשובה נכונה: these\nכלל: "Who are these?" הוא שאלה על זהות אנשים רבים קרובים (nearby).\nשים לב: Who is this? (יחיד) vs Who are these? (רבים). people + are = רבים.\nטעות נפוצה: להשתמש ב-this עם people, אבל people הוא רבים ודורש these/those.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: '_______ afternoon I have a meeting.',
        options: ['This', 'These', 'That', 'The'],
        correctAnswer: 'This',
        explanationHe: 'תשובה נכונה: This\nכלל: "This afternoon" הוא ביטוי זמן קבוע = "היום אחר הצהריים", "אחר הצהריים" (של היום).\nשים לב: this morning, this afternoon, this evening - כולם מתייחסים להיום.\nטעות נפוצה: לומר "the afternoon" או "that afternoon", אבל הביטוי הנכון ליום נוכחי הוא this afternoon.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: "Look at _______ (this/these)! Isn't it amazing?",
        correctAnswer: 'this',
        explanationHe: 'תשובה נכונה: this\nכלל: "Look at this!" הוא ביטוי נפוץ = "תסתכל על זה!", "ראה את זה!". הביטוי it מאשר שמדובר ביחיד.\nשים לב: "Look at this!" (יחיד) vs "Look at these!" (רבים). it (יחיד) vs they (רבים).\nטעות נפוצה: להשתמש ב-these אבל להמשיך עם it, צריך התאמה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'At _______ time, I was living in London. (specific past time)',
        options: ['this', 'these', 'that', 'those'],
        correctAnswer: 'that',
        explanationHe: 'תשובה נכונה: that\nכlל: "At that time" הוא ביטוי קבוע לזמן ספציפי בעבר = "באותו זמן", "אז".\nשים לב: הפועל was (עבר) מעיד על עבר, ולכן that time (לא this time).\nטעות נפוצה: להשתמש ב-this time עם פועל עבר, אבל this מתאים להווה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: "_______ (this/that)'s correct! Well done!",
        correctAnswer: "That's",
        explanationHe: 'תשובה נכונה: That\'s\nכלל: "That\'s correct!" הוא ביטוי קבוע לאישור = "נכון!", "מדויק!". דומה ל-"That\'s right!".\nשים לב: That\'s correct, That\'s right, That\'s true - כולם ביטויי אישור מקובלים.\nטעות נפוצה: להשתמש ב-This is correct, אבל הביטוי המקובל הוא That\'s correct.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: '_______ evening we are going to a concert.',
        options: ['This', 'These', 'That', 'Tonight'],
        correctAnswer: 'This',
        explanationHe: 'תשובה נכונה: This\nכלל: "This evening" = "הערב", "היום בערב". ביטוי זמן קבוע ליום נוכחי.\nשים לב: Tonight גם נכון ושכיח יותר, אבל this evening גם תקין. השאלה מתמקדת ב-demonstratives.\nטעות נפוצה: להשתמש ב-that evening ליום נוכחי, אבל that מתאים רק לעבר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: "What's _______ (this/these) supposed to mean? (single thing/concept)",
        correctAnswer: 'this',
        explanationHe: 'תשובה נכונה: this\nכלל: "What\'s this supposed to mean?" = "מה זה אמור להיות?", "מה המשמעות?". שאלה על משמעות של דבר אחד או רעיון.\nשים לב: What\'s = What is (יחיד), לכן this (לא these).\nטעות נפוצה: להשתמש ב-these עם What\'s, אבל What\'s (is) דורש יחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: "_______ way, please. (directing someone to go in a specific direction)",
        options: ['This', 'These', 'That', 'Those'],
        correctAnswer: 'This',
        explanationHe: 'תשובה נכונה: This\nכlל: "This way" הוא ביטוי קבוע = "לכאן", "בכיוון הזה", "אחריי". משמש להכוונה.\nשים לב: This way, please = נימוס כשמכוונים מישהו. way (יחיד) → this.\nטעות נפוצה: להשתמש ב-that way, שגם נכון אבל לכיוון רחוק/שונה. This way = לכאן (קרוב).',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: "_______ (this/that)'s all for today. See you next time!",
        correctAnswer: "That's",
        explanationHe: 'תשובה נכונה: That\'s\nכלל: "That\'s all!" הוא ביטוי קבוע לסיום = "זהו!", "זה הכל!", "נגמר!". משמש כהכרזת סיום.\nשים לב: That\'s all (זה הכל, סיימנו) vs This is it (הגענו למטרה). שני ביטויי סיום.\nטעות נפוצה: להשתמש ב-This is all, אבל הביטוי המקובל לסיום הוא That\'s all.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 6.7: Common Mistakes ====================
  {
    topicNumber: 6,
    subtopicNumber: '6.7',
    titleEn: 'Common Mistakes',
    titleHe: 'טעויות נפוצות',
    level: 'beginner',
    orderIndex: 7,
    theoryContentHe: `
<h2>טעויות נפוצות עם מילות הצבעה</h2>

<p>הנה הטעויות הנפוצות ביותר וכיצד לתקן אותן:</p>

<div class="examples">
  <h3>בלבול בין יחיד לרבים:</h3>
  <p>❌ <strong>שגוי:</strong> <strong>This books</strong> are mine.<br>
  ✅ <strong>נכון:</strong> <strong>These books</strong> are mine.</p>
  <p style="margin-right: 20px;">(books הוא רבים, צריך These)</p>

  <p>❌ <strong>שגוי:</strong> <strong>That apples</strong> are red.<br>
  ✅ <strong>נכון:</strong> <strong>Those apples</strong> are red.</p>
  <p style="margin-right: 20px;">(apples הוא רבים, צריך Those)</p>

  <p>❌ <strong>שגוי:</strong> <strong>These book</strong> is good.<br>
  ✅ <strong>נכון:</strong> <strong>This book</strong> is good.</p>
  <p style="margin-right: 20px;">(book הוא יחיד, צריך This)</p>

  <p>❌ <strong>שגוי:</strong> <strong>Those dog</strong> is big.<br>
  ✅ <strong>נכון:</strong> <strong>That dog</strong> is big.</p>
  <p style="margin-right: 20px;">(dog הוא יחיד, צריך That)</p>

  <h3>בלבול עם הפועל be:</h3>
  <p>❌ <strong>שגוי:</strong> <strong>This are</strong> my friends.<br>
  ✅ <strong>נכון:</strong> <strong>These are</strong> my friends.</p>
  <p style="margin-right: 20px;">(עם are צריך רבים - These)</p>

  <p>❌ <strong>שגוי:</strong> <strong>These is</strong> my pen.<br>
  ✅ <strong>נכון:</strong> <strong>This is</strong> my pen.</p>
  <p style="margin-right: 20px;">(עם is צריך יחיד - This)</p>
</div>

<div class="rules">
  <p><strong>זכור תמיד:</strong></p>
  <ul>
    <li><strong>This/That</strong> - יחיד (singular)</li>
    <li><strong>These/Those</strong> - רבים (plural)</li>
    <li><strong>This/These</strong> - קרוב (near)</li>
    <li><strong>That/Those</strong> - רחוק (far)</li>
  </ul>
</div>

<div class="warning">
  <strong>טיפ:</strong> תמיד בדוק האם שם העצם יחיד או רבים לפני שבוחרים את מילת ההצבעה!
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'תקן את השגיאה: "This books are mine."',
        options: ['This book is mine', 'These books are mine', 'That books are mine', 'Those book is mine'],
        correctAnswer: 'These books are mine',
        explanationHe: 'תשובה נכונה: These books are mine\nכלל: books הוא רבים, לכן צריך These (לא This). התאמה: These + books (רבים) + are.\nשים לב: This (יחיד) לא תואם ל-books (רבים). צריך התאמת מספר.\nטעות נפוצה: להשתמש ב-This עם שם עצם רבים, זו הטעות הנפוצה ביותר עם demonstratives.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'תקן את השגיאה: "These is my pen."',
        options: ['This is my pen', 'These are my pens', 'These are my pen', 'This is my pens'],
        correctAnswer: 'This is my pen',
        explanationHe: 'תשובה נכונה: This is my pen\nכלל: pen הוא יחיד, לכן This (לא These) + is (לא are). התאמה מלאה: This + is + pen (יחיד).\nשים לב: These (רבים) לא תואם ל-pen (יחיד) ול-is (יחיד). צריך התאמה בכל הרכיבים.\nטעות נפוצה: להשתמש ב-These עם שם עצם יחיד ופועל יחיד, אבל These דורש רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "That apples are red." → "_______ (Those/These) apples are red."',
        correctAnswer: 'Those',
        explanationHe: 'תשובה נכונה: Those\nכלל: apples הוא רבים ורחוק, לכן Those (לא That). That משמש רק ליחיד.\nשים לב: That = יחיד רחוק, Those = רבים רחוק. ההבדל הוא במספר.\nטעות נפוצה: להשתמש ב-That עם רבים, זו טעות מאוד שכיחה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'תקן את השגיאה: "These book is good."',
        options: ['This book is good', 'These books are good', 'That book are good', 'Those books is good'],
        correctAnswer: 'This book is good',
        explanationHe: 'תשובה נכונה: This book is good\nכלל: book הוא יחיד, לכן This + is. אופציה שנייה (These books are good) גם נכונה אבל משנה את book לרבים.\nשים לב: צריך התאמה מלאה: demonstrative + noun + verb. כולם יחיד או כולם רבים.\nטעות נפוצה: לתקן רק את demonstrative או רק את הפועל, מבלי להבטיח התאמה מלאה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "Those dog is big." → "_______ (That/These) dog is big."',
        correctAnswer: 'That',
        explanationHe: 'תשובה נכונה: That\nכלל: dog הוא יחיד ורחוק (Those מרמז על רחוק), לכן That (לא Those). Those רק לרבים.\nשים לב: Those = רבים בלבד, That = יחיד. הפועל is מאשר שצריך יחיד.\nטעות נפוצה: להשתמש ב-Those עם יחיד, אבל Those תמיד דורש רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'זהה את השגיאה: "This are my friends."',
        options: [
          'This צריך להיות These',
          'are צריך להיות is',
          'friends צריך להיות friend',
          'אין שגיאה'
        ],
        correctAnswer: 'This צריך להיות These',
        explanationHe: 'תשובה נכונה: This צריך להיות These\nכלל: friends הוא רבים ו-are מאשר רבים, לכן צריך These (רבים), לא This (יחיד).\nשים לב: אופציה לתקן: "These are my friends" (רבים) או "This is my friend" (יחיד). השאלה רומזת על רבים.\nטעות נפוצה: להשתמש ב-This עם are ושם עצם רבים, זו טעות מאוד שכיחה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "These child is happy." → "_______ (This/These) child _______ (is/are) happy."',
        correctAnswer: 'This, is',
        explanationHe: 'תשובה נכונה: This, is\nכלל: child הוא יחיד, לכן This + is. (אופציה: These children are - אבל זה משנה את child).\nשים לב: child = יחיד, children = רבים. These דורש children, לא child.\nטעות נפוצה: להשתמש ב-These עם child, אבל child הוא יחיד ודורש This/That.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט מכיל שגיאה?',
        options: [
          'This water is clean',
          'These waters are clean',
          'That information is useful',
          'Those books are mine'
        ],
        correctAnswer: 'These waters are clean',
        explanationHe: 'תשובה נכונה: These waters are clean\nכלל: water הוא uncountable (בלתי ספיר) ותמיד יחיד, לכן This/That water, לא These/Those waters.\nשים לב: שמות עצם בלתי ספירים (water, information, advice) תמיד יחיד, לא ניתן לעשות מהם רבים.\nטעות נפוצה: להוסיף s לשמות עצם בלתי ספירים ולהשתמש ב-These/Those, אבל הם תמיד יחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "Those information is old." → "_______ (That/Those) information is old."',
        correctAnswer: 'That',
        explanationHe: 'תשובה נכונה: That\nכלל: information הוא בלתי ספיר ותמיד יחיד, לכן That (לא Those). הפועל is מאשר יחיד.\nשים לב: information, advice, news, furniture - כולם בלתי ספירים ותמיד דורשים This/That.\nטעות נפוצה: לחשוב ש-information יכול להיות רבים כי זה "הרבה מידע", אבל זה תמיד יחיד באנגלית.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'תקן את השגיאה: "These is my book."',
        options: [
          'This is my book',
          'These are my books',
          'שתי האפשרויות הראשונות נכונות',
          'אין שגיאה'
        ],
        correctAnswer: 'שתי האפשרויות הראשונות נכונות',
        explanationHe: 'תשובה נכונה: שתי האפשרויות הראשונות נכונות\nכלל: אפשר לתקן ל-This is my book (יחיד) או These are my books (רבים). שתי הדרכים תקינות.\nשים לב: "These is" תמיד שגוי. These דורש are, This דורש is.\nטעות נפוצה: לחשוב שרק דרך אחת נכונה, אבל אפשר לתקן ליחיד או לרבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "This people are nice." → "_______ (These/This) _______ (people/person) are nice."',
        correctAnswer: 'These, people',
        explanationHe: 'תשובה נכונה: These, people\nכלל: people הוא רבים (של person) ו-are מאשר רבים, לכן These people.\nשים לב: people = רבים, person = יחיד. This person is / These people are.\nטעות נפוצה: להשתמש ב-This עם people, אבל people תמיד רבים ודורש These/Those.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: 'זהה את השגיאה: "That are my books."',
        options: [
          'That צריך להיות Those',
          'are צריך להיות is',
          'books צריך להיות book',
          'אין שגיאה'
        ],
        correctAnswer: 'That צריך להיות Those',
        explanationHe: 'תשובה נכונה: That צריך להיות Those\nכלל: books הוא רבים ו-are מאשר רבים, לכן צריך Those (רבים), לא That (יחיד).\nשים לב: That = יחיד + is, Those = רבים + are. צריך התאמה.\nטעות נפוצה: להשתמש ב-That עם are ושם עצם רבים, אבל That דורש is ויחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "This childs are playing." → "These _______ (childs/children) are playing."',
        correctAnswer: 'children',
        explanationHe: 'תשובה נכונה: children\nכלל: הצורה הנכונה של רבים היא children (לא childs). These children are playing.\nשים לב: child = יחיד, children = רבים (irregular). childs לא קיים באנגלית.\nטעות נפוצה: להוסיף s ל-child ולקבל childs, אבל הצורה הנכונה היא children.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'multiple_choice',
        questionTextHe: 'איזה תיקון נכון ל: "Those man is tall"?',
        options: [
          'That man is tall',
          'Those men are tall',
          'שתי האפשרויות נכונות',
          'These man is tall'
        ],
        correctAnswer: 'שתי האפשרויות נכונות',
        explanationHe: 'תשובה נכונה: שתי האפשרויות נכונות\nכלל: אפשר לתקן ל-That man is tall (יחיד) או Those men are tall (רבים).\nשים לב: man = יחיד, men = רבים (irregular). Those דורש men, That דורש man.\nטעות נפוצה: להשתמש ב-Those man או That men, אבל צריך התאמה בין demonstrative לבין מספר השם עצם.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "These woman is a doctor." → "_______ (This/These) woman is a doctor."',
        correctAnswer: 'This',
        explanationHe: 'תשובה נכונה: This\nכלל: woman הוא יחיד ו-is מאשר יחיד, לכן This (לא These). אופציה: These women are.\nשים לב: woman = יחיד, women = רבים. These דורש women.\nטעות נפוצה: להשתמש ב-These עם woman, אבל woman יחיד ודורש This/That.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'זהה את הטעות: "This are good apples."',
        options: [
          'צריך These במקום This',
          'צריך is במקום are',
          'צריך apple במקום apples',
          'אין טעות'
        ],
        correctAnswer: 'צריך These במקום This',
        explanationHe: 'תשובה נכונה: צריך These במקום This\nכלל: apples הוא רבים ו-are מאשר רבים, לכן These (לא This).\nשים לב: This + is + apple (יחיד) או These + are + apples (רבים). צריך התאמה מלאה.\nטעות נפוצה: להשתמש ב-This עם are ורבים, אבל This דורש is ויחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "This dogs is big." → "_______ (This/These) _______ (dog/dogs) _______ (is/are) big."',
        correctAnswer: 'These, dogs, are',
        explanationHe: 'תשובה נכונה: These, dogs, are\nכלל: dogs הוא רבים, לכן צריך התאמה מלאה: These + dogs + are (כולם רבים).\nשים לב: אפשרות נוספת: This + dog + is (כולם יחיד), אבל השאלה מתחילה ב-dogs.\nטעות נפוצה: לתקן רק חלק מהמשפט, אבל צריך להתאים את כל שלושת הרכיבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון לחלוטין?',
        options: [
          'These book is interesting',
          'This books are interesting',
          'These books is interesting',
          'These books are interesting'
        ],
        correctAnswer: 'These books are interesting',
        explanationHe: 'תשובה נכונה: These books are interesting\nכלל: התאמה מלאה: These (רבים) + books (רבים) + are (רבים).\nשים לב: כל שלושת הרכיבים חייבים להתאים: demonstrative, noun, verb - כולם יחיד או כולם רבים.\nטעות נפוצה: לערבב יחיד ורבים, כמו These + book או books + is.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "That cars are expensive." → "_______ (Those/These) cars are expensive."',
        correctAnswer: 'Those',
        explanationHe: 'תשובה נכונה: Those\nכלל: cars הוא רבים ורחוק (That מרמז על רחוק), לכן Those (לא That).\nשים לב: That = יחיד רחוק, Those = רבים רחוק. שומרים על המרחק אבל מתקנים את המספר.\nטעות נפוצה: להשתמש ב-That עם רבים, אבל That רק ליחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'מהי הטעות הנפוצה ביותר עם demonstratives?',
        options: [
          'להשתמש ב-This/That עם שמות עצם רבים',
          'להשתמש ב-These/Those עם שמות עצם יחידים',
          'שתי האפשרויות שכיחות באותה מידה',
          'להשתמש ב-demonstratives בכלל'
        ],
        correctAnswer: 'להשתמש ב-This/That עם שמות עצם רבים',
        explanationHe: 'תשובה נכונה: להשתמש ב-This/That עם שמות עצם רבים\nכלל: הטעות הכי שכיחה היא "This books" או "That cars" - שימוש ביחיד עם רבים.\nשים לב: זו הטעות המספר אחת ללומדי אנגלית - לשכוח להתאים demonstrative למספר שם העצם.\nטעות נפוצה: לחשוב ש-This/That יכולים לעבוד עם רבים, אבל הם תמיד רק ליחיד.',
        difficulty: 'hard'
      }
    ]
  }
];

// Seed function
async function seedTopic6() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    console.log('Starting to seed Topic 6: Demonstratives...');

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
    console.log('✅ Topic 6: Demonstratives seeded successfully!');
    console.log(`   Total: ${lessonsData.length} lessons created`);
    console.log(`   Total exercises: 45 (6+6+6+6+9+6+6)`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding Topic 6:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run if called directly
if (require.main === module) {
  seedTopic6()
    .then(() => {
      console.log('Seeding complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedTopic6, lessonsData };
