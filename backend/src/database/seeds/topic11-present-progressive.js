// Topic 11: Present Progressive (Continuous) (הווה ממושך)
const lessonsData = [
  // ==================== SUBTOPIC 11.1: Introduction to Present Progressive ====================
  {
    topicNumber: 11,
    subtopicNumber: '11.1',
    titleEn: 'Introduction to Present Progressive',
    titleHe: 'מבוא להווה ממושך',
    level: 'elementary',
    orderIndex: 1,
    theoryContentHe: `
<h2>מבוא ל-Present Progressive</h2>

<p>זמן הווה ממושך (Present Progressive/Continuous) משמש לתיאור פעולות שמתרחשות כרגע, ברגע הדיבור.</p>

<h3>שימושים עיקריים:</h3>

<div class="usage-list">
  <p><strong>1. פעולות המתרחשות עכשיו:</strong></p>
  <ul>
    <li>I am reading a book now. - אני קורא ספר עכשיו</li>
    <li>She is talking on the phone. - היא מדברת בטלפון</li>
  </ul>

  <p><strong>2. פעולות זמניות בתקופה זו:</strong></p>
  <ul>
    <li>I am learning English this year. - אני לומד אנגלית השנה</li>
    <li>He is working at a restaurant this month. - הוא עובד במסעדה החודש</li>
  </ul>

  <p><strong>3. מצבים משתנים:</strong></p>
  <ul>
    <li>The weather is getting colder. - מזג האוויר נעשה קר יותר</li>
    <li>Your English is improving. - האנגלית שלך משתפרת</li>
  </ul>

  <p><strong>4. תוכניות עתידיות מוגדרות:</strong></p>
  <ul>
    <li>I am meeting John tomorrow. - אני נפגש עם ג'ון מחר</li>
    <li>We are flying to Paris next week. - אנחנו טסים לפריז בשבוע הבא</li>
  </ul>
</div>

<h3>ההבדל בין Present Simple ו-Present Progressive:</h3>
<table>
  <tr>
    <th>Present Simple</th>
    <th>Present Progressive</th>
  </tr>
  <tr>
    <td>הרגלים, שגרה</td>
    <td>פעולות עכשיו</td>
  </tr>
  <tr>
    <td>I work every day.</td>
    <td>I am working now.</td>
  </tr>
  <tr>
    <td>עובדות כלליות</td>
    <td>מצבים זמניים</td>
  </tr>
  <tr>
    <td>She lives in Tel Aviv.</td>
    <td>She is staying in Tel Aviv.</td>
  </tr>
</table>
    `,
    exercises: [
      // EASY (1-8): Basic identification of when to use Present Progressive
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'מתי משתמשים ב-Present Progressive?',
        options: ['לפעולות עכשיו', 'להרגלים', 'לעובדות כלליות', 'לכל הפעולות'],
        correctAnswer: 'לפעולות עכשיו',
        explanationHe: 'תשובה נכונה: לפעולות עכשיו. Present Progressive מתאר פעולות שקורות ברגע זה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון לפעולה המתרחשת עכשיו?',
        options: ['I read a book', 'I am reading a book', 'I reads a book', 'I reading a book'],
        correctAnswer: 'I am reading a book',
        explanationHe: 'תשובה נכונה: I am reading a book. לפעולה עכשיו משתמשים ב-am/is/are + verb-ing.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'איזה ביטוי זמן מתאים ל-Present Progressive?',
        options: ['every day', 'now', 'usually', 'always'],
        correctAnswer: 'now',
        explanationHe: 'תשובה נכונה: now. "now" (עכשיו) מציין פעולה המתרחשת ברגע זה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (talk) on the phone right now.',
        correctAnswer: 'is talking',
        explanationHe: 'תשובה נכונה: is talking. She = is + verb-ing לפעולה עכשיו.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט מתאר הרגל (לא Present Progressive)?',
        options: ['I am working now', 'I work every day', 'I am studying', 'I am playing'],
        correctAnswer: 'I work every day',
        explanationHe: 'תשובה נכונה: I work every day. "every day" מציין הרגל = Present Simple.',
        difficulty: 'easy'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (watch) TV at the moment.',
        correctAnswer: 'are watching',
        explanationHe: 'תשובה נכונה: are watching. They = are + verb-ing. "at the moment" = עכשיו.',
        difficulty: 'easy'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'מה הצורה הנכונה: He _______ now.',
        options: ['sleep', 'sleeps', 'sleeping', 'is sleeping'],
        correctAnswer: 'is sleeping',
        explanationHe: 'תשובה נכונה: is sleeping. He = is + verb-ing.',
        difficulty: 'easy'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'איזה שימוש של Present Progressive?',
        options: ['הרגלים', 'עובדות', 'פעולות זמניות', 'תמיד'],
        correctAnswer: 'פעולות זמניות',
        explanationHe: 'תשובה נכונה: פעולות זמניות. Progressive מתאר פעולות שקורות עכשיו או בתקופה זו.',
        difficulty: 'easy'
      },

      // MEDIUM (9-18): Contrasting Simple and Progressive
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'השלם: She usually _______ to school, but today she _______ a taxi.',
        options: ['walks, takes', 'walks, is taking', 'is walking, takes', 'walking, taking'],
        correctAnswer: 'walks, is taking',
        explanationHe: 'תשובה נכונה: walks, is taking. הרגל = Simple, פעולה עכשיו = Progressive.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'I normally _______ (work) in London, but this month I _______ (work) in Paris.',
        correctAnswer: 'work, am working',
        explanationHe: 'תשובה נכונה: work, am working. normally = הרגל (Simple), this month = זמני (Progressive).',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'The weather _______ colder every winter.',
        options: ['gets', 'is getting', 'get', 'getting'],
        correctAnswer: 'gets',
        explanationHe: 'תשובה נכונה: gets. "every winter" = הרגל, עובדה כללית = Present Simple.',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: 'Look! The baby _______ to walk!',
        options: ['learns', 'is learning', 'learn', 'learning'],
        correctAnswer: 'is learning',
        explanationHe: 'תשובה נכונה: is learning. "Look!" מציין פעולה עכשיו = Progressive.',
        difficulty: 'medium'
      },
      {
        questionNumber: 13,
        type: 'fill_in_blank',
        questionTextHe: 'Your English _______ (improve)!',
        correctAnswer: 'is improving',
        explanationHe: 'תשובה נכונה: is improving. שינוי מתמשך = Progressive.',
        difficulty: 'medium'
      },
      {
        questionNumber: 14,
        type: 'multiple_choice',
        questionTextHe: 'We _______ dinner at 7 every day, but tonight we _______ at 8.',
        options: ['have, have', 'have, are having', 'are having, have', 'having, having'],
        correctAnswer: 'have, are having',
        explanationHe: 'תשובה נכונה: have, are having. הרגל = Simple, תוכנית היום = Progressive.',
        difficulty: 'medium'
      },
      {
        questionNumber: 15,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (meet) his friends tomorrow.',
        correctAnswer: 'is meeting',
        explanationHe: 'תשובה נכונה: is meeting. תוכנית עתידית מוגדרת = Progressive.',
        difficulty: 'medium'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'The sun _______ in the east. (עובדה)',
        options: ['rises', 'is rising', 'rise', 'rising'],
        correctAnswer: 'rises',
        explanationHe: 'תשובה נכונה: rises. עובדה כללית = Present Simple.',
        difficulty: 'medium'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'Shh! The children _______ (sleep).',
        correctAnswer: 'are sleeping',
        explanationHe: 'תשובה נכונה: are sleeping. "Shh!" מציין פעולה עכשיו = Progressive.',
        difficulty: 'medium'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'I _______ in Tel Aviv, but this week I _______ in Jerusalem.',
        options: ['live, stay', 'live, am staying', 'am living, stay', 'living, staying'],
        correctAnswer: 'live, am staying',
        explanationHe: 'תשובה נכונה: live, am staying. מצב קבוע = Simple, זמני = Progressive.',
        difficulty: 'medium'
      },

      // HARD (19-30): Complex usage and stative verbs
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['I am knowing the answer', 'I know the answer', 'I knowing the answer', 'I knows the answer'],
        correctAnswer: 'I know the answer',
        explanationHe: 'תשובה נכונה: I know the answer. "know" הוא פועל סטטי - לא משתמשים ב-Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: She is wanting a new car. → She _______ a new car.',
        correctAnswer: 'wants',
        explanationHe: 'תשובה נכונה: wants. "want" הוא פועל סטטי - לא משתמשים ב-Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['I am having a car', 'I have a car', 'I having a car', 'I has a car'],
        correctAnswer: 'I have a car',
        explanationHe: 'תשובה נכונה: I have a car. have (בעלות) = פועל סטטי, לא Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'multiple_choice',
        questionTextHe: 'אבל: We _______ lunch now.',
        options: ['have', 'are having', 'has', 'having'],
        correctAnswer: 'are having',
        explanationHe: 'תשובה נכונה: are having. have (אוכל) = פעולה, אפשר Progressive!',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: I am understanding you. → I _______ you.',
        correctAnswer: 'understand',
        explanationHe: 'תשובה נכונה: understand. "understand" פועל סטטי - לא Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'multiple_choice',
        questionTextHe: 'He _______ about moving to another city.',
        options: ['thinks', 'is thinking', 'think', 'thinking'],
        correctAnswer: 'is thinking',
        explanationHe: 'תשובה נכונה: is thinking. think (חושב על) = אפשר Progressive כשמדובר בתהליך חשיבה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: I am believing in you. → I _______ in you.',
        correctAnswer: 'believe',
        explanationHe: 'תשובה נכונה: believe. "believe" פועל סטטי - לא Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'multiple_choice',
        questionTextHe: 'The coffee _______ good.',
        options: ['is smelling', 'smells', 'smell', 'smelling'],
        correctAnswer: 'smells',
        explanationHe: 'תשובה נכונה: smells. smell (ריח) = פועל סטטי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'אבל: I _______ the flowers.',
        options: ['smell', 'am smelling', 'smells', 'smelling'],
        correctAnswer: 'am smelling',
        explanationHe: 'תשובה נכונה: am smelling. smell (מריח פעולה) = אפשר Progressive!',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: They are needing help. → They _______ help.',
        correctAnswer: 'need',
        explanationHe: 'תשובה נכונה: need. "need" פועל סטטי - לא Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: 'בחר את המשפט הנכון:',
        options: ['I am loving pizza', 'I love pizza', 'I loving pizza', 'I loves pizza'],
        correctAnswer: 'I love pizza',
        explanationHe: 'תשובה נכונה: I love pizza. "love" פועל סטטי - לא Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: 'It _______ (seem) like a good idea.',
        correctAnswer: 'seems',
        explanationHe: 'תשובה נכונה: seems. "seem" פועל סטטי - לא Progressive.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 11.2: Structure and Forms ====================
  {
    topicNumber: 11,
    subtopicNumber: '11.2',
    titleEn: 'Structure and Forms',
    titleHe: 'מבנה וצורות',
    level: 'elementary',
    orderIndex: 2,
    theoryContentHe: `
<h2>מבנה וצורות של Present Progressive</h2>

<h3>המבנה הבסיסי:</h3>
<div class="structure-box">
  <p><strong>Subject + am/is/are + verb-ing</strong></p>
  <p>נושא + am/is/are + פועל + ing-</p>
</div>

<h3>פעלי העזר לפי כינויים:</h3>
<table>
  <tr>
    <th>כינוי</th>
    <th>פועל עזר</th>
    <th>דוגמה</th>
  </tr>
  <tr>
    <td>I</td>
    <td>am</td>
    <td>I am working</td>
  </tr>
  <tr>
    <td>You</td>
    <td>are</td>
    <td>You are studying</td>
  </tr>
  <tr>
    <td>He/She/It</td>
    <td>is</td>
    <td>He is playing</td>
  </tr>
  <tr>
    <td>We</td>
    <td>are</td>
    <td>We are eating</td>
  </tr>
  <tr>
    <td>They</td>
    <td>are</td>
    <td>They are sleeping</td>
  </tr>
</table>

<h3>כללי הכתיב להוספת -ing:</h3>

<div class="spelling-rules">
  <p><strong>1. פעלים רגילים - הוסף -ing:</strong></p>
  <ul>
    <li>work → work<strong>ing</strong></li>
    <li>play → play<strong>ing</strong></li>
    <li>read → read<strong>ing</strong></li>
  </ul>

  <p><strong>2. פעלים המסתיימים ב-E שקטה - הסר E והוסף -ing:</strong></p>
  <ul>
    <li>make → mak<strong>ing</strong></li>
    <li>write → writ<strong>ing</strong></li>
    <li>come → com<strong>ing</strong></li>
  </ul>

  <p><strong>3. פעלים קצרים (תנועה + עיצור) - הכפל עיצור והוסף -ing:</strong></p>
  <ul>
    <li>sit → sitt<strong>ing</strong></li>
    <li>run → runn<strong>ing</strong></li>
    <li>swim → swimm<strong>ing</strong></li>
  </ul>

  <p><strong>4. פעלים המסתיימים ב-IE - שנה ל-Y והוסף -ing:</strong></p>
  <ul>
    <li>lie → ly<strong>ing</strong></li>
    <li>die → dy<strong>ing</strong></li>
  </ul>
</div>
    `,
    exercises: [
      // EASY (1-8): Basic structure identification
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'מה פועל העזר עם I?',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'am',
        explanationHe: 'תשובה נכונה: am. I + am + verb-ing.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'מה פועל העזר עם She?',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. She + is + verb-ing.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'מה פועל העזר עם They?',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. They + are + verb-ing.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (work) now.',
        correctAnswer: 'am working',
        explanationHe: 'תשובה נכונה: am working. I + am + verb-ing.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (play) football.',
        correctAnswer: 'is playing',
        explanationHe: 'תשובה נכונה: is playing. He + is + verb-ing.',
        difficulty: 'easy'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (eat) dinner.',
        correctAnswer: 'are eating',
        explanationHe: 'תשובה נכונה: are eating. We + are + verb-ing.',
        difficulty: 'easy'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'איך כותבים: play + ing?',
        options: ['playing', 'plaing', 'playying', 'plaing'],
        correctAnswer: 'playing',
        explanationHe: 'תשובה נכונה: playing. פועל רגיל - הוסף -ing.',
        difficulty: 'easy'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'איך כותבים: read + ing?',
        options: ['reading', 'readin', 'readding', 'reeding'],
        correctAnswer: 'reading',
        explanationHe: 'תשובה נכונה: reading. פועל רגיל - הוסף -ing.',
        difficulty: 'easy'
      },

      // MEDIUM (9-18): Spelling rules for -ing
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'איך כותבים: make + ing?',
        options: ['makeing', 'making', 'makking', 'making'],
        correctAnswer: 'making',
        explanationHe: 'תשובה נכונה: making. הסר E שקטה והוסף -ing.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'write + ing = _______',
        correctAnswer: 'writing',
        explanationHe: 'תשובה נכונה: writing. הסר E שקטה והוסף -ing.',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'איך כותבים: run + ing?',
        options: ['runing', 'running', 'runin', 'runn'],
        correctAnswer: 'running',
        explanationHe: 'תשובה נכונה: running. פועל קצר - הכפל עיצור והוסף -ing.',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'sit + ing = _______',
        correctAnswer: 'sitting',
        explanationHe: 'תשובה נכונה: sitting. פועל קצר - הכפל עיצור והוסף -ing.',
        difficulty: 'medium'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'איך כותבים: come + ing?',
        options: ['comeing', 'coming', 'comming', 'comin'],
        correctAnswer: 'coming',
        explanationHe: 'תשובה נכונה: coming. הסר E שקטה והוסף -ing.',
        difficulty: 'medium'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'swim + ing = _______',
        correctAnswer: 'swimming',
        explanationHe: 'תשובה נכונה: swimming. פועל קצר - הכפל עיצור והוסף -ing.',
        difficulty: 'medium'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'She _______ a letter.',
        options: ['is writeing', 'is writing', 'are writing', 'am writing'],
        correctAnswer: 'is writing',
        explanationHe: 'תשובה נכונה: is writing. She = is + writing (הסר E).',
        difficulty: 'medium'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (stop) the car.',
        correctAnswer: 'are stopping',
        explanationHe: 'תשובה נכונה: are stopping. stop + ing = stopping (הכפל p).',
        difficulty: 'medium'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'I _______ very fast.',
        options: ['am runing', 'am running', 'is running', 'are running'],
        correctAnswer: 'am running',
        explanationHe: 'תשובה נכונה: am running. I = am + running (הכפל n).',
        difficulty: 'medium'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (take) a shower.',
        correctAnswer: 'is taking',
        explanationHe: 'תשובה נכונה: is taking. take + ing = taking (הסר E).',
        difficulty: 'medium'
      },

      // HARD (19-30): Complex spelling and structure
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'איך כותבים: lie + ing?',
        options: ['lieing', 'lying', 'liing', 'lieng'],
        correctAnswer: 'lying',
        explanationHe: 'תשובה נכונה: lying. ie → y + ing.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'die + ing = _______',
        correctAnswer: 'dying',
        explanationHe: 'תשובה נכונה: dying. ie → y + ing.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'תקן: She is comming home.',
        options: ['She is come home', 'She is coming home', 'She are coming home', 'She coming home'],
        correctAnswer: 'She is coming home',
        explanationHe: 'תשובה נכונה: She is coming home. come + ing = coming (לא comming).',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: I am swiming. → I am _______.',
        correctAnswer: 'swimming',
        explanationHe: 'תשובה נכונה: swimming. פועל קצר - הכפל m: swim → swimming.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: 'איזה נכון?',
        options: ['They are runing', 'They are running', 'They is running', 'They running'],
        correctAnswer: 'They are running',
        explanationHe: 'תשובה נכונה: They are running. הכפל n + they = are.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: He is stoping. → He is _______.',
        correctAnswer: 'stopping',
        explanationHe: 'תשובה נכונה: stopping. פועל קצר - הכפל p: stop → stopping.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: 'She _______ on the floor.',
        options: ['is lieing', 'is lying', 'are lying', 'am lying'],
        correctAnswer: 'is lying',
        explanationHe: 'תשובה נכונה: is lying. lie → lying (ie → y).',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (plan) a trip.',
        correctAnswer: 'are planning',
        explanationHe: 'תשובה נכונה: are planning. plan + ing = planning (הכפל n).',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'תקן: I am begining. → I am _______.',
        options: ['begin', 'begining', 'beginning', 'beginng'],
        correctAnswer: 'beginning',
        explanationHe: 'תשובה נכונה: beginning. begin → beginning (הכפל n).',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: 'The plant _______ (die).',
        correctAnswer: 'is dying',
        explanationHe: 'תשובה נכונה: is dying. die → dying (ie → y).',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: 'תקן: They are hiting the ball.',
        options: ['hitting', 'hiting', 'hitting', 'hitin'],
        correctAnswer: 'hitting',
        explanationHe: 'תשובה נכונה: hitting. hit → hitting (הכפל t).',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (travel) abroad.',
        correctAnswer: 'am traveling',
        explanationHe: 'תשובה נכונה: am traveling. travel + ing = traveling (לא להכפיל l באנגלית אמריקאית).',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 11.3: Affirmative Sentences ====================
  {
    topicNumber: 11,
    subtopicNumber: '11.3',
    titleEn: 'Affirmative Sentences',
    titleHe: 'משפטים חיוביים',
    level: 'elementary',
    orderIndex: 3,
    theoryContentHe: `
<h2>משפטים חיוביים ב-Present Progressive</h2>

<h3>מבנה:</h3>
<div class="structure-box">
  <p><strong>Subject + am/is/are + verb-ing</strong></p>
</div>

<h3>דוגמאות לפי כינויים:</h3>

<div class="examples">
  <p><strong>I am (I'm) + verb-ing:</strong></p>
  <ul>
    <li>I am working on a project. - אני עובד על פרויקט</li>
    <li>I am reading a magazine. - אני קורא מגזין</li>
  </ul>

  <p><strong>You are (You're) + verb-ing:</strong></p>
  <ul>
    <li>You are watching TV. - אתה צופה בטלוויזיה</li>
    <li>You are doing great! - אתה עושה מעולה!</li>
  </ul>

  <p><strong>He/She/It is (He's/She's/It's) + verb-ing:</strong></p>
  <ul>
    <li>He is playing football. - הוא משחק כדורגל</li>
    <li>She is writing a letter. - היא כותבת מכתב</li>
    <li>It is raining. - יורד גשם</li>
  </ul>

  <p><strong>We are (We're) + verb-ing:</strong></p>
  <ul>
    <li>We are having a party. - אנחנו עורכים מסיבה</li>
    <li>We are studying English. - אנחנו לומדים אנגלית</li>
  </ul>

  <p><strong>They are (They're) + verb-ing:</strong></p>
  <ul>
    <li>They are playing games. - הם משחקים משחקים</li>
    <li>They are talking loudly. - הם מדברים בקול</li>
  </ul>
</div>

<h3>צורות מקוצרות:</h3>
<ul>
  <li>I am = I'm</li>
  <li>You are = You're</li>
  <li>He is = He's</li>
  <li>She is = She's</li>
  <li>It is = It's</li>
  <li>We are = We're</li>
  <li>They are = They're</li>
</ul>
    `,
    exercises: [
      // EASY (1-8): Basic affirmative sentences
      {
        questionNumber: 1,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (watch) a movie.',
        correctAnswer: 'am watching',
        explanationHe: 'תשובה נכונה: am watching. I + am + verb-ing.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (cook) dinner.',
        correctAnswer: 'is cooking',
        explanationHe: 'תשובה נכונה: is cooking. She + is + verb-ing.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (play) basketball.',
        correctAnswer: 'are playing',
        explanationHe: 'תשובה נכונה: are playing. They + are + verb-ing.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'We _______ English now.',
        options: ['learn', 'learns', 'are learning', 'learning'],
        correctAnswer: 'are learning',
        explanationHe: 'תשובה נכונה: are learning. We + are + verb-ing.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (run) in the park.',
        correctAnswer: 'is running',
        explanationHe: 'תשובה נכונה: is running. He + is + running (הכפל n).',
        difficulty: 'easy'
      },
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'It _______ outside.',
        options: ['rain', 'rains', 'is raining', 'raining'],
        correctAnswer: 'is raining',
        explanationHe: 'תשובה נכונה: is raining. It + is + verb-ing.',
        difficulty: 'easy'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'You _______ (do) great work!',
        correctAnswer: 'are doing',
        explanationHe: 'תשובה נכונה: are doing. You + are + verb-ing.',
        difficulty: 'easy'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'The baby _______ (sleep).',
        correctAnswer: 'is sleeping',
        explanationHe: 'תשובה נכונה: is sleeping. The baby (= it) + is + verb-ing.',
        difficulty: 'easy'
      },

      // MEDIUM (9-18): With contractions and time expressions
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'I\'m _______ on a new project.',
        options: ['work', 'working', 'works', 'worked'],
        correctAnswer: 'working',
        explanationHe: 'תשובה נכונה: working. I\'m = I am + verb-ing.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'She\'s _______ (write) an email.',
        correctAnswer: 'writing',
        explanationHe: 'תשובה נכונה: writing. She\'s = She is + writing (הסר E).',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'They\'re _______ a house.',
        options: ['build', 'building', 'builds', 'builded'],
        correctAnswer: 'building',
        explanationHe: 'תשובה נכונה: building. They\'re = They are + verb-ing.',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'We\'re _______ (wait) for the bus.',
        correctAnswer: 'waiting',
        explanationHe: 'תשובה נכונה: waiting. We\'re = We are + verb-ing.',
        difficulty: 'medium'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'Look! The sun _______.',
        options: ['rise', 'rises', 'is rising', 'rising'],
        correctAnswer: 'is rising',
        explanationHe: 'תשובה נכונה: is rising. "Look!" מציין פעולה עכשיו = Progressive.',
        difficulty: 'medium'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'He\'s _______ (make) breakfast right now.',
        correctAnswer: 'making',
        explanationHe: 'תשובה נכונה: making. He\'s = He is + making (הסר E).',
        difficulty: 'medium'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'I\'m _______ English this year.',
        options: ['learn', 'learning', 'learns', 'learned'],
        correctAnswer: 'learning',
        explanationHe: 'תשובה נכונה: learning. מצב זמני בתקופה זו = Progressive.',
        difficulty: 'medium'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'The children _______ (play) in the garden.',
        correctAnswer: 'are playing',
        explanationHe: 'תשובה נכונה: are playing. The children (= they) + are + verb-ing.',
        difficulty: 'medium'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'She\'s _______ to music at the moment.',
        options: ['listen', 'listening', 'listens', 'listened'],
        correctAnswer: 'listening',
        explanationHe: 'תשובה נכונה: listening. "at the moment" = עכשיו = Progressive.',
        difficulty: 'medium'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'We\'re _______ (have) a great time!',
        correctAnswer: 'having',
        explanationHe: 'תשובה נכונה: having. have (חווה) = אפשר Progressive.',
        difficulty: 'medium'
      },

      // HARD (19-30): Complex sentences and situations
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'The price of food _______ every year.',
        options: ['increases', 'is increasing', 'increase', 'increased'],
        correctAnswer: 'is increasing',
        explanationHe: 'תשובה נכונה: is increasing. שינוי מתמשך = Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (meet) Tom tomorrow evening.',
        correctAnswer: 'am meeting',
        explanationHe: 'תשובה נכונה: am meeting. תוכנית עתידית מוגדרת = Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'My English _______ better.',
        options: ['gets', 'is getting', 'get', 'got'],
        correctAnswer: 'is getting',
        explanationHe: 'תשובה נכונה: is getting. שינוי הדרגתי = Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (fly) to London next week.',
        correctAnswer: 'are flying',
        explanationHe: 'תשובה נכונה: are flying. תוכנית עתידית מוגדרת = Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: 'The world _______ warmer.',
        options: ['becomes', 'is becoming', 'become', 'became'],
        correctAnswer: 'is becoming',
        explanationHe: 'תשובה נכונה: is becoming. שינוי מתמשך = Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (work) at a new company this month.',
        correctAnswer: 'is working',
        explanationHe: 'תשובה נכונה: is working. מצב זמני = Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: 'I _______ John for dinner tonight.',
        options: ['meet', 'am meeting', 'meets', 'met'],
        correctAnswer: 'am meeting',
        explanationHe: 'תשובה נכונה: am meeting. תוכנית עתידית = Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: 'Prices _______ (rise) fast these days.',
        correctAnswer: 'are rising',
        explanationHe: 'תשובה נכונה: are rising. שינוי מתמשך = Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'They _______ in a hotel this week.',
        options: ['stay', 'are staying', 'stays', 'stayed'],
        correctAnswer: 'are staying',
        explanationHe: 'תשובה נכונה: are staying. מצב זמני = Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: 'The situation _______ (improve).',
        correctAnswer: 'is improving',
        explanationHe: 'תשובה נכונה: is improving. שינוי הדרגתי = Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: 'I _______ lunch with my boss tomorrow.',
        options: ['have', 'am having', 'has', 'had'],
        correctAnswer: 'am having',
        explanationHe: 'תשובה נכונה: am having. תוכנית עתידית + have (אוכל) = Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: 'More and more people _______ (use) smartphones.',
        correctAnswer: 'are using',
        explanationHe: 'תשובה נכונה: are using. מגמה מתמשכת = Progressive.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 11.4: Negative Sentences ====================
  {
    topicNumber: 11,
    subtopicNumber: '11.4',
    titleEn: 'Negative Sentences',
    titleHe: 'משפטים שליליים',
    level: 'elementary',
    orderIndex: 4,
    theoryContentHe: `
<h2>משפטים שליליים ב-Present Progressive</h2>

<h3>מבנה:</h3>
<div class="structure-box">
  <p><strong>Subject + am/is/are + not + verb-ing</strong></p>
  <p>נושא + am/is/are + not + פועל-ing</p>
</div>

<h3>צורות מקוצרות:</h3>
<div class="contractions">
  <p><strong>שתי אפשרויות:</strong></p>

  <p><strong>1. קיצור עם הכינוי:</strong></p>
  <ul>
    <li>I'm not playing</li>
    <li>You're not studying</li>
    <li>He's not eating</li>
  </ul>

  <p><strong>2. קיצור עם not (לא עובד עם I am):</strong></p>
  <ul>
    <li>You aren't listening</li>
    <li>He isn't coming</li>
    <li>They aren't helping</li>
  </ul>

  <p>⚠️ <strong>שים לב:</strong> עם I משתמשים רק ב-I'm not (לא קיים "I amn't")</p>
</div>

<h3>דוגמאות:</h3>
<ul>
  <li>I'm not watching TV right now. - אני לא צופה בטלוויזיה כרגע</li>
  <li>He isn't answering his phone. - הוא לא עונה לטלפון שלו</li>
  <li>They aren't doing their homework. - הם לא עושים שיעורי בית</li>
</ul>
    `,
    exercises: [
      // EASY (1-8): Basic negatives
      {
        questionNumber: 1,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (not/work) today.',
        correctAnswer: 'am not working',
        explanationHe: 'תשובה נכונה: am not working. I + am not + verb-ing.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (not/listen).',
        correctAnswer: 'is not listening',
        explanationHe: 'תשובה נכונה: is not listening. She + is not + verb-ing.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (not/play) now.',
        correctAnswer: 'are not playing',
        explanationHe: 'תשובה נכונה: are not playing. They + are not + verb-ing.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'We _______ TV right now.',
        options: ['not watching', 'aren\'t watching', 'isn\'t watching', 'not watch'],
        correctAnswer: 'aren\'t watching',
        explanationHe: 'תשובה נכונה: aren\'t watching. We + aren\'t + verb-ing.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (not/sleep).',
        correctAnswer: 'is not sleeping',
        explanationHe: 'תשובה נכונה: is not sleeping. He + is not + verb-ing.',
        difficulty: 'easy'
      },
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'It _______ today.',
        options: ['not raining', 'isn\'t raining', 'aren\'t raining', 'not rain'],
        correctAnswer: 'isn\'t raining',
        explanationHe: 'תשובה נכונה: isn\'t raining. It + isn\'t + verb-ing.',
        difficulty: 'easy'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'You _______ (not/do) it correctly.',
        correctAnswer: 'are not doing',
        explanationHe: 'תשובה נכונה: are not doing. You + are not + verb-ing.',
        difficulty: 'easy'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'I _______ attention.',
        options: ['not paying', 'am not paying', 'isn\'t paying', 'aren\'t paying'],
        correctAnswer: 'am not paying',
        explanationHe: 'תשובה נכונה: am not paying. I + am not + verb-ing.',
        difficulty: 'easy'
      },

      // MEDIUM (9-18): Contractions and full forms
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'I\'m _______ to you.',
        options: ['not listen', 'not listening', 'no listening', 'listening not'],
        correctAnswer: 'not listening',
        explanationHe: 'תשובה נכונה: not listening. I\'m not + verb-ing.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (not/come) to the party.',
        correctAnswer: 'isn\'t coming',
        explanationHe: 'תשובה נכונה: isn\'t coming או is not coming. She + isn\'t + verb-ing.',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'They _______ their homework.',
        options: ['not doing', 'aren\'t doing', 'isn\'t doing', 'don\'t doing'],
        correctAnswer: 'aren\'t doing',
        explanationHe: 'תשובה נכונה: aren\'t doing. They + aren\'t + verb-ing.',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (not/make) noise.',
        correctAnswer: 'aren\'t making',
        explanationHe: 'תשובה נכונה: aren\'t making או are not making. הסר E: make → making.',
        difficulty: 'medium'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'He\'s _______ well today.',
        options: ['not feel', 'not feeling', 'no feeling', 'feeling not'],
        correctAnswer: 'not feeling',
        explanationHe: 'תשובה נכונה: not feeling. He\'s not + verb-ing.',
        difficulty: 'medium'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (not/work) tomorrow.',
        correctAnswer: 'am not working',
        explanationHe: 'תשובה נכונה: am not working. תוכנית עתידית שלילית.',
        difficulty: 'medium'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'The children _______ quietly.',
        options: ['not playing', 'aren\'t playing', 'isn\'t playing', 'don\'t playing'],
        correctAnswer: 'aren\'t playing',
        explanationHe: 'תשובה נכונה: aren\'t playing. The children (= they) + aren\'t.',
        difficulty: 'medium'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (not/answer) her phone.',
        correctAnswer: 'isn\'t answering',
        explanationHe: 'תשובה נכונה: isn\'t answering או is not answering.',
        difficulty: 'medium'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'You\'re _______ attention.',
        options: ['not pay', 'not paying', 'no paying', 'paying not'],
        correctAnswer: 'not paying',
        explanationHe: 'תשובה נכונה: not paying. You\'re not + verb-ing.',
        difficulty: 'medium'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'It _______ (not/work) properly.',
        correctAnswer: 'isn\'t working',
        explanationHe: 'תשובה נכונה: isn\'t working או is not working.',
        difficulty: 'medium'
      },

      // HARD (19-30): Complex negatives
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'תקן: I amn\'t working.',
        options: ['I not working', 'I\'m not working', 'I isn\'t working', 'I don\'t working'],
        correctAnswer: 'I\'m not working',
        explanationHe: 'תשובה נכונה: I\'m not working. "I amn\'t" לא קיים!',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: He not is coming. → He _______ coming.',
        correctAnswer: 'isn\'t',
        explanationHe: 'תשובה נכונה: isn\'t (או is not). not בא אחרי is.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'תקן: They isn\'t listening.',
        options: ['They aren\'t listening', 'They not listening', 'They isn\'t listen', 'They don\'t listening'],
        correctAnswer: 'They aren\'t listening',
        explanationHe: 'תשובה נכונה: They aren\'t listening. They = are (לא is).',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (not/understand) you right now.',
        correctAnswer: 'don\'t understand',
        explanationHe: 'תשובה נכונה: don\'t understand. understand הוא פועל סטטי - לא Progressive!',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: 'We _______ that new restaurant tonight after all.',
        options: ['not trying', 'aren\'t trying', 'isn\'t trying', 'don\'t trying'],
        correctAnswer: 'aren\'t trying',
        explanationHe: 'תשובה נכונה: aren\'t trying. תוכנית עתידית שלילית.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: 'The situation _______ (not/improve).',
        correctAnswer: 'isn\'t improving',
        explanationHe: 'תשובה נכונה: isn\'t improving. שינוי שלילי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: 'I _______ the answer.',
        options: ['am not knowing', 'don\'t know', 'isn\'t knowing', 'not know'],
        correctAnswer: 'don\'t know',
        explanationHe: 'תשובה נכונה: don\'t know. know = פועל סטטי, לא Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (not/want) to go.',
        correctAnswer: 'doesn\'t want',
        explanationHe: 'תשובה נכונה: doesn\'t want. want = פועל סטטי, לא Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'תקן: You isn\'t making sense.',
        options: ['You aren\'t making', 'You not making', 'You isn\'t make', 'You don\'t making'],
        correctAnswer: 'You aren\'t making',
        explanationHe: 'תשובה נכונה: You aren\'t making. You = are (לא is).',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (not/believe) this!',
        correctAnswer: 'don\'t believe',
        explanationHe: 'תשובה נכונה: don\'t believe. believe = פועל סטטי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: 'They _______ to the new plan.',
        options: ['aren\'t agreeing', 'don\'t agree', 'isn\'t agreeing', 'not agree'],
        correctAnswer: 'don\'t agree',
        explanationHe: 'תשובה נכונה: don\'t agree. agree = פועל סטטי בדרך כלל.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: 'The price _______ (not/include) tax.',
        correctAnswer: 'doesn\'t include',
        explanationHe: 'תשובה נכונה: doesn\'t include. include = פועל סטטי.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 11.5: Questions ====================
  {
    topicNumber: 11,
    subtopicNumber: '11.5',
    titleEn: 'Questions',
    titleHe: 'שאלות',
    level: 'elementary',
    orderIndex: 5,
    theoryContentHe: `
<h2>שאלות ב-Present Progressive</h2>

<h3>שאלות כן/לא (Yes/No Questions):</h3>
<div class="structure-box">
  <p><strong>Am/Is/Are + subject + verb-ing?</strong></p>
  <p>Am/Is/Are + נושא + פועל-ing?</p>
</div>

<div class="examples">
  <p><strong>דוגמאות:</strong></p>
  <ul>
    <li>Am I disturbing you? - אני מפריע לך?</li>
    <li>Are you listening? - אתה מקשיב?</li>
    <li>Is he working? - הוא עובד?</li>
    <li>Are they playing? - הם משחקים?</li>
  </ul>

  <p><strong>תשובות:</strong></p>
  <ul>
    <li>Yes, you are. / No, you're not.</li>
    <li>Yes, I am. / No, I'm not.</li>
    <li>Yes, he is. / No, he isn't.</li>
  </ul>
</div>

<h3>שאלות מידע (Wh- Questions):</h3>
<div class="structure-box">
  <p><strong>Wh-word + am/is/are + subject + verb-ing?</strong></p>
  <p>מילת שאלה + am/is/are + נושא + פועל-ing?</p>
</div>

<div class="examples">
  <p><strong>What (מה):</strong> What are you doing?</p>
  <p><strong>Where (איפה):</strong> Where are you going?</p>
  <p><strong>Who (מי):</strong> Who are you calling?</p>
  <p><strong>Why (למה):</strong> Why are you crying?</p>
  <p><strong>When (מתי):</strong> When are you leaving?</p>
  <p><strong>How (איך):</strong> How are you feeling?</p>
</div>
    `,
    exercises: [
      // EASY (1-8): Basic Yes/No questions
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: '_______ you working?',
        options: ['Am', 'Is', 'Are', 'Do'],
        correctAnswer: 'Are',
        explanationHe: 'תשובה נכונה: Are. You = are בשאלה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: '_______ she sleeping?',
        correctAnswer: 'Is',
        explanationHe: 'תשובה נכונה: Is. She = is בשאלה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: '_______ they playing?',
        options: ['Am', 'Is', 'Are', 'Do'],
        correctAnswer: 'Are',
        explanationHe: 'תשובה נכונה: Are. They = are בשאלה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: '_______ I disturbing you?',
        correctAnswer: 'Am',
        explanationHe: 'תשובה נכונה: Am. I = am בשאלה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: '_______ he coming?',
        options: ['Am', 'Is', 'Are', 'Do'],
        correctAnswer: 'Is',
        explanationHe: 'תשובה נכונה: Is. He = is בשאלה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: '_______ it raining?',
        correctAnswer: 'Is',
        explanationHe: 'תשובה נכונה: Is. It = is בשאלה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: '_______ we late?',
        options: ['Am', 'Is', 'Are', 'Do'],
        correctAnswer: 'Are',
        explanationHe: 'תשובה נכונה: Are. We = are בשאלה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: '_______ the children playing?',
        correctAnswer: 'Are',
        explanationHe: 'תשובה נכונה: Are. The children (= they) = are.',
        difficulty: 'easy'
      },

      // MEDIUM (9-18): Wh- questions
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'What _______ you doing?',
        options: ['am', 'is', 'are', 'do'],
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. What + are + you + verb-ing?',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'Where _______ she going?',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. Where + is + she + verb-ing?',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'Who _______ they meeting?',
        options: ['am', 'is', 'are', 'do'],
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. Who + are + they + verb-ing?',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'Why _______ you crying?',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. Why + are + you + verb-ing?',
        difficulty: 'medium'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'When _______ he arriving?',
        options: ['am', 'is', 'are', 'do'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. When + is + he + verb-ing?',
        difficulty: 'medium'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'How _______ you feeling?',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. How + are + you + verb-ing?',
        difficulty: 'medium'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'What _______ she reading?',
        options: ['am', 'is', 'are', 'does'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. What + is + she + verb-ing?',
        difficulty: 'medium'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'Where _______ they staying?',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. Where + are + they + verb-ing?',
        difficulty: 'medium'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'Why _______ he laughing?',
        options: ['am', 'is', 'are', 'does'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. Why + is + he + verb-ing?',
        difficulty: 'medium'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'How _______ they traveling?',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. How + are + they + verb-ing?',
        difficulty: 'medium'
      },

      // HARD (19-30): Complex questions and corrections
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'תקן: You are working?',
        options: ['Do you working?', 'Are you working?', 'Is you working?', 'You working?'],
        correctAnswer: 'Are you working?',
        explanationHe: 'תשובה נכונה: Are you working? בשאלה: Are + subject + verb-ing?',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: What you are doing? → What _______ you doing?',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. What + are + you (סדר נכון).',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'תקן: Where she is going?',
        options: ['Where is she going?', 'Where she going?', 'Where does she going?', 'Is where she going?'],
        correctAnswer: 'Where is she going?',
        explanationHe: 'תשובה נכונה: Where is she going? Where + is + she + verb-ing.',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: Why you are crying? → Why _______ you crying?',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. Why + are + you (סדר נכון).',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: 'What time _______ they arriving?',
        options: ['am', 'is', 'are', 'do'],
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. What time + are + they + verb-ing?',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: 'Who _______ you waiting for?',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. Who + are + you + waiting for?',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: 'תקן: Is he knowing the answer?',
        options: ['Does he know?', 'Is he know?', 'Do he know?', 'He knows?'],
        correctAnswer: 'Does he know?',
        explanationHe: 'תשובה נכונה: Does he know? know = פועל סטטי, לא Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: 'How many people _______ coming to the party?',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. How many people (= they) + are.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'תקן: Are you understanding me?',
        options: ['Do you understand me?', 'Are you understand me?', 'Is you understanding me?', 'You understand me?'],
        correctAnswer: 'Do you understand me?',
        explanationHe: 'תשובה נכונה: Do you understand me? understand = פועל סטטי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: 'What kind of music _______ they listening to?',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. What kind + are + they + verb-ing?',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: 'תקן: Where do you going?',
        options: ['Where are you going?', 'Where you going?', 'Where is you going?', 'Where you are going?'],
        correctAnswer: 'Where are you going?',
        explanationHe: 'תשובה נכונה: Where are you going? Progressive, לא Simple.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: Is they coming? → _______ they coming?',
        correctAnswer: 'Are',
        explanationHe: 'תשובה נכונה: Are. They = are (לא is).',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 11.6: Time Expressions ====================
  {
    topicNumber: 11,
    subtopicNumber: '11.6',
    titleEn: 'Time Expressions',
    titleHe: 'ביטויי זמן',
    level: 'elementary',
    orderIndex: 6,
    theoryContentHe: `
<h2>ביטויי זמן ב-Present Progressive</h2>

<h3>ביטויים המציינים "עכשיו":</h3>
<ul>
  <li><strong>now</strong> - עכשיו</li>
  <li><strong>right now</strong> - ממש עכשיו</li>
  <li><strong>at the moment</strong> - ברגע זה, כרגע</li>
  <li><strong>currently</strong> - כרגע, בתקופה זו</li>
  <li><strong>at present</strong> - כרגע, בהווה</li>
</ul>

<h3>ביטויים לתקופה זמנית:</h3>
<ul>
  <li><strong>today</strong> - היום</li>
  <li><strong>this week</strong> - השבוע</li>
  <li><strong>this month</strong> - החודש</li>
  <li><strong>this year</strong> - השנה</li>
  <li><strong>these days</strong> - בימים אלה</li>
</ul>

<h3>ביטויים לתוכניות עתידיות:</h3>
<ul>
  <li><strong>tomorrow</strong> - מחר</li>
  <li><strong>tonight</strong> - הערב</li>
  <li><strong>next week/month</strong> - בשבוע/בחודש הבא</li>
</ul>

<h3>משפטים לדוגמה:</h3>
<ul>
  <li>I can't talk now, I'm driving. - אני לא יכול לדבר עכשיו, אני נוהג</li>
  <li>What are you doing at the moment? - מה אתה עושה כרגע?</li>
  <li>She is currently studying for exams. - היא כרגע לומדת למבחנים</li>
  <li>We are having guests tonight. - יש לנו אורחים הערב</li>
</ul>
    `,
    exercises: [
      // EASY (1-8): Basic time expressions
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'I\'m studying _______.',
        options: ['yesterday', 'now', 'always', 'never'],
        correctAnswer: 'now',
        explanationHe: 'תשובה נכונה: now. Progressive + now = עכשיו.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'She is working _______ (כרגע - at the _______)',
        correctAnswer: 'moment',
        explanationHe: 'תשובה נכונה: moment. "at the moment" = כרגע = Progressive.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'They are playing _______.',
        options: ['every day', 'right now', 'usually', 'sometimes'],
        correctAnswer: 'right now',
        explanationHe: 'תשובה נכונה: right now. Progressive + right now = ממש עכשיו.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'We are busy _______ (currently).',
        correctAnswer: 'currently',
        explanationHe: 'תשובה נכונה: currently. "currently" = כרגע = Progressive.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'He is sleeping _______ (עכשיו).',
        options: ['always', 'now', 'never', 'sometimes'],
        correctAnswer: 'now',
        explanationHe: 'תשובה נכונה: now. Progressive + now.',
        difficulty: 'easy'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'I can\'t talk _______ (right _______), I\'m driving.',
        correctAnswer: 'now',
        explanationHe: 'תשובה נכונה: now. "right now" = ממש עכשיו.',
        difficulty: 'easy'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'What are you doing _______?',
        options: ['yesterday', 'tomorrow', 'at the moment', 'every day'],
        correctAnswer: 'at the moment',
        explanationHe: 'תשובה נכונה: at the moment. Progressive = כרגע.',
        difficulty: 'easy'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'She is _______ (at present) in London.',
        correctAnswer: 'currently',
        explanationHe: 'תשובה נכונה: currently או at present. מצב זמני = Progressive.',
        difficulty: 'easy'
      },

      // MEDIUM (9-18): Temporary situations
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'I\'m learning English _______.',
        options: ['every year', 'this year', 'last year', 'always'],
        correctAnswer: 'this year',
        explanationHe: 'תשובה נכונה: this year. תקופה זמנית = Progressive.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'She is staying with friends _______ (this _______).',
        correctAnswer: 'week',
        explanationHe: 'תשובה נכונה: week. "this week" = תקופה זמנית.',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'He is working at a new company _______.',
        options: ['every month', 'this month', 'last month', 'usually'],
        correctAnswer: 'this month',
        explanationHe: 'תשובה נכונה: this month. מצב זמני = Progressive.',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'They are very busy _______ (these _______).',
        correctAnswer: 'days',
        explanationHe: 'תשובה נכונה: days. "these days" = בימים אלה = זמני.',
        difficulty: 'medium'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'We are having a party _______.',
        options: ['every Saturday', 'tonight', 'last night', 'always'],
        correctAnswer: 'tonight',
        explanationHe: 'תשובה נכונה: tonight. תוכנית עתידית = Progressive.',
        difficulty: 'medium'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'I\'m meeting John _______ (tomorrow).',
        correctAnswer: 'tomorrow',
        explanationHe: 'תשובה נכונה: tomorrow. תוכנית עתידית = Progressive.',
        difficulty: 'medium'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'She is flying to Paris _______.',
        options: ['every month', 'next week', 'last week', 'usually'],
        correctAnswer: 'next week',
        explanationHe: 'תשובה נכונה: next week. תוכנית עתידית = Progressive.',
        difficulty: 'medium'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'He is working hard _______ (these days).',
        correctAnswer: 'these days',
        explanationHe: 'תשובה נכונה: these days. תקופה זמנית.',
        difficulty: 'medium'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'They are staying at a hotel _______.',
        options: ['every summer', 'this week', 'last week', 'always'],
        correctAnswer: 'this week',
        explanationHe: 'תשובה נכונה: this week. מצב זמני = Progressive.',
        difficulty: 'medium'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'I\'m working from home _______ (today).',
        correctAnswer: 'today',
        explanationHe: 'תשובה נכונה: today. מצב זמני היום = Progressive.',
        difficulty: 'medium'
      },

      // HARD (19-30): Distinguishing Simple vs Progressive with time expressions
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'I work here _______, but _______ I\'m working at home.',
        options: ['now, today', 'usually, today', 'always, now', 'today, always'],
        correctAnswer: 'usually, today',
        explanationHe: 'תשובה נכונה: usually, today. הרגל = Simple, זמני = Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'She normally _______ (drive) to work, but today she _______ (take) the bus.',
        correctAnswer: 'drives, is taking',
        explanationHe: 'תשובה נכונה: drives, is taking. normally = Simple, today = Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'They _______ dinner at 7 every day, but tonight they _______ at 8.',
        options: ['have, have', 'are having, are having', 'have, are having', 'are having, have'],
        correctAnswer: 'have, are having',
        explanationHe: 'תשובה נכונה: have, are having. every day = Simple, tonight = Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: 'He usually _______ (play) football on Sundays, but right now he _______ (watch) TV.',
        correctAnswer: 'plays, is watching',
        explanationHe: 'תשובה נכונה: plays, is watching. usually = Simple, right now = Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: 'I always _______ coffee, but today I _______ tea.',
        options: ['drink, drink', 'am drinking, am drinking', 'drink, am drinking', 'am drinking, drink'],
        correctAnswer: 'drink, am drinking',
        explanationHe: 'תשובה נכונה: drink, am drinking. always = Simple, today = Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (live) in Tel Aviv, but this month we _______ (stay) in Jerusalem.',
        correctAnswer: 'live, are staying',
        explanationHe: 'תשובה נכונה: live, are staying. קבוע = Simple, this month = Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: 'She _______ at 8 AM every day, but today she _______ at 9 AM.',
        options: ['starts, starts', 'is starting, is starting', 'starts, is starting', 'is starting, starts'],
        correctAnswer: 'starts, is starting',
        explanationHe: 'תשובה נכונה: starts, is starting. every day = Simple, today = Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: 'At the moment, she _______ (study) for exams, but usually she _______ (watch) TV in the evening.',
        correctAnswer: 'is studying, watches',
        explanationHe: 'תשובה נכונה: is studying, watches. at the moment = Progressive, usually = Simple.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'I _______ emails every morning, but right now I _______ a report.',
        options: ['check, check', 'am checking, am checking', 'check, am writing', 'am checking, write'],
        correctAnswer: 'check, am writing',
        explanationHe: 'תשובה נכונה: check, am writing. every morning = Simple, right now = Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: 'They normally _______ (go) to the gym, but these days they _______ (exercise) at home.',
        correctAnswer: 'go, are exercising',
        explanationHe: 'תשובה נכונה: go, are exercising. normally = Simple, these days = Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: 'The shop _______ at 9 AM every day, but today it _______ at 10 AM.',
        options: ['opens, opens', 'is opening, is opening', 'opens, is opening', 'is opening, opens'],
        correctAnswer: 'opens, is opening',
        explanationHe: 'תשובה נכונה: opens, is opening. every day = Simple, today = Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: 'I generally _______ (prefer) tea, but right now I _______ (want) coffee.',
        correctAnswer: 'prefer, want',
        explanationHe: 'תשובה נכונה: prefer, want. prefer ו-want הם פעלים סטטיים - לא Progressive!',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 11.7: Common Mistakes ====================
  {
    topicNumber: 11,
    subtopicNumber: '11.7',
    titleEn: 'Common Mistakes',
    titleHe: 'טעויות נפוצות',
    level: 'elementary',
    orderIndex: 7,
    theoryContentHe: `
<h2>טעויות נפוצות ב-Present Progressive</h2>

<h3>1. שכחת am/is/are:</h3>
<p>❌ I working now.</p>
<p>✅ I am working now.</p>

<h3>2. שכחת -ing:</h3>
<p>❌ She is work.</p>
<p>✅ She is working.</p>

<h3>3. שגיאות כתיב ב-ing:</h3>
<p>❌ I am runing. → ✅ I am running.</p>
<p>❌ She is makeing. → ✅ She is making.</p>

<h3>4. פעלים סטטיים (Stative Verbs):</h3>
<div class="stative-verbs">
  <p><strong>פעלי תפיסה ותחושה:</strong></p>
  <ul>
    <li>❌ I am knowing → ✅ I know</li>
    <li>❌ I am understanding → ✅ I understand</li>
  </ul>

  <p><strong>פעלי רגש:</strong></p>
  <ul>
    <li>❌ I am loving pizza → ✅ I love pizza</li>
    <li>❌ I am wanting water → ✅ I want water</li>
  </ul>

  <p><strong>פעלי קניין:</strong></p>
  <ul>
    <li>❌ I am having a car → ✅ I have a car</li>
    <li>⚠️ חריג: ✅ I am having lunch (אוכל)</li>
  </ul>
</div>

<h3>5. שגיאות בסדר מילים בשאלות:</h3>
<p>❌ You are working? → ✅ Are you working?</p>
<p>❌ What you are doing? → ✅ What are you doing?</p>

<h3>6. קיצורים שגויים:</h3>
<p>❌ I amn't working. → ✅ I'm not working.</p>

<h3>7. בלבול בין Progressive ל-Simple:</h3>
<p>❌ She plays tennis now. → ✅ She is playing tennis now.</p>
<p>❌ I am knowing the answer. → ✅ I know the answer.</p>
    `,
    exercises: [
      // EASY (1-8): Basic error identification
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'תקן: I working now.',
        options: ['I work now', 'I am working now', 'I working', 'I works now'],
        correctAnswer: 'I am working now',
        explanationHe: 'תשובה נכונה: I am working now. חסר am.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: She is work. → She is _______.',
        correctAnswer: 'working',
        explanationHe: 'תשובה נכונה: working. חסר -ing.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'תקן: They playing.',
        options: ['They play', 'They are playing', 'They plays', 'They is playing'],
        correctAnswer: 'They are playing',
        explanationHe: 'תשובה נכונה: They are playing. חסר are.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: He is sleep. → He is _______.',
        correctAnswer: 'sleeping',
        explanationHe: 'תשובה נכונה: sleeping. חסר -ing.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'תקן: We studying.',
        options: ['We study', 'We are studying', 'We studies', 'We is studying'],
        correctAnswer: 'We are studying',
        explanationHe: 'תשובה נכונה: We are studying. חסר are.',
        difficulty: 'easy'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: I am run. → I am _______.',
        correctAnswer: 'running',
        explanationHe: 'תשובה נכונה: running. צריך -ing + הכפלת n.',
        difficulty: 'easy'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'תקן: You watching TV.',
        options: ['You watch TV', 'You are watching TV', 'You watches TV', 'You is watching TV'],
        correctAnswer: 'You are watching TV',
        explanationHe: 'תשובה נכונה: You are watching TV. חסר are.',
        difficulty: 'easy'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: She is read. → She is _______.',
        correctAnswer: 'reading',
        explanationHe: 'תשובה נכונה: reading. חסר -ing.',
        difficulty: 'easy'
      },

      // MEDIUM (9-18): Spelling and stative verbs
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'תקן: I am runing.',
        options: ['I am run', 'I am running', 'I running', 'I runs'],
        correctAnswer: 'I am running',
        explanationHe: 'תשובה נכונה: I am running. צריך להכפיל: run → running.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: She is makeing. → She is _______.',
        correctAnswer: 'making',
        explanationHe: 'תשובה נכונה: making. הסר E: make → making (לא makeing).',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'תקן: I am knowing the answer.',
        options: ['I am know the answer', 'I know the answer', 'I knowing the answer', 'I knows the answer'],
        correctAnswer: 'I know the answer',
        explanationHe: 'תשובה נכונה: I know the answer. know = פועל סטטי, לא Progressive.',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: He is swiming. → He is _______.',
        correctAnswer: 'swimming',
        explanationHe: 'תשובה נכונה: swimming. צריך להכפיל: swim → swimming.',
        difficulty: 'medium'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'תקן: I am liking pizza.',
        options: ['I am like pizza', 'I like pizza', 'I liking pizza', 'I likes pizza'],
        correctAnswer: 'I like pizza',
        explanationHe: 'תשובה נכונה: I like pizza. like = פועל סטטי, לא Progressive.',
        difficulty: 'medium'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: They are stoping. → They are _______.',
        correctAnswer: 'stopping',
        explanationHe: 'תשובה נכונה: stopping. צריך להכפיל: stop → stopping.',
        difficulty: 'medium'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'תקן: She is wanting water.',
        options: ['She is want water', 'She wants water', 'She wanting water', 'She want water'],
        correctAnswer: 'She wants water',
        explanationHe: 'תשובה נכונה: She wants water. want = פועל סטטי.',
        difficulty: 'medium'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: I am comming. → I am _______.',
        correctAnswer: 'coming',
        explanationHe: 'תשובה נכונה: coming. come → coming (לא comming, הסר E בלבד).',
        difficulty: 'medium'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'תקן: I am having a car.',
        options: ['I am have a car', 'I have a car', 'I having a car', 'I has a car'],
        correctAnswer: 'I have a car',
        explanationHe: 'תשובה נכונה: I have a car. have (בעלות) = פועל סטטי.',
        difficulty: 'medium'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'אבל: We _______ (have) lunch now. (אוכלים)',
        correctAnswer: 'are having',
        explanationHe: 'תשובה נכונה: are having. have (אוכל) = פעולה, אפשר Progressive!',
        difficulty: 'medium'
      },

      // HARD (19-30): Complex errors and word order
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'תקן: You are working? (הפוך לשאלה)',
        options: ['Do you working?', 'Are you working?', 'Is you working?', 'You working?'],
        correctAnswer: 'Are you working?',
        explanationHe: 'תשובה נכונה: Are you working? בשאלה: Are + subject + verb-ing?',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: What you are doing? → What _______ you doing?',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. סדר נכון: What + are + you.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'תקן: I amn\'t working.',
        options: ['I not working', 'I\'m not working', 'I isn\'t working', 'I don\'t working'],
        correctAnswer: 'I\'m not working',
        explanationHe: 'תשובה נכונה: I\'m not working. "I amn\'t" לא קיים!',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: He not is coming. → He _______ coming.',
        correctAnswer: 'isn\'t',
        explanationHe: 'תשובה נכונה: isn\'t (או is not). not בא אחרי is.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: 'תקן: She plays tennis now.',
        options: ['She play tennis now', 'She is playing tennis now', 'She playing tennis now', 'She is play tennis now'],
        correctAnswer: 'She is playing tennis now',
        explanationHe: 'תשובה נכונה: She is playing tennis now. now = Progressive.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: They isn\'t listening. → They _______ listening.',
        correctAnswer: 'aren\'t',
        explanationHe: 'תשובה נכונה: aren\'t. They = are (לא is).',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: 'תקן: I am understanding you.',
        options: ['I am understand you', 'I understand you', 'I understanding you', 'I understands you'],
        correctAnswer: 'I understand you',
        explanationHe: 'תשובה נכונה: I understand you. understand = פועל סטטי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: Where she is going? → Where _______ she going?',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. סדר נכון: Where + is + she.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'תקן: I am needing help.',
        options: ['I am need help', 'I need help', 'I needing help', 'I needs help'],
        correctAnswer: 'I need help',
        explanationHe: 'תשובה נכונה: I need help. need = פועל סטטי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: He is lieing. → He is _______.',
        correctAnswer: 'lying',
        explanationHe: 'תשובה נכונה: lying. lie → lying (ie → y, לא lieing).',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: 'תקן: I am believing in you.',
        options: ['I am believe in you', 'I believe in you', 'I believing in you', 'I believes in you'],
        correctAnswer: 'I believe in you',
        explanationHe: 'תשובה נכונה: I believe in you. believe = פועל סטטי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: The plant is dieing. → The plant is _______.',
        correctAnswer: 'dying',
        explanationHe: 'תשובה נכונה: dying. die → dying (ie → y, לא dieing).',
        difficulty: 'hard'
      }
    ]
  }
];

// Seed function for Topic 12
async function seedTopic12() {
  const { pool } = require('../../config/database');
  const Lesson = require('../../models/Lesson');
  const Exercise = require('../../models/Exercise');

  console.log('🌱 Seeding Topic 11: Present Progressive...\n');

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const lessonData of lessonsData) {
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
    console.log('\n✅ Topic 11: Present Progressive seeded successfully!');
    console.log(`   Total: ${lessonsData.length} lessons created`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding Topic 12:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run if called directly
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
