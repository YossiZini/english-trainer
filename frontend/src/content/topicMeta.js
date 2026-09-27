/**
 * Topic metadata shown on the topics pages, per subject. Keys are topic
 * numbers (English 1-18, Math 101-104). Lessons and exercises come from the
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
  const key = `${topicNumber}.${subtopicNumber}`;
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
    '18.2': ['beautiful → more beautiful → most beautiful', 'good → better → best']
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
  101: { en: 'Fractions', he: 'שברים' },
  102: { en: 'Order of Operations', he: 'סדר פעולות חשבון' },
  103: { en: 'Average', he: 'ממוצע' },
  104: { en: 'Percentage', he: 'אחוזים' }
};

const mathTocExamples = {
  101: '(צמצום, מכנה משותף, חיבור וכפל)',
  102: '(סוגריים, כפל וחילוק, חיבור וחיסור)',
  103: '(סכום חלקי מספר האיברים)',
  104: '(אחוז ממספר, הנחה, מע"מ)'
};

const mathTopicDescriptions = {
  101: {
    description: 'מה זה שבר, שברים שווים וצמצום, מכנה משותף, ארבע פעולות החשבון בשברים ומספרים מעורבים.',
    examples: ['1/2 + 1/4 = 3/4', '2/3 × 3/5 = 2/5', '1 1/2 = 3/2']
  },
  102: {
    description: 'באיזה סדר מחשבים תרגיל שיש בו כמה פעולות: סוגריים, כפל וחילוק, ואז חיבור וחיסור.',
    examples: ['3 + 4 × 2 = 11', '(3 + 4) × 2 = 14', '20 ÷ 4 × 2 = 10']
  },
  103: {
    description: 'איך מחשבים ממוצע, איך מוצאים איבר חסר כשהממוצע ידוע, ומה קורה לממוצע כשמוסיפים מספר.',
    examples: ['(80 + 90 + 100) ÷ 3 = 90', 'ממוצע 4 ציונים = 85 ← הסכום 340']
  },
  104: {
    description: 'אחוז כחלק ממאה, מעבר בין אחוז, שבר ועשרוני, אחוז ממספר, הנחה ותוספת.',
    examples: ['25% מ-80 = 20', '10% הנחה על 150 ₪ = 135 ₪', '3/4 = 75%']
  }
};

const mathTopicVideos = {};

const topicMeta = {
  english: {
    title: 'נושאי לימוד',
    subtitle: 'אנגלית',
    route: '/topics',
    nameKey: 'en',
    numberOffset: 0,
    topicNames,
    tocExamples,
    topicDescriptions,
    topicVideos
  },
  math: {
    title: 'מתמטיקה',
    subtitle: 'כיתות ז׳–ח׳',
    route: '/math',
    nameKey: 'he',
    numberOffset: 100,
    topicNames: mathTopicNames,
    tocExamples: mathTocExamples,
    topicDescriptions: mathTopicDescriptions,
    topicVideos: mathTopicVideos
  }
};

export { getSubtopicExamples };
export default topicMeta;
