const { pool } = require('../../config/database');
const Lesson = require('../../models/Lesson');
const Exercise = require('../../models/Exercise');

// Topic 15: Past Simple Tense (עבר פשוט)
const lessonsData = [
  // ==================== SUBTOPIC 15.1: Introduction to Past Simple ====================
  {
    topicNumber: 15,
    subtopicNumber: '15.1',
    titleEn: 'Introduction to Past Simple',
    titleHe: 'מבוא לעבר פשוט',
    level: 'elementary',
    orderIndex: 1,
    theoryContentHe: `
<h2>מבוא ל-Past Simple (עבר פשוט)</h2>

<p><strong>מתי משתמשים ב-Past Simple?</strong></p>
<ul>
  <li>פעולות שהסתיימו בעבר: I watched a movie yesterday. (ראיתי סרט אתמול)</li>
  <li>פעולות ברצף בעבר: I woke up, ate breakfast, and went to school.</li>
  <li>הרגלים בעבר: When I was young, I played football every day.</li>
</ul>

<div class="rules">
  <h3>ביטויי זמן עבור Past Simple:</h3>
  <ul>
    <li><strong>yesterday</strong> (אתמול)</li>
    <li><strong>last</strong> (ה...שעבר) - last week, last month, last year</li>
    <li><strong>ago</strong> (לפני) - two days ago, a week ago</li>
    <li><strong>in + year</strong> - in 2020, in 1995</li>
    <li><strong>when I was...</strong> - when I was a child</li>
  </ul>
</div>

<div class="warning">
  <p><strong>שני סוגי פעלים:</strong></p>
  <p>1. <strong>Regular Verbs</strong> (פעלים רגילים) - מוסיפים -ed: play → played</p>
  <p>2. <strong>Irregular Verbs</strong> (פעלים בלתי רגילים) - צורה מיוחדת: go → went</p>
</div>

<div class="examples">
  <p><strong>דוגמאות:</strong></p>
  <p>I <strong>worked</strong> yesterday. - עבדתי אתמול</p>
  <p>She <strong>went</strong> to school. - היא הלכה לבית הספר</p>
  <p>They <strong>played</strong> football. - הם שיחקו כדורגל</p>
</div>
    `,
    exercises: [
      // Easy - 8 exercises
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'Which time expression is used with Past Simple?',
        options: ['tomorrow', 'yesterday', 'now', 'always'],
        correctAnswer: 'yesterday',
        explanationHe: 'תשובה נכונה: yesterday. Past Simple משמש לפעולות שהסתיימו בעבר, ו-yesterday מציין זמן עבר ספציפי.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'I visited my grandma _______ week. (last/next)',
        correctAnswer: 'last',
        explanationHe: 'תשובה נכונה: last. "last week" = שבוע שעבר, משמש עם Past Simple.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'איזה מילה מציינת זמן עבר?',
        options: ['ago', 'later', 'soon', 'tomorrow'],
        correctAnswer: 'ago',
        explanationHe: 'תשובה נכונה: ago. "ago" = לפני, משמש לציון זמן עבר (two days ago = לפני יומיים).',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'She called me two days _______. (ago/later)',
        correctAnswer: 'ago',
        explanationHe: 'תשובה נכונה: ago. "two days ago" = לפני יומיים, משמש עם Past Simple.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'איזו מילה מתאימה ל-Past Simple?',
        options: ['yesterday', 'tomorrow', 'now', 'every day'],
        correctAnswer: 'yesterday',
        explanationHe: 'תשובה נכונה: yesterday. yesterday = אתמול, זמן עבר ספציפי שהסתיים.',
        difficulty: 'easy'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'They moved to London _______ 2020. (in/at)',
        correctAnswer: 'in',
        explanationHe: 'תשובה נכונה: in. "in 2020" = ב-2020, משמש לציון שנה בעבר עם Past Simple.',
        difficulty: 'easy'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'Regular verbs in Past Simple end with:',
        options: ['-ing', '-ed', '-s', '-ly'],
        correctAnswer: '-ed',
        explanationHe: 'תשובה נכונה: -ed. פעלים רגילים ב-Past Simple מסתיימים ב-ed: play → played.',
        difficulty: 'easy'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ to the park yesterday. (go - Past Simple)',
        correctAnswer: 'went',
        explanationHe: 'תשובה נכונה: went. go → went (פועל בלתי רגיל). I went = הלכתי.',
        difficulty: 'easy'
      },

      // Medium - 10 exercises
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'When I _______ young, I played football.',
        options: ['am', 'was', 'were', 'be'],
        correctAnswer: 'was',
        explanationHe: 'תשובה נכונה: was. "When I was young" = כשהייתי צעיר, מתאר הרגל בעבר.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (visit) Paris last summer.',
        correctAnswer: 'visited',
        explanationHe: 'תשובה נכונה: visited. visit → visited (רגיל, +ed). last summer = קיץ שעבר.',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'They _______ a movie three days ago.',
        options: ['watch', 'watched', 'watching', 'watches'],
        correctAnswer: 'watched',
        explanationHe: 'תשובה נכונה: watched. watch → watched (רגיל, +ed). "three days ago" = לפני שלושה ימים.',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (eat) pizza for dinner yesterday.',
        correctAnswer: 'ate',
        explanationHe: 'תשובה נכונה: ate. eat → ate (בלתי רגיל). We ate = אכלנו.',
        difficulty: 'medium'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'He _______ in London in 2019.',
        options: ['live', 'lived', 'living', 'lives'],
        correctAnswer: 'lived',
        explanationHe: 'תשובה נכונה: lived. live → lived (רגיל, מסתיים ב-e אז רק +d).',
        difficulty: 'medium'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (see) that movie last week.',
        correctAnswer: 'saw',
        explanationHe: 'תשובה נכונה: saw. see → saw (בלתי רגיל). I saw = ראיתי.',
        difficulty: 'medium'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['I goed home', 'I go home yesterday', 'I went home', 'I going home'],
        correctAnswer: 'I went home',
        explanationHe: 'תשובה נכונה: I went home. go → went (בלתי רגיל). "goed" לא קיים.',
        difficulty: 'medium'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (study) English last year.',
        correctAnswer: 'studied',
        explanationHe: 'תשובה נכונה: studied. study → studied (y אחרי עיצור הופך ל-i: study → studied).',
        difficulty: 'medium'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'She _______ her homework yesterday.',
        options: ['do', 'does', 'did', 'doing'],
        correctAnswer: 'did',
        explanationHe: 'תשובה נכונה: did. do → did (בלתי רגיל). She did = היא עשתה.',
        difficulty: 'medium'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (have) a great time at the party.',
        correctAnswer: 'had',
        explanationHe: 'תשובה נכונה: had. have → had (בלתי רגיל). We had = היה לנו.',
        difficulty: 'medium'
      },

      // Hard - 12 exercises
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'I _______, ate breakfast, and went to school.',
        options: ['wake up', 'woke up', 'waking up', 'waken up'],
        correctAnswer: 'woke up',
        explanationHe: 'תשובה נכונה: woke up. wake up → woke up (בלתי רגיל). רצף פעולות בעבר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'When I was a child, I _______ (play) with toys every day.',
        correctAnswer: 'played',
        explanationHe: 'תשובה נכונה: played. play → played. מתאר הרגל בעבר (repeated action in the past).',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'She _______ the door, _______ her coat, and _______ outside.',
        options: ['open, put, go', 'opened, put, went', 'opens, puts, goes', 'opening, putting, going'],
        correctAnswer: 'opened, put, went',
        explanationHe: 'תשובה נכונה: opened, put, went. רצף של שלוש פעולות בעבר: open→opened (רגיל), put→put (בלתי רגיל, זהה), go→went (בלתי רגיל).',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (bring) a gift to the party last night.',
        correctAnswer: 'brought',
        explanationHe: 'תשובה נכונה: brought. bring → brought (בלתי רגיל). They brought = הם הביאו.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט מתאר הרגל בעבר?',
        options: ['I go to school every day', 'When I was young, I went to school every day', 'I will go to school', 'I am going to school'],
        correctAnswer: 'When I was young, I went to school every day',
        explanationHe: 'תשובה נכונה: When I was young, I went to school every day. "When I was young" מראה שזה היה הרגל בעבר (לא עוד).',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (tell) me an interesting story yesterday.',
        correctAnswer: 'told',
        explanationHe: 'תשובה נכונה: told. tell → told (בלתי רגיל). He told = הוא סיפר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: 'Which sentence shows sequential actions in the past?',
        options: ['I eat and sleep', 'I ate, then I slept', 'I will eat and sleep', 'I am eating and sleeping'],
        correctAnswer: 'I ate, then I slept',
        explanationHe: 'תשובה נכונה: I ate, then I slept. שתי פעולות ברצף בעבר: אכלתי ואז ישנתי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (meet) our friends at the mall yesterday.',
        correctAnswer: 'met',
        explanationHe: 'תשובה נכונה: met. meet → met (בלתי רגיל). We met = פגשנו.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'I lived in Paris _______ I was a student.',
        options: ['when', 'where', 'what', 'who'],
        correctAnswer: 'when',
        explanationHe: 'תשובה נכונה: when. "when I was a student" = כשהייתי תלמיד, מתאר תקופה בעבר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (buy) a new car last month.',
        correctAnswer: 'bought',
        explanationHe: 'תשובה נכונה: bought. buy → bought (בלתי רגיל). She bought = היא קנתה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: 'They _______ to the party, but they didn\'t stay long.',
        options: ['come', 'came', 'coming', 'comed'],
        correctAnswer: 'came',
        explanationHe: 'תשובה נכונה: came. come → came (בלתי רגיל). "comed" לא קיים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (know) the answer, but I forgot it.',
        correctAnswer: 'knew',
        explanationHe: 'תשובה נכונה: knew. know → knew (בלתי רגיל). I knew = ידעתי.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 15.2: Affirmative - Regular Verbs ====================
  {
    topicNumber: 15,
    subtopicNumber: '15.2',
    titleEn: 'Affirmative - Regular Verbs',
    titleHe: 'משפטים חיוביים - פעלים רגילים',
    level: 'elementary',
    orderIndex: 2,
    theoryContentHe: `
<h2>משפטים חיוביים - פעלים רגילים</h2>

<div class="rules">
  <h3>Structure (מבנה):</h3>
  <p><strong>Subject + Verb + ed</strong></p>
</div>

<div class="rules">
  <h3>כללי איות לסיומת -ed:</h3>
  <ol>
    <li><strong>רוב הפעלים:</strong> Add -ed → work → worked</li>
    <li><strong>פעלים המסתיימים ב-e:</strong> Add -d → live → lived</li>
    <li><strong>פעלים המסתיימים ב-consonant+y:</strong> Change y to i+ed → study → studied</li>
    <li><strong>פעלים קצרים (CVC):</strong> Double last consonant+ed → stop → stopped</li>
  </ol>
</div>

<div class="examples">
  <p><strong>דוגמאות:</strong></p>
  <p>I <strong>worked</strong> yesterday. - עבדתי אתמול</p>
  <p>She <strong>studied</strong> English. - היא למדה אנגלית</p>
  <p>We <strong>watched</strong> a movie. - צפינו בסרט</p>
  <p>They <strong>stopped</strong> the car. - הם עצרו את המכונית</p>
</div>

<div class="warning">
  <p><strong>שימו לב:</strong> הפועל זהה לכל הגופים - לא משתנה!</p>
  <p>I worked, you worked, he worked, she worked, we worked, they worked</p>
</div>
    `,
    exercises: [
      // Easy - 8 exercises
      {
        questionNumber: 1,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (work) yesterday.',
        correctAnswer: 'worked',
        explanationHe: 'תשובה נכונה: worked. work → worked (רגיל, +ed).',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'She _______ the movie.',
        options: ['watch', 'watched', 'watching', 'watches'],
        correctAnswer: 'watched',
        explanationHe: 'תשובה נכונה: watched. watch → watched (רגיל, +ed).',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (play) football.',
        correctAnswer: 'played',
        explanationHe: 'תשובה נכונה: played. play → played (רגיל, +ed).',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'We _______ at home.',
        options: ['stay', 'stayed', 'staying', 'stays'],
        correctAnswer: 'stayed',
        explanationHe: 'תשובה נכונה: stayed. stay → stayed (רגיל, +ed).',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (walk) to school.',
        correctAnswer: 'walked',
        explanationHe: 'תשובה נכונה: walked. walk → walked (רגיל, +ed).',
        difficulty: 'easy'
      },
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'I _______ my homework.',
        options: ['finish', 'finished', 'finishing', 'finishes'],
        correctAnswer: 'finished',
        explanationHe: 'תשובה נכונה: finished. finish → finished (רגיל, +ed).',
        difficulty: 'easy'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (talk) to her friend.',
        correctAnswer: 'talked',
        explanationHe: 'תשובה נכונה: talked. talk → talked (רגיל, +ed).',
        difficulty: 'easy'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'They _______ the door.',
        options: ['open', 'opened', 'opening', 'opens'],
        correctAnswer: 'opened',
        explanationHe: 'תשובה נכונה: opened. open → opened (רגיל, +ed).',
        difficulty: 'easy'
      },

      // Medium - 10 exercises
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (live) in Tel Aviv in 2020.',
        correctAnswer: 'lived',
        explanationHe: 'תשובה נכונה: lived. live → lived (מסתיים ב-e, אז רק +d).',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'She _______ at 5 PM.',
        options: ['arrive', 'arrived', 'arriving', 'arrives'],
        correctAnswer: 'arrived',
        explanationHe: 'תשובה נכונה: arrived. arrive → arrived (מסתיים ב-e, אז רק +d).',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (close) the windows.',
        correctAnswer: 'closed',
        explanationHe: 'תשובה נכונה: closed. close → closed (מסתיים ב-e, אז רק +d).',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: 'He _______ English last year.',
        options: ['study', 'studied', 'studying', 'studies'],
        correctAnswer: 'studied',
        explanationHe: 'תשובה נכונה: studied. study → studied (y אחרי עיצור הופך ל-i+ed).',
        difficulty: 'medium'
      },
      {
        questionNumber: 13,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (try) to help me.',
        correctAnswer: 'tried',
        explanationHe: 'תשובה נכונה: tried. try → tried (y אחרי עיצור הופך ל-i+ed).',
        difficulty: 'medium'
      },
      {
        questionNumber: 14,
        type: 'multiple_choice',
        questionTextHe: 'She _______ all night.',
        options: ['cry', 'cried', 'crying', 'cries'],
        correctAnswer: 'cried',
        explanationHe: 'תשובה נכונה: cried. cry → cried (y אחרי עיצור הופך ל-i+ed).',
        difficulty: 'medium'
      },
      {
        questionNumber: 15,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (carry) the heavy bag.',
        correctAnswer: 'carried',
        explanationHe: 'תשובה נכונה: carried. carry → carried (y אחרי עיצור הופך ל-i+ed).',
        difficulty: 'medium'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'BUT: They _______ volleyball. (y אחרי תנועה)',
        options: ['play', 'plaied', 'played', 'playing'],
        correctAnswer: 'played',
        explanationHe: 'תשובה נכונה: played. play → played (y אחרי תנועה, רק +ed, לא משנה את ה-y).',
        difficulty: 'medium'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (enjoy) the party.',
        correctAnswer: 'enjoyed',
        explanationHe: 'תשובה נכונה: enjoyed. enjoy → enjoyed (y אחרי תנועה, רק +ed).',
        difficulty: 'medium'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'We _______ early.',
        options: ['stay', 'staied', 'stayed', 'staying'],
        correctAnswer: 'stayed',
        explanationHe: 'תשובה נכונה: stayed. stay → stayed (y אחרי תנועה, רק +ed).',
        difficulty: 'medium'
      },

      // Hard - 12 exercises
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (stop) the car.',
        correctAnswer: 'stopped',
        explanationHe: 'תשובה נכונה: stopped. stop → stopped (CVC - מכפילים את העיצור האחרון+ed).',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'She _______ the trip.',
        options: ['plan', 'planed', 'planned', 'planning'],
        correctAnswer: 'planned',
        explanationHe: 'תשובה נכונה: planned. plan → planned (CVC - מכפילים את ה-n+ed).',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (drop) the ball.',
        correctAnswer: 'dropped',
        explanationHe: 'תשובה נכונה: dropped. drop → dropped (CVC - מכפילים את ה-p+ed).',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'multiple_choice',
        questionTextHe: 'He _______ to the music.',
        options: ['listen', 'listend', 'listened', 'listening'],
        correctAnswer: 'listened',
        explanationHe: 'תשובה נכונה: listened. listen → listened (2 הברות, לא מכפילים, רק +ed).',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (visit) our grandma.',
        correctAnswer: 'visited',
        explanationHe: 'תשובה נכונה: visited. visit → visited (2 הברות, לא מכפילים, רק +ed).',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'multiple_choice',
        questionTextHe: 'I _______ my mistake.',
        options: ['admit', 'admited', 'admitted', 'admitting'],
        correctAnswer: 'admitted',
        explanationHe: 'תשובה נכונה: admitted. admit → admitted (CVC עם הדגש בהברה השנייה - מכפילים).',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (travel) to Europe.',
        correctAnswer: 'travelled',
        explanationHe: 'תשובה נכונה: travelled (או traveled באנגלית אמריקאית). travel → travelled (בריטית).',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'multiple_choice',
        questionTextHe: 'איזה כתיב נכון?',
        options: ['I stoped', 'I stopped', 'I stoppped', 'I stopt'],
        correctAnswer: 'I stopped',
        explanationHe: 'תשובה נכונה: I stopped. stop → stopped (מכפילים את ה-p).',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (permit) us to enter.',
        correctAnswer: 'permitted',
        explanationHe: 'תשובה נכונה: permitted. permit → permitted (CVC עם הדגש בהברה השנייה).',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'multiple_choice',
        questionTextHe: 'He _______ in the exam.',
        options: ['fail', 'failed', 'failled', 'failing'],
        correctAnswer: 'failed',
        explanationHe: 'תשובה נכונה: failed. fail → failed (רגיל, רק +ed, לא מכפילים).',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (prefer) coffee over tea.',
        correctAnswer: 'preferred',
        explanationHe: 'תשובה נכונה: preferred. prefer → preferred (CVC עם הדגש בהברה השנייה).',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'multiple_choice',
        questionTextHe: 'She _______ loudly.',
        options: ['laugh', 'laughed', 'laught', 'laughted'],
        correctAnswer: 'laughed',
        explanationHe: 'תשובה נכונה: laughed. laugh → laughed (רגיל, +ed).',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 15.3: Affirmative - Irregular Verbs ====================
  {
    topicNumber: 15,
    subtopicNumber: '15.3',
    titleEn: 'Affirmative - Irregular Verbs',
    titleHe: 'משפטים חיוביים - פעלים בלתי רגילים',
    level: 'elementary',
    orderIndex: 3,
    theoryContentHe: `
<h2>משפטים חיוביים - פעלים בלתי רגילים</h2>

<div class="warning">
  <p><strong>חשוב!</strong> Irregular verbs don't follow rules - you must memorize them!</p>
  <p>(אין כלל - צריך לשנן!)</p>
</div>

<div class="rules">
  <h3>פעלים בלתי רגילים נפוצים:</h3>
  <ul>
    <li>go → <strong>went</strong> (הלך)</li>
    <li>come → <strong>came</strong> (בא)</li>
    <li>see → <strong>saw</strong> (ראה)</li>
    <li>eat → <strong>ate</strong> (אכל)</li>
    <li>drink → <strong>drank</strong> (שתה)</li>
    <li>make → <strong>made</strong> (עשה/הכין)</li>
    <li>take → <strong>took</strong> (לקח)</li>
    <li>give → <strong>gave</strong> (נתן)</li>
    <li>buy → <strong>bought</strong> (קנה)</li>
    <li>think → <strong>thought</strong> (חשב)</li>
  </ul>
</div>

<div class="examples">
  <p><strong>דוגמאות:</strong></p>
  <p>I <strong>went</strong> to school. - הלכתי לבית הספר</p>
  <p>She <strong>saw</strong> a movie. - היא ראתה סרט</p>
  <p>We <strong>ate</strong> pizza. - אכלנו פיצה</p>
  <p>They <strong>bought</strong> a car. - הם קנו מכונית</p>
</div>
    `,
    exercises: [
      // Easy - 8 exercises
      {
        questionNumber: 1,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (go) to school.',
        correctAnswer: 'went',
        explanationHe: 'תשובה נכונה: went. go → went (בלתי רגיל).',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'She _______ a movie.',
        options: ['see', 'saw', 'seed', 'seen'],
        correctAnswer: 'saw',
        explanationHe: 'תשובה נכונה: saw. see → saw (בלתי רגיל).',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (eat) pizza.',
        correctAnswer: 'ate',
        explanationHe: 'תשובה נכונה: ate. eat → ate (בלתי רגיל).',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'They _______ to the party.',
        options: ['come', 'came', 'comed', 'coming'],
        correctAnswer: 'came',
        explanationHe: 'תשובה נכונה: came. come → came (בלתי רגיל). "comed" לא קיים.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (make) a cake.',
        correctAnswer: 'made',
        explanationHe: 'תשובה נכונה: made. make → made (בלתי רגיל).',
        difficulty: 'easy'
      },
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'I _______ coffee.',
        options: ['drink', 'drank', 'drinked', 'drunk'],
        correctAnswer: 'drank',
        explanationHe: 'תשובה נכונה: drank. drink → drank (בלתי רגיל). "drinked" לא קיים.',
        difficulty: 'easy'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (buy) a car.',
        correctAnswer: 'bought',
        explanationHe: 'תשובה נכונה: bought. buy → bought (בלתי רגיל).',
        difficulty: 'easy'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'We _______ a photo.',
        options: ['take', 'took', 'taked', 'taken'],
        correctAnswer: 'took',
        explanationHe: 'תשובה נכונה: took. take → took (בלתי רגיל). "taked" לא קיים.',
        difficulty: 'easy'
      },

      // Medium - 10 exercises
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (have) a great time.',
        correctAnswer: 'had',
        explanationHe: 'תשובה נכונה: had. have → had (בלתי רגיל).',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'She _______ her homework.',
        options: ['do', 'did', 'doed', 'done'],
        correctAnswer: 'did',
        explanationHe: 'תשובה נכונה: did. do → did (בלתי רגיל).',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (give) me a gift.',
        correctAnswer: 'gave',
        explanationHe: 'תשובה נכונה: gave. give → gave (בלתי רגיל).',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: 'He _______ the truth.',
        options: ['say', 'said', 'sayed', 'saying'],
        correctAnswer: 'said',
        explanationHe: 'תשובה נכונה: said. say → said (בלתי רגיל).',
        difficulty: 'medium'
      },
      {
        questionNumber: 13,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (write) a letter.',
        correctAnswer: 'wrote',
        explanationHe: 'תשובה נכונה: wrote. write → wrote (בלתי רגיל).',
        difficulty: 'medium'
      },
      {
        questionNumber: 14,
        type: 'multiple_choice',
        questionTextHe: 'She _______ a book.',
        options: ['read', 'red', 'readed', 'reading'],
        correctAnswer: 'read',
        explanationHe: 'תשובה נכונה: read (נשמע "red"). read → read (כתיב זהה, אבל הגייה שונה).',
        difficulty: 'medium'
      },
      {
        questionNumber: 15,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (find) the keys.',
        correctAnswer: 'found',
        explanationHe: 'תשובה נכונה: found. find → found (בלתי רגיל).',
        difficulty: 'medium'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'They _______ the game.',
        options: ['win', 'won', 'winned', 'winning'],
        correctAnswer: 'won',
        explanationHe: 'תשובה נכונה: won. win → won (בלתי רגיל). "winned" לא קיים.',
        difficulty: 'medium'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (know) the answer.',
        correctAnswer: 'knew',
        explanationHe: 'תשובה נכונה: knew. know → knew (בלתי רגיל).',
        difficulty: 'medium'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'I _______ English.',
        options: ['speak', 'spoke', 'speaked', 'spoken'],
        correctAnswer: 'spoke',
        explanationHe: 'תשובה נכונה: spoke. speak → spoke (בלתי רגיל).',
        difficulty: 'medium'
      },

      // Hard - 12 exercises
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (bring) a gift.',
        correctAnswer: 'brought',
        explanationHe: 'תשובה נכונה: brought. bring → brought (בלתי רגיל).',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'She _______ me a story.',
        options: ['tell', 'told', 'telled', 'telling'],
        correctAnswer: 'told',
        explanationHe: 'תשובה נכונה: told. tell → told (בלתי רגיל). "telled" לא קיים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (meet) our friends.',
        correctAnswer: 'met',
        explanationHe: 'תשובה נכונה: met. meet → met (בלתי רגיל).',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'multiple_choice',
        questionTextHe: 'They _______ early.',
        options: ['leave', 'left', 'leaved', 'leaving'],
        correctAnswer: 'left',
        explanationHe: 'תשובה נכונה: left. leave → left (בלתי רגיל). "leaved" לא קיים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (sit) on the chair.',
        correctAnswer: 'sat',
        explanationHe: 'תשובה נכונה: sat. sit → sat (בלתי רגיל).',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'multiple_choice',
        questionTextHe: 'I _______ sad.',
        options: ['feel', 'felt', 'feeled', 'feeling'],
        correctAnswer: 'felt',
        explanationHe: 'תשובה נכונה: felt. feel → felt (בלתי רגיל).',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (understand) the lesson.',
        correctAnswer: 'understood',
        explanationHe: 'תשובה נכונה: understood. understand → understood (בלתי רגיל).',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'multiple_choice',
        questionTextHe: 'We _______ a car.',
        options: ['drive', 'drove', 'drived', 'driven'],
        correctAnswer: 'drove',
        explanationHe: 'תשובה נכונה: drove. drive → drove (בלתי רגיל).',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (spend) $100.',
        correctAnswer: 'spent',
        explanationHe: 'תשובה נכונה: spent. spend → spent (בלתי רגיל).',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'multiple_choice',
        questionTextHe: 'He _______ the window.',
        options: ['break', 'broke', 'breaked', 'broken'],
        correctAnswer: 'broke',
        explanationHe: 'תשובה נכונה: broke. break → broke (בלתי רגיל).',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (hear) a noise.',
        correctAnswer: 'heard',
        explanationHe: 'תשובה נכונה: heard. hear → heard (בלתי רגיל).',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'multiple_choice',
        questionTextHe: 'She _______ a jacket.',
        options: ['wear', 'wore', 'weared', 'worn'],
        correctAnswer: 'wore',
        explanationHe: 'תשובה נכונה: wore. wear → wore (בלתי רגיל).',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 15.4: Negative Sentences ====================
  {
    topicNumber: 15,
    subtopicNumber: '15.4',
    titleEn: 'Negative Sentences',
    titleHe: 'משפטים שליליים',
    level: 'elementary',
    orderIndex: 4,
    theoryContentHe: `
<h2>משפטים שליליים</h2>

<div class="rules">
  <h3>Structure (מבנה):</h3>
  <p><strong>Subject + did not (didn't) + base verb</strong></p>
</div>

<div class="warning">
  <p><strong>חשוב מאוד!</strong></p>
  <p>Use "didn't" + <strong>base form</strong> of the verb (לא -ed, לא צורת עבר!)</p>
  <p>Works for ALL verbs - regular and irregular</p>
</div>

<div class="examples">
  <p><strong>דוגמאות - פעלים רגילים:</strong></p>
  <p>I <strong>didn't work</strong> yesterday. - לא עבדתי אתמול</p>
  <p>She <strong>didn't study</strong> last night. - היא לא למדה אתמול בלילה</p>

  <p><strong>דוגמאות - פעלים בלתי רגילים:</strong></p>
  <p>I <strong>didn't go</strong> to school. - לא הלכתי לבית הספר</p>
  <p>He <strong>didn't see</strong> the movie. - הוא לא ראה את הסרט</p>
</div>

<div class="warning">
  <p><strong>זכרו:</strong> didn't + base verb (not past form!)</p>
  <p>❌ I didn't went → ✅ I didn't go</p>
  <p>❌ She didn't saw → ✅ She didn't see</p>
</div>
    `,
    exercises: [
      // Easy - 8 exercises
      {
        questionNumber: 1,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (not work) yesterday.',
        correctAnswer: 'didn\'t work',
        explanationHe: 'תשובה נכונה: didn\'t work. didn\'t + base verb (לא worked!).',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'She _______ TV last night.',
        options: ['didn\'t watch', 'didn\'t watched', 'not watched', 'no watched'],
        correctAnswer: 'didn\'t watch',
        explanationHe: 'תשובה נכונה: didn\'t watch. didn\'t + base verb.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (not play) football.',
        correctAnswer: 'didn\'t play',
        explanationHe: 'תשובה נכונה: didn\'t play. didn\'t + base verb.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'We _______ at home.',
        options: ['didn\'t stay', 'didn\'t stayed', 'not stayed', 'no stayed'],
        correctAnswer: 'didn\'t stay',
        explanationHe: 'תשובה נכונה: didn\'t stay. didn\'t + base verb.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (not finish) his homework.',
        correctAnswer: 'didn\'t finish',
        explanationHe: 'תשובה נכונה: didn\'t finish. didn\'t + base verb.',
        difficulty: 'easy'
      },
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'I _______ coffee.',
        options: ['didn\'t drink', 'didn\'t drank', 'not drank', 'no drink'],
        correctAnswer: 'didn\'t drink',
        explanationHe: 'תשובה נכונה: didn\'t drink. didn\'t + base verb (לא drank!).',
        difficulty: 'easy'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (not go) to school.',
        correctAnswer: 'didn\'t go',
        explanationHe: 'תשובה נכונה: didn\'t go. didn\'t + base verb (לא went!).',
        difficulty: 'easy'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'They _______ the movie.',
        options: ['didn\'t see', 'didn\'t saw', 'not saw', 'no see'],
        correctAnswer: 'didn\'t see',
        explanationHe: 'תשובה נכונה: didn\'t see. didn\'t + base verb (לא saw!).',
        difficulty: 'easy'
      },

      // Medium - 10 exercises
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (not eat) breakfast.',
        correctAnswer: 'didn\'t eat',
        explanationHe: 'תשובה נכונה: didn\'t eat. didn\'t + base verb (לא ate!).',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'He _______ to the party.',
        options: ['didn\'t come', 'didn\'t came', 'not came', 'no come'],
        correctAnswer: 'didn\'t come',
        explanationHe: 'תשובה נכונה: didn\'t come. didn\'t + base verb.',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (not buy) anything.',
        correctAnswer: 'didn\'t buy',
        explanationHe: 'תשובה נכונה: didn\'t buy. didn\'t + base verb (לא bought!).',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: 'She _______ her homework.',
        options: ['didn\'t do', 'didn\'t did', 'not did', 'no do'],
        correctAnswer: 'didn\'t do',
        explanationHe: 'תשובה נכונה: didn\'t do. didn\'t + base verb (לא did!).',
        difficulty: 'medium'
      },
      {
        questionNumber: 13,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (not have) time.',
        correctAnswer: 'didn\'t have',
        explanationHe: 'תשובה נכונה: didn\'t have. didn\'t + base verb (לא had!).',
        difficulty: 'medium'
      },
      {
        questionNumber: 14,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['I didn\'t went', 'I didn\'t go', 'I not went', 'I no go'],
        correctAnswer: 'I didn\'t go',
        explanationHe: 'תשובה נכונה: I didn\'t go. didn\'t + base verb.',
        difficulty: 'medium'
      },
      {
        questionNumber: 15,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (not tell) me the truth.',
        correctAnswer: 'didn\'t tell',
        explanationHe: 'תשובה נכונה: didn\'t tell. didn\'t + base verb (לא told!).',
        difficulty: 'medium'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'I _______ the answer.',
        options: ['didn\'t know', 'didn\'t knew', 'not knew', 'no know'],
        correctAnswer: 'didn\'t know',
        explanationHe: 'תשובה נכונה: didn\'t know. didn\'t + base verb (לא knew!).',
        difficulty: 'medium'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (not understand) the lesson.',
        correctAnswer: 'didn\'t understand',
        explanationHe: 'תשובה נכונה: didn\'t understand. didn\'t + base verb (לא understood!).',
        difficulty: 'medium'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'She _______ English.',
        options: ['didn\'t speak', 'didn\'t spoke', 'not spoke', 'no speak'],
        correctAnswer: 'didn\'t speak',
        explanationHe: 'תשובה נכונה: didn\'t speak. didn\'t + base verb.',
        difficulty: 'medium'
      },

      // Hard - 12 exercises
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (not bring) my book.',
        correctAnswer: 'didn\'t bring',
        explanationHe: 'תשובה נכונה: didn\'t bring. didn\'t + base verb (לא brought!).',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'They _______ early.',
        options: ['didn\'t leave', 'didn\'t left', 'not left', 'no leave'],
        correctAnswer: 'didn\'t leave',
        explanationHe: 'תשובה נכונה: didn\'t leave. didn\'t + base verb (לא left!).',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'fill_in_blank',
        questionTextHe: 'He _______ (not write) the report.',
        correctAnswer: 'didn\'t write',
        explanationHe: 'תשובה נכונה: didn\'t write. didn\'t + base verb (לא wrote!).',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'multiple_choice',
        questionTextHe: 'We _______ the game.',
        options: ['didn\'t win', 'didn\'t won', 'not won', 'no win'],
        correctAnswer: 'didn\'t win',
        explanationHe: 'תשובה נכונה: didn\'t win. didn\'t + base verb (לא won!).',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'fill_in_blank',
        questionTextHe: 'She _______ (not meet) her friends.',
        correctAnswer: 'didn\'t meet',
        explanationHe: 'תשובה נכונה: didn\'t meet. didn\'t + base verb (לא met!).',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'multiple_choice',
        questionTextHe: 'I _______ $100.',
        options: ['didn\'t spend', 'didn\'t spent', 'not spent', 'no spend'],
        correctAnswer: 'didn\'t spend',
        explanationHe: 'תשובה נכונה: didn\'t spend. didn\'t + base verb (לא spent!).',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'fill_in_blank',
        questionTextHe: 'They _______ (not drive) to work.',
        correctAnswer: 'didn\'t drive',
        explanationHe: 'תשובה נכונה: didn\'t drive. didn\'t + base verb (לא drove!).',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'multiple_choice',
        questionTextHe: 'He _______ the window.',
        options: ['didn\'t break', 'didn\'t broke', 'not broke', 'no break'],
        correctAnswer: 'didn\'t break',
        explanationHe: 'תשובה נכונה: didn\'t break. didn\'t + base verb.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'fill_in_blank',
        questionTextHe: 'I _______ (not feel) well yesterday.',
        correctAnswer: 'didn\'t feel',
        explanationHe: 'תשובה נכונה: didn\'t feel. didn\'t + base verb (לא felt!).',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'multiple_choice',
        questionTextHe: 'She _______ a coat.',
        options: ['didn\'t wear', 'didn\'t wore', 'not wore', 'no wear'],
        correctAnswer: 'didn\'t wear',
        explanationHe: 'תשובה נכונה: didn\'t wear. didn\'t + base verb.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'fill_in_blank',
        questionTextHe: 'We _______ (not hear) the news.',
        correctAnswer: 'didn\'t hear',
        explanationHe: 'תשובה נכונה: didn\'t hear. didn\'t + base verb (לא heard!).',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'multiple_choice',
        questionTextHe: 'They _______ well last night.',
        options: ['didn\'t sleep', 'didn\'t slept', 'not slept', 'no sleep'],
        correctAnswer: 'didn\'t sleep',
        explanationHe: 'תשובה נכונה: didn\'t sleep. didn\'t + base verb.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 15.5: Yes/No Questions ====================
  {
    topicNumber: 15,
    subtopicNumber: '15.5',
    titleEn: 'Yes/No Questions',
    titleHe: 'שאלות כן/לא',
    level: 'elementary',
    orderIndex: 5,
    theoryContentHe: `
<h2>שאלות כן/לא (Yes/No Questions)</h2>

<div class="rules">
  <h3>Structure (מבנה):</h3>
  <p><strong>Did + subject + base verb?</strong></p>
</div>

<div class="warning">
  <p><strong>Important:</strong> Use "did" + <strong>base form</strong> (not past form!)</p>
</div>

<div class="examples">
  <p><strong>דוגמאות:</strong></p>
  <p><strong>Did you work</strong> yesterday? - עבדת אתמול?</p>
  <p>  Yes, I did. / No, I didn't.</p>
  <p><strong>Did she go</strong> to school? - היא הלכה לבית הספר?</p>
  <p>  Yes, she did. / No, she didn't.</p>
  <p><strong>Did they see</strong> the movie? - הם ראו את הסרט?</p>
  <p>  Yes, they did. / No, they didn't.</p>
</div>

<div class="rules">
  <h3>Short Answers (תשובות קצרות):</h3>
  <p>Yes, I/you/he/she/it/we/they <strong>did</strong>.</p>
  <p>No, I/you/he/she/it/we/they <strong>didn't</strong>.</p>
</div>

<div class="warning">
  <p><strong>Common Mistakes:</strong></p>
  <p>❌ Did you went home? → ✅ Did you go home?</p>
  <p>❌ Did she played? → ✅ Did she play?</p>
</div>
    `,
    exercises: [
      // Easy - 8 exercises
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: '_______ you work yesterday?',
        options: ['Did', 'Do', 'Does', 'Done'],
        correctAnswer: 'Did',
        explanationHe: 'תשובה נכונה: Did. Did + you + base verb לשאלה בעבר.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: '_______ she go to school? (שאלה בעבר)',
        correctAnswer: 'Did',
        explanationHe: 'תשובה נכונה: Did. Did + she + base verb.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'Did they _______ football?',
        options: ['play', 'played', 'playing', 'plays'],
        correctAnswer: 'play',
        explanationHe: 'תשובה נכונה: play. Did + base verb (לא played!).',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'Did he _______ (eat) breakfast?',
        correctAnswer: 'eat',
        explanationHe: 'תשובה נכונה: eat. Did + base verb (לא ate!).',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'איזו תשובה קצרה נכונה? Did you see the movie?',
        options: ['Yes, I did', 'Yes, I do', 'Yes, I see', 'Yes, I saw'],
        correctAnswer: 'Yes, I did',
        explanationHe: 'תשובה נכונה: Yes, I did. תשובה קצרה לשאלת Did.',
        difficulty: 'easy'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'Did she like the movie? No, she _______.',
        correctAnswer: 'didn\'t',
        explanationHe: 'תשובה נכונה: didn\'t. תשובה שלילית קצרה: No, she didn\'t.',
        difficulty: 'easy'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: '_______ it rain yesterday?',
        options: ['Did', 'Do', 'Does', 'Done'],
        correctAnswer: 'Did',
        explanationHe: 'תשובה נכונה: Did. Did + it + base verb.',
        difficulty: 'easy'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'Did they _______ (come) to the party?',
        correctAnswer: 'come',
        explanationHe: 'תשובה נכונה: come. Did + base verb (לא came!).',
        difficulty: 'easy'
      },

      // Medium - 10 exercises
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'Did you _______ your homework?',
        options: ['do', 'did', 'done', 'doing'],
        correctAnswer: 'do',
        explanationHe: 'תשובה נכונה: do. Did + base verb (לא did!).',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: '_______ he _______ (buy) a new car? (שאלה מלאה)',
        correctAnswer: 'Did he buy',
        explanationHe: 'תשובה נכונה: Did he buy. Did + subject + base verb.',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'Did she _______ English last year?',
        options: ['study', 'studied', 'studying', 'studies'],
        correctAnswer: 'study',
        explanationHe: 'תשובה נכונה: study. Did + base verb.',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'Did they _______ (have) a good time?',
        correctAnswer: 'have',
        explanationHe: 'תשובה נכונה: have. Did + base verb (לא had!).',
        difficulty: 'medium'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['Did you went home?', 'Did you go home?', 'Do you went home?', 'Do you go home?'],
        correctAnswer: 'Did you go home?',
        explanationHe: 'תשובה נכונה: Did you go home? Did + base verb.',
        difficulty: 'medium'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'Did we _______ (meet) them yesterday?',
        correctAnswer: 'meet',
        explanationHe: 'תשובה נכונה: meet. Did + base verb (לא met!).',
        difficulty: 'medium'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'Did he _______ the truth?',
        options: ['tell', 'told', 'telling', 'tells'],
        correctAnswer: 'tell',
        explanationHe: 'תשובה נכונה: tell. Did + base verb (לא told!).',
        difficulty: 'medium'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'Did she _______ (understand) the lesson?',
        correctAnswer: 'understand',
        explanationHe: 'תשובה נכונה: understand. Did + base verb (לא understood!).',
        difficulty: 'medium'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'Did they _______ early?',
        options: ['leave', 'left', 'leaving', 'leaves'],
        correctAnswer: 'leave',
        explanationHe: 'תשובה נכונה: leave. Did + base verb.',
        difficulty: 'medium'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'Did you _______ (hear) that noise?',
        correctAnswer: 'hear',
        explanationHe: 'תשובה נכונה: hear. Did + base verb (לא heard!).',
        difficulty: 'medium'
      },

      // Hard - 12 exercises
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'Did she _______ you the book?',
        options: ['give', 'gave', 'given', 'giving'],
        correctAnswer: 'give',
        explanationHe: 'תשובה נכונה: give. Did + base verb (לא gave!).',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: '_______ they _______ (bring) their own food? (שאלה מלאה)',
        correctAnswer: 'Did they bring',
        explanationHe: 'תשובה נכונה: Did they bring. Did + subject + base verb.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'Did he _______ the window by accident?',
        options: ['break', 'broke', 'broken', 'breaking'],
        correctAnswer: 'break',
        explanationHe: 'תשובה נכונה: break. Did + base verb.',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: 'Did you _______ (write) the report yesterday?',
        correctAnswer: 'write',
        explanationHe: 'תשובה נכונה: write. Did + base verb (לא wrote!).',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: 'Did they _______ the game?',
        options: ['win', 'won', 'winning', 'wins'],
        correctAnswer: 'win',
        explanationHe: 'תשובה נכונה: win. Did + base verb (לא won!).',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: 'Did she _______ (spend) a lot of money?',
        correctAnswer: 'spend',
        explanationHe: 'תשובה נכונה: spend. Did + base verb (לא spent!).',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: 'Did we _______ to the right place?',
        options: ['drive', 'drove', 'driven', 'driving'],
        correctAnswer: 'drive',
        explanationHe: 'תשובה נכונה: drive. Did + base verb.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: 'Did he _______ (feel) sick yesterday?',
        correctAnswer: 'feel',
        explanationHe: 'תשובה נכונה: feel. Did + base verb (לא felt!).',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'Did you _______ your keys?',
        options: ['find', 'found', 'finding', 'finds'],
        correctAnswer: 'find',
        explanationHe: 'תשובה נכונה: find. Did + base verb (לא found!).',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: 'Did they _______ (know) about the party?',
        correctAnswer: 'know',
        explanationHe: 'תשובה נכונה: know. Did + base verb (לא knew!).',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: 'Did she _______ a coat yesterday?',
        options: ['wear', 'wore', 'worn', 'wearing'],
        correctAnswer: 'wear',
        explanationHe: 'תשובה נכונה: wear. Did + base verb.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: 'Did he _______ (speak) to the manager?',
        correctAnswer: 'speak',
        explanationHe: 'תשובה נכונה: speak. Did + base verb (לא spoke!).',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 15.6: Wh- Questions ====================
  {
    topicNumber: 15,
    subtopicNumber: '15.6',
    titleEn: 'Wh- Questions',
    titleHe: 'שאלות מידע',
    level: 'elementary',
    orderIndex: 6,
    theoryContentHe: `
<h2>שאלות מידע (Wh- Questions)</h2>

<div class="rules">
  <h3>Structure (מבנה):</h3>
  <p><strong>Wh- word + did + subject + base verb?</strong></p>
</div>

<div class="rules">
  <h3>Question Words (מילות שאלה):</h3>
  <ul>
    <li><strong>What</strong> (מה) - What did you do?</li>
    <li><strong>Where</strong> (איפה) - Where did you go?</li>
    <li><strong>When</strong> (מתי) - When did it happen?</li>
    <li><strong>Who</strong> (מי) - Who did you meet?</li>
    <li><strong>Why</strong> (למה) - Why did she leave?</li>
    <li><strong>How</strong> (איך) - How did you get here?</li>
  </ul>
</div>

<div class="examples">
  <p><strong>דוגמאות:</strong></p>
  <p><strong>What did you do</strong> yesterday? - מה עשית אתמול?</p>
  <p><strong>Where did she go?</strong> - לאן היא הלכה?</p>
  <p><strong>When did they arrive?</strong> - מתי הם הגיעו?</p>
  <p><strong>Who did you see?</strong> - את מי ראית?</p>
  <p><strong>Why did he leave?</strong> - למה הוא עזב?</p>
  <p><strong>How did you know?</strong> - איך ידעת?</p>
</div>

<div class="warning">
  <p><strong>Special Case - WHO as subject:</strong></p>
  <p>When "who" is the subject, don't use "did":</p>
  <p>✅ Who called? (מי התקשר?)</p>
  <p>❌ Who did call?</p>
</div>
    `,
    exercises: [
      // Easy - 8 exercises
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: '_______ did you go yesterday?',
        options: ['Where', 'What', 'Who', 'When'],
        correctAnswer: 'Where',
        explanationHe: 'תשובה נכונה: Where. "Where did you go?" = לאן הלכת?',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: '_______ did she do? (מה)',
        correctAnswer: 'What',
        explanationHe: 'תשובה נכונה: What. "What did she do?" = מה היא עשתה?',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: '_______ did they arrive?',
        options: ['When', 'Where', 'What', 'Who'],
        correctAnswer: 'When',
        explanationHe: 'תשובה נכונה: When. "When did they arrive?" = מתי הם הגיעו?',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: '_______ did you meet? (מי)',
        correctAnswer: 'Who',
        explanationHe: 'תשובה נכונה: Who. "Who did you meet?" = את מי פגשת?',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: '_______ did he leave early?',
        options: ['Why', 'When', 'Where', 'What'],
        correctAnswer: 'Why',
        explanationHe: 'תשובה נכונה: Why. "Why did he leave?" = למה הוא עזב?',
        difficulty: 'easy'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: '_______ did you know? (איך)',
        correctAnswer: 'How',
        explanationHe: 'תשובה נכונה: How. "How did you know?" = איך ידעת?',
        difficulty: 'easy'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'What did you _______ yesterday?',
        options: ['do', 'did', 'done', 'doing'],
        correctAnswer: 'do',
        explanationHe: 'תשובה נכונה: do. Wh- + did + base verb.',
        difficulty: 'easy'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'Where did she _______ (go)?',
        correctAnswer: 'go',
        explanationHe: 'תשובה נכונה: go. Wh- + did + base verb (לא went!).',
        difficulty: 'easy'
      },

      // Medium - 10 exercises
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'What did she _______ for lunch?',
        options: ['eat', 'ate', 'eating', 'eats'],
        correctAnswer: 'eat',
        explanationHe: 'תשובה נכונה: eat. Wh- + did + base verb (לא ate!).',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'When did they _______ (arrive)?',
        correctAnswer: 'arrive',
        explanationHe: 'תשובה נכונה: arrive. Wh- + did + base verb.',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'Where did he _______ his keys?',
        options: ['find', 'found', 'finding', 'finds'],
        correctAnswer: 'find',
        explanationHe: 'תשובה נכונה: find. Wh- + did + base verb.',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'Why did you _______ (leave) early?',
        correctAnswer: 'leave',
        explanationHe: 'תשובה נכונה: leave. Wh- + did + base verb (לא left!).',
        difficulty: 'medium'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'How did she _______ there?',
        options: ['get', 'got', 'getting', 'gets'],
        correctAnswer: 'get',
        explanationHe: 'תשובה נכונה: get. Wh- + did + base verb (לא got!).',
        difficulty: 'medium'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'Who did they _______ (invite) to the party?',
        correctAnswer: 'invite',
        explanationHe: 'תשובה נכונה: invite. Wh- + did + base verb.',
        difficulty: 'medium'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['What did you saw?', 'What did you see?', 'What you saw?', 'What you see?'],
        correctAnswer: 'What did you see?',
        explanationHe: 'תשובה נכונה: What did you see? Wh- + did + base verb.',
        difficulty: 'medium'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'When did he _______ (call) you?',
        correctAnswer: 'call',
        explanationHe: 'תשובה נכונה: call. Wh- + did + base verb.',
        difficulty: 'medium'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'What did they _______ about?',
        options: ['talk', 'talked', 'talking', 'talks'],
        correctAnswer: 'talk',
        explanationHe: 'תשובה נכונה: talk. Wh- + did + base verb.',
        difficulty: 'medium'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'Where did you _______ (live) before?',
        correctAnswer: 'live',
        explanationHe: 'תשובה נכונה: live. Wh- + did + base verb (לא lived!).',
        difficulty: 'medium'
      },

      // Hard - 12 exercises
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'Why did she _______ her job?',
        options: ['quit', 'quitted', 'quiting', 'quits'],
        correctAnswer: 'quit',
        explanationHe: 'תשובה נכונה: quit. Wh- + did + base verb.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'How did they _______ (know) about the surprise?',
        correctAnswer: 'know',
        explanationHe: 'תשובה נכונה: know. Wh- + did + base verb (לא knew!).',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'What did he _______ you?',
        options: ['tell', 'told', 'telling', 'tells'],
        correctAnswer: 'tell',
        explanationHe: 'תשובה נכונה: tell. Wh- + did + base verb (לא told!).',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: 'Where did she _______ (buy) that dress?',
        correctAnswer: 'buy',
        explanationHe: 'תשובה נכונה: buy. Wh- + did + base verb (לא bought!).',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: 'When did you _______ him?',
        options: ['meet', 'met', 'meeting', 'meets'],
        correctAnswer: 'meet',
        explanationHe: 'תשובה נכונה: meet. Wh- + did + base verb.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: 'How much did it _______ (cost)?',
        correctAnswer: 'cost',
        explanationHe: 'תשובה נכונה: cost. Wh- + did + base verb (cost זהה בהווה ועבר).',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: 'Why did they _______ so long?',
        options: ['wait', 'waited', 'waiting', 'waits'],
        correctAnswer: 'wait',
        explanationHe: 'תשובה נכונה: wait. Wh- + did + base verb.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: 'What did she _______ (write) in the letter?',
        correctAnswer: 'write',
        explanationHe: 'תשובה נכונה: write. Wh- + did + base verb (לא wrote!).',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'Who _______ the window? (WHO כנושא - ללא did)',
        options: ['broke', 'did break', 'break', 'broken'],
        correctAnswer: 'broke',
        explanationHe: 'תשובה נכונה: broke. כאשר WHO הוא הנושא, לא משתמשים ב-did! Who broke = מי שבר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: 'Who _______ (call)? (WHO כנושא)',
        correctAnswer: 'called',
        explanationHe: 'תשובה נכונה: called. WHO כנושא = לא משתמשים ב-did, רק צורת עבר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['Who did call?', 'Who called?', 'Who did called?', 'Who calls?'],
        correctAnswer: 'Who called?',
        explanationHe: 'תשובה נכונה: Who called? WHO כנושא לא לוקח did.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: 'How long did you _______ (wait) for them?',
        correctAnswer: 'wait',
        explanationHe: 'תשובה נכונה: wait. Wh- + did + base verb.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 15.7: Common Mistakes ====================
  {
    topicNumber: 15,
    subtopicNumber: '15.7',
    titleEn: 'Common Mistakes',
    titleHe: 'טעויות נפוצות',
    level: 'elementary',
    orderIndex: 7,
    theoryContentHe: `
<h2>טעויות נפוצות ב-Past Simple</h2>

<div class="warning">
  <h3>1. Using past form with did/didn't:</h3>
  <p>❌ I didn't went home. → ✅ I didn't go home.</p>
  <p>❌ Did you saw him? → ✅ Did you see him?</p>
  <p>❌ She didn't played tennis. → ✅ She didn't play tennis.</p>
</div>

<div class="warning">
  <h3>2. Forgetting -ed for regular verbs:</h3>
  <p>❌ I work yesterday. → ✅ I worked yesterday.</p>
  <p>❌ She study last night. → ✅ She studied last night.</p>
</div>

<div class="warning">
  <h3>3. Using wrong irregular verb form:</h3>
  <p>❌ I goed to school. → ✅ I went to school.</p>
  <p>❌ She eated pizza. → ✅ She ate pizza.</p>
  <p>❌ We seed the movie. → ✅ We saw the movie.</p>
</div>

<div class="warning">
  <h3>4. Spelling mistakes with -ed:</h3>
  <p>❌ I stoped working. → ✅ I stopped working. (double p)</p>
  <p>❌ She studyed. → ✅ She studied. (y → i)</p>
</div>

<div class="warning">
  <h3>5. Using present tense for past:</h3>
  <p>❌ Yesterday I go to school. → ✅ Yesterday I went to school.</p>
</div>

<div class="warning">
  <h3>6. Word order in questions:</h3>
  <p>❌ Why you did leave? → ✅ Why did you leave?</p>
  <p>❌ Where did you went? → ✅ Where did you go?</p>
</div>
    `,
    exercises: [
      // Easy - 8 exercises
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['I didn\'t went', 'I didn\'t go', 'I not went', 'I no go'],
        correctAnswer: 'I didn\'t go',
        explanationHe: 'תשובה נכונה: I didn\'t go. didn\'t + base verb (לא went!).',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: I work yesterday. → I _______ yesterday.',
        correctAnswer: 'worked',
        explanationHe: 'תשובה נכונה: worked. צריך -ed בעבר לפעלים רגילים.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['She goed home', 'She go home', 'She went home', 'She going home'],
        correctAnswer: 'She went home',
        explanationHe: 'תשובה נכונה: She went home. go → went (בלתי רגיל). "goed" לא קיים.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: Did you saw him? → Did you _______ him?',
        correctAnswer: 'see',
        explanationHe: 'תשובה נכונה: see. Did + base verb (לא saw!).',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'איזה כתיב נכון?',
        options: ['I stoped', 'I stopped', 'I stopd', 'I stopt'],
        correctAnswer: 'I stopped',
        explanationHe: 'תשובה נכונה: I stopped. stop → stopped (מכפילים את ה-p).',
        difficulty: 'easy'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: She studyed. → She _______.',
        correctAnswer: 'studied',
        explanationHe: 'תשובה נכונה: studied. study → studied (y → i + ed).',
        difficulty: 'easy'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['Yesterday I go', 'Yesterday I went', 'Yesterday I going', 'Yesterday I goed'],
        correctAnswer: 'Yesterday I went',
        explanationHe: 'תשובה נכונה: Yesterday I went. עבר ספציפי = Past Simple.',
        difficulty: 'easy'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: We seed it. → We _______ it.',
        correctAnswer: 'saw',
        explanationHe: 'תשובה נכונה: saw. see → saw (בלתי רגיל). "seed" לא קיים.',
        difficulty: 'easy'
      },

      // Medium - 10 exercises
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['She didn\'t played', 'She didn\'t play', 'She not played', 'She no play'],
        correctAnswer: 'She didn\'t play',
        explanationHe: 'תשובה נכונה: She didn\'t play. didn\'t + base verb.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: He eated pizza. → He _______ pizza.',
        correctAnswer: 'ate',
        explanationHe: 'תשובה נכונה: ate. eat → ate (בלתי רגיל). "eated" לא קיים.',
        difficulty: 'medium'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['I buyed a car', 'I buy a car', 'I bought a car', 'I buying a car'],
        correctAnswer: 'I bought a car',
        explanationHe: 'תשובה נכונה: I bought a car. buy → bought (בלתי רגיל).',
        difficulty: 'medium'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: They planed a trip. → They _______ a trip.',
        correctAnswer: 'planned',
        explanationHe: 'תשובה נכונה: planned. plan → planned (מכפילים את ה-n).',
        difficulty: 'medium'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'תקן: Why you did leave?',
        options: ['Why did you leave?', 'Why you left?', 'Why did you left?', 'Why you did left?'],
        correctAnswer: 'Why did you leave?',
        explanationHe: 'תשובה נכונה: Why did you leave? סדר מילים: Wh- + did + subject + base verb.',
        difficulty: 'medium'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: Where did you went? → Where did you _______?',
        correctAnswer: 'go',
        explanationHe: 'תשובה נכונה: go. Did + base verb (לא went!).',
        difficulty: 'medium'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['I have seen him yesterday', 'I saw him yesterday', 'I see him yesterday', 'I seed him yesterday'],
        correctAnswer: 'I saw him yesterday',
        explanationHe: 'תשובה נכונה: I saw him yesterday. עם זמן עבר ספציפי = Past Simple (לא Present Perfect).',
        difficulty: 'medium'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: She telled me. → She _______ me.',
        correctAnswer: 'told',
        explanationHe: 'תשובה נכונה: told. tell → told (בלתי רגיל). "telled" לא קיים.',
        difficulty: 'medium'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['He didn\'t knew', 'He didn\'t know', 'He not knew', 'He no know'],
        correctAnswer: 'He didn\'t know',
        explanationHe: 'תשובה נכונה: He didn\'t know. didn\'t + base verb (לא knew!).',
        difficulty: 'medium'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: They bringed gifts. → They _______ gifts.',
        correctAnswer: 'brought',
        explanationHe: 'תשובה נכונה: brought. bring → brought (בלתי רגיל). "bringed" לא קיים.',
        difficulty: 'medium'
      },

      // Hard - 12 exercises
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'זהה את הטעות: I didn\'t went to school yesterday.',
        options: ['didn\'t צריך don\'t', 'went צריך go', 'yesterday צריך tomorrow', 'אין טעות'],
        correctAnswer: 'went צריך go',
        explanationHe: 'תשובה נכונה: went צריך go. didn\'t + base verb (לא צורת עבר!).',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: She writed a letter. → She _______ a letter.',
        correctAnswer: 'wrote',
        explanationHe: 'תשובה נכונה: wrote. write → wrote (בלתי רגיל). "writed" לא קיים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['We winned the game', 'We win the game', 'We won the game', 'We winning the game'],
        correctAnswer: 'We won the game',
        explanationHe: 'תשובה נכונה: We won the game. win → won (בלתי רגיל).',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: He breaked it. → He _______ it.',
        correctAnswer: 'broke',
        explanationHe: 'תשובה נכונה: broke. break → broke (בלתי רגיל). "breaked" לא קיים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'multiple_choice',
        questionTextHe: 'זהה את הטעות: Did she saw the movie?',
        options: ['Did צריך Do', 'saw צריך see', 'movie צריך film', 'אין טעות'],
        correctAnswer: 'saw צריך see',
        explanationHe: 'תשובה נכונה: saw צריך see. Did + base verb (לא צורת עבר!).',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: They catched the bus. → They _______ the bus.',
        correctAnswer: 'caught',
        explanationHe: 'תשובה נכונה: caught. catch → caught (בלתי רגיל). "catched" לא קיים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['I feeled sick', 'I feel sick yesterday', 'I felt sick', 'I feeling sick'],
        correctAnswer: 'I felt sick',
        explanationHe: 'תשובה נכונה: I felt sick. feel → felt (בלתי רגיל).',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: She swimmed in the pool. → She _______ in the pool.',
        correctAnswer: 'swam',
        explanationHe: 'תשובה נכונה: swam. swim → swam (בלתי רגיל). "swimmed" לא קיים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 27,
        type: 'multiple_choice',
        questionTextHe: 'זהה את הטעות: I have went there last year.',
        options: ['have צריך had', 'went צריך gone', 'צריך: I went (ללא have)', 'אין טעות'],
        correctAnswer: 'צריך: I went (ללא have)',
        explanationHe: 'תשובה נכונה: צריך I went. עם "last year" (זמן ספציפי) = Past Simple, לא Present Perfect.',
        difficulty: 'hard'
      },
      {
        questionNumber: 28,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: He holded my hand. → He _______ my hand.',
        correctAnswer: 'held',
        explanationHe: 'תשובה נכונה: held. hold → held (בלתי רגיל). "holded" לא קיים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 29,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['She didn\'t understood', 'She didn\'t understand', 'She not understood', 'She no understand'],
        correctAnswer: 'She didn\'t understand',
        explanationHe: 'תשובה נכונה: She didn\'t understand. didn\'t + base verb.',
        difficulty: 'hard'
      },
      {
        questionNumber: 30,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: They fighted. → They _______.',
        correctAnswer: 'fought',
        explanationHe: 'תשובה נכונה: fought. fight → fought (בלתי רגיל). "fighted" לא קיים.',
        difficulty: 'hard'
      }
    ]
  }
];

// Seed function for Topic 11
async function seedTopic11() {
  const { pool } = require('../../config/database');
  const Lesson = require('../../models/Lesson');
  const Exercise = require('../../models/Exercise');

  console.log('🌱 Seeding Topic 15: Past Simple Tense...\n');

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
    console.log('\n✅ Topic 15: Past Simple Tense seeded successfully!');
    console.log(`   Total: ${lessonsData.length} lessons created`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding Topic 11:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run if called directly
if (require.main === module) {
  seedTopic11()
    .then(() => {
      console.log('Seeding complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedTopic11, lessonsData };
