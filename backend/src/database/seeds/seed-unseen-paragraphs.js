/**
 * The reading texts of the Unseen section (website and Telegram /unseen) and
 * their questions, as plain data. `npm run generate-data -- --unseen` builds
 * backend/data/static/unseen_paragraphs.json and unseen_questions.json from
 * it, keeping the ids of texts and questions that already exist (students'
 * progress refers to them). The content rules: backend/create-unseen.md.
 */

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
    },

    // Paragraph 16: The Great Bird Migration (Complexity 3)
    {
      titleEn: 'The Great Bird Migration',
      titleHe: 'המסע הגדול של הציפורים',
      complexityLevel: 3,
      topic: 'Animals',
      content: `Twice a year, the sky above Israel becomes a busy highway. In autumn, hundreds of millions of birds fly through it from Europe and Asia to Africa, and in spring they fly back. This journey is called migration. Israel is on one of the main routes because it is a narrow land bridge between Africa and Asia. Some birds stop here: every winter, tens of thousands of cranes stay in the Hula Valley.

Why do birds travel so far? The main reason is food. In the cold northern winter, insects and seeds are hard to find, while Africa is warmer and has more food. In spring, the birds return north to build nests and raise their chicks. But how do they find their way? Scientists believe they use the sun, the stars, the Earth's magnetic field and landmarks such as rivers and mountains.

The journey is also full of dangers. Before they leave, many birds eat more than usual and store fat as fuel. But some still become exhausted over deserts and seas, where there is little food or water. Storms can push them off their route, and bright city lights at night can confuse them. Many birds are also losing the wetlands where they rest, so people in many countries try to protect these places.`,
      hardWords: [
        { word: 'migration', translation: 'נדידה' },
        { word: 'land bridge', translation: 'גשר יבשתי (רצועת יבשה שמחברת בין יבשות)' },
        { word: 'cranes', translation: 'עגורים' },
        { word: 'chicks', translation: 'גוזלים' },
        { word: 'landmarks', translation: 'ציוני דרך' },
        { word: 'exhausted', translation: 'מותשים, עייפים מאוד' },
        { word: 'wetlands', translation: 'אזורי ביצות, שטחים לחים' }
      ],
      questions: [
        {
          questionNumber: 1,
          questionTextEn: 'What do tens of thousands of cranes do every winter?',
          questionTextHe: 'מה עושים עשרות אלפי עגורים בכל חורף?',
          options: ['They fly on to Africa', 'They stay in the Hula Valley', 'They fly back north to Europe', 'They build nests in Israel'],
          correctAnswer: 1,
          explanationHe: 'הטקסט אומר: "every winter, tens of thousands of cranes stay in the Hula Valley" - העגורים לא ממשיכים לאפריקה, אלא נשארים בעמק החולה כל החורף.'
        },
        {
          questionNumber: 2,
          questionTextEn: 'According to the text, what is the main reason that birds migrate?',
          questionTextHe: 'לפי הטקסט, מהי הסיבה העיקרית לכך שציפורים נודדות?',
          options: ['To build nests in Africa', 'To get away from storms', 'To find wetlands to rest in', 'To find enough food to eat'],
          correctAnswer: 3,
          explanationHe: 'הטקסט אומר: "The main reason is food" - בחורף הקר קשה למצוא בצפון חרקים וזרעים, ובאפריקה חם יותר ויש יותר מזון.'
        },
        {
          questionNumber: 3,
          questionTextEn: 'In paragraph 2, the word "raise" is closest in meaning to:',
          questionTextHe: 'בפסקה 2, מהי המשמעות הקרובה ביותר של המילה "raise"?',
          options: ['take care of', 'lift up', 'look for', 'leave behind'],
          correctAnswer: 0,
          explanationHe: 'הטקסט אומר: "to build nests and raise their chicks" - הציפורים בונות קנים ומגדלות את הגוזלים, כלומר דואגות להם עד שיגדלו. כאן raise אינו במובן של להרים.'
        },
        {
          questionNumber: 4,
          questionTextEn: 'What can we infer about birds that fly over deserts and seas?',
          questionTextHe: 'מה אפשר להסיק על ציפורים שעפות מעל מדבריות וימים?',
          options: ['They need the fat they stored before the trip', 'They find a lot of food and water there', 'They stop there to build their nests', 'They follow bright city lights to find their way'],
          correctAnswer: 0,
          explanationHe: 'לפני המסע הציפורים "store fat as fuel", ומעל מדבריות וימים יש "little food or water" - לכן הן זקוקות לשומן שאגרו כדי להמשיך לעוף.'
        },
        {
          questionNumber: 5,
          questionTextEn: 'What is the text mainly about?',
          questionTextHe: 'במה עוסק הטקסט בעיקר?',
          options: ['The cranes that spend the winter in the Hula Valley', 'The way birds build nests and raise chicks', 'The long journeys that many birds make every year', 'The dangers of bright lights in big cities'],
          correctAnswer: 2,
          explanationHe: 'הטקסט מתאר את המסע הארוך של הציפורים - "This journey is called migration" - ומסביר למה הן נודדות, איך הן מוצאות את הדרך ואילו סכנות יש בדרך. העגורים והאורות הם רק דוגמאות.'
        }
      ]
    },

    // Paragraph 17: Music in Every Culture (Complexity 3)
    {
      titleEn: 'Music in Every Culture',
      titleHe: 'מוזיקה בכל תרבות ותרבות',
      complexityLevel: 3,
      topic: 'Music',
      content: `Every known culture in the world makes music. Scientists have studied hundreds of cultures and have never found one without songs. Music is also very old. Some of the oldest instruments ever found are flutes made from bird bones, and they are more than 35,000 years old. Today, each place has its own instruments and songs, but people everywhere sing and play.

People use music for many things. We sing and dance to celebrate weddings, birthdays and holidays. Music also helps us remember. Long before people could write, they passed on their stories and history through songs. Even today, many children learn the alphabet with a song. Music can also help people work together. In the past, sailors sang while they pulled heavy ropes, and the steady beat helped everyone pull at the same moment.

Music also passes from older people to younger ones. All over the world, children learn songs from their families, and many learn to play an instrument. This takes time and patience. At first, a beginner's fingers may hurt, and the sounds may not be beautiful. Many music teachers say that practicing a little every day is better than practicing for hours once a week. It is hard work, but every new player helps keep a very old tradition alive.`,
      hardWords: [
        { word: 'instruments', translation: 'כלי נגינה' },
        { word: 'flutes', translation: 'חלילים' },
        { word: 'passed on', translation: 'העבירו הלאה (לדורות הבאים)' },
        { word: 'sailors', translation: 'מלחים' },
        { word: 'ropes', translation: 'חבלים' },
        { word: 'beat', translation: 'קצב, פעימה (במוזיקה)' },
        { word: 'patience', translation: 'סבלנות' }
      ],
      questions: [
        {
          questionNumber: 1,
          questionTextEn: 'According to the text, what have scientists found?',
          questionTextHe: 'לפי הטקסט, מה גילו המדענים?',
          options: ['Every culture they studied has songs', 'One culture they studied has no songs', 'Some songs are more than 35,000 years old', 'Music began about 3,500 years ago'],
          correctAnswer: 0,
          explanationHe: 'הטקסט אומר: "Scientists have studied hundreds of cultures and have never found one without songs" - לא נמצאה אף תרבות בלי שירים, כלומר בכל תרבות שנחקרה יש שירים. ו-35,000 השנים הן הגיל של החלילים, לא של שירים.'
        },
        {
          questionNumber: 2,
          questionTextEn: 'Before people could write, how did they pass on their history?',
          questionTextHe: 'לפני שבני האדם ידעו לכתוב, איך הם העבירו את ההיסטוריה שלהם?',
          options: ['By playing flutes', 'By dancing at weddings', 'By singing songs', 'By clapping a beat'],
          correctAnswer: 2,
          explanationHe: 'הטקסט אומר: "Long before people could write, they passed on their stories and history through songs" - הם העבירו את הסיפורים וההיסטוריה שלהם בשירים.'
        },
        {
          questionNumber: 3,
          questionTextEn: 'In paragraph 2, the word "steady" is closest in meaning to:',
          questionTextHe: 'בפסקה 2, מהי המשמעות הקרובה ביותר של המילה "steady"?',
          options: ['loud', 'fast', 'powerful', 'regular'],
          correctAnswer: 3,
          explanationHe: 'הטקסט אומר: "the steady beat helped everyone pull at the same moment" - כדי שכל המלחים ימשכו בדיוק באותו רגע, הקצב צריך להיות קבוע וסדיר.'
        },
        {
          questionNumber: 4,
          questionTextEn: 'What can we infer from the last sentence of the text?',
          questionTextHe: 'מה אפשר להסיק מהמשפט האחרון בטקסט?',
          options: ['Old instruments are easier to play', 'Learning music links people to the past', 'Most new players give up after a few weeks', 'Music was more important in the past'],
          correctAnswer: 1,
          explanationHe: 'במשפט האחרון כתוב: "every new player helps keep a very old tradition alive" - מי שלומד לנגן ממשיך מסורת עתיקה מאוד, ולכן לימוד מוזיקה מחבר אנשים לעבר.'
        },
        {
          questionNumber: 5,
          questionTextEn: 'What is the main idea of the text?',
          questionTextHe: 'מהו הרעיון המרכזי של הטקסט?',
          options: ['Music is mainly used to celebrate holidays', 'Learning an instrument is too hard for most people', 'Every culture makes, uses and passes on music', 'The first instruments were made from bird bones'],
          correctAnswer: 2,
          explanationHe: 'הטקסט מראה ש-"Every known culture in the world makes music", שאנשים משתמשים בה כדי לחגוג, לזכור ולעבוד יחד, ושהמוזיקה "passes from older people to younger ones". הרעיון הזה מחבר את שלוש הפסקאות.'
        }
      ]
    },

    // Paragraph 18: Street Food Around the World (Complexity 3)
    {
      titleEn: 'Street Food Around the World',
      titleHe: 'אוכל רחוב ברחבי העולם',
      complexityLevel: 3,
      topic: 'Food and Culture',
      content: `In cities and towns all over the world, people buy food on the street. In the Middle East, many people eat falafel: small fried balls made from chickpeas or beans, often served in a warm pita with salad. In Mexico, tacos are a favorite: soft corn tortillas filled with meat, beans or vegetables. And in many countries, from India to Egypt, sellers roast corn over hot coals.

Why is street food so popular? First, it is usually cheap, so almost everyone can buy it. It is also quick: the food is ready in a few minutes, and you can eat it while you walk. Often, it is cooked right in front of you, so it is hot and fresh. Many people also love the busy, friendly feeling of eating outside with other customers.

Street food also tells the story of a place and its people. It is often made from what grows nearby, like corn in Mexico or chickpeas in the Middle East. Many recipes are passed down from parents to children, so a dish may be cooked the same way for generations. When people move to a new country, they often bring their recipes with them. That is why, in many big cities, you can taste food from many countries on a single street.`,
      hardWords: [
        { word: 'chickpeas', translation: 'גרגרי חומוס' },
        { word: 'tortillas', translation: 'טורטיות (לחם שטוח ודק)' },
        { word: 'roast', translation: 'צולים (על האש)' },
        { word: 'coals', translation: 'גחלים' },
        { word: 'customers', translation: 'לקוחות' },
        { word: 'recipes', translation: 'מתכונים' },
        { word: 'generations', translation: 'דורות' }
      ],
      questions: [
        {
          questionNumber: 1,
          questionTextEn: 'According to the text, what do sellers in many countries roast over hot coals?',
          questionTextHe: 'לפי הטקסט, מה המוכרים בארצות רבות צולים על גחלים לוחשות?',
          options: ['Meat', 'Chickpeas', 'Corn', 'Beans'],
          correctAnswer: 2,
          explanationHe: 'הטקסט אומר: "from India to Egypt, sellers roast corn over hot coals" - בארצות רבות המוכרים צולים תירס על גחלים.'
        },
        {
          questionNumber: 2,
          questionTextEn: 'Why can almost everyone buy street food?',
          questionTextHe: 'למה כמעט כל אחד יכול לקנות אוכל רחוב?',
          options: ['It does not cost much money', 'It is cooked right in front of you', 'Customers share it with others', 'You can eat it while you walk'],
          correctAnswer: 0,
          explanationHe: 'הטקסט אומר: "it is usually cheap, so almost everyone can buy it" - אוכל רחוב בדרך כלל זול, ולכן כמעט כל אחד יכול לקנות אותו. הבישול מול הלקוח והאכילה תוך כדי הליכה מסבירים למה אוהבים אותו, לא למה כולם יכולים לקנות אותו.'
        },
        {
          questionNumber: 3,
          questionTextEn: 'In paragraph 3, the word "dish" is closest in meaning to:',
          questionTextHe: 'בפסקה 3, מהי המשמעות הקרובה ביותר של המילה "dish"?',
          options: ['a kind of food', 'a plate for food', 'a cooking pot', 'a food seller'],
          correctAnswer: 0,
          explanationHe: 'הטקסט אומר: "a dish may be cooked the same way for generations" - את ה-dish מבשלים, כלומר זו מנה, סוג של אוכל. כאן המילה אינה במובן של צלחת.'
        },
        {
          questionNumber: 4,
          questionTextEn: 'What can we infer from paragraph 3 about many big cities?',
          questionTextHe: 'מה אפשר להסיק מפסקה 3 על ערים גדולות רבות?',
          options: ['Their sellers use only food that grows nearby', 'Their dishes are cooked the same way as long ago', 'People there no longer use old recipes', 'Many people there grew up in another country'],
          correctAnswer: 3,
          explanationHe: 'הטקסט אומר: "When people move to a new country, they often bring their recipes with them", ולכן בערים גדולות אפשר לטעום אוכל מארצות רבות - כלומר גרים בהן אנשים רבים שגדלו בארץ אחרת.'
        },
        {
          questionNumber: 5,
          questionTextEn: 'What is the main purpose of the text?',
          questionTextHe: 'מהי המטרה העיקרית של הטקסט?',
          options: ['To teach readers how to cook falafel at home', 'To describe street food and the stories it tells', 'To warn readers that street food is unhealthy', 'To compare the prices of food in different countries'],
          correctAnswer: 1,
          explanationHe: 'הטקסט מסביר "Why is street food so popular?" ואיך אוכל רחוב "tells the story of a place and its people" - כלומר הוא מתאר אוכל רחוב ומה הוא מספר על מקומות ועל אנשים.'
        }
      ]
    },

    // Paragraph 19: The Dead Sea (Complexity 4)
    {
      titleEn: 'The Dead Sea',
      titleHe: 'ים המלח',
      complexityLevel: 4,
      topic: 'Geography',
      content: `The Dead Sea lies in a deep valley in the Middle East. Its shore, more than 400 meters below sea level, is the lowest place on land in the world. Although it is called a sea, it is really a lake, because land surrounds it on every side. Its water is almost ten times saltier than ocean water. This is because the Jordan River and several streams flow into the lake, but no river flows out. In the hot desert air, the water evaporates, but the salt it brought stays behind.

All this salt makes the water very dense: a cup of it weighs about a quarter more than a cup of ordinary water. Such dense water pushes up strongly on anything in it, so people float without any effort. The salt also explains the lake's name: apart from microorganisms, nothing can live in it. Yet the lake is rich in minerals such as magnesium and potassium. Factories collect some of them to make fertilizers, and many visitors cover themselves in the black mud, believing it is good for the skin.

Sadly, the Dead Sea is shrinking: its water level drops by about one meter every year. The main reason is that people now use most of the Jordan River's water for drinking and farming before it reaches the lake. The mineral factories also take water from the lake, pumping it into large ponds where it evaporates and the minerals are collected. As the level falls, dangerous holes called sinkholes open suddenly near the shore. Scientists are now looking for ways to save the lake.`,
      hardWords: [
        { word: 'surrounds', translation: 'מקיפה (מכל הצדדים)' },
        { word: 'evaporates', translation: 'מתאדה, הופך לאדים' },
        { word: 'dense', translation: 'צפוף, בעל צפיפות גבוהה' },
        { word: 'effort', translation: 'מאמץ' },
        { word: 'potassium', translation: 'אשלגן' },
        { word: 'fertilizers', translation: 'דשנים' },
        { word: 'sinkholes', translation: 'בולענים' }
      ],
      questions: [
        {
          questionNumber: 1,
          questionTextEn: 'According to paragraph 1, why is the water of the Dead Sea so salty?',
          questionTextHe: 'לפי פסקה 1, מדוע המים של ים המלח מלוחים כל כך?',
          options: ['Several small streams bring salty water from the ocean', 'The hot desert air carries salt from the land into it', 'Its water escapes into the air, but its salt cannot', 'No plants or fish live in it to use up the salt'],
          correctAnswer: 2,
          explanationHe: 'בפסקה 1 כתוב: "no river flows out" וגם "the water evaporates, but the salt it brought stays behind" - המים מתאדים ועולים לאוויר, אבל המלח לא יכול לצאת מהאגם ולכן מצטבר בו.'
        },
        {
          questionNumber: 2,
          questionTextEn: 'In paragraph 2, what does the writer compare to show how dense the water is?',
          questionTextHe: 'בפסקה 2, מה משווה הכותב כדי להראות עד כמה המים צפופים?',
          options: ['The weight of equal amounts of lake water and plain water', 'The saltiness of the lake water and of ocean water', 'The way people float in the lake and in a swimming pool', 'The color of the black mud and of the lake water'],
          correctAnswer: 0,
          explanationHe: 'הכותב כותב: "a cup of it weighs about a quarter more than a cup of ordinary water" - הוא משווה את המשקל של כמות שווה ממי האגם וממים רגילים. ההשוואה למי האוקיינוס, בפסקה 1, מראה כמה המים מלוחים, לא כמה הם צפופים.'
        },
        {
          questionNumber: 3,
          questionTextEn: 'In paragraph 3, the word "shrinking" is closest in meaning to:',
          questionTextHe: 'בפסקה 3, מהי המשמעות הקרובה ביותר של המילה "shrinking"?',
          options: ['becoming deeper', 'becoming hotter', 'becoming cleaner', 'becoming smaller'],
          correctAnswer: 3,
          explanationHe: 'מיד אחרי המילה כתוב: "its water level drops by about one meter every year" - מפלס המים יורד כל שנה, ולכן shrinking פירושו הולך וקטן, מתכווץ.'
        },
        {
          questionNumber: 4,
          questionTextEn: 'What can we infer from paragraph 3?',
          questionTextHe: 'מה אפשר להסיק מפסקה 3?',
          options: ['The sinkholes near the shore are the main reason the lake is shrinking', 'Farmers water their crops with the salty water of the lake', 'The lake would stop shrinking if the factories built more ponds', 'The lake would shrink more slowly if more river water reached it'],
          correctAnswer: 3,
          explanationHe: 'הטקסט מסביר: "The main reason is that people now use most of the Jordan River\'s water for drinking and farming before it reaches the lake" - לכן אם יותר מי נהר יגיעו לאגם, הוא יתכווץ לאט יותר.'
        },
        {
          questionNumber: 5,
          questionTextEn: 'What is the main idea of the text?',
          questionTextHe: 'מהו הרעיון המרכזי של הטקסט?',
          options: ['The Dead Sea is a salty lake that is shrinking mainly because of the heat', 'The Dead Sea is a salty lake that is unusual and now in danger', 'The Dead Sea is a salty lake that is famous mainly for its black mud', 'The Dead Sea is a salty lake where nothing at all is able to live'],
          correctAnswer: 1,
          explanationHe: 'הטקסט מסביר מה מיוחד בים המלח, ובפסקה האחרונה כתוב: "Sadly, the Dead Sea is shrinking" ושמדענים מחפשים "ways to save the lake" - אגם מיוחד שנמצא בסכנה. הוא לא מתכווץ בעיקר בגלל החום: "The main reason is that people now use most of the Jordan River\'s water".'
        }
      ]
    },

    // Paragraph 20: The Story of Money (Complexity 4)
    {
      titleEn: 'The Story of Money',
      titleHe: 'סיפורו של הכסף',
      complexityLevel: 4,
      topic: 'Economics',
      content: `For a long time, many people got what they needed by trading one thing for another. A farmer, for example, might trade some wheat for shoes. This kind of trade is called barter, and it had serious problems. The farmer could get shoes only if the shoemaker wanted wheat at that moment. It was also hard to agree on prices: how many bags of wheat is one goat worth? And a large animal could not be divided to pay for something small.

One common explanation is that, to solve these problems, societies began to use objects that everyone agreed had value. In parts of Africa and Asia, for example, people paid with small shells, which were light, strong and easy to count. More than 2,500 years ago, the first metal coins appeared. Each coin had a fixed weight and an official stamp, so traders knew its value without weighing it. Coins lasted a long time, but large amounts of them were heavy to carry. That is why, about a thousand years ago, China began to use paper money, which was much lighter. People trusted it because it could be exchanged for coins.

Today, money is changing again. Many people rarely use coins or paper money; instead, they pay with a bank card or by holding their phone near a machine. Most money today exists only as numbers in bank computers. These digital payments are fast and convenient, and they let people buy things from other countries without leaving home. However, the basic idea of money has not changed since the days of shells: it works only because people trust that others will accept it.`,
      hardWords: [
        { word: 'barter', translation: 'סחר חליפין' },
        { word: 'wheat', translation: 'חיטה' },
        { word: 'divided', translation: 'מחולק, חולק לחלקים' },
        { word: 'societies', translation: 'חברות אנושיות, קהילות' },
        { word: 'weighing', translation: 'שקילה (במאזניים); לשקול' },
        { word: 'exchanged', translation: 'הוחלף, הומר' },
        { word: 'convenient', translation: 'נוח' }
      ],
      questions: [
        {
          questionNumber: 1,
          questionTextEn: 'According to paragraph 1, what was one problem with barter?',
          questionTextHe: 'לפי פסקה 1, מה הייתה אחת הבעיות של סחר חליפין?',
          options: ['Farmers were not allowed to trade their wheat', 'Animals could be traded only for other animals', 'Shoemakers did not want to work for farmers', 'Each trader had to want what the other offered'],
          correctAnswer: 3,
          explanationHe: 'הטקסט מסביר: "The farmer could get shoes only if the shoemaker wanted wheat at that moment" - כל צד היה צריך לרצות בדיוק את מה שהצד השני הציע.'
        },
        {
          questionNumber: 2,
          questionTextEn: 'Why did China begin to use paper money?',
          questionTextHe: 'מדוע התחילו בסין להשתמש בכסף נייר?',
          options: ['Coins did not last for a long time', 'Many coins together weighed too much', 'Traders had to weigh every single coin', 'People had stopped trusting metal coins'],
          correctAnswer: 1,
          explanationHe: 'כתוב: "large amounts of them were heavy to carry. That is why, about a thousand years ago, China began to use paper money" - הרבה מטבעות יחד שקלו יותר מדי, וכסף נייר קל הרבה יותר.'
        },
        {
          questionNumber: 3,
          questionTextEn: 'In paragraph 3, the word "rarely" is closest in meaning to:',
          questionTextHe: 'בפסקה 3, מהי המשמעות הקרובה ביותר של המילה "rarely"?',
          options: ['very often', 'almost never', 'really, truly', 'for a short time'],
          correctAnswer: 1,
          explanationHe: 'כתוב: "Many people rarely use coins or paper money; instead, they pay with a bank card" - המילה instead מראה שהם משלמים בדרך אחרת, ולכן rarely פירושו כמעט אף פעם, לעיתים רחוקות. שימו לב: rarely אינה really (באמת).'
        },
        {
          questionNumber: 4,
          questionTextEn: 'Why does the writer mention "the days of shells" in paragraph 3?',
          questionTextHe: 'מדוע הכותב מזכיר בפסקה 3 את "the days of shells" (ימי הצדפים)?',
          options: ['To show that money has always depended on trust', 'To show that people still pay with shells today', 'To show that shells were safer than digital money', 'To explain why people stopped using shells long ago'],
          correctAnswer: 0,
          explanationHe: 'הכותב אומר: "the basic idea of money has not changed since the days of shells: it works only because people trust that others will accept it" - מימי הצדפים ועד היום, הכסף תלוי באמון.'
        },
        {
          questionNumber: 5,
          questionTextEn: 'What is the main idea of the text?',
          questionTextHe: 'מהו הרעיון המרכזי של הטקסט?',
          options: ['Money keeps changing, so trust in it no longer matters', 'Paper money was invented before metal coins', 'Money has changed form over time to meet new needs', 'Digital payments have made money much less important'],
          correctAnswer: 2,
          explanationHe: 'הטקסט מתאר צורות שונות של כסף לאורך הזמן: צדפים, מטבעות, כסף נייר ותשלום בכרטיס ובטלפון. כל צורה חדשה ענתה על צורך, למשל: "That is why, about a thousand years ago, China began to use paper money". והאמון עדיין חשוב: "it works only because people trust that others will accept it".'
        }
      ]
    },

    // Paragraph 21: The Printing Revolution (Complexity 4)
    {
      titleEn: 'The Printing Revolution',
      titleHe: 'מהפכת הדפוס',
      complexityLevel: 4,
      topic: 'History',
      content: `About six hundred years ago, almost every book in Europe was copied by hand. Skilled writers called scribes copied each page slowly and carefully with a pen, so a single long book could take months or even more than a year. As a result, books were rare and very expensive. Usually only rich families, churches and universities could afford them, and most ordinary people never owned a single book.

Around 1450, a German craftsman named Johannes Gutenberg found a faster way. In Mainz, he built a printing press that used movable type: small metal blocks, each with one letter. Workers arranged the letters into words and lines, inked them, and pressed paper against them. After a page was printed, the same letters could be used again for the next one. Movable type had been used earlier in China, and metal type in Korea. Gutenberg's achievement was combining a strong press and a suitable ink with metal letters that could be cast quickly. This made printing fast and cheap in Europe. One press could print hundreds of pages a day, while a scribe could copy only a few.

The effects were enormous. Because printed books cost far less than handwritten ones, many more people could buy them, and over time more people learned to read. By 1500, presses were working in more than two hundred European cities, and millions of books had been printed. Since the copies of a book were almost identical, scholars in different countries could read the same text and build on each other's discoveries. New ideas could now spread faster and farther than ever before.`,
      hardWords: [
        { word: 'scribes', translation: 'מעתיקים (שהעתיקו ספרים בכתב יד)' },
        { word: 'craftsman', translation: 'בעל מלאכה, אומן' },
        { word: 'movable type', translation: 'אותיות דפוס מטלטלות' },
        { word: 'achievement', translation: 'הישג' },
        { word: 'cast', translation: 'לָצֶקֶת, ליצוק (מתכת בתבנית)' },
        { word: 'identical', translation: 'זהה' },
        { word: 'scholars', translation: 'מלומדים, חוקרים' }
      ],
      questions: [
        {
          questionNumber: 1,
          questionTextEn: 'In paragraph 1, the word "afford" is closest in meaning to:',
          questionTextHe: 'בפסקה 1, מהי המשמעות הקרובה ביותר של המילה "afford"?',
          options: ['copy quickly by hand', 'have the money to pay for', 'carry from one place to another', 'write neatly with a pen'],
          correctAnswer: 1,
          explanationHe: 'לפני כן כתוב: "books were rare and very expensive", ולכן רק העשירים יכלו "afford them" - כלומר היה להם מספיק כסף כדי לקנות ספרים.'
        },
        {
          questionNumber: 2,
          questionTextEn: 'According to paragraph 2, what was Gutenberg\'s achievement?',
          questionTextHe: 'לפי פסקה 2, מה היה ההישג של גוטנברג?',
          options: ['Making the first movable type that was ever used', 'Being the very first person to make letters out of metal', 'Using quickly made metal type with a press and ink', 'Teaching scribes to copy pages much more quickly'],
          correctAnswer: 2,
          explanationHe: 'כתוב: "Gutenberg\'s achievement was combining a strong press and a suitable ink with metal letters that could be cast quickly" - אותיות נפרדות ואותיות מתכת היו קיימות כבר בסין ובקוריאה, וההישג שלו היה השילוב.'
        },
        {
          questionNumber: 3,
          questionTextEn: 'Why does the writer mention that a scribe could copy only a few pages a day?',
          questionTextHe: 'מדוע הכותב מזכיר שמעתיק יכול היה להעתיק רק דפים ספורים ביום?',
          options: ['To show how much faster printing was than copying', 'To show that scribes did not work hard enough', 'To explain why handwritten books were more beautiful', 'To explain why Gutenberg had once worked as a scribe'],
          correctAnswer: 0,
          explanationHe: 'הכותב משווה: "One press could print hundreds of pages a day, while a scribe could copy only a few" - ההשוואה מראה כמה מהירה הייתה ההדפסה לעומת העתקה ביד.'
        },
        {
          questionNumber: 4,
          questionTextEn: 'According to paragraph 3, how did printing help scholars?',
          questionTextHe: 'לפי פסקה 3, איך הדפוס עזר למלומדים?',
          options: ['They could study matching copies in faraway places', 'They could buy handwritten books for much less money', 'They could copy books by hand much more quickly', 'They could set up presses in two hundred cities'],
          correctAnswer: 0,
          explanationHe: 'הטקסט מסביר: "Since the copies of a book were almost identical, scholars in different countries could read the same text" - העותקים היו כמעט זהים, ולכן חוקרים במקומות רחוקים למדו מאותו טקסט בדיוק.'
        },
        {
          questionNumber: 5,
          questionTextEn: 'What is the main idea of the text?',
          questionTextHe: 'מהו הרעיון המרכזי של הטקסט?',
          options: ['Books in Europe were copied by hand until the year 1500', 'Scribes made far fewer mistakes than the first printing presses', 'Handwritten books stayed more popular than printed ones', 'The printing press made books cheaper and helped ideas spread'],
          correctAnswer: 3,
          explanationHe: 'הטקסט מתאר את המעבר מהעתקה ביד למכונת הדפוס של גוטנברג ואת התוצאות: "printed books cost far less" ו-"New ideas could now spread faster" - זה הרעיון המרכזי.'
        }
      ]
    },

    // Paragraph 22: The Return of Spoken Hebrew (Complexity 5)
    {
      titleEn: 'The Return of Spoken Hebrew',
      titleHe: 'תחייתה של העברית המדוברת',
      complexityLevel: 5,
      topic: 'Language',
      content: `For more than 1,500 years, Hebrew led a strange double life. Jews in many countries prayed in it, studied its ancient books and even wrote letters and poems in it, yet hardly anyone spoke it at home or with friends. Everyday conversation took place in other languages. Hebrew, in other words, was not dead; it was dormant, alive on the page but silent in the kitchen and the playground.

The person most often linked to its return is Eliezer Ben-Yehuda, who settled in Jerusalem in 1881. He created new words for modern objects and ideas, began an enormous dictionary and, most famously, insisted that his family speak only Hebrew at home. His son is often described as the first native speaker of modern Hebrew. Ben-Yehuda's determination was remarkable. However, a single household cannot turn a language into a living one, and for years his was one of very few homes where only Hebrew was heard.

The real turning point came in schools. From the late 1880s, teachers in some of the new villages began teaching every subject in Hebrew, even though proper textbooks hardly existed and teachers often had to invent words as they went along. Children who studied in Hebrew also played in Hebrew, and they carried the language home, where some parents learned it from their own sons and daughters. Within a few decades, a new generation was growing up with Hebrew as its mother tongue.

None of this makes Ben-Yehuda unimportant. His new words and his dictionary gave speakers useful tools. Yet a dictionary cannot make anyone speak, and his own was completed by others long after his death. Hebrew became a mother tongue again because ordinary families, teachers and children chose to use it every day, not because of one man's will alone. Its revival was, in the end, a shared achievement.`,
      hardWords: [
        { word: 'insisted', translation: 'התעקש, עמד על כך' },
        { word: 'native speaker', translation: 'דובר ילידי (מי שזו שפת אמו)' },
        { word: 'determination', translation: 'נחישות' },
        { word: 'household', translation: 'בית, משפחה (בני הבית)' },
        { word: 'turning point', translation: 'נקודת מפנה' },
        { word: 'mother tongue', translation: 'שפת אם' },
        { word: 'revival', translation: 'תחייה, חזרה לחיים' }
      ],
      questions: [
        {
          questionNumber: 1,
          questionTextEn: 'In paragraph 1, the word "dormant" is closest in meaning to:',
          questionTextHe: 'בפסקה 1, מהי המשמעות הקרובה ביותר של המילה "dormant"?',
          options: ['asleep, and unlikely to wake up again', 'inactive for a time, but able to wake up', 'slowly being forgotten by almost everyone', 'used mostly by a small group of scholars'],
          correctAnswer: 1,
          explanationHe: 'הכותב מסביר: "not dead; it was dormant, alive on the page but silent" - לא פעילה לזמן מה, אבל מסוגלת להתעורר, וכך אכן קרה. האפשרות "asleep, and unlikely to wake up again" מתחילה נכון, אבל לפי הכותב העברית "not dead", והטקסט כולו מספר איך היא חזרה.'
        },
        {
          questionNumber: 2,
          questionTextEn: 'What does the text say about Ben-Yehuda\'s son?',
          questionTextHe: 'מה הטקסט אומר על בנו של בן-יהודה?',
          options: ['He is widely seen as the boy whose example made Hebrew a spoken language again', 'He is often described as the first child to learn Hebrew at a village school', 'He grew up hearing several different languages spoken at home every day', 'He is widely seen as the first child in centuries to be raised speaking Hebrew'],
          correctAnswer: 3,
          explanationHe: 'הטקסט אומר שבנו "is often described as the first native speaker of modern Hebrew" - הוא גדל בבית שבו דיברו רק עברית, ולא למד אותה בבית ספר. אבל הדוגמה שלו לא החזירה לבדה את העברית: "a single household cannot turn a language into a living one".'
        },
        {
          questionNumber: 3,
          questionTextEn: 'According to the text, what made teaching in Hebrew difficult at first?',
          questionTextHe: 'לפי הטקסט, מה הקשה בהתחלה על ההוראה בעברית?',
          options: ['Teachers often lacked the words they needed', 'Hardly any books had ever been written in Hebrew', 'Parents did not allow Hebrew to be spoken at home', 'Children refused to use Hebrew outside the classroom'],
          correctAnswer: 0,
          explanationHe: 'הטקסט אומר: "teachers often had to invent words as they went along" - חסרו להם מילים. התשובה שכמעט לא נכתבו ספרים בעברית כללית מדי: רק "proper textbooks hardly existed", ובפסקה 1 מסופר שלמדו בספרים עתיקים בעברית.'
        },
        {
          questionNumber: 4,
          questionTextEn: 'What can we infer about the children described in paragraph 3?',
          questionTextHe: 'מה אפשר להסיק על הילדים המתוארים בפסקה 3?',
          options: ['They taught Hebrew to most of the adults in their villages', 'They had learned Hebrew from their parents before school', 'Hebrew became part of their daily life, not just lessons', 'They made up many of the new words that teachers needed'],
          correctAnswer: 2,
          explanationHe: 'הילדים "also played in Hebrew" ו-"carried the language home", כלומר העברית נכנסה לחייהם היומיומיים ולא נשארה בכיתה. התשובה שלימדו עברית את רוב המבוגרים בכפר מגזימה: לפי הטקסט רק "some parents learned it" מילדיהם.'
        },
        {
          questionNumber: 5,
          questionTextEn: 'Which statement best expresses the main point of the text?',
          questionTextHe: 'איזה משפט מבטא בצורה הטובה ביותר את הרעיון המרכזי של הטקסט?',
          options: ['Ben-Yehuda\'s new words brought spoken Hebrew back to life', 'Schools brought Hebrew back, and Ben-Yehuda\'s part was minor', 'Hebrew was never truly dead, so bringing it back was easy', 'Ben-Yehuda helped, but a whole community revived Hebrew'],
          correctAnswer: 3,
          explanationHe: 'הכותב מסכם שהעברית חזרה בזכות "ordinary families, teachers and children" - "a shared achievement", ובן-יהודה עזר במילים ובמילון. התשובה שבתי הספר החזירו אותה ותפקידו של בן-יהודה היה שולי נשמעת קרובה, אבל הכותב קובע: "None of this makes Ben-Yehuda unimportant".'
        }
      ]
    },

    // Paragraph 23: The Mold That Changed Medicine (Complexity 5)
    {
      titleEn: 'The Mold That Changed Medicine',
      titleHe: 'העובש ששינה את פני הרפואה',
      complexityLevel: 5,
      topic: 'Science',
      content: `In September 1928, the Scottish scientist Alexander Fleming returned to his London laboratory after a summer vacation and began sorting through dishes of bacteria that he had left on a bench. On one of them, a patch of mold had grown, and around it there was a clear ring where no bacteria could be seen. A stray spore, perhaps carried in from another laboratory, had landed on the dish.

It is tempting to call this pure luck, and luck certainly played its part. Yet mold often spoiled experiments, and many scientists would simply have thrown such a dish away. Fleming paused because he had spent years studying substances that kill germs; earlier, he had even found one in human tears. The French scientist Louis Pasteur once remarked that chance favors only the prepared mind, and Fleming's curiosity turned an accident into a question worth asking.

However, noticing the effect was not the same as making a medicine. Fleming called the substance penicillin and described it, but it was hard to extract and broke down quickly, so he could not produce it in a pure, usable form. For about a decade, progress was slow. Then, from 1939, a team at the University of Oxford led by Howard Florey, with the biochemist Ernst Chain, took up the challenge. Testing it first on mice and then on patients, they showed that penicillin could cure deadly infections, and in the 1940s factories began producing it on a large scale.

In 1945, Fleming, Florey and Chain shared the Nobel Prize, a fitting sign that the discovery belonged to more than one moment and more than one person. Penicillin needed a lucky accident, but it also needed an observer ready to recognize it and years of patient work by others. Without a prepared observer, the dish might have been thrown away; without the Oxford team, penicillin might never have become a medicine.`,
      hardWords: [
        { word: 'spore', translation: 'נבג (תא זעיר שממנו צומח עובש)' },
        { word: 'tempting', translation: 'מפתה' },
        { word: 'substances', translation: 'חומרים' },
        { word: 'germs', translation: 'חיידקים, מחוללי מחלות' },
        { word: 'remarked', translation: 'העיר, ציין' },
        { word: 'extract', translation: 'להפיק, לחלץ' },
        { word: 'decade', translation: 'עשור' }
      ],
      questions: [
        {
          questionNumber: 1,
          questionTextEn: 'What did Fleming find on one of the dishes in 1928?',
          questionTextHe: 'מה מצא פלמינג באחת הצלחות בשנת 1928?',
          options: ['Mold that had killed most of the bacteria on the dish', 'Bacteria that grew faster wherever the mold was', 'An area all around the mold with no visible bacteria', 'Mold that had grown where the bacteria had already died'],
          correctAnswer: 2,
          explanationHe: 'הטקסט מתאר: "around it there was a clear ring where no bacteria could be seen" - אזור נקי מחיידקים סביב העובש. התשובה שהעובש הרג את רוב החיידקים בצלחת מגזימה: הטבעת הנקייה הייתה רק סביבו, והטקסט לא אומר דבר על שאר הצלחת.'
        },
        {
          questionNumber: 2,
          questionTextEn: 'What does paragraph 2 suggest about why Fleming paid attention to the dish?',
          questionTextHe: 'מה אפשר להבין מפסקה 2 על הסיבה שפלמינג שם לב לצלחת?',
          options: ['His past research helped him see why the dish mattered', 'He realized at once that he had found a new medicine', 'Mold almost never appeared on dishes in his laboratory', 'He had been searching for a mold that kills bacteria'],
          correctAnswer: 0,
          explanationHe: 'פלמינג עצר כי "he had spent years studying substances that kill germs" - המחקר הקודם הכין אותו להבחין בתופעה. הוא לא חיפש עובש כזה: הנבג נחת בצלחת במקרה. וגם לא הבין מיד שמצא תרופה: התאונה הפכה רק ל-"a question worth asking".'
        },
        {
          questionNumber: 3,
          questionTextEn: 'According to paragraph 3, why could Fleming not turn penicillin into a medicine?',
          questionTextHe: 'לפי פסקה 3, מדוע פלמינג לא הצליח להפוך את הפניצילין לתרופה?',
          options: ['Progress was so slow that he could not make it pure or stable', 'He lost interest in it and turned to other kinds of work', 'It could not be extracted from the mold in any way at all', 'It was difficult to get out of the mold and did not last long'],
          correctAnswer: 3,
          explanationHe: 'הטקסט אומר: "it was hard to extract and broke down quickly, so he could not produce it in a pure, usable form" - הבעיה הייתה בחומר עצמו. התשובה שההתקדמות האיטית מנעה ממנו לטהר אותו הופכת סיבה ותוצאה: הקושי בחומר הוא שגרם להתקדמות האיטית.'
        },
        {
          questionNumber: 4,
          questionTextEn: 'In paragraph 4, the word "fitting" is closest in meaning to:',
          questionTextHe: 'בפסקה 4, מהי המשמעות הקרובה ביותר של המילה "fitting"?',
          options: ['healthy and in good shape', 'right for the situation', 'of exactly the right size', 'sudden and unexpected'],
          correctAnswer: 1,
          explanationHe: 'הכותב רואה בפרס המשותף "a fitting sign that the discovery belonged to... more than one person" - סימן הולם ומתאים. האפשרות "of exactly the right size" היא המשמעות של fit בבגדים, אבל כאן מדובר בסימן שמתאים למצב, לא בגודל.'
        },
        {
          questionNumber: 5,
          questionTextEn: 'What is the writer\'s main argument?',
          questionTextHe: 'מהי הטענה המרכזית של הכותב?',
          options: ['Penicillin required chance, a ready mind and years of effort', 'Penicillin was discovered mainly thanks to one lucky accident', 'Florey and Chain deserve more of the credit than Fleming', 'Great discoveries come from hard work rather than luck'],
          correctAnswer: 0,
          explanationHe: 'הכותב מסכם: "Penicillin needed a lucky accident, but it also needed an observer ready to recognize it and years of patient work". התשובה שהתגלית נבעה בעיקר ממזל חלקית מדי: לפי הכותב, בלי מוח מוכן ובלי צוות אוקספורד הפניצילין לא היה הופך לתרופה.'
        }
      ]
    },

    // Paragraph 24: Why Crowds Hesitate to Help (Complexity 5)
    {
      titleEn: 'Why Crowds Hesitate to Help',
      titleHe: 'כשכולם מחכים למישהו אחר',
      complexityLevel: 5,
      topic: 'Psychology',
      content: `Picture a woman who slips and falls on a crowded street. Dozens of people see her, yet for a long moment nobody moves. Each passer-by seems to assume that someone else will deal with it, and so help arrives slowly, if at all. Psychologists call this the bystander effect: when many people witness a situation, each of them is less likely to step in than a person who is alone.

It would be easy to conclude that people in crowds simply do not care. However, research points mainly to two other causes. First, responsibility feels shared: with fifty people watching, each one feels only a small part of the duty to act. Second, we take our cue from the people around us. If everyone seems calm, we assume there is no real emergency, while they, in turn, are watching us and drawing the same conclusion.

A well-known experiment from the 1960s showed how powerful this second cause can be. Students filling out a questionnaire saw smoke drifting into the room through a vent. Most of those who were alone soon left to report it. However, when students sat with two strangers who were secretly working for the researchers and calmly ignored the smoke, most of them stayed in their seats and kept writing.

Fortunately, the effect can be weakened. If you need help in a crowd, point to one particular person, such as the man in the blue shirt, and ask him directly to call for help. The responsibility is then no longer shared, and he is far more likely to act. Once one person steps forward, others often follow, and some studies suggest that people who have learned about the bystander effect are more likely to help. The effect, in the end, reveals less about how much people care than about how they read a situation and divide up responsibility.`,
      hardWords: [
        { word: 'passer-by', translation: 'עובר אורח' },
        { word: 'bystander', translation: 'צופה מהצד, עומד מן הצד' },
        { word: 'witness', translation: 'לראות במו עיניו, להיות עד ל-' },
        { word: 'assume', translation: 'להניח (בלי לבדוק)' },
        { word: 'questionnaire', translation: 'שאלון' },
        { word: 'drifting', translation: 'נישא לאט (באוויר)' },
        { word: 'reveals', translation: 'חושף, מגלה' }
      ],
      questions: [
        {
          questionNumber: 1,
          questionTextEn: 'According to the text, what is the bystander effect?',
          questionTextHe: 'לפי הטקסט, מהו אפקט הצופה מהצד (bystander effect)?',
          options: ['People in a crowd care less about a stranger who is in trouble', 'People in a crowd often fail to notice that someone has fallen', 'Help tends to arrive faster when more people are watching', 'The bigger the crowd, the less each person in it tends to help'],
          correctAnswer: 3,
          explanationHe: 'הטקסט מגדיר: "each of them is less likely to step in than a person who is alone" - ככל שהקהל גדול יותר, כל אחד בו נוטה פחות לעזור. התשובה שאנשים בקהל פחות אכפתיים נשמעת נכונה, אבל הכותב דוחה אותה: "It would be easy to conclude that people in crowds simply do not care. However..."'
        },
        {
          questionNumber: 2,
          questionTextEn: 'In paragraph 2, the word "cue" is closest in meaning to:',
          questionTextHe: 'בפסקה 2, מהי המשמעות הקרובה ביותר של המילה "cue"?',
          options: ['a reason to feel afraid', 'a signal for how to behave', 'an order that we have to obey', 'a feeling of shared duty'],
          correctAnswer: 1,
          explanationHe: 'המשפט הבא מסביר: "If everyone seems calm, we assume there is no real emergency" - אנחנו לומדים מהתנהגות האחרים איך לנהוג, כלומר אות או סימן. האפשרות "an order that we have to obey" חזקה מדי: איש לא מצווה עלינו דבר, אנחנו רק מסיקים מהם.'
        },
        {
          questionNumber: 3,
          questionTextEn: 'What can we infer from the smoke experiment?',
          questionTextHe: 'מה אפשר להסיק מניסוי העשן?',
          options: ['The strangers\' calm made the smoke seem less serious', 'Students sitting with others did not see the smoke', 'Students who were alone were simply braver than others', 'The strangers told the students to ignore the smoke'],
          correctAnswer: 0,
          explanationHe: 'הניסוי מדגים ש-"we take our cue from the people around us": הרוגע של הזרים גרם לעשן להיראות לא מסוכן. התשובה שהזרים אמרו לסטודנטים להתעלם מהעשן מגזימה: לפי הטקסט הם רק "calmly ignored the smoke", ולא נאמר שדיברו עם הסטודנטים.'
        },
        {
          questionNumber: 4,
          questionTextEn: 'According to paragraph 4, how can a person who needs help weaken the bystander effect?',
          questionTextHe: 'לפי פסקה 4, איך אדם שזקוק לעזרה יכול להחליש את אפקט הצופה מהצד?',
          options: ['Ask the people nearby to call for help', 'Stay calm so that nobody nearby starts to panic', 'Single out one person and give them a clear task', 'Wait quietly until someone decides to step forward'],
          correctAnswer: 2,
          explanationHe: 'הכותב ממליץ "point to one particular person... and ask him directly", כי אז "The responsibility is then no longer shared". הבקשה מהאנשים שמסביב להזעיק עזרה נשמעת קרובה, אבל היא פונה לכולם, ולכן האחריות נשארת מתחלקת.'
        },
        {
          questionNumber: 5,
          questionTextEn: 'Which statement best sums up the writer\'s view?',
          questionTextHe: 'איזה משפט מסכם בצורה הטובה ביותר את עמדת הכותב?',
          options: ['People fail to help in crowds mainly because they do not really care', 'Crowds help less mainly because duty feels shared and others seem calm', 'Pointing to one person and asking directly makes help much more likely', 'Crowds help less mainly because people are afraid of looking foolish'],
          correctAnswer: 1,
          explanationHe: 'לפי הכותב "research points mainly to two other causes": האחריות מתחלקת, ואנחנו מסיקים מהרוגע של האחרים שאין סכנה. הפחד להיראות מגוחך לא מוזכר בטקסט, ואת חוסר האכפתיות הכותב דוחה: "It would be easy to conclude... However". הפנייה לאדם אחד היא רק עצה מפסקה 4.'
        }
      ]
    },

    // Paragraph 25: Why Cities Run Hot (Complexity 5)
    {
      titleEn: 'Why Cities Run Hot',
      titleHe: 'למה בעיר חם יותר',
      complexityLevel: 5,
      topic: 'Environment',
      content: `On a summer evening, the center of a large city can be several degrees warmer than the fields and villages around it. Scientists call this an urban heat island. Surprisingly, the difference is often greatest after sunset: the countryside cools quickly once the sun goes down, while the city stays warm long into the night. This is more than a matter of comfort, because during heatwaves, hot nights give people's bodies little chance to recover.

One of the main reasons lies in the materials that cities are made of. Asphalt roads, concrete walls and dark roofs absorb much of the sunlight that falls on them and store it as heat during the day. At night, they slowly release that heat into the air, and this keeps the streets warm. In the countryside, by contrast, plants and moist soil hold water, and as that water evaporates it carries heat away, much as sweat cools our skin. City centers, meanwhile, often have few trees to provide shade and cooling.

It is often assumed that cities are hot simply because they are so crowded. Cars, factories and air conditioners do add some extra heat; an air conditioner, for example, cools a room by pumping heat out of it and into the street. However, the number of people alone does not explain the effect. A busy street lined with tall trees can be noticeably cooler than an empty parking lot nearby, which suggests that surfaces and greenery matter more than crowds.

Fortunately, the same understanding points to solutions. Planting trees and creating parks bring back shade and moisture. Roofs painted in light colors reflect much of the sunlight instead of absorbing it, and green roofs, covered with plants, protect buildings from the sun and cool the air around them. Cities cannot simply move their people elsewhere, but they can change what lies under their feet and over their heads.`,
      hardWords: [
        { word: 'urban', translation: 'עירוני' },
        { word: 'concrete', translation: 'בטון' },
        { word: 'release', translation: 'פולטים, משחררים' },
        { word: 'moist', translation: 'לח' },
        { word: 'evaporates', translation: 'מתאדה' },
        { word: 'noticeably', translation: 'באופן מורגש' },
        { word: 'greenery', translation: 'צמחייה, עצים וצמחים' }
      ],
      questions: [
        {
          questionNumber: 1,
          questionTextEn: 'According to the text, when is the temperature gap between a city and its surroundings often largest?',
          questionTextHe: 'לפי הטקסט, מתי ההבדל בטמפרטורה בין העיר לסביבתה הוא לרוב הגדול ביותר?',
          options: ['At midday, when the sunshine is at its very strongest', 'At night, once the fields have lost their daytime heat', 'In the late afternoon, after the city has stored the most heat', 'During heatwaves, when air conditioners are running all day'],
          correctAnswer: 1,
          explanationHe: 'הטקסט אומר שהפער "is often greatest after sunset", כשהכפר מתקרר מהר והעיר "stays warm long into the night". התשובה על שעות אחר הצהריים, כשהעיר כבר אגרה חום, נשמעת הגיונית, אבל לפי הטקסט השיא מגיע רק אחרי השקיעה.'
        },
        {
          questionNumber: 2,
          questionTextEn: 'In paragraph 2, the word "absorb" is closest in meaning to:',
          questionTextHe: 'בפסקה 2, מהי המשמעות הקרובה ביותר של המילה "absorb"?',
          options: ['send back', 'soak up water', 'take in', 'give off'],
          correctAnswer: 2,
          explanationHe: 'המשטחים "absorb much of the sunlight that falls on them and store it as heat" - קולטים את אור השמש לתוכם. absorb יכולה לתאר ספוג שסופג מים, אבל כאן נקלט אור ולא מים. ו-send back הוא ההפך: גגות בהירים "reflect ... instead of absorbing it".'
        },
        {
          questionNumber: 3,
          questionTextEn: 'What does the text say about air conditioners?',
          questionTextHe: 'מה הטקסט אומר על מזגנים?',
          options: ['They cool rooms but add heat to the air outside', 'They are the main cause of urban heat islands', 'They help the city cool down during the night', 'They cool a room by bringing in cooler air from outside'],
          correctAnswer: 0,
          explanationHe: 'הטקסט אומר שמזגן מקרר חדר "by pumping heat out of it and into the street", כלומר מוסיף חום בחוץ. התשובה שהמזגנים הם הגורם העיקרי מגזימה: הם מוסיפים רק "some extra heat", ו-"the number of people alone does not explain the effect".'
        },
        {
          questionNumber: 4,
          questionTextEn: 'Why does the writer mention a busy street lined with tall trees?',
          questionTextHe: 'מדוע הכותב מזכיר רחוב הומה שלאורכו נטועים עצים גבוהים?',
          options: ['To suggest that parking lots should be turned into parks', 'To show that busy streets are cooler than quiet ones', 'To show that people prefer to walk in the shade', 'To show that crowding is not what mainly makes cities hot'],
          correctAnswer: 3,
          explanationHe: 'הכותב מסיק מהדוגמה ש-"surfaces and greenery matter more than crowds" - כלומר הצפיפות אינה הסיבה העיקרית לחום. התשובה שרחובות הומים קרירים יותר משקטים מפספסת את הנקודה: הרחוב קריר בזכות העצים, למרות ההמון, וההשוואה היא למגרש חניה ריק.'
        },
        {
          questionNumber: 5,
          questionTextEn: 'What is the writer\'s main purpose in this text?',
          questionTextHe: 'מהי המטרה העיקרית של הכותב בטקסט?',
          options: ['To warn readers about the dangers of summer heatwaves', 'To explain why city centers stay warmer than the countryside at night', 'To explain what makes cities hotter and what can be done about it', 'To argue that cities should plant trees instead of painting roofs'],
          correctAnswer: 2,
          explanationHe: 'הטקסט מסביר מה מחמם את העיר ("One of the main reasons lies in the materials") ואז מציע פתרונות ("the same understanding points to solutions"). התשובה על החום בלילה צרה מדי: היא מתאימה לפסקאות 1–2 ומשמיטה את הפתרונות. וגלי החום מוזכרים רק במשפט אחד.'
        }
      ]
    }
  ];
}

module.exports = { getParagraphsData };
