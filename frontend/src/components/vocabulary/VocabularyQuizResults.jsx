import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import vocabularyService from '../../services/vocabularyService';
import './VocabularyQuizResults.css';

const VocabularyQuizResults = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadResults();
  }, [sessionId]);

  const loadResults = async () => {
    try {
      setLoading(true);
      const response = await vocabularyService.getQuizStatus(sessionId);
      const data = response.data || response;
      setResults(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load results:', err);
      setError('שגיאה בטעינת התוצאות');
      setLoading(false);
    }
  };

  const handleStartNewQuiz = () => {
    navigate('/vocabulary');
  };

  const handleStartReview = () => {
    navigate('/vocabulary/review/intro');
  };

  if (loading) {
    return (
      <div className="vocabulary-results-page">
        <div className="loading">טוען תוצאות...</div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="vocabulary-results-page">
        <div className="error-message">{error || 'לא נמצאו תוצאות'}</div>
        <button onClick={handleStartNewQuiz} className="btn-home">
          חזרה לדף הבית
        </button>
      </div>
    );
  }

  const score = Math.round((results.correct_answers / results.total_questions) * 100);
  const isPassed = score >= 70;

  return (
    <div className="vocabulary-results-page">
      <div className="results-container">
        {/* Results Header */}
        <div className={`results-header ${isPassed ? 'passed' : 'failed'}`}>
          <div className="results-icon">
            {isPassed ? '🎉' : '📚'}
          </div>
          <h1 className="results-title">
            {isPassed ? 'כל הכבוד!' : 'נסה שוב!'}
          </h1>
          <div className="score-circle">
            <div className="score-value">{score}%</div>
            <div className="score-label">ציון</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="results-stats">
          <div className="stat-card">
            <div className="stat-icon">✓</div>
            <div className="stat-content">
              <div className="stat-value">{results.correct_answers}</div>
              <div className="stat-label">תשובות נכונות</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✗</div>
            <div className="stat-content">
              <div className="stat-value">{results.wrong_answers}</div>
              <div className="stat-label">תשובות שגויות</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🪙</div>
            <div className="stat-content">
              <div className="stat-value">{results.points_earned || results.correct_answers}</div>
              <div className="stat-label">נקודות שהרווחת</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{results.total_questions}</div>
              <div className="stat-label">סה"כ שאלות</div>
            </div>
          </div>
        </div>

        {/* Review Alert */}
        {results.status === 'completed' && (
          <div className="review-check-section">
            <ReviewCheck onStartReview={handleStartReview} />
          </div>
        )}

        {/* Actions */}
        <div className="results-actions">
          <button className="btn-primary" onClick={handleStartNewQuiz}>
            חידון חדש
          </button>
          <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
            חזרה לדף הבית
          </button>
        </div>
      </div>
    </div>
  );
};

// Component to check if review is needed
const ReviewCheck = ({ onStartReview }) => {
  const [reviewStatus, setReviewStatus] = useState(null);

  useEffect(() => {
    checkReview();
  }, []);

  const checkReview = async () => {
    try {
      const response = await vocabularyService.checkReviewRequired();
      const data = response.data || response;
      setReviewStatus(data);
    } catch (err) {
      console.error('Failed to check review status:', err);
    }
  };

  if (!reviewStatus || !reviewStatus.reviewRequired) {
    return null;
  }

  return (
    <div className="review-needed-alert">
      <div className="alert-icon">⚠️</div>
      <div className="alert-content">
        <h3>הגיע הזמן לחזרה!</h3>
        <p>צברת {reviewStatus.accumulatedFails} שגיאות. בוא נחזור על המילים הקשות.</p>
      </div>
      <button className="btn-review" onClick={onStartReview}>
        התחל חזרה
      </button>
    </div>
  );
};

export default VocabularyQuizResults;
