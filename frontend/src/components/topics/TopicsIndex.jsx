import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import lessonService from '../../services/lessonService';
import './TopicsIndex.css';

const TopicsIndex = () => {
  const { user, logout } = useAuth();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState([1]); // Expand first topic by default
  const [videoModal, setVideoModal] = useState({ isOpen: false, video: null });

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

  const openVideoModal = (video) => {
    setVideoModal({ isOpen: true, video });
  };

  const closeVideoModal = () => {
    setVideoModal({ isOpen: false, video: null });
  };

  useEffect(() => {
    loadLessons();
  }, []);

  // Handle ESC key to close video modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && videoModal.isOpen) {
        closeVideoModal();
      }
    };

    if (videoModal.isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [videoModal.isOpen]);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const data = await lessonService.getAllLessons();
      setTopics(data);
    } catch (error) {
      setError(error.message || 'Failed to load lessons');
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = (topicNumber) => {
    setExpandedTopics(prev =>
      prev.includes(topicNumber)
        ? prev.filter(t => t !== topicNumber)
        : [...prev, topicNumber]
    );
  };

  if (loading) {
    return (
      <div className="topics-container">
        <div className="loader-container">
          <div className="loader"></div>
          <p>טוען שיעורים...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="topics-container">
        <div className="error-container">
          <p>שגיאה: {error}</p>
          <button onClick={loadLessons} className="btn-retry">נסה שוב</button>
        </div>
      </div>
    );
  }

  return (
    <div className="topics-container">
      <header className="topics-header">
        <div className="header-content">
          <div className="header-title">
            <h1>נושאי לימוד</h1>
            <p className="header-subtitle">Learning Topics</p>
          </div>
          <div className="header-user">
            <span>שלום, {user?.name}!</span>
            <button onClick={logout} className="btn-logout">יציאה</button>
          </div>
        </div>
      </header>

      {/* Table of Contents */}
      <div className="table-of-contents">
        <h3 className="toc-title">תוכן העניינים</h3>
        <div className="toc-grid">
          {Object.keys(topicNames).map(topicNum => (
            <a
              key={topicNum}
              href={`#topic-${topicNum}`}
              className="toc-item"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(`topic-${topicNum}`);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              <span className="toc-number">{topicNum}</span>
              <span className="toc-content">
                <span className="toc-name">{topicNames[topicNum].en}</span>
                <span className="toc-example">{tocExamples[topicNum]}</span>
              </span>
            </a>
          ))}
        </div>
      </div>

      <div className="topics-content">
        {topics.length === 0 ? (
          <div className="no-topics">
            <p>אין שיעורים זמינים כרגע</p>
          </div>
        ) : (
          <div className="topics-list">
            {topics.map((topic) => (
              <div key={topic.topicNumber} id={`topic-${topic.topicNumber}`} className="topic-card">
                <div
                  className="topic-header"
                  onClick={() => toggleTopic(topic.topicNumber)}
                >
                  <div className="topic-title">
                    <h2>נושא {topic.topicNumber}: {topicNames[topic.topicNumber]?.en || `Topic ${topic.topicNumber}`}</h2>
                    <span className="topic-level">כל הרמות - מתחיל עד מתקדם</span>
                  </div>
                  <div className="topic-progress">
                    <div className="topic-progress-bar">
                      <div
                        className="topic-progress-fill"
                        style={{
                          width: `${(topic.lessons.filter(l => l.progress.status === 'completed').length / topic.lessons.length) * 100}%`
                        }}
                      />
                    </div>
                    <span className="progress-text">
                      {topic.lessons.filter(l => l.progress.status === 'completed').length}/{topic.lessons.length} הושלמו
                    </span>
                    <span className="expand-icon">
                      {expandedTopics.includes(topic.topicNumber) ? '▼' : '◀'}
                    </span>
                  </div>
                </div>

                {/* Topic Description and Examples - Always visible */}
                {topicDescriptions[topic.topicNumber] && (
                  <div className="topic-preview">
                    <p className="topic-description">
                      {topicDescriptions[topic.topicNumber].description}
                    </p>
                    <div className="topic-examples">
                      <strong>דוגמאות:</strong>
                      <ul>
                        {topicDescriptions[topic.topicNumber].examples.map((example, index) => (
                          <li key={index}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {expandedTopics.includes(topic.topicNumber) && (
                  <div className="topic-expanded-content">
                    {/* Video link if available */}
                    {topicVideos[topic.topicNumber] && (
                      <div className="topic-video-link-section">
                        <div
                          className="video-thumbnail-card"
                          onClick={() => openVideoModal(topicVideos[topic.topicNumber])}
                        >
                          <div className="video-thumbnail">
                            <div className="thumbnail-icon">
                              {topicVideos[topic.topicNumber].thumbnail}
                            </div>
                            <div className="play-overlay">
                              <div className="play-button">▶</div>
                            </div>
                            <div className="video-duration">
                              {topicVideos[topic.topicNumber].duration}
                            </div>
                          </div>
                          <div className="video-info">
                            <h4>{topicVideos[topic.topicNumber].title}</h4>
                            <p>{topicVideos[topic.topicNumber].description}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="subtopics-list">
                    {topic.lessons.map((lesson) => {
                      const examples = getSubtopicExamples(topic.topicNumber, lesson.subtopicNumber);

                      // Calculate progress summary
                      const difficulties = ['easy', 'medium', 'hard'];
                      const completedCount = difficulties.filter(
                        diff => lesson.progress.difficultyScores?.[diff]?.score >= 80
                      ).length;
                      const attemptedCount = difficulties.filter(
                        diff => lesson.progress.difficultyScores?.[diff]
                      ).length;

                      return (
                        <div
                          key={lesson.id}
                          className={`subtopic-item ${lesson.progress.status === 'completed' ? 'completed' : ''} ${lesson.progress.status === 'in_progress' ? 'in-progress' : ''}`}
                        >
                          <div className="subtopic-header-section">
                            <div className="subtopic-title-row">
                              <h3>{lesson.subtopicNumber}. {lesson.titleHe}</h3>
                              <p className="subtopic-title-en">{lesson.titleEn}</p>

                              {/* Progress Summary Badge */}
                              {attemptedCount > 0 && (
                                <span className={`progress-summary ${completedCount === 3 ? 'all-passed' : ''}`}>
                                  {completedCount === 3 ? '✓' : `${completedCount}/3`}
                                </span>
                              )}
                            </div>

                            {/* Examples */}
                            {examples && examples.length > 0 && (
                              <div className="subtopic-examples">
                                {examples.map((example, idx) => (
                                  <span key={idx} className="example-badge">{example}</span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Compact Action Buttons Row */}
                          <div className="subtopic-actions-compact">
                            <Link
                              to={`/learn/${lesson.id}`}
                              className="btn-compact btn-learn-compact"
                            >
                              📖 Learn
                            </Link>
                            <Link
                              to={`/exercise/${lesson.id}?difficulty=easy`}
                              className={`btn-compact btn-level ${lesson.progress.difficultyScores?.easy?.score >= 80 ? 'passed' : lesson.progress.difficultyScores?.easy ? 'attempted' : 'not-attempted'}`}
                            >
                              <span className="status-icon">
                                {lesson.progress.difficultyScores?.easy?.score >= 80 ? '✓' :
                                 lesson.progress.difficultyScores?.easy ? '⚠' : '○'}
                              </span>
                              🌱 Beginner
                              {lesson.progress.difficultyScores?.easy && (
                                <span className="score-mini">{lesson.progress.difficultyScores.easy.score}%</span>
                              )}
                            </Link>
                            <Link
                              to={`/exercise/${lesson.id}?difficulty=medium`}
                              className={`btn-compact btn-level ${lesson.progress.difficultyScores?.medium?.score >= 80 ? 'passed' : lesson.progress.difficultyScores?.medium ? 'attempted' : 'not-attempted'}`}
                            >
                              <span className="status-icon">
                                {lesson.progress.difficultyScores?.medium?.score >= 80 ? '✓' :
                                 lesson.progress.difficultyScores?.medium ? '⚠' : '○'}
                              </span>
                              ⚡ Intermediate
                              {lesson.progress.difficultyScores?.medium && (
                                <span className="score-mini">{lesson.progress.difficultyScores.medium.score}%</span>
                              )}
                            </Link>
                            <Link
                              to={`/exercise/${lesson.id}?difficulty=hard`}
                              className={`btn-compact btn-level ${lesson.progress.difficultyScores?.hard?.score >= 80 ? 'passed' : lesson.progress.difficultyScores?.hard ? 'attempted' : 'not-attempted'}`}
                            >
                              <span className="status-icon">
                                {lesson.progress.difficultyScores?.hard?.score >= 80 ? '✓' :
                                 lesson.progress.difficultyScores?.hard ? '⚠' : '○'}
                              </span>
                              🔥 Advanced
                              {lesson.progress.difficultyScores?.hard && (
                                <span className="score-mini">{lesson.progress.difficultyScores.hard.score}%</span>
                              )}
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal */}
      {videoModal.isOpen && (
        <div className="video-modal-overlay" onClick={closeVideoModal}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={closeVideoModal}>
              ✕
            </button>
            <div className="video-modal-header">
              <h2>{videoModal.video.title}</h2>
              <p>{videoModal.video.description}</p>
            </div>
            <div className="video-modal-player">
              <video
                controls
                autoPlay
                className="modal-video"
              >
                <source
                  src={`/videos/${videoModal.video.filename}`}
                  type="video/mp4"
                />
                הדפדפן שלך לא תומך בנגן וידאו.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicsIndex;
