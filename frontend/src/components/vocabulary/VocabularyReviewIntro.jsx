import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import vocabularyService from '../../services/vocabularyService';
import './VocabularyReviewIntro.css';

const VocabularyReviewIntro = () => {
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReviewWords();
  }, []);

  const loadReviewWords = async () => {
    try {
      setLoading(true);
      const response = await vocabularyService.getReviewSentences();
      const data = response.data || response;
      setWords(data.words || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load review words:', err);
      setError('שגיאה בטעינת המילים לחזרה');
      setLoading(false);
    }
  };

  const handleStartReview = async () => {
    try {
      const response = await vocabularyService.startReview();
      const data = response.data || response;
      const sessionId = data.sessionId;
      if (sessionId) {
        navigate(`/vocabulary/review/${sessionId}`);
      }
    } catch (err) {
      console.error('Failed to start review:', err);
      setError('שגיאה בהתחלת החזרה');
    }
  };

  if (loading) {
    return (
      <div className="vocabulary-review-intro">
        <div className="loading">טוען...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vocabulary-review-intro">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/vocabulary')} className="btn-back">
          חזרה לדף הבית
        </button>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="vocabulary-review-intro">
        <div className="no-words-message">
          <div className="no-words-icon">✓</div>
          <h2>אין מילים לחזרה</h2>
          <p>כל הכבוד! אין לך מילים שצריכות חזרה כרגע.</p>
          <button onClick={() => navigate('/vocabulary')} className="btn-home">
            חזרה לדף הבית
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vocabulary-review-intro">
      <div className="review-intro-container">
        {/* Header */}
        <div className="review-intro-header">
          <div className="header-icon">📚</div>
          <h1>חזרה על מילים</h1>
          <p>לפני שנתחיל בחידון החזרה, בוא נסקור את המילים שהתקשית בהן</p>
          <div className="words-count">
            {words.length} מילים לחזרה
          </div>
        </div>

        {/* Words List */}
        <div className="words-list">
          {words.map((word, index) => (
            <div key={word.id} className="word-card">
              <div className="word-number">{index + 1}</div>
              <div className="word-content">
                <div className="word-pair">
                  <div className="english">{word.english}</div>
                  <div className="arrow">→</div>
                  <div className="hebrew">{word.hebrew}</div>
                </div>
                <div className="word-sentences">
                  <div className="sentence">
                    <div className="sentence-label">English:</div>
                    <div className="sentence-text">{word.sentenceEn}</div>
                  </div>
                  <div className="sentence">
                    <div className="sentence-label">עברית:</div>
                    <div className="sentence-text">{word.sentenceHe}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="review-intro-actions">
          <button className="btn-start-review" onClick={handleStartReview}>
            למדתי, התחל חידון חזרה
          </button>
          <button className="btn-cancel" onClick={() => navigate('/vocabulary')}>
            בטל
          </button>
        </div>

        {/* Info Box */}
        <div className="info-box">
          <div className="info-icon">💡</div>
          <div className="info-content">
            <strong>זכור:</strong> בחידון החזרה, כל תשובה נכונה שווה 2 נקודות במקום 1!
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyReviewIntro;
