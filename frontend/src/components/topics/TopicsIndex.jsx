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

  // Topic names mapping
  const topicNames = {
    1: { en: 'Present Simple', he: 'הווה פשוט' },
    2: { en: 'Past Simple', he: 'עבר פשוט' },
    3: { en: 'Present Continuous', he: 'הווה ממושך' },
    4: { en: 'Grammar Basics', he: 'יסודות דקדוק' }
  };

  useEffect(() => {
    loadLessons();
  }, []);

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'in_progress':
        return '⏳';
      default:
        return '📝';
    }
  };

  const getStatusText = (status, bestScore) => {
    switch (status) {
      case 'completed':
        return `הושלם (${bestScore}%)`;
      case 'in_progress':
        return 'בתהליך';
      default:
        return 'לא התחיל';
    }
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

      <div className="topics-content">
        {topics.length === 0 ? (
          <div className="no-topics">
            <p>אין שיעורים זמינים כרגע</p>
          </div>
        ) : (
          <div className="topics-list">
            {topics.map((topic) => (
              <div key={topic.topicNumber} className="topic-card">
                <div
                  className="topic-header"
                  onClick={() => toggleTopic(topic.topicNumber)}
                >
                  <div className="topic-title">
                    <h2>נושא {topic.topicNumber}: {topicNames[topic.topicNumber]?.en || `Topic ${topic.topicNumber}`}</h2>
                    <span className="topic-level">כל הרמות - מתחיל עד מתקדם</span>
                  </div>
                  <div className="topic-progress">
                    <span className="progress-text">
                      {topic.lessons.filter(l => l.progress.status === 'completed').length}/{topic.lessons.length} הושלמו
                    </span>
                    <span className="expand-icon">
                      {expandedTopics.includes(topic.topicNumber) ? '▼' : '◀'}
                    </span>
                  </div>
                </div>

                {expandedTopics.includes(topic.topicNumber) && (
                  <div className="subtopics-list">
                    {topic.lessons.map((lesson) => (
                      <div key={lesson.id} className="subtopic-item">
                        <div className="subtopic-info">
                          <div className="subtopic-title">
                            <span className="status-icon">{getStatusIcon(lesson.progress.status)}</span>
                            <div>
                              <h3>{lesson.subtopicNumber}. {lesson.titleHe}</h3>
                              <p className="subtopic-title-en">{lesson.titleEn}</p>
                            </div>
                          </div>
                          <div className="subtopic-status">
                            {lesson.progress.bestScore >= 80 && (
                              <span className="level-badge level-advanced">מתקדם 🔥</span>
                            )}
                            {lesson.progress.bestScore >= 60 && lesson.progress.bestScore < 80 && (
                              <span className="level-badge level-intermediate">בינוני ⚡</span>
                            )}
                            {(lesson.progress.bestScore < 60 || !lesson.progress.bestScore) && (
                              <span className="level-badge level-beginner">מתחיל 🌱</span>
                            )}
                            <span className="status-text">
                              {getStatusText(lesson.progress.status, lesson.progress.bestScore)}
                            </span>
                          </div>
                        </div>

                        <div className="subtopic-actions">
                          <Link
                            to={`/learn/${lesson.id}`}
                            className="btn-action btn-learn"
                          >
                            📖 למד
                          </Link>
                          <Link
                            to={`/learn/${lesson.id}`}
                            className="btn-action btn-practice"
                          >
                            ✏️ תרגל (כל הרמות)
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicsIndex;
