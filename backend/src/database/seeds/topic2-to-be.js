const { pool } = require('../../config/database');
const Lesson = require('../../models/Lesson');
const Exercise = require('../../models/Exercise');

// Topic 2: Verb "To Be" - Present (פועל להיות - הווה)
const lessonsData = [
  // ==================== SUBTOPIC 2.1: Forms ====================
  {
    topicNumber: 2,
    subtopicNumber: '2.1',
    titleEn: 'Forms: am, is, are',
    titleHe: 'הצורות הבסיסיות',
    level: 'beginner',
    orderIndex: 1,
    theoryContentHe: `
<h2>פועל "To Be" - הצורות הבסיסיות</h2>

<p>הפועל "to be" (להיות) הוא הפועל החשוב ביותר באנגלית. יש לו שלוש צורות בהווה:</p>

<div class="rules">
  <h3>הצורות:</h3>
  <ul>
    <li><strong>I am</strong> (אני)</li>
    <li><strong>You are</strong> (אתה/את/אתם/אתן)</li>
    <li><strong>He is</strong> (הוא)</li>
    <li><strong>She is</strong> (היא)</li>
    <li><strong>It is</strong> (זה/זאת - לדברים וחיות)</li>
    <li><strong>We are</strong> (אנחנו)</li>
    <li><strong>They are</strong> (הם/הן)</li>
  </ul>
</div>

<div class="examples">
  <p><strong>דוגמאות:</strong></p>
  <p>I <strong>am</strong> a student. - אני תלמיד</p>
  <p>You <strong>are</strong> my friend. - אתה החבר שלי</p>
  <p>He <strong>is</strong> tall. - הוא גבוה</p>
  <p>She <strong>is</strong> happy. - היא שמחה</p>
  <p>It <strong>is</strong> a cat. - זה חתול</p>
  <p>We <strong>are</strong> here. - אנחנו כאן</p>
  <p>They <strong>are</strong> teachers. - הם מורים</p>
</div>

<div class="warning">
  <strong>זכור:</strong> I עם am, He/She/It עם is, You/We/They עם are
</div>
    `,
    exercises: [
      // Advanced level - 20 exercises
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'The team _______ ready for the match.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: team הוא שם עצם קיבוצי ולוקח פועל יחיד בבריטית (is) ורבים באמריקאית (are). שים לב: באנגלית בריטית מתייחסים לקבוצה כיחידה אחת. טעות נפוצה: לחשוב שכל שם עצם רבים דורש are.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'Everyone _______ (be) here now.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: everyone, everybody הם יחיד ולוקחים is (לא are). שים לב: למרות שמתכוונים לאנשים רבים, המילה עצמה יחיד. זוהי טעות נפוצה מאוד. טעות נפוצה: לומר "everyone are" כי נדמה שמדובר על רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'The news _______ very good today.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: news הוא uncountable ותמיד יחיד למרות שנגמר ב-s. שים לב: news = חדשות, אבל באנגלית זה יחיד. טעות נפוצה: לומר "the news are" כי נראה כמו רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'Mathematics _______ (be) my favorite subject.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: שמות מקצועות המסתיימים ב-s (mathematics, physics, economics) הם יחיד ולוקחים is. שים לב: למרות ה-s בסוף, זה יחיד. טעות נפוצה: לומר "mathematics are" בגלל ה-s.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'The scissors _______ on the table.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: scissors (מספריים) תמיד רבים ולוקח are. שים לב: גם pants, glasses, trousers תמיד רבים. אומרים "a pair of scissors" ליחיד. טעות נפוצה: לומר "the scissors is" כי זה נראה כחפץ אחד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'Ten dollars _______ (be) enough for lunch.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: סכומי כסף ומרחקי זמן נחשבים יחיד. שים לב: "ten dollars" הוא סכום אחד, לא 10 פריטים נפרדים. טעות נפוצה: לומר "ten dollars are" בגלל המספר 10.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'Physics _______ a difficult subject.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: מקצועות לימוד המסתיימים ב-ics (physics, politics, economics) הם יחיד. שים לב: אפילו שנגמר ב-s, זה יחיד. טעות נפוצה: להתבלבל בגלל הסיומת -ics.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'My family _______ (be) very large.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is (או are באמריקאית). כלל: שמות עצם קיבוציים (family, team, class) יכולים לקחת is (בריטית) או are (אמריקאית). שים לב: באנגלית בריטית מעדיפים is. טעות נפוצה: לחשוב שיש רק תשובה אחת נכונה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'There _______ many people in the park.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: בתבנית There is/are, הפועל מתאים למילה שאחריו. שים לב: "many people" = רבים, לכן are. זו טעות נפוצה מאוד. טעות נפוצה: לומר "there is people" כי There תמיד מתחיל את המשפט.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'Each student _______ (be) responsible.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: each, every, either, neither תמיד לוקחים פועל יחיד (is). שים לב: אפילו אם מדברים על תלמידים רבים, each = כל אחד בנפרד. טעות נפוצה: לומר "each student are" כי נדמה שמדובר על רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'The police _______ investigating the crime.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: police תמיד רבים ולוקח are. שים לב: police = שוטרים (רבים), לא משטרה כארגון. לשוטר אחד אומרים "a police officer". טעות נפוצה: לומר "the police is" כי נדמה שזה ארגון אחד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'Two hours _______ (be) a long time to wait.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: מרחקי זמן נחשבים יחידה אחת. שים לב: "two hours" הוא פרק זמן אחד, לא שתי יחידות נפרדות. טעות נפוצה: לומר "two hours are" בגלל המספר 2.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'Neither of them _______ ready.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: neither, either תמיד לוקחים פועל יחיד (is). שים לב: למרות "of them" (רבים), neither עצמה יחיד. טעות נפוצה: לומר "neither are" בגלל "of them".',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'The United States _______ (be) a large country.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: שמות מדינות הם יחיד אפילו אם נראים רבים (United States, Philippines). שים לב: למרות "States" ברבים, זו מדינה אחת. טעות נפוצה: לומר "The United States are" בגלל States.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'My glasses _______ broken.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: glasses (משקפיים) תמיד רבים. שים לב: גם pants, scissors, trousers תמיד רבים. אומרים "a pair of glasses" ליחידה אחת. טעות נפוצה: לומר "my glasses is" כי זה חפץ אחד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'The staff _______ (be) very helpful.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is (או are באמריקאית). כלל: staff הוא שם עצם קיבוצי ויכול לקחת is (בריטית) או are (אמריקאית). שים לב: באנגלית בריטית מעדיפים is כשמדברים על הצוות כיחידה. טעות נפוצה: לחשוב שיש רק תשובה אחת.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'No one _______ here yet.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: no one, nobody, someone, somebody תמיד יחיד. שים לב: אפילו שמתכוונים ל"אף אחד מאנשים רבים", המילה no one יחיד. טעות נפוצה: לומר "no one are".',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'The furniture _______ (be) very expensive.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: furniture הוא uncountable ותמיד יחיד. שים לב: אפילו אם מדובר על פריטי רהיטים רבים, המילה furniture יחיד. טעות נפוצה: לומר "the furniture are" כי נדמה שמדובר על פריטים רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'Bread and butter _______ my favorite breakfast.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: כאשר שני דברים נחשבים יחידה אחת (bread and butter), משתמשים ב-is. שים לב: bread and butter = ארוחה אחת, לא שני פריטים נפרדים. טעות נפוצה: לומר are בגלל and.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'The majority of students _______ (be) present.',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: majority of + שם עצם רבים = פועל רבים. שים לב: "majority of students" = רוב התלמידים (רבים), לכן are. אבל "the majority" לבד לוקח is. טעות נפוצה: לומר "majority is" תמיד.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 2.2: Affirmative ====================
  {
    topicNumber: 2,
    subtopicNumber: '2.2',
    titleEn: 'Affirmative Sentences',
    titleHe: 'משפטים חיוביים',
    level: 'beginner',
    orderIndex: 2,
    theoryContentHe: `
<h2>משפטים חיוביים עם "To Be"</h2>

<p><strong>מבנה:</strong> Subject + am/is/are + complement</p>

<div class="examples">
  <h3>דוגמאות:</h3>
  <p>I <strong>am</strong> a student. - אני תלמיד</p>
  <p>You <strong>are</strong> smart. - אתה חכם</p>
  <p>He <strong>is</strong> tall. - הוא גבוה</p>
  <p>She <strong>is</strong> a teacher. - היא מורה</p>
  <p>It <strong>is</strong> cold. - קר</p>
  <p>We <strong>are</strong> friends. - אנחנו חברים</p>
  <p>They <strong>are</strong> at home. - הם בבית</p>
</div>

<div class="rules">
  <h3>שימושים של "To Be":</h3>
  <ul>
    <li><strong>זהות:</strong> I am Tom. She is a doctor.</li>
    <li><strong>תיאור:</strong> He is tall. They are happy.</li>
    <li><strong>מיקום:</strong> We are at school. It is on the table.</li>
    <li><strong>גיל:</strong> I am 10 years old. (אני בן 10)</li>
    <li><strong>לאום:</strong> She is American. (היא אמריקאית)</li>
    <li><strong>רגשות:</strong> I am tired. (אני עייף)</li>
  </ul>
</div>
    `,
    exercises: [
      // Advanced level - 20 exercises
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'My sister and I _______ at the same school.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: כאשר יש שני נושאים מחוברים ב-and, משתמשים בפועל רבים (are). שים לב: "my sister and I" = we (אנחנו), לכן are. טעות נפוצה: לחשוב שצריך is כי sister יחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'The weather _______ (be) beautiful today.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: weather הוא uncountable ותמיד יחיד, לוקח is. שים לב: למרות שמדברים על מזג אוויר כללי, המילה weather יחיד. טעות נפוצה: להתבלבל ולחשוב שזה רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'All the information _______ correct.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: information הוא uncountable ותמיד יחיד למרות "all". שים לב: גם advice, homework, luggage תמיד יחיד. טעות נפוצה: לומר "information are" בגלל "all".',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'Either Tom or Sarah _______ (be) the team captain.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: עם either...or הפועל מתאים למילה הקרובה אליו (Sarah = יחיד). שים לב: אם היה "Either Tom or his friends" היה are. טעות נפוצה: לחשוב שצריך are בגלל שני אנשים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'The library books _______ on the shelf.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: הנושא האמיתי הוא books (רבים), לא library. שים לב: "library" הוא רק תיאור של הספרים. הנושא = books = רבים. טעות נפוצה: לבחור is בגלל library.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'Water _______ (be) essential for life.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: water הוא uncountable ותמיד יחיד. שים לב: נוזלים כמו water, milk, juice תמיד לוקחים is. טעות נפוצה: להתבלבל עם "waters" (מים במובן של ים/אגמים).',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'The number of students _______ increasing.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: "the number of" תמיד לוקח is (המספר = יחיד). שים לב: אבל "a number of students" לוקח are! זו הבדל חשוב מאוד. טעות נפוצה: לומר "the number are" בגלל students.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'My mom and dad _______ (be) at work.',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: שני נושאים מחוברים ב-and = רבים (are). שים לב: "mom and dad" = parents = they = רבים. טעות נפוצה: לחשוב שכל נושא בנפרד יחיד אז is.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'Fifty kilometers _______ a long distance.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: מרחקים נחשבים יחידה אחת כמו זמן וכסף. שים לב: "fifty kilometers" = מרחק אחד, לא 50 פריטים נפרדים. טעות נפוצה: לומר are בגלל המספר 50.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'The children and their teacher _______ (be) in the classroom.',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: מספר נושאים מחוברים ב-and תמיד רבים. שים לב: "children and teacher" = they (יותר מאדם אחד). טעות נפוצה: להתבלבל בגלל teacher יחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'My favorite hobby _______ reading books.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: הנושא הוא hobby (יחיד), לא books. שים לב: "hobby" = it = יחיד, למרות "books" בסוף המשפט. טעות נפוצה: לבחור are בגלל books.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'The children\'s toys _______ (be) everywhere.',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: הנושא הוא toys (רבים), לא children. שים לב: toys = they = רבים. children\'s מתאר רק את הבעלות. טעות נפוצה: להתבלבל עם הגניטיב (\'s).',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'One of my friends _______ a doctor.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: "one of" תמיד לוקח פועל יחיד (is). שים לב: הנושא הוא "one" (אחד), לא "friends". טעות נפוצה: לומר are בגלל friends.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'Everybody in the class _______ (be) ready for the test.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: everybody, everyone תמיד יחיד (is). שים לב: למרות "in the class" (כיתה שלמה), everybody = יחיד. טעות נפוצה: לומר are כי נדמה שמדובר על רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'The group of students _______ very smart.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is (או are באמריקאית). כלל: group הוא שם עצם קיבוצי, באנגלית בריטית is (קבוצה = יחידה אחת). שים לב: באמריקאית מקובל are. טעות נפוצה: לחשוב שיש רק תשובה אחת נכונה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'Tom, as well as his brothers, _______ (be) talented.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: עם "as well as" הפועל מתאים לנושא הראשון (Tom = יחיד). שים לב: "as well as his brothers" הוא תוספת, לא נושא נוסף. טעות נפוצה: לומר are בגלל brothers.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'The class _______ very noisy today.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is (או are באמריקאית). כלל: class הוא שם עצם קיבוצי, באנגלית בריטית is. שים לב: כשמתייחסים לכיתה כיחידה אחת - is. טעות נפוצה: להתבלבל בין בריטית לאמריקאית.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'A lot of people _______ (be) here.',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: "a lot of" + שם עצם רבים = פועל רבים. שים לב: people תמיד רבים ולוקח are. אבל "a lot of water" לוקח is! טעות נפוצה: לחשוב ש"a lot of" תמיד is.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'Neither the teacher nor the students _______ ready.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: עם neither...nor הפועל מתאים למילה הקרובה (students = רבים). שים לב: אם היה "neither the students nor the teacher" היה is. טעות נפוצה: לומר is תמיד עם neither.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'The advice you gave me _______ (be) very helpful.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: advice הוא uncountable ותמיד יחיד. שים לב: למרות "you gave me" (שנראה כרבים), advice יחיד. טעות נפוצה: לומר are כי נדמה שיש יותר מעצה אחת.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 2.3: Contractions ====================
  {
    topicNumber: 2,
    subtopicNumber: '2.3',
    titleEn: 'Contractions',
    titleHe: 'קיצורים',
    level: 'beginner',
    orderIndex: 3,
    theoryContentHe: `
<h2>קיצורים עם "To Be"</h2>

<p>באנגלית מדוברת ובלתי פורמלית משתמשים בקיצורים:</p>

<div class="rules">
  <h3>קיצורים נפוצים:</h3>
  <ul>
    <li>I am → <strong>I'm</strong></li>
    <li>You are → <strong>You're</strong></li>
    <li>He is → <strong>He's</strong></li>
    <li>She is → <strong>She's</strong></li>
    <li>It is → <strong>It's</strong></li>
    <li>We are → <strong>We're</strong></li>
    <li>They are → <strong>They're</strong></li>
  </ul>
</div>

<div class="examples">
  <h3>דוגמאות:</h3>
  <p><strong>I'm</strong> happy. - אני שמח</p>
  <p><strong>You're</strong> late. - אתה מאחר</p>
  <p><strong>He's</strong> my brother. - הוא אחי</p>
  <p><strong>She's</strong> beautiful. - היא יפה</p>
  <p><strong>It's</strong> raining. - יורד גשם</p>
  <p><strong>We're</strong> ready. - אנחנו מוכנים</p>
  <p><strong>They're</strong> students. - הם תלמידים</p>
</div>

<div class="warning">
  <strong>שים לב:</strong> It's = It is (זה קיצור), לא לבלבל עם its (שלו/שלה)
</div>
    `,
    exercises: [
      // Advanced level - 20 exercises
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכתב נכון?',
        options: ["Its a beautiful day", "It's a beautiful day", "Its' a beautiful day", "It is' a beautiful day"],
        correctAnswer: "It's a beautiful day",
        explanationHe: 'תשובה נכונה: It\'s a beautiful day. כלל: It\'s = It is (עם apostrophe לפני ה-s). שים לב: Its (בלי apostrophe) = "שלו/שלה" - זה possessive. טעות נפוצה: לבלבל בין It\'s (קיצור) ל-its (בעלות).',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: '_______ (You are) the best student in class.',
        correctAnswer: "You're",
        explanationHe: 'תשובה נכונה: You\'re. כלל: You\'re = You are (קיצור עם apostrophe). שים לב: Your (בלי apostrophe) = "שלך" - זה possessive לא קיצור! טעות נפוצה: לכתוב Your במקום You\'re.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט שגוי?',
        options: ["They're my friends", "We're going home", "There very nice", "You're welcome"],
        correctAnswer: "There very nice",
        explanationHe: 'תשובה נכונה: There very nice שגוי. כלל: צריך "They\'re very nice" (They are). שים לב: There = שם (במקום), They\'re = They are (הם). Their = שלהם. טעות נפוצה: לבלבל בין There/They\'re/Their.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'Where is Tom? _______ (He is) at home.',
        correctAnswer: "He's",
        explanationHe: 'תשובה נכונה: He\'s. כלל: He\'s יכול להיות He is או He has - הקשר קובע. שים לב: כאן He\'s = He is (בהווה פשוט). טעות נפוצה: לא לדעת שיש שתי אפשרויות ל-He\'s.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'The cat is eating _______ food.',
        options: ["it's", "its", "its'", "it is"],
        correctAnswer: "its",
        explanationHe: 'תשובה נכונה: its. כלל: its (בלי apostrophe) = "שלו/שלה" - possessive. שים לב: It\'s (עם apostrophe) = It is/It has. כאן צריך possessive. טעות נפוצה: לכתוב it\'s במקום its.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: '_______ (We are) not going to school today.',
        correctAnswer: "We're",
        explanationHe: 'תשובה נכונה: We\'re. כלל: We\'re = We are (קיצור). שים לב: ניתן להשתמש בקיצור גם במשפטים שליליים: We\'re not = We aren\'t. טעות נפוצה: לחשוב שאסור לקצר במשפטים שליליים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ["Your a great friend", "You're a great friend", "Youre a great friend", "Your'e a great friend"],
        correctAnswer: "You're a great friend",
        explanationHe: 'תשובה נכונה: You\'re a great friend. כלל: You\'re = You are (apostrophe לפני re). שים לב: Your = שלך (possessive), You\'re = you are (קיצור). טעות נפוצה: לכתוב Your במקום You\'re.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: '_______ (They are) books are on the table.',
        correctAnswer: "Their",
        explanationHe: 'תשובה נכונה: Their. כלל: Their = שלהם (possessive). שים לב: They\'re = They are (קיצור), There = שם (מקום), Their = שלהם. כאן צריך possessive. טעות נפוצה: לכתוב They\'re במקום Their.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: '_______ three people waiting outside.',
        options: ["Their", "They're", "There", "There's"],
        correctAnswer: "There's",
        explanationHe: 'תשובה נכונה: There\'s (There is/There are). כלל: There\'s = There is לשימוש במשפטי קיום. שים לב: "There are" נכון יותר עם people (רבים), אבל There\'s מקובל בדיבור. טעות נפוצה: לבלבל There עם Their/They\'re.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'I think _______ (she is) the best teacher.',
        correctAnswer: "she's",
        explanationHe: 'תשובה נכונה: she\'s. כלל: she\'s יכול להיות she is או she has. שים לב: כאן she\'s = she is. ב"she has a book" זה she\'s גם כן. טעות נפוצה: לא לדעת שיש שתי משמעויות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט שגוי?',
        options: ["I'm not ready", "He's not here", "We'rent going", "They aren't home"],
        correctAnswer: "We'rent going",
        explanationHe: 'תשובה נכונה: We\'rent going שגוי. כלל: אין צורה כזו! הצורות הנכונות: We\'re not או We aren\'t. שים לב: לא מקצרים את ה-not ישירות ל\'re. טעות נפוצה: לנסות ליצור צורות שלא קיימות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'Is this _______ (you) book?',
        correctAnswer: "your",
        explanationHe: 'תשובה נכונה: your. כלל: your = שלך (possessive adjective). שים לב: you\'re = you are (קיצור עם פועל). כאן צריך possessive לפני book. טעות נפוצה: לכתוב you\'re במקום your.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'I can\'t find _______ house.',
        options: ["their", "they're", "there", "theyre"],
        correctAnswer: "their",
        explanationHe: 'תשובה נכונה: their. כלל: their = שלהם (possessive). שים לב: צריך possessive לפני house (הבית שלהם). They\'re = They are, There = שם. טעות נפוצה: לבלבל בין השלושה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: '_______ (Where is) the bathroom?',
        correctAnswer: "Where's",
        explanationHe: 'תשובה נכונה: Where\'s. כלל: ניתן לקצר Wh-words עם is (Where\'s, What\'s, Who\'s). שים לב: Where\'s = Where is. גם What\'s, Who\'s, When\'s אפשריים. טעות נפוצה: לחשוב שאי אפשר לקצר מילות שאלה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: '_______ my teacher. (That is)',
        options: ["Thats", "That's", "Thats'", "That is'"],
        correctAnswer: "That's",
        explanationHe: 'תשובה נכונה: That\'s. כלל: That\'s = That is (apostrophe לפני s). שים לב: גם This\'s קיים אבל פחות נפוץ. That\'s מאוד נפוץ. טעות נפוצה: לשכוח את ה-apostrophe.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: '_______ (Who is) at the door?',
        correctAnswer: "Who's",
        explanationHe: 'תשובה נכונה: Who\'s. כלל: Who\'s = Who is או Who has. שים לב: כאן Who\'s = Who is. Whose (בלי apostrophe) = של מי (possessive). טעות נפוצה: לבלבל Who\'s עם Whose.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ["Its been a long day", "It's been a long day", "Its' been a long day", "It been a long day"],
        correctAnswer: "It's been a long day",
        explanationHe: 'תשובה נכונה: It\'s been a long day. כלל: It\'s = It has (בזמן present perfect). שים לב: It\'s יכול להיות It is או It has - הקשר קובע. טעות נפוצה: לא לדעת ש-It\'s גם = It has.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'I don\'t know _______ (whose/who is) book this is.',
        correctAnswer: "whose",
        explanationHe: 'תשובה נכונה: whose. כלל: whose = של מי (possessive). שים לב: Who\'s = Who is/Who has (עם apostrophe). כאן צריך "של מי" לפני book. טעות נפוצה: לכתוב who\'s במקום whose.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: '_______ going to be late!',
        options: ["We're", "Were", "We'r", "Wer'e"],
        correctAnswer: "We're",
        explanationHe: 'תשובה נכונה: We\'re. כלל: We\'re = We are (apostrophe לפני re). שים לב: Were = היינו (past simple של to be). We\'re = we are (הווה). טעות נפוצה: לבלבל We\'re עם Were.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'The dog is wagging _______ (it) tail.',
        correctAnswer: "its",
        explanationHe: 'תשובה נכונה: its. כלל: its (בלי apostrophe) = שלו/שלה (possessive). שים לב: It\'s = It is/It has. כאן צריך possessive לפני tail (הזנב שלו). טעות נפוצה: לכתוב it\'s במקום its - זו הטעות הנפוצה ביותר!',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 2.4: Negative ====================
  {
    topicNumber: 2,
    subtopicNumber: '2.4',
    titleEn: 'Negative Sentences',
    titleHe: 'משפטים שליליים',
    level: 'beginner',
    orderIndex: 4,
    theoryContentHe: `
<h2>משפטים שליליים עם "To Be"</h2>

<p><strong>מבנה:</strong> Subject + am/is/are + NOT + complement</p>

<div class="rules">
  <h3>צורות מלאות:</h3>
  <ul>
    <li>I <strong>am not</strong> (אני לא)</li>
    <li>You <strong>are not</strong> (אתה לא)</li>
    <li>He <strong>is not</strong> (הוא לא)</li>
    <li>She <strong>is not</strong> (היא לא)</li>
    <li>It <strong>is not</strong> (זה לא)</li>
    <li>We <strong>are not</strong> (אנחנו לא)</li>
    <li>They <strong>are not</strong> (הם לא)</li>
  </ul>

  <h3>קיצורים שליליים:</h3>
  <ul>
    <li>I'm not (רק צורה אחת)</li>
    <li>You <strong>aren't</strong> / You're not</li>
    <li>He <strong>isn't</strong> / He's not</li>
    <li>She <strong>isn't</strong> / She's not</li>
    <li>It <strong>isn't</strong> / It's not</li>
    <li>We <strong>aren't</strong> / We're not</li>
    <li>They <strong>aren't</strong> / They're not</li>
  </ul>
</div>

<div class="examples">
  <h3>דוגמאות:</h3>
  <p>I'm <strong>not</strong> tired. - אני לא עייף</p>
  <p>He <strong>isn't</strong> at home. - הוא לא בבית</p>
  <p>We <strong>aren't</strong> ready. - אנחנו לא מוכנים</p>
  <p>They're <strong>not</strong> students. - הם לא תלמידים</p>
</div>
    `,
    exercises: [
      // Advanced level - 20 exercises
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'The news today _______ good.',
        options: ["am not", "isn't", "aren't", "not is"],
        correctAnswer: "isn't",
        explanationHe: 'תשובה נכונה: isn\'t. כלל: news תמיד יחיד למרות שנגמר ב-s. שים לב: news = חדשות, אבל באנגלית יחיד, לכן isn\'t (לא aren\'t). טעות נפוצה: לומר "news aren\'t" כי נראה רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'Everyone _______ (not be) here yet.',
        correctAnswer: "isn't",
        explanationHe: 'תשובה נכונה: isn\'t. כלל: everyone תמיד יחיד ולוקח isn\'t. שים לב: למרות שמתכוונים לאנשים רבים, everyone = יחיד. טעות נפוצה: לומר "everyone aren\'t".',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'The scissors _______ sharp.',
        options: ["am not", "isn't", "aren't", "not"],
        correctAnswer: "aren't",
        explanationHe: 'תשובה נכונה: aren\'t. כלל: scissors תמיד רבים ולוקח aren\'t. שים לב: גם pants, glasses, trousers תמיד רבים. טעות נפוצה: לומר "scissors isn\'t" כי זה חפץ אחד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'There _______ (not be) any milk in the fridge.',
        correctAnswer: "isn't",
        explanationHe: 'תשובה נכונה: isn\'t. כלל: milk הוא uncountable ולוקח isn\'t. שים לב: במשפטי There is/are, הפועל מתאים למילה שאחריו. milk = יחיד. טעות נפוצה: להתבלבל עם There.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'My family _______ happy with the decision.',
        options: ["am not", "isn't", "aren't", "not is"],
        correctAnswer: "isn't",
        explanationHe: 'תשובה נכונה: isn\'t (או aren\'t באמריקאית). כלל: family הוא שם עצם קיבוצי, באנגלית בריטית isn\'t. שים לב: באמריקאית מקובל aren\'t. טעות נפוצה: לחשוב שיש רק תשובה אחת.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'Neither of them _______ (not be) right.',
        correctAnswer: "isn't",
        explanationHe: 'תשובה נכונה: isn\'t (או: is). כלל: neither תמיד יחיד. שים לב: "Neither of them" = אף אחד מהם (יחיד), למרות "them". זו טעות נפוצה מאוד! טעות נפוצה: לומר "neither aren\'t".',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'The police _______ involved in this case.',
        options: ["am not", "isn't", "aren't", "not"],
        correctAnswer: "aren't",
        explanationHe: 'תשובה נכונה: aren\'t. כלל: police תמיד רבים ולוקח aren\'t. שים לב: police = שוטרים (רבים), לא ארגון יחיד. טעות נפוצה: לומר "police isn\'t".',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'The furniture _______ (not be) expensive.',
        correctAnswer: "isn't",
        explanationHe: 'תשובה נכונה: isn\'t. כלל: furniture הוא uncountable ותמיד יחיד. שים לב: למרות שיכול להיות הרבה פריטי רהיטים, furniture יחיד. טעות נפוצה: לומר "furniture aren\'t".',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ["I amn't ready", "I'm not ready", "I not am ready", "I aren't ready"],
        correctAnswer: "I'm not ready",
        explanationHe: 'תשובה נכונה: I\'m not ready. כלל: עם I אין קיצור לשלילה, רק I\'m not (לא "amn\'t"). שים לב: I am not = I\'m not (זו הדרך היחידה). טעות נפוצה: לנסות "I amn\'t" שלא קיים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'Mathematics _______ (not be) my favorite subject.',
        correctAnswer: "isn't",
        explanationHe: 'תשובה נכונה: isn\'t. כלל: mathematics הוא יחיד למרות ה-s. שים לב: מקצועות כמו physics, economics, mathematics תמיד יחיד. טעות נפוצה: לומר aren\'t בגלל ה-s.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'You and I _______ friends anymore.',
        options: ["am not", "isn't", "aren't", "not"],
        correctAnswer: "aren't",
        explanationHe: 'תשובה נכונה: aren\'t. כלל: שני נושאים מחוברים ב-and = רבים. שים לב: "you and I" = we (אנחנו) = רבים = aren\'t. טעות נפוצה: לחשוב על I ולומר am not.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'Either the teacher or the students _______ (not be) correct.',
        correctAnswer: "aren't",
        explanationHe: 'תשובה נכונה: aren\'t. כלל: עם either...or הפועל מתאים למילה הקרובה (students = רבים). שים לב: אם היה "either the students or the teacher" היה isn\'t. טעות נפוצה: לומר isn\'t תמיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'My glasses _______ clean.',
        options: ["am not", "isn't", "aren't", "not"],
        correctAnswer: "aren't",
        explanationHe: 'תשובה נכונה: aren\'t. כלל: glasses תמיד רבים. שים לב: משקפיים נחשבים רבים כי יש שתי עדשות. גם pants, scissors כך. טעות נפוצה: לומר isn\'t כי זה חפץ אחד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'The team _______ (not be) playing well today.',
        correctAnswer: "isn't",
        explanationHe: 'תשובה נכונה: isn\'t (או aren\'t באמריקאית). כלל: team הוא שם עצם קיבוצי, באנגלית בריטית isn\'t. שים לב: כשמתייחסים לקבוצה כיחידה - isn\'t. טעות נפוצה: להתבלבל בין בריטית לאמריקאית.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'No one _______ listening to me.',
        options: ["am not", "isn't", "aren't", "not"],
        correctAnswer: "isn't",
        explanationHe: 'תשובה נכונה: isn\'t (או: is). כלל: no one תמיד יחיד ולוקח isn\'t. שים לב: no one = אף אחד (יחיד), למרות שמתכוונים לאנשים רבים. טעות נפוצה: לומר "no one aren\'t".',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'The children _______ (not be) at school today.',
        correctAnswer: "aren't",
        explanationHe: 'תשובה נכונה: aren\'t. כלל: children הוא צורת רבים של child. שים לב: children = they = רבים = aren\'t. זו צורת רבים לא סדירה. טעות נפוצה: לחשוב שצריך isn\'t.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'The information you gave me _______ helpful.',
        options: ["am not", "isn't", "aren't", "not"],
        correctAnswer: "isn't",
        explanationHe: 'תשובה נכונה: isn\'t. כלל: information הוא uncountable ותמיד יחיד. שים לב: למרות "you gave me", information יחיד. גם advice, homework כך. טעות נפוצה: לומר aren\'t.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'Ten dollars _______ (not be) enough for this.',
        correctAnswer: "isn't",
        explanationHe: 'תשובה נכונה: isn\'t. כלל: סכומי כסף נחשבים יחידה אחת. שים לב: "ten dollars" = סכום אחד, לא 10 פריטים נפרדים. טעות נפוצה: לומר "ten dollars aren\'t" בגלל 10.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט שגוי?',
        options: ["I'm not tired", "He isn't here", "They not are ready", "We aren't going"],
        correctAnswer: "They not are ready",
        explanationHe: 'תשובה נכונה: They not are ready שגוי. כלל: הסדר הנכון: They are not או They aren\'t. שים לב: not תמיד אחרי הפועל be, לא לפניו! טעות נפוצה: לשים not במקום הלא נכון.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'A number of students _______ (not be) present.',
        correctAnswer: "aren't",
        explanationHe: 'תשובה נכונה: aren\'t. כלל: "a number of" + רבים = פועל רבים. שים לב: "a number of students" = מספר תלמידים (רבים). אבל "the number is"! טעות נפוצה: לבלבל a number of עם the number of.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 2.5: Yes/No Questions ====================
  {
    topicNumber: 2,
    subtopicNumber: '2.5',
    titleEn: 'Yes/No Questions',
    titleHe: 'שאלות כן/לא',
    level: 'beginner',
    orderIndex: 5,
    theoryContentHe: `
<h2>שאלות כן/לא עם "To Be"</h2>

<p><strong>מבנה:</strong> Am/Is/Are + subject + complement?</p>

<div class="examples">
  <h3>דוגמאות לשאלות:</h3>
  <p><strong>Am I</strong> late? - אני מאחר?</p>
  <p><strong>Are you</strong> ready? - אתה מוכן?</p>
  <p><strong>Is he</strong> your brother? - הוא אחיך?</p>
  <p><strong>Is she</strong> a teacher? - היא מורה?</p>
  <p><strong>Is it</strong> cold? - קר?</p>
  <p><strong>Are we</strong> friends? - אנחנו חברים?</p>
  <p><strong>Are they</strong> at home? - הם בבית?</p>
</div>

<div class="rules">
  <h3>תשובות קצרות:</h3>
  <ul>
    <li>Yes, I am. / No, I'm not.</li>
    <li>Yes, you are. / No, you aren't.</li>
    <li>Yes, he is. / No, he isn't.</li>
    <li>Yes, she is. / No, she isn't.</li>
    <li>Yes, it is. / No, it isn't.</li>
    <li>Yes, we are. / No, we aren't.</li>
    <li>Yes, they are. / No, they aren't.</li>
  </ul>
</div>

<div class="warning">
  <strong>זכור:</strong> בשאלה הפועל am/is/are מגיע לפני הנושא!
</div>
    `,
    exercises: [
      // Advanced level - 20 exercises
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: '_______ everyone ready for the test?',
        options: ['Am', 'Is', 'Are', 'Be'],
        correctAnswer: 'Is',
        explanationHe: 'תשובה נכונה: Is. כלל: everyone תמיד יחיד ולוקח is. שים לב: למרות שמתכוונים לכל האנשים, everyone = יחיד בשאלה. טעות נפוצה: לומר "Are everyone" כי נדמה רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: '_______ (be) the news good today?',
        correctAnswer: 'Is',
        explanationHe: 'תשובה נכונה: Is. כלל: news תמיד יחיד למרות ה-s. שים לב: news = חדשות, אבל באנגלית יחיד = Is. טעות נפוצה: לומר "Are the news" כי נראה רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: '_______ the scissors on the table?',
        options: ['Am', 'Is', 'Are', 'Be'],
        correctAnswer: 'Are',
        explanationHe: 'תשובה נכונה: Are. כלל: scissors תמיד רבים. שים לב: גם pants, glasses, trousers תמיד רבים בשאלות. טעות נפוצה: לומר "Is scissors" כי זה חפץ אחד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: '_______ (be) your family coming to the party?',
        correctAnswer: 'Is',
        explanationHe: 'תשובה נכונה: Is (או Are באמריקאית). כלל: family הוא שם עצם קיבוצי, בבריטית is. שים לב: באנגלית בריטית מעדיפים is, באמריקאית are. טעות נפוצה: לחשוב שיש רק תשובה אחת.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: '_______ there any milk in the fridge?',
        options: ['Am', 'Is', 'Are', 'Be'],
        correctAnswer: 'Is',
        explanationHe: 'תשובה נכונה: Is. כלל: במשפטי There is/are, הפועל מתאים למילה שאחריו. שים לב: milk = uncountable = יחיד = Is. טעות נפוצה: להתבלבל עם There.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: '_______ (be) the police looking for him?',
        correctAnswer: 'Are',
        explanationHe: 'תשובה נכונה: Are. כלל: police תמיד רבים ולוקח are. שים לב: police = שוטרים (רבים), לא ארגון יחיד. טעות נפוצה: לומר "Is the police".',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: '_______ mathematics difficult for you?',
        options: ['Am', 'Is', 'Are', 'Be'],
        correctAnswer: 'Is',
        explanationHe: 'תשובה נכונה: Is. כלל: mathematics הוא יחיד למרות ה-s. שים לב: מקצועות כמו physics, economics תמיד יחיד. טעות נפוצה: לומר "Are mathematics" בגלל ה-s.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: '_______ (be) Tom and his sister at home?',
        correctAnswer: 'Are',
        explanationHe: 'תשובה נכונה: Are. כלל: שני נושאים מחוברים ב-and = רבים. שים לב: "Tom and his sister" = they (הם) = רבים = Are. טעות נפוצה: לומר Is כי Tom יחיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'איזו תשובה קצרה נכונה ל: "Is she your teacher?" - No, _______',
        options: ['she is', "she isn't", "she not", "isn't she"],
        correctAnswer: "she isn't",
        explanationHe: 'תשובה נכונה: she isn\'t. כלל: תשובה קצרה שלילית: No, subject + isn\'t/aren\'t. שים לב: תמיד חוזרים על הכינוי בתשובה. טעות נפוצה: לומר "No, she not".',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: '_______ (be) either Tom or Sarah coming?',
        correctAnswer: 'Is',
        explanationHe: 'תשובה נכונה: Is. כלל: עם either...or הפועל מתאים למילה הקרובה (Sarah = יחיד). שים לב: אם היה "either Tom or his friends" היה Are. טעות נפוצה: לומר Are בגלל שני אנשים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: '_______ your glasses clean?',
        options: ['Am', 'Is', 'Are', 'Be'],
        correctAnswer: 'Are',
        explanationHe: 'תשובה נכונה: Are. כלל: glasses תמיד רבים. שים לב: משקפיים = שתי עדשות = רבים = Are. גם pants, scissors כך. טעות נפוצה: לומר "Is glasses".',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: '_______ (be) ten dollars enough?',
        correctAnswer: 'Is',
        explanationHe: 'תשובה נכונה: Is. כלל: סכומי כסף נחשבים יחידה אחת. שים לב: "ten dollars" = סכום אחד בשאלה. גם זמן ומרחק כך. טעות נפוצה: לומר "Are ten dollars" בגלל 10.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'איזו תשובה קצרה נכונה ל: "Are they coming?" - Yes, _______',
        options: ['they is', 'they are', 'they be', 'are they'],
        correctAnswer: 'they are',
        explanationHe: 'תשובה נכונה: they are. כלל: תשובה קצרה חיובית: Yes, subject + am/is/are. שים לב: תמיד חוזרים על הכינוי והפועל בתשובה קצרה. טעות נפוצה: לשכוח את הפועל.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: '_______ (be) neither of them correct?',
        correctAnswer: 'Is',
        explanationHe: 'תשובה נכונה: Is. כלל: neither תמיד יחיד ולוקח is. שים לב: "neither of them" = אף אחד מהם (יחיד), למרות "them". טעות נפוצה: לומר "Are neither".',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: '_______ the team playing well?',
        options: ['Am', 'Is', 'Are', 'Be'],
        correctAnswer: 'Is',
        explanationHe: 'תשובה נכונה: Is (או Are באמריקאית). כלל: team הוא שם עצם קיבוצי, בבריטית is. שים לב: כשמתייחסים לקבוצה כיחידה. טעות נפוצה: להתבלבל בין בריטית לאמריקאית.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: '_______ (be) the furniture expensive?',
        correctAnswer: 'Is',
        explanationHe: 'תשובה נכונה: Is. כלל: furniture הוא uncountable ותמיד יחיד. שים לב: למרות שיכול להיות הרבה פריטים, furniture = יחיד בשאלה. טעות נפוצה: לומר "Are furniture".',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'איזו שאלה שגויה?',
        options: ['Is she here?', 'Are you ready?', 'Is they coming?', 'Am I late?'],
        correctAnswer: 'Is they coming?',
        explanationHe: 'תשובה נכונה: Is they coming שגוי. כלל: they תמיד עם Are, לא Is. שים לב: הצורה הנכונה: "Are they coming?" טעות נפוצה: לטעות בהתאמה בין נושא לפועל.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: '_______ (be) there many people at the party?',
        correctAnswer: 'Are',
        explanationHe: 'תשובה נכונה: Are. כלל: במשפטי There is/are, הפועל מתאים למילה שאחריו. שים לב: "many people" = רבים = Are. אבל "Is there any water?" טעות נפוצה: לומר "Is there" תמיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: '_______ no one listening to me?',
        options: ['Am', 'Is', 'Are', 'Be'],
        correctAnswer: 'Is',
        explanationHe: 'תשובה נכונה: Is. כלל: no one תמיד יחיד. שים לב: no one = אף אחד (יחיד) בשאלה, למרות שמתכוונים לאנשים רבים. טעות נפוצה: לומר "Are no one".',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'What\'s the answer to "Are you and Tom friends?" - Yes, _______',
        correctAnswer: 'we are',
        explanationHe: 'תשובה נכונה: we are. כלל: "you and Tom" = we (אנחנו) בתשובה. שים לב: כשמדברים עליך ועל מישהו אחר, התשובה עם we. טעות נפוצה: לענות "Yes, you are" או "Yes, I am".',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 2.6: Wh- Questions ====================
  {
    topicNumber: 2,
    subtopicNumber: '2.6',
    titleEn: 'Wh- Questions',
    titleHe: 'שאלות מידע',
    level: 'beginner',
    orderIndex: 6,
    theoryContentHe: `
<h2>שאלות מידע עם "To Be"</h2>

<p><strong>מבנה:</strong> Wh- word + am/is/are + subject?</p>

<div class="examples">
  <h3>שאלות נפוצות:</h3>
  <p><strong>Who is</strong> he? - מי הוא?</p>
  <p style="margin-right: 20px;">→ He is my friend. (הוא החבר שלי)</p>

  <p><strong>What is</strong> your name? - מה שמך?</p>
  <p style="margin-right: 20px;">→ My name is Tom. (שמי טום)</p>

  <p><strong>Where are</strong> you from? - מאיפה אתה?</p>
  <p style="margin-right: 20px;">→ I'm from Israel. (אני מישראל)</p>

  <p><strong>When is</strong> the party? - מתי המסיבה?</p>
  <p style="margin-right: 20px;">→ It's on Friday. (ביום שישי)</p>

  <p><strong>Why are</strong> you sad? - למה אתה עצוב?</p>
  <p style="margin-right: 20px;">→ I'm sad because... (אני עצוב כי...)</p>

  <p><strong>How old are</strong> you? - בן כמה אתה?</p>
  <p style="margin-right: 20px;">→ I'm 10 years old. (אני בן 10)</p>

  <p><strong>How are</strong> you? - מה שלומך?</p>
  <p style="margin-right: 20px;">→ I'm fine, thank you. (אני בסדר, תודה)</p>
</div>

<div class="rules">
  <h3>מילות שאלה נפוצות:</h3>
  <ul>
    <li><strong>Who</strong> - מי</li>
    <li><strong>What</strong> - מה</li>
    <li><strong>Where</strong> - איפה</li>
    <li><strong>When</strong> - מתי</li>
    <li><strong>Why</strong> - למה</li>
    <li><strong>How</strong> - איך</li>
  </ul>
</div>
    `,
    exercises: [
      // Advanced level - 20 exercises
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: '_______ is the capital of France?',
        options: ['Who', 'What', 'Where', 'Why'],
        correctAnswer: 'What',
        explanationHe: 'תשובה נכונה: What. כלל: What = מה (לדברים ומקומות). שים לב: שואלים על מקום ספציפי (שם), לא "איפה נמצא". Where = איפה מקום נמצא. טעות נפוצה: לבלבל What עם Where.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: '_______ (whose/who is) book is this?',
        correctAnswer: 'Whose',
        explanationHe: 'תשובה נכונה: Whose. כלל: Whose = של מי (בעלות). שים לב: Who\'s = Who is (עם apostrophe). כאן שואלים "של מי הספר". טעות נפוצה: לכתוב Who\'s במקום Whose.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: '_______ tall are you?',
        options: ['What', 'Where', 'How', 'Who'],
        correctAnswer: 'How',
        explanationHe: 'תשובה נכונה: How. כלל: How + תואר = שואלים על מידה (How tall, How old, How big). שים לב: How tall = כמה גבוה, How old = בן כמה. טעות נפוצה: לומר What tall.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: '_______ (what/which) color do you prefer - red or blue?',
        correctAnswer: 'Which',
        explanationHe: 'תשובה נכונה: Which. כלל: Which = איזה (בחירה מתוך אפשרויות מוגדרות). שים לב: כשיש בחירה בין אפשרויות - Which. What = מה (פתוח). טעות נפוצה: לא לדעת ההבדל בין What ו-Which.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: '_______ is your phone number?',
        options: ['How', 'What', 'Where', 'Which'],
        correctAnswer: 'What',
        explanationHe: 'תשובה נכונה: What. כלל: What = מה (למספרים, שמות, דברים). שים לב: שואלים על מספר טלפון = What, לא How. טעות נפוצה: לומר How is your number.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: '_______ (who/what) is your favorite singer?',
        correctAnswer: 'Who',
        explanationHe: 'תשובה נכונה: Who. כלל: Who = מי (לאנשים). שים לב: favorite singer = זמר/זמרת (אדם), לכן Who. אם היה "favorite song" - What. טעות נפוצה: לומר What על אנשים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: '_______ is he so angry?',
        options: ['What', 'Where', 'How', 'Why'],
        correctAnswer: 'Why',
        explanationHe: 'תשובה נכונה: Why. כלל: Why = למה (לסיבה). שים לב: שואלים על הסיבה לכעס. How = איך (אופן), Why = למה (סיבה). טעות נפוצה: לבלבל Why עם How.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: '_______ (where/when) is the meeting - at 3pm or 4pm?',
        correctAnswer: 'When',
        explanationHe: 'תשובה נכונה: When. כלל: When = מתי (זמן). שים לב: השאלה על זמן (3pm or 4pm), לכן When. Where = איפה (מקום). טעות נפוצה: לבלבל When עם Where.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'איזו שאלה נכונה?',
        options: ['What your name is?', 'What is your name?', 'What your name?', 'What name is your?'],
        correctAnswer: 'What is your name?',
        explanationHe: 'תשובה נכונה: What is your name? כלל: Wh-word + is + subject + complement. שים לב: הסדר: מילת שאלה + פועל + נושא. טעות נפוצה: לשכוח את הפועל או לשים אותו לא במקום.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: '_______ (how far/how long) is it from here to school?',
        correctAnswer: 'How far',
        explanationHe: 'תשובה נכונה: How far. כלל: How far = כמה רחוק (מרחק). שים לב: How long = כמה זמן (משך), How far = כמה רחוק (מרחק). טעות נפוצה: לבלבל How far עם How long.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: '_______ much is this?',
        options: ['What', 'Where', 'How', 'Who'],
        correctAnswer: 'How',
        explanationHe: 'תשובה נכונה: How. כלל: How much = כמה (מחיר/כמות). שים לב: How much = כמה עולה/כמה יש. How many = כמה (מספר פריטים). טעות נפוצה: לומר What much.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: '_______ (whose/who is) are these keys?',
        correctAnswer: 'Whose',
        explanationHe: 'תשובה נכונה: Whose. כלל: Whose = של מי (בעלות על דבר). שים לב: Whose keys = המפתחות של מי. Who\'s = Who is (קיצור). טעות נפוצה: לבלבל Whose עם Who\'s.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: '_______ is better - this one or that one?',
        options: ['What', 'Where', 'Which', 'Who'],
        correctAnswer: 'Which',
        explanationHe: 'תשובה נכונה: Which. כלל: Which = איזה (בחירה בין אפשרויות מוגדרות). שים לב: כשיש "or" (או), זו בחירה - Which. What = שאלה פתוחה. טעות נפוצה: לומר What במקום Which.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: '_______ (how many/how much) students are in your class?',
        correctAnswer: 'How many',
        explanationHe: 'תשובה נכונה: How many. כלל: How many = כמה (לספירה - countable). שים לב: students = countable = How many. How much = uncountable (כסף, מים). טעות נפוצה: לבלבל How many עם How much.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: '_______ is the weather like today?',
        options: ['What', 'How', 'Where', 'Which'],
        correctAnswer: 'What',
        explanationHe: 'תשובה נכונה: What. כלל: "What is...like?" = איך/מה (לתיאור). שים לב: What is the weather like = איך מזג האוויר. זו ביטוי קבוע! טעות נפוצה: לומר How is the weather like.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: '_______ (what time/what hour) is it?',
        correctAnswer: 'What time',
        explanationHe: 'תשובה נכונה: What time. כלל: What time = מה השעה. שים לב: לא אומרים "What hour" באנגלית. What time = ביטוי קבוע לשעה. טעות נפוצה: לומר What hour כמו בעברית.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'איזו שאלה שגויה?',
        options: ['How are you?', 'Where is he?', 'Why you are late?', 'When is the party?'],
        correctAnswer: 'Why you are late?',
        explanationHe: 'תשובה נכונה: Why you are late שגוי. כלל: הסדר הנכון: Why are you late? שים לב: Wh-word + פועל + נושא. לא Wh-word + נושא + פועל! טעות נפוצה: סדר מילים לא נכון.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: '_______ (how often/how many times) do you exercise?',
        correctAnswer: 'How often',
        explanationHe: 'תשובה נכונה: How often. כלל: How often = כמה פעמים (תדירות). שים לב: How often = תדירות כללית. How many times = מספר פעמים ספציפי. טעות נפוצה: לא לדעת ההבדל.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: '_______ is the problem?',
        options: ['Who', 'What', 'How', 'Which'],
        correctAnswer: 'What',
        explanationHe: 'תשובה נכונה: What. כלל: What = מה (לדברים/בעיות/נושאים). שים לב: problem = דבר (לא אדם), לכן What. Who = מי (לאנשים). טעות נפוצה: להתבלבל בין What ו-Who.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: '_______ (how come/why) are you late? (בשני אופנים)',
        correctAnswer: 'Why',
        explanationHe: 'תשובה נכונה: Why (או How come). כלל: Why = למה (פורמלי), How come = איך זה (לא פורמלי). שים לב: How come לא דורש היפוך: "How come you are late?" טעות נפוצה: לא לדעת את ההבדל בסדר המילים.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 2.7: Common Mistakes ====================
  {
    topicNumber: 2,
    subtopicNumber: '2.7',
    titleEn: 'Common Mistakes',
    titleHe: 'טעויות נפוצות',
    level: 'beginner',
    orderIndex: 7,
    theoryContentHe: `
<h2>טעויות נפוצות עם "To Be"</h2>

<div class="examples">
  <h3>שימוש בצורה הלא נכונה:</h3>
  <p>❌ <strong>שגוי:</strong> I <strong>is</strong> a student.<br>
  ✅ <strong>נכון:</strong> I <strong>am</strong> a student.</p>
  <p>❌ <strong>שגוי:</strong> He <strong>am</strong> tall.<br>
  ✅ <strong>נכון:</strong> He <strong>is</strong> tall.</p>
  <p>❌ <strong>שגוי:</strong> They <strong>is</strong> at home.<br>
  ✅ <strong>נכון:</strong> They <strong>are</strong> at home.</p>
  <p>❌ <strong>שגוי:</strong> You <strong>is</strong> my friend.<br>
  ✅ <strong>נכון:</strong> You <strong>are</strong> my friend.</p>

  <h3>שכחת להוסיף am/is/are:</h3>
  <p>❌ <strong>שגוי:</strong> I <strong>not</strong> tired.<br>
  ✅ <strong>נכון:</strong> I<strong>'m not</strong> tired.</p>
  <p>❌ <strong>שגוי:</strong> He <strong>not</strong> happy.<br>
  ✅ <strong>נכון:</strong> He <strong>isn't</strong> happy.</p>

  <h3>סדר מילים לא נכון בשאלות:</h3>
  <p>❌ <strong>שגוי:</strong> <strong>Is you</strong> ready?<br>
  ✅ <strong>נכון:</strong> <strong>Are you</strong> ready?</p>
  <p>❌ <strong>שגוי:</strong> <strong>Where you are</strong>?<br>
  ✅ <strong>נכון:</strong> <strong>Where are you</strong>?</p>

  <h3>בלבול עם פעלים אחרים:</h3>
  <p>❌ <strong>שגוי:</strong> She <strong>is have</strong> a car.<br>
  ✅ <strong>נכון:</strong> She <strong>has</strong> a car.</p>
  <p>❌ <strong>שגוי:</strong> I'm <strong>have</strong> 10 years.<br>
  ✅ <strong>נכון:</strong> I<strong>'m</strong> 10 years old.</p>
</div>

<div class="warning">
  <strong>זכור תמיד:</strong>
  <ul>
    <li>I am / You are / He-She-It is / We-They are</li>
    <li>בשאלות: am/is/are מגיע לפני הנושא</li>
    <li>don't confuse "to be" with other verbs like "have"</li>
  </ul>
</div>
    `,
    exercises: [
      // Advanced level - 20 exercises
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט שגוי?',
        options: ['I am 10 years old', 'She is happy', 'They is from London', 'We are students'],
        correctAnswer: 'They is from London',
        explanationHe: 'תשובה נכונה: They is from London שגוי. כלל: They תמיד עם are, לא is. שים לב: הצורה הנכונה: "They are from London". טעות נפוצה: לטעות בהתאמה בין נושא לפועל.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'תקן את המשפט: He is have a dog. → He _______ a dog.',
        correctAnswer: 'has',
        explanationHe: 'תשובה נכונה: has. כלל: לא משלבים "is" עם "have" - זה טעות! שים לב: He has = יש לו. He is = הוא. אלה שני פעלים נפרדים! טעות נפוצה: לומר "is have" - זו הטעות הכי נפוצה!',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'איזו שאלה שגויה?',
        options: ['Where are you?', 'You are where?', 'Are you ready?', 'Is she here?'],
        correctAnswer: 'You are where?',
        explanationHe: 'תשובה נכונה: You are where? שגוי. כלל: בשאלות עם Wh-, הפועל לפני הנושא. שים לב: הסדר הנכון: "Where are you?" טעות נפוצה: סדר מילים של משפט רגיל בשאלה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: I have 10 years. → I _______ 10 years old.',
        correctAnswer: 'am',
        explanationHe: 'תשובה נכונה: am. כלל: לגיל באנגלית משתמשים ב-"to be", לא "have". שים לב: I am 10 years old (לא I have 10 years). טעות נפוצה: להשתמש ב-have כמו בעברית "יש לי".',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט שגוי?',
        options: ["I'm not tired", "She isn't here", "They not are ready", "He isn't happy"],
        correctAnswer: 'They not are ready',
        explanationHe: 'תשובה נכונה: They not are ready שגוי. כלל: not תמיד אחרי הפועל be. שים לב: הסדר הנכון: They are not / They aren\'t. טעות נפוצה: לשים not לפני הפועל.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: Where you are? → _______ are you?',
        correctAnswer: 'Where',
        explanationHe: 'תשובה נכונה: Where. כלל: בשאלות: Wh-word + am/is/are + subject. שים לב: הפועל חייב להיות לפני הנושא בשאלה! טעות נפוצה: לשמור על סדר של משפט רגיל.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['Your my friend', "You're my friend", 'Youre my friend', 'You my friend'],
        correctAnswer: "You're my friend",
        explanationHe: 'תשובה נכונה: You\'re my friend. כלל: צריך פועל במשפט! You\'re = You are. שים לב: Your = שלך (possessive). You\'re = you are (פועל). טעות נפוצה: לבלבל Your עם You\'re.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: Its a nice day. → _______ a nice day.',
        correctAnswer: "It's",
        explanationHe: 'תשובה נכונה: It\'s. כלל: It\'s = It is (עם apostrophe). שים לב: Its (בלי apostrophe) = שלו/שלה (possessive). כאן צריך "It is". טעות נפוצה: לכתוב Its במקום It\'s - זו הטעות הנפוצה ביותר!',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט שגוי?',
        options: ['She is a doctor', 'They are happy', 'He am tired', 'We are friends'],
        correctAnswer: 'He am tired',
        explanationHe: 'תשובה נכונה: He am tired שגוי. כלל: He/She/It תמיד עם is, לא am. שים לב: רק I עם am! He is tired = הצורה הנכונה. טעות נפוצה: לבלבל am, is, are.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: I amn\'t ready. → I _______ ready.',
        correctAnswer: "am not",
        explanationHe: 'תשובה נכונה: am not (או I\'m not). כלל: אין צורה "amn\'t" באנגלית! שים לב: I am not / I\'m not הן הצורות היחידות. isn\'t, aren\'t קיימים, אבל לא amn\'t. טעות נפוצה: לנסות ליצור amn\'t.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'איזו שאלה נכונה?',
        options: ['Is you a student?', 'Are you a student?', 'Am you a student?', 'Be you a student?'],
        correctAnswer: 'Are you a student?',
        explanationHe: 'תשובה נכונה: Are you a student? כלל: You תמיד עם are, גם בשאלות. שים לב: לא משנה אם יחיד או רבים, You = are תמיד! טעות נפוצה: לומר "Is you" או "Am you".',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: There is many people. → There _______ many people.',
        correctAnswer: 'are',
        explanationHe: 'תשובה נכונה: are. כלל: במשפטי There is/are, הפועל מתאים למילה שאחריו. שים לב: people = רבים, לכן "There are people". טעות נפוצה: לומר "There is" תמיד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט שגוי?',
        options: ["He's a teacher", "She's happy", "It's cold", "They's late"],
        correctAnswer: "They's late",
        explanationHe: 'תשובה נכונה: They\'s late שגוי. כלל: אין צורה "They\'s" - זה לא קיים! שים לב: They\'re = They are (הצורה הנכונה). He\'s, She\'s, It\'s קיימים, אבל לא They\'s. טעות נפוצה: לנסות לקצר כל פועל.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: She is have a beautiful house. → She _______ a beautiful house.',
        correctAnswer: 'has',
        explanationHe: 'תשובה נכונה: has. כלל: אי אפשר לשלב "is" עם "have" - זו טעות חמורה! שים לב: She has = יש לה. She is = היא. טעות נפוצה: להוסיף "is" לפני פעלים אחרים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['Their happy', "They're happy", 'There happy', 'Theyre happy'],
        correctAnswer: "They're happy",
        explanationHe: 'תשובה נכונה: They\'re happy. כלל: צריך פועל! They\'re = They are. שים לב: Their = שלהם, There = שם, They\'re = they are. טעות נפוצה: לבלבל בין השלושה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: We\'re not going. Is this correct? → _______',
        correctAnswer: 'Yes',
        explanationHe: 'תשובה נכונה: Yes (המשפט נכון). כלל: ניתן לקצר גם במשפטים שליליים. שים לב: We\'re not = We are not = נכון לגמרי! או We aren\'t. טעות נפוצה: לחשוב שאסור לקצר במשפטים שליליים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'איזו שאלה שגויה?',
        options: ['What is your name?', 'How old are you?', 'Why you are sad?', 'Where is he?'],
        correctAnswer: 'Why you are sad?',
        explanationHe: 'תשובה נכונה: Why you are sad? שגוי. כלל: בשאלות, הפועל לפני הנושא! שים לב: הסדר הנכון: "Why are you sad?" טעות נפוצה: סדר מילים לא נכון בשאלות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: Everyone are ready. → Everyone _______ ready.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: everyone תמיד יחיד ולוקח is. שים לב: למרות שמתכוונים לאנשים רבים, everyone = יחיד. גם everybody, no one כך. טעות נפוצה: לומר "everyone are".',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['The dog is wagging its tail', "The dog is wagging it's tail", 'The dog is wagging its\' tail', 'The dog is wagging it tail'],
        correctAnswer: 'The dog is wagging its tail',
        explanationHe: 'תשובה נכונה: its tail (בלי apostrophe). כלל: its = שלו/שלה (possessive). שים לב: It\'s = It is/It has (עם apostrophe). כאן צריך possessive. טעות נפוצה: לכתוב it\'s במקום its.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: The news are good. → The news _______ good.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: news תמיד יחיד למרות ה-s בסוף. שים לב: news = חדשות, אבל באנגלית זה יחיד. גם mathematics, physics כך. טעות נפוצה: לומר "news are" כי נראה רבים.',
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
    console.log('Starting to seed Topic 2: Verb To Be...');

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
    console.log('✅ Topic 2: Verb To Be seeded successfully!');
    console.log(`   Total: ${lessonsData.length} lessons created`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding Topic 6:', error);
    throw error;
  } finally {
    client.release();
  }
}

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
