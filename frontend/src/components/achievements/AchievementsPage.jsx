import React from 'react';
import { useNavigate } from 'react-router-dom';
import AchievementsList from './AchievementsList';
import './Achievements.css';

/**
 * AchievementsPage - Full page for viewing all achievements
 */
const AchievementsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="achievements-page">
      {/* Header */}
      <div className="achievements-page-header">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ← חזרה לדשבורד
        </button>
        <h1 className="achievements-page-title">🏆 ההישגים שלי 🏆</h1>
        <p className="achievements-page-subtitle">
          השלם אתגרים ופתח הישגים כדי לזכות בנקודות ותגים מיוחדים
        </p>
      </div>

      {/* Achievements List */}
      <AchievementsList />
    </div>
  );
};

export default AchievementsPage;
