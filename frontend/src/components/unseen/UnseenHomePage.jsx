import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import unseenService from '../../services/unseenService';
import './UnseenHomePage.css';

const UnseenHomePage = () => {
  const navigate = useNavigate();
  const [paragraphs, setParagraphs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterComplexity, setFilterComplexity] = useState(null);
  const [filterTopic, setFilterTopic] = useState('');
  const [filterStatus, setFilterStatus] = useState('not-done'); // 'all', 'not-done', 'done'

  useEffect(() => {
    loadData();
  }, [filterComplexity, filterTopic]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const filters = {};
      if (filterComplexity) filters.complexity = filterComplexity;
      if (filterTopic) filters.topic = filterTopic;

      const [paragraphsData, statsData] = await Promise.all([
        unseenService.getAllParagraphs(filters),
        unseenService.getUserStats().catch(() => null)
      ]);

      setParagraphs(paragraphsData?.data || paragraphsData || []);
      setStats(statsData?.data || statsData);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load unseen data:', err);
      setError('שגיאה בטעינת הנתונים');
      setLoading(false);
    }
  };

  const handleParagraphClick = (paragraphId) => {
    navigate(`/unseen/reading/${paragraphId}`);
  };

  const getComplexityBadge = (level) => {
    const badges = {
      1: { label: 'קל', color: 'easy', stars: '⭐' },
      2: { label: 'בינוני', color: 'medium', stars: '⭐⭐' },
      3: { label: 'בינוני-מתקדם', color: 'medium-hard', stars: '⭐⭐⭐' },
      4: { label: 'מאתגר', color: 'hard', stars: '⭐⭐⭐⭐' },
      5: { label: 'מתקדם', color: 'expert', stars: '⭐⭐⭐⭐⭐' }
    };
    return badges[level] || badges[1];
  };

  const getProgressIcon = (userProgress) => {
    if (!userProgress) return '📝';
    if (userProgress.best_score >= 90) return '🏆';
    if (userProgress.best_score >= 80) return '⭐';
    if (userProgress.best_score >= 70) return '✅';
    return '📖';
  };

  const getScoreBadgeClass = (score) => {
    if (score >= 90) return 'score-excellent';
    if (score >= 80) return 'score-great';
    if (score >= 70) return 'score-good';
    return 'score-needs-work';
  };

  const getAllTopics = () => {
    const topics = [...new Set(paragraphs.map(p => p.topic).filter(Boolean))];
    return topics.sort();
  };

  const getFilteredParagraphs = () => {
    return paragraphs.filter(paragraph => {
      // Apply status filter
      if (filterStatus === 'not-done' && paragraph.userProgress) {
        return false; // Hide paragraphs that have been attempted
      }
      if (filterStatus === 'done' && !paragraph.userProgress) {
        return false; // Hide paragraphs that haven't been attempted
      }
      return true;
    });
  };

  if (loading) {
    return (
      <div className="unseen-home-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>טוען פסקאות...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="unseen-home-page">
      <div className="page-header">
        <h1 className="page-title">📖 פסקאות באנגלית - Unseen</h1>
        <p className="page-subtitle">
          קרא פסקאות באנגלית וענה על 5 שאלות הבנה
        </p>
      </div>

      {/* Statistics Section */}
      {stats && stats.progressStats && (
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <div className="stat-value">{stats.progressStats.total_attempted || 0}</div>
              <div className="stat-label">פסקאות שנענו</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-value">{Math.round(stats.progressStats.average_score || 0)}%</div>
              <div className="stat-label">ציון ממוצע</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <div className="stat-value">{stats.progressStats.excellent_count || 0}</div>
              <div className="stat-label">ביצועים מצוינים (80%+)</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filter-group">
          <label>סטטוס:</label>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterStatus === 'not-done' ? 'active' : ''}`}
              onClick={() => setFilterStatus('not-done')}
            >
              לא בוצע
            </button>
            <button
              className={`filter-btn ${filterStatus === 'done' ? 'active' : ''}`}
              onClick={() => setFilterStatus('done')}
            >
              בוצע
            </button>
            <button
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              הכל
            </button>
          </div>
        </div>

        <div className="filter-group">
          <label>סינון לפי רמת קושי:</label>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterComplexity === null ? 'active' : ''}`}
              onClick={() => setFilterComplexity(null)}
            >
              הכל
            </button>
            {[1, 2, 3, 4, 5].map(level => {
              const badge = getComplexityBadge(level);
              return (
                <button
                  key={level}
                  className={`filter-btn ${filterComplexity === level ? 'active' : ''}`}
                  onClick={() => setFilterComplexity(level)}
                >
                  {badge.stars}
                </button>
              );
            })}
          </div>
        </div>

        {getAllTopics().length > 0 && (
          <div className="filter-group">
            <label>סינון לפי נושא:</label>
            <select
              className="topic-filter"
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
            >
              <option value="">כל הנושאים</option>
              {getAllTopics().map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Results count */}
      {paragraphs.length > 0 && (
        <div className="results-count">
          מציג {getFilteredParagraphs().length} מתוך {paragraphs.length} פסקאות
        </div>
      )}

      {/* Paragraphs Grid */}
      <div className="paragraphs-grid">
        {getFilteredParagraphs().length === 0 ? (
          <div className="no-paragraphs">
            <p>לא נמצאו פסקאות</p>
          </div>
        ) : (
          getFilteredParagraphs().map((paragraph) => {
            const badge = getComplexityBadge(paragraph.complexity_level);
            const userProgress = paragraph.userProgress;
            const progressIcon = getProgressIcon(userProgress);

            return (
              <div
                key={paragraph.id}
                className={`paragraph-card ${userProgress ? 'attempted' : ''}`}
                onClick={() => handleParagraphClick(paragraph.id)}
              >
                {userProgress && (
                  <div className="completed-badge">
                    <span className="checkmark">✓</span> בוצע
                  </div>
                )}
                <div className="card-header">
                  <div className="card-icon">{progressIcon}</div>
                  <div className={`complexity-badge ${badge.color}`}>
                    {badge.stars}
                    <span className="complexity-label">{badge.label}</span>
                  </div>
                </div>

                <div className="card-body">
                  <h3 className="paragraph-title">{paragraph.title_en}</h3>
                  {paragraph.title_he && (
                    <p className="paragraph-title-he">{paragraph.title_he}</p>
                  )}
                  {paragraph.topic && (
                    <span className="topic-tag">{paragraph.topic}</span>
                  )}
                </div>

                {userProgress && (
                  <div className="card-footer">
                    <div className={`score-badge ${getScoreBadgeClass(userProgress.best_score)}`}>
                      {userProgress.best_score}%
                    </div>
                    <div className="attempts-info">
                      ניסיונות: {userProgress.attempts}
                    </div>
                  </div>
                )}

                {!userProgress && (
                  <div className="card-footer">
                    <span className="not-started">לא התחלת עדיין</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UnseenHomePage;
