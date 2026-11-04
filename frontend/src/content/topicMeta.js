/**
 * Topic metadata shown on the topics pages, per subject. Keys are topic
 * numbers (English 1-18, Math 100-104, Arabic 201). Lessons and exercises come from the
 * API; this file only holds display text and videos.
 */

// ===================== English =====================
// Topic names mapping (aligned with topics.md - single source of truth)
// Database has been reordered to match this pedagogical sequence
const topicNames = {
  1: { en: 'Grammar Basics', he: 'יסודות דקדוק' },
  2: { en: 'Verb "To Be" - Present', he: 'פועל להיות - הווה' },
  3: { en: 'Personal Pronouns & Possessives', he: 'כינויי גוף ושייכות' },
  4: { en: 'Nouns - Singular & Plural', he: 'שמות עצם - יחיד ורבים' },
  5: { en: 'Articles', he: 'מאמרים - a, an, the' },
  6: { en: 'Demonstratives', he: 'מילות הצבעה' },
  7: { en: 'There is / There are', he: 'יש' },
  8: { en: 'Adjectives', he: 'שמות תואר' },
  9: { en: 'Present Simple Tense', he: 'זמן הווה פשוט' },
  10: { en: 'Question Words', he: 'מילות שאלה' },
  11: { en: 'Present Progressive', he: 'הווה ממושך' },
  12: { en: 'Can / Could', he: 'יכול / יכול היה' },
  13: { en: 'Prepositions of Place', he: 'מילות יחס - מקום' },
  14: { en: 'Prepositions of Time', he: 'מילות יחס - זמן' },
  15: { en: 'Past Simple Tense', he: 'עבר פשוט' },
  16: { en: 'Going to', he: 'הולך ל' },
  17: { en: 'Future Simple - will', he: 'עתיד פשוט' },
  18: { en: 'Comparatives & Superlatives', he: 'דרגות השוואה' }
};

// Table of Contents - Quick examples for each topic
const tocExamples = {
  1: '(Nouns, Verbs, Adjectives)',
  2: '(I am, You are, She is)',
  3: '(I, me, my, mine)',
  4: '(book → books, child → children)',
  5: '(a book, an apple, the sun)',
  6: '(this/that, these/those)',
  7: '(There is a book, There are books)',
  8: '(big house, beautiful car)',
  9: '(I work, She studies)',
  10: '(What? Where? When? Why?)',
  11: '(I am studying, She is reading)',
  12: '(I can swim, Can you help?)',
  13: '(in the box, on the table, at home)',
  14: '(at 5 o\'clock, on Monday, in January)',
  15: '(I worked, She went, Did you see?)',
  16: '(I am going to study)',
  17: '(I will help, It will rain)',
  18: '(bigger, biggest, more beautiful)'
};

