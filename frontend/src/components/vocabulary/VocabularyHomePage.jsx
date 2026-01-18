import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import vocabularyService from '../../services/vocabularyService';
import './VocabularyHomePage.css';

const VocabularyHomePage = () => {
  const navigate = useNavigate();
  const [quizSize, setQuizSize] = useState(10);
  const [difficultyLevel, setDifficultyLevel] = useState(1); // 1: beginner, 2: intermediate, 3: advanced
  const [source, setSource] = useState(null); // null: all sources, 'band22', 'lexisband3', 'scrap', 'band33july18'
  const [stats, setStats] = useState(null);
  const [detailedStats, setDetailedStats] = useState(null);
  const [reviewStatus, setReviewStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, detailedStatsData, reviewData] = await Promise.all([
        vocabularyService.getStats().catch(() => null),
        vocabularyService.getDetailedStats().catch(() => null),
        vocabularyService.checkReviewRequired().catch(() => null)
      ]);

      // vocabularyService already returns unwrapped data from axios interceptor
      setStats(statsData?.data || statsData);
      setDetailedStats(detailedStatsData?.data || detailedStatsData);
      setReviewStatus(reviewData?.data || reviewData);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load vocabulary data:', err);
      setError('שגיאה בטעינת הנתונים');
      setLoading(false);
    }
  };

  const handleStartQuiz = async () => {
    // Prevent multiple simultaneous requests
    if (loading) return;

    try {
      setLoading(true);
      setError('');
      const response = await vocabularyService.startQuiz(quizSize, difficultyLevel, source);

      console.log('Quiz start response:', response);

      // Handle both response formats: {success, data: {sessionId}} and {success, data: {...sessionId}}
      const sessionId = response.data?.sessionId || response.sessionId;

      if (sessionId) {
        navigate(`/vocabulary/quiz/${sessionId}`);
      } else {
        console.error('Invalid response format:', response);
        setError(response.message || 'שגיאה בהתחלת החידון');
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to start quiz:', err);

      // Check if there's already an active session
      // The error object structure after axios interceptor: err = {success: false, message: "...", data: {sessionId: "..."}}
      if (err.data?.sessionId) {
        console.log('Active session found, navigating to it:', err.data.sessionId);
        navigate(`/vocabulary/quiz/${err.data.sessionId}`);
      } else {
        // Translate error messages to Hebrew
        let errorMessage = err.message || 'שגיאה בהתחלת החידון';

        if (errorMessage.includes('Not enough words available')) {
          if (errorMessage.includes('scrap') && errorMessage.includes('difficulty level 1')) {
            errorMessage = 'אין מספיק מילים ממקור Scrap ברמת מתחיל. אנא בחר רמה בינונית או מתקדמת.';
          } else {
            errorMessage = 'אין מספיק מילים זמינות עבור השילוב שנבחר. אנא נסה רמת קושי או מקור אחר.';
          }
        }

        setError(errorMessage);
        setLoading(false);
      }
    }
  };

  const handleStartReview = () => {
    navigate('/vocabulary/review/intro');
  };

  const handleStartFailedWordsQuiz = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setError('');
      const response = await vocabularyService.startFailedWordsQuiz();

      const sessionId = response.data?.sessionId || response.sessionId;

      if (sessionId) {
        navigate(`/vocabulary/quiz/${sessionId}`);
      } else {
        setError('שגיאה בהתחלת חידון מילים קשות');
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to start failed words quiz:', err);

      if (err.data?.sessionId) {
        navigate(`/vocabulary/quiz/${err.data.sessionId}`);
      } else {
        setError(err.message || 'שגיאה בהתחלת חידון מילים קשות');
        setLoading(false);
      }
    }
  };

  const handleStartPastErrorsQuiz = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setError('');
      const response = await vocabularyService.startPastErrorsQuiz(quizSize, 1);

      const sessionId = response.data?.sessionId || response.sessionId;

      if (sessionId) {
        navigate(`/vocabulary/quiz/${sessionId}`);
      } else {
        setError('שגיאה בהתחלת חידון טעויות');
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to start past errors quiz:', err);

      if (err.data?.sessionId) {
        navigate(`/vocabulary/quiz/${err.data.sessionId}`);
      } else {
        setError(err.message || 'שגיאה בהתחלת חידון טעויות');
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="vocabulary-home-page">
        <div className="loading">טוען...</div>
      </div>
    );
  }

  return (
    <div className="vocabulary-home-page">
      <div className="vocabulary-home-container">
        <div className="vocabulary-home-header">
          <h1>לימוד מילים באנגלית</h1>
          <p>שפר את אוצר המילים שלך באמצעות חידונים אינטראקטיביים</p>
          <button
            className="btn-view-history"
            onClick={() => navigate('/vocabulary/history')}
          >
            📋 צפה בהיסטוריית ניסיונות
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Review Mode Alert */}
        {reviewStatus && reviewStatus.reviewRequired && (
          <div className="review-alert">
            <div className="review-alert-icon">⚠️</div>
            <div className="review-alert-content">
              <h3>הגיע הזמן לחזרה!</h3>
              <p>צברת {reviewStatus.accumulatedFails} שגיאות. בוא נחזור על המילים הקשות.</p>
              <button className="btn-review" onClick={handleStartReview}>
                התחל חזרה
              </button>
            </div>
          </div>
        )}

        {/* Stats Display */}
        {stats && (
          <div className="stats-overview">
            <div className="stat-box">
              <div className="stat-value">{stats.totalWordsLearned}</div>
              <div className="stat-label">מילים שנלמדו</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{stats.totalQuizzesCompleted}</div>
              <div className="stat-label">חידונים הושלמו</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{stats.accumulatedFails}/10</div>
              <div className="stat-label">שגיאות נצברות</div>
            </div>
            {stats.sessionStats && (
              <div className="stat-box">
                <div className="stat-value">{stats.sessionStats.averageScore}%</div>
                <div className="stat-label">ציון ממוצע</div>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Stats with Mastery Breakdown */}
        {detailedStats && detailedStats.wordsByMastery && (
          <div className="mastery-overview">
            <h3>התקדמות שליטה במילים</h3>
            <div className="mastery-stats">
              <div className="mastery-stat">
                <span className="mastery-label">שולט</span>
                <span className="mastery-value mastered">{detailedStats.wordsByMastery.mastered || 0}</span>
              </div>
              <div className="mastery-stat">
                <span className="mastery-label">לומד</span>
                <span className="mastery-value learning">{detailedStats.wordsByMastery.learning || 0}</span>
              </div>
              <div className="mastery-stat">
                <span className="mastery-label">מתקשה</span>
                <span className="mastery-value struggling">{detailedStats.wordsByMastery.struggling || 0}</span>
              </div>
            </div>
            <div className="mastery-bar">
              {(() => {
                const total = (detailedStats.wordsByMastery.mastered || 0) +
                             (detailedStats.wordsByMastery.learning || 0) +
                             (detailedStats.wordsByMastery.struggling || 0);
                if (total === 0) return null;
                const masteredPercent = ((detailedStats.wordsByMastery.mastered || 0) / total) * 100;
                const learningPercent = ((detailedStats.wordsByMastery.learning || 0) / total) * 100;
                const strugglingPercent = ((detailedStats.wordsByMastery.struggling || 0) / total) * 100;
                return (
                  <>
                    <div className="mastery-segment mastered" style={{width: `${masteredPercent}%`}} title={`${Math.round(masteredPercent)}% שולט`}></div>
                    <div className="mastery-segment learning" style={{width: `${learningPercent}%`}} title={`${Math.round(learningPercent)}% לומד`}></div>
                    <div className="mastery-segment struggling" style={{width: `${strugglingPercent}%`}} title={`${Math.round(strugglingPercent)}% מתקשה`}></div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* Failed Words Quiz Section */}
        {detailedStats && detailedStats.wordsByMastery && detailedStats.wordsByMastery.struggling > 0 && (
          <div className="failed-words-section">
            <div className="failed-words-icon">📚</div>
            <div className="failed-words-content">
              <h3>מילים שדורשות תשומת לב</h3>
              <p>יש לך {detailedStats.wordsByMastery.struggling} מילים שכדאי לחזור עליהן</p>
              <button
                className="btn-failed-words-quiz"
                onClick={handleStartFailedWordsQuiz}
                disabled={loading}
              >
                {loading ? 'טוען...' : 'התחל חידון מילים קשות'}
              </button>
            </div>
          </div>
        )}

        {/* Past Errors Quiz Section */}
        {detailedStats && detailedStats.uniqueWordsWithFailure > 0 && (
          <div className="past-errors-section">
            <div className="past-errors-icon">🔄</div>
            <div className="past-errors-content">
              <h3>חזרה על טעויות קודמות</h3>
              <p>יש לך {detailedStats.uniqueWordsWithFailure} מילים שטעית בהן לפחות פעם אחת</p>
              <button
                className="btn-past-errors-quiz"
                onClick={handleStartPastErrorsQuiz}
                disabled={loading}
              >
                {loading ? 'טוען...' : 'התחל חידון טעויות קודמות'}
              </button>
            </div>
          </div>
        )}

        {/* Quiz Setup */}
        <div className="quiz-setup">
          <h2>התחל חידון חדש</h2>

          {/* Difficulty Level Selector */}
          <div className="difficulty-selector">
            <label>בחר רמת קושי:</label>
            <div className="difficulty-options">
              <button
                className={`difficulty-option beginner ${difficultyLevel === 1 ? 'selected' : ''}`}
                onClick={() => setDifficultyLevel(1)}
              >
                <div className="difficulty-icon">🌱</div>
                <div className="difficulty-label">מתחיל</div>
                <div className="difficulty-range">רמות 1-3</div>
              </button>
              <button
                className={`difficulty-option intermediate ${difficultyLevel === 2 ? 'selected' : ''}`}
                onClick={() => setDifficultyLevel(2)}
              >
                <div className="difficulty-icon">⚡</div>
                <div className="difficulty-label">בינוני</div>
                <div className="difficulty-range">רמות 3-5</div>
              </button>
              <button
                className={`difficulty-option advanced ${difficultyLevel === 3 ? 'selected' : ''}`}
                onClick={() => setDifficultyLevel(3)}
              >
                <div className="difficulty-icon">🔥</div>
                <div className="difficulty-label">מתקדם</div>
                <div className="difficulty-range">רמות 5-10</div>
              </button>
            </div>
          </div>

          {/* Quiz Size Selector */}
          <div className="quiz-size-selector">
            <label>בחר מספר מילים לתרגול:</label>
            <div className="size-options">
              {[5, 10, 15, 20, 30].map(size => (
                <button
                  key={size}
                  className={`size-option ${quizSize === size ? 'selected' : ''}`}
                  onClick={() => setQuizSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Source Selector */}
          <div className="source-selector">
            <label>בחר מקור מילים:</label>
            {source === 'scrap' && difficultyLevel === 1 && (
              <div className="source-warning">
                ⚠️ מקור Scrap לא זמין ברמת מתחיל. בחר רמה בינונית או מתקדמת.
              </div>
            )}
            <div className="source-options">
              <button
                className={`source-option ${source === null ? 'selected' : ''}`}
                onClick={() => setSource(null)}
              >
                <div className="source-label">כל המילים</div>
                <div className="source-count">3,287 מילים</div>
                <div className="source-levels">כל הרמות</div>
              </button>
              <button
                className={`source-option ${source === 'band22' ? 'selected' : ''}`}
                onClick={() => setSource('band22')}
              >
                <div className="source-label">Band 22</div>
                <div className="source-count">1,285 מילים</div>
                <div className="source-levels">כל הרמות</div>
              </button>
              <button
                className={`source-option ${source === 'lexisband3' ? 'selected' : ''}`}
                onClick={() => setSource('lexisband3')}
              >
                <div className="source-label">Band 3</div>
                <div className="source-count">696 מילים</div>
                <div className="source-levels">רמות 8-9</div>
              </button>
              <button
                className={`source-option ${source === 'band33july18' ? 'selected' : ''}`}
                onClick={() => setSource('band33july18')}
              >
                <div className="source-label">Band 33 July 18</div>
                <div className="source-count">1,729 מילים</div>
                <div className="source-levels">רמות 6-9</div>
              </button>
              <button
                className={`source-option ${source === 'scrap' ? 'selected' : ''}`}
                onClick={() => setSource('scrap')}
              >
                <div className="source-label">Scrap</div>
                <div className="source-count">45 מילים</div>
                <div className="source-levels">רק בינוני/מתקדם</div>
              </button>
            </div>
          </div>

          <button
            className="btn-start-quiz"
            onClick={handleStartQuiz}
            disabled={loading || (source === 'scrap' && difficultyLevel === 1)}
          >
            {loading ? 'טוען...' : `התחל חידון (${quizSize} מילים)`}
          </button>
        </div>

        {/* How it Works */}
        <div className="how-it-works">
          <h3>איך זה עובד?</h3>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>בחר את הרמה שלך</h4>
                <p>התחל ברמת קושי שמתאימה לך - מתחיל, בינוני או מתקדם</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>התקדם ברמות</h4>
                <p>אחרי 3 תשובות נכונות ברצף - נעבור לרמה גבוהה יותר</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>חזור על טעויות</h4>
                <p>אחרי 10 שגיאות - נבצע חידון חזרה מיוחד</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyHomePage;
