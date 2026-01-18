import React, { useState, useEffect } from 'react';
import vocabularyService from '../../services/vocabularyService';
import './VocabularyWordStats.css';

const VocabularyWordStats = () => {
  const [stats, setStats] = useState(null);
  const [wordScores, setWordScores] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterMastery, setFilterMastery] = useState('all');
  const [sortBy, setSortBy] = useState('lastAttempt');
  const [expandedWordId, setExpandedWordId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndSortWords();
  }, [wordScores, filterMastery, sortBy]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, scoresData] = await Promise.all([
        vocabularyService.getDetailedStats(),
        vocabularyService.getAllWordScores()
      ]);

      setStats(statsData?.data || statsData);
      setWordScores(scoresData?.data || scoresData);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load word stats:', err);
      setError('שגיאה בטעינת הנתונים');
      setLoading(false);
    }
  };

  const filterAndSortWords = () => {
    let filtered = [...wordScores];

    // Filter by mastery
    if (filterMastery !== 'all') {
      filtered = filtered.filter(w => w.mastery_level === filterMastery);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'lastAttempt':
          return new Date(b.last_attempt_at) - new Date(a.last_attempt_at);
        case 'failures':
          return b.fail_count - a.fail_count;
        case 'successes':
          return b.success_count - a.success_count;
        case 'alphabetical':
          return a.english_word.localeCompare(b.english_word);
        default:
          return 0;
      }
    });

    setFilteredWords(filtered);
  };

  const toggleWordExpanded = (wordId) => {
    setExpandedWordId(expandedWordId === wordId ? null : wordId);
  };

  const getMasteryBadgeClass = (level) => {
    const baseClass = 'mastery-badge';
    return `${baseClass} ${baseClass}-${level}`;
  };

  const getMasteryLabel = (level) => {
    const labels = {
      not_started: 'לא התחיל',
      learning: 'לומד',
      struggling: 'מתקשה',
      mastered: 'שולט'
    };
    return labels[level] || level;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  };

  if (loading) {
    return (
      <div className="vocabulary-word-stats">
        <div className="loading">טוען...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vocabulary-word-stats">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="vocabulary-word-stats">
      <div className="stats-container">
        <div className="stats-header">
          <h1>סטטיסטיקות מילים מפורטות</h1>
          <p>מעקב אחר כל המילים שתרגלת</p>
        </div>

        {/* Summary Stats */}
        {stats && stats.wordsByMastery && (
          <div className="summary-stats">
            <div className="summary-card">
              <div className="summary-value">{stats.uniqueWordsWithSuccess || 0}</div>
              <div className="summary-label">מילים עם הצלחה</div>
            </div>
            <div className="summary-card">
              <div className="summary-value">{stats.uniqueWordsWithFailure || 0}</div>
              <div className="summary-label">מילים עם כישלון</div>
            </div>
            <div className="summary-card mastered">
              <div className="summary-value">{stats.wordsByMastery.mastered || 0}</div>
              <div className="summary-label">מילים ששלטת בהן</div>
            </div>
            <div className="summary-card struggling">
              <div className="summary-value">{stats.wordsByMastery.struggling || 0}</div>
              <div className="summary-label">מילים קשות</div>
            </div>
          </div>
        )}

        {/* Filters and Sort */}
        <div className="controls">
          <div className="filter-group">
            <label>סינון לפי רמת שליטה:</label>
            <select value={filterMastery} onChange={(e) => setFilterMastery(e.target.value)}>
              <option value="all">הכל ({wordScores.length})</option>
              <option value="mastered">שולט</option>
              <option value="learning">לומד</option>
              <option value="struggling">מתקשה</option>
            </select>
          </div>

          <div className="filter-group">
            <label>מיון לפי:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="lastAttempt">ניסיון אחרון</option>
              <option value="failures">כמות כישלונות</option>
              <option value="successes">כמות הצלחות</option>
              <option value="alphabetical">אלפביתי</option>
            </select>
          </div>
        </div>

        {/* Word List */}
        <div className="word-list">
          {filteredWords.length === 0 ? (
            <div className="no-words">לא נמצאו מילים</div>
          ) : (
            filteredWords.map((word) => (
              <div key={word.id} className="word-item">
                <div
                  className="word-summary"
                  onClick={() => toggleWordExpanded(word.id)}
                >
                  <div className="word-info">
                    <div className="word-english">{word.english_word}</div>
                    <div className="word-hebrew">{word.hebrew_translation}</div>
                  </div>

                  <div className="word-stats">
                    <span className={getMasteryBadgeClass(word.mastery_level)}>
                      {getMasteryLabel(word.mastery_level)}
                    </span>
                    <span className="stat-item success">
                      ✓ {word.success_count}
                    </span>
                    <span className="stat-item fail">
                      ✗ {word.fail_count}
                    </span>
                    <span className="stat-item date">
                      {formatDate(word.last_attempt_at)}
                    </span>
                  </div>

                  <div className="expand-icon">
                    {expandedWordId === word.id ? '▲' : '▼'}
                  </div>
                </div>

                {expandedWordId === word.id && (
                  <div className="word-details">
                    <div className="detail-row">
                      <span className="detail-label">רמת קושי:</span>
                      <span className="detail-value">{word.difficulty_level}/10</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">סה"כ ניסיונות:</span>
                      <span className="detail-value">
                        {word.success_count + word.fail_count}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">היסטוריית ניסיונות:</span>
                      <div className="attempt-history">
                        {word.attempt_history && word.attempt_history.length > 0 ? (
                          word.attempt_history.slice(-20).map((attempt, index) => (
                            <span
                              key={index}
                              className={`attempt-badge ${attempt === 'success' ? 'success' : 'failed'}`}
                              title={attempt === 'success' ? 'הצלחה' : 'כישלון'}
                            >
                              {attempt === 'success' ? '✓' : '✗'}
                            </span>
                          ))
                        ) : (
                          <span>אין היסטוריה</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VocabularyWordStats;