// Topic descriptions and examples
const topicDescriptions = {
  1: {
    description: 'למד את יסודות הדקדוק האנגלי: חלקי הדיבור, מבנה המשפט, סימני פיסוק ומונחי דקדוק בסיסיים. זהו הבסיס להבנת כל שאר הנושאים בקורס.',
    examples: ['Noun (שם עצם): book, teacher', 'Verb (פועל): run, eat', 'Adjective (שם תואר): beautiful, big']
  },
  2: {
    description: 'הפועל "to be" הוא הפועל החשוב ביותר באנגלית. למד את הצורות הבסיסיות (am, is, are) ואיך להשתמש בהן במשפטים חיוביים, שליליים ושאלות.',
    examples: ['I am a student - אני תלמיד', 'She is happy - היא שמחה', 'They are here - הם כאן']
  },
  3: {
    description: 'כינויי גוף (I, you, he, she) וכינויי שייכות (my, your, his, her) הם בסיס לבניית משפטים. למד מתי להשתמש בכל כינוי ואיך לבטא שייכות.',
    examples: ['I / me / my / mine', 'This is my book - זה הספר שלי', 'The book is mine - הספר הוא שלי']
  },
  4: {
    description: 'שמות עצם יכולים להיות יחיד או רבים. למד את הכללים ליצירת רבים, חריגים נפוצים, ואיך להשתמש בשמות עצם ספירים ולא-ספירים.',
    examples: ['book → books', 'child → children', 'water (uncountable)']
  },
  5: {
    description: 'המאמרים a, an, the משמשים לפני שמות עצם. למד מתי להשתמש בכל מאמר, מהם ההבדלים ביניהם, ומתי לא משתמשים במאמר כלל.',
    examples: ['a book - ספר (כלשהו)', 'an apple - תפוח', 'the sun - השמש']
  },
  6: {
    description: 'מילות הצבעה (this, that, these, those) משמשות להצביע על דברים קרובים או רחוקים, יחיד או רבים. למד איך להשתמש בהן נכון.',
    examples: ['This book - הספר הזה (קרוב)', 'That car - המכונית ההיא (רחוק)', 'These books - הספרים האלה']
  },
  7: {
    description: 'המבנה "There is/are" משמש לומר שמשהו קיים או נמצא במקום. למד מתי להשתמש ב-is ומתי ב-are, ואיך לבנות משפטים שליליים ושאלות.',
    examples: ['There is a book - יש ספר', 'There are books - יש ספרים', 'Is there a problem? - יש בעיה?']
  },
  8: {
    description: 'שמות תואר מתארים שמות עצם. למד איפה למקם שמות תואר במשפט, איך להשתמש במספר שמות תואר ביחד, ומהם סדרי הגודל.',
    examples: ['A big house - בית גדול', 'A beautiful red car - מכונית אדומה יפה', 'She is tall - היא גבוהה']
  },
  9: {
    description: 'זמן הווה פשוט מתאר הרגלים, עובדות ופעולות קבועות. למד איך לבנות משפטים חיוביים, שליליים ושאלות, ומתי להוסיף s- לפועל.',
    examples: ['I work every day - אני עובד כל יום', 'She studies English - היא לומדת אנגלית', 'Do you like pizza? - אתה אוהב פיצה?']
  },
  10: {
    description: 'מילות שאלה (Who, What, Where, When, Why, How) משמשות לשאול שאלות ספציפיות. למד איך לבנות שאלות עם כל מילת שאלה.',
    examples: ['What is your name? - מה שמך?', 'Where do you live? - איפה אתה גר?', 'Why are you late? - למה אתה מאחר?']
  },
  11: {
    description: 'זמן הווה ממושך מתאר פעולות שקורות עכשיו או בתקופה זו. נוצר עם am/is/are + פועל עם ing-. למד מתי להשתמש בו ואיך לבנות משפטים.',
    examples: ['I am studying now - אני לומד עכשיו', 'She is reading - היא קוראת', 'Are they working? - הם עובדים?']
  },
  12: {
    description: 'Can מבטא יכולת או אפשרות, Could מבטא יכולת בעבר או בקשה מנומסת. למד איך להשתמש בפעלים מודאליים אלה במשפטים שונים.',
    examples: ['I can swim - אני יכול לשחות', 'Can you help me? - אתה יכול לעזור לי?', 'Could you pass the salt? - תוכל להעביר את המלח?']
  },
  13: {
    description: 'מילות יחס של מקום (in, on, at, under, behind) מתארות היכן משהו נמצא. למד את ההבדלים בין מילות היחס ומתי להשתמש בכל אחת.',
    examples: ['in the box - בתוך הקופסה', 'on the table - על השולחן', 'at home - בבית']
  },
  14: {
    description: 'מילות יחס של זמן (in, on, at, for, since) מתארות מתי משהו קורה. למד את הכללים לשימוש במילות יחס שונות עם זמנים.',
    examples: ['at 5 o\'clock - בשעה 5', 'on Monday - ביום שני', 'in January - בינואר']
  },
  15: {
    description: 'זמן עבר פשוט מתאר פעולות שהסתיימו בעבר. למד את הכללים לפעלים רגילים (ed+) ובלתי רגילים, ואיך לבנות משפטים שליליים ושאלות.',
    examples: ['I worked yesterday - עבדתי אתמול', 'She went to school - היא הלכה לבית הספר', 'Did you see that? - ראית את זה?']
  },
  16: {
    description: 'המבנה "going to" משמש לתוכניות עתידיות ולחיזויים מבוססי ראיות. למד איך לבטא כוונות והחלטות על העתיד.',
    examples: ['I am going to study - אני הולך ללמוד', 'She is going to travel - היא הולכת לטייל', 'It\'s going to rain - זה הולך לרדת גשם']
  },
  17: {
    description: 'Will משמש לחיזויים, הבטחות והחלטות ספונטניות על העתיד. למד את ההבדל בין will ל-going to ומתי להשתמש בכל אחד.',
    examples: ['I will help you - אני אעזור לך', 'It will be sunny - יהיה שמשי', 'Will you come? - תבוא?']
  },
  18: {
    description: 'דרגות השוואה משמשות להשוות בין דברים. למד איך ליצור את דרגת ההשוואה (er-) ודרגת העליון (est-), ומתי להשתמש ב-more ו-most.',
    examples: ['big → bigger → biggest', 'beautiful → more beautiful → most beautiful', 'good → better → best']
  }
};

