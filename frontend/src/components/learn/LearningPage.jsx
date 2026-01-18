import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import lessonService from '../../services/lessonService';
import './LearningPage.css';

const LearningPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubtopicsDropdown, setShowSubtopicsDropdown] = useState(false);
  const [topicLessons, setTopicLessons] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadLesson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSubtopicsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadLesson = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await lessonService.getLessonById(lessonId);
      setLesson(data);
    } catch (error) {
      setError(error.message || 'Failed to load lesson');
    } finally {
      setLoading(false);
    }
  };

  const loadTopicLessons = async () => {
    if (!lesson) return;

    // If already have lessons, just toggle dropdown
    if (topicLessons.length > 0) {
      setShowSubtopicsDropdown(!showSubtopicsDropdown);
      return;
    }

    // Show dropdown immediately (will show loading state)
    setShowSubtopicsDropdown(true);

    // Fetch lessons
    try {
      const lessons = await lessonService.getLessonsByTopic(lesson.topicNumber);
      console.log('Loaded topic lessons:', lessons);
      setTopicLessons(lessons);
    } catch (error) {
      console.error('Failed to load topic lessons:', error);
      setShowSubtopicsDropdown(false);
    }
  };

  if (loading) {
    return (
      <div className="learning-container">
        <div className="loader-container">
          <div className="loader"></div>
          <p>טוען שיעור...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="learning-container">
        <div className="error-container">
          <h2>שגיאה בטעינת השיעור</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={loadLesson} className="btn-retry">נסה שוב</button>
            <Link to="/topics" className="btn-back">חזור לנושאים</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return null;
  }

  return (
    <div className="learning-container">
      <nav className="learning-nav">
        <Link to="/topics" className="btn-nav-back">
          ← חזור לנושאים
        </Link>
        <div className="lesson-breadcrumb">
          <span>נושא {lesson.topicNumber}</span>
          <span className="separator">›</span>
          <div className="subtopic-dropdown-wrapper" ref={dropdownRef}>
            <button
              className="subtopic-trigger"
              onClick={loadTopicLessons}
              title="לחץ לראות את כל תתי הנושאים"
            >
              {lesson.subtopicNumber}
              <span className="dropdown-arrow">{showSubtopicsDropdown ? '▲' : '▼'}</span>
            </button>

            {showSubtopicsDropdown && (
              <div className="subtopics-dropdown">
                <div className="dropdown-header">
                  תתי נושאים בנושא {lesson.topicNumber}
                </div>
                <div className="dropdown-list">
                  {topicLessons.length > 0 ? (
                    topicLessons.map((topicLesson) => (
                      <Link
                        key={topicLesson.id}
                        to={`/learn/${topicLesson.id}`}
                        className={`dropdown-item ${topicLesson.id === lesson.id ? 'active' : ''}`}
                        onClick={() => setShowSubtopicsDropdown(false)}
                      >
                        <span className="item-number">{topicLesson.subtopicNumber}</span>
                        <span className="item-title">{topicLesson.titleHe}</span>
                        {topicLesson.progress?.status === 'completed' && (
                          <span className="item-badge">✅</span>
                        )}
                      </Link>
                    ))
                  ) : (
                    <div className="dropdown-loading">טוען...</div>
                  )}
                </div>
              </div>
            )}
          </div>
          <span className="separator">›</span>
          <span>{lesson.titleHe}</span>
        </div>
      </nav>

      <div className="learning-content">
        <header className="lesson-header">
          <div className="lesson-number">{lesson.subtopicNumber}</div>
          <div className="lesson-titles">
            <h1>{lesson.titleHe}</h1>
            <p className="lesson-title-en">{lesson.titleEn}</p>
          </div>
          {lesson.progress.status === 'completed' && (
            <div className="completion-badge">
              ✅ הושלם ({lesson.progress.bestScore}%)
            </div>
          )}
        </header>

        <div className="theory-content">
          <div
            className="theory-html"
            dangerouslySetInnerHTML={{ __html: lesson.theoryContentHe }}
          />
        </div>

        <div className="lesson-actions">
          <div className="nav-buttons">
            {lesson.navigation.previous ? (
              <Link
                to={`/learn/${lesson.navigation.previous.id}`}
                className="btn-nav btn-previous"
              >
                ← שיעור קודם: {lesson.navigation.previous.titleHe}
              </Link>
            ) : (
              <div></div>
            )}

            {lesson.navigation.next && (
              <Link
                to={`/learn/${lesson.navigation.next.id}`}
                className="btn-nav btn-next"
              >
                שיעור הבא: {lesson.navigation.next.titleHe} →
              </Link>
            )}
          </div>

          <div className="practice-section">
            <h3>מוכן לתרגל?</h3>
            <p>בחר רמת קושי ותתחיל לתרגל!</p>

            <div className="difficulty-selection">
              <Link
                to={`/exercise/${lesson.id}?difficulty=easy`}
                className="btn-difficulty btn-easy"
              >
                <span className="difficulty-emoji">🌱</span>
                <span className="difficulty-label">מתחיל</span>
                <span className="difficulty-desc">שאלות קלות</span>
              </Link>

              <Link
                to={`/exercise/${lesson.id}?difficulty=medium`}
                className="btn-difficulty btn-medium"
              >
                <span className="difficulty-emoji">⚡</span>
                <span className="difficulty-label">בינוני</span>
                <span className="difficulty-desc">שאלות בינוניות</span>
              </Link>

              <Link
                to={`/exercise/${lesson.id}?difficulty=hard`}
                className="btn-difficulty btn-hard"
              >
                <span className="difficulty-emoji">🔥</span>
                <span className="difficulty-label">מתקדם</span>
                <span className="difficulty-desc">שאלות קשות</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;
