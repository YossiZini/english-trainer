const { pool } = require('../../config/database');
const Lesson = require('../../models/Lesson');
const Exercise = require('../../models/Exercise');

// Topic 4: Nouns - Singular & Plural (שמות עצם - יחיד ורבים)
const lessonsData = [
  // ==================== SUBTOPIC 4.1: Regular Plurals ====================
  {
    topicNumber: 4,
    subtopicNumber: '4.1',
    titleEn: 'Regular Plurals',
    titleHe: 'רבים רגילים',
    level: 'beginner',
    orderIndex: 1,
    theoryContentHe: `
<h2>רבים רגילים באנגלית</h2>

<p>באנגלית, הרוב הגדול של שמות העצם הופכים לרבים על ידי הוספת סיומת.</p>

<div class="rules">
  <p><strong>כלל 1: הוספת -S לרוב השמות:</strong></p>
  <ul>
    <li>book → book<strong>s</strong> (ספרים)</li>
    <li>car → car<strong>s</strong> (מכוניות)</li>
    <li>dog → dog<strong>s</strong> (כלבים)</li>
    <li>pen → pen<strong>s</strong> (עטים)</li>
  </ul>

  <p><strong>כלל 2: הוספת -ES לשמות המסתיימים ב: s, ss, sh, ch, x, z</strong></p>
  <ul>
    <li>bus → bus<strong>es</strong> (אוטובוסים)</li>
    <li>class → class<strong>es</strong> (כיתות)</li>
    <li>dish → dish<strong>es</strong> (צלחות)</li>
    <li>watch → watch<strong>es</strong> (שעונים)</li>
    <li>box → box<strong>es</strong> (קופסאות)</li>
  </ul>

  <p><strong>כלל 3: שמות המסתיימים ב-Y אחרי עיצור - משנים ל-IES</strong></p>
  <ul>
    <li>baby → bab<strong>ies</strong> (תינוקות)</li>
    <li>city → cit<strong>ies</strong> (ערים)</li>
    <li>story → stor<strong>ies</strong> (סיפורים)</li>
    <li>lady → lad<strong>ies</strong> (גברות)</li>
  </ul>

  <p><strong>כלל 4: שמות המסתיימים ב-Y אחרי תנועה - מוסיפים -S</strong></p>
  <ul>
    <li>boy → boy<strong>s</strong> (בנים)</li>
    <li>day → day<strong>s</strong> (ימים)</li>
    <li>key → key<strong>s</strong> (מפתחות)</li>
    <li>toy → toy<strong>s</strong> (צעצועים)</li>
  </ul>

  <p><strong>כלל 5: שמות המסתיימים ב-F או FE - משנים ל-VES</strong></p>
  <ul>
    <li>knife → kni<strong>ves</strong> (סכינים)</li>
    <li>leaf → lea<strong>ves</strong> (עלים)</li>
    <li>wife → wi<strong>ves</strong> (נשים נשואות)</li>
    <li>shelf → shel<strong>ves</strong> (מדפים)</li>
    <li><strong>חריגים:</strong> roof → roofs, chef → chefs</li>
  </ul>

  <p><strong>כלל 6: שמות המסתיימים ב-O אחרי עיצור - בדרך כלל מוסיפים -ES</strong></p>
  <ul>
    <li>tomato → tomato<strong>es</strong> (עגבניות)</li>
    <li>potato → potato<strong>es</strong> (תפוחי אדמה)</li>
    <li>hero → hero<strong>es</strong> (גיבורים)</li>
    <li><strong>חריגים:</strong> photo → photos, piano → pianos</li>
  </ul>
</div>
    `,
    exercises: [
      // Easy level
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'מה הצורת הרבים של "book"?',
        options: ['book', 'books', 'bookes', 'bookies'],
        correctAnswer: 'books',
        explanationHe: 'לרוב שמות העצם פשוט מוסיפים s: book → books',
        difficulty: 'easy'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'מה הצורת הרבים של "box"?',
        options: ['boxs', 'boxes', 'boxies', 'box'],
        correctAnswer: 'boxes',
        explanationHe: 'למילים שמסתיימות ב-x מוסיפים es: box → boxes',
        difficulty: 'easy'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'I have three _______ (pen).',
        correctAnswer: 'pens',
        explanationHe: 'pen הופך ל-pens בצורת הרבים',
        difficulty: 'easy'
      },
      // Medium level
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'מה הצורת הרבים של "baby"?',
        options: ['babys', 'babies', 'babyes', 'babyies'],
        correctAnswer: 'babies',
        explanationHe: 'כאשר y באה אחרי עיצור, משנים את y ל-ies: baby → babies',
        difficulty: 'medium'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'מה הצורת הרבים של "knife"?',
        options: ['knifes', 'knifees', 'knives', 'knifs'],
        correctAnswer: 'knives',
        explanationHe: 'מילים שמסתיימות ב-fe משנות ל-ves: knife → knives',
        difficulty: 'medium'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'She has many _______ (watch).',
        correctAnswer: 'watches',
        explanationHe: 'watch מסתיים ב-ch לכן מוסיפים es: watches',
        difficulty: 'medium'
      },
      // Hard level - 20 advanced exercises
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'מה הצורת הרבים של "tomato"?',
        options: ['tomatos', 'tomatoes', 'tomatoies', 'tomaties'],
        correctAnswer: 'tomatoes',
        explanationHe: 'תשובה נכונה: tomatoes. כלל: שמות עצם המסתיימים ב-O אחרי עיצור מוסיפים -ES (tomato → tomatoes). שים לב: אל תוסיף רק S, זו טעות נפוצה. חריגים לכלל: photo → photos, piano → pianos.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'There are two _______ (key) on the table.',
        correctAnswer: 'keys',
        explanationHe: 'תשובה נכונה: keys. כלל: כאשר Y באה אחרי תנועה (a,e,i,o,u), מוסיפים רק S (key → keys, boy → boys). שים לב: אל תשנה את ה-Y ל-IES - זו טעות נפוצה! רק כאשר Y באה אחרי עיצור משנים ל-IES (baby → babies).',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'מה הצורת הרבים של "piano"?',
        options: ['pianos', 'pianoes', 'pianies', 'piano'],
        correctAnswer: 'pianos',
        explanationHe: 'תשובה נכונה: pianos. כלל: למרות ש-piano מסתיים ב-O, זהו חריג והוא מקבל רק S (לא ES). שים לב: מילים מוסיקליות מסתיימות ב-O בדרך כלל מקבלות רק S (piano → pianos, solo → solos). זה שונה ממילים כמו tomato → tomatoes.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'מה הצורת הרבים של "roof"?',
        options: ['roofs', 'rooves', 'roofes', 'roovs'],
        correctAnswer: 'roofs',
        explanationHe: 'תשובה נכונה: roofs. כלל: למרות שרוב המילים המסתיימות ב-F משנות ל-VES (knife → knives), roof הוא חריג ומקבל רק S. שים לב: חריגים נוספים: chef → chefs, belief → beliefs. טעות נפוצה: לכתוב rooves על פי הכלל הרגיל.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'fill_in_blank',
        questionTextHe: 'The _______ (volcano) are dangerous.',
        correctAnswer: 'volcanoes',
        explanationHe: 'תשובה נכונה: volcanoes (אפשר גם volcanos). כלל: מילים המסתיימות ב-O אחרי עיצור יכולות לקבל שתי צורות - עם ES או רק S (volcano → volcanoes/volcanos). שים לב: בבחינות, שתי הצורות נכונות אבל volcanoes יותר נפוצה. טעות נפוצה: volcanos נחשבת פחות תקנית.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: 'מה הצורת הרבים של "quiz"?',
        options: ['quizs', 'quizes', 'quizzes', 'quizzs'],
        correctAnswer: 'quizzes',
        explanationHe: 'תשובה נכונה: quizzes. כלל: כאשר מילה מסתיימת ב-Z, מכפילים את ה-Z ומוסיפים ES (quiz → quizzes). שים לב: זה שונה מהכלל הרגיל של הוספת S. טעות נפוצה: לכתוב quizes ללא כפילת ה-Z.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'fill_in_blank',
        questionTextHe: 'She bought three _______ (scarf).',
        correctAnswer: 'scarves',
        explanationHe: 'תשובה נכונה: scarves. כלל: מילים המסתיימות ב-F משנות ל-VES (scarf → scarves, wolf → wolves). שים לב: ישנם חריגים כמו roof → roofs. טעות נפוצה: לכתוב scarfs על פי הכלל הרגיל של הוספת S.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'multiple_choice',
        questionTextHe: 'מה הצורת הרבים של "photo"?',
        options: ['photos', 'photoes', 'photoies', 'photos'],
        correctAnswer: 'photos',
        explanationHe: 'תשובה נכונה: photos. כלל: מילים קצרות וזרות שמסתיימות ב-O מקבלות רק S (photo → photos). שים לב: זה שונה ממילים כמו tomato → tomatoes. טעות נפוצה: להוסיף ES על פי הכלל הכללי של מילים המסתיימות ב-O.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'fill_in_blank',
        questionTextHe: 'The _______ (echo) were heard in the valley.',
        correctAnswer: 'echoes',
        explanationHe: 'תשובה נכונה: echoes. כלל: echo מסתיים ב-O אחרי עיצור ומקבל ES (echo → echoes). שים לב: המילה were מעידה על רבים. טעות נפוצה: לכתוב echos כמו בחריגים photo/piano.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'מה הצורת הרבים של "chief"?',
        options: ['chiefs', 'chieves', 'chiefes', 'cheifs'],
        correctAnswer: 'chiefs',
        explanationHe: 'תשובה נכונה: chiefs. כלל: למרות שרוב המילים המסתיימות ב-F משנות ל-VES, chief הוא חריג ומקבל רק S. שים לב: מילים דומות - belief → beliefs, chef → chefs. טעות נפוצה: לכתוב chieves על פי הכלל הרגיל.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'There are many _______ (half) in this pie.',
        correctAnswer: 'halves',
        explanationHe: 'תשובה נכונה: halves. כלל: מילים המסתיימות ב-LF משנות ל-LVES (half → halves, shelf → shelves, self → selves). שים לב: זהו כלל קבוע ללא חריגים. טעות נפוצה: לכתוב halfs בטעות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'מה הצורת הרבים של "hero"?',
        options: ['heros', 'heroes', 'heroies', 'heroses'],
        correctAnswer: 'heroes',
        explanationHe: 'תשובה נכונה: heroes. כלל: מילים המסתיימות ב-O אחרי עיצור מקבלות ES (hero → heroes, potato → potatoes). שים לב: אל תבלבל עם photo → photos שהוא חריג. טעות נפוצה: לכתוב heros כמו בחריגים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'fill_in_blank',
        questionTextHe: 'I need to sharpen my _______ (knife).',
        correctAnswer: 'knives',
        explanationHe: 'תשובה נכונה: knives. כלל: מילים המסתיימות ב-FE משנות ל-VES (knife → knives, wife → wives, life → lives). שים לב: ה-F הופך ל-V והסיומת משתנה ל-ES. טעות נפוצה: לכתוב knifes בטעות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'מה הצורת הרבים של "city"?',
        options: ['citys', 'cities', 'cityes', 'cityies'],
        correctAnswer: 'cities',
        explanationHe: 'תשובה נכונה: cities. כלל: כאשר Y באה אחרי עיצור (כאן T), משנים את ה-Y ל-IES (city → cities, baby → babies). שים לב: זה שונה ממילים כמו boy → boys שבהן Y באה אחרי תנועה. טעות נפוצה: לכתוב citys בלי לשנות את ה-Y.',
        difficulty: 'hard'
      },
      {
        questionNumber: 21,
        type: 'fill_in_blank',
        questionTextHe: 'The _______ (leaf) are falling from the tree.',
        correctAnswer: 'leaves',
        explanationHe: 'תשובה נכונה: leaves. כלל: מילים המסתיימות ב-F משנות ל-VES (leaf → leaves, thief → thieves). שים לב: המילה are מעידה על רבים. טעות נפוצה: לכתוב leafs על פי הכלל הרגיל.',
        difficulty: 'hard'
      },
      {
        questionNumber: 22,
        type: 'multiple_choice',
        questionTextHe: 'מה הצורת הרבים של "buzz"?',
        options: ['buzzs', 'buzzes', 'buzes', 'buzzies'],
        correctAnswer: 'buzzes',
        explanationHe: 'תשובה נכונה: buzzes. כלל: כאשר מילה מסתיימת ב-ZZ, מוסיפים ES (buzz → buzzes, fizz → fizzes). שים לב: זהו כלל דומה למילים המסתיימות ב-S, SS, X, CH, SH. טעות נפוצה: לכתוב buzzs או buzes.',
        difficulty: 'hard'
      },
      {
        questionNumber: 23,
        type: 'fill_in_blank',
        questionTextHe: 'We passed through several _______ (valley).',
        correctAnswer: 'valleys',
        explanationHe: 'תשובה נכונה: valleys. כלל: כאשר Y באה אחרי תנועה (כאן E), מוסיפים רק S (valley → valleys, donkey → donkeys). שים לב: אל תשנה את ה-Y ל-IES כמו במילים שבהן Y באה אחרי עיצור. טעות נפוצה: לכתוב vallies בטעות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 24,
        type: 'multiple_choice',
        questionTextHe: 'מה הצורת הרבים של "calf"?',
        options: ['calfs', 'calves', 'calfes', 'calvs'],
        correctAnswer: 'calves',
        explanationHe: 'תשובה נכונה: calves. כלל: מילים המסתיימות ב-LF משנות ל-LVES (calf → calves, elf → elves). שים לב: זהו כלל קבוע עבור מילים המסתיימות ב-LF. טעות נפוצה: לכתוב calfs על פי הכלל הרגיל של הוספת S.',
        difficulty: 'hard'
      },
      {
        questionNumber: 25,
        type: 'fill_in_blank',
        questionTextHe: 'The _______ (lady) are having tea.',
        correctAnswer: 'ladies',
        explanationHe: 'תשובה נכונה: ladies. כלל: כאשר Y באה אחרי עיצור (כאן D), משנים את ה-Y ל-IES (lady → ladies, story → stories). שים לב: המילה are מעידה על רבים. טעות נפוצה: לכתוב ladys בלי לשנות את ה-Y.',
        difficulty: 'hard'
      },
      {
        questionNumber: 26,
        type: 'multiple_choice',
        questionTextHe: 'מה הצורת הרבים של "mosquito"?',
        options: ['mosquitos', 'mosquitoes', 'mosquitos או mosquitoes', 'mosquitoies'],
        correctAnswer: 'mosquitos או mosquitoes',
        explanationHe: 'תשובה נכונה: mosquitos או mosquitoes (שתיהן נכונות). כלל: מילים המסתיימות ב-O אחרי עיצור יכולות לקבל שתי צורות. שים לב: mosquitoes יותר נפוצה באנגלית בריטית, mosquitos באמריקאית. טעות נפוצה: לחשוב שרק אחת מהצורות נכונה.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 4.2: Irregular Plurals ====================
  {
    topicNumber: 4,
    subtopicNumber: '4.2',
    titleEn: 'Irregular Plurals',
    titleHe: 'רבים חריגים',
    level: 'beginner',
    orderIndex: 2,
    theoryContentHe: `
<h2>רבים חריגים באנגלית</h2>

<p>יש שמות עצם שיוצרים רבים בצורה לא סדירה. צריך לשנן אותם!</p>

<div class="rules">
  <p><strong>רבים חריגים נפוצים (יש לשנן!):</strong></p>
  <ul>
    <li>man → <strong>men</strong> (גברים)</li>
    <li>woman → <strong>women</strong> (נשים)</li>
    <li>child → <strong>children</strong> (ילדים)</li>
    <li>person → <strong>people</strong> (אנשים)</li>
    <li>tooth → <strong>teeth</strong> (שיניים)</li>
    <li>foot → <strong>feet</strong> (רגליים)</li>
    <li>mouse → <strong>mice</strong> (עכברים)</li>
    <li>goose → <strong>geese</strong> (אווזים)</li>
  </ul>

  <p><strong>שמות עצם שלא משתנים (יחיד = רבים):</strong></p>
  <ul>
    <li>sheep → sheep (כבשים)</li>
    <li>fish → fish (דגים) <em>*יכול להיות גם fishes</em></li>
    <li>deer → deer (צבאים)</li>
    <li>series → series (סדרות)</li>
  </ul>
</div>

<div class="warning">
  <strong>שים לב!</strong> אי אפשר לומר "childs" או "mans" - אלה טעויות נפוצות!
</div>

<div class="examples">
  <p><strong>דוגמאות:</strong></p>
  <p>One <strong>child</strong> → Three <strong>children</strong></p>
  <p>One <strong>man</strong> → Two <strong>men</strong></p>
  <p>One <strong>tooth</strong> → Many <strong>teeth</strong></p>
  <p>One <strong>sheep</strong> → Ten <strong>sheep</strong></p>
</div>
    `,
    exercises: [
      // Advanced level - 20 exercises
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'מה הצורת הרבים של "ox" (שור)?',
        options: ['oxs', 'oxes', 'oxen', 'oxies'],
        correctAnswer: 'oxen',
        explanationHe: 'תשובה נכונה: oxen. כלל: ox הוא אחד הרבים החריגים הנדירים באנגלית עם סיומת -en. שים לב: זוהי צורה ארכאית שנשמרה רק במילים בודדות. טעות נפוצה: לכתוב oxes על פי הכלל הרגיל של הוספת -es למילים המסתיימות ב-x.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'The _______ (crisis) in the economy are serious.',
        correctAnswer: 'crises',
        explanationHe: 'תשובה נכונה: crises. כלל: מילים יווניות המסתיימות ב-is משנות ל-es ברבים (crisis → crises, analysis → analyses). שים לב: ההגייה משתנה - crisis נהגה "crai-sis", crises נהגה "crai-seez". טעות נפוצה: לכתוב crisises בתוספת -es רגילה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'מה הצורת הרבים של "louse" (כינה)?',
        options: ['louses', 'lice', 'lices', 'lousi'],
        correctAnswer: 'lice',
        explanationHe: 'תשובה נכונה: lice. כלל: louse משנה את התנועה ל-lice בצורת הרבים (כמו mouse → mice). שים לב: זהו רבים חריג עם שינוי תנועה פנימית. טעות נפוצה: לכתוב louses על פי הכלל הרגיל.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'Several _______ (medium) reported the story.',
        correctAnswer: 'media',
        explanationHe: 'תשובה נכונה: media. כלל: medium (אמצעי תקשורת) הופך ל-media ברבים - זוהי צורה לטינית. שים לב: בשפה היומיומית משתמשים לעיתים ב-media כיחיד, אבל הצורה הפורמלית הנכונה היא רבים. טעות נפוצה: לכתוב mediums (נכון רק כשמדברים על מדיומים רוחניים).',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'מה הצורת הרבים של "cactus"?',
        options: ['cactuses', 'cacti', 'cactuses או cacti', 'cactus'],
        correctAnswer: 'cactuses או cacti',
        explanationHe: 'תשובה נכונה: cactuses או cacti (שתיהן נכונות). כלל: מילים לטיניות יכולות לקבל רבים לטיני (-i) או אנגלי (-es). שים לב: cacti נחשבת יותר פורמלית, cactuses יותר נפוצה בשפה יומיומית. טעות נפוצה: לחשוב שרק אחת מהצורות נכונה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'Many _______ (species) are endangered.',
        correctAnswer: 'species',
        explanationHe: 'תשובה נכונה: species. כלל: species זהה ביחיד וברבים (one species, many species). שים לב: המילה many מעידה על רבים, אבל הצורה לא משתנה. טעות נפוצה: לכתוב specieses בתוספת -es.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'מה הצורת הרבים של "datum" (נתון)?',
        options: ['datums', 'data', 'datas', 'datumes'],
        correctAnswer: 'data',
        explanationHe: 'תשובה נכונה: data. כלל: datum (לטינית) הופך ל-data ברבים. שים לב: בשפה המודרנית data משמשת לרוב כשם עצם יחיד (the data is...), אבל פורמלית זו צורת רבים (the data are...). טעות נפוצה: לכתוב datas בהוספת s נוספת.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'The _______ (phenomenon) are unexplained.',
        correctAnswer: 'phenomena',
        explanationHe: 'תשובה נכונה: phenomena. כלל: phenomenon (יווני) הופך ל-phenomena ברבים. שים לב: המילה are מעידה על רבים. זוהי צורה יוונית שבה -on משתנה ל-a. טעות נפוצה: לכתוב phenomenons על פי הכלל האנגלי הרגיל.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'מה הצורת הרבים של "curriculum"?',
        options: ['curriculums', 'curricula', 'curriculums או curricula', 'curriculumes'],
        correctAnswer: 'curriculums או curricula',
        explanationHe: 'תשובה נכונה: curriculums או curricula (שתיהן נכונות). כלל: מילים לטיניות המסתיימות ב-um יכולות לקבל רבים לטיני (-a) או אנגלי (-s). שים לב: curricula נחשבת יותר פורמלית, curriculums יותר נפוצה. טעות נפוצה: לחשוב שרק curricula נכונה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'Two _______ (passerby) witnessed the accident.',
        correctAnswer: 'passersby',
        explanationHe: 'תשובה נכונה: passersby. כלל: בשמות עצם מורכבים, הרבים מתווסף למילה העיקרית (passer + by → passers + by). שים לב: by לא משתנה, רק passer הופך ל-passers. טעות נפוצה: לכתוב passerbys בתוספת s בסוף.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'מה הצורת הרבים של "fungus"?',
        options: ['funguses', 'fungi', 'funguses או fungi', 'fungus'],
        correctAnswer: 'funguses או fungi',
        explanationHe: 'תשובה נכונה: funguses או fungi (שתיהן נכונות). כלל: מילים לטיניות המסתיימות ב-us יכולות לקבל רבים לטיני (-i) או אנגלי (-es). שים לב: fungi נהגית "fun-guy" או "fun-jee". טעות נפוצה: לחשוב שרק אחת מהצורות קבילה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'The _______ (criterion) for selection are strict.',
        correctAnswer: 'criteria',
        explanationHe: 'תשובה נכונה: criteria. כלל: criterion (יווני) הופך ל-criteria ברבים. שים לב: criterion הוא יחיד, criteria הוא רבים - לכן המילה are (לא is). טעות נפוצה: להשתמש ב-criteria כיחיד ("the criteria is...") - זו טעות נפוצה מאוד.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'מה הצורת הרבים של "index"?',
        options: ['indexes', 'indices', 'indexes או indices', 'indexs'],
        correctAnswer: 'indexes או indices',
        explanationHe: 'תשובה נכונה: indexes או indices (שתיהן נכונות). כלל: index יכול לקבל רבים אנגלי (indexes) או לטיני (indices). שים לב: במתמטיקה מעדיפים indices, במחשבים ובספרים משתמשים ב-indexes. טעות נפוצה: לכתוב indexs ללא e.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'Three _______ (brother-in-law) came to the wedding.',
        correctAnswer: 'brothers-in-law',
        explanationHe: 'תשובה נכונה: brothers-in-law. כלל: בשמות עצם מורכבים עם מילות יחס, הרבים מתווסף למילה העיקרית הראשונה. שים לב: brother הוא המילה העיקרית, לכן brothers (לא brother). טעות נפוצה: לכתוב brother-in-laws בתוספת s בסוף.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'מה הצורת הרבים של "appendix"?',
        options: ['appendixes', 'appendices', 'appendixes או appendices', 'appendixs'],
        correctAnswer: 'appendixes או appendices',
        explanationHe: 'תשובה נכונה: appendixes או appendices (שתיהן נכונות). כלל: appendix יכול לקבל שתי צורות רבים. שים לב: כשמדברים על נספח לספר - appendixes, כשמדברים על האיבר בגוף - appendices. טעות נפוצה: לערבב בין השימושים השונים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'The _______ (basis) of the theory are sound.',
        correctAnswer: 'bases',
        explanationHe: 'תשובה נכונה: bases. כלל: basis (יווני) הופך ל-bases ברבים, עם שינוי ההגייה - basis נהגה "bay-sis", bases נהגה "bay-seez". שים לב: המילה are מעידה על רבים. טעות נפוצה: לכתוב basises בתוספת רגילה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'מה הצורת הרבים של "diagnosis"?',
        options: ['diagnosises', 'diagnoses', 'diagnosiss', 'diagnosies'],
        correctAnswer: 'diagnoses',
        explanationHe: 'תשובה נכונה: diagnoses. כלל: מילים יווניות המסתיימות ב-osis משנות ל-oses ברבים (diagnosis → diagnoses). שים לב: ההגייה משתנה - "die-ag-NO-sis" → "die-ag-NO-seez". טעות נפוצה: לכתוב diagnosises בהוספת סיומת רגילה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'Many _______ (series) were filmed here.',
        correctAnswer: 'series',
        explanationHe: 'תשובה נכונה: series. כלל: series זהה ביחיד וברבים (one series, many series). שים לב: המילה were מעידה על רבים, אבל הצורה לא משתנה. זוהי מילה לטינית ששמרה על הצורה המקורית. טעות נפוצה: לכתוב serieses בתוספת רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'מה הצורת הרבים של "antenna" (אנטנה)?',
        options: ['antennas', 'antennae', 'תלוי בהקשר', 'antennaes'],
        correctAnswer: 'תלוי בהקשר',
        explanationHe: 'תשובה נכונה: תלוי בהקשר. כלל: antenna יכולה לקבל שתי צורות רבים בהתאם למשמעות - antennae לגחון של חרקים, antennas לאנטנות תקשורת/טלוויזיה. שים לב: זוהי הבחנה חשובה בין שימוש ביולוגי לטכנולוגי. טעות נפוצה: להשתמש ב-antennae לכל הסוגים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'The _______ (formula) are complex.',
        correctAnswer: 'formulas',
        explanationHe: 'תשובה נכונה: formulas (או formulae). כלל: formula יכולה לקבל רבים אנגלי (formulas) או לטיני (formulae). שים לב: במתמטיקה ומדע formulas נפוצה יותר, בשפה פורמלית משתמשים ב-formulae. שתי הצורות תקינות. טעות נפוצה: לחשוב שרק formulae פורמלית ונכונה.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 4.3: Countable Nouns ====================
  {
    topicNumber: 4,
    subtopicNumber: '4.3',
    titleEn: 'Countable Nouns',
    titleHe: 'שמות עצם בני ספירה',
    level: 'beginner',
    orderIndex: 3,
    theoryContentHe: `
<h2>שמות עצם בני ספירה (Countable Nouns)</h2>

<p>שמות עצם בני ספירה הם דברים שאפשר למנות: אחד, שניים, שלושה...</p>

<div class="rules">
  <p><strong>מאפיינים של שמות עצם בני ספירה:</strong></p>
  <ul>
    <li>יש להם צורת יחיד ורבים</li>
    <li>אפשר להשתמש עם a/an ביחיד</li>
    <li>אפשר להשתמש עם מספרים</li>
    <li>אפשר להשתמש עם many/few</li>
  </ul>
</div>

<div class="examples">
  <p><strong>דוגמאות:</strong></p>
  <p>✅ one apple, two apples (תפוח אחד, שני תפוחים)</p>
  <p>✅ a book, three books (ספר, שלושה ספרים)</p>
  <p>✅ one student, ten students (תלמיד, עשרה תלמידים)</p>
  <p>✅ a chair, many chairs (כיסא, הרבה כיסאות)</p>

  <p><strong>עם מספרים וכמות:</strong></p>
  <p>I have <strong>two dogs</strong>. - יש לי שני כלבים</p>
  <p>She reads <strong>many books</strong>. - היא קוראת הרבה ספרים</p>
  <p>There are <strong>a few cars</strong>. - יש כמה מכוניות</p>
  <p><strong>How many</strong> apples do you want? - כמה תפוחים אתה רוצה?</p>
</div>
    `,
    exercises: [
      // Advanced level - 20 exercises
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'האם "hair" בן ספירה או לא בן ספירה?',
        options: ['תמיד בן ספירה', 'תמיד לא בן ספירה', 'תלוי בהקשר', 'אף אחד מהאלה'],
        correctAnswer: 'תלוי בהקשר',
        explanationHe: 'תשובה נכונה: תלוי בהקשר. כלל: hair הוא uncountable כשמדברים על שיער כולו (long hair), אבל countable כשמדברים על שערות בודדות (three hairs on the pillow). שים לב: רוב הזמן משתמשים ב-hair כ-uncountable. טעות נפוצה: להשתמש ב-hairs כשמדברים על שיער כללי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'I need _______ (a piece of / an) advice about my career.',
        correctAnswer: 'a piece of',
        explanationHe: 'תשובה נכונה: a piece of. כלל: advice הוא uncountable, לכן אי אפשר לומר "an advice". משתמשים ב-a piece of advice לייצג יחידה אחת. שים לב: גם information, news, furniture הם uncountable ודורשים a piece of. טעות נפוצה: לכתוב "an advice" על פי הדימוי שזו יחידה אחת.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'איזו מילה נכונה: "We need _______ furniture."',
        options: ['two', 'some', 'many', 'several'],
        correctAnswer: 'some',
        explanationHe: 'תשובה נכונה: some. כלל: furniture הוא uncountable למרות שמדובר בפריטים נפרדים. שים לב: לא אומרים "a furniture" או "two furnitures", אלא "a piece of furniture" או "two pieces of furniture". טעות נפוצה: להשתמש ב-many או במספרים עם furniture.',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'I have _______ (much/many) experiences in teaching.',
        correctAnswer: 'much',
        explanationHe: 'תשובה נכונה: much. כלל: experience כמושג כללי (ניסיון) הוא uncountable. שים לב: experience כחוויות בודדות הוא countable (I had two bad experiences). כאן מדובר על ניסיון כללי. טעות נפוצה: להשתמש ב-many כשמתכוונים לניסיון כללי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'האם "chicken" בן ספירה?',
        options: ['כן, תמיד', 'לא, אף פעם', 'תלוי בהקשר', 'רק בצורת רבים'],
        correctAnswer: 'תלוי בהקשר',
        explanationHe: 'תשובה נכונה: תלוי בהקשר. כלל: chicken כחיה חיה הוא countable (three chickens in the yard), אבל כבשר/אוכל הוא uncountable (some chicken for dinner). שים לב: זה נכון גם ל-fish, lamb, turkey. טעות נפוצה: לומר "two chickens" כשמתכוונים לשתי מנות אוכל.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'There isn\'t _______ (much/many) room in the car.',
        correctAnswer: 'much',
        explanationHe: 'תשובה נכונה: much. כלל: room במשמעות "מקום/שטח" הוא uncountable. שים לב: room במשמעות "חדר" הוא countable (three rooms). כאן מדובר על מקום, לכן much. טעות נפוצה: להשתמש ב-many בגלל שהמילה room נראית countable.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'איזו מילה נכונה: "I don\'t have _______ time."',
        options: ['many', 'much', 'a few', 'several'],
        correctAnswer: 'much',
        explanationHe: 'תשובה נכונה: much. כלל: time במשמעות כללית (זמן) הוא uncountable. שים לב: time במשמעות "פעמים" הוא countable (three times). כאן מדובר על זמן כללי, לכן much. טעות נפוצה: להשתמש ב-many בגלל שזמן נראה ניתן למנייה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'Would you like _______ (a/some) cake?',
        correctAnswer: 'some',
        explanationHe: 'תשובה נכונה: some. כלל: cake כאוכל כללי הוא uncountable (some cake). שים לב: cake כעוגה שלמה הוא countable (two cakes). כאן מציעים חתיכת עוגה, לא עוגה שלמה, לכן some. טעות נפוצה: לומר "a cake" כשמתכוונים לחתיכה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'האם "work" בן ספירה?',
        options: ['כן, תמיד', 'לא, אף פעם', 'תלוי בהקשר', 'רק בפורמלי'],
        correctAnswer: 'לא, אף פעם',
        explanationHe: 'תשובה נכונה: לא, אף פעם. כלל: work במשמעות "עבודה" הוא תמיד uncountable. שים לב: אי אפשר לומר "a work" או "two works" במשמעות עבודה. אומרים "a job" (משרה) או "a piece of work" (עבודה ספציפית). טעות נפוצה: לומר "I have two works" במקום "I have two jobs".',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'He gave me _______ (a/some) useful information.',
        correctAnswer: 'some',
        explanationHe: 'תשובה נכונה: some. כלל: information הוא uncountable ואי אפשר לומר "an information". שים לב: information תמיד בלי ה-s, ללא צורת רבים. לייצג יחידה משתמשים ב-a piece of information. טעות נפוצה: לכתוב "an information" או "informations".',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'האם "glass" בן ספירה?',
        options: ['כן, תמיד', 'לא, אף פעם', 'תלוי בהקשר', 'רק עם מספרים'],
        correctAnswer: 'תלוי בהקשר',
        explanationHe: 'תשובה נכונה: תלוי בהקשר. כלל: glass כחומר (זכוכית) הוא uncountable (made of glass), אבל ככוס/כוסות הוא countable (two glasses of water). שים לב: רוב החומרים (wood, metal, plastic) הם uncountable. טעות נפוצה: לומר "a glass" כשמתכוונים לחומר זכוכית.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'I read _______ (a/some) interesting news today.',
        correctAnswer: 'some',
        explanationHe: 'תשובה נכונה: some. כלל: news הוא uncountable למרות שנגמר ב-s ונראה כמו רבים. שים לב: news תמיד לוקח פועל יחיד (the news is...). לא אומרים "a news" או "two news". טעות נפוצה: להשתמש ב-a או לחשוב ש-news הוא רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'איזו מילה נכונה: "She has _______ luggage."',
        options: ['two', 'many', 'some', 'several'],
        correctAnswer: 'some',
        explanationHe: 'תשובה נכונה: some. כלל: luggage/baggage הם uncountable. שים לב: לא אומרים "a luggage" או "two luggages", אלא "a piece of luggage" או "a suitcase". טעות נפוצה: לומר "many luggages" או "two luggages".',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'There are _______ (much/many) possibilities.',
        correctAnswer: 'many',
        explanationHe: 'תשובה נכונה: many. כלל: possibility הוא countable כי מדובר באפשרויות נפרדות שניתן למנות. שים לב: המילה are מעידה על רבים. אופציות/אפשרויות שניתן להגדיר בנפרד הן countable. טעות נפוצה: להשתמש ב-much עם מילים מופשטות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'האם "money" בן ספירה?',
        options: ['כן, תמיד', 'לא, אף פעם', 'תלוי בסכום', 'רק עם מטבעות'],
        correctAnswer: 'לא, אף פעם',
        explanationHe: 'תשובה נכונה: לא, אף פעם. כלל: money הוא uncountable תמיד. שים לב: אומרים "some money", "much money" (לא many). למנות כסף משתמשים ב-coins, bills, dollars, etc. טעות נפוצה: לומר "many money" או "two moneys".',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'I need to buy _______ (a/some) bread.',
        correctAnswer: 'some',
        explanationHe: 'תשובה נכונה: some. כלל: bread הוא uncountable. שים לב: לא אומרים "a bread", אלא "a loaf of bread" (כיכר) או "a slice of bread" (פרוסה). טעות נפוצה: לומר "a bread" או "two breads".',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'האם "paper" בן ספירה?',
        options: ['כן, תמיד', 'לא, אף פעם', 'תלוי בהקשר', 'רק במשרד'],
        correctAnswer: 'תלוי בהקשר',
        explanationHe: 'תשובה נכונה: תלוי בהקשר. כלל: paper כחומר (נייר) הוא uncountable (made of paper), אבל כמסמך/עיתון הוא countable (three papers on the desk). שים לב: "a paper" יכול להיות מסמך, עבודה אקדמית, או עיתון. טעות נפוצה: לומר "a paper" כשמתכוונים לחומר.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'She has _______ (much/many) knowledge about history.',
        correctAnswer: 'much',
        explanationHe: 'תשובה נכונה: much. כלל: knowledge הוא uncountable תמיד. שים לב: אי אפשר לומר "a knowledge" או "knowledges". knowledge הוא מושג מופשט שאינו בן ספירה. טעות נפוצה: להשתמש ב-many עם מילים מופשטות שנראות ניתנות למנייה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'איזו מילה נכונה: "There is _______ traffic today."',
        options: ['many', 'much', 'a few', 'several'],
        correctAnswer: 'much',
        explanationHe: 'תשובה נכונה: much. כלל: traffic הוא uncountable. שים לב: המילה is (לא are) מעידה על יחיד/uncountable. לא אומרים "a traffic" או "many traffic", אלא "much/heavy traffic". טעות נפוצה: לומר "many traffic" כי נראה שמדובר במכוניות רבות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'I made _______ (much/many) progress this year.',
        correctAnswer: 'much',
        explanationHe: 'תשובה נכונה: much. כלל: progress הוא uncountable תמיד. שים לב: אי אפשר לומר "a progress" או "progresses". progress הוא מושג מופשט uncountable. אומרים "make progress" (לא "make progresses"). טעות נפוצה: להשתמש ב-many כי נדמה שניתן למנות התקדמויות.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 4.4: Uncountable Nouns ====================
  {
    topicNumber: 4,
    subtopicNumber: '4.4',
    titleEn: 'Uncountable Nouns',
    titleHe: 'שמות עצם שאינם בני ספירה',
    level: 'beginner',
    orderIndex: 4,
    theoryContentHe: `
<h2>שמות עצם שאינם בני ספירה (Uncountable Nouns)</h2>

<p>שמות עצם שאינם בני ספירה הם דברים שאי אפשר למנות ישירות.</p>

<div class="rules">
  <p><strong>מאפיינים:</strong></p>
  <ul>
    <li>אין להם צורת רבים</li>
    <li>לא משתמשים עם a/an</li>
    <li>תמיד עם פועל ביחיד</li>
    <li>משתמשים עם much/little (לא many/few)</li>
  </ul>

  <p><strong>קטגוריות נפוצות:</strong></p>
  <ul>
    <li><strong>נוזלים:</strong> water (מים), milk (חלב), coffee (קפה), juice (מיץ)</li>
    <li><strong>אוכל:</strong> bread (לחם), rice (אורז), meat (בשר), cheese (גבינה)</li>
    <li><strong>חומרים:</strong> wood (עץ), paper (נייר), glass (זכוכית), gold (זהב)</li>
    <li><strong>מופשט:</strong> love (אהבה), happiness (אושר), information (מידע), advice (עצה)</li>
    <li><strong>פעילויות:</strong> homework (שיעורי בית), work (עבודה), traffic (תנועה)</li>
    <li><strong>מזג אוויר:</strong> rain (גשם), snow (שלג), weather (מזג אוויר)</li>
  </ul>
</div>

<div class="examples">
  <p><strong>איך סופרים uncountable nouns?</strong></p>
  <p>משתמשים במיכלים או במנות:</p>
  <ul>
    <li>a <strong>glass</strong> of water (כוס מים)</li>
    <li>two <strong>cups</strong> of coffee (שתי כוסות קפה)</li>
    <li>three <strong>slices</strong> of bread (שלוש פרוסות לחם)</li>
    <li>a <strong>piece</strong> of advice (עצה אחת)</li>
    <li>a <strong>bottle</strong> of milk (בקבוק חלב)</li>
  </ul>
</div>

<div class="warning">
  <strong>טעויות נפוצות:</strong>
  <p>❌ <strong>שגוי:</strong> I need an information</p>
  <p>✅ <strong>נכון:</strong> I need some information</p>
  <br>
  <p>❌ <strong>שגוי:</strong> He gave me many advices</p>
  <p>✅ <strong>נכון:</strong> He gave me some advice</p>
</div>
    `,
    exercises: [
      // Advanced level - 20 exercises
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'איזו מילה נכונה: "I need _______ equipment for the trip."',
        options: ['some', 'many', 'a', 'several'],
        correctAnswer: 'some',
        explanationHe: 'תשובה נכונה: some. כלל: equipment הוא uncountable תמיד, למרות שמדובר על פריטים רבים. שים לב: לא אומרים "an equipment" או "many equipments", אלא "a piece of equipment". טעות נפוצה: לומר "many equipments" כי נדמה שמדובר בפריטים נפרדים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'Can you give me _______ (an/some) advice?',
        correctAnswer: 'some',
        explanationHe: 'תשובה נכונה: some. כלל: advice הוא uncountable ואי אפשר לומר "an advice". שים לב: advice תמיד ללא צורת רבים. לייצג יחידה אומרים "a piece of advice" או "a word of advice". טעות נפוצה: לכתוב "an advice" או "advices".',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'האם "homework" בן ספירה?',
        options: ['כן', 'לא', 'תלוי במספר התרגילים', 'תלוי במקצוע'],
        correctAnswer: 'לא',
        explanationHe: 'תשובה נכונה: לא. כלל: homework הוא uncountable תמיד. שים לב: לא אומרים "a homework" או "two homeworks", אלא "homework" או "a homework assignment". טעות נפוצה: לומר "I have three homeworks" במקום "I have three homework assignments".',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'There is _______ (much/many) pollution in the city.',
        correctAnswer: 'much',
        explanationHe: 'תשובה נכונה: much. כלל: pollution הוא uncountable. שים לב: המילה is (לא are) מעידה על uncountable. pollution הוא מושג כללי שאינו ניתן למנייה. טעות נפוצה: להשתמש ב-many כי נדמה שמדובר על סוגי זיהום שונים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'איזו מילה נכונה: "We need _______ evidence."',
        options: ['many', 'a', 'some', 'several'],
        correctAnswer: 'some',
        explanationHe: 'תשובה נכונה: some. כלל: evidence הוא uncountable. שים לב: לא אומרים "an evidence" או "many evidences", אלא "some evidence" או "a piece of evidence". טעות נפוצה: לומר "many evidences" במשפט משפטי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'The _______ (research) shows interesting results.',
        correctAnswer: 'research',
        explanationHe: 'תשובה נכונה: research. כלל: research הוא uncountable ולא משתנה. שים לב: המילה shows (יחיד) מעידה על uncountable. לא אומרים "researches" אלא "research" או "research studies". טעות נפוצה: לכתוב "researches" כצורת רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'האם "music" בן ספירה?',
        options: ['כן', 'לא', 'תלוי בז\'אנר', 'רק במוסיקה קלאסית'],
        correctAnswer: 'לא',
        explanationHe: 'תשובה נכונה: לא. כלל: music הוא uncountable תמיד. שים לב: לא אומרים "a music" או "many musics", אלא "music" או "a piece of music". לז\'אנרים אומרים "types of music". טעות נפוצה: לומר "I like many musics" במקום "I like many types of music".',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'I don\'t have _______ (much/many) patience.',
        correctAnswer: 'much',
        explanationHe: 'תשובה נכונה: much. כלל: patience הוא uncountable. שים לב: אי אפשר לומר "a patience" או "patiences". patience הוא מושג מופשט uncountable. טעות נפוצה: להשתמש ב-many עם תכונות אופי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'איזו מילה נכונה: "She has _______ experience."',
        options: ['many', 'much', 'a few', 'several'],
        correctAnswer: 'much',
        explanationHe: 'תשובה נכונה: much. כלל: experience במשמעות ניסיון כללי הוא uncountable. שים לב: experience כחוויות ספציפיות הוא countable (many experiences). כאן מדובר על ניסיון מקצועי כללי. טעות נפוצה: להשתמש ב-many כשמתכוונים לניסיון כללי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'The _______ (weather) is nice today.',
        correctAnswer: 'weather',
        explanationHe: 'תשובה נכונה: weather. כלל: weather הוא uncountable ולא משתנה. שים לב: המילה is (יחיד) מעידה על uncountable. לא אומרים "weathers" גם כשמדברים על מזג אוויר במקומות שונים. טעות נפוצה: לכתוב "weathers" כצורת רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'האם "clothing" בן ספירה?',
        options: ['כן', 'לא', 'תלוי בפריט', 'רק בחנות'],
        correctAnswer: 'לא',
        explanationHe: 'תשובה נכונה: לא. כלל: clothing הוא uncountable. שים לב: לא אומרים "a clothing" או "many clothings", אלא "clothing" או "items of clothing". לפריטים בודדים אומרים "clothes" (רבים) או "garments". טעות נפוצה: לבלבל בין clothing (uncountable) ו-clothes (countable רבים).',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'I need _______ (some/a) machinery for the factory.',
        correctAnswer: 'some',
        explanationHe: 'תשובה נכונה: some. כלל: machinery הוא uncountable למרות שמדובר במכונות רבות. שים לב: לא אומרים "a machinery" או "machineries", אלא "machinery" או "machines" (countable). טעות נפוצה: לומר "many machineries".',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'איזו מילה נכונה: "He doesn\'t have _______ luck."',
        options: ['many', 'much', 'a few', 'several'],
        correctAnswer: 'much',
        explanationHe: 'תשובה נכונה: much. כלל: luck הוא uncountable. שים לב: אי אפשר לומר "a luck" או "lucks". luck הוא מושג מופשט uncountable. אומרים "good luck" או "bad luck". טעות נפוצה: לומר "many luck".',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'The _______ (scenery) is beautiful here.',
        correctAnswer: 'scenery',
        explanationHe: 'תשובה נכונה: scenery. כלל: scenery הוא uncountable ולא משתנה. שים לב: המילה is (יחיד) מעידה על uncountable. לא אומרים "sceneries" גם כשמדברים על נופים שונים. אומרים "views" או "landscapes" (countable). טעות נפוצה: לכתוב "sceneries".',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'האם "poetry" בן ספירה?',
        options: ['כן', 'לא', 'תלוי בשיר', 'רק בשירים ארוכים'],
        correctAnswer: 'לא',
        explanationHe: 'תשובה נכונה: לא. כלל: poetry הוא uncountable. שים לב: לא אומרים "a poetry" או "poetries", אלא "poetry" או "poems" (countable לשירים בודדים). poetry מתייחס לז\'אנר כללי. טעות נפוצה: לומר "poetries" כשמתכוונים לשירים שונים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'We need _______ (some/many) accommodation.',
        correctAnswer: 'some',
        explanationHe: 'תשובה נכונה: some. כלל: accommodation הוא uncountable (בריטית). שים לב: באנגלית אמריקאית accommodations (רבים) יותר נפוץ. באנגלית בריטית: "some accommodation". טעות נפוצה: לומר "an accommodation" או "many accommodations" באנגלית בריטית.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'איזו מילה נכונה: "There is _______ traffic."',
        options: ['many', 'a', 'much', 'several'],
        correctAnswer: 'much',
        explanationHe: 'תשובה נכונה: much. כלל: traffic הוא uncountable. שים לב: המילה is (לא are) מעידה על uncountable. לא אומרים "a traffic" או "many traffic". אומרים "heavy/light traffic". טעות נפוצה: לומר "many traffic" כי נדמה שמונים מכוניות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'I have _______ (some/many) housework to do.',
        correctAnswer: 'some',
        explanationHe: 'תשובה נכונה: some. כלל: housework הוא uncountable. שים לב: לא אומרים "a housework" או "houseworks", אלא "housework" או "household chores" (countable). טעות נפוצה: לומר "many houseworks".',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'האם "progress" בן ספירה?',
        options: ['כן', 'לא', 'תלוי בתחום', 'רק בהתקדמויות גדולות'],
        correctAnswer: 'לא',
        explanationHe: 'תשובה נכונה: לא. כלל: progress הוא uncountable תמיד. שים לב: אי אפשר לומר "a progress" או "progresses". progress הוא מושג מופשט. אומרים "make progress" (לא "make progresses"). טעות נפוצה: לומר "many progresses" כשמתייחסים להישגים שונים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'The _______ (lightning) was frightening.',
        correctAnswer: 'lightning',
        explanationHe: 'תשובה נכונה: lightning. כלל: lightning הוא uncountable ולא משתנה. שים לב: המילה was (יחיד) מעידה על uncountable. לא אומרים "lightnings" גם כשיש ברקים מרובים. אומרים "lightning flashes" (countable). טעות נפוצה: לכתוב "lightnings".',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 4.5: Some/Any Usage ====================
  {
    topicNumber: 4,
    subtopicNumber: '4.5',
    titleEn: 'Some/Any Usage',
    titleHe: 'שימוש ב-Some/Any',
    level: 'beginner',
    orderIndex: 5,
    theoryContentHe: `
<h2>שימוש ב-Some ו-Any</h2>

<p>some ו-any משמשים עם שמות עצם בני ספירה (בצורת רבים) ושמות עצם שאינם בני ספירה.</p>

<div class="rules">
  <p><strong>SOME (כמה, קצת):</strong></p>
  <ul>
    <li>משתמשים במשפטים חיוביים</li>
    <li>עם countable ברבים: some books (כמה ספרים)</li>
    <li>עם uncountable: some water (קצת מים)</li>
  </ul>

  <p><strong>דוגמאות עם some:</strong></p>
  <ul>
    <li>I have <strong>some</strong> friends. - יש לי כמה חברים</li>
    <li>There is <strong>some</strong> milk in the fridge. - יש קצת חלב במקרר</li>
    <li>She wants <strong>some</strong> coffee. - היא רוצה קצת קפה</li>
  </ul>

  <p><strong>ANY (כלשהו, קצת):</strong></p>
  <ul>
    <li>משתמשים בשאלות ובשלילות</li>
    <li>עם countable ברבים: any books (ספרים כלשהם)</li>
    <li>עם uncountable: any water (מים כלשהם)</li>
  </ul>

  <p><strong>דוגמאות עם any:</strong></p>
  <ul>
    <li>Do you have <strong>any</strong> money? - יש לך כסף?</li>
    <li>I don't have <strong>any</strong> pets. - אין לי חיות מחמד</li>
    <li>Is there <strong>any</strong> coffee? - יש קפה?</li>
    <li>There aren't <strong>any</strong> chairs. - אין כיסאות</li>
  </ul>
</div>

<div class="warning">
  <strong>זכור:</strong><br>
  ✅ Positive → some<br>
  ✅ Question → any<br>
  ✅ Negative → any
</div>
    `,
    exercises: [
      // Advanced level - 20 exercises
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'Would you like _______ coffee?',
        options: ['some', 'any', 'a', 'the'],
        correctAnswer: 'some',
        explanationHe: 'תשובה נכונה: some. כלל: בהצעות ובקשות משתמשים ב-some גם בשאלה, כי מצפים לתשובה חיובית. שים לב: "Would you like...?" היא הצעה, לא שאלה רגילה. טעות נפוצה: להשתמש ב-any בכל השאלות ללא יוצא מן הכלל.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'Can I have _______ (some/any) sugar, please?',
        correctAnswer: 'some',
        explanationHe: 'תשובה נכונה: some. כלל: בבקשות (requests) משתמשים ב-some גם בשאלה. שים לב: "Can I have...?" היא בקשה, ומצפים לתשובה חיובית. טעות נפוצה: להשתמש ב-any בכל השאלות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'You can come _______ day you want.',
        options: ['some', 'any', 'a', 'an'],
        correctAnswer: 'any',
        explanationHe: 'תשובה נכונה: any. כלל: any במשפטים חיוביים משמעותו "כל אחד" או "לא משנה איזה". שים לב: "any day" = כל יום שתרצה. זה שונה מהשימוש הרגיל של any. טעות נפוצה: להשתמש ב-some במשמעות "כל אחד".',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'If you have _______ (some/any) questions, ask me.',
        correctAnswer: 'any',
        explanationHe: 'תשובה נכונה: any. כלל: אחרי if (תנאי) משתמשים ב-any. שים לב: זה נכון גם במשפטים חיוביים כשיש תנאי. any כאן משמעותו "שאלות כלשהן". טעות נפוצה: להשתמש ב-some אחרי if.',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'I haven\'t seen him _______ .',
        options: ['somewhere', 'anywhere', 'nowhere', 'someplace'],
        correctAnswer: 'anywhere',
        explanationHe: 'תשובה נכונה: anywhere. כלל: במשפטים שליליים משתמשים ב-anywhere (לא somewhere). שים לב: haven\'t seen = שלילה, לכן anywhere. טעות נפוצה: להשתמש ב-somewhere במשפטים שליליים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'There is _______ (somebody/anybody) at the door.',
        correctAnswer: 'somebody',
        explanationHe: 'תשובה נכונה: somebody. כלל: במשפטים חיוביים משתמשים ב-somebody (someone). שים לב: is (חיובי) מעיד על somebody. anybody משמש בשאלות ושלילות. טעות נפוצה: להשתמש ב-anybody במשפטים חיוביים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'Does _______ know the answer?',
        options: ['somebody', 'anybody', 'nobody', 'everybody'],
        correctAnswer: 'anybody',
        explanationHe: 'תשובה נכונה: anybody. כלל: בשאלות משתמשים ב-anybody (anyone). שים לב: Does מעיד על שאלה, לכן anybody. טעות נפוצה: להשתמש ב-somebody בשאלות רגילות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'I didn\'t see _______ (something/anything) strange.',
        correctAnswer: 'anything',
        explanationHe: 'תשובה נכונה: anything. כלל: במשפטים שליליים משתמשים ב-anything (לא something). שים לב: didn\'t = שלילה, לכן anything. טעות נפוצה: להשתמש ב-something במשפטים שליליים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'Let me know if you need _______ help.',
        options: ['some', 'any', 'a', 'the'],
        correctAnswer: 'any',
        explanationHe: 'תשובה נכונה: any. כלל: אחרי if משתמשים ב-any. שים לב: אפילו שהמשפט העיקרי חיובי, אחרי if משתמשים ב-any. טעות נפוצה: להשתמש ב-some אחרי if.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'I\'ll meet you _______ (sometime/anytime) this week.',
        correctAnswer: 'sometime',
        explanationHe: 'תשובה נכונה: sometime. כלל: במשפט חיובי מסוים משתמשים ב-sometime (זמן לא מוגדר בעתיד). שים לב: anytime = בכל זמן (לא משנה מתי), sometime = מתישהו ספציפי. טעות נפוצה: לבלבל בין sometime ו-anytime.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'Call me _______ you want.',
        options: ['sometime', 'anytime', 'sometimes', 'every time'],
        correctAnswer: 'anytime',
        explanationHe: 'תשובה נכונה: anytime. כלל: anytime משמעותו "בכל זמן שתרצה" - חופש מלא. שים לב: anytime = בכל זמן (לא משנה מתי), sometime = מתישהו. כאן מדובר על אפשרות בכל זמן. טעות נפוצה: להשתמש ב-sometime כשמתכוונים לכל זמן.',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'I don\'t want to go _______ (somewhere/anywhere) today.',
        correctAnswer: 'anywhere',
        explanationHe: 'תשובה נכונה: anywhere. כלל: במשפטים שליליים משתמשים ב-anywhere. שים לב: don\'t want = שלילה, לכן anywhere. טעות נפוצה: להשתמש ב-somewhere במשפטים שליליים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'Would _______ like more cake?',
        options: ['somebody', 'anybody', 'nobody', 'everybody'],
        correctAnswer: 'anybody',
        explanationHe: 'תשובה נכונה: anybody. כלל: בשאלה כללית (לא הצעה ספציפית) משתמשים ב-anybody. שים לב: אפילו עם "Would you like", כש"מדברים לקבוצה משתמשים ב-anybody. טעות נפוצה: להשתמש ב-somebody בשאלות כלליות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'You can choose _______ (some/any) color you like.',
        correctAnswer: 'any',
        explanationHe: 'תשובה נכונה: any. כלל: any במשפט חיובי משמעותו "כל אחד מהם" - בחירה חופשית לחלוטין. שים לב: "any color" = כל צבע שתרצה, אין הגבלה. טעות נפוצה: להשתמש ב-some כשמתכוונים לבחירה חופשית מלאה.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'Could I borrow _______ books?',
        options: ['some', 'any', 'a', 'the'],
        correctAnswer: 'some',
        explanationHe: 'תשובה נכונה: some. כלל: בבקשות (requests) משתמשים ב-some גם בשאלה. שים לב: "Could I...?" היא בקשה מנומסת, ומצפים לתשובה חיובית. טעות נפוצה: להשתמש ב-any בכל השאלות שמתחילות ב-could.',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'There isn\'t _______ (somebody/anybody) home.',
        correctAnswer: 'anybody',
        explanationHe: 'תשובה נכונה: anybody. כלל: במשפטים שליליים משתמשים ב-anybody. שים לב: isn\'t = שלילה, לכן anybody. טעות נפוצה: להשתמש ב-somebody במשפטים שליליים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'I rarely go _______ on weekends.',
        options: ['somewhere', 'anywhere', 'nowhere', 'everywhere'],
        correctAnswer: 'anywhere',
        explanationHe: 'תשובה נכונה: anywhere. כלל: אחרי מילות שלילה כמו rarely, hardly, seldom משתמשים ב-anywhere. שים לב: rarely = כמעט לא, זו שלילה, לכן anywhere. טעות נפוצה: לא להכיר ש-rarely דורשת anywhere.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'Did you buy _______ (something/anything)?',
        correctAnswer: 'anything',
        explanationHe: 'תשובה נכונה: anything. כלל: בשאלות רגילות משתמשים ב-anything. שים לב: Did מעיד על שאלה רגילה (לא הצעה או בקשה), לכן anything. טעות נפוצה: להשתמש ב-something בשאלות רגילות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'Hardly _______ came to the party.',
        options: ['somebody', 'anybody', 'nobody', 'everybody'],
        correctAnswer: 'anybody',
        explanationHe: 'תשובה נכונה: anybody. כלל: אחרי hardly (כמעט לא) משתמשים ב-anybody. שים לב: hardly היא מילת שלילה, לכן anybody. טעות נפוצה: להשתמש ב-somebody אחרי hardly.',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'You can sit _______ (somewhere/anywhere) you like.',
        correctAnswer: 'anywhere',
        explanationHe: 'תשובה נכונה: anywhere. כלל: anywhere במשפט חיובי משמעותו "בכל מקום" - בחירה חופשית. שים לב: "anywhere you like" = בכל מקום שתרצה, אין הגבלה. somewhere = מקום לא מוגדר. טעות נפוצה: להשתמש ב-somewhere כשמתכוונים לבחירה חופשית מלאה.',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 4.6: Common Mistakes ====================
  {
    topicNumber: 4,
    subtopicNumber: '4.6',
    titleEn: 'Common Mistakes',
    titleHe: 'טעויות נפוצות',
    level: 'beginner',
    orderIndex: 6,
    theoryContentHe: `
<h2>טעויות נפוצות עם שמות עצם</h2>

<p>הנה הטעויות הנפוצות ביותר וכיצד לתקן אותן:</p>

<div class="examples">
  <h3>רבים חריגים:</h3>
  <p>❌ <strong>שגוי:</strong> I have two <strong>childs</strong>.<br>
  ✅ <strong>נכון:</strong> I have two <strong>children</strong>.</p>
  <p>❌ <strong>שגוי:</strong> She has beautiful <strong>tooths</strong>.<br>
  ✅ <strong>נכון:</strong> She has beautiful <strong>teeth</strong>.</p>
  <p>❌ <strong>שגוי:</strong> There are five <strong>womans</strong>.<br>
  ✅ <strong>נכון:</strong> There are five <strong>women</strong>.</p>

  <h3>Uncountable nouns:</h3>
  <p>❌ <strong>שגוי:</strong> I need <strong>an informations</strong>.<br>
  ✅ <strong>נכון:</strong> I need <strong>some information</strong>.</p>
  <p>❌ <strong>שגוי:</strong> I drink two <strong>waters</strong>.<br>
  ✅ <strong>נכון:</strong> I drink two <strong>glasses of water</strong>.</p>
  <p>❌ <strong>שגוי:</strong> He gave me many <strong>advices</strong>.<br>
  ✅ <strong>נכון:</strong> He gave me <strong>some advice</strong>.</p>
  <p>❌ <strong>שגוי:</strong> I like <strong>musics</strong>.<br>
  ✅ <strong>נכון:</strong> I like <strong>music</strong>.</p>

  <h3>Many vs Much:</h3>
  <p>❌ <strong>שגוי:</strong> We have <strong>much</strong> books.<br>
  ✅ <strong>נכון:</strong> We have <strong>many</strong> books.</p>
  <p>❌ <strong>שגוי:</strong> There is <strong>many</strong> water.<br>
  ✅ <strong>נכון:</strong> There is <strong>much</strong> water.</p>

  <h3>Some vs Any:</h3>
  <p>❌ <strong>שגוי:</strong> Do you have <strong>some</strong> money?<br>
  ✅ <strong>נכון:</strong> Do you have <strong>any</strong> money?</p>
  <p>❌ <strong>שגוי:</strong> I don't have <strong>some</strong> time.<br>
  ✅ <strong>נכון:</strong> I don't have <strong>any</strong> time.</p>
</div>

<div class="rules">
  <p><strong>זכור תמיד:</strong></p>
  <ul>
    <li>רבים חריגים צריך לשנן!</li>
    <li>Uncountable nouns לא מקבלים a/an ואין להם רבים</li>
    <li>Many + countable, Much + uncountable</li>
    <li>Some במשפטים חיוביים, Any בשאלות ושלילות</li>
  </ul>
</div>
    `,
    exercises: [
      // Advanced level - 20 exercises focusing on common mistakes
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט שגוי?',
        options: ['She has beautiful teeth', 'There are three children playing', 'I bought two new furnitures', 'We saw many deer in the forest'],
        correctAnswer: 'I bought two new furnitures',
        explanationHe: 'תשובה נכונה: "I bought two new furnitures" הוא שגוי. כלל: furniture הוא uncountable ואי אפשר לומר "furnitures". שים לב: אומרים "two pieces of furniture" או "two furniture items". טעות נפוצה: לומר "furnitures" כי נדמה שמדובר על פריטים רבים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'I need to find _______ (a new work / a new job).',
        correctAnswer: 'a new job',
        explanationHe: 'תשובה נכונה: a new job. כלל: work הוא uncountable ואי אפשר לומר "a work" במשמעות משרה. שים לב: job = משרה (countable), work = עבודה כמושג (uncountable). טעות נפוצה מאוד: לומר "I need a new work" במקום "I need a new job".',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['I have many homeworks tonight', 'I have much homework tonight', 'I have a homework tonight', 'I have two homeworks tonight'],
        correctAnswer: 'I have much homework tonight',
        explanationHe: 'תשובה נכונה: I have much homework tonight. כלל: homework הוא uncountable ולא משנה אם יש הרבה תרגילים. שים לב: לא אומרים "a homework" או "homeworks", אלא "homework" או "homework assignments". טעות נפוצה: לומר "many homeworks".',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'fill_in_blank',
        questionTextHe: 'Can you give me _______ (an advice / some advice)?',
        correctAnswer: 'some advice',
        explanationHe: 'תשובה נכונה: some advice. כלל: advice הוא uncountable תמיד. שים לב: אי אפשר לומר "an advice" או "advices". לייצג עצה אחת אומרים "a piece of advice". טעות נפוצה מאוד: לכתוב "an advice".',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט שגוי?',
        options: ['There are many people here', 'I need some information', 'She has much experience', 'I received many informations'],
        correctAnswer: 'I received many informations',
        explanationHe: 'תשובה נכונה: "I received many informations" שגוי. כלל: information הוא uncountable ואין לו צורת רבים. שים לב: information תמיד ביחיד, משתמשים עם "much" או "some". טעות נפוצה: לכתוב "informations" עם s.',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'I don\'t have _______ (much/many) money.',
        correctAnswer: 'much',
        explanationHe: 'תשובה נכונה: much. כלל: money הוא uncountable תמיד. שים לב: אי אפשר לומר "many money" או "a money". למנות כסף משתמשים ב-dollars, pounds, etc. טעות נפוצה מאוד: לומר "many money".',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['Three childs are playing', 'Three children are playing', 'Three childrens are playing', 'Three child are playing'],
        correctAnswer: 'Three children are playing',
        explanationHe: 'תשובה נכונה: Three children are playing. כלל: child → children (רבים חריג). שים לב: לא childs, לא childrens - רק children. זו אחת הטעויות הנפוצות ביותר. טעות נפוצה: לכתוב "childs" או "childrens".',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'We need _______ (a new equipment / some new equipment) for the lab.',
        correctAnswer: 'some new equipment',
        explanationHe: 'תשובה נכונה: some new equipment. כלל: equipment הוא uncountable. שים לב: לא אומרים "an equipment" או "equipments", אלא "equipment" או "a piece of equipment". טעות נפוצה: לומר "a new equipment".',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט שגוי?',
        options: ['She gave me some good advice', 'I need to buy some bread', 'He has many experiences in teaching', 'There are much people here'],
        correctAnswer: 'There are much people here',
        explanationHe: 'תשובה נכונה: "There are much people here" שגוי. כלל: people הוא countable (צורת רבים של person), לכן many (לא much). שים לב: people כבר רבים, לכן "are" ו-"many". טעות נפוצה: להשתמש ב-much עם people.',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'I saw two _______ (woman/women) at the store.',
        correctAnswer: 'women',
        explanationHe: 'תשובה נכונה: women. כלל: woman → women (רבים חריג). שים לב: לא "womans" - זו טעות נפוצה מאוד. woman/women דומה ל-man/men. טעות נפוצה: לכתוב "womans" על פי הכלל הרגיל.',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['I like to listen to musics', 'I like to listen to music', 'I like to listen to a music', 'I like to listen to many musics'],
        correctAnswer: 'I like to listen to music',
        explanationHe: 'תשובה נכונה: I like to listen to music. כלל: music הוא uncountable. שים לב: לא "a music", לא "musics". לז\'אנרים אומרים "types of music" או "music styles". טעות נפוצה: לומר "I like many musics".',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'There isn\'t _______ (some/any) milk left.',
        correctAnswer: 'any',
        explanationHe: 'תשובה נכונה: any. כלל: במשפטים שליליים משתמשים ב-any (לא some). שים לב: isn\'t = שלילה, לכן any. זו טעות נפוצה מאוד. טעות נפוצה: לכתוב "some" במשפטים שליליים.',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט שגוי?',
        options: ['I brush my teeth twice a day', 'We saw many sheep on the farm', 'She has beautiful hairs', 'They caught several fish'],
        correctAnswer: 'She has beautiful hairs',
        explanationHe: 'תשובה נכונה: "She has beautiful hairs" שגוי. כלל: hair כשיער כללי הוא uncountable. שים לב: אומרים "beautiful hair" (ללא s). "hairs" נכון רק לשערות בודדות על כרית. טעות נפוצה: לומר "hairs" כשמתכוונים לשיער כללי.',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'I made _______ (much/many) progress this month.',
        correctAnswer: 'much',
        explanationHe: 'תשובה נכונה: much. כלל: progress הוא uncountable. שים לב: לא "a progress", לא "progresses", לא "many progress". אומרים "make progress" עם much. טעות נפוצה: להשתמש ב-many עם progress.',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['I need some luggages', 'I need some luggage', 'I need a luggage', 'I need many luggages'],
        correctAnswer: 'I need some luggage',
        explanationHe: 'תשובה נכונה: I need some luggage. כלל: luggage הוא uncountable. שים לב: לא "a luggage", לא "luggages". לפריטים אומרים "pieces of luggage" או "bags/suitcases". טעות נפוצה: לומר "luggages" או "a luggage".',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'Do you have _______ (some/any) questions?',
        correctAnswer: 'any',
        explanationHe: 'תשובה נכונה: any. כלל: בשאלות רגילות משתמשים ב-any. שים לב: רק בהצעות ובקשות משתמשים ב-some בשאלה. "Do you have...?" היא שאלה רגילה. טעות נפוצה: להשתמש ב-some בשאלות רגילות.',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט שגוי?',
        options: ['I need a piece of advice', 'She has much patience', 'We bought two breads', 'There isn\'t any traffic'],
        correctAnswer: 'We bought two breads',
        explanationHe: 'תשובה נכונה: "We bought two breads" שגוי. כלל: bread הוא uncountable. שים לב: אומרים "two loaves of bread" או "two pieces of bread", לא "two breads". טעות נפוצה: לומר "breads" במקום loaves.',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'The news _______ (is/are) very interesting.',
        correctAnswer: 'is',
        explanationHe: 'תשובה נכונה: is. כלל: news הוא uncountable ולוקח פועל יחיד, למרות שנגמר ב-s. שים לב: news תמיד עם is (לא are). זו טעות נפוצה כי news נראה כמו רבים. טעות נפוצה: לומר "the news are".',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'איזה משפט נכון?',
        options: ['I need to buy some new clothings', 'I need to buy some new clothing', 'I need to buy a new clothing', 'I need to buy many clothings'],
        correctAnswer: 'I need to buy some new clothing',
        explanationHe: 'תשובה נכונה: I need to buy some new clothing. כלל: clothing הוא uncountable. שים לב: לא "a clothing", לא "clothings". לפריטים בודדים אומרים "clothes" (רבים) או "items of clothing". טעות נפוצה: לומר "clothings".',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'I don\'t have _______ (some/any) time for this.',
        correctAnswer: 'any',
        explanationHe: 'תשובה נכונה: any. כלל: במשפטים שליליים משתמשים ב-any. שים לב: don\'t have = שלילה, לכן any (לא some). זו אחת הטעויות הנפוצות ביותר. טעות נפוצה: לכתוב "some" במשפטים שליליים.',
        difficulty: 'hard'
      }
    ]
  }
];

// Seed function
async function seedTopic4() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    console.log('Starting to seed Topic 4: Nouns...');

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
    console.log('✅ Topic 4: Nouns seeded successfully!');
    console.log(`   Total: ${lessonsData.length} lessons created`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding Topic 4:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run if called directly
if (require.main === module) {
  seedTopic4()
    .then(() => {
      console.log('Seeding complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedTopic4, lessonsData };