// Subtopic examples - 2 examples per subtopic
const getSubtopicExamples = (topicNumber, subtopicNumber) => {
  // Lessons carry the full number ('7.1'); accept a bare '1' as well.
  const sub = String(subtopicNumber);
  const key = sub.startsWith(`${topicNumber}.`) ? sub : `${topicNumber}.${sub}`;
  const subtopicExamples = {
    // Topic 1: Grammar Basics
    '1.1': ['Noun: book, teacher', 'Adjective: beautiful, big'],
    '1.2': ['I eat apples', 'She reads books'],
    '1.3': ['Statement: I like pizza', 'Question: Do you like pizza?'],
    '1.4': ['I (subject) love pizza (predicate)', 'The cat (subject) sleeps (predicate)'],

    // Topic 2: Verb To Be - Present
    '2.1': ['I am a student', 'She is happy'],
    '2.2': ['I am not tired', 'They are not here'],
    '2.3': ['Are you okay?', 'Is she a teacher?'],

    // Topic 3: Personal Pronouns & Possessives
    '3.1': ['I, you, he, she, it', 'We, they'],
    '3.2': ['Give it to me', 'I saw him yesterday'],
    '3.3': ['This is my book', 'Her name is Sarah'],
    '3.4': ['The book is mine', 'This car is yours'],

    // Topic 4: Nouns - Singular & Plural
    '4.1': ['book → books', 'baby → babies'],
    '4.2': ['child → children', 'man → men'],
    '4.3': ['water (uncountable)', 'some milk'],

    // Topic 5: Articles
    '5.1': ['a book', 'an apple'],
    '5.2': ['the sun', 'the President'],
    '5.3': ['I like coffee', 'Cats are cute'],

    // Topic 6: Demonstratives
    '6.1': ['This book (near)', 'That car (far)'],
    '6.2': ['These books', 'Those cars'],

    // Topic 7: There is/are
    '7.1': ['There is a book on the table', 'There are students in class'],
    '7.2': ['Is there a problem?', 'Are there any questions?'],

    // Topic 8: Adjectives
    '8.1': ['a big house', 'beautiful flowers'],
    '8.2': ['She is tall', 'The food tastes good'],
    '8.3': ['bigger than', 'the biggest'],

    // Topic 9: Present Simple
    '9.1': ['I work every day', 'She studies English'],
    '9.2': ['I don\'t like coffee', 'He doesn\'t work here'],
    '9.3': ['Do you like pizza?', 'Does she speak English?'],

    // Topic 10: Question Words
    '10.1': ['What is your name?', 'Who is that person?'],
    '10.2': ['Where do you live?', 'When is your birthday?'],
    '10.3': ['Why are you late?', 'How are you feeling?'],

    // Topic 11: Present Progressive
    '11.1': ['I am studying now', 'She is reading a book'],
    '11.2': ['I am not working today', 'They aren\'t sleeping'],
    '11.3': ['Are you working?', 'What are you doing?'],

    // Topic 12: Can/Could
    '12.1': ['I can swim', 'She can speak English'],
    '12.2': ['I could run fast (past)', 'Could you help me? (polite)'],

    // Topic 13: Prepositions of Place
    '13.1': ['The book is in the box', 'The cup is on the table'],
    '13.2': ['I am at home', 'She is at school'],
    '13.3': ['under the chair', 'behind the door'],

    // Topic 14: Prepositions of Time
    '14.1': ['at 5 o\'clock', 'at midnight'],
    '14.2': ['on Monday', 'on Christmas Day'],
    '14.3': ['in January', 'in summer'],

    // Topic 15: Past Simple
    '15.1': ['I worked yesterday', 'She walked to school'],
    '15.2': ['I went home', 'She ate pizza'],
    '15.3': ['Did you see that?', 'Where did you go?'],

    // Topic 16: Going to
    '16.1': ['I am going to study tonight', 'She is going to travel'],
    '16.2': ['It\'s going to rain', 'They are going to win'],

    // Topic 17: Future Simple - will
    '17.1': ['I will help you', 'It will be sunny tomorrow'],
    '17.2': ['Will you come to the party?', 'When will she arrive?'],

    // Topic 18: Comparatives & Superlatives
    '18.1': ['tall → taller → tallest', 'fast → faster → fastest'],
    '18.2': ['beautiful → more beautiful → most beautiful', 'good → better → best'],

    // Math badges are equations inside a right-to-left page: ltr() keeps
    // "56 ÷ 8 = 7" from showing as "7 = 8 ÷ 56".
    // Topic 100: The multiplication table (Math)
    '100.1': [ltr('3 × 4 = 4 + 4 + 4 = 12'), ltr('9 × 6 = 60 − 6 = 54')],
    '100.2': [ltr('56 ÷ 8 = 7'), ltr('12 ÷ 3 = 4')],
    '100.3': [ltr('? × 8 = 48'), ltr('4 × 6 × 2 = 48')],

    // Topic 105: Division (Math, chapter 2)
    '105.1': [`${ltr('17 ÷ 5 = 3')} ושארית 2`, 'השארית קטנה מהמחלק'],
    '105.2': ['30 ילדים, 8 בכל סירה: 4 סירות', 'מוסיפים 1 או משמיטים'],
    '105.3': [ltr('72 ÷ 3 = 24'), 'מחלקים, כופלים, מחסרים, מורידים'],
    '105.4': [ltr('412 ÷ 4 = 103'), 'אפס במנה'],

    // Topic 101: Fractions (Math)
    '101.1': ['מונה ומכנה', 'שבר מתוך כמות: 1/4 מ-20'],
    '101.2': [ltr('6/8 = 3/4'), ltr('2/3 = 8/12')],
    '101.3': [ltr('2/3 > 3/5'), 'השוואה לחצי'],
    '101.4': [ltr('1/2 + 1/3 = 5/6'), ltr('1 − 3/4 = 1/4')],
    '101.5': [ltr('2/3 × 3/4 = 1/2'), ltr('3/4 ÷ 1/2 = 3/2')],
    '101.6': [ltr('2 1/3 = 7/3'), ltr('1 1/2 + 2 3/4 = 4 1/4')],

    // Topic 110: Decimals (Math, chapter 4)
    '110.1': [ltr('0.7 = 7/10'), 'עשיריות ומאיות'],
    '110.2': [ltr('0.5 > 0.45'), ltr('2.47 ≈ 2.5')],
    '110.3': [ltr('2.50 + 1.75 = 4.25'), ltr('5 − 1.25 = 3.75')],
    '110.4': [ltr('3.45 × 10 = 34.5'), ltr('0.3 × 0.2 = 0.06')],

    // Topic 106: Negative numbers (Math, chapter 8)
    '106.1': [ltr('−2 > −5'), ltr('|−7| = 7')],
    '106.2': [ltr('−3 + (−4) = −7'), ltr('5 − (−3) = 8')],
    '106.3': [ltr('4 × (−3) = −12'), ltr('−3 × (−4) = 12')],

    // Topic 107: The x and y axes (Math, chapter 9)
    '107.1': [ltr('A(3, 2)'), 'ארבעת הרביעים'],
    '107.2': [ltr('(1, 2) → (4, −2)'), 'הקודקוד הרביעי של מלבן'],

    // Topic 108: Triangles (Math, chapter 10)
    '108.1': ['שווה שוקיים, ישר-זווית', ltr('3 + 4 > 6')],
    '108.2': [ltr('∠A + ∠B + ∠C = 180°'), ltr('180° − 40° − 75° = 65°')],
    '108.3': ['בסיס × גובה ÷ 2', ltr('8 × 5 ÷ 2 = 20')],

    // Topic 109: Equations with one unknown (Math, chapter 11)
    '109.1': [ltr('□ + 5 = 12'), 'מאזניים מאוזנים'],
    '109.2': [ltr('x + 5 = 12'), ltr('x = 12 − 5')],
    '109.3': [ltr('3x = 12'), ltr('x ÷ 4 = 5')],
    '109.4': [ltr('2x + 3 = 11'), ltr('2x = 8')],
    '109.5': [ltr('3x + 2 = x + 10'), ltr('2x + 2 = 10')],
    '109.6': [ltr('2(x + 3) = 14'), ltr('3x + 2x = 5x')],
    '109.7': ['נסמן ב-x', ltr('x + x + 4 = 20')],

    // Topic 111: Ratio and proportion (Math, chapter 12)
    '111.1': [ltr('12:18 = 2:3'), 'הסדר חשוב'],
    '111.2': [ltr('3 + 5 = 8'), ltr('40 ÷ 8 = 5')],
    '111.3': [ltr('3:4 = x:12'), ltr('3 × 12 = 4 × x')],

    // Topic 112: Linear functions (Math, chapter 13)
    '112.1': [ltr('y = 2x + 1'), ltr('(2, 5)')],
    '112.2': ['שיפוע', ltr('y = mx + b')],
    '112.3': [ltr('0 = 2x − 6'), 'מונית: 10 ₪ ועוד 3 ₪ לקילומטר']
  };

  return subtopicExamples[key] || [];
};

