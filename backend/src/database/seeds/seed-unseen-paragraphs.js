const { pool } = require('../../config/database');

/**
 * Seed 15 unseen paragraphs with 5 questions each
 * For ages 12-14, complexity levels 1-5
 */
async function seedUnseenParagraphs() {
  console.log('Starting unseen paragraphs seed...');

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Delete existing data (in correct order due to foreign keys)
    console.log('Cleaning existing unseen data...');
    await client.query('DELETE FROM unseen_answers');
    await client.query('DELETE FROM unseen_sessions');
    await client.query('DELETE FROM unseen_user_progress');
    await client.query('DELETE FROM unseen_questions');
    await client.query('DELETE FROM unseen_paragraphs');

    const paragraphs = getParagraphsData();

    for (const paragraphData of paragraphs) {
      console.log(`Seeding: ${paragraphData.titleEn}...`);

      // Insert paragraph
      const paragraphResult = await client.query(
        `INSERT INTO unseen_paragraphs (title_en, title_he, content, complexity_level, topic, hard_words, is_custom, uses_failed_words)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [
          paragraphData.titleEn,
          paragraphData.titleHe,
          paragraphData.content,
          paragraphData.complexityLevel,
          paragraphData.topic,
          JSON.stringify(paragraphData.hardWords),
          false,
          false
        ]
      );

      const paragraphId = paragraphResult.rows[0].id;

      // Insert questions for this paragraph
      for (const question of paragraphData.questions) {
        await client.query(
          `INSERT INTO unseen_questions (paragraph_id, question_number, question_text_en, question_text_he, options, correct_answer, explanation_he)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            paragraphId,
            question.questionNumber,
            question.questionTextEn,
            question.questionTextHe,
            JSON.stringify(question.options),
            question.correctAnswer,
            question.explanationHe
          ]
        );
      }
    }

    await client.query('COMMIT');
    console.log('✅ Successfully seeded all 15 unseen paragraphs with 75 questions!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding unseen paragraphs:', error);
    throw error;
  } finally {
    client.release();
  }
}

