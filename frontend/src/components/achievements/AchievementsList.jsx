import React, { useState, useEffect } from 'react';
import AchievementCard from './AchievementCard';
import achievementService from '../../services/achievementService';
import './Achievements.css';

/**
 * AchievementsList - Display grid of all achievements with filters
 */
const AchievementsList = () => {
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterTier, setFilterTier] = useState('all');

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const [achievementsData, statsData] = await Promise.all([
        achievementService.getAchievements(),
        achievementService.getStats()
      ]);

      setAchievements(achievementsData.data);
      setStats(statsData.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load achievements:', err);
      setError('שגיאה בטעינת ההישגים');
      setLoading(false);
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = filterCategory === 'all' || achievement.category === filterCategory;
    const tierMatch = filterTier === 'all' || achievement.tier === filterTier;
    return categoryMatch && tierMatch;
  });

  // Group achievements by category
  const groupedAchievements = filteredAchievements.reduce((acc, achievement) => {
    const category = achievement.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(achievement);
    return acc;
  }, {});

  const categoryLabels = {
    progress: 'התקדמות',
    mastery: 'מצוינות',
    streak: 'רצף',
    points: 'נקודות',
    mistakes: 'תיקון טעויות',
    other: 'אחר'
  };

  if (loading) {
    return (
      <div className="achievements-loading">
        <div className="spinner"></div>
        <p>טוען הישגים...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="achievements-error">
        <p>{error}</p>
        <button onClick={loadAchievements}>נסה שוב</button>
      </div>
    );
  }

  return (
    <div className="achievements-list-container">
      {/* Statistics Section */}
      {stats && (
        <div className="achievements-stats-header">
          <div className="achievement-stat-card">
            <div className="achievement-stat-value">{stats.unlocked}</div>
            <div className="achievement-stat-label">נפתחו</div>
          </div>
          <div className="achievement-stat-card">
            <div className="achievement-stat-value">{stats.locked}</div>
            <div className="achievement-stat-label">נעולים</div>
          </div>
          <div className="achievement-stat-card">
            <div className="achievement-stat-value">{stats.percentage}%</div>
            <div className="achievement-stat-label">השלמה</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="achievements-filters">
        <div className="filter-group">
          <label>קטגוריה:</label>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">הכל</option>
            <option value="progress">התקדמות</option>
            <option value="mastery">מצוינות</option>
            <option value="streak">רצף</option>
            <option value="points">נקודות</option>
            <option value="mistakes">תיקון טעויות</option>
          </select>
        </div>

        <div className="filter-group">
          <label>דרגה:</label>
          <select value={filterTier} onChange={(e) => setFilterTier(e.target.value)}>
            <option value="all">הכל</option>
            <option value="bronze">ארד</option>
            <option value="silver">כסף</option>
            <option value="gold">זהב</option>
            <option value="platinum">פלטינה</option>
          </select>
        </div>
      </div>

      {/* Achievements Grid grouped by category */}
      <div className="achievements-content">
        {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
          <div key={category} className="achievement-category-section">
            <h2 className="achievement-category-title">{categoryLabels[category] || category}</h2>
            <div className="achievements-grid">
              {categoryAchievements.map(achievement => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="no-achievements">
          <p>לא נמצאו הישגים מתאימים לסינון</p>
        </div>
      )}
    </div>
  );
};

export default AchievementsList;