// Video mapping for topics (updated to match new topic order)
const topicVideos = {
  9: {
    title: 'Present Simple - המדריך המלא',
    filename: 'Present_Simple__המדריך_המלא.mp4',
    description: 'סרטון הסבר מקיף על זמן הווה פשוט',
    duration: '12:30',
    thumbnail: '🎬' // Can be replaced with actual thumbnail image path
  },
  3: {
    title: 'כוחם של כינויי הגוף',
    filename: 'כוחם_של_כינויי_הגוף.mp4',
    description: 'למד על כינויי גוף ושייכות באנגלית',
    duration: '10:45',
    thumbnail: '🎬'
  }
};


// ===================== Math (grades 7-8) =====================
const mathTopicNames = {
  100: { en: 'Multiplication Table', he: 'לוח הכפל' },
  105: { en: 'Division', he: 'חילוק' },
  101: { en: 'Fractions', he: 'שברים' },
  110: { en: 'Decimals', he: 'שברים עשרוניים' },
  102: { en: 'Order of Operations', he: 'סדר פעולות חשבון' },
  103: { en: 'Average', he: 'ממוצע' },
  104: { en: 'Percentage', he: 'אחוזים' },
  106: { en: 'Negative Numbers', he: 'מספרים שליליים' },
  107: { en: 'The x and y Axes', he: 'מערכת צירים' },
  108: { en: 'Triangles', he: 'משולשים' },
  109: { en: 'Equations with One Unknown', he: 'משוואה עם נעלם אחד' },
  111: { en: 'Ratio and Proportion', he: 'יחס ופרופורציה' },
  112: { en: 'Linear Functions', he: 'פונקציה קווית' }
};