function getParagraphsData() {
  return [
    // Paragraph 1: My Favorite Sport (Complexity 1)
    {
      titleEn: 'My Favorite Sport',
      titleHe: 'הספורט האהוב עלי',
      complexityLevel: 1,
      topic: 'Sports',
      content: `I love playing basketball. It is my favorite sport because it is fun and exciting. I play with my friends after school every Tuesday and Thursday.

Basketball helps me stay healthy and strong. When I play, I run a lot and jump high. It makes me feel energetic and happy. My team practices together, and we support each other.

Last month, our school team won a championship game. Everyone was so excited! We worked hard as a team and never gave up. Playing basketball taught me that teamwork and practice are very important.`,
      hardWords: [
        { word: 'championship', translation: 'אליפות' },
        { word: 'energetic', translation: 'אנרגטי, מלא אנרגיה' },
        { word: 'exciting', translation: 'מרגש, מלהיב' },
        { word: 'practices', translation: 'מתאמן, מתרגל' },
        { word: 'support', translation: 'תומך, מעודד' },
        { word: 'teamwork', translation: 'עבודת צוות' },
        { word: 'important', translation: 'חשוב' }
      ],
      questions: [
        {
          questionNumber: 1,
          questionTextEn: 'How often does the writer play basketball?',
          questionTextHe: 'באיזו תדירות הכותב משחק כדורסל?',
          options: ['Every day', 'Twice a week', 'Once a week', 'Only on weekends'],
          correctAnswer: 1,
          explanationHe: 'הכותב משחק כדורסל עם חברים בימי שלישי וחמישי אחרי בית הספר - זה פעמיים בשבוע.'
        },
        {
          questionNumber: 2,
          questionTextEn: 'What does basketball help the writer do?',
          questionTextHe: 'במה כדורסל עוזר לכותב?',
          options: ['Make money', 'Stay healthy', 'Do homework', 'Sleep better'],
          correctAnswer: 1,
          explanationHe: 'הכותב אומר ש-"Basketball helps me stay healthy and strong" - כדורסל עוזר לו להישאר בריא וחזק.'
        },
        {
          questionNumber: 3,
          questionTextEn: 'When did the school team win?',
          questionTextHe: 'מתי קבוצת בית הספר זכתה?',
          options: ['Yesterday', 'Last week', 'Last month', 'Last year'],
          correctAnswer: 2,
          explanationHe: 'הכותב מציין ש-"Last month, our school team won a championship game" - בחודש שעבר הקבוצה זכתה במשחק אליפות.'
        },
        {
          questionNumber: 4,
          questionTextEn: 'What important lesson did basketball teach the writer?',
          questionTextHe: 'איזה לקח חשוב למד הכותב מכדורסל?',
          options: ['How to win', 'Teamwork is important', 'Running is easy', 'Friends are fun'],
          correctAnswer: 1,
          explanationHe: 'הכותב מסכם ש-"teamwork and practice are very important" - עבודת צוות ותרגול חשובים מאוד.'
        },
        {
          questionNumber: 5,
          questionTextEn: 'How does the writer feel when playing basketball?',
          questionTextHe: 'איך מרגיש הכותב כשהוא משחק כדורסל?',
          options: ['Tired and bored', 'Energetic and happy', 'Scared and nervous', 'Sleepy and calm'],
          correctAnswer: 1,
          explanationHe: 'הכותב אומר בבירור: "It makes me feel energetic and happy" - זה גורם לו להרגיש אנרגטי ומאושר.'
        }
      ]
    },

    // Paragraph 2: A Day at the Zoo (Complexity 1)
    {
      titleEn: 'A Day at the Zoo',
      titleHe: 'יום בגן החיות',
      complexityLevel: 1,
      topic: 'Nature',
      content: `Last Sunday, my family and I visited the city zoo. We saw many different animals from around the world. The weather was sunny and perfect for walking.

My favorite animals were the elephants. They were huge and very intelligent. One elephant used its trunk to spray water on itself. The zookeeper told us that elephants live in a special habitat with trees and a pond.

We also saw some endangered species, like the white tigers. There are very few white tigers left in the world. It made me think about how we need to protect animals and their homes.`,
      hardWords: [
        { word: 'habitat', translation: 'בית גידול, סביבת מחיה' },
        { word: 'endangered', translation: 'בסכנת הכחדה' },
        { word: 'intelligent', translation: 'חכם, אינטליגנטי' },
        { word: 'trunk', translation: 'חדק (של פיל)' },
        { word: 'zookeeper', translation: 'שומר גן חיות' },
        { word: 'species', translation: 'מינים' },
        { word: 'protect', translation: 'להגן, לשמור' }
      ],
      questions: [
        {
          questionNumber: 1,
          questionTextEn: 'When did the family visit the zoo?',
          questionTextHe: 'מתי המשפחה ביקרה בגן החיות?',
          options: ['Last Saturday', 'Last Sunday', 'Yesterday', 'Two weeks ago'],
          correctAnswer: 1,
          explanationHe: 'הפסקה הראשונה מתחילה ב-"Last Sunday, my family and I visited the city zoo" - ביום ראשון האחרון.'
        },
        {
          questionNumber: 2,
          questionTextEn: "What were the writer's favorite animals?",
          questionTextHe: 'מהן החיות האהובות על הכותב?',
          options: ['Tigers', 'Elephants', 'Monkeys', 'Lions'],
          correctAnswer: 1,
          explanationHe: 'הכותב אומר בפירוש: "My favorite animals were the elephants" - החיות האהובות עליו היו הפילים.'
        },
        {
          questionNumber: 3,
          questionTextEn: 'What did the elephant do with its trunk?',
          questionTextHe: 'מה עשה הפיל עם החדק שלו?',
          options: ['Ate food', 'Sprayed water', 'Picked up rocks', 'Made sounds'],
          correctAnswer: 1,
          explanationHe: 'הטקסט אומר: "One elephant used its trunk to spray water on itself" - פיל אחד השתמש בחדק כדי לרסס מים על עצמו.'
        },
        {
          questionNumber: 4,
          questionTextEn: 'Why are white tigers special?',
          questionTextHe: 'למה נמרים לבנים מיוחדים?',
          options: ['They are very big', 'They are endangered', 'They can swim', 'They live in trees'],
          correctAnswer: 1,
          explanationHe: 'הכותב מסביר שנמרים לבנים הם "endangered species" ושיש מעט מאוד כאלה בעולם - הם בסכנת הכחדה.'
        },
        {
          questionNumber: 5,
          questionTextEn: 'What lesson did the writer learn?',
          questionTextHe: 'איזה לקח למד הכותב?',
          options: ['Zoos are fun', 'We need to protect animals', 'Elephants are smart', 'Weather is important'],
          correctAnswer: 1,
          explanationHe: 'הכותב מסיים עם המחשבה: "we need to protect animals and their homes" - אנחנו צריכים להגן על בעלי חיים ועל בתיהם.'
        }
      ]
    },

    // Paragraph 3: The School Library (Complexity 2)
    {
      titleEn: 'The School Library',
      titleHe: 'ספריית בית הספר',
      complexityLevel: 2,
      topic: 'Education',
      content: `Our school library is my favorite place to spend time during lunch break. It is quiet and peaceful, perfect for reading or studying. The library has thousands of books organized by topic and classification.

Mrs. Johnson, our librarian, helps students find books they will enjoy. She knows everything about the library's collection. Last week, she recommended a mystery novel to me, and I couldn't stop reading it!

The library also has computers where we can do research for our homework. There is a special reference section with encyclopedias and dictionaries. I often use these resources when I write essays for my English class.`,
      hardWords: [
        { word: 'classification', translation: 'סיווג, מיון' },
        { word: 'reference', translation: 'עיון, התייחסות' },
        { word: 'librarian', translation: 'ספרן, ספרנית' },
        { word: 'collection', translation: 'אוסף' },
        { word: 'recommended', translation: 'המליץ' },
        { word: 'encyclopedias', translation: 'אנציקלופדיות' },
        { word: 'resources', translation: 'משאבים, מקורות' }
      ],
      questions: [
        {
          questionNumber: 1,
          questionTextEn: 'When does the writer visit the library?',
          questionTextHe: 'מתי הכותב מבקר בספרייה?',
          options: ['After school', 'During lunch break', 'In the morning', 'On weekends'],
          correctAnswer: 1,
          explanationHe: 'הכותב אומר שהספרייה היא המקום האהוב עליו "during lunch break" - בהפסקת הצהריים.'
        },
        {
          questionNumber: 2,
          questionTextEn: 'What is Mrs. Johnson\'s job?',
          questionTextHe: 'מה התפקיד של גברת ג׳ונסון?',
          options: ['Teacher', 'Principal', 'Librarian', 'Student'],
          correctAnswer: 2,
          explanationHe: 'הטקסט אומר בבירור: "Mrs. Johnson, our librarian" - גברת ג\'ונסון היא הספרנית שלנו.'
        },
        {
          questionNumber: 3,
          questionTextEn: 'What type of book did Mrs. Johnson recommend?',
          questionTextHe: 'איזה סוג של ספר גברת ג\'ונסון המליצה?',
          options: ['Science book', 'History book', 'Mystery novel', 'Comic book'],
          correctAnswer: 2,
          explanationHe: 'הכותב מספר: "she recommended a mystery novel to me" - היא המליצה לו על רומן מסתורין.'
        },
        {
          questionNumber: 4,
          questionTextEn: 'What can students do on the library computers?',
          questionTextHe: 'מה תלמידים יכולים לעשות במחשבי הספרייה?',
          options: ['Play games', 'Watch movies', 'Do research', 'Send emails'],
          correctAnswer: 2,
          explanationHe: 'הטקסט מציין שבספרייה יש "computers where we can do research for our homework" - מחשבים שבהם אפשר לעשות מחקר לשיעורי הבית.'
        },
        {
          questionNumber: 5,
          questionTextEn: 'What does the writer use the reference section for?',
          questionTextHe: 'לשם מה הכותב משתמש במדור העיון?',
          options: ['Reading stories', 'Writing essays', 'Borrowing books', 'Meeting friends'],
          correctAnswer: 1,
          explanationHe: 'הכותב אומר: "I often use these resources when I write essays for my English class" - הוא משתמש במשאבים אלה כשהוא כותב חיבורים לשיעור אנגלית.'
        }
      ]
    },

    // Paragraph 4: Making New Friends (Complexity 2)
    {
      titleEn: 'Making New Friends',
      titleHe: 'יצירת חברויות חדשות',
      complexityLevel: 2,
      topic: 'Social Life',
      content: `Starting at a new school can feel awkward at first. When I moved to this city last year, I didn't know anyone. I was nervous about making friends and fitting in with my classmates.

On my first day, a girl named Sarah introduced herself during lunch. She invited me to sit with her group, and we talked about our favorite music and hobbies. That simple act of kindness made me feel welcome.

Now Sarah is my best friend, and I have many other acquaintances too. I learned that being friendly and open to new experiences helps you make connections. Sometimes, one person's kindness can change everything.`,
      hardWords: [
        { word: 'awkward', translation: 'מביך, לא נוח' },
        { word: 'acquaintance', translation: 'מכר, היכרות' },
        { word: 'nervous', translation: 'עצבני, מודאג' },
        { word: 'introduced', translation: 'הציג, הכיר' },
        { word: 'invited', translation: 'הזמין' },
        { word: 'hobbies', translation: 'תחביבים' },
        { word: 'connections', translation: 'קשרים' }
      ],
      questions: [
        {
          questionNumber: 1,
          questionTextEn: 'How did the writer feel about starting at a new school?',
          questionTextHe: 'איך הכותב הרגיש לגבי התחלה בבית ספר חדש?',
          options: ['Excited and happy', 'Awkward and nervous', 'Angry and sad', 'Bored and tired'],
          correctAnswer: 1,
          explanationHe: 'הכותב מתאר שזה יכול להרגיש "awkward" והוא היה "nervous" - מביך ועצבני.'
        },
        {
          questionNumber: 2,
          questionTextEn: 'Who was the first person to help the writer?',
          questionTextHe: 'מי היה האדם הראשון שעזר לכותב?',
          options: ['A teacher', 'Sarah', 'His parents', 'A boy from class'],
          correctAnswer: 1,
          explanationHe: 'הטקסט אומר: "a girl named Sarah introduced herself during lunch" - בחורה בשם שרה הציגה את עצמה בהפסקת צהריים.'
        },
        {
          questionNumber: 3,
          questionTextEn: 'When did Sarah introduce herself?',
          questionTextHe: 'מתי שרה הציגה את עצמה?',
          options: ['Before class', 'During lunch', 'After school', 'In the morning'],
          correctAnswer: 1,
          explanationHe: 'שרה הציגה את עצמה "during lunch" - במהלך ארוחת הצהריים.'
        },
        {
          questionNumber: 4,
          questionTextEn: 'What is the relationship between the writer and Sarah now?',
          questionTextHe: 'מה הקשר בין הכותב לשרה עכשיו?',
          options: ['Classmates only', 'Best friends', 'They don\'t talk', 'Teacher and student'],
          correctAnswer: 1,
          explanationHe: 'הכותב אומר בבירור: "Now Sarah is my best friend" - עכשיו שרה היא החברה הכי טובה שלו.'
        },
        {
          questionNumber: 5,
          questionTextEn: 'What lesson did the writer learn?',
          questionTextHe: 'איזה לקח למד הכותב?',
          options: ['School is hard', 'Being friendly helps make friends', 'Music is important', 'Lunch is the best time'],
          correctAnswer: 1,
          explanationHe: 'הכותב מסכם: "being friendly and open to new experiences helps you make connections" - להיות ידידותי ופתוח עוזר ליצור קשרים.'
        }
      ]
    },

    // Paragraph 5: Climate Change (Complexity 3)
    {
      titleEn: 'Understanding Climate Change',
      titleHe: 'הבנת שינויי האקלים',
      complexityLevel: 3,
      topic: 'Environment',
      content: `Climate change is one of the most serious challenges facing our planet today. The Earth's atmosphere is getting warmer because of human activities. When we burn fossil fuels like coal and oil, we release gases that trap heat in the atmosphere.

The consequences of climate change are already visible around the world. Ice caps are melting, sea levels are rising, and weather patterns are becoming more extreme. Some areas experience severe droughts, while others face dangerous flooding.

Scientists agree that we must take action now to reduce carbon emissions. We can help by using less energy, recycling, and choosing sustainable transportation like bikes or public buses. Every small action counts when millions of people work together.`,
      hardWords: [
        { word: 'atmosphere', translation: 'אטמוספירה, אווירה' },
        { word: 'consequences', translation: 'השלכות, תוצאות' },
        { word: 'fossil fuels', translation: 'דלקים פוסיליים' },
        { word: 'emissions', translation: 'פליטות' },
        { word: 'droughts', translation: 'בצורות' },
        { word: 'flooding', translation: 'הצפות' },
        { word: 'sustainable', translation: 'בר-קיימא, קיים' }
      ],
      questions: [
        {
          questionNumber: 1,
          questionTextEn: 'What causes the Earth\'s atmosphere to get warmer?',
          questionTextHe: 'מה גורם לאטמוספירה של כדור הארץ להתחמם?',
          options: ['The sun only', 'Human activities', 'Rain and snow', 'Plants and trees'],
          correctAnswer: 1,
          explanationHe: 'הטקסט אומר בפירוש: "The Earth\'s atmosphere is getting warmer because of human activities" - פעילויות אנושיות.'
        },
        {
          questionNumber: 2,
          questionTextEn: 'What happens when we burn fossil fuels?',
          questionTextHe: 'מה קורה כשאנחנו שורפים דלקים מאובנים?',
          options: ['They create water', 'They trap heat in atmosphere', 'They cool the Earth', 'They make plants grow'],
          correctAnswer: 1,
          explanationHe: 'הכותב מסביר: "we release gases that trap heat in the atmosphere" - אנו משחררים גזים שלוכדים חום באטמוספירה.'
        },
        {
          questionNumber: 3,
          questionTextEn: 'What is one visible consequence of climate change?',
          questionTextHe: 'מהי השלכה אחת הנראית לעין של שינויי האקלים?',
          options: ['More schools', 'Melting ice caps', 'Cheaper food', 'Better weather'],
          correctAnswer: 1,
          explanationHe: 'הטקסט מונה מספר השלכות, כולל: "Ice caps are melting" - כיפות הקרח נמסות.'
        },
        {
          questionNumber: 4,
          questionTextEn: 'According to scientists, when should we take action?',
          questionTextHe: 'לפי מדענים, מתי צריך לנקוט פעולה?',
          options: ['Next year', 'In 10 years', 'Now', 'Never'],
          correctAnswer: 2,
          explanationHe: 'המדענים מסכימים ש: "we must take action now" - אנחנו חייבים לפעול עכשיו.'
        },
        {
          questionNumber: 5,
          questionTextEn: 'What is one way we can help reduce climate change?',
          questionTextHe: 'מהי דרך אחת שבה נוכל לעזור להפחית שינויי אקלים?',
          options: ['Drive more cars', 'Use more plastic', 'Use sustainable transportation', 'Build more factories'],
          correctAnswer: 2,
          explanationHe: 'הכותב מציע: "choosing sustainable transportation like bikes or public buses" - בחירה בתחבורה ברת-קיימא.'
        }
      ]
    },

    // Paragraph 6: The Human Brain (Complexity 3)
    {
      titleEn: 'The Amazing Human Brain',
      titleHe: 'המוח האנושי המדהים',
      complexityLevel: 3,
      topic: 'Science',
      content: `The human brain is the most complex organ in our body. It contains billions of neurons that work together to control everything we do. These neurons send electrical signals to each other, allowing us to think, feel, and move.

Different parts of the brain have different jobs. The frontal lobe helps us make decisions and solve problems. The cerebellum controls our balance and coordination. The hippocampus is responsible for forming new memories and learning new information.

Scientists continue to study the brain to understand its cognitive abilities better. Research shows that our brains can change and adapt throughout our lives. This ability, called neuroplasticity, means we can always learn new skills and improve ourselves.`,
      hardWords: [
        { word: 'neurons', translation: 'נוירונים, תאי עצב' },
        { word: 'cognitive', translation: 'קוגניטיבי, הכרתי' },
        { word: 'frontal lobe', translation: 'אונה קדמית (במוח)' },
        { word: 'cerebellum', translation: 'המוח הקטן' },
        { word: 'hippocampus', translation: 'היפוקמפוס (אזור במוח)' },
        { word: 'coordination', translation: 'תיאום' },
        { word: 'neuroplasticity', translation: 'נוירופלסטיות' }
      ],
      questions: [
        {
          questionNumber: 1,
          questionTextEn: 'What do neurons do?',
          questionTextHe: 'מה נוירונים עושים?',
          options: ['Store food', 'Send electrical signals', 'Pump blood', 'Clean the body'],
          correctAnswer: 1,
          explanationHe: 'הטקסט מסביר: "These neurons send electrical signals to each other" - הנוירונים שולחים אותות חשמליים אחד לשני.'
        },
        {
          questionNumber: 2,
          questionTextEn: 'What does the frontal lobe help us do?',
          questionTextHe: 'במה האונה הקדמית עוזרת לנו?',
          options: ['Breathe', 'Make decisions', 'Digest food', 'Hear sounds'],
          correctAnswer: 1,
          explanationHe: 'הכותב אומר: "The frontal lobe helps us make decisions and solve problems" - האונה הקדמית עוזרת לנו לקבל החלטות ולפתור בעיות.'
        },
        {
          questionNumber: 3,
          questionTextEn: 'Which part of the brain controls balance?',
          questionTextHe: 'איזה חלק במוח שולט על האיזון?',
          options: ['Frontal lobe', 'Hippocampus', 'Cerebellum', 'Neurons'],
          correctAnswer: 2,
          explanationHe: 'הטקסט מציין: "The cerebellum controls our balance and coordination" - המוח הקטן שולט על האיזון והקואורדינציה.'
        },
        {
          questionNumber: 4,
          questionTextEn: 'What is the hippocampus responsible for?',
          questionTextHe: 'על מה ההיפוקמפוס אחראי?',
          options: ['Moving muscles', 'Forming memories', 'Controlling temperature', 'Making sounds'],
          correctAnswer: 1,
          explanationHe: 'לפי הטקסט: "The hippocampus is responsible for forming new memories and learning new information" - ההיפוקמפוס אחראי ליצירת זיכרונות חדשים.'
        },
        {
          questionNumber: 5,
          questionTextEn: 'What does neuroplasticity mean?',
          questionTextHe: 'מה משמעות נוירופלסטיות?',
          options: ['The brain never changes', 'The brain can change and adapt', 'The brain stops growing', 'The brain is made of plastic'],
          correctAnswer: 1,
          explanationHe: 'הכותב מגדיר: "This ability, called neuroplasticity, means we can always learn new skills" - היכולת של המוח להשתנות ולהסתגל.'
        }
      ]
    },

    // Paragraph 7: Social Media (Complexity 3)
    {
      titleEn: 'Social Media and Our Lives',
      titleHe: 'מדיה חברתית וחיינו',
      complexityLevel: 3,
      topic: 'Technology',
      content: `Social media has become a major part of modern life, especially for teenagers. Platforms like Instagram, TikTok, and Snapchat allow us to share photos, videos, and messages with friends instantly. These apps use complex algorithms to show us content we might like.

While social media can be fun and helpful for staying connected, it also has drawbacks. Some people spend too much time scrolling through feeds, which can affect their sleep and homework. The constant comparison with others' perfect posts can sometimes make people feel inadequate or sad.

Social media also has the power to influence opinions and spread information quickly. This can be positive when used to raise awareness about important issues. However, we must be careful to think critically about what we see online and not believe everything without checking if it's true.`,
      hardWords: [
        { word: 'algorithms', translation: 'אלגוריתמים' },
        { word: 'influence', translation: 'השפעה, להשפיע' },
        { word: 'platforms', translation: 'פלטפורמות' },
        { word: 'comparison', translation: 'השוואה' },
        { word: 'inadequate', translation: 'לא מספיק טוב' },
        { word: 'awareness', translation: 'מודעות' },
        { word: 'critically', translation: 'באופן ביקורתי' }
      ],
      questions: [
        {
          questionNumber: 1,
          questionTextEn: 'What do social media algorithms do?',
          questionTextHe: 'מה אלגוריתמים של מדיה חברתית עושים?',
          options: ['Delete posts', 'Show us content we might like', 'Take photos', 'Send emails'],
          correctAnswer: 1,
          explanationHe: 'הטקסט מסביר: "These apps use complex algorithms to show us content we might like" - האפליקציות משתמשות באלגוריתמים כדי להראות לנו תוכן שאולי נאהב.'
        },
        {
          questionNumber: 2,
          questionTextEn: 'What is one negative effect of spending too much time on social media?',
          questionTextHe: 'מהי השפעה שלילית אחת של בילוי זמן רב מדי במדיה חברתית?',
          options: ['Better grades', 'More friends', 'Affected sleep', 'More exercise'],
          correctAnswer: 2,
          explanationHe: 'הכותב מזכיר שזה "can affect their sleep and homework" - יכול להשפיע על השינה ועל שיעורי הבית.'
        },
        {
          questionNumber: 3,
          questionTextEn: 'Why might comparing ourselves to others\' posts be harmful?',
          questionTextHe: 'למה השוואה לפוסטים של אחרים עשויה להזיק?',
          options: ['It makes us famous', 'It can make people feel inadequate', 'It helps us learn', 'It saves time'],
          correctAnswer: 1,
          explanationHe: 'הטקסט אומר: "The constant comparison... can sometimes make people feel inadequate or sad" - ההשוואה יכולה לגרום לאנשים להרגיש לא מספיק טובים או עצובים.'
        },
        {
          questionNumber: 4,
          questionTextEn: 'What is one positive use of social media mentioned?',
          questionTextHe: 'מהו שימוש חיובי אחד במדיה חברתית שהוזכר?',
          options: ['Playing games', 'Raising awareness about issues', 'Avoiding homework', 'Sleeping better'],
          correctAnswer: 1,
          explanationHe: 'הכותב מזכיר: "This can be positive when used to raise awareness about important issues" - זה יכול להיות חיובי כשמשתמשים בזה כדי להעלות מודעות לנושאים חשובים.'
        },
        {
          questionNumber: 5,
          questionTextEn: 'What should we do before believing information online?',
          questionTextHe: 'מה צריך לעשות לפני שמאמינים למידע באינטרנט?',
          options: ['Share it immediately', 'Check if it\'s true', 'Ignore it', 'Delete it'],
          correctAnswer: 1,
          explanationHe: 'הכותב מדגיש: "we must be careful to think critically... and not believe everything without checking if it\'s true" - אנחנו חייבים לבדוק אם זה נכון.'
        }
      ]
    },

    // Paragraph 8: Space Exploration (Complexity 4)
    {
      titleEn: 'Journey to the Stars',
      titleHe: 'מסע אל הכוכבים',
      complexityLevel: 4,
      topic: 'Space',
      content: `Space exploration has captivated humanity's imagination for decades. Since the first astronaut, Yuri Gagarin, orbited Earth in 1961, we have made incredible progress in understanding our universe. Today, astronauts live and work on the International Space Station, conducting experiments that benefit life on Earth.

The challenges of space travel are immense. Astronauts must train for years to prepare for the physical and mental demands of living in zero gravity. They face extreme temperatures, dangerous radiation, and the psychological stress of being far from home. Yet, despite these obstacles, humans continue to push the boundaries of exploration.

Looking forward, space agencies are planning missions to Mars and beyond. These missions will require new technologies and international cooperation. Scientists believe that one day, humans might establish colonies on other planets. However, we must also consider the ethical implications of colonizing space and ensure we don't repeat the mistakes we've made on Earth.`,
      hardWords: [
        { word: 'astronaut', translation: 'אסטרונאוט, טייס חלל' },
        { word: 'gravitational', translation: 'כבידתי, הקשור לכוח המשיכה' },
        { word: 'radiation', translation: 'קרינה' },
        { word: 'psychological', translation: 'פסיכולוגי, נפשי' },
        { word: 'cooperation', translation: 'שיתוף פעולה' },
        { word: 'colonies', translation: 'מושבות' },
        { word: 'ethical implications', translation: 'השלכות מוסריות' }
      ],
      questions: [
        {
          questionNumber: 1,
          questionTextEn: 'Who was the first astronaut to orbit Earth?',
          questionTextHe: 'מי היה האסטרונאוט הראשון שהקיף את כדור הארץ?',
          options: ['Neil Armstrong', 'Yuri Gagarin', 'Buzz Aldrin', 'John Glenn'],
          correctAnswer: 1,
          explanationHe: 'הטקסט מציין בבירור: "Since the first astronaut, Yuri Gagarin, orbited Earth in 1961" - יורי גגרין היה הראשון.'
        },
        {
          questionNumber: 2,
          questionTextEn: 'Where do astronauts currently live and work in space?',
          questionTextHe: 'איפה אסטרונאוטים חיים ועובדים בחלל כיום?',
          options: ['On the Moon', 'On Mars', 'On the International Space Station', 'On satellites'],
          correctAnswer: 2,
          explanationHe: 'הכותב אומר: "astronauts live and work on the International Space Station" - אסטרונאוטים חיים ועובדים בתחנת החלל הבינלאומית.'
        },
        {
          questionNumber: 3,
          questionTextEn: 'What is one challenge astronauts face in space?',
          questionTextHe: 'מהו אתגר אחד שאסטרונאוטים מתמודדים איתו בחלל?',
          options: ['Too much food', 'Living in zero gravity', 'Too many visitors', 'Loud noises'],
          correctAnswer: 1,
          explanationHe: 'הטקסט מתאר מספר אתגרים, כולל: "living in zero gravity" - חיים בהעדר כוח משיכה.'
        },
        {
          questionNumber: 4,
          questionTextEn: 'Where are space agencies planning future missions?',
          questionTextHe: 'לאן סוכנויות החלל מתכננות משימות עתידיות?',
          options: ['To the Moon only', 'To Mars and beyond', 'Back to Earth', 'To the Sun'],
          correctAnswer: 1,
          explanationHe: 'הכותב מציין: "space agencies are planning missions to Mars and beyond" - סוכנויות החלל מתכננות משימות למאדים ומעבר לו.'
        },
        {
          questionNumber: 5,
          questionTextEn: 'What should we be careful about when colonizing space?',
          questionTextHe: 'ממה צריך להיזהר כשמתיישבים בחלל?',
          options: ['Building too fast', 'Not repeating Earth\'s mistakes', 'Spending too much money', 'Forgetting Earth'],
          correctAnswer: 1,
          explanationHe: 'הכותב מזהיר: "ensure we don\'t repeat the mistakes we\'ve made on Earth" - לוודא שלא נחזור על הטעויות שעשינו על כדור הארץ.'
        }
      ]
    },

    // Paragraph 9: Ancient Egypt (Complexity 4)
    {
      titleEn: 'Mysteries of Ancient Egypt',
      titleHe: 'תעלומות מצרים העתיקה',
      complexityLevel: 4,
      topic: 'History',
      content: `Ancient Egypt was one of the most advanced civilizations in history. For over 3,000 years, powerful pharaohs ruled from magnificent palaces along the Nile River. The Egyptians built impressive pyramids that still stand today, showcasing their incredible engineering skills.

The ancient Egyptians developed a complex writing system called hieroglyphics. These symbols represented words and sounds, allowing them to record their history, religious beliefs, and daily activities. Archaeologists have spent decades deciphering these ancient texts, unlocking secrets about Egyptian society.

Life in ancient Egypt was centered around the Nile River, which provided water, food, and transportation. Egyptian farmers grew wheat and barley in the fertile soil left by annual floods. The society was highly organized, with different social classes including scribes, craftsmen, and slaves. Despite being thousands of years old, Egyptian innovations in medicine, mathematics, and architecture continue to influence our world today.`,
      hardWords: [
        { word: 'pharaoh', translation: 'פרעה' },
        { word: 'hieroglyphics', translation: 'כתב חרטומים, היירוגליפים' },
        { word: 'pyramids', translation: 'פירמידות' },
        { word: 'archaeologists', translation: 'ארכיאולוגים' },
        { word: 'deciphering', translation: 'פיענוח' },
        { word: 'fertile', translation: 'פורה' },
        { word: 'innovations', translation: 'חידושים' }
      ],
      questions: [
        {
          questionNumber: 1,
          questionTextEn: 'How long did ancient Egyptian civilization last?',
          questionTextHe: 'כמה זמן נמשכה הציוויליזציה המצרית העתיקה?',
          options: ['100 years', '1,000 years', 'Over 3,000 years', '5,000 years'],
          correctAnswer: 2,
          explanationHe: 'הטקסט אומר: "For over 3,000 years, powerful pharaohs ruled" - למעלה מ-3,000 שנה.'
        },
        {
          questionNumber: 2,
          questionTextEn: 'What was the Egyptian writing system called?',
          questionTextHe: 'איך נקראה מערכת הכתיבה המצרית?',
          options: ['Alphabet', 'Hieroglyphics', 'Cuneiform', 'Latin'],
          correctAnswer: 1,
          explanationHe: 'הכותב מסביר: "The ancient Egyptians developed a complex writing system called hieroglyphics" - היירוגליפים.'
        },
        {
          questionNumber: 3,
          questionTextEn: 'What was the center of Egyptian life?',
          questionTextHe: 'מה היה מרכז החיים במצרים?',
          options: ['The desert', 'The Nile River', 'The pyramids', 'The palace'],
          correctAnswer: 1,
          explanationHe: 'הטקסט מציין: "Life in ancient Egypt was centered around the Nile River" - החיים במצרים התמקדו סביב נהר הנילוס.'
        },
        {
          questionNumber: 4,
          questionTextEn: 'Why was the Nile River important to farmers?',
          questionTextHe: 'למה נהר הנילוס היה חשוב לחקלאים?',
          options: ['It was beautiful', 'Annual floods left fertile soil', 'It was cold', 'Fish lived there'],
          correctAnswer: 1,
          explanationHe: 'הכותב מסביר: "Egyptian farmers grew wheat and barley in the fertile soil left by annual floods" - השיטפונות השנתיים השאירו אדמה פורייה.'
        },
        {
          questionNumber: 5,
          questionTextEn: 'What have archaeologists been doing with hieroglyphics?',
          questionTextHe: 'מה ארכיאולוגים עושים עם ההירוגליפים?',
          options: ['Destroying them', 'Deciphering them', 'Copying them only', 'Ignoring them'],
          correctAnswer: 1,
          explanationHe: 'הטקסט אומר: "Archaeologists have spent decades deciphering these ancient texts" - ארכיאולוגים מבלים עשרות שנים בפענוח הטקסטים העתיקים.'
        }
      ]
    },

    // Paragraph 10: Healthy Eating (Complexity 2)
    {
      titleEn: 'Eating Healthy and Feeling Great',
      titleHe: 'אכילה בריאה והרגשה מצוינת',
      complexityLevel: 2,
      topic: 'Health',
      content: `Eating healthy food is one of the best things we can do for our bodies. When we choose nutritious meals, we give our bodies the nutrients they need to grow strong and stay energized. Fruits, vegetables, whole grains, and proteins are all important parts of a balanced diet.

Many teenagers love fast food because it tastes good and is convenient. However, eating too much fast food can be harmful. These foods often contain high amounts of sugar, salt, and unhealthy fats. Over time, poor eating habits can lead to health problems like obesity and low energy.

The good news is that healthy eating doesn't have to be boring! There are many delicious ways to prepare nutritious meals. Try adding colorful vegetables to your meals, snacking on fruits instead of chips, and drinking water instead of sugary sodas. Your body's digestion system will thank you, and you'll feel more alert and happy throughout the day.`,
      hardWords: [
        { word: 'nutrients', translation: 'חומרים מזינים' },
        { word: 'digestion', translation: 'עיכול' },
        { word: 'convenient', translation: 'נוח' },
        { word: 'obesity', translation: 'השמנת יתר' },
        { word: 'nutritious', translation: 'מזין' },
        { word: 'alert', translation: 'ערני, קשוב' },
        { word: 'balanced diet', translation: 'תזונה מאוזנת' }
      ],
      questions: [
        {
          questionNumber: 1,
          questionTextEn: 'What do nutrients help our bodies do?',
          questionTextHe: 'במה חומרים מזינים עוזרים לגוף שלנו?',
          options: ['Sleep longer', 'Grow strong and stay energized', 'Play games', 'Watch TV'],
          correctAnswer: 1,
          explanationHe: 'הטקסט מסביר: "we give our bodies the nutrients they need to grow strong and stay energized" - חומרים מזינים עוזרים לגדול חזק ולהישאר עם אנרגיה.'
        },
        {
          questionNumber: 2,
          questionTextEn: 'Why do many teenagers love fast food?',
          questionTextHe: 'למה הרבה בני נוער אוהבים מזון מהיר?',
          options: ['It\'s healthy', 'It tastes good and is convenient', 'It\'s expensive', 'It\'s colorful'],
          correctAnswer: 1,
          explanationHe: 'הכותב אומר: "Many teenagers love fast food because it tastes good and is convenient" - זה טעים ונוח.'
        },
        {
          questionNumber: 3,
          questionTextEn: 'What problem can poor eating habits lead to?',
          questionTextHe: 'לאיזו בעיה הרגלי אכילה גרועים יכולים להוביל?',
          options: ['Better grades', 'More friends', 'Obesity and low energy', 'Stronger muscles'],
          correctAnswer: 2,
          explanationHe: 'הטקסט מזהיר: "poor eating habits can lead to health problems like obesity and low energy" - השמנה ואנרגיה נמוכה.'
        },
        {
          questionNumber: 4,
          questionTextEn: 'What is one healthy snack suggestion from the text?',
          questionTextHe: 'מהי הצעה אחת לחטיף בריא מהטקסט?',
          options: ['Chips', 'Candy', 'Fruits', 'Cookies'],
          correctAnswer: 2,
          explanationHe: 'הכותב ממליץ: "snacking on fruits instead of chips" - לחטוף פירות במקום צ\'יפס.'
        },
        {
          questionNumber: 5,
          questionTextEn: 'What should we drink instead of sugary sodas?',
          questionTextHe: 'מה צריך לשתות במקום משקאות ממותקים?',
          options: ['Coffee', 'Juice', 'Water', 'Milk only'],
          correctAnswer: 2,
          explanationHe: 'הטקסט ממליץ: "drinking water instead of sugary sodas" - לשתות מים במקום משקאות מוגזים ממותקים.'
        }
      ]
    },

    // Paragraph 11: Video Games (Complexity 2)
    {
      titleEn: 'The World of Video Games',
      titleHe: 'עולם משחקי המחשב',
      complexityLevel: 2,
      topic: 'Entertainment',
      content: `Video games have become one of the most popular forms of entertainment worldwide. Modern games feature incredible graphics, exciting stories, and the ability to play with friends online. Many games create virtual worlds where players can explore, compete, and solve puzzles.

Gaming can actually have some positive effects. Strategy games help improve problem-solving skills and quick thinking. Multiplayer games teach teamwork and communication. Some games even encourage creativity, allowing players to build and design their own virtual environments.

However, it's important to balance gaming with other activities. Spending too much time playing games can affect schoolwork, physical health, and real-world social interactions. Setting time limits and taking breaks are essential. Remember, games should be a fun hobby, not something that takes over your entire life.`,
      hardWords: [
        { word: 'virtual', translation: 'וירטואלי, מדומה' },
        { word: 'competitive', translation: 'תחרותי' },
        { word: 'strategy', translation: 'אסטרטגיה' },
        { word: 'multiplayer', translation: 'רב-משתתפים' },
        { word: 'creativity', translation: 'יצירתיות' },
        { word: 'essential', translation: 'חיוני, הכרחי' },
        { word: 'interactions', translation: 'אינטראקציות, יחסי גומלין' }
      ],
      questions: [
        {
          questionNumber: 1,
          questionTextEn: 'What features do modern games have?',
          questionTextHe: 'אילו תכונות יש למשחקים מודרניים?',
          options: ['Only music', 'Graphics, stories, and online play', 'Just text', 'Nothing special'],
          correctAnswer: 1,
          explanationHe: 'הטקסט מתאר: "Modern games feature incredible graphics, exciting stories, and the ability to play with friends online" - גרפיקה מדהימה, סיפורים מרגשים ויכולת למשחק מקוון.'
        },
        {
          questionNumber: 2,
          questionTextEn: 'How can strategy games help players?',
          questionTextHe: 'איך משחקי אסטרטגיה יכולים לעזור לשחקנים?',
          options: ['Make them tired', 'Improve problem-solving skills', 'Waste their time', 'Make them sleepy'],
          correctAnswer: 1,
          explanationHe: 'הכותב מסביר: "Strategy games help improve problem-solving skills and quick thinking" - משחקי אסטרטגיה עוזרים לשפר כישורי פתרון בעיות.'
        },
        {
          questionNumber: 3,
          questionTextEn: 'What do multiplayer games teach?',
          questionTextHe: 'מה משחקים רב-משתתפים מלמדים?',
          options: ['How to be alone', 'Teamwork and communication', 'How to sleep', 'How to read'],
          correctAnswer: 1,
          explanationHe: 'לפי הטקסט: "Multiplayer games teach teamwork and communication" - משחקים רב-משתתפים מלמדים עבודת צוות ותקשורת.'
        },
        {
          questionNumber: 4,
          questionTextEn: 'What can spending too much time gaming affect?',
          questionTextHe: 'על מה בילוי זמן רב מדי במשחקים יכול להשפיע?',
          options: ['Nothing at all', 'Schoolwork and health', 'Only sleep', 'Only food'],
          correctAnswer: 1,
          explanationHe: 'הכותב מזהיר: "Spending too much time playing games can affect schoolwork, physical health, and real-world social interactions" - משפיע על לימודים, בריאות ויחסים חברתיים.'
        },
        {
          questionNumber: 5,
          questionTextEn: 'What should games be according to the text?',
          questionTextHe: 'מה משחקים צריכים להיות לפי הטקסט?',
          options: ['Your whole life', 'A fun hobby', 'A job', 'A problem'],
          correctAnswer: 1,
          explanationHe: 'הטקסט מסכם: "games should be a fun hobby, not something that takes over your entire life" - משחקים צריכים להיות תחביב מהנה, לא משהו שמשתלט על כל החיים.'
        }
      ]
    },

    // Paragraph 12: Ocean Life (Complexity 3)
    {
      titleEn: 'Exploring Ocean Life',
      titleHe: 'חקר חיי הים',
      complexityLevel: 3,
      topic: 'Nature',
      content: `The ocean covers more than 70% of Earth's surface and is home to incredible biodiversity. From tiny plankton to massive blue whales, millions of species live in marine ecosystems. Coral reefs alone support about 25% of all ocean species, despite covering less than 1% of the ocean floor.

Ocean life exists at all depths, from the sunny surface waters to the dark deep sea. Each zone has unique conditions and creatures adapted to survive there. Some deep-sea fish produce their own light through bioluminescence, allowing them to see and communicate in complete darkness.

Unfortunately, human activities are threatening ocean ecosystems. Overfishing, pollution, and climate change are damaging marine habitats and causing species to decline. Protecting our oceans is crucial not just for sea creatures, but for humans too. Oceans produce much of the oxygen we breathe and absorb carbon dioxide from the atmosphere.`,
      hardWords: [
        { word: 'ecosystem', translation: 'מערכת אקולוגית' },
        { word: 'biodiversity', translation: 'מגוון ביולוגי' },
        { word: 'plankton', translation: 'פלנקטון' },
        { word: 'bioluminescence', translation: 'ביולומינסנציה (הארה עצמית)' },
        { word: 'overfishing', translation: 'דיג יתר' },
        { word: 'marine habitats', translation: 'בתי גידול ימיים' },
        { word: 'crucial', translation: 'קריטי, חיוני' }
      ],
      questions: [
        {
          questionNumber: 1,
          questionTextEn: 'How much of Earth\'s surface do oceans cover?',
          questionTextHe: 'כמה אחוזים משטח כדור הארץ מכוסה באוקיינוסים?',
          options: ['30%', '50%', 'More than 70%', '90%'],
          correctAnswer: 2,
          explanationHe: 'הטקסט מתחיל ב: "The ocean covers more than 70% of Earth\'s surface" - יותר מ-70% משטח כדור הארץ.'
        },
        {
          questionNumber: 2,
          questionTextEn: 'What percentage of ocean species do coral reefs support?',
          questionTextHe: 'כמה אחוזים ממיני האוקיינוס שוניות האלמוגים תומכות?',
          options: ['5%', '10%', '25%', '50%'],
          correctAnswer: 2,
          explanationHe: 'הכותב מציין: "Coral reefs alone support about 25% of all ocean species" - שוניות האלמוגים תומכות בכ-25% מכל מיני האוקיינוס.'
        },
        {
          questionNumber: 3,
          questionTextEn: 'How do some deep-sea fish see in darkness?',
          questionTextHe: 'איך דגים מהים העמוק רואים בחושך?',
          options: ['They use flashlights', 'They produce their own light', 'They don\'t see', 'They use sound'],
          correctAnswer: 1,
          explanationHe: 'הטקסט מסביר: "Some deep-sea fish produce their own light through bioluminescence" - דגים מהים העמוק מייצרים אור משלהם.'
        },
        {
          questionNumber: 4,
          questionTextEn: 'What is one threat to ocean ecosystems?',
          questionTextHe: 'מהו איום אחד על מערכות אקולוגיות ימיות?',
          options: ['Too many fish', 'Overfishing', 'Too much water', 'More coral'],
          correctAnswer: 1,
          explanationHe: 'הכותב מונה מספר איומים, כולל: "Overfishing, pollution, and climate change" - דיג יתר, זיהום ושינויי אקלים.'
        },
        {
          questionNumber: 5,
          questionTextEn: 'Why are oceans important for humans?',
          questionTextHe: 'למה אוקיינוסים חשובים לבני אדם?',
          options: ['Only for swimming', 'They produce oxygen we breathe', 'They are pretty', 'For ships only'],
          correctAnswer: 1,
          explanationHe: 'הטקסט מדגיש: "Oceans produce much of the oxygen we breathe and absorb carbon dioxide" - האוקיינוסים מייצרים הרבה מהחמצן שאנו נושמים.'
        }
      ]
    },

    // Paragraph 13: Robotics & AI (Complexity 4)
    {
      titleEn: 'Robots and Artificial Intelligence',
      titleHe: 'רובוטים ובינה מלאכותית',
      complexityLevel: 4,
      topic: 'Technology',
      content: `Artificial intelligence and robotics are transforming the way we live and work. AI systems can now recognize faces, understand speech, and even create art. Robots are being used in factories for automation, in hospitals to assist with surgeries, and in homes to help with daily tasks like cleaning.

The development of AI raises important questions about the future of work. As machines become more capable of performing tasks traditionally done by humans, some jobs may become obsolete. However, new opportunities are also emerging in fields like AI programming, robot maintenance, and human-AI collaboration.

While AI offers many benefits, we must also consider the ethical challenges it presents. Issues like privacy, bias in algorithms, and the potential misuse of technology need careful attention. As students preparing for the future, understanding both the possibilities and limitations of AI will be essential. The key is to develop these technologies responsibly, ensuring they benefit all of humanity.`,
      hardWords: [
        { word: 'artificial', translation: 'מלאכותי' },
        { word: 'automation', translation: 'אוטומציה, תהליך אוטומטי' },
        { word: 'capable', translation: 'מסוגל' },
        { word: 'obsolete', translation: 'מיושן, לא רלוונטי' },
        { word: 'collaboration', translation: 'שיתוף פעולה' },
        { word: 'ethical', translation: 'מוסרי' },
        { word: 'responsibly', translation: 'באחריות' }
      ],
      questions: [
        {
          questionNumber: 1,
          questionTextEn: 'What can AI systems do now?',
          questionTextHe: 'מה מערכות בינה מלאכותית יכולות לעשות כיום?',
          options: ['Only play games', 'Recognize faces and understand speech', 'Nothing useful', 'Only turn on lights'],
          correctAnswer: 1,
          explanationHe: 'הטקסט מציין: "AI systems can now recognize faces, understand speech, and even create art" - מערכות AI יכולות לזהות פנים, להבין דיבור ואף ליצור אמנות.'
        },
        {
          questionNumber: 2,
          questionTextEn: 'Where are robots being used?',
          questionTextHe: 'איפה משתמשים ברובוטים?',
          options: ['Only in schools', 'Only in space', 'In factories, hospitals, and homes', 'Nowhere'],
          correctAnswer: 2,
          explanationHe: 'הכותב מונה: "Robots are being used in factories... in hospitals... and in homes" - רובוטים משמשים במפעלים, בבתי חולים ובבתים.'
        },
        {
          questionNumber: 3,
          questionTextEn: 'What concern does AI raise about jobs?',
          questionTextHe: 'איזו דאגה מעלה AI לגבי מקומות עבודה?',
          options: ['Too many new jobs', 'Some jobs may become obsolete', 'Everyone will be rich', 'No concerns'],
          correctAnswer: 1,
          explanationHe: 'הטקסט מזכיר: "some jobs may become obsolete" - חלק מהמשרות עלולות להפוך למיושנות.'
        },
        {
          questionNumber: 4,
          questionTextEn: 'What is one ethical challenge mentioned?',
          questionTextHe: 'מהו אתגר אתי אחד שהוזכר?',
          options: ['Robots are too expensive', 'Privacy and bias in algorithms', 'AI is too slow', 'Not enough robots'],
          correctAnswer: 1,
          explanationHe: 'הכותב מונה אתגרים כמו: "Issues like privacy, bias in algorithms, and the potential misuse of technology" - פרטיות, הטיה באלגוריתמים ושימוש לרעה בטכנולוגיה.'
        },
        {
          questionNumber: 5,
          questionTextEn: 'How should we develop AI technologies?',
          questionTextHe: 'איך צריך לפתח טכנולוגיות AI?',
          options: ['As fast as possible', 'Responsibly to benefit humanity', 'Without any rules', 'Only for profit'],
          correctAnswer: 1,
          explanationHe: 'הטקסט מדגיש: "The key is to develop these technologies responsibly, ensuring they benefit all of humanity" - המפתח הוא לפתח את הטכנולוגיות בצורה אחראית.'
        }
      ]
    },

    // Paragraph 14: The Olympics (Complexity 3)
    {
      titleEn: 'The Olympic Games',
      titleHe: 'המשחקים האולימפיים',
      complexityLevel: 3,
      topic: 'Sports',
      content: `The Olympic Games are the world's premier international sporting event, bringing together athletes from nearly every country. The modern Olympics began in 1896 in Athens, Greece, reviving an ancient Greek tradition. Today, both Summer and Winter Olympics are held every four years, featuring hundreds of events across dozens of sports.

The Olympics represent more than just athletic competition. They embody values like sportsmanship, dedication, and respect. Athletes train for years, often sacrificing social activities and facing countless challenges to represent their countries. The Olympic motto, "Faster, Higher, Stronger," inspires competitors to push beyond their limits.

The Games also promote international cooperation and peace. For a few weeks, nations that might have political differences come together in friendly competition. Many Olympic moments have become legendary, like Jesse Owens' victories in 1936 or the "Miracle on Ice" in 1980. These stories remind us that sports have the power to unite people and inspire generations.`,
      hardWords: [
        { word: 'sportsmanship', translation: 'רוח ספורטיבית' },
        { word: 'dedication', translation: 'מסירות, התמדה' },
        { word: 'premier', translation: 'מוביל, ראשון במעלה' },
        { word: 'embody', translation: 'מגלם' },
        { word: 'sacrificing', translation: 'מקריב' },
        { word: 'legendary', translation: 'אגדי' },
        { word: 'unite', translation: 'לאחד' }
      ],
      questions: [
        {
          questionNumber: 1,
          questionTextEn: 'When did the modern Olympics begin?',
          questionTextHe: 'מתי התחילו האולימפיאדה המודרנית?',
          options: ['In 1776', 'In 1896', 'In 1936', 'In 1980'],
          correctAnswer: 1,
          explanationHe: 'הטקסט מציין: "The modern Olympics began in 1896 in Athens, Greece" - האולימפיאדה המודרנית התחילה ב-1896 באתונה.'
        },
        {
          questionNumber: 2,
          questionTextEn: 'How often are the Olympics held?',
          questionTextHe: 'באיזו תדירות נערכת האולימפיאדה?',
          options: ['Every year', 'Every two years', 'Every four years', 'Every ten years'],
          correctAnswer: 2,
          explanationHe: 'הכותב אומר: "both Summer and Winter Olympics are held every four years" - אולימפיאדת הקיץ והחורף נערכות כל ארבע שנים.'
        },
        {
          questionNumber: 3,
          questionTextEn: 'What is the Olympic motto?',
          questionTextHe: 'מהו המוטו האולימפי?',
          options: ['Never give up', 'Faster, Higher, Stronger', 'Win at all costs', 'Just do it'],
          correctAnswer: 1,
          explanationHe: 'הטקסט מזכיר: "The Olympic motto, \'Faster, Higher, Stronger\'" - המוטו האולימפי הוא "מהיר יותר, גבוה יותר, חזק יותר".'
        },
        {
          questionNumber: 4,
          questionTextEn: 'What values do the Olympics embody?',
          questionTextHe: 'אילו ערכים האולימפיאדה מייצגת?',
          options: ['Only winning', 'Sportsmanship, dedication, and respect', 'Making money', 'Being famous'],
          correctAnswer: 1,
          explanationHe: 'הכותב מסביר: "They embody values like sportsmanship, dedication, and respect" - הם מגלמים ערכים כמו רוח ספורטיבית, מסירות וכבוד.'
        },
        {
          questionNumber: 5,
          questionTextEn: 'What do the Olympics promote besides competition?',
          questionTextHe: 'מה האולימפיאדה מקדמת מלבד תחרות?',
          options: ['War', 'International cooperation and peace', 'Separation', 'Conflict'],
          correctAnswer: 1,
          explanationHe: 'הטקסט מדגיש: "The Games also promote international cooperation and peace" - המשחקים גם מקדמים שיתוף פעולה בינלאומי ושלום.'
        }
      ]
    },

    // Paragraph 15: Time Travel (Fiction) (Complexity 5)
    {
      titleEn: 'The Mystery of Time Travel',
      titleHe: 'תעלומת המסע בזמן',
      complexityLevel: 5,
      topic: 'Science Fiction',
      content: `Time travel has fascinated scientists and storytellers for over a century. While it remains purely theoretical, physicists have explored various scenarios where time travel might be possible. Einstein's theory of relativity suggests that time moves differently depending on speed and gravity. Theoretically, if you could travel near the speed of light, time would pass more slowly for you than for people on Earth.

One famous thought experiment is the "grandfather paradox." This hypothesis asks: What if you traveled back in time and prevented your grandfather from meeting your grandmother? You would never be born, so how could you travel back in time in the first place? This logical contradiction has led scientists to propose many theories, including parallel universes and predetermined timelines.

Despite these fascinating ideas, most scientists believe practical time travel is impossible due to enormous energy requirements and fundamental laws of physics. However, thinking about time travel helps us understand the nature of the universe better. It challenges our assumptions about causality, free will, and the structure of reality itself. Whether or not we ever build a time machine, the concept continues to inspire both scientific inquiry and creative imagination.`,
      hardWords: [
        { word: 'paradox', translation: 'פרדוקס, סתירה' },
        { word: 'hypothesis', translation: 'השערה, הנחה' },
        { word: 'relativity', translation: 'יחסות (תורת)' },
        { word: 'predetermined', translation: 'נקבע מראש' },
        { word: 'causality', translation: 'סיבתיות' },
        { word: 'fundamental', translation: 'בסיסי, יסודי' },
        { word: 'inquiry', translation: 'חקירה, מחקר' }
      ],
      questions: [
        {
          questionNumber: 1,
          questionTextEn: 'According to Einstein\'s theory, what affects how time moves?',
          questionTextHe: 'לפי תיאוריית איינשטיין, מה משפיע על האופן שבו הזמן נע?',
          options: ['Only the weather', 'Speed and gravity', 'Only temperature', 'The Moon'],
          correctAnswer: 1,
          explanationHe: 'הטקסט מסביר: "Einstein\'s theory of relativity suggests that time moves differently depending on speed and gravity" - לפי תורת היחסות, הזמן נע אחרת בהתאם למהירות ולכוח המשיכה.'
        },
        {
          questionNumber: 2,
          questionTextEn: 'What is the "grandfather paradox"?',
          questionTextHe: 'מהו "פרדוקס הסבא"?',
          options: ['A story about families', 'A time travel contradiction about preventing your own birth', 'A type of clock', 'A grandfather\'s story'],
          correctAnswer: 1,
          explanationHe: 'הכותב מתאר: אם תמנע מהסבא שלך לפגוש את הסבתא, לא תיוולד - אז איך יכולת לנסוע אחורה בזמן? זוהי סתירה לוגית.'
        },
        {
          questionNumber: 3,
          questionTextEn: 'What have scientists proposed to solve time travel paradoxes?',
          questionTextHe: 'מה מדענים הציעו כדי לפתור פרדוקסים של מסע בזמן?',
          options: ['Ignore the problems', 'Parallel universes and predetermined timelines', 'Stop thinking about it', 'Time doesn\'t exist'],
          correctAnswer: 1,
          explanationHe: 'הטקסט מציין: "scientists to propose many theories, including parallel universes and predetermined timelines" - מדענים הציעו תיאוריות כמו יקומים מקבילים וציר זמן מוגדר מראש.'
        },
        {
          questionNumber: 4,
          questionTextEn: 'Why do most scientists think practical time travel is impossible?',
          questionTextHe: 'למה רוב המדענים חושבים שמסע בזמן מעשי הוא בלתי אפשרי?',
          options: ['It\'s too expensive', 'Enormous energy requirements and physics laws', 'Nobody wants it', 'It\'s boring'],
          correctAnswer: 1,
          explanationHe: 'הכותב מסביר: "most scientists believe practical time travel is impossible due to enormous energy requirements and fundamental laws of physics" - בגלל דרישות אנרגיה עצומות וחוקי פיזיקה בסיסיים.'
        },
        {
          questionNumber: 5,
          questionTextEn: 'What does thinking about time travel help us understand?',
          questionTextHe: 'במה חשיבה על מסע בזמן עוזרת לנו להבין?',
          options: ['How to cook', 'The nature of the universe', 'How to drive', 'How to sleep'],
          correctAnswer: 1,
          explanationHe: 'הטקסט מסכם: "thinking about time travel helps us understand the nature of the universe better" - חשיבה על מסע בזמן עוזרת לנו להבין את טבע היקום טוב יותר.'
        }
      ]
    }
  ];
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedUnseenParagraphs()
    .then(() => {
      console.log('Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedUnseenParagraphs };
