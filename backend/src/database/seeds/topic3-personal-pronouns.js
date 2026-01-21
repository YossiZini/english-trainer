const { pool } = require('../../config/database');
const Lesson = require('../../models/Lesson');
const Exercise = require('../../models/Exercise');

// Topic 3: Personal Pronouns & Possessives (כינויי גוף ושייכות)
const lessonsData = [
  // ==================== SUBTOPIC 3.1: Subject Pronouns ====================
  {
    topicNumber: 3,
    subtopicNumber: '3.1',
    titleEn: 'Subject Pronouns',
    titleHe: 'כינויי גוף - נושא',
    level: 'beginner',
    orderIndex: 1,
    theoryContentHe: `
<h2>כינויי גוף - נושא (Subject Pronouns)</h2>

<p>כינויי הגוף מחליפים שמות עצם ומונעים חזרה מיותרת. כינויי הנושא באים במקום הנושא של המשפט.</p>

<div class="rules">
  <p><strong>כינויי הנושא באנגלית:</strong></p>
  <table>
    <tr><th>אנגלית</th><th>עברית</th><th>דוגמה</th></tr>
    <tr><td><strong>I</strong></td><td>אני</td><td>I am a student.</td></tr>
    <tr><td><strong>You</strong></td><td>אתה/את/אתם/אתן</td><td>You are smart.</td></tr>
    <tr><td><strong>He</strong></td><td>הוא</td><td>He is tall.</td></tr>
    <tr><td><strong>She</strong></td><td>היא</td><td>She is a teacher.</td></tr>
    <tr><td><strong>It</strong></td><td>זה/זאת (לדברים וחיות)</td><td>It is cold.</td></tr>
    <tr><td><strong>We</strong></td><td>אנחנו</td><td>We are friends.</td></tr>
    <tr><td><strong>They</strong></td><td>הם/הן</td><td>They are here.</td></tr>
  </table>
</div>

<div class="examples">
  <p><strong>דוגמאות:</strong></p>
  <p><strong>John</strong> is a doctor. → <strong>He</strong> is a doctor.</p>
  <p><strong>Mary</strong> likes pizza. → <strong>She</strong> likes pizza.</p>
  <p><strong>The book</strong> is on the table. → <strong>It</strong> is on the table.</p>
  <p><strong>Tom and I</strong> are friends. → <strong>We</strong> are friends.</p>
  <p><strong>The students</strong> study hard. → <strong>They</strong> study hard.</p>
</div>

<div class="warning">
  <strong>שים לב:</strong>
  <ul>
    <li>I תמיד באות גדולה, גם באמצע משפט!</li>
    <li>You משמש גם ליחיד וגם לרבים</li>
    <li>It משמש לדברים, חיות, תינוקות (כשלא יודעים את המין), ומזג אוויר</li>
  </ul>
</div>
    `,
    exercises: [
      // EASY (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'John is my friend. _______ is very nice.',
        options: ['He', 'She', 'It', 'They'],
        correctAnswer: 'He',
        explanationHe: 'John הוא שם של גבר, לכן משתמשים ב-He (הוא).',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'Mary is a teacher. _______ teaches English.',
        options: ['He', 'She', 'It', 'We'],
        correctAnswer: 'She',
        explanationHe: 'Mary הוא שם של אישה, לכן משתמשים ב-She (היא).',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'The cat is sleeping. _______ is very cute.',
        correctAnswer: 'It',
        explanationHe: 'לחיות משתמשים ב-It (זה/זאת), אלא אם יודעים את המין או מדובר בחיית מחמד קרובה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'Tom and I are students. _______ study together.',
        options: ['I', 'They', 'We', 'You'],
        correctAnswer: 'We',
        explanationHe: 'Tom and I = אני וטום = אנחנו, לכן משתמשים ב-We.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'The boys play football. _______ are very good.',
        options: ['He', 'She', 'It', 'They'],
        correctAnswer: 'They',
        explanationHe: 'The boys = הבנים (רבים), לכן משתמשים ב-They (הם).',
        difficulty: 'easy'
      },
      // MEDIUM (6-10)
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: '_______ am a student. (אני)',
        options: ['I', 'You', 'He', 'We'],
        correctAnswer: 'I',
        explanationHe: 'כשמדברים על עצמנו ביחיד, משתמשים ב-I (אני). שים לב: I תמיד באות גדולה!',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'Sarah and Tom are married. _______ have two children.',
        correctAnswer: 'They',
        explanationHe: 'Sarah and Tom = שני אנשים = הם, לכן משתמשים ב-They.',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'The weather is nice today. _______ is sunny.',
        options: ['He', 'She', 'It', 'They'],
        correctAnswer: 'It',
        explanationHe: 'למזג אוויר משתמשים תמיד ב-It. "It is sunny" = "שמשי".',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'My sister is a doctor. _______ works at the hospital.',
        correctAnswer: 'She',
        explanationHe: 'My sister = אחותי = היא, לכן משתמשים ב-She.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'בחר את המשפט הנכון:',
        options: ['i am happy.', 'I am happy.', 'I Am happy.', 'i Am happy.'],
        correctAnswer: 'I am happy.',
        explanationHe: 'I תמיד נכתב באות גדולה, גם באמצע משפט. זה הכינוי היחיד שתמיד באות גדולה.',
        difficulty: 'medium'
      },
      // HARD (11-20)
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'The baby is crying. _______ is hungry.',
        options: ['He', 'She', 'It', 'They'],
        correctAnswer: 'It',
        explanationHe: 'כשלא יודעים את המין של תינוק, או כשמדברים באופן כללי, משתמשים ב-It. אם יודעים את המין, אפשר להשתמש ב-He/She.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'My dog Max is old. _______ sleeps all day.',
        correctAnswer: 'He',
        explanationHe: 'לחיית מחמד עם שם, במיוחד כשיודעים את המין, משתמשים ב-He/She. Max הוא שם זכרי, לכן He.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'מי נכון? "My parents and _______"',
        options: ['I go to the park.', 'me go to the park.', 'myself go to the park.', 'mine go to the park.'],
        correctAnswer: 'I go to the park.',
        explanationHe: 'כשאני חלק מהנושא (My parents and I), משתמשים ב-I ולא ב-me. זו טעות נפוצה!',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'Neither my brother nor my sister can come. _______ are both busy.',
        correctAnswer: 'They',
        explanationHe: 'למרות ש-neither...nor מתייחס לשניהם בנפרד, כשמסכמים אותם יחד משתמשים ב-They.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'The team won the game. _______ played very well.',
        options: ['It', 'They', 'He', 'We'],
        correctAnswer: 'They',
        explanationHe: 'באנגלית בריטית, קבוצות (team, family, government) יכולות לקבל They כשמדגישים את חברי הקבוצה. באנגלית אמריקאית בדרך כלל It.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'Everyone should do _______ best. (כולם צריכים לעשות את המיטב שלהם)',
        correctAnswer: 'their',
        explanationHe: 'למרות ש-everyone הוא יחיד דקדוקית, בשפה מודרנית משתמשים ב-they/their כצורה ניטרלית מגדרית.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: '_______ is raining outside.',
        options: ['It', 'There', 'They', 'What'],
        correctAnswer: 'It',
        explanationHe: 'למזג אוויר משתמשים ב-It כנושא פורמלי: It is raining, It is cold, It is sunny.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'The police are looking for the thief. _______ think he is dangerous.',
        correctAnswer: 'They',
        explanationHe: 'Police הוא תמיד רבים באנגלית (The police ARE, לא IS), לכן משתמשים ב-They.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['Her and I went to the store.', 'She and I went to the store.', 'She and me went to the store.', 'Her and me went to the store.'],
        correctAnswer: 'She and I went to the store.',
        explanationHe: 'כשיש שני נושאים, שניהם צריכים להיות כינויי נושא: She and I (לא Her and me). טיפ: תבדוק כל אחד בנפרד - "I went" נכון, "me went" שגוי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'Who broke the window? - _______ did!',
        options: ['Me', 'I', 'Mine', 'Myself'],
        correctAnswer: 'I',
        explanationHe: 'בתשובות קצרות, הכינוי צריך להתאים לפועל (I did = אני עשיתי). בשפה מדוברת שומעים "Me!" אבל דקדוקית "I did" נכון יותר.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 3.2: Object Pronouns ====================
  {
    topicNumber: 3,
    subtopicNumber: '3.2',
    titleEn: 'Object Pronouns',
    titleHe: 'כינויי גוף - מושא',
    level: 'beginner',
    orderIndex: 2,
    theoryContentHe: `
<h2>כינויי גוף - מושא (Object Pronouns)</h2>

<p>כינויי המושא באים אחרי הפועל או אחרי מילות יחס. הם מקבלים את הפעולה.</p>

<div class="rules">
  <p><strong>כינויי המושא באנגלית:</strong></p>
  <table>
    <tr><th>נושא</th><th>מושא</th><th>עברית</th><th>דוגמה</th></tr>
    <tr><td>I</td><td><strong>me</strong></td><td>אותי / לי</td><td>She loves me.</td></tr>
    <tr><td>You</td><td><strong>you</strong></td><td>אותך / לך</td><td>I see you.</td></tr>
    <tr><td>He</td><td><strong>him</strong></td><td>אותו / לו</td><td>Call him.</td></tr>
    <tr><td>She</td><td><strong>her</strong></td><td>אותה / לה</td><td>Help her.</td></tr>
    <tr><td>It</td><td><strong>it</strong></td><td>את זה / לזה</td><td>I like it.</td></tr>
    <tr><td>We</td><td><strong>us</strong></td><td>אותנו / לנו</td><td>Join us.</td></tr>
    <tr><td>They</td><td><strong>them</strong></td><td>אותם / להם</td><td>I know them.</td></tr>
  </table>
</div>

<div class="examples">
  <p><strong>דוגמאות:</strong></p>
  <p>She loves <strong>me</strong>. - היא אוהבת אותי</p>
  <p>I called <strong>him</strong> yesterday. - התקשרתי אליו אתמול</p>
  <p>Can you help <strong>us</strong>? - אתה יכול לעזור לנו?</p>
  <p>Give <strong>her</strong> the book. - תן לה את הספר</p>
  <p>I saw <strong>them</strong> at the park. - ראיתי אותם בפארק</p>
</div>

<div class="warning">
  <strong>מיקום במשפט:</strong>
  <ul>
    <li>אחרי פועל: I love <strong>her</strong>.</li>
    <li>אחרי מילת יחס: Give it to <strong>me</strong>. / Look at <strong>them</strong>.</li>
  </ul>
</div>
    `,
    exercises: [
      // EASY (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'I love _______. (אותה)',
        options: ['she', 'her', 'hers', 'him'],
        correctAnswer: 'her',
        explanationHe: 'אחרי הפועל love צריך כינוי מושא. She → her (אותה).',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'Please help _______. (אותי)',
        options: ['I', 'me', 'my', 'mine'],
        correctAnswer: 'me',
        explanationHe: 'אחרי הפועל help צריך כינוי מושא. I → me (אותי).',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'I see _______. (אותו - John)',
        correctAnswer: 'him',
        explanationHe: 'John הוא גבר, וצריך כינוי מושא. He → him (אותו).',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'Give _______ the book. (להם)',
        options: ['they', 'them', 'their', 'theirs'],
        correctAnswer: 'them',
        explanationHe: 'אחרי הפועל give צריך כינוי מושא. They → them (להם/אותם).',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'She is looking at _______. (אותנו)',
        correctAnswer: 'us',
        explanationHe: 'אחרי מילת היחס at צריך כינוי מושא. We → us (אותנו).',
        difficulty: 'easy'
      },
      // MEDIUM (6-10)
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'The teacher asked _______ a question.',
        options: ['I', 'me', 'my', 'mine'],
        correctAnswer: 'me',
        explanationHe: 'הפועל asked דורש מושא. I → me. "The teacher asked me" = המורה שאל אותי.',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'Can you call _______ later? (Tom)',
        correctAnswer: 'him',
        explanationHe: 'Tom הוא גבר, וצריך כינוי מושא אחרי call. He → him.',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'This present is for _______. (אותך)',
        options: ['you', 'your', 'yours', 'yourself'],
        correctAnswer: 'you',
        explanationHe: 'אחרי מילת היחס for צריך כינוי מושא. you נשאר you גם במושא.',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'I bought _______ a gift. (לאמא שלי)',
        correctAnswer: 'her',
        explanationHe: 'אמא = she, וצריך כינוי מושא. She → her (לה).',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'בחר את המשפט הנכון:',
        options: ['Give I the book.', 'Give me the book.', 'Give my the book.', 'Give mine the book.'],
        correctAnswer: 'Give me the book.',
        explanationHe: 'אחרי give צריך כינוי מושא: me (לא I, my, או mine).',
        difficulty: 'medium'
      },
      // HARD (11-20)
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'Between you and _______, I think she is wrong.',
        options: ['I', 'me', 'myself', 'mine'],
        correctAnswer: 'me',
        explanationHe: 'אחרי מילת היחס between צריך כינוי מושא: between you and me (לא I!). זו טעות נפוצה מאוד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'The dog followed my brother and _______. (אותי)',
        correctAnswer: 'me',
        explanationHe: 'אחרי הפועל followed צריך כינוי מושא. "my brother and me" - שניהם מושאים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'Let _______ help you.',
        options: ['I', 'me', 'my', 'myself'],
        correctAnswer: 'me',
        explanationHe: 'Let + כינוי מושא + פועל בסיס. "Let me help" = תן לי לעזור.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'She gave _______ and my sister a present.',
        correctAnswer: 'me',
        explanationHe: 'שני המושאים (me and my sister) צריכים להיות בצורת מושא. "She gave me and my sister" = היא נתנה לי ולאחותי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['He is taller than I.', 'He is taller than me.', 'שניהם נכונים', 'שניהם שגויים'],
        correctAnswer: 'שניהם נכונים',
        explanationHe: 'שניהם מקובלים! "than I (am)" פורמלי יותר, "than me" נפוץ בשפה מדוברת.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'Who is it? - It is _______. (אני)',
        correctAnswer: 'me',
        explanationHe: 'למרות שדקדוקית "It is I" נכון, בשפה מדוברת ומודרנית "It is me" מקובל יותר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'The secret is between him and _______.',
        options: ['I', 'me', 'myself', 'we'],
        correctAnswer: 'me',
        explanationHe: 'Between + מושא. "Between him and me" (לא I או myself).',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'My parents sent my sister and _______ to camp.',
        correctAnswer: 'me',
        explanationHe: 'אחרי sent צריך מושא. "my sister and me" - שניהם מושאים של sent.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'The manager spoke to my colleague and _______ about the project.',
        options: ['I', 'me', 'myself', 'mine'],
        correctAnswer: 'me',
        explanationHe: 'Spoke to + מושא. "to my colleague and me" - צריך כינוי מושא.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'מה ההבדל בין "Give her the book" ו-"Give the book to her"?',
        options: ['משפט 1 שגוי', 'משפט 2 שגוי', 'שניהם נכונים עם אותה משמעות', 'המשמעות שונה'],
        correctAnswer: 'שניהם נכונים עם אותה משמעות',
        explanationHe: 'שני המבנים נכונים: Give + מושא עקיף + מושא ישיר, או Give + מושא ישיר + to + מושא עקיף.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 3.3: Possessive Adjectives ====================
  {
    topicNumber: 3,
    subtopicNumber: '3.3',
    titleEn: 'Possessive Adjectives',
    titleHe: 'תארי שייכות',
    level: 'beginner',
    orderIndex: 3,
    theoryContentHe: `
<h2>תארי שייכות (Possessive Adjectives)</h2>

<p>תארי שייכות מראים למי שייך משהו. הם באים תמיד לפני שם עצם.</p>

<div class="rules">
  <p><strong>תארי השייכות באנגלית:</strong></p>
  <table>
    <tr><th>כינוי נושא</th><th>תואר שייכות</th><th>עברית</th><th>דוגמה</th></tr>
    <tr><td>I</td><td><strong>my</strong></td><td>שלי</td><td>my book</td></tr>
    <tr><td>You</td><td><strong>your</strong></td><td>שלך/שלכם</td><td>your house</td></tr>
    <tr><td>He</td><td><strong>his</strong></td><td>שלו</td><td>his car</td></tr>
    <tr><td>She</td><td><strong>her</strong></td><td>שלה</td><td>her phone</td></tr>
    <tr><td>It</td><td><strong>its</strong></td><td>שלו/שלה (לדברים)</td><td>its color</td></tr>
    <tr><td>We</td><td><strong>our</strong></td><td>שלנו</td><td>our family</td></tr>
    <tr><td>They</td><td><strong>their</strong></td><td>שלהם/שלהן</td><td>their friends</td></tr>
  </table>
</div>

<div class="examples">
  <p><strong>דוגמאות:</strong></p>
  <p>This is <strong>my</strong> book. - זה הספר שלי</p>
  <p>Where is <strong>your</strong> car? - איפה המכונית שלך?</p>
  <p><strong>His</strong> name is Tom. - השם שלו הוא טום</p>
  <p>I like <strong>her</strong> dress. - אני אוהב את השמלה שלה</p>
  <p><strong>Our</strong> house is big. - הבית שלנו גדול</p>
</div>

<div class="warning">
  <strong>חשוב לזכור:</strong>
  <ul>
    <li>תואר שייכות + שם עצם (my book, לא: my the book)</li>
    <li>its (של זה) ≠ it's (it is) - אל תתבלבלו!</li>
    <li>their (שלהם) ≠ there (שם) ≠ they're (they are)</li>
  </ul>
</div>
    `,
    exercises: [
      // EASY (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'This is _______ book. (שלי)',
        options: ['my', 'me', 'I', 'mine'],
        correctAnswer: 'my',
        explanationHe: 'לפני שם עצם (book) צריך תואר שייכות: my (לא mine שעומד לבד).',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'Where is _______ phone? (שלך)',
        correctAnswer: 'your',
        explanationHe: 'לפני phone צריך תואר שייכות: your (שלך).',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: '_______ name is Sarah. (שלה)',
        options: ['She', 'Her', 'Hers', 'His'],
        correctAnswer: 'Her',
        explanationHe: 'לפני name צריך תואר שייכות. She → her (שלה).',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'Tom loves _______ dog. (שלו)',
        correctAnswer: 'his',
        explanationHe: 'Tom = he, לכן תואר השייכות הוא his (שלו).',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: '_______ parents are very kind. (שלהם)',
        options: ['They', 'Them', 'Their', 'Theirs'],
        correctAnswer: 'Their',
        explanationHe: 'לפני parents צריך תואר שייכות: their (שלהם).',
        difficulty: 'easy'
      },
      // MEDIUM (6-10)
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'We love _______ country. (שלנו)',
        options: ['we', 'us', 'our', 'ours'],
        correctAnswer: 'our',
        explanationHe: 'We → our לפני שם עצם. "our country" = המדינה שלנו.',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'The cat is licking _______ paw. (שלה - החתולה)',
        correctAnswer: 'its',
        explanationHe: 'לחיות (כשלא מדגישים מין) משתמשים ב-its. שים לב: its (ללא גרש) = שייכות.',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'I forgot _______ keys at home.',
        options: ['I', 'me', 'my', 'mine'],
        correctAnswer: 'my',
        explanationHe: 'לפני keys צריך תואר שייכות: my (שלי).',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'The students did _______ homework.',
        correctAnswer: 'their',
        explanationHe: 'The students = they, לכן their (שלהם).',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['Its raining outside.', "It's raining outside.", 'Its\' raining outside.', 'Raining its outside.'],
        correctAnswer: "It's raining outside.",
        explanationHe: "It's = It is (יורד גשם). Its (ללא גרש) = שייכות. זו טעות נפוצה מאוד!",
        difficulty: 'medium'
      },
      // HARD (11-20)
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'The dog wagged _______ tail.',
        options: ['its', "it's", 'his', 'their'],
        correctAnswer: 'its',
        explanationHe: 'לכלב (כשלא מדגישים מין) משתמשים ב-its. its tail = הזנב שלו.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'Every student should bring _______ own laptop.',
        correctAnswer: 'their',
        explanationHe: 'בשפה מודרנית, their משמש כצורה ניטרלית מגדרית עם every/everyone, למרות שהם יחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'The tree lost all _______ leaves.',
        options: ['its', "it's", 'his', 'their'],
        correctAnswer: 'its',
        explanationHe: 'עץ = it, לכן its (שלו). The tree lost its leaves = העץ איבד את העלים שלו.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'The company changed _______ policy.',
        correctAnswer: 'its',
        explanationHe: 'חברה = it (ארגון), לכן its. "The company changed its policy."',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'מה ההבדל בין their, there, they\'re?',
        options: ['כולם אותו דבר', 'their=שייכות, there=מקום, they\'re=they are', 'there=שייכות, their=מקום', 'אין הבדל בכתיבה'],
        correctAnswer: 'their=שייכות, there=מקום, they\'re=they are',
        explanationHe: 'their = שלהם (שייכות), there = שם (מקום), they\'re = they are (הם). שלושה הומופונים!',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'Someone left _______ bag on the bus.',
        correctAnswer: 'their',
        explanationHe: 'Someone הוא יחיד, אבל בשפה מודרנית משתמשים ב-their כצורה ניטרלית כשלא יודעים את המין.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'בחר את המשפט הנכון:',
        options: ['The bird is in it\'s nest.', 'The bird is in its nest.', 'The bird is in its\' nest.', 'The bird is in her nest.'],
        correctAnswer: 'The bird is in its nest.',
        explanationHe: 'its (ללא גרש!) = שייכות. it\'s = it is. לציפור משתמשים ב-its (לא her, אלא אם יודעים שזו נקבה).',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'Each person should know _______ rights.',
        correctAnswer: 'their',
        explanationHe: 'Each person הוא יחיד, אבל their מקובל כצורה ניטרלית מגדרית בשפה מודרנית.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון לגבי "my sister and I"?',
        options: ['My sister and I\'s car', 'My sister\'s and I\'s car', 'My sister\'s and my car', 'Mine and my sister\'s car'],
        correctAnswer: 'My sister\'s and my car',
        explanationHe: 'כשיש שני בעלים, כל אחד צריך צורת שייכות: "My sister\'s and my car" או "My and my sister\'s car".',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'The government announced _______ new policy.',
        options: ['its', 'their', 'his', "it's"],
        correctAnswer: 'its',
        explanationHe: 'Government הוא יחיד באנגלית אמריקאית (its). באנגלית בריטית אפשר גם their כשמתייחסים לאנשים בממשלה.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 3.4: Possessive Pronouns ====================
  {
    topicNumber: 3,
    subtopicNumber: '3.4',
    titleEn: 'Possessive Pronouns',
    titleHe: 'כינויי שייכות',
    level: 'beginner',
    orderIndex: 4,
    theoryContentHe: `
<h2>כינויי שייכות (Possessive Pronouns)</h2>

<p>כינויי שייכות מחליפים את שם העצם ועומדים לבד. הם לא באים לפני שם עצם!</p>

<div class="rules">
  <p><strong>כינויי השייכות באנגלית:</strong></p>
  <table>
    <tr><th>תואר שייכות</th><th>כינוי שייכות</th><th>עברית</th><th>דוגמה</th></tr>
    <tr><td>my</td><td><strong>mine</strong></td><td>שלי</td><td>This book is mine.</td></tr>
    <tr><td>your</td><td><strong>yours</strong></td><td>שלך/שלכם</td><td>Is this yours?</td></tr>
    <tr><td>his</td><td><strong>his</strong></td><td>שלו</td><td>This pen is his.</td></tr>
    <tr><td>her</td><td><strong>hers</strong></td><td>שלה</td><td>The car is hers.</td></tr>
    <tr><td>its</td><td><strong>its</strong></td><td>שלו (לדברים)</td><td>(נדיר בשימוש)</td></tr>
    <tr><td>our</td><td><strong>ours</strong></td><td>שלנו</td><td>The house is ours.</td></tr>
    <tr><td>their</td><td><strong>theirs</strong></td><td>שלהם</td><td>The car is theirs.</td></tr>
  </table>
</div>

<div class="examples">
  <p><strong>השוואה בין תואר שייכות לכינוי שייכות:</strong></p>
  <p>This is <strong>my</strong> book. → This book is <strong>mine</strong>.</p>
  <p>That is <strong>your</strong> car. → That car is <strong>yours</strong>.</p>
  <p>This is <strong>her</strong> phone. → This phone is <strong>hers</strong>.</p>
</div>

<div class="warning">
  <strong>שים לב:</strong>
  <ul>
    <li>כינוי שייכות עומד לבד - אין שם עצם אחריו!</li>
    <li>his נשאר his (גם תואר וגם כינוי)</li>
    <li>אין גרש (') בכינויי שייכות: yours (לא your's), hers (לא her's)</li>
  </ul>
</div>
    `,
    exercises: [
      // EASY (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'This book is _______. (שלי)',
        options: ['my', 'me', 'I', 'mine'],
        correctAnswer: 'mine',
        explanationHe: 'אחרי is אין שם עצם, לכן צריך כינוי שייכות: mine (לא my שבא לפני שם עצם).',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'Is this pen _______? (שלך)',
        correctAnswer: 'yours',
        explanationHe: 'הכינוי עומד לבד (אין שם עצם אחריו), לכן yours.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'That car is _______. (שלה)',
        options: ['her', 'she', 'hers', 'his'],
        correctAnswer: 'hers',
        explanationHe: 'הכינוי עומד לבד, לכן hers (לא her שבא לפני שם עצם).',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'The house is _______. (שלנו)',
        correctAnswer: 'ours',
        explanationHe: 'כינוי שייכות שעומד לבד: ours (שלנו).',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'These books are _______. (שלהם)',
        options: ['they', 'them', 'their', 'theirs'],
        correctAnswer: 'theirs',
        explanationHe: 'הכינוי עומד לבד, לכן theirs (לא their).',
        difficulty: 'easy'
      },
      // MEDIUM (6-10)
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'A friend of _______ called me. (שלי)',
        options: ['my', 'me', 'mine', 'I'],
        correctAnswer: 'mine',
        explanationHe: '"A friend of mine" = חבר שלי. אחרי of משתמשים בכינוי שייכות: mine.',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'My phone is newer than _______. (שלה)',
        correctAnswer: 'hers',
        explanationHe: 'משווים בין שני טלפונים. "than hers" = than her phone. הכינוי מחליף את שם העצם.',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'Whose bag is this? - It is _______. (שלו)',
        options: ['him', 'he', 'his', 'her'],
        correctAnswer: 'his',
        explanationHe: 'his משמש גם כתואר וגם ככינוי שייכות. כאן הוא עומד לבד = כינוי.',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'Your car is blue and _______ is red. (שלי)',
        correctAnswer: 'mine',
        explanationHe: 'mine מחליף את "my car". Your car... and mine (=my car) is red.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'בחר את המשפט הנכון:',
        options: ['This is your\'s.', 'This is yours.', 'This is your.', 'This is you.'],
        correctAnswer: 'This is yours.',
        explanationHe: 'yours (ללא גרש!) הוא כינוי השייכות. אין your\'s באנגלית!',
        difficulty: 'medium'
      },
      // HARD (11-20)
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'Her car is faster than _______.',
        options: ['our', 'ours', 'us', 'we'],
        correctAnswer: 'ours',
        explanationHe: '"ours" מחליף את "our car". משווים בין שתי מכוניות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'Is this umbrella _______ or _______? (שלך או שלה)',
        correctAnswer: 'yours or hers',
        explanationHe: 'שני כינויי שייכות שעומדים לבד: yours ו-hers.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'A colleague of _______ helped me with the project.',
        options: ['him', 'he', 'his', 'her'],
        correctAnswer: 'his',
        explanationHe: '"A colleague of his" = קולגה שלו. אחרי of משתמשים בכינוי שייכות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'Their house is bigger than _______.',
        correctAnswer: 'ours',
        explanationHe: 'ours מחליף את "our house". השוואה בין שני בתים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'מה ההבדל בין "my" ו-"mine"?',
        options: ['אין הבדל', 'my + שם עצם, mine עומד לבד', 'mine + שם עצם, my עומד לבד', 'my ליחיד, mine לרבים'],
        correctAnswer: 'my + שם עצם, mine עומד לבד',
        explanationHe: 'my book (תואר + שם עצם) vs. The book is mine (כינוי עומד לבד).',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'These seats are _______. Those are _______. (שלנו, שלהם)',
        correctAnswer: 'ours, theirs',
        explanationHe: 'שני כינויי שייכות: ours (שלנו) ו-theirs (שלהם).',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט שגוי?',
        options: ['The book is mine.', 'The book is her\'s.', 'The book is his.', 'The book is ours.'],
        correctAnswer: 'The book is her\'s.',
        explanationHe: 'אין her\'s! הצורה הנכונה היא hers (ללא גרש).',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'This problem of _______ needs to be solved. (שלכם)',
        correctAnswer: 'yours',
        explanationHe: '"This problem of yours" = הבעיה הזו שלכם. אחרי of צריך כינוי שייכות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'My answer was correct but _______ was wrong.',
        options: ['your', 'yours', 'you', 'yourself'],
        correctAnswer: 'yours',
        explanationHe: 'yours מחליף את "your answer". השוואה בין שתי תשובות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'מהי הצורה הנכונה של כינוי שייכות ל-it?',
        options: ['its', "it's", 'its\'', 'אין צורה כזו'],
        correctAnswer: 'its',
        explanationHe: 'its הוא גם תואר וגם כינוי שייכות, אבל כינוי השייכות its נדיר מאוד בשימוש.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 3.5: Possessive 's ====================
  {
    topicNumber: 3,
    subtopicNumber: '3.5',
    titleEn: "Possessive 's (Apostrophe S)",
    titleHe: "שייכות עם 's",
    level: 'beginner',
    orderIndex: 5,
    theoryContentHe: `
<h2>שייכות עם 's (Apostrophe S)</h2>

<p>באנגלית מראים שייכות על ידי הוספת 's לשם העצם.</p>

<div class="rules">
  <p><strong>הכללים הבסיסיים:</strong></p>
  <ul>
    <li><strong>יחיד:</strong> noun + 's → Tom's book (הספר של טום)</li>
    <li><strong>רבים שמסתיימים ב-s:</strong> noun + ' → the students' books (הספרים של התלמידים)</li>
    <li><strong>רבים לא רגילים:</strong> noun + 's → the children's toys (הצעצועים של הילדים)</li>
  </ul>
</div>

<div class="examples">
  <p><strong>דוגמאות:</strong></p>
  <p><strong>Tom's</strong> book - הספר של טום</p>
  <p><strong>My mother's</strong> car - המכונית של אמא שלי</p>
  <p><strong>The teacher's</strong> desk - השולחן של המורה</p>
  <p><strong>The students'</strong> books - הספרים של התלמידים</p>
  <p><strong>The children's</strong> room - החדר של הילדים</p>
</div>

<div class="warning">
  <strong>מקרים מיוחדים:</strong>
  <ul>
    <li>שמות שמסתיימים ב-s: James's או James' - שניהם נכונים</li>
    <li>שני בעלים: Tom and Jerry's house (בית משותף) vs. Tom's and Jerry's houses (בתים נפרדים)</li>
    <li>זמן: today's news, yesterday's meeting, a week's vacation</li>
  </ul>
</div>
    `,
    exercises: [
      // EASY (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'הספר של טום = _______',
        options: ["Tom's book", 'Toms book', "Toms' book", 'Tom book'],
        correctAnswer: "Tom's book",
        explanationHe: "ליחיד מוסיפים 's: Tom's book.",
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: "The _______ car is red. (אמא שלי)",
        correctAnswer: "mother's",
        explanationHe: "My mother → mother's (+ 's ליחיד).",
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'השולחן של המורה = _______',
        options: ["the teacher's desk", "the teachers desk", "the teachers' desk", "the teacher desk"],
        correctAnswer: "the teacher's desk",
        explanationHe: "מורה אחד = teacher's (יחיד + 's).",
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: "_______ phone is new. (שרה)",
        correctAnswer: "Sarah's",
        explanationHe: "Sarah + 's = Sarah's phone.",
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'הכלב של דני = _______',
        options: ["Danny's dog", "Dannys dog", "Danny dog's", "Dannys' dog"],
        correctAnswer: "Danny's dog",
        explanationHe: "Danny + 's = Danny's dog.",
        difficulty: 'easy'
      },
      // MEDIUM (6-10)
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'הספרים של התלמידים (רבים) = _______',
        options: ["the student's books", "the students' books", "the students's books", "the students books"],
        correctAnswer: "the students' books",
        explanationHe: "לרבים שמסתיימים ב-s, מוסיפים רק גרש: students' (לא students's).",
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: "The _______ toys are everywhere. (ילדים)",
        correctAnswer: "children's",
        explanationHe: "children הוא רבים לא רגיל (לא מסתיים ב-s), לכן מוסיפים 's: children's.",
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'הבית של ההורים שלי = _______',
        options: ["my parent's house", "my parents' house", "my parents's house", "my parents house"],
        correctAnswer: "my parents' house",
        explanationHe: "parents = רבים שמסתיים ב-s, לכן רק גרש: parents'.",
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: "The _______ room is upstairs. (נשים)",
        correctAnswer: "women's",
        explanationHe: "women הוא רבים לא רגיל, לכן women's (+ 's).",
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'הציונים של הגברים = _______',
        options: ["the man's grades", "the men's grades", "the mens' grades", "the men grades"],
        correctAnswer: "the men's grades",
        explanationHe: "men הוא רבים לא רגיל (לא מסתיים ב-s), לכן men's.",
        difficulty: 'medium'
      },
      // HARD (11-20)
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'הספר של ג\'יימס = _______',
        options: ["James' book", "James's book", "שניהם נכונים", "שניהם שגויים"],
        correctAnswer: "שניהם נכונים",
        explanationHe: "לשמות שמסתיימים ב-s, שתי הצורות מקובלות: James' או James's.",
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: "Tom and Jerry have one house together. It is _______ house.",
        correctAnswer: "Tom and Jerry's",
        explanationHe: "כשיש בעלות משותפת, רק השם האחרון מקבל 's: Tom and Jerry's house.",
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'החדקות של היום = _______',
        options: ["today news", "todays news", "today's news", "todays' news"],
        correctAnswer: "today's news",
        explanationHe: "'s משמש גם לזמן: today's news, yesterday's meeting.",
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: "I need a _______ vacation. (שבוע)",
        correctAnswer: "week's",
        explanationHe: "a week's vacation = חופשה של שבוע. 's משמש גם למדידת זמן.",
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'לכל אחד יש מכונית משלו: Tom and Jerry have different cars.',
        options: ["Tom and Jerry's cars", "Tom's and Jerry's cars", "Tom's and Jerry cars", "Toms and Jerrys cars"],
        correctAnswer: "Tom's and Jerry's cars",
        explanationHe: "כשלכל אחד יש משלו (בעלות נפרדת), שניהם מקבלים 's: Tom's and Jerry's cars.",
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: "The _______ recommendation helped me a lot. (דוקטור)",
        correctAnswer: "doctor's",
        explanationHe: "doctor + 's = doctor's recommendation.",
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'בית הכנסת (the synagogue of the congregation) = _______',
        options: ["the congregation's synagogue", "the congregations synagogue", "the congregations' synagogue", "שניהם a ו-c נכונים"],
        correctAnswer: "the congregation's synagogue",
        explanationHe: "congregation = יחיד, לכן congregation's.",
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: "In _______ time, phones were expensive. (סבתא שלי)",
        correctAnswer: "my grandmother's",
        explanationHe: "my grandmother + 's = my grandmother's time.",
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'מה ההבדל בין "the dog\'s tail" ו-"the dogs\' tails"?',
        options: ['אין הבדל', 'הראשון יחיד, השני רבים', 'הראשון רבים, השני יחיד', 'שניהם שגויים'],
        correctAnswer: 'הראשון יחיד, השני רבים',
        explanationHe: "dog's = כלב אחד (יחיד), dogs' = כמה כלבים (רבים).",
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'השולחן של הבוס שלי = _______',
        options: ["my boss' desk", "my boss's desk", "שניהם נכונים", "my bosses desk"],
        correctAnswer: "שניהם נכונים",
        explanationHe: "boss מסתיים ב-s, לכן שתי הצורות מקובלות: boss' או boss's.",
        difficulty: 'hard'
      }
    ]
  }
];

// Seed function
async function seedTopic3() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    console.log('Starting to seed Topic 3: Personal Pronouns & Possessives...');

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
    console.log('Topic 3: Personal Pronouns & Possessives seeded successfully!');
    console.log(`   Total: ${lessonsData.length} lessons created`);
    console.log(`   Total exercises: ${lessonsData.reduce((sum, l) => sum + l.exercises.length, 0)}`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding Topic 3:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run if called directly
if (require.main === module) {
  seedTopic3()
    .then(() => {
      console.log('Seeding complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedTopic3, lessonsData };
