const { pool } = require('../../config/database');
const Lesson = require('../../models/Lesson');
const Exercise = require('../../models/Exercise');

// Topic 5: Articles (מאמרים - a, an, the)
const lessonsData = [
  // ==================== SUBTOPIC 5.1: Indefinite Articles - A/An ====================
  {
    topicNumber: 5,
    subtopicNumber: '5.1',
    titleEn: 'Indefinite Articles - A/An',
    titleHe: 'מאמר לא מוגדר - A/An',
    level: 'beginner',
    orderIndex: 1,
    theoryContentHe: `
<h2>מאמר לא מוגדר - A / An</h2>

<p>המאמרים a ו-an משמשים לפני שמות עצם יחידים כשמדברים על משהו לא ספציפי או כשמזכירים אותו בפעם הראשונה.</p>

<div class="rules">
  <p><strong>מתי להשתמש ב-A ומתי ב-AN?</strong></p>
  <ul>
    <li><strong>A</strong> - לפני צליל עיצור (consonant sound)</li>
    <li><strong>AN</strong> - לפני צליל תנועה (vowel sound: a, e, i, o, u)</li>
  </ul>
  <p><strong>חשוב:</strong> הכלל מתבסס על הצליל, לא על האות!</p>
</div>

<div class="examples">
  <p><strong>דוגמאות עם A:</strong></p>
  <p><strong>a</strong> book - ספר</p>
  <p><strong>a</strong> car - מכונית</p>
  <p><strong>a</strong> dog - כלב</p>
  <p><strong>a</strong> university - אוניברסיטה (u נשמע כמו "יו" - עיצור!)</p>
  <p><strong>a</strong> European country - מדינה אירופית (Eu נשמע כמו "יו")</p>
</div>

<div class="examples">
  <p><strong>דוגמאות עם AN:</strong></p>
  <p><strong>an</strong> apple - תפוח</p>
  <p><strong>an</strong> egg - ביצה</p>
  <p><strong>an</strong> hour - שעה (h שקטה!)</p>
  <p><strong>an</strong> honest person - אדם ישר (h שקטה!)</p>
  <p><strong>an</strong> MBA - תואר MBA (M נשמע "אם" - תנועה!)</p>
</div>

<div class="warning">
  <strong>שימושים עיקריים של a/an:</strong>
  <ul>
    <li><strong>פעם ראשונה:</strong> I see a dog. (אני רואה כלב - כלב כלשהו)</li>
    <li><strong>מקצוע:</strong> She is a teacher. (היא מורה)</li>
    <li><strong>אחד מני רבים:</strong> Give me a pen. (תן לי עט - עט כלשהו)</li>
    <li><strong>במשמעות "אחד":</strong> I need a minute. (אני צריך דקה אחת)</li>
  </ul>
</div>
    `,
    exercises: [
      // EASY (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'I have _______ apple.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'an',
        explanationHe: 'apple מתחיל בצליל תנועה (a), לכן an apple.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'She is _______ teacher.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'a',
        explanationHe: 'teacher מתחיל בצליל עיצור (t), לכן a teacher. גם: משתמשים ב-a/an עם מקצועות.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'I need _______ pen. (עט כלשהו)',
        correctAnswer: 'a',
        explanationHe: 'pen מתחיל בצליל עיצור (p), לכן a pen.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'There is _______ cat in the garden.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'a',
        explanationHe: 'cat מתחיל בעיצור (c), ומדברים על חתול לא ספציפי בפעם הראשונה.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'He ate _______ orange.',
        correctAnswer: 'an',
        explanationHe: 'orange מתחיל בצליל תנועה (o), לכן an orange.',
        difficulty: 'easy'
      },
      // MEDIUM (6-10)
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'She studies at _______ university.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'a',
        explanationHe: 'university מתחיל בצליל "יו" (עיצור!), לכן a university, למרות שמתחיל באות u.',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'I waited for _______ hour.',
        correctAnswer: 'an',
        explanationHe: 'hour - ה-h שקטה! הצליל הראשון הוא "או" (תנועה), לכן an hour.',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'He is _______ honest man.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'an',
        explanationHe: 'honest - ה-h שקטה! הצליל הראשון הוא "או" (תנועה), לכן an honest.',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'It was _______ European trip.',
        correctAnswer: 'a',
        explanationHe: 'European מתחיל בצליל "יו" (עיצור!), לכן a European.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'I saw _______ UFO in the sky.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'a',
        explanationHe: 'UFO מבוטא "יו-אף-או" - מתחיל בצליל "יו" (עיצור!), לכן a UFO.',
        difficulty: 'medium'
      },
      // HARD (11-20)
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'She has _______ MBA degree.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'an',
        explanationHe: 'MBA מבוטא "אם-בי-אי" - מתחיל בצליל "אם" (תנועה!), לכן an MBA.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'He works as _______ X-ray technician.',
        correctAnswer: 'an',
        explanationHe: 'X-ray מבוטא "אקס-ריי" - מתחיל בצליל "אה" (תנועה!), לכן an X-ray.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'It was _______ one-time offer.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'a',
        explanationHe: 'one מתחיל בצליל "וו" (עיצור!), לכן a one-time, למרות שמתחיל באות o.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'He is _______ heir to the throne.',
        correctAnswer: 'an',
        explanationHe: 'heir - ה-h שקטה! מבוטא "אייר", לכן an heir.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'I bought _______ used car.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'a',
        explanationHe: 'used מתחיל בצליל "יו" (עיצור!), לכן a used car.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'She received _______ honorable mention.',
        correctAnswer: 'an',
        explanationHe: 'honorable - ה-h שקטה! מתחיל בצליל תנועה, לכן an honorable.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'It is _______ unique opportunity.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'a',
        explanationHe: 'unique מתחיל בצליל "יו" (עיצור!), לכן a unique.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'He had _______ 8-hour flight.',
        correctAnswer: 'an',
        explanationHe: '8 = eight מתחיל בצליל "אי" (תנועה!), לכן an 8-hour flight.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'מה הכלל לשימוש ב-a/an?',
        options: ['לפי האות הראשונה', 'לפי הצליל הראשון', 'לפי מספר ההברות', 'אין כלל קבוע'],
        correctAnswer: 'לפי הצליל הראשון',
        explanationHe: 'הכלל הוא לפי הצליל (sound), לא לפי האות (letter). לכן: an hour (h שקטה), a university (u=יו).',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'She is _______ FBI agent.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'an',
        explanationHe: 'FBI מבוטא "אף-בי-איי" - מתחיל בצליל "אה" (תנועה!), לכן an FBI agent.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 5.2: Definite Article - The ====================
  {
    topicNumber: 5,
    subtopicNumber: '5.2',
    titleEn: 'Definite Article - The',
    titleHe: 'מאמר מוגדר - The',
    level: 'beginner',
    orderIndex: 2,
    theoryContentHe: `
<h2>מאמר מוגדר - The</h2>

<p>המאמר "the" משמש כשמדברים על משהו ספציפי, ידוע, או ייחודי.</p>

<div class="rules">
  <p><strong>מתי משתמשים ב-THE?</strong></p>
  <ul>
    <li><strong>דבר ספציפי/ידוע:</strong> The book on the table is mine.</li>
    <li><strong>הזכרה שנייה:</strong> I saw a dog. The dog was brown.</li>
    <li><strong>דבר ייחודי:</strong> the sun, the moon, the earth, the internet</li>
    <li><strong>עם superlatives:</strong> the best, the biggest, the most beautiful</li>
    <li><strong>עם ordinals:</strong> the first, the second, the last</li>
  </ul>
</div>

<div class="examples">
  <p><strong>דוגמאות:</strong></p>
  <p><strong>The</strong> book you gave me was interesting. - הספר שנתת לי היה מעניין (ספר ספציפי)</p>
  <p>I saw a cat. <strong>The</strong> cat was black. - ראיתי חתול. החתול היה שחור (הזכרה שנייה)</p>
  <p><strong>The</strong> sun rises in the east. - השמש זורחת במזרח (יש רק שמש אחת)</p>
  <p>She is <strong>the</strong> best student in class. - היא התלמידה הכי טובה (superlative)</p>
</div>

<div class="warning">
  <strong>שימושים מיוחדים של THE:</strong>
  <ul>
    <li><strong>מקומות ספציפיים:</strong> the park (הפארק הזה), the school (בית הספר הזה)</li>
    <li><strong>כלי נגינה:</strong> play the piano, the guitar</li>
    <li><strong>מדינות עם "של":</strong> the United States, the United Kingdom</li>
    <li><strong>נהרות, אוקיינוסים:</strong> the Nile, the Pacific Ocean</li>
  </ul>
</div>
    `,
    exercises: [
      // EASY (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'I saw a bird. _______ bird was blue.',
        options: ['A', 'An', 'The', '-'],
        correctAnswer: 'The',
        explanationHe: 'בהזכרה שנייה משתמשים ב-the כי אנחנו מדברים על אותו ציפור ספציפית.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: '_______ sun is very hot today.',
        correctAnswer: 'The',
        explanationHe: 'יש רק שמש אחת (ייחודית), לכן the sun.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'She is _______ best singer in the school.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'the',
        explanationHe: 'עם superlatives (best, biggest וכו\') משתמשים תמיד ב-the.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'Please close _______ door.',
        correctAnswer: 'the',
        explanationHe: 'מדובר בדלת ספציפית (הדלת הזו בחדר), לכן the door.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: '_______ moon is beautiful tonight.',
        options: ['A', 'An', 'The', '-'],
        correctAnswer: 'The',
        explanationHe: 'יש רק ירח אחד (ייחודי), לכן the moon.',
        difficulty: 'easy'
      },
      // MEDIUM (6-10)
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'She plays _______ piano very well.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'the',
        explanationHe: 'עם כלי נגינה משתמשים ב-the: play the piano, the guitar, the violin.',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'I live in _______ United States.',
        correctAnswer: 'the',
        explanationHe: 'מדינות עם "של/מאוחד" מקבלות the: the United States, the United Kingdom.',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: '_______ Nile is the longest river in Africa.',
        options: ['A', 'An', 'The', '-'],
        correctAnswer: 'The',
        explanationHe: 'נהרות מקבלים the: the Nile, the Amazon, the Jordan.',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'He was _______ first person to arrive.',
        correctAnswer: 'the',
        explanationHe: 'עם ordinals (first, second, last) משתמשים ב-the.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: '_______ Pacific Ocean is the largest ocean.',
        options: ['A', 'An', 'The', '-'],
        correctAnswer: 'The',
        explanationHe: 'אוקיינוסים מקבלים the: the Pacific, the Atlantic, the Indian Ocean.',
        difficulty: 'medium'
      },
      // HARD (11-20)
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'I went to _______ hospital to visit my friend.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'the',
        explanationHe: 'כשהולכים לבית חולים ספציפי לבקר מישהו, משתמשים ב-the. (השוו: He is in hospital = הוא מאושפז)',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: '_______ rich should help _______ poor.',
        correctAnswer: 'The, the',
        explanationHe: 'the + adjective = קבוצה של אנשים: the rich (העשירים), the poor (העניים).',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'He was elected _______ president of the company.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: '-',
        explanationHe: 'כשמדברים על תפקיד ייחודי אחרי elected/appointed, לא צריך מאמר: elected president.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'I need to go to _______ bank to withdraw money.',
        correctAnswer: 'the',
        explanationHe: 'כשהולכים לבנק ספציפי (הבנק שלי, או בנק קרוב), משתמשים ב-the.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: '_______ Alps are in Europe.',
        options: ['A', 'An', 'The', '-'],
        correctAnswer: 'The',
        explanationHe: 'רכסי הרים מקבלים the: the Alps, the Himalayas, the Rockies.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'She is _______ only child in her family.',
        correctAnswer: 'the',
        explanationHe: 'עם only (יחיד) משתמשים ב-the: the only child, the only solution.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: '_______ Queen Elizabeth II was a famous monarch.',
        options: ['A', 'An', 'The', '-'],
        correctAnswer: '-',
        explanationHe: 'תארים + שמות פרטיים לא מקבלים the: Queen Elizabeth, President Biden, Doctor Smith.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'I read about it on _______ internet.',
        correctAnswer: 'the',
        explanationHe: 'the internet - ייחודי, יש רק אינטרנט אחד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'She is _______ same age as me.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'the',
        explanationHe: 'עם same משתמשים תמיד ב-the: the same age, the same size, the same color.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'מתי משתמשים ב-the עם מדינות?',
        options: ['תמיד', 'אף פעם', 'רק עם מדינות שיש בשמן "של" או "מאוחד"', 'רק עם מדינות גדולות'],
        correctAnswer: 'רק עם מדינות שיש בשמן "של" או "מאוחד"',
        explanationHe: 'the USA, the UK, the Netherlands, the Philippines - אבל: Israel, France, Japan (ללא the).',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 5.3: Zero Article ====================
  {
    topicNumber: 5,
    subtopicNumber: '5.3',
    titleEn: 'Zero Article',
    titleHe: 'ללא מאמר',
    level: 'beginner',
    orderIndex: 3,
    theoryContentHe: `
<h2>ללא מאמר (Zero Article)</h2>

<p>לפעמים לא משתמשים במאמר כלל. חשוב לדעת מתי!</p>

<div class="rules">
  <p><strong>מתי לא משתמשים במאמר?</strong></p>
  <ul>
    <li><strong>רבים כלליים:</strong> Dogs are animals. (כלבים בכלל)</li>
    <li><strong>שמות עצם לא ספירים כלליים:</strong> Water is important. (מים בכלל)</li>
    <li><strong>שמות אנשים:</strong> Tom, Sarah (לא: the Tom)</li>
    <li><strong>רוב המדינות:</strong> Israel, France, Japan</li>
    <li><strong>ערים:</strong> Tel Aviv, London, New York</li>
    <li><strong>ארוחות:</strong> breakfast, lunch, dinner</li>
    <li><strong>ספורט ומקצועות לימוד:</strong> I play basketball. I study math.</li>
    <li><strong>שפות:</strong> English, Hebrew, French</li>
  </ul>
</div>

<div class="examples">
  <p><strong>דוגמאות:</strong></p>
  <p>I like <strong>dogs</strong>. (כלבים בכלל, לא כלבים ספציפיים)</p>
  <p><strong>Water</strong> is essential for life. (מים בכלל)</p>
  <p>I eat <strong>breakfast</strong> at 7 AM. (ארוחת בוקר בכלל)</p>
  <p>She plays <strong>tennis</strong>. (ספורט)</p>
  <p>I study <strong>English</strong>. (שפה/מקצוע)</p>
  <p>I live in <strong>Israel</strong>. (מדינה)</p>
</div>

<div class="warning">
  <strong>השוו:</strong>
  <ul>
    <li>I like <strong>dogs</strong>. (כלבים בכלל) vs. I like <strong>the dogs</strong> next door. (כלבים ספציפיים)</li>
    <li>I eat <strong>breakfast</strong>. (בכלל) vs. <strong>The breakfast</strong> was delicious. (ארוחה ספציפית)</li>
    <li><strong>Life</strong> is beautiful. (חיים בכלל) vs. <strong>The life</strong> of a teacher is hard. (החיים של...)</li>
  </ul>
</div>
    `,
    exercises: [
      // EASY (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'I like _______ dogs. (בכלל)',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: '-',
        explanationHe: 'כשמדברים על רבים בכלל (כלבים באופן כללי), לא משתמשים במאמר.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'I eat _______ breakfast at 7 AM.',
        correctAnswer: '-',
        explanationHe: 'עם ארוחות באופן כללי לא משתמשים במאמר: eat breakfast, have lunch.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'She plays _______ basketball.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: '-',
        explanationHe: 'עם ספורט לא משתמשים במאמר: play basketball, play football, play tennis.',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'I study _______ math at school.',
        correctAnswer: '-',
        explanationHe: 'עם מקצועות לימוד לא משתמשים במאמר: study math, learn English.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'I live in _______ Israel.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: '-',
        explanationHe: 'רוב המדינות לא מקבלות מאמר: Israel, France, Japan (אבל: the USA, the UK).',
        difficulty: 'easy'
      },
      // MEDIUM (6-10)
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: '_______ water is important for life.',
        options: ['A', 'An', 'The', '-'],
        correctAnswer: '-',
        explanationHe: 'כשמדברים על שמות עצם לא ספירים באופן כללי, לא משתמשים במאמר.',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'She speaks _______ English very well.',
        correctAnswer: '-',
        explanationHe: 'עם שפות לא משתמשים במאמר: speak English, learn French.',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'I visited _______ London last year.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: '-',
        explanationHe: 'ערים לא מקבלות מאמר: London, Paris, Tel Aviv.',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: '_______ love is a beautiful feeling.',
        correctAnswer: '-',
        explanationHe: 'רגשות ומושגים מופשטים באופן כללי לא מקבלים מאמר: love, hate, happiness.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'I go to _______ school every day.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: '-',
        explanationHe: 'go to school (ללמוד) - ללא מאמר. אבל: go to the school (לבניין הספציפי).',
        difficulty: 'medium'
      },
      // HARD (11-20)
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'He is in _______ prison for robbery.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: '-',
        explanationHe: 'in prison = כאסיר. אבל: in the prison = בבניין הכלא הספציפי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'I go to _______ bed at 10 PM.',
        correctAnswer: '-',
        explanationHe: 'go to bed = ללכת לישון. אבל: the bed = המיטה הספציפית.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: '_______ Mount Everest is the highest mountain.',
        options: ['A', 'An', 'The', '-'],
        correctAnswer: '-',
        explanationHe: 'הרים בודדים לא מקבלים the: Mount Everest, Mount Fuji. אבל רכסים כן: the Alps.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'I travel by _______ bus to work.',
        correctAnswer: '-',
        explanationHe: 'by + תחבורה ללא מאמר: by bus, by car, by train, by plane.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'She went to _______ church on Sunday.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: '-',
        explanationHe: 'go to church = להתפלל. go to the church = לבניין הכנסייה הספציפי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: '_______ Lake Kinneret is in Israel.',
        correctAnswer: '-',
        explanationHe: 'אגמים עם שם לא מקבלים the: Lake Kinneret, Lake Victoria. אבל: the Dead Sea.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'I am at _______ work right now.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: '-',
        explanationHe: 'at work = בעבודה (פעילות). at the work = לא נכון.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'He is studying _______ medicine at university.',
        correctAnswer: '-',
        explanationHe: 'מקצועות לימוד אקדמיים ללא מאמר: study medicine, study law, study engineering.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'מה ההבדל בין "go to school" ו-"go to the school"?',
        options: ['אין הבדל', 'go to school = ללמוד, go to the school = לבניין', 'go to the school יותר מנומס', 'go to school שגוי'],
        correctAnswer: 'go to school = ללמוד, go to the school = לבניין',
        explanationHe: 'ללא מאמר = המטרה/הפעילות. עם the = המיקום הפיזי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'I had _______ dinner with my family.',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: '-',
        explanationHe: 'have dinner = לאכול ארוחת ערב. אבל: The dinner was delicious = הארוחה הספציפית.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 5.4: Common Mistakes & Practice ====================
  {
    topicNumber: 5,
    subtopicNumber: '5.4',
    titleEn: 'Common Mistakes & Practice',
    titleHe: 'טעויות נפוצות ותרגול',
    level: 'beginner',
    orderIndex: 4,
    theoryContentHe: `
<h2>טעויות נפוצות עם מאמרים</h2>

<p>מאמרים הם אחד הנושאים הקשים ביותר ללומדי אנגלית. הנה הטעויות הנפוצות:</p>

<div class="rules">
  <p><strong>טעויות נפוצות:</strong></p>
  <table>
    <tr><th>שגוי</th><th>נכון</th><th>הסבר</th></tr>
    <tr><td>I am teacher.</td><td>I am <strong>a</strong> teacher.</td><td>מקצוע צריך a/an</td></tr>
    <tr><td>I like the dogs.</td><td>I like dogs.</td><td>רבים כלליים ללא the</td></tr>
    <tr><td>A apple</td><td><strong>An</strong> apple</td><td>לפני צליל תנועה = an</td></tr>
    <tr><td>He is a best student.</td><td>He is <strong>the</strong> best student.</td><td>superlative = the</td></tr>
    <tr><td>I go to the school.</td><td>I go to school.</td><td>ללמוד = ללא the</td></tr>
    <tr><td>The life is hard.</td><td>Life is hard.</td><td>כללי = ללא the</td></tr>
  </table>
</div>

<div class="examples">
  <p><strong>השוואה בין עברית לאנגלית:</strong></p>
  <p>בעברית לרוב לא משתמשים במאמר, לכן דוברי עברית נוטים לשכוח את a/an/the.</p>
  <p>אני מורה → I am <strong>a</strong> teacher (לא: I am teacher)</p>
  <p>יש לי כלב → I have <strong>a</strong> dog (לא: I have dog)</p>
  <p>הספר על השולחן → <strong>The</strong> book on <strong>the</strong> table</p>
</div>

<div class="warning">
  <strong>טיפים לזכירה:</strong>
  <ul>
    <li>מקצוע = a/an: a doctor, a teacher, an engineer</li>
    <li>ראשון/שני/אחרון = the: the first, the second, the last</li>
    <li>הכי.../הכי... = the: the best, the biggest, the most</li>
    <li>כללי/לא ספציפי = ללא: dogs, water, love</li>
    <li>ספציפי/ידוע = the: the dog (שדיברנו עליו)</li>
  </ul>
</div>
    `,
    exercises: [
      // EASY (1-5)
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'בחר את המשפט הנכון:',
        options: ['I am teacher.', 'I am a teacher.', 'I am the teacher.', 'I am an teacher.'],
        correctAnswer: 'I am a teacher.',
        explanationHe: 'עם מקצועות משתמשים ב-a/an: a teacher, a doctor, an engineer.',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "I like the cats." (במשמעות כללית) → I like _______.',
        correctAnswer: 'cats',
        explanationHe: 'כשמדברים על רבים בכלל, לא משתמשים ב-the.',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'בחר את המשפט הנכון:',
        options: ['A apple is red.', 'An apple is red.', 'The apple is red.', 'Apple is red.'],
        correctAnswer: 'An apple is red.',
        explanationHe: 'apple מתחיל בצליל תנועה, לכן an. (אם מדברים על תפוח כללי)',
        difficulty: 'easy'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'תקן: "He is a best player." → He is _______ best player.',
        correctAnswer: 'the',
        explanationHe: 'עם superlatives (best, biggest) משתמשים תמיד ב-the.',
        difficulty: 'easy'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'בחר את המשפט הנכון:',
        options: ['I have dog.', 'I have a dog.', 'I have the dog.', 'I have an dog.'],
        correctAnswer: 'I have a dog.',
        explanationHe: 'כשמציגים משהו בפעם הראשונה, משתמשים ב-a/an.',
        difficulty: 'easy'
      },
      // MEDIUM (6-10)
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'I saw _______ movie last night. _______ movie was great.',
        options: ['a, The', 'the, The', 'a, A', 'the, A'],
        correctAnswer: 'a, The',
        explanationHe: 'פעם ראשונה = a movie. פעם שנייה (ספציפי) = the movie.',
        difficulty: 'medium'
      },
      {
        questionNumber: 7,
        type: 'fill_in_blank',
        questionTextHe: 'My sister is _______ engineer. (מהנדסת)',
        correctAnswer: 'an',
        explanationHe: 'מקצוע + צליל תנועה = an engineer.',
        difficulty: 'medium'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['I like the music.', 'I like music.', 'I like a music.', 'I like an music.'],
        correctAnswer: 'I like music.',
        explanationHe: 'music הוא לא ספיר וכללי, לכן ללא מאמר.',
        difficulty: 'medium'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'She is _______ first person to finish.',
        correctAnswer: 'the',
        explanationHe: 'עם ordinals (first, second, last) משתמשים ב-the.',
        difficulty: 'medium'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'בחר את הנכון: "_______ happiness is important."',
        options: ['A', 'An', 'The', '-'],
        correctAnswer: '-',
        explanationHe: 'מושגים מופשטים כלליים (happiness, love) ללא מאמר.',
        difficulty: 'medium'
      },
      // HARD (11-20)
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'I went to _______ hospital. (לבקר חבר)',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: 'the',
        explanationHe: 'לבקר = to the hospital (מקום ספציפי). להיות מאושפז = in hospital (ללא the).',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'Complete: "_______ money can\'t buy _______ happiness."',
        correctAnswer: '-, -',
        explanationHe: 'money ו-happiness הם כלליים/מופשטים, לכן ללא מאמר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['She plays piano.', 'She plays the piano.', 'She plays a piano.', 'כולם נכונים'],
        correctAnswer: 'She plays the piano.',
        explanationHe: 'עם כלי נגינה משתמשים ב-the: play the piano, play the guitar.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: '_______ President Biden met with _______ Queen.',
        correctAnswer: '-, the',
        explanationHe: 'תואר + שם פרטי = ללא the. אבל the Queen (ללא שם) = the.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'מה נכון? "I need _______ information."',
        options: ['a', 'an', 'the', '-'],
        correctAnswer: '-',
        explanationHe: 'information הוא לא ספיר וכללי. אם ספציפי: the information you sent.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'She went to _______ university to study _______ law.',
        correctAnswer: '-, -',
        explanationHe: 'go to university (ללמוד) ו-study law (מקצוע) - שניהם ללא מאמר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'מה ההבדל בין "in hospital" ו-"in the hospital"?',
        options: ['אין הבדל', 'in hospital = מאושפז, in the hospital = בבניין', 'in the hospital יותר אמריקאי', 'שניהם שגויים'],
        correctAnswer: 'in hospital = מאושפז, in the hospital = בבניין',
        explanationHe: 'באנגלית בריטית: in hospital = כחולה. באנגלית אמריקאית משתמשים ב-the בשני המקרים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'I bought _______ new car. _______ car is red.',
        correctAnswer: 'a, The',
        explanationHe: 'הזכרה ראשונה = a new car. הזכרה שנייה (ספציפית) = the car.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'בחר את הנכון: "_______ French are known for their food."',
        options: ['A', 'An', 'The', '-'],
        correctAnswer: 'The',
        explanationHe: 'the + לאום = העם: the French, the English, the Japanese.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'מה הטעות הנפוצה ביותר של דוברי עברית?',
        options: ['להשתמש ב-the יותר מדי', 'לשכוח להשתמש ב-a/an', 'להשתמש ב-an במקום a', 'להשתמש ב-the עם שמות'],
        correctAnswer: 'לשכוח להשתמש ב-a/an',
        explanationHe: 'בעברית אין מאמר לא מוגדר, לכן דוברי עברית נוטים לשכוח a/an: "I am teacher" במקום "I am a teacher".',
        difficulty: 'hard'
      }
    ]
  }
];

// Seed function
async function seedTopic5() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    console.log('Starting to seed Topic 5: Articles...');

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
    console.log('Topic 5: Articles seeded successfully!');
    console.log(`   Total: ${lessonsData.length} lessons created`);
    console.log(`   Total exercises: ${lessonsData.reduce((sum, l) => sum + l.exercises.length, 0)}`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding Topic 5:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run if called directly
if (require.main === module) {
  seedTopic5()
    .then(() => {
      console.log('Seeding complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedTopic5, lessonsData };