const mathTocExamples = {
  100: '(כפל וחילוק עד 10×10, ובעיות מילוליות)',
  105: '(שארית, בעיות מילוליות וחילוק ארוך)',
  101: '(שישה שיעורים: ממה זה שבר ועד מספרים מעורבים)',
  110: '(עשיריות ומאיות, השוואה ועיגול, ארבע פעולות החשבון)',
  102: '(סוגריים, כפל וחילוק, חיבור וחיסור)',
  103: '(סכום חלקי מספר האיברים)',
  104: '(אחוז ממספר, הנחה, מע"מ)',
  106: '(ישר המספרים, חיבור וחיסור, כפל וחילוק)',
  107: '(ציר x וציר y, שיעורי נקודה, סימון נקודות)',
  108: '(סוגי משולשים, סכום הזוויות, היקף ושטח)',
  109: '(מהו נעלם, שומרים על איזון, שני צעדים, נעלם בשני האגפים, סוגריים, בעיות מילוליות)',
  111: '(מהו יחס, חלוקה לפי יחס, פרופורציה ואיבר חסר)',
  112: '(מכלל לטבלה ולישר, שיפוע, חיתוך עם הצירים וסיפורים)'
};

// Math expressions inside Hebrew text keep their left-to-right order when
// wrapped in a bidi isolate (U+2066 … U+2069); plain text has no dir attribute.
const ltr = (s) => `\u2066${s}\u2069`;

