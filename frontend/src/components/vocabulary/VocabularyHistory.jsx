import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import vocabularyService from '../../services/vocabularyService';
import './VocabularyHistory.css';

const VocabularyHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedWords, setExpandedWords] = useState(new Set());

  // Filters
  const [filter, setFilter] = useState('all'); // 'all', 'success', 'failed'
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(30);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filter]);

  // Refresh data when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [historyData, statsData] = await Promise.all([
        vocabularyService.getUserHistory(currentPage, limit, filter),
        vocabularyService.getHistoryStats()
      ]);

      const histData = historyData?.data || historyData;
      const statData = statsData?.data || statsData;

      setHistory(histData.records || []);
      setPagination(histData.pagination || null);
      setStats(statData);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load history:', err);
      setError('שגיאה בטעינת ההיסטוריה');
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleWordExpansion = (wordId) => {
    setExpandedWords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(wordId)) {
        newSet.delete(wordId);
      } else {
        newSet.add(wordId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateShort = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  };

  const getQuizTypeLabel = (quizType) => {
    const labels = {
      regular: 'חידון רגיל',
      review: 'חזרה',
      smart: 'חידון חכם',
      failed_words: 'מילים קשות'
    };
    return labels[quizType] || quizType || '-';
  };

  if (loading && !history.length) {
    return (
      <div className="vocabulary-history">
        <div className="loading">טוען...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vocabulary-history">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="vocabulary-history">
      <div className="history-container">
        <div className="history-header">
          <h1>היסטוריית ניסיונות</h1>
          <p>כל המילים שניסית לענות עליהן</p>
        </div>

        {/* Statistics Summary */}
        {stats && (
          <div className="history-stats">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-value">{stats.totalAttempts}</div>
                <div className="stat-label">סה"כ ניסיונות</div>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-value">{stats.totalSuccesses}</div>
                <div className="stat-label">הצלחות</div>
              </div>
            </div>
            <div className="stat-card failed">
              <div className="stat-icon">❌</div>
              <div className="stat-content">
                <div className="stat-value">{stats.totalFailures}</div>
                <div className="stat-label">כישלונות</div>
              </div>
            </div>
            <div className="stat-card rate">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <div className="stat-value">{stats.successRate}%</div>
                <div className="stat-label">אחוז הצלחה</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <div className="stat-value">{stats.uniqueWordsAttempted}</div>
                <div className="stat-label">מילים ייחודיות</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <div className="stat-value">{stats.totalQuizSessions}</div>
                <div className="stat-label">חידונים</div>
              </div>
            </div>
          </div>
        )}

        {stats && stats.firstAttemptDate && stats.lastAttemptDate && (
          <div className="date-range">
            <span>פעילות מ-{formatDateShort(stats.firstAttemptDate)}</span>
            <span> עד </span>
            <span>{formatDateShort(stats.lastAttemptDate)}</span>
          </div>
        )}

        {/* Filters */}
        <div className="history-filters">
          <div className="filter-group">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              הכל ({stats?.totalAttempts || 0})
            </button>
            <button
              className={`filter-btn success ${filter === 'success' ? 'active' : ''}`}
              onClick={() => handleFilterChange('success')}
            >
              הצלחות ({stats?.totalSuccesses || 0})
            </button>
            <button
              className={`filter-btn failed ${filter === 'failed' ? 'active' : ''}`}
              onClick={() => handleFilterChange('failed')}
            >
              כישלונות ({stats?.totalFailures || 0})
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="history-list">
          {history.length === 0 ? (
            <div className="no-history">
              <p>לא נמצאה היסטוריה</p>
              <button
                className="btn-start-quiz"
                onClick={() => navigate('/vocabulary')}
              >
                התחל חידון ראשון
              </button>
            </div>
          ) : (
            history.map((word) => {
              const isExpanded = expandedWords.has(word.word_id);
              const lastAttempt = word.attempts && word.attempts.length > 0 ? word.attempts[0] : null;
              const successRate = word.total_attempts > 0
                ? Math.round((word.success_count / word.total_attempts) * 100)
                : 0;

              return (
                <div
                  key={word.word_id}
                  className={`history-item word-item ${lastAttempt && lastAttempt.is_correct ? 'success' : 'failed'}`}
                >
                  <div className="word-header" onClick={() => toggleWordExpansion(word.word_id)}>
                    <div className="expand-icon">
                      {isExpanded ? '▼' : '▶'}
                    </div>

                    <div className="attempt-status">
                      <div className={`status-icon ${lastAttempt && lastAttempt.is_correct ? 'success' : 'failed'}`}>
                        {lastAttempt && lastAttempt.is_correct ? '✓' : '✗'}
                      </div>
                    </div>

                    <div className="attempt-info">
                      <div className="word-info">
                        <div className="word-english">{word.english_word}</div>
                        <div className="word-hebrew">{word.hebrew_translation}</div>
                      </div>

                      <div className="attempt-meta">
                        <span className="difficulty-badge">
                          רמה {word.difficulty_level}
                        </span>
                        <span className="attempts-summary success">
                          ✓ {word.success_count}
                        </span>
                        <span className="attempts-summary failed">
                          ✗ {word.fail_count}
                        </span>
                        <span className="success-rate-badge">
                          {successRate}% הצלחה
                        </span>
                      </div>
                    </div>

                    <div className="attempt-timestamp">
                      <div className="timestamp-label">ניסיון אחרון:</div>
                      <div className="timestamp">{formatDate(word.last_attempt_at)}</div>
                    </div>
                  </div>

                  {isExpanded && word.attempts && (
                    <div className="attempts-list">
                      <div className="attempts-header">
                        כל הניסיונות ({word.total_attempts}):
                      </div>
                      {word.attempts.map((attempt, index) => (
                        <div
                          key={attempt.id}
                          className={`attempt-row ${attempt.is_correct ? 'success' : 'failed'}`}
                        >
                          <div className="attempt-number">#{word.attempts.length - index}</div>
                          <div className={`attempt-result ${attempt.is_correct ? 'success' : 'failed'}`}>
                            {attempt.is_correct ? '✓ הצלחה' : '✗ כישלון'}
                          </div>
                          {attempt.quiz_type && (
                            <span className="quiz-type-badge">
                              {getQuizTypeLabel(attempt.quiz_type)}
                            </span>
                          )}
                          {attempt.source && (
                            <span className="source-badge">{attempt.source}</span>
                          )}
                          <div className="attempt-date">{formatDate(attempt.answered_at)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
            >
              ← הקודם
            </button>

            <div className="pagination-info">
              עמוד {pagination.page} מתוך {pagination.totalPages}
              <span className="total-records">
                ({pagination.totalRecords} ניסיונות)
              </span>
            </div>

            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasMore || loading}
            >
              הבא →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabularyHistory;
