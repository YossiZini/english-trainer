import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import lessonService from '../../services/lessonService';
import './LearningPage.css';

const LearningPage = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLesson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

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
          <span>{lesson.subtopicNumber}</span>
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