const mathTopicDescriptions = {
  100: {
    description: 'כפל וחילוק עד 10×10: כפל כקבוצות שוות, דרכים קלות לזכור את הלוח, חילוק כפעולה ההפוכה לכפל, ובעיות מילוליות.',
    examples: [ltr('7 × 8 = 56'), ltr('56 ÷ 8 = 7'), ltr('9 × 6 = 60 − 6 = 54')]
  },
  105: {
    description: 'חילוק עם שארית ומה עושים איתה בבעיות מילוליות, וחילוק ארוך של מספרים דו-ספרתיים ותלת-ספרתיים.',
    examples: [`${ltr('17 ÷ 5 = 3')} ושארית 2`, ltr('72 ÷ 3 = 24'), ltr('412 ÷ 4 = 103')]
  },
  101: {
    description: 'מה זה שבר, שברים שווים וצמצום, מכנה משותף, ארבע פעולות החשבון בשברים ומספרים מעורבים.',
    examples: [ltr('1/2 + 1/4 = 3/4'), ltr('2/3 × 3/5 = 2/5'), ltr('1 1/2 = 3/2')]
  },
  110: {
    description: 'שבר עשרוני הוא שבר שהמכנה שלו 10, 100 או 1000: עשיריות ומאיות, ערך המקום של כל ספרה, השוואה ועיגול, חיבור וחיסור כשהנקודות זו מתחת לזו, וכפל וחילוק.',
    examples: [ltr('0.25 = 1/4'), ltr('2.50 + 1.75 = 4.25'), ltr('0.3 × 0.2 = 0.06')]
  },
  102: {
    description: 'באיזה סדר מחשבים תרגיל שיש בו כמה פעולות: סוגריים, כפל וחילוק, ואז חיבור וחיסור.',
    examples: [ltr('3 + 4 × 2 = 11'), ltr('(3 + 4) × 2 = 14'), ltr('20 ÷ 4 × 2 = 10')]
  },
  103: {
    description: 'איך מחשבים ממוצע, איך מוצאים איבר חסר כשהממוצע ידוע, ומה קורה לממוצע כשמוסיפים מספר.',
    examples: [ltr('(80 + 90 + 100) ÷ 3 = 90'), `ממוצע 4 ציונים הוא 85, לכן הסכום הוא ${ltr('4 × 85 = 340')}`]
  },
  104: {
    description: 'אחוז כחלק ממאה, מעבר בין אחוז, שבר ועשרוני, אחוז ממספר, הנחה ותוספת.',
    examples: [`${ltr('25%')} מ-80 הם 20`, `${ltr('10%')} הנחה על 150 ₪: משלמים 135 ₪`, ltr('3/4 = 75%')]
  },
  106: {
    description: 'מספרים קטנים מ-0 על ישר המספרים: השוואה, מספרים נגדיים וערך מוחלט, חיבור וחיסור, וכללי הסימנים בכפל ובחילוק.',
    examples: [ltr('−3 + (−4) = −7'), ltr('5 − (−3) = 8'), ltr('−3 × (−4) = 12')]
  },
  107: {
    description: `ציר x וציר y, ראשית הצירים, שיעורי נקודה ${ltr('(x, y)')} וארבעת הרביעים; סימון נקודות, הזזת נקודה, מרחק על קו המשבצות וקודקודים של מלבן.`,
    examples: [ltr('A(3, 2)'), `${ltr('(−3, 2)')} ברביע השני`, `המרחק בין ${ltr('(−3, 2)')} ל-${ltr('(4, 2)')} הוא 7`]
  },
  108: {
    description: 'סוגי משולשים לפי הצלעות ולפי הזוויות, אילו צלעות יוצרות משולש, סכום הזוויות במשולש, והיקף ושטח: בסיס כפול גובה חלקי 2.',
    examples: [ltr('50° + 60° + 70° = 180°'), `שטח: ${ltr('8 × 5 ÷ 2 = 20')}`, `${ltr('3 + 4 > 6')}: יש משולש`]
  },
  109: {
    description: 'מהו נעלם: מספר שמסתתר בקופסה, אות במקומו, ומשוואה כמו מאזניים מאוזנים. פותרים צעד אחרי צעד, ועושים אותו דבר לשני האגפים: חיבור וחיסור, כפל וחילוק, משוואות בשני צעדים, נעלם בשני האגפים וסוגריים, ובסוף בודקים. בשיעור האחרון הופכים סיפור למשוואה ופותרים אותו.',
    examples: [`הפתרון של ${ltr('x + 5 = 12')} הוא 7`, `מורידים 5 משני האגפים: ${ltr('x = 7')}`, `בדיקה: ${ltr('3 × 4 = 12')}`]
  },
  111: {
    description: 'יחס משווה בין שתי כמויות: כותבים אותו כמו 3:5, הסדר חשוב, ומצמצמים אותו כמו שבר. מחלקים כמות לפי יחס, ומוצאים איבר חסר בפרופורציה: מחיר ליחידה, מתכונים וקנה מידה.',
    examples: [ltr('12:18 = 2:3'), `40 ביחס 3:5: ${ltr('15 + 25 = 40')}`, ltr('3:4 = 9:12')]
  },
  112: {
    description: `כלל כמו ${ltr('y = 2x + 1')} נותן לכל x ערך y: מהכלל בונים טבלה, הנקודות שלה נמצאות על ישר אחד, ומהישר קוראים בחזרה את הכלל. השיפוע אומר בכמה y גדל כש-x גדל ב-1, ונקודת החיתוך עם ציר ה-y היא הערך כש-x הוא 0. בסוף: איפה הישר חותך את הצירים, וסיפורים כמו מונית או נר שנשרף.`,
    examples: [`כש-${ltr('x = 2')}, ${ltr('y = 2 × 2 + 1 = 5')}`, `ב-${ltr('y = 3x − 2')} השיפוע 3`, `הישר ${ltr('y = −2x + 6')} חותך את ציר ה-x ב-${ltr('(3, 0)')}`]
  }
};

