const { pool } = require('../../config/database');
const Lesson = require('../../models/Lesson');
const Exercise = require('../../models/Exercise');

// Topic 8: Adjectives (שמות תואר)
const lessonsData = [
  // ==================== SUBTOPIC 8.1: What are Adjectives? ====================
  {
    topicNumber: 8,
    subtopicNumber: '8.1',
    titleEn: 'What are Adjectives?',
    titleHe: 'מהם שמות תואר?',
    level: 'beginner',
    orderIndex: 1,
    theoryContentHe: `
<h2>מהם שמות תואר?</h2>

<p>שמות תואר הם מילים שמתארות שמות עצם ועושות את המשפט יותר מעניין ומפורט.</p>

<div class="rules">
  <h3>שמות תואר עונים על השאלות:</h3>
  <ul>
    <li><strong>What kind?</strong> - איזה סוג? (big, small, beautiful)</li>
    <li><strong>Which one?</strong> - איזה? (this, that, first)</li>
    <li><strong>How many?</strong> - כמה? (three, many, few)</li>
  </ul>
</div>

<div class="examples">
  <h3>דוגמאות:</h3>
  <p>a <strong>big</strong> house - בית גדול</p>
  <p>a <strong>beautiful</strong> flower - פרח יפה</p>
  <p>a <strong>happy</strong> child - ילד שמח</p>
  <p>an <strong>old</strong> car - מכונית ישנה</p>
  <p><strong>cold</strong> water - מים קרים</p>
</div>

<div class="examples">
  <h3>שמות תואר נפוצים:</h3>
  <ul>
    <li><strong>big</strong> (גדול), <strong>small</strong> (קטן)</li>
    <li><strong>beautiful</strong> (יפה), <strong>ugly</strong> (מכוער)</li>
    <li><strong>happy</strong> (שמח), <strong>sad</strong> (עצוב)</li>
    <li><strong>new</strong> (חדש), <strong>old</strong> (ישן)</li>
    <li><strong>fast</strong> (מהיר), <strong>slow</strong> (איטי)</li>
  </ul>
</div>

<div class="warning">
  <strong>זכור:</strong> שמות תואר עושים את המשפט יותר ספציפי ומעניין!
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'He plays the guitar _______. Should I use "good" or "well"?',
        options: ['good', 'well', 'goodly', 'goods'],
        correctAnswer: 'well',
        explanationHe: 'תשובה נכונה: well - כי זה מתאר איך הוא מנגן (פועל)\nכלל: good הוא שם תואר (adjective), well הוא תואר הפועל (adverb)\nשים לב: "good" מתאר שמות עצם, "well" מתאר פעולות\nטעות נפוצה: אנשים אומרים "He plays good" במקום "He plays well"',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'fill_in_blank',
        questionTextHe: 'She sings _______. (bad/badly)',
        correctAnswer: 'badly',
        explanationHe: 'תשובה נכונה: badly - מתאר איך היא שרה\nכלל: badly הוא תואר פועל (adverb) שמתאר פעולות, bad הוא שם תואר\nשים לב: bad מתאר שמות עצם: "a bad singer", badly מתאר פעולות: "sings badly"\nטעות נפוצה: להשתמש ב-bad במקום badly עם פעלים',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'Which is correct: "three yellow birds" or "three yellows birds"?',
        options: ['three yellow birds', 'three yellows birds', 'three yellowing birds', 'yellows three birds'],
        correctAnswer: 'three yellow birds',
        explanationHe: 'תשובה נכונה: three yellow birds\nכלל: שמות תואר לא משתנים לפי מספר - הצורה תמיד זהה\nשים לב: yellow נשאר בצורה בסיסית גם עם שמות עצם ברבים\nטעות נפוצה: להוסיף -s לשם התואר כמו בשם העצם',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'The book was _______ interesting. I couldn\'t stop reading.',
        options: ['extremely', 'extreme', 'extremes', 'extreming'],
        correctAnswer: 'extremely',
        explanationHe: 'תשובה נכונה: extremely - מחזק את שם התואר interesting\nכלל: gradable adjectives (שמות תואר הדרגתיים) יכולים להשתמש עם very, really, extremely\nשים לב: extremely הוא תואר פועל שמחזק את שם התואר\nטעות נפוצה: להשתמש בצורת שם התואר במקום תואר הפועל',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'fill_in_blank',
        questionTextHe: 'The test was _______ easy. Everyone got 100%. (absolute/absolutely)',
        correctAnswer: 'absolutely',
        explanationHe: 'תשובה נכונה: absolutely - מחזק שם תואר קיצוני\nכלל: עם extreme adjectives משתמשים ב-absolutely/completely, לא very\nשים לב: easy הוא gradable, אבל כשאומרים "absolutely easy" מדגישים שזה קל במיוחד\nטעות נפוצה: להשתמש ב-very עם כל סוג של שם תואר',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'I am _______ in learning English.',
        options: ['interesting', 'interested', 'interest', 'interests'],
        correctAnswer: 'interested',
        explanationHe: 'תשובה נכונה: interested - מתאר את הרגש שלי\nכלל: -ed adjectives מתארים איך אנשים מרגישים, -ing מתארים מה גורם לרגש\nשים לב: "I am interested" = אני מעוניין, "English is interesting" = אנגלית מעניינת\nטעות נפוצה: להשתמש ב-interesting כשמדברים על רגש אישי',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'The movie was _______. It made me cry.',
        options: ['moving', 'moved', 'move', 'moves'],
        correctAnswer: 'moving',
        explanationHe: 'תשובה נכונה: moving - הסרט גורם לרגש\nכלל: -ing adjectives מתארים דברים שגורמים לרגשות\nשים לב: הסרט גורם לי לבכות, אז הוא moving (מרגש)\nטעות נפוצה: להשתמש ב-moved לתיאור הסרט במקום האדם',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'The children are _______. They sleep standing up. (asleep/sleeping)',
        correctAnswer: 'asleep',
        explanationHe: 'תשובה נכונה: asleep - מצב של שינה\nכלל: asleep, afraid, alive, alone הם predicative adjectives - רק אחרי פועל קישור\nשים לב: אי אפשר לומר "an asleep child", צריך "a sleeping child" או "The child is asleep"\nטעות נפוצה: לנסות להשתמש ב-asleep לפני שם עצם',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'I want to buy something _______ for my mom.',
        options: ['special', 'specially', 'specials', 'specialing'],
        correctAnswer: 'special',
        explanationHe: 'תשובה נכונה: special - שם תואר אחרי something\nכלל: אחרי indefinite pronouns (something, nothing, anything) שם התואר בא אחרי\nשים לב: הסדר המיוחד: something + adjective (לא adjective + something)\nטעות נפוצה: לשים את שם התואר לפני something',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'fill_in_blank',
        questionTextHe: 'There is nothing _______ in this store. (new)',
        correctAnswer: 'new',
        explanationHe: 'תשובה נכונה: new - אחרי nothing\nכלל: עם nothing, something, anything שם התואר בא אחרי (post-positioned)\nשים לב: nothing new (לא new nothing)\nטעות נפוצה: לנסות לשים את שם התואר לפני המילה',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'The soup tastes _______.',
        options: ['delicious', 'deliciously', 'deliciousness', 'deliciouses'],
        correctAnswer: 'delicious',
        explanationHe: 'תשובה נכונה: delicious - שם תואר אחרי linking verb\nכלל: אחרי linking verbs (taste, smell, sound, feel, look, seem) משתמשים בשם תואר\nשים לב: taste הוא linking verb, לא action verb, לכן צריך adjective\nטעות נפוצה: להשתמש בתואר הפועל (deliciously) אחרי linking verb',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: 'She looks _______ today.',
        options: ['tired', 'tiredly', 'tiring', 'tires'],
        correctAnswer: 'tired',
        explanationHe: 'תשובה נכונה: tired - היא נראית עייפה\nכלל: look כ-linking verb לוקח שם תואר, לא תואר פועל\nשים לב: "She looks tired" = היא נראית עייפה, "She looks tiredly" = הדרך שבה היא מסתכלת\nטעות נפוצה: להוסיף -ly אחרי linking verbs',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'fill_in_blank',
        questionTextHe: 'The _______ reason I came is to see you. (main)',
        correctAnswer: 'main',
        explanationHe: 'תשובה נכונה: main - שם תואר שרק בא לפני שם עצם\nכלל: main, only, chief הם attributive adjectives - רק לפני שם עצם\nשים לב: אי אפשר לומר "The reason is main", צריך "The main reason"\nטעות נפוצה: לנסות להשתמש ב-main אחרי linking verb',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'multiple_choice',
        questionTextHe: 'The child is _______ of the dark.',
        options: ['afraid', 'fear', 'fearing', 'fearful'],
        correctAnswer: 'afraid',
        explanationHe: 'תשובה נכונה: afraid - predicative adjective\nכלל: afraid רק משתמשים אחרי linking verb, לא לפני שם עצם\nשים לב: "The child is afraid" (נכון), "an afraid child" (שגוי) → "a frightened child"\nטעות נפוצה: לומר "an afraid child" במקום "a frightened child"',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'I saw three _______ dogs in the park.',
        options: ['huge', 'huges', 'hugely', 'hugest'],
        correctAnswer: 'huge',
        explanationHe: 'תשובה נכונה: huge - extreme adjective שלא משתנה\nכלל: extreme adjectives (huge, tiny, excellent) לא משתנים לפי מספר\nשים לב: huge נשאר זהה בכל המקרים - huge dog / huge dogs\nטעות נפוצה: להוסיף -s ל-adjective כשיש שם עצם ברבים',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'fill_in_blank',
        questionTextHe: 'The weather is _______ hot. I can\'t go outside. (boiling)',
        correctAnswer: 'boiling',
        explanationHe: 'תשובה נכונה: boiling - extreme adjective לחום קיצוני\nכלל: boiling, freezing הם extreme adjectives לטמפרטורה קיצונית\nשים לב: אפשר להגיד "absolutely boiling" אבל לא "very boiling"\nטעות נפוצה: להגיד "very boiling" במקום "boiling" או "absolutely boiling"',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'The presentation was _______. Everyone fell asleep.',
        options: ['boring', 'bored', 'bore', 'bores'],
        correctAnswer: 'boring',
        explanationHe: 'תשובה נכונה: boring - המצגת גורמת לשעמום\nכלל: participial adjectives: -ing מתאר מה גורם לרגש, -ed מתאר את הרגש\nשים לב: המצגת משעממת (boring), האנשים משועממים (bored)\nטעות נפוצה: לבלבל בין bored ו-boring',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'I feel _______ after studying all night. (exhausted/exhausting)',
        correctAnswer: 'exhausted',
        explanationHe: 'תשובה נכונה: exhausted - איך אני מרגיש\nכלל: -ed adjectives מתארים רגשות ומצבים של אנשים\nשים לב: "I feel exhausted" = אני מותש, "The work is exhausting" = העבודה מתישה\nטעות נפוצה: להשתמש ב-exhausting כשמתארים את הרגש האישי',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'Which sentence uses gradable and extreme adjectives correctly?',
        options: ['The movie was very good and absolutely excellent', 'The movie was absolutely good and very excellent', 'The movie was good but excellent', 'The movie was very huge'],
        correctAnswer: 'The movie was very good and absolutely excellent',
        explanationHe: 'תשובה נכונה: very good (gradable) and absolutely excellent (extreme)\nכלל: gradable adjectives לוקחים very/really/quite, extreme adjectives לוקחים absolutely/completely\nשים לב: good = gradable (very good), excellent = extreme (absolutely excellent)\nטעות נפוצה: להגיד "very excellent" או "absolutely good"',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'The story sounds _______. I want to hear more.',
        options: ['fascinating', 'fascinated', 'fascinate', 'fascinates'],
        correctAnswer: 'fascinating',
        explanationHe: 'תשובה נכונה: fascinating - הסיפור מרתק\nכלל: אחרי linking verb (sounds) + -ing כי הסיפור גורם לריתוק\nשים לב: "The story is fascinating" (הסיפור מרתק), "I am fascinated" (אני מרותק)\nטעות נפוצה: להשתמש ב-fascinated לתיאור הסיפור',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 8.2: Position in Sentence ====================
  {
    topicNumber: 8,
    subtopicNumber: '8.2',
    titleEn: 'Position in Sentence',
    titleHe: 'מיקום במשפט',
    level: 'intermediate',
    orderIndex: 2,
    theoryContentHe: `
<h2>מיקום שמות התואר במשפט</h2>

<p>שמות תואר באנגלית יכולים להופיע בשני מקומות במשפט:</p>

<div class="rules">
  <h3>1. לפני שם העצם (BEFORE the noun):</h3>
  <p><strong>article + adjective + noun</strong></p>
  <ul>
    <li>a <strong>big</strong> house - בית גדול</li>
    <li>a <strong>beautiful</strong> flower - פרח יפה</li>
    <li>an <strong>old</strong> car - מכונית ישנה</li>
    <li><strong>happy</strong> children - ילדים שמחים</li>
    <li><strong>cold</strong> water - מים קרים</li>
  </ul>
</div>

<div class="rules">
  <h3>2. אחרי פועל "to be" (AFTER "to be"):</h3>
  <p><strong>noun + is/are + adjective</strong></p>
  <ul>
    <li>The house is <strong>big</strong>. - הבית גדול</li>
    <li>The flower is <strong>beautiful</strong>. - הפרח יפה</li>
    <li>The car is <strong>old</strong>. - המכונית ישנה</li>
    <li>The children are <strong>happy</strong>. - הילדים שמחים</li>
    <li>The water is <strong>cold</strong>. - המים קרים</li>
  </ul>
</div>

<div class="warning">
  <strong>זכור:</strong> באנגלית שם התואר תמיד לפני שם העצם (לא כמו בעברית!)
  <br>❌ <strong>שגוי:</strong> a house big<br>
  ✅ <strong>נכון:</strong> a big house
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'Where does the adjective go? "I have a _____ house _____."',
        options: ['big, (nothing after)', '(nothing before), big', 'big, big', 'house big'],
        correctAnswer: 'big, (nothing after)',
        explanationHe: 'תשובה נכונה: a big house - attributive position\nכלל: attributive position = שם תואר לפני שם העצם (a + adjective + noun)\nשים לב: זו הצורה הנפוצה ביותר לשימוש בשמות תואר\nטעות נפוצה: לשים את שם התואר אחרי שם העצם כמו בעברית',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'The house is _______. This is _______ position.',
        options: ['big, predicative', 'big, attributive', 'a big, predicative', 'big house, attributive'],
        correctAnswer: 'big, predicative',
        explanationHe: 'תשובה נכונה: big, predicative - אחרי linking verb\nכלל: predicative position = אחרי פועל קישור (be, seem, look, etc.)\nשים לב: במיקום predicative אין צורך ב-article לפני שם התואר\nטעות נפוצה: להוסיף article אחרי linking verb: "The house is a big"',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'The _______ reason I came is to help. Can "main" go after "be"? (yes/no)',
        correctAnswer: 'main, no',
        explanationHe: 'תשובה נכונה: main, no - רק attributive\nכלל: main, only, chief הם adjectives שעובדים רק attributively (לפני שם עצם)\nשים לב: נכון: "the main reason", שגוי: "the reason is main"\nטעות נפוצה: לנסות להשתמש ב-main אחרי linking verb',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'The dog is _______. Can "afraid" be used before a noun?',
        options: ['afraid, no', 'afraid, yes', 'fear, no', 'scary, no'],
        correctAnswer: 'afraid, no',
        explanationHe: 'תשובה נכונה: afraid, no - רק predicative\nכלל: afraid, asleep, alive, alone הם adjectives שעובדים רק predicatively\nשים לב: נכון: "The dog is afraid", שגוי: "an afraid dog" → "a frightened dog"\nטעות נפוצה: לומר "an afraid child" או "an asleep baby"',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'I want to buy something _______. Why does the adjective come after?',
        options: ['special, indefinite pronoun rule', 'special, random', 'special something, normal order', 'specially, adverb'],
        correctAnswer: 'special, indefinite pronoun rule',
        explanationHe: 'תשובה נכונה: special, indefinite pronoun rule\nכלל: אחרי indefinite pronouns (something, nothing, anything) שם התואר בא אחרי (post-positioned)\nשים לב: something special, nothing new, anything interesting\nטעות נפוצה: לשים את שם התואר לפני: "special something"',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'The soup tastes _______. Is "taste" a linking verb here? (yes/no)',
        correctAnswer: 'delicious, yes',
        explanationHe: 'תשובה נכונה: delicious, yes - linking verb\nכלל: linking verbs (taste, smell, sound, feel, look, seem) לוקחים adjectives, לא adverbs\nשים לב: "tastes delicious" (adjective) לא "tastes deliciously" (adverb)\nטעות נפוצה: להשתמש באדוורב אחרי linking verb',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'She seems _______ today. What type of verb is "seem"?',
        options: ['tired, linking', 'tired, action', 'tiredly, linking', 'tiredly, action'],
        correctAnswer: 'tired, linking',
        explanationHe: 'תשובה נכונה: tired, linking - seem הוא linking verb\nכלל: seem, appear, become הם linking verbs שלוקחים adjectives\nשים לב: "seems tired" (adjective), לא "seems tiredly" (adverb)\nטעות נפוצה: להשתמש באדוורב אחרי linking verbs',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'There is nothing _______ to watch on TV. (interesting)',
        correctAnswer: 'interesting',
        explanationHe: 'תשובה נכונה: interesting - post-positioned\nכלל: עם nothing, something, anything שם התואר תמיד בא אחרי\nשים לב: nothing interesting (נכון), interesting nothing (שגוי)\nטעות נפוצה: לשים adjective לפני indefinite pronoun',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'The baby is _______. Can I say "an asleep baby"?',
        options: ['asleep, no - say sleeping baby', 'asleep, yes', 'sleeping, no', 'sleep, yes'],
        correctAnswer: 'asleep, no - say sleeping baby',
        explanationHe: 'תשובה נכונה: asleep, no - predicative only\nכלל: asleep עובד רק predicatively, לא attributively\nשים לב: "the baby is asleep" (נכון), "a sleeping baby" (נכון), "an asleep baby" (שגוי)\nטעות נפוצה: לנסות להשתמש ב-asleep לפני שם עצם',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'The flower smells _______. Which is correct?',
        options: ['wonderful (adjective)', 'wonderfully (adverb)', 'wonder (noun)', 'wondering (verb)'],
        correctAnswer: 'wonderful (adjective)',
        explanationHe: 'תשובה נכונה: wonderful - adjective אחרי linking verb\nכלל: smell כ-linking verb לוקח adjective לתיאור הריח\nשים לב: "smells wonderful" = הריח נפלא, "smells wonderfully" משמעו שהאף עובד נפלא\nטעות נפוצה: להשתמש באדוורב אחרי smell כשמתארים את הריח',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'fill_in_blank',
        questionTextHe: 'The _______ child is still in bed. Can I use "asleep" here? (yes/no)',
        correctAnswer: 'sleeping, no',
        explanationHe: 'תשובה נכונה: sleeping, no - asleep רק predicative\nכלל: לפני שם עצם משתמשים ב-sleeping, לא asleep\nשים לב: sleeping (attributive OK), asleep (predicative only)\nטעות נפוצה: לומר "the asleep child"',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: 'I need anything _______ to eat. Why is this order correct?',
        options: ['sweet, post-positioned after indefinite pronoun', 'sweet, normal order', 'sweet anything, normal order', 'sweetly, adverb'],
        correctAnswer: 'sweet, post-positioned after indefinite pronoun',
        explanationHe: 'תשובה נכונה: sweet, post-positioned\nכלל: אחרי anything, something, nothing שם התואר בא אחרי (מיקום מיוחד)\nשים לב: anything sweet, something cold, nothing special\nטעות נפוצה: לשים את adjective לפני: "sweet anything"',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'The music sounds _______. Is this predicative or attributive position?',
        options: ['beautiful, predicative', 'beautiful, attributive', 'a beautiful, predicative', 'beautifully, predicative'],
        correctAnswer: 'beautiful, predicative',
        explanationHe: 'תשובה נכונה: beautiful, predicative - אחרי linking verb\nכלל: predicative position = אחרי linking verb (sound, smell, taste, feel, look, seem)\nשים לב: "sounds beautiful" לא "sounds beautifully"\nטעות נפוצה: להשתמש באדוורב במקום adjective אחרי linking verb',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'She is still _______. Can I say "an alive person"? (yes/no)',
        correctAnswer: 'alive, no',
        explanationHe: 'תשובה נכונה: alive, no - predicative only\nכלל: alive עובד רק predicatively, לא attributively\nשים לב: "She is alive" (נכון), "an alive person" (שגוי) → "a living person"\nטעות נפוצה: לנסות להשתמש ב-alive לפני שם עצם',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'The _______ person to arrive wins. Can "only" be predicative?',
        options: ['only, no - attributive only', 'only, yes', 'one, no', 'alone, no'],
        correctAnswer: 'only, no - attributive only',
        explanationHe: 'תשובה נכונה: only, no - attributive only\nכלל: only, main, chief עובדים רק attributively (לפני שם עצם)\nשים לב: "the only person" (נכון), "the person is only" (שגוי במשמעות הזו)\nטעות נפוצה: לנסות להשתמש ב-only, main, chief אחרי linking verb',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'He feels _______ today. What position is this?',
        options: ['happy, predicative after linking verb', 'happy, attributive before noun', 'happily, predicative', 'happiness, predicative'],
        correctAnswer: 'happy, predicative after linking verb',
        explanationHe: 'תשובה נכונה: happy, predicative\nכלל: feel הוא linking verb שלוקח adjective במיקום predicative\nשים לב: "feels happy" (adjective), לא "feels happily" (adverb)\nטעות נפוצה: להשתמש באדוורב אחרי feel',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'I saw something _______ in the sky. (strange)',
        correctAnswer: 'strange',
        explanationHe: 'תשובה נכונה: strange - post-positioned\nכלל: adjectives אחרי indefinite pronouns (something, anything, nothing)\nשים לב: something strange (נכון), strange something (שגוי)\nטעות נפוצה: סדר לא נכון עם indefinite pronouns',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'She lives _______. Can "alone" be used before a noun?',
        options: ['alone, no - predicative only', 'alone, yes', 'lonely, no', 'alonely, yes'],
        correctAnswer: 'alone, no - predicative only',
        explanationHe: 'תשובה נכונה: alone, no - predicative only\nכלל: alone (לבד) עובד רק predicatively, לא attributively\nשים לב: "lives alone" (נכון), "an alone person" (שגוי) → "a lonely person"\nטעות נפוצה: לומר "an alone child"',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'The cake tastes _______ and looks _______. Both are _______ verbs.',
        options: ['delicious, beautiful, linking', 'deliciously, beautifully, action', 'delicious, beautifully, linking', 'deliciously, beautiful, action'],
        correctAnswer: 'delicious, beautiful, linking',
        explanationHe: 'תשובה נכונה: delicious, beautiful, linking\nכלל: taste ו-look הם linking verbs שלוקחים adjectives\nשים לב: שני המקרים משתמשים באדג\'קטיבים כי שניהם linking verbs\nטעות נפוצה: לחשוב ש-taste/look תמיד לוקחים אדוורבים',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'Give me something _______ to drink. (cold)',
        correctAnswer: 'cold',
        explanationHe: 'תשובה נכונה: cold - post-positioned adjective\nכלל: עם something/anything/nothing + adjective, שם התואר בא אחרי\nשים לב: something cold (נכון), cold something (שגוי)\nטעות נפוצה: לשמור על סדר רגיל (adjective + noun) עם indefinite pronouns',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 8.3: Common Adjectives ====================
  {
    topicNumber: 8,
    subtopicNumber: '8.3',
    titleEn: 'Common Adjectives',
    titleHe: 'שמות תואר נפוצים',
    level: 'beginner',
    orderIndex: 3,
    theoryContentHe: `
<h2>שמות תואר נפוצים</h2>

<div class="rules">
  <h3>גודל (Size):</h3>
  <ul>
    <li><strong>big / large</strong> (גדול), <strong>small / little</strong> (קטן)</li>
    <li><strong>tall</strong> (גבוה), <strong>short</strong> (נמוך)</li>
    <li><strong>long</strong> (ארוך), <strong>short</strong> (קצר)</li>
    <li><strong>wide</strong> (רחב), <strong>narrow</strong> (צר)</li>
  </ul>
</div>

<div class="rules">
  <h3>איכות (Quality):</h3>
  <ul>
    <li><strong>good</strong> (טוב), <strong>bad</strong> (רע)</li>
    <li><strong>beautiful</strong> (יפה), <strong>ugly</strong> (מכוער)</li>
    <li><strong>clean</strong> (נקי), <strong>dirty</strong> (מלוכלך)</li>
    <li><strong>new</strong> (חדש), <strong>old</strong> (ישן)</li>
    <li><strong>easy</strong> (קל), <strong>difficult / hard</strong> (קשה)</li>
  </ul>
</div>

<div class="rules">
  <h3>צבעים (Colors):</h3>
  <ul>
    <li><strong>red</strong> (אדום), <strong>blue</strong> (כחול), <strong>green</strong> (ירוק)</li>
    <li><strong>yellow</strong> (צהוב), <strong>black</strong> (שחור), <strong>white</strong> (לבן)</li>
    <li><strong>orange</strong> (כתום), <strong>purple</strong> (סגול), <strong>pink</strong> (ורוד)</li>
    <li><strong>brown</strong> (חום), <strong>gray</strong> (אפור)</li>
  </ul>
</div>

<div class="rules">
  <h3>רגשות (Feelings):</h3>
  <ul>
    <li><strong>happy</strong> (שמח), <strong>sad</strong> (עצוב)</li>
    <li><strong>angry</strong> (כועס), <strong>calm</strong> (רגוע)</li>
    <li><strong>excited</strong> (נרגש), <strong>bored</strong> (משועמם)</li>
    <li><strong>tired</strong> (עייף), <strong>energetic</strong> (מלא אנרגיה)</li>
  </ul>
</div>

<div class="rules">
  <h3>טמפרטורה (Temperature):</h3>
  <ul>
    <li><strong>hot</strong> (חם), <strong>cold</strong> (קר)</li>
    <li><strong>warm</strong> (חמים), <strong>cool</strong> (צונן)</li>
  </ul>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'The house is _______ big. Is "big" gradable or extreme?',
        options: ['very, gradable', 'absolutely, extreme', 'completely, extreme', 'totally, extreme'],
        correctAnswer: 'very, gradable',
        explanationHe: 'תשובה נכונה: very, gradable - big הוא gradable adjective\nכלל: gradable adjectives (big, small, hot, cold) משתמשים עם very, really, quite, extremely\nשים לב: big יכול להיות בדרגות שונות: a bit big, quite big, very big, extremely big\nטעות נפוצה: להשתמש ב-absolutely עם gradable adjectives',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'The elephant is _______! Can I say "very huge"?',
        options: ['huge, no - use absolutely', 'huge, yes', 'very huge, yes', 'big, no'],
        correctAnswer: 'huge, no - use absolutely',
        explanationHe: 'תשובה נכונה: huge, no\nכלל: extreme adjectives (huge, tiny, excellent, terrible) לא משתמשים עם very\nשים לב: huge = very big כבר, אז אומרים "huge" או "absolutely huge"\nטעות נפוצה: להגיד "very huge" במקום "huge" או "absolutely huge"',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'The weather is _______ hot. I can\'t go outside. (boiling)',
        correctAnswer: 'boiling',
        explanationHe: 'תשובה נכונה: boiling - extreme adjective\nכלל: boiling = extremely hot, freezing = extremely cold (extreme adjectives)\nשים לב: boiling כבר מביע חום קיצוני, לא צריך very\nטעות נפוצה: להגיד "very boiling"',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'The movie was _______ good. Which intensifier is correct?',
        options: ['really, for gradable', 'absolutely, for gradable', 'completely, for gradable', 'totally good'],
        correctAnswer: 'really, for gradable',
        explanationHe: 'תשובה נכונה: really - עם gradable adjective\nכלל: good הוא gradable, אז משתמשים really, very, quite, extremely\nשים לב: really good, very good, quite good, extremely good\nטעות נפוצה: להשתמש ב-absolutely עם good',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'The performance was _______ excellent. Which is correct?',
        options: ['absolutely, for extreme', 'very, for extreme', 'really extremely', 'quite excellent'],
        correctAnswer: 'absolutely, for extreme',
        explanationHe: 'תשובה נכונה: absolutely - עם extreme adjective\nכלל: excellent הוא extreme adjective, משתמשים absolutely/completely\nשים לב: excellent = very good כבר, לא צריך very\nטעות נפוצה: להגיד "very excellent"',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'The room is _______ freezing. Can I use "very"? (yes/no)',
        correctAnswer: 'absolutely, no',
        explanationHe: 'תשובה נכונה: absolutely, no\nכלל: freezing הוא extreme adjective, לא לוקח very\nשים לב: freezing = very cold, אז "absolutely freezing" או סתם "freezing"\nטעות נפוצה: להגיד "very freezing"',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'I have a _______ car. What collocation is common?',
        options: ['fast car', 'quick car', 'speedy car', 'rapid car'],
        correctAnswer: 'fast car',
        explanationHe: 'תשובה נכונה: fast car - collocation נפוצה\nכלל: collocations הם צירופים נפוצים של מילים שהולכות ביחד\nשים לב: fast car (נפוץ), quick car (פחות נפוץ)\nטעות נפוצה: להשתמש במילים נרדפות שלא מקובלות בצירוף מסוים',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'fill_in_blank',
        questionTextHe: 'We had a _______ meal at the restaurant. (delicious)',
        correctAnswer: 'delicious',
        explanationHe: 'תשובה נכונה: delicious - common collocation\nכלל: delicious meal, delicious food הם collocations נפוצות\nשים לב: delicious משתמשים עם אוכל (meal, food, dinner)\nטעות נפוצה: להשתמש ב-tasty במקומות פורמליים (delicious יותר פורמלי)',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'She made a _______ mistake. Is this formal or informal?',
        options: ['terrible, formal/informal', 'bad, only informal', 'awful, only informal', 'horrible, only formal'],
        correctAnswer: 'terrible, formal/informal',
        explanationHe: 'תשובה נכונה: terrible - works in both registers\nכלל: terrible הוא extreme adjective שעובד בפורמלי ובלתי פורמלי\nשים לב: bad mistake (gradable), terrible mistake (extreme)\nטעות נפוצה: לא להבחין בין רגיסטרים שונים',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'It\'s _______ cold outside. Choose gradable adjective + intensifier.',
        options: ['quite cold', 'absolutely cold', 'completely cold', 'totally cold'],
        correctAnswer: 'quite cold',
        explanationHe: 'תשובה נכונה: quite cold - gradable adjective\nכלל: cold הוא gradable, אז quite, very, really, extremely\nשים לב: quite = די, moderately; very = מאוד; extremely = במיוחד\nטעות נפוצה: להשתמש ב-absolutely עם cold במקום freezing',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'fill_in_blank',
        questionTextHe: 'The test was _______ difficult. Use gradable intensifier. (extremely)',
        correctAnswer: 'extremely',
        explanationHe: 'תשובה נכונה: extremely - חיזוק חזק לגראדייבל\nכלל: extremely משמש עם gradable adjectives לחיזוק חזק מאוד\nשים לב: extremely = יותר חזק מ-very\nטעות נפוצה: לחשוב ש-extremely רק ל-extreme adjectives',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: 'The house is _______ tiny. What\'s the best option?',
        options: ['absolutely tiny', 'very tiny', 'quite tiny', 'really tiny'],
        correctAnswer: 'absolutely tiny',
        explanationHe: 'תשובה נכונה: absolutely tiny\nכלל: tiny הוא extreme adjective (= very small), לוקח absolutely\nשים לב: tiny כבר אומר very small, לכן absolutely/completely\nטעות נפוצה: להגיד "very tiny"',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'This is a _______ important meeting. Choose the right collocation.',
        options: ['very important meeting', 'big important meeting', 'large important meeting', 'huge important meeting'],
        correctAnswer: 'very important meeting',
        explanationHe: 'תשובה נכונה: very important meeting\nכלל: important הוא gradable adjective, משתמשים עם very\nשים לב: very important (נפוץ), extremely important (חזק יותר)\nטעות נפוצה: להשתמש ב-big/large עם important',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'fill_in_blank',
        questionTextHe: 'The film was _______ boring. It was terrible! (absolutely)',
        correctAnswer: 'absolutely',
        explanationHe: 'תשובה נכונה: absolutely\nכלל: boring כגראדייבל לוקח very, אבל כשאומרים "terrible" זה extreme\nשים לב: "very boring" = משעמם מאוד, "absolutely boring" = קיצוני\nטעות נפוצה: לא להבין מתי boring הוא gradable ומתי נתפס כקיצוני',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'I need some _______ water. What\'s the common collocation?',
        options: ['cold water', 'frigid water', 'freezing water', 'icy water'],
        correctAnswer: 'cold water',
        explanationHe: 'תשובה נכונה: cold water - most common\nכלל: cold water היא הקולוקיישן הכי נפוצה לשימוש יומיומי\nשים לב: cold (נפוץ), icy (קר מאוד), freezing (קיצוני)\nטעות נפוצה: להשתמש במילים יותר קיצוניות בהקשר יומיומי',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'The view is _______ beautiful. Which sounds most natural?',
        options: ['really beautiful', 'absolutely beautiful', 'very beautiful', 'all are correct'],
        correctAnswer: 'all are correct',
        explanationHe: 'תשובה נכונה: all are correct\nכלל: beautiful יכול להיות gradable או extreme לפי הקונטקסט\nשים לב: very/really beautiful (gradable), absolutely beautiful (extreme)\nטעות נפוצה: לחשוב שיש רק דרך אחת נכונה',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'fill_in_blank',
        questionTextHe: 'She is a _______ smart student. Use gradable intensifier. (very)',
        correctAnswer: 'very',
        explanationHe: 'תשובה נכונה: very\nכלל: smart הוא gradable adjective\nשים לב: very smart, quite smart, extremely smart\nטעות נפוצה: להשתמש ב-absolutely עם smart',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'The food was _______ awful. Is awful gradable or extreme?',
        options: ['absolutely, extreme', 'very, gradable', 'quite, gradable', 'really, gradable'],
        correctAnswer: 'absolutely, extreme',
        explanationHe: 'תשובה נכונה: absolutely, extreme\nכלל: awful הוא extreme adjective (= very bad)\nשים לב: awful כבר אומר very bad, לכן absolutely/completely\nטעות נפוצה: להגיד "very awful"',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'This is _______ the best restaurant in town. Which word fits?',
        options: ['absolutely', 'very', 'quite', 'really much'],
        correctAnswer: 'absolutely',
        explanationHe: 'תשובה נכונה: absolutely\nכלל: "the best" הוא superlative, משתמשים עם absolutely\nשים לב: absolutely the best, by far the best\nטעות נפוצה: להגיד "very the best"',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'fill_in_blank',
        questionTextHe: 'The coffee is _______ hot. Be careful! (pretty)',
        correctAnswer: 'pretty',
        explanationHe: 'תשובה נכונה: pretty - informal intensifier\nכלל: pretty משמש כ-intensifier לא פורמלי (= quite, fairly)\nשים לב: pretty hot = די חם (לא פורמלי), very hot (יותר פורמלי)\nטעות נפוצה: להשתמש ב-pretty בכתיבה פורמלית',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 8.4: Opposite Pairs ====================
  {
    topicNumber: 8,
    subtopicNumber: '8.4',
    titleEn: 'Opposite Adjectives Pairs',
    titleHe: 'זוגות ניגודים',
    level: 'intermediate',
    orderIndex: 4,
    theoryContentHe: `
<h2>זוגות שמות תואר נגדיים</h2>

<p>כל שם תואר יש לו הפוך. חשוב ללמוד אותם בזוגות!</p>

<div class="rules">
  <h3>גודל ומשקל:</h3>
  <ul>
    <li><strong>big</strong> ↔ <strong>small</strong> (גדול ↔ קטן)</li>
    <li><strong>tall</strong> ↔ <strong>short</strong> (גבוה ↔ נמוך)</li>
    <li><strong>long</strong> ↔ <strong>short</strong> (ארוך ↔ קצר)</li>
    <li><strong>fat</strong> ↔ <strong>thin</strong> (שמן ↔ רזה)</li>
    <li><strong>heavy</strong> ↔ <strong>light</strong> (כבד ↔ קל)</li>
  </ul>
</div>

<div class="rules">
  <h3>מהירות וטמפרטורה:</h3>
  <ul>
    <li><strong>fast</strong> ↔ <strong>slow</strong> (מהיר ↔ איטי)</li>
    <li><strong>hot</strong> ↔ <strong>cold</strong> (חם ↔ קר)</li>
    <li><strong>young</strong> ↔ <strong>old</strong> (צעיר ↔ זקן)</li>
    <li><strong>new</strong> ↔ <strong>old</strong> (חדש ↔ ישן)</li>
  </ul>
</div>

<div class="rules">
  <h3>איכות ורגשות:</h3>
  <ul>
    <li><strong>clean</strong> ↔ <strong>dirty</strong> (נקי ↔ מלוכלך)</li>
    <li><strong>easy</strong> ↔ <strong>difficult</strong> (קל ↔ קשה)</li>
    <li><strong>good</strong> ↔ <strong>bad</strong> (טוב ↔ רע)</li>
    <li><strong>happy</strong> ↔ <strong>sad</strong> (שמח ↔ עצוב)</li>
    <li><strong>beautiful</strong> ↔ <strong>ugly</strong> (יפה ↔ מכוער)</li>
    <li><strong>cheap</strong> ↔ <strong>expensive</strong> (זול ↔ יקר)</li>
    <li><strong>strong</strong> ↔ <strong>weak</strong> (חזק ↔ חלש)</li>
    <li><strong>full</strong> ↔ <strong>empty</strong> (מלא ↔ ריק)</li>
    <li><strong>right</strong> ↔ <strong>wrong</strong> (נכון ↔ לא נכון)</li>
  </ul>
</div>

<div class="warning">
  <strong>זכור:</strong> ללמוד שמות תואר בזוגות עוזר לזכור אותם יותר טוב!
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'The opposite of "happy" using prefix is:',
        options: ['unhappy', 'inhappy', 'dishappy', 'imhappy'],
        correctAnswer: 'unhappy',
        explanationHe: 'תשובה נכונה: unhappy - עם prefix un-\nכלל: prefix un- יוצר ניגוד (unhappy, unfair, unable)\nשים לב: happy → unhappy, not "inhappy" or "dishappy"\nטעות נפוצה: להשתמש ב-prefix לא נכון לפני המילה',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'What\'s the opposite of "possible"?',
        options: ['impossible', 'unpossible', 'dispossible', 'inpossible'],
        correctAnswer: 'impossible',
        explanationHe: 'תשובה נכונה: impossible - עם prefix im-\nכלל: לפני p, b, m משתמשים ב-im- (impossible, impolite, immature)\nשים לב: im- בא לפני p (possible → impossible)\nטעות נפוצה: להשתמש ב-un- במקום im- לפני p',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'The opposite of "legal" is _______. (illegal)',
        correctAnswer: 'illegal',
        explanationHe: 'תשובה נכונה: illegal - עם prefix il-\nכלל: לפני l משתמשים ב-il- (illegal, illogical, illegible)\nשים לב: legal → illegal, logical → illogical\nטעות נפוצה: להשתמש ב-un- במקום il- לפני l',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'The opposite of "regular" is:',
        options: ['irregular', 'unregular', 'disregular', 'inregular'],
        correctAnswer: 'irregular',
        explanationHe: 'תשובה נכונה: irregular - עם prefix ir-\nכלל: לפני r משתמשים ב-ir- (irregular, irresponsible, irrational)\nשים לב: regular → irregular, responsible → irresponsible\nטעות נפוצה: להשתמש ב-un- במקום ir- לפני r',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'What\'s the opposite of "honest"?',
        options: ['dishonest', 'unhonest', 'inhonest', 'imhonest'],
        correctAnswer: 'dishonest',
        explanationHe: 'תשובה נכונה: dishonest - עם prefix dis-\nכלל: dis- יוצר ניגוד (dishonest, disagree, dislike)\nשים לב: honest → dishonest, appear → disappear\nטעות נפוצה: להשתמש ב-un- במקום dis-',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'The opposite of "correct" is _______. (incorrect)',
        correctAnswer: 'incorrect',
        explanationHe: 'תשובה נכונה: incorrect - עם prefix in-\nכלל: in- הוא ה-prefix הכללי לניגוד (incorrect, incomplete, independent)\nשים לב: correct → incorrect, complete → incomplete\nטעות נפוצה: להשתמש ב-un- במקום in-',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'The opposite of "good" is irregular. What is it?',
        options: ['bad (irregular opposite)', 'ungood', 'ingood', 'disgood'],
        correctAnswer: 'bad (irregular opposite)',
        explanationHe: 'תשובה נכונה: bad - irregular opposite\nכלל: good/bad הם irregular opposites - לא משתמשים ב-prefix\nשים לב: good ↔ bad, beautiful ↔ ugly (irregular pairs)\nטעות נפוצה: לנסות להשתמש ב-prefix עם כל המילים',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'Which is the formal opposite of "poor"?',
        options: ['wealthy (formal)', 'rich (neutral)', 'not poor (informal)', 'all correct'],
        correctAnswer: 'all correct',
        explanationHe: 'תשובה נכונה: all correct - תלוי ברגיסטר\nכלל: יש opposites שונים לפי רמת הפורמליות\nשים לב: poor ↔ wealthy (פורמלי), poor ↔ rich (ניטרלי)\nטעות נפוצה: לא להבחין בין רגיסטרים שונים',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'He is tall. She is _______. (short)',
        correctAnswer: 'short',
        explanationHe: 'תשובה נכונה: short - opposite של tall\nכלל: tall ↔ short לגובה של אנשים\nשים לב: tall/short לאנשים, long/short למרחקים וזמנים\nטעות נפוצה: להשתמש ב-small במקום short לגובה',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'In the context "a _____ story" (opposite of long), which is correct?',
        options: ['short story (context-dependent)', 'small story', 'little story', 'tiny story'],
        correctAnswer: 'short story (context-dependent)',
        explanationHe: 'תשובה נכונה: short - תלוי הקשר\nכלל: opposites יכולים להשתנות לפי הקונטקסט\nשים לב: long story ↔ short story (זמן/אורך), לא "small story"\nטעות נפוצה: להשתמש באותו opposite בכל הקשר',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'What\'s the opposite of "beautiful"?',
        options: ['ugly (irregular)', 'unbeautiful', 'inbeautiful', 'disbeautiful'],
        correctAnswer: 'ugly (irregular)',
        explanationHe: 'תשובה נכונה: ugly - irregular opposite\nכלל: beautiful ↔ ugly אין prefix, זה irregular opposite\nשים לב: לא כל ההפכים נוצרים עם prefix\nטעות נפוצה: לנסות להוסיף prefix ל-beautiful',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'The movie is boring. The opposite is _______. (exciting)',
        correctAnswer: 'exciting',
        explanationHe: 'תשובה נכונה: exciting - near opposite\nכלל: boring ↔ interesting או boring ↔ exciting\nשים לב: יש כמה אפשרויות ל-opposites, תלוי בהקשר\nטעות נפוצה: לחשוב שיש רק opposite אחד אפשרי',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'I am optimistic. My friend is _______.',
        options: ['pessimistic', 'unoptimistic', 'inoptimistic', 'disoptimistic'],
        correctAnswer: 'pessimistic',
        explanationHe: 'תשובה נכונה: pessimistic - true opposite\nכלל: optimistic ↔ pessimistic (true opposites), לא prefix\nשים לב: יש זוגות של opposites ללא prefix (optimistic/pessimistic)\nטעות נפוצה: לנסות להוסיף prefix במקום להשתמש במילה אחרת',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'multiple_choice',
        questionTextHe: 'The water is deep. The opposite is _______.',
        options: ['shallow', 'undeep', 'low', 'short'],
        correctAnswer: 'shallow',
        explanationHe: 'תשובה נכונה: shallow - specific opposite\nכלל: deep ↔ shallow (למים ולעומק)\nשים לב: deep/shallow הם opposites ספציפיים למים ועומק\nטעות נפוצה: להשתמש ב-low או short במקום shallow',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'fill_in_blank',
        questionTextHe: 'The room is narrow. The opposite is _______. (wide)',
        correctAnswer: 'wide',
        explanationHe: 'תשובה נכונה: wide - opposite של narrow\nכלל: narrow ↔ wide (לרוחב)\nשים לב: wide/narrow לרוחב, long/short לאורך\nטעות נפוצה: להשתמש ב-big במקום wide',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'In comparison: "He is faster _______ me."',
        options: ['than (comparison with opposite)', 'then', 'from', 'that'],
        correctAnswer: 'than (comparison with opposite)',
        explanationHe: 'תשובה נכונה: than - בהשוואה\nכלל: כשמשווים opposites משתמשים ב-than (faster than, slower than)\nשים לב: comparative + than (faster than, not "faster then")\nטעות נפוצה: לבלבל בין than (השוואה) ל-then (זמן)',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'The adjective "negative" has no positive form. True or false?',
        options: ['True - negative is the adjective', 'False - positive exists', 'False - unnegative', 'False - innegative'],
        correctAnswer: 'True - negative is the adjective',
        explanationHe: 'תשובה נכונה: True\nכלל: יש adjectives שאין להם opposite עם positive pair (negative, absent)\nשים לב: negative הוא שם תואר, positive (חיובי) הוא ההפך, אבל negative לא prefix\nטעות נפוצה: לחשוב שכל negative adjective יש לו positive pair',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'The opposite of "polite" is _______. (impolite)',
        correctAnswer: 'impolite',
        explanationHe: 'תשובה נכונה: impolite - עם im- לפני p\nכלל: polite → impolite (im- לפני p)\nשים לב: polite גם יכול להיות rude (irregular opposite)\nטעות נפוצה: להגיד "unpolite" במקום "impolite"',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'Which opposite pair is context-dependent?',
        options: ['hot/cold (can be warm/cool in context)', 'black/white', 'dead/alive', 'married/single'],
        correctAnswer: 'hot/cold (can be warm/cool in context)',
        explanationHe: 'תשובה נכונה: hot/cold - תלוי הקשר\nכלל: hot ↔ cold (קיצוני), warm ↔ cool (מתון), תלוי בהקשר\nשים לב: לפעמים יש יותר מזוג opposites אחד, תלוי בעוצמה\nטעות נפוצה: לא להבחין בין דרגות שונות של opposites',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'The opposite of "expensive" using informal language:',
        options: ['cheap (neutral/informal)', 'inexpensive (formal)', 'affordable (formal)', 'all correct but different registers'],
        correctAnswer: 'all correct but different registers',
        explanationHe: 'תשובה נכונה: all correct - תלוי רגיסטר\nכלל: expensive ↔ cheap (ניטרלי), inexpensive/affordable (פורמלי יותר)\nשים לב: cheap יכול להיות נייטרלי או שלילי תלוי הקשר\nטעות נפוצה: לא להבחין בין רגיסטרים שונים של opposites',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 8.5: Adjective Order ====================
  {
    topicNumber: 8,
    subtopicNumber: '8.5',
    titleEn: 'Adjective Order',
    titleHe: 'סדר שמות התואר',
    level: 'advanced',
    orderIndex: 5,
    theoryContentHe: `
<h2>סדר שמות התואר לפני שם עצם</h2>

<p>כאשר יש יותר משם תואר אחד לפני שם עצם, יש סדר מסוים:</p>

<div class="rules">
  <h3>הסדר המלא:</h3>
  <p><strong>Opinion → Size → Age → Color → Origin → Material → Noun</strong></p>
  <p>(דעה → גודל → גיל → צבע → מקור → חומר → שם עצם)</p>
</div>

<div class="examples">
  <h3>דוגמאות מלאות:</h3>
  <ul>
    <li>a <strong>beautiful big old red Italian wooden</strong> table</li>
    <li>a <strong>nice small new blue American plastic</strong> toy</li>
    <li>a <strong>lovely little young brown</strong> dog</li>
  </ul>
</div>

<div class="rules">
  <h3>דפוסים נפוצים (לא צריך את כל הסדר):</h3>
  <ul>
    <li><strong>Opinion + Color:</strong> a beautiful blue dress</li>
    <li><strong>Size + Color:</strong> a big red car</li>
    <li><strong>Age + Color:</strong> an old green house</li>
    <li><strong>Number + Color + Noun:</strong> three yellow flowers</li>
    <li><strong>Opinion + Size:</strong> a lovely small dog</li>
  </ul>
</div>

<div class="examples">
  <h3>עוד דוגמאות:</h3>
  <p>a <strong>beautiful small</strong> garden - גינה קטנה ויפה</p>
  <p>an <strong>old red</strong> car - מכונית ישנה אדומה</p>
  <p>a <strong>nice big new</strong> house - בית חדש גדול ונחמד</p>
  <p><strong>three young black</strong> cats - שלושה חתולים שחורים צעירים</p>
</div>

<div class="warning">
  <strong>טיפ:</strong> לרוב לא משתמשים ביותר מ-2-3 שמות תואר ביחד
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'a _______ _______ car. What comes first: opinion or size?',
        options: ['lovely big (opinion first)', 'big lovely (size first)', 'both correct', 'neither correct'],
        correctAnswer: 'lovely big (opinion first)',
        explanationHe: 'תשובה נכונה: lovely big - Opinion לפני Size\nכלל: OSASCOMP - Opinion, Size, Age, Shape, Color, Origin, Material, Purpose\nשים לב: lovely (opinion) → big (size)\nטעות נפוצה: לשים Size לפני Opinion',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'a _______ _______ table. Size or Age first?',
        options: ['big old (size first)', 'old big (age first)', 'both work', 'neither works'],
        correctAnswer: 'big old (size first)',
        explanationHe: 'תשובה נכונה: big old - Size לפני Age\nכלל: בסדר OSASCOMP, Size בא לפני Age\nשים לב: big (size) → old (age)\nטעות נפוצה: לשים Age לפני Size',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'an _______ _______ box. Shape or Color first? (round, red)',
        correctAnswer: 'round red',
        explanationHe: 'תשובה נכונה: round red - Shape לפני Color\nכלל: Shape בא לפני Color ב-OSASCOMP\nשים לב: round (shape) → red (color)\nטעות נפוצה: לשים Color לפני Shape',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'a _______ _______ car. Color or Origin first?',
        options: ['red Italian (color first)', 'Italian red (origin first)', 'both correct', 'neither correct'],
        correctAnswer: 'red Italian (color first)',
        explanationHe: 'תשובה נכונה: red Italian - Color לפני Origin\nכלל: Color בא לפני Origin ב-OSASCOMP\nשים לב: red (color) → Italian (origin)\nטעות נפוצה: לשים Origin לפני Color',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'a _______ _______ door. Origin or Material first?',
        options: ['French wooden (origin first)', 'wooden French (material first)', 'both work', 'neither works'],
        correctAnswer: 'French wooden (origin first)',
        explanationHe: 'תשובה נכונה: French wooden - Origin לפני Material\nכלל: Origin בא לפני Material ב-OSASCOMP\nשים לב: French (origin) → wooden (material)\nטעות נפוצה: לשים Material לפני Origin',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'a _______ _______ bag. Material or Purpose first? (leather, shopping)',
        correctAnswer: 'leather shopping',
        explanationHe: 'תשובה נכונה: leather shopping - Material לפני Purpose\nכלל: Material בא לפני Purpose (האחרון ב-OSASCOMP)\nשים לב: leather (material) → shopping (purpose)\nטעות נפוצה: לשים Purpose לפני Material',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'three _______ _______ _______ cars. Put in order: new, big, red',
        options: ['big new red', 'new big red', 'red big new', 'big red new'],
        correctAnswer: 'big new red',
        explanationHe: 'תשובה נכונה: big new red - Size, Age, Color\nכלל: הסדר בין Size (big), Age (new), Color (red)\nשים לב: number → size → age → color\nטעות נפוצה: לשים Color או Age לפני Size',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'a _______ _______ _______ house. Order: wooden, big, old',
        options: ['big old wooden', 'old big wooden', 'wooden old big', 'big wooden old'],
        correctAnswer: 'big old wooden',
        explanationHe: 'תשובה נכונה: big old wooden - Size, Age, Material\nכלל: Size → Age → Material\nשים לב: wooden (material) בא אחרון\nטעות נפוצה: לשים Material לא במקום האחרון',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'a _______, _______ dress. Do we need comma? (beautiful, expensive)',
        correctAnswer: 'beautiful, expensive',
        explanationHe: 'תשובה נכונה: beautiful, expensive - עם פסיק\nכלל: coordinate adjectives (שני opinions) צריכים פסיק ביניהם\nשים לב: שני adjectives מאותה קטגוריה (opinion) = coordinate = צריך פסיק\nטעות נפוצה: לא לשים פסיק בין coordinate adjectives',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'a big red car. Do we need comma between big and red?',
        options: ['No comma (cumulative adjectives)', 'Yes comma (coordinate adjectives)', 'Optional', 'Always use comma'],
        correctAnswer: 'No comma (cumulative adjectives)',
        explanationHe: 'תשובה נכונה: No comma - cumulative adjectives\nכלל: cumulative adjectives (קטגוריות שונות) לא צריכים פסיק\nשים לב: big (size) ו-red (color) = קטגוריות שונות = cumulative = ללא פסיק\nטעות נפוצה: לשים פסיק בין כל ה-adjectives',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'a _______ _______ _______ _______ table. Order: Italian, beautiful, round, old',
        options: ['beautiful old round Italian', 'old beautiful round Italian', 'beautiful round old Italian', 'Italian old round beautiful'],
        correctAnswer: 'beautiful old round Italian',
        explanationHe: 'תשובה נכונה: beautiful old round Italian\nכלל: Opinion → Age → Shape → Origin\nשים לב: beautiful (O) → old (A) → round (S) → Italian (O)\nטעות נפוצה: לא לעקוב אחרי סדר OSASCOMP',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'two _______ _______ _______ _______ bags. Order: blue, big, new, cotton (number given)',
        correctAnswer: 'big new blue cotton',
        explanationHe: 'תשובה נכונה: big new blue cotton\nכלל: number → Size → Age → Color → Material\nשים לב: two (number) + big (S) + new (A) + blue (C) + cotton (M)\nטעות נפוצה: לשכוח שמספר בא ראשון',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'Which is a fixed expression that doesn\'t follow the order rule?',
        options: ['a big bad wolf', 'a big red car', 'a small old house', 'a nice new bag'],
        correctAnswer: 'a big bad wolf',
        explanationHe: 'תשובה נכונה: a big bad wolf - fixed expression\nכלל: יש ביטויים קבועים שלא עוקבים אחרי הכלל\nשים לב: "big bad wolf" הוא ביטוי קבוע, לא "bad big wolf"\nטעות נפוצה: לנסות לתקן fixed expressions',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'multiple_choice',
        questionTextHe: 'a _______ _______ _______ car. Order: racing, red, Italian',
        options: ['red Italian racing', 'Italian red racing', 'racing red Italian', 'red racing Italian'],
        correctAnswer: 'red Italian racing',
        explanationHe: 'תשובה נכונה: red Italian racing\nכלל: Color → Origin → Material → Purpose\nשים לב: red (color) → Italian (origin) → racing (purpose)\nטעות נפוצה: לשים Purpose לא במקום האחרון',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'fill_in_blank',
        questionTextHe: 'a _______, _______, _______ woman. Three opinions need commas. (smart, beautiful, kind)',
        correctAnswer: 'smart, beautiful, kind',
        explanationHe: 'תשובה נכונה: smart, beautiful, kind - עם פסיקים\nכלל: שלושה coordinate adjectives (opinions) צריכים פסיקים\nשים לב: כל שלושת המילים הן opinions, לכן coordinate adjectives\nטעות נפוצה: לא לשים פסיקים בין coordinate adjectives',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'Native speakers often say "a nice big house". Why not "a big nice house"?',
        options: ['Opinion before Size (natural pattern)', 'Size before Opinion', 'Both equally common', 'Random choice'],
        correctAnswer: 'Opinion before Size (natural pattern)',
        explanationHe: 'תשובה נכונה: Opinion before Size\nכלל: Native speakers עוקבים אחרי ה-order באופן טבעי\nשים לב: nice (opinion) → big (size) נשמע טבעי יותר\nטעות נפוצה: לא להבין למה דפוס מסוים נשמע טבעי יותר',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'Correct the error: "She bought Italian beautiful old shoes."',
        options: ['beautiful old Italian shoes', 'old beautiful Italian shoes', 'Italian old beautiful shoes', 'beautiful Italian old shoes'],
        correctAnswer: 'beautiful old Italian shoes',
        explanationHe: 'תשובה נכונה: beautiful old Italian shoes\nכלל: Opinion → Age → Origin\nשים לב: beautiful (opinion) → old (age) → Italian (origin)\nטעות נפוצה: לשים Origin לפני Age או Opinion',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'a _______ _______ _______ chair. Order: comfortable, wooden, old',
        correctAnswer: 'comfortable old wooden',
        explanationHe: 'תשובה נכונה: comfortable old wooden\nכלל: Opinion → Age → Material\nשים לב: comfortable (opinion) → old (age) → wooden (material)\nטעות נפוצה: לשים Material לפני Age',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'How many adjectives do native speakers typically use together?',
        options: ['2-3 adjectives maximum', '5-6 adjectives', 'As many as possible', 'Always exactly 2'],
        correctAnswer: '2-3 adjectives maximum',
        explanationHe: 'תשובה נכונה: 2-3 maximum\nכלל: native speakers לרוב לא משתמשים ביותר מ-2-3 adjectives ביחד\nשים לב: למרות שיש 7 קטגוריות, לא משתמשים בכולן בבת אחת\nטעות נפוצה: להשתמש ביותר מדי adjectives ביחד',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'Which uses the natural adjective order: "a small round green badge" or "a green small round badge"?',
        options: ['small round green (Size-Shape-Color)', 'green small round', 'Both sound natural', 'Neither is correct'],
        correctAnswer: 'small round green (Size-Shape-Color)',
        explanationHe: 'תשובה נכונה: small round green\nכלל: Size → Shape → Color בסדר הטבעי\nשים לב: small (size) → round (shape) → green (color)\nטעות נפוצה: לשים Color לפני Size או Shape',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 8.6: -ed vs -ing Adjectives ====================
  {
    topicNumber: 8,
    subtopicNumber: '8.6',
    titleEn: '-ed vs -ing Adjectives',
    titleHe: 'תארים עם -ed ו -ing',
    level: 'advanced',
    orderIndex: 6,
    theoryContentHe: `
<h2>שמות תואר עם -ed לעומת -ing</h2>

<p>יש שמות תואר שבאים בשתי צורות ויש להם משמעות שונה!</p>

<div class="rules">
  <h3>-ED adjectives: מתארים איך אתה מרגיש</h3>
  <p>מתארים את הרגש של האדם או החיה</p>
  <ul>
    <li>I am <strong>bored</strong>. - אני משועמם</li>
    <li>She is <strong>tired</strong>. - היא עייפה</li>
    <li>He is <strong>excited</strong>. - הוא נרגש</li>
    <li>They are <strong>interested</strong>. - הם מעוניינים</li>
    <li>We are <strong>surprised</strong>. - אנחנו מופתעים</li>
  </ul>
</div>

<div class="rules">
  <h3>-ING adjectives: מתארים מה גורם להרגשה</h3>
  <p>מתארים את הדבר שגורם לרגש</p>
  <ul>
    <li>The movie is <strong>boring</strong>. - הסרט משעמם</li>
    <li>The work is <strong>tiring</strong>. - העבודה מעייפת</li>
    <li>The game is <strong>exciting</strong>. - המשחק מרגש</li>
    <li>The book is <strong>interesting</strong>. - הספר מעניין</li>
    <li>The news is <strong>surprising</strong>. - החדשות מפתיעות</li>
  </ul>
</div>

<div class="examples">
  <h3>זוגות נפוצים:</h3>
  <ul>
    <li><strong>bored / boring</strong> (משועמם / משעמם)</li>
    <li><strong>tired / tiring</strong> (עייף / מעייף)</li>
    <li><strong>excited / exciting</strong> (נרגש / מרגש)</li>
    <li><strong>interested / interesting</strong> (מעוניין / מעניין)</li>
    <li><strong>surprised / surprising</strong> (מופתע / מפתיע)</li>
    <li><strong>worried / worrying</strong> (מודאג / מדאיג)</li>
    <li><strong>confused / confusing</strong> (מבולבל / מבלבל)</li>
    <li><strong>amazed / amazing</strong> (נדהם / מדהים)</li>
  </ul>
</div>

<div class="warning">
  <strong>זכור:</strong><br>
  -ED = איך אני מרגיש (I am bored)<br>
  -ING = מה גורם להרגשה (The movie is boring)
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'I feel _______. The book is _______. Which pair is correct?',
        options: ['bored, boring', 'boring, bored', 'bored, bored', 'boring, boring'],
        correctAnswer: 'bored, boring',
        explanationHe: 'תשובה נכונה: bored, boring\nכלל: -ed לרגש האדם (איך אני מרגיש), -ing לגורם (מה גורם לרגש)\nשים לב: I feel bored (אני משועמם), the book is boring (הספר משעמם)\nטעות נפוצה: לבלבל בין -ed ו-ing',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'The lecture was _______. I was _______.',
        options: ['interesting, interested', 'interested, interesting', 'interesting, interesting', 'interested, interested'],
        correctAnswer: 'interesting, interested',
        explanationHe: 'תשובה נכונה: interesting, interested\nכלל: -ing מתאר את ההרצאה (גורם), -ed מתאר אותי (רגש)\nשים לב: The lecture is interesting (מעניינת), I am interested (מעוניין)\nטעות נפוצה: להשתמש באותו סיום לשניהם',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'fill_in_blank',
        questionTextHe: 'The students are _______ because the teacher is _______. (confuse)',
        correctAnswer: 'confused, confusing',
        explanationHe: 'תשובה נכונה: confused, confusing\nכלל: students מרגישים (confused), teacher גורם (confusing)\nשים לב: -ed למי שמרגיש, -ing למי שגורם\nטעות נפוצה: להפוך בין מי מרגיש למי גורם',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'Which sentence shows the correct understanding of participial adjectives?',
        options: ['The frightening movie made me frightened', 'The frightened movie made me frightening', 'Both are correct', 'Neither is correct'],
        correctAnswer: 'The frightening movie made me frightened',
        explanationHe: 'תשובה נכונה: frightening movie, frightened me\nכלל: movie גורם לפחד (frightening), I מרגיש פחד (frightened)\nשים לב: frightening = מפחיד, frightened = מפוחד\nטעות נפוצה: להשתמש ב-frightened לסרט',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'She is _______. She just heard _______ news.',
        options: ['excited, exciting', 'exciting, excited', 'excited, excited', 'exciting, exciting'],
        correctAnswer: 'excited, exciting',
        explanationHe: 'תשובה נכונה: excited, exciting\nכלל: She מרגישה (excited), news גורמות (exciting)\nשים לב: excited = נרגשת, exciting = מרגשות\nטעות נפוצה: לשים -ed גם לחדשות',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'fill_in_blank',
        questionTextHe: 'The children are _______. The clown is _______. (amuse)',
        correctAnswer: 'amused, amusing',
        explanationHe: 'תשובה נכונה: amused, amusing\nכלל: children מרגישים שעשוע (amused), clown משעשע (amusing)\nשים לב: -ed לילדים שנהנים, -ing ללייצן שמשעשע\nטעות נפוצה: להשתמש באותו סיום לשניהם',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'The test results were _______. We were all _______.',
        options: ['disappointing, disappointed', 'disappointed, disappointing', 'disappointing, disappointing', 'disappointed, disappointed'],
        correctAnswer: 'disappointing, disappointed',
        explanationHe: 'תשובה נכונה: disappointing, disappointed\nכלל: results גורמות לאכזבה (disappointing), we מאוכזבים (disappointed)\nשים לב: disappointing = מאכזבות, disappointed = מאוכזבים\nטעות נפוצה: להשתמש ב-disappointed לתוצאות',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'Context clue: "The _______ dog barked loudly" (dog causes fear)',
        options: ['frightening', 'frightened', 'fright', 'frighten'],
        correctAnswer: 'frightening',
        explanationHe: 'תשובה נכונה: frightening - הכלב גורם לפחד\nכלל: כשהנושא גורם לרגש, משתמשים ב-ing\nשים לב: the frightening dog = הכלב המפחיד (גורם לפחד)\nטעות נפוצה: להשתמש ב-frightened כשהכלב גורם לפחד',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'fill_in_blank',
        questionTextHe: 'I am _______ by the _______ story. (fascinate)',
        correctAnswer: 'fascinated, fascinating',
        explanationHe: 'תשובה נכונה: fascinated, fascinating\nכלל: I מרותק (fascinated), story מרתקת (fascinating)\nשים לב: fascinated by = מרותק מ-, fascinating = מרתק\nטעות נפוצה: להשתמש ב-fascinating לתיאור הרגש האישי',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'Advanced pair: The _______ experience left me _______.',
        options: ['terrifying, terrified', 'terrified, terrifying', 'terrifying, terrifying', 'terrified, terrified'],
        correctAnswer: 'terrifying, terrified',
        explanationHe: 'תשובה נכונה: terrifying, terrified\nכלל: experience גורמת לפחד (terrifying), me מפוחד (terrified)\nשים לב: terrifying = מטריף, terrified = מבועת\nטעות נפוצה: לשים -ed לחוויה',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'Mixed usage: The movie is _______, but I am not _______.',
        options: ['boring, bored', 'bored, boring', 'boring, boring', 'bored, bored'],
        correctAnswer: 'boring, bored',
        explanationHe: 'תשובה נכונה: boring, bored\nכלל: movie משעמם (boring), I לא משועמם (not bored)\nשים לב: גם במשפט שלילי, ההיגיון זהה: -ing לגורם, -ed לרגש\nטעות נפוצה: להשתמש ב-boring לשניהם',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'fill_in_blank',
        questionTextHe: 'The _______ news made everyone _______. (shock)',
        correctAnswer: 'shocking, shocked',
        explanationHe: 'תשובה נכונה: shocking, shocked\nכלל: news מזעזעות (shocking), everyone מזועזעים (shocked)\nשים לב: shocking = מזעזע, shocked = מזועזע/מופתע\nטעות נפוצה: להשתמש ב-shocked לחדשות',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'Subject-dependent: If I describe how I feel, I use _______. If I describe the book, I use _______.',
        options: ['bored, boring', 'boring, bored', 'bored, bored', 'boring, boring'],
        correctAnswer: 'bored, boring',
        explanationHe: 'תשובה נכונה: bored, boring - תלוי בנושא\nכלל: תלוי מי הנושא - אם אני (רגש) = -ed, אם דבר (גורם) = -ing\nשים לב: I am bored (רגש), The book is boring (גורם)\nטעות נפוצה: לא לשים לב מי הנושא במשפט',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'multiple_choice',
        questionTextHe: 'The hike was _______. By the end, we were all _______.',
        options: ['exhausting, exhausted', 'exhausted, exhausting', 'exhausting, exhausting', 'exhausted, exhausted'],
        correctAnswer: 'exhausting, exhausted',
        explanationHe: 'תשובה נכונה: exhausting, exhausted\nכלל: hike מתישה (exhausting), we מותשים (exhausted)\nשים לב: exhausting = מתיש, exhausted = מותש\nטעות נפוצה: להשתמש ב-exhausted להליכה',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'fill_in_blank',
        questionTextHe: 'She finds math _______. She is never _______ in class. (bore)',
        correctAnswer: 'boring, bored',
        explanationHe: 'תשובה נכונה: boring, bored\nכלל: math משעממת (boring), she לא משועממת (bored)\nשים לב: "finds math boring" = מוצאת את המתמטיקה משעממת\nטעות נפוצה: להשתמש ב-bored לתיאור המתמטיקה',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'Advanced: The _______ performance left the audience _______.',
        options: ['captivating, captivated', 'captivated, captivating', 'captivating, captivating', 'captivated, captivated'],
        correctAnswer: 'captivating, captivated',
        explanationHe: 'תשובה נכונה: captivating, captivated\nכלל: performance כובשת (captivating), audience כבוש (captivated)\nשים לב: captivating = כובש לב, captivated = כבוש/מוקסם\nטעות נפוצה: להשתמש ב-captivated להופעה',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'Context clue: "I was _______ by the magic trick" (I experienced the feeling)',
        options: ['amazed', 'amazing', 'amaze', 'amazement'],
        correctAnswer: 'amazed',
        explanationHe: 'תשובה נכונה: amazed - אני חוויתי את ההפתעה\nכלל: כשמתארים את הרגש שחוויתי, משתמשים ב-ed\nשים לב: I was amazed = הייתי נדהם, the trick was amazing = הטריק היה מדהים\nטעות נפוצה: להשתמש ב-amazing כשמתארים את הרגש האישי',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'fill_in_blank',
        questionTextHe: 'The situation is _______. Everyone is _______. (worry)',
        correctAnswer: 'worrying, worried',
        explanationHe: 'תשובה נכונה: worrying, worried\nכלל: situation מדאיגה (worrying), everyone מודאגים (worried)\nשים לב: worrying = מדאיג, worried = מודאג\nטעות נפוצה: להשתמש ב-worried למצב',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'Common pair: Science is _______. I am _______ in it.',
        options: ['interesting, interested', 'interested, interesting', 'interesting, interesting', 'interested, interested'],
        correctAnswer: 'interesting, interested',
        explanationHe: 'תשובה נכונה: interesting, interested\nכלל: Science מעניין (interesting), I מעוניין (interested)\nשים לב: השימוש הנפוץ: interested in something (מעוניין במשהו)\nטעות נפוצה: להשתמש ב-interesting כשאומרים "I am interesting" (משמעו שאני מעניין לאחרים)',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'Error correction: "The instructions were very confused." What\'s wrong?',
        options: ['Should be confusing (instructions cause confusion)', 'Should be confuse', 'Nothing wrong', 'Should be confusion'],
        correctAnswer: 'Should be confusing (instructions cause confusion)',
        explanationHe: 'תשובה נכונה: confusing - ההוראות גורמות לבלבול\nכלל: instructions גורמות לבלבול (confusing), לא מרגישות בלבול (confused)\nשים לב: "confused instructions" = שגוי, "confusing instructions" = נכון\nטעות נפוצה: להשתמש ב-confused לדברים שגורמים לבלבול',
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SUBTOPIC 8.7: Common Mistakes ====================
  {
    topicNumber: 8,
    subtopicNumber: '8.7',
    titleEn: 'Common Mistakes',
    titleHe: 'טעויות נפוצות',
    level: 'beginner',
    orderIndex: 7,
    theoryContentHe: `
<h2>טעויות נפוצות עם שמות תואר</h2>

<div class="examples">
  <h3>1. שם תואר במקום הלא נכון:</h3>
  <p>❌ <strong>שגוי:</strong> He is a <strong>boy tall</strong>.<br>
  ✅ <strong>נכון:</strong> He is a <strong>tall boy</strong>.</p>
  <p>❌ <strong>שגוי:</strong> This is <strong>car red</strong>.<br>
  ✅ <strong>נכון:</strong> This is a <strong>red car</strong>.</p>
  <p style="margin-right: 20px;">→ שם תואר תמיד לפני שם העצם באנגלית!</p>
</div>

<div class="examples">
  <h3>2. בלבול בין -ed ו -ing:</h3>
  <p>❌ <strong>שגוי:</strong> I am <strong>boring</strong>.<br>
  ✅ <strong>נכון:</strong> I am <strong>bored</strong>.</p>
  <p style="margin-right: 20px;">→ אני משועמם (boring = משעמם)</p>

  <p>❌ <strong>שגוי:</strong> The movie is <strong>bored</strong>.<br>
  ✅ <strong>נכון:</strong> The movie is <strong>boring</strong>.</p>
  <p style="margin-right: 20px;">→ הסרט משעמם (bored = משועמם)</p>
</div>

<div class="examples">
  <h3>3. הוספת "very" במקום הלא נכון:</h3>
  <p>❌ <strong>שגוי:</strong> She is a <strong>beautiful very</strong> girl.<br>
  ✅ <strong>נכון:</strong> She is a <strong>very beautiful</strong> girl.</p>
  <p style="margin-right: 20px;">→ very מגיע לפני שם התואר</p>
</div>

<div class="examples">
  <h3>4. סדר לא נכון של שמות תואר:</h3>
  <p>❌ <strong>שגוי:</strong> a <strong>red big</strong> car<br>
  ✅ <strong>נכון:</strong> a <strong>big red</strong> car</p>
  <p style="margin-right: 20px;">→ גודל לפני צבע</p>

  <p>❌ <strong>שגוי:</strong> <strong>childs happy</strong><br>
  ✅ <strong>נכון:</strong> <strong>happy children</strong></p>
  <p style="margin-right: 20px;">→ שם תואר לפני שם עצם</p>
</div>

<div class="examples">
  <h3>5. שכחת ה-article:</h3>
  <p>❌ <strong>שגוי:</strong> I have <strong>red book</strong>.<br>
  ✅ <strong>נכון:</strong> I have <strong>a red book</strong>.</p>
  <p>❌ <strong>שגוי:</strong> This is <strong>interesting book</strong>.<br>
  ✅ <strong>נכון:</strong> This is <strong>an interesting book</strong>.</p>
</div>

<div class="warning">
  <strong>זכור תמיד:</strong>
  <ul>
    <li>שם תואר לפני שם העצם (לא אחרי!)</li>
    <li>-ED = איך אני מרגיש</li>
    <li>-ING = מה גורם להרגשה</li>
    <li>very לפני שם התואר</li>
    <li>סדר: גודל → גיל → צבע</li>
  </ul>
</div>
    `,
    exercises: [
      {
        questionNumber: 1,
        type: 'multiple_choice',
        questionTextHe: 'Error: "I play tennis good." Correct it.',
        options: ['I play tennis well', 'I play tennis goodly', 'I play good tennis', 'I good play tennis'],
        correctAnswer: 'I play tennis well',
        explanationHe: 'תשובה נכונה: well - תואר פועל\nכלל: good = adjective, well = adverb (מתאר פעולות)\nשים לב: play (verb) צריך adverb (well), לא adjective (good)\nטעות נפוצה: להשתמש ב-good במקום well עם פעלים',
        difficulty: 'hard'
      },
      {
        questionNumber: 2,
        type: 'multiple_choice',
        questionTextHe: 'Error: "This is house big." Fix the adjective position.',
        options: ['This is a big house', 'This is big a house', 'Big this is a house', 'This big is a house'],
        correctAnswer: 'This is a big house',
        explanationHe: 'תשובה נכונה: a big house - attributive position\nכלל: adjective לפני noun באנגלית (a + adj + noun)\nשים לב: לא כמו בעברית שאומרים "בית גדול"\nטעות נפוצה: לשים adjective אחרי noun כמו בעברית',
        difficulty: 'hard'
      },
      {
        questionNumber: 3,
        type: 'multiple_choice',
        questionTextHe: 'Error: "I am very interesting in math." Correct the -ed/-ing mistake.',
        options: ['I am very interested in math', 'I am very interesting at math', 'I very interested in math', 'I interesting in math'],
        correctAnswer: 'I am very interested in math',
        explanationHe: 'תשובה נכונה: interested - איך אני מרגיש\nכלל: -ed לרגש האדם, -ing לגורם\nשים לב: I am interested (מעוניין), Math is interesting (מעניין)\nטעות נפוצה: להשתמש ב-interesting לתיאור הרגש האישי',
        difficulty: 'hard'
      },
      {
        questionNumber: 4,
        type: 'multiple_choice',
        questionTextHe: 'Error: "She has a red big car." Fix the adjective order.',
        options: ['She has a big red car', 'She has a red bigger car', 'She has big a red car', 'She a big red car has'],
        correctAnswer: 'She has a big red car',
        explanationHe: 'תשובה נכונה: big red car - Size לפני Color\nכלל: OSASCOMP order - Size בא לפני Color\nשים לב: big (size) → red (color)\nטעות נפוצה: לשים color לפני size',
        difficulty: 'hard'
      },
      {
        questionNumber: 5,
        type: 'multiple_choice',
        questionTextHe: 'Error: "The movie is very bored." Correct the -ed/-ing confusion.',
        options: ['The movie is very boring', 'The movie is very bore', 'The movie very bored', 'The bored movie is very'],
        correctAnswer: 'The movie is very boring',
        explanationHe: 'תשובה נכונה: boring - הסרט גורם לשעמום\nכלל: movie משעמם (boring), אנשים משועממים (bored)\nשים לב: הסרט לא מרגיש שעמום, הוא גורם לו\nטעות נפוצה: להשתמש ב-bored לסרט',
        difficulty: 'hard'
      },
      {
        questionNumber: 6,
        type: 'multiple_choice',
        questionTextHe: 'Error: "She is a beautiful very girl." Fix the intensifier position.',
        options: ['She is a very beautiful girl', 'She is very a beautiful girl', 'She a very beautiful girl is', 'Very she is a beautiful girl'],
        correctAnswer: 'She is a very beautiful girl',
        explanationHe: 'תשובה נכונה: very beautiful - very לפני adjective\nכלל: intensifier (very, really, quite) לפני adjective\nשים לב: very → adjective → noun\nטעות נפוצה: לשים very אחרי adjective',
        difficulty: 'hard'
      },
      {
        questionNumber: 7,
        type: 'multiple_choice',
        questionTextHe: 'Error: "They are childs happy." Fix both mistakes.',
        options: ['They are happy children', 'They are childs happy', 'They happy are childs', 'Happy they are childs'],
        correctAnswer: 'They are happy children',
        explanationHe: 'תשובה נכונה: happy children - שתי טעויות\nכלל: (1) adjective לפני noun, (2) childs → children (irregular plural)\nשים לב: happy (adjective) → children (correct plural)\nטעות נפוצה: סדר לא נכון + צורת רבים שגויה',
        difficulty: 'hard'
      },
      {
        questionNumber: 8,
        type: 'multiple_choice',
        questionTextHe: 'Error: "I have blue three pens." Correct the order.',
        options: ['I have three blue pens', 'I have blue pens three', 'I blue have three pens', 'Three blue I have pens'],
        correctAnswer: 'I have three blue pens',
        explanationHe: 'תשובה נכונה: three blue pens - number לפני color\nכלל: number → adjectives → noun\nשים לב: מספר תמיד בא ראשון\nטעות נפוצה: לשים color לפני number',
        difficulty: 'hard'
      },
      {
        questionNumber: 9,
        type: 'multiple_choice',
        questionTextHe: 'Error: "The dog afraid is." Fix the predicative adjective mistake.',
        options: ['The dog is afraid', 'The afraid dog is', 'The dog afraid', 'Is the dog afraid'],
        correctAnswer: 'The dog is afraid',
        explanationHe: 'תשובה נכונה: is afraid - afraid רק predicative\nכלל: afraid משתמשים רק אחרי linking verb\nשים לב: "The dog is afraid" (נכון), "an afraid dog" (שגוי)\nטעות נפוצה: סדר מילים לא נכון עם afraid',
        difficulty: 'hard'
      },
      {
        questionNumber: 10,
        type: 'multiple_choice',
        questionTextHe: 'Error: "This is very huge elephant." Fix the extreme adjective error.',
        options: ['This is a huge elephant', 'This is very huge elephant', 'This is a very huge elephant', 'This huge is a elephant'],
        correctAnswer: 'This is a huge elephant',
        explanationHe: 'תשובה נכונה: a huge elephant - ללא very\nכלל: extreme adjectives (huge, tiny) לא משתמשים עם very\nשים לב: huge = very big כבר, אז "huge" או "absolutely huge"\nטעות נפוצה: להגיד "very huge"',
        difficulty: 'hard'
      },
      {
        questionNumber: 11,
        type: 'multiple_choice',
        questionTextHe: 'Error: "I need special something." Fix the post-position error.',
        options: ['I need something special', 'I need special anything', 'I special need something', 'Special I need something'],
        correctAnswer: 'I need something special',
        explanationHe: 'תשובה נכונה: something special - adjective אחרי\nכלל: עם something/anything/nothing, adjective בא אחרי\nשים לב: something special (נכון), special something (שגוי)\nטעות נפוצה: לשמור על סדר רגיל עם indefinite pronouns',
        difficulty: 'hard'
      },
      {
        questionNumber: 12,
        type: 'multiple_choice',
        questionTextHe: 'Error: "The instructions were confused." Fix the -ed/-ing error.',
        options: ['The instructions were confusing', 'The instructions were confuse', 'The confused instructions were', 'Were the instructions confused'],
        correctAnswer: 'The instructions were confusing',
        explanationHe: 'תשובה נכונה: confusing - ההוראות גורמות לבלבול\nכלל: instructions גורמות לבלבול (confusing), אנשים מבולבלים (confused)\nשים לב: הדבר שגורם = -ing, האדם שמרגיש = -ed\nטעות נפוצה: להשתמש ב-confused לדברים שגורמים לבלבול',
        difficulty: 'hard'
      },
      {
        questionNumber: 13,
        type: 'multiple_choice',
        questionTextHe: 'Error: "She bought Italian old beautiful shoes." Fix the order.',
        options: ['She bought beautiful old Italian shoes', 'She bought old Italian beautiful shoes', 'She bought Italian beautiful old shoes', 'She bought shoes beautiful old Italian'],
        correctAnswer: 'She bought beautiful old Italian shoes',
        explanationHe: 'תשובה נכונה: beautiful old Italian - Opinion, Age, Origin\nכלל: OSASCOMP - Opinion → Age → Origin\nשים לב: beautiful (O) → old (A) → Italian (O)\nטעות נפוצה: לא לעקוב אחרי סדר OSASCOMP',
        difficulty: 'hard'
      },
      {
        questionNumber: 14,
        type: 'multiple_choice',
        questionTextHe: 'Error: "The soup tastes deliciously." Fix the linking verb error.',
        options: ['The soup tastes delicious', 'The soup tastes deliciousness', 'The soup taste deliciously', 'The deliciously soup tastes'],
        correctAnswer: 'The soup tastes delicious',
        explanationHe: 'תשובה נכונה: delicious - adjective אחרי linking verb\nכלל: linking verbs (taste, smell, feel, look) לוקחים adjectives\nשים לב: tastes delicious (adjective), לא deliciously (adverb)\nטעות נפוצה: להשתמש באדוורב אחרי linking verb',
        difficulty: 'hard'
      },
      {
        questionNumber: 15,
        type: 'multiple_choice',
        questionTextHe: 'Error: "I saw an asleep baby." Fix the attributive adjective error.',
        options: ['I saw a sleeping baby', 'I saw an asleep baby', 'I saw a baby asleep', 'Asleep I saw a baby'],
        correctAnswer: 'I saw a sleeping baby',
        explanationHe: 'תשובה נכונה: a sleeping baby\nכלל: asleep רק predicative, לא attributive. לפני noun משתמשים ב-sleeping\nשים לב: "a sleeping baby" או "the baby is asleep"\nטעות נפוצה: להשתמש ב-asleep לפני noun',
        difficulty: 'hard'
      },
      {
        questionNumber: 16,
        type: 'multiple_choice',
        questionTextHe: 'Error: "He runs very quick." Fix the adjective/adverb confusion.',
        options: ['He runs very quickly', 'He runs very quick', 'He very runs quick', 'Very quick he runs'],
        correctAnswer: 'He runs very quickly',
        explanationHe: 'תשובה נכונה: quickly - adverb\nכלל: runs (verb) צריך adverb (quickly), לא adjective (quick)\nשים לב: quick = adjective, quickly = adverb\nטעות נפוצה: להשתמש באדג\'קטיב במקום אדוורב עם פעלים',
        difficulty: 'hard'
      },
      {
        questionNumber: 17,
        type: 'multiple_choice',
        questionTextHe: 'Error: "They have wooden old nice house." Fix the adjective order.',
        options: ['They have a nice old wooden house', 'They have old nice wooden house', 'They have wooden nice old house', 'They have house nice old wooden'],
        correctAnswer: 'They have a nice old wooden house',
        explanationHe: 'תשובה נכונה: nice old wooden - Opinion, Age, Material\nכלל: Opinion → Age → Material (+ missing article "a")\nשים לב: nice (opinion) → old (age) → wooden (material)\nטעות נפוצה: סדר לא נכון + שכחת article',
        difficulty: 'hard'
      },
      {
        questionNumber: 18,
        type: 'multiple_choice',
        questionTextHe: 'Error: "I am boring when I study." Correct the -ed/-ing mistake.',
        options: ['I am bored when I study', 'I am bore when I study', 'I boring when I study', 'When I study am I boring'],
        correctAnswer: 'I am bored when I study',
        explanationHe: 'תשובה נכונה: bored - איך אני מרגיש\nכלל: "I am boring" = אני משעמם אחרים, "I am bored" = אני משועמם\nשים לב: bored = הרגש שלי, boring = אני גורם לשעמום לאחרים\nטעות נפוצה: להגיד "I am boring" כשמתכוונים "I am bored"',
        difficulty: 'hard'
      },
      {
        questionNumber: 19,
        type: 'multiple_choice',
        questionTextHe: 'Error: "She is a girl tall young." Fix all mistakes.',
        options: ['She is a tall young girl', 'She is a young tall girl', 'She is girl a tall young', 'Tall young she is a girl'],
        correctAnswer: 'She is a tall young girl',
        explanationHe: 'תשובה נכונה: tall young girl - Size לפני Age\nכלל: Size → Age → noun (adjectives לפני noun)\nשים לב: tall (size) → young (age) → girl\nטעות נפוצה: adjectives אחרי noun או סדר לא נכון',
        difficulty: 'hard'
      },
      {
        questionNumber: 20,
        type: 'multiple_choice',
        questionTextHe: 'Error: "The work is very exhausted." Fix the participial adjective error.',
        options: ['The work is very exhausting', 'The work is very exhaust', 'The work very exhausted', 'Very exhausted is the work'],
        correctAnswer: 'The work is very exhausting',
        explanationHe: 'תשובה נכונה: exhausting - העבודה גורמת למיצוי\nכלל: work (דבר) גורם למיצוי = exhausting, אדם מותש = exhausted\nשים לב: The work is exhausting, I am exhausted\nטעות נפוצה: להשתמש ב-exhausted לעבודה',
        difficulty: 'hard'
      }
    ]
  }
];

// Seed function
async function seedTopic9() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    console.log('Starting to seed Topic 8: Adjectives...');

    let totalExercises = 0;

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

      totalExercises += lessonData.exercises.length;
      console.log(`    Created ${lessonData.exercises.length} exercises`);
    }

    await client.query('COMMIT');
    console.log('✅ Topic 8: Adjectives seeded successfully!');
    console.log(`   Total: ${lessonsData.length} lessons, ${totalExercises} exercises created`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding Topic 9:', error);
    throw error;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  seedTopic9()
    .then(() => {
      console.log('Seeding complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedTopic9, lessonsData };
