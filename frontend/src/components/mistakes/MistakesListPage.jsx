import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mistakesService from '../../services/mistakesService';
import './MistakesListPage.css';

const MistakesListPage = () => {
  const navigate = useNavigate();
  const [mistakes, setMistakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMistakes();
  }, []);

  const loadMistakes = async () => {
    try {
      setLoading(true);
      const data = await mistakesService.getAllMistakes(true); // Only uncorrected

      console.log('API Response:', data);

      // Handle the response structure - check if data.data exists
      const mistakesArray = data.data || data || [];

      if (!Array.isArray(mistakesArray)) {
        console.error('Expected array but got:', mistakesArray);
        setMistakes([]);
        setLoading(false);
        return;
      }

      // Group mistakes by lesson
      const groupedByLesson = {};
      mistakesArray.forEach(mistake => {
        const lessonKey = mistake.lesson_id;
        if (!groupedByLesson[lessonKey]) {
          groupedByLesson[lessonKey] = {
            lessonId: mistake.lesson_id,
            lessonTitle: mistake.lesson_title_he,
            mistakes: []
          };
        }
        groupedByLesson[lessonKey].mistakes.push(mistake);
      });

      setMistakes(Object.values(groupedByLesson));
      setLoading(false);
    } catch (err) {
      console.error('Failed to load mistakes:', err);
      setError('שגיאה בטעינת הטעויות');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mistakes-list-page">
        <div className="loading">טוען טעויות...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mistakes-list-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (mistakes.length === 0) {
    return (
      <div className="mistakes-list-page">
        <div className="mistakes-container">
          <div className="empty-state">
            <div className="empty-icon">🎉</div>
            <h2>אין טעויות לתיקון!</h2>
            <p>כל הכבוד! תיקנת את כל הטעויות שלך</p>
            <button
              className="back-button"
              onClick={() => navigate('/dashboard')}
            >
              חזרה לדשבורד
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mistakes-list-page">
      <div className="mistakes-container">
        <div className="mistakes-header">
          <h1 className="mistakes-title">תיקון טעויות</h1>
          <p className="mistakes-subtitle">
            בחר שיעור כדי לתקן את הטעויות שלך
          </p>
        </div>

        <div className="mistakes-stats">
          <div className="stat-item">
            <div className="stat-value">{mistakes.length}</div>
            <div className="stat-label">שיעורים עם טעויות</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">
              {mistakes.reduce((sum, lesson) => sum + lesson.mistakes.length, 0)}
            </div>
            <div className="stat-label">סה״כ טעויות</div>
          </div>
        </div>

        <div className="lessons-grid">
          {mistakes.map((lesson) => (
            <div
              key={lesson.lessonId}
              className="lesson-card"
              onClick={() => navigate(`/mistakes/review/${lesson.lessonId}`)}
            >
              <div className="lesson-header">
                <h3 className="lesson-title">{lesson.lessonTitle}</h3>
                <div className="mistakes-badge">{lesson.mistakes.length}</div>
              </div>
              <div className="lesson-footer">
                <span className="review-link">תקן טעויות ←</span>
              </div>
            </div>
          ))}
        </div>

        <button
          className="back-button"
          onClick={() => navigate('/dashboard')}
        >
          חזרה לדשבורד
        </button>
      </div>
    </div>
  );
};

export default MistakesListPage;