const mathTopicVideos = {};

// ===================== Arabic (grade 7, reading and recognition) =====================
const arabicTopicNames = {
  201: { en: 'Letters, vowels and first words', he: 'אותיות, תנועות ומילים ראשונות' }
};

const arabicTocExamples = {
  201: '(האותיות د و ذ ا ر ز, אלף והמזה, תנועות, 8 מילים)'
};

const arabicTopicDescriptions = {
  201: {
    description: 'שש אותיות ראשונות, ההבדל בין אלף עם המזה לאלף בלי המזה, התנועות פתחה, דמה, כסרה וסוכון, ושמונה מילים ראשונות עם הפירוש שלהן.',
    examples: ['دَار = בית', 'وَرْد = ורדים', 'أَرَادَ = רצה']
  }
};

const topicMeta = {
  english: {
    title: 'אנגלית',
    route: '/topics',
    // What a link back to the subject's page calls it ("חזור לנושאים").
    indexLabel: 'נושאים',
    // Header actions: a route, 'next-lesson' (the first lesson not completed)
    // or 'mistakes-exam' (the subject's mistakes exam, with how many wait).
    actions: [
      { icon: '📝', label: 'לימוד מילים', to: '/vocabulary' },
      { icon: '📖', label: 'פסקאות באנגלית', to: '/unseen' },
      { icon: '🎯', label: 'מבחן טעויות', to: 'mistakes-exam' }
    ],
    nameKey: 'en',
    numberOffset: 0,
    topicNames,
    tocExamples,
    topicDescriptions,
    topicVideos
  },
  math: {
    title: 'מתמטיקה',
    route: '/math',
    indexLabel: 'מתמטיקה',
    actions: [
      { icon: '▶️', label: 'השיעור הבא', to: 'next-lesson' },
      { icon: '🎯', label: 'מבחן טעויות', to: 'mistakes-exam' },
      { icon: '🔄', label: 'תיקון טעויות', to: '/mistakes' }
    ],
    nameKey: 'he',
    numberOffset: 99,
    // Chapters in teaching order, shown as 1, 2, 3…: division (105) comes
    // right after the multiplication table, decimals (110) right after
    // fractions; negative numbers (106), graphs on the x and y axes (107),
    // triangles (108) and equations (109) come after percentage, as chapters
    // 8–11, ratio and proportion (111) after them, as chapter 12, and linear
    // functions (112) last, as chapter 13 (a chapter shows once it has
    // lessons). The same list orders lessons in the API
    // (backend/src/config/subjects.js MATH_CHAPTER_ORDER).
    topicOrder: [100, 105, 101, 110, 102, 103, 104, 106, 107, 108, 109, 111, 112],
    topicNames: mathTopicNames,
    tocExamples: mathTocExamples,
    topicDescriptions: mathTopicDescriptions,
    topicVideos: mathTopicVideos
  },
  arabic: {
    title: 'ערבית',
    route: '/arabic',
    indexLabel: 'ערבית',
    actions: [
      { icon: '▶️', label: 'השיעור הבא', to: 'next-lesson' },
      { icon: '🎯', label: 'מבחן טעויות', to: 'mistakes-exam' },
      { icon: '🔄', label: 'תיקון טעויות', to: '/mistakes' }
    ],
    nameKey: 'he',
    numberOffset: 200,
    topicNames: arabicTopicNames,
    tocExamples: arabicTocExamples,
    topicDescriptions: arabicTopicDescriptions,
    topicVideos: {}
  }
};

// Topic numbers keep the subjects apart (backend/src/config/subjects.js):
// English 1-99, math 100-199 (the multiplication table, 100, first), Arabic
// 201-299, each shown from 1 (100.1 -> 1.1, 101.3 -> 2.3, 201.1 -> 1.1).
// The subject is inferred from the number so pages that only have a lesson
// can use it too.
const subjectOfTopic = (topicNumber) => (topicNumber > 200 ? 'arabic' : topicNumber >= 100 ? 'math' : 'english');
/** The subject's page and display text; unknown subjects fall back to English. */
const metaOf = (subject) => topicMeta[subject] || topicMeta.english;
const displayTopic = (topicNumber) => {
  const meta = topicMeta[subjectOfTopic(topicNumber)];
  const place = meta.topicOrder ? meta.topicOrder.indexOf(Number(topicNumber)) : -1;
  return place >= 0 ? place + 1 : topicNumber - meta.numberOffset;
};
/** A subject's topic numbers (as strings, like Object.keys) in teaching order. */
const orderedTopics = (subject, numbers) => {
  const order = metaOf(subject).topicOrder || [];
  const rank = (n) => (order.indexOf(Number(n)) >= 0 ? order.indexOf(Number(n)) : order.length + Number(n));
  return [...numbers].sort((a, b) => rank(a) - rank(b));
};
const displaySubtopic = (subtopicNumber) => String(subtopicNumber).replace(/^\d+/, (n) => displayTopic(Number(n)));

export { getSubtopicExamples, displayTopic, displaySubtopic, subjectOfTopic, metaOf, orderedTopics };
export default topicMeta;
