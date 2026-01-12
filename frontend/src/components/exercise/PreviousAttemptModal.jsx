import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PreviousAttemptModal.css';

/**
 * PreviousAttemptModal - Shows reminder when user returns to a previously completed exercise
 *
 * Props:
 * - isOpen: boolean - whether modal is visible
 * - onContinue: function - callback when user decides to continue anyway
 * - progress: object - { bestScore, attempts, lastAttemptedAt }
 * - lessonTitle: string - title of the lesson in Hebrew
 */
const PreviousAttemptModal = ({ isOpen, onContinue, progress, lessonTitle }) => {
  const navigate = useNavigate();

  if (!isOpen || !progress) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getIcon = (score) => {
    if (score >= 90) return '🏆';
    if (score >= 80) return '⭐';
    if (score >= 70) return '✅';
    return '📝';
  };

  const getMessage = (score) => {
    if (score >= 90) {
      return 'מצוין! עשית עבודה נהדרת! רוצה לנסות לשפר עוד?';
    }
    if (score >= 80) {
      return 'כל הכבוד! עשית עבודה מצוינת! רוצה לנסות לשפר?';
    }
    if (score >= 70) {
      return 'יופי! אפשר להשתפר עוד קצת. רוצה לנסות שוב?';
    }
    return 'אל תוותר! תמשיך לתרגל ותשתפר!';
  };

  const handleGoBack = () => {
    navigate('/topics');
  };

  return (
    <div className="previous-attempt-overlay" onClick={handleGoBack}>
      <div className="previous-attempt-modal" onClick={(e) => e.stopPropagation()}>
        {/* Icon based on best score */}
        <div className="previous-attempt-icon">
          {getIcon(progress.bestScore)}
        </div>

        <h2 className="previous-attempt-title">כבר עשית את המבחן הזה!</h2>
        {lessonTitle && <p className="previous-attempt-lesson">{lessonTitle}</p>}

        {/* Stats display */}
        <div className="previous-attempt-stats">
          <div className="stat-item">
            <span className="stat-label">הציון הכי טוב</span>
            <span className="stat-value">{progress.bestScore}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">ניסיונות</span>
            <span className="stat-value">{progress.attempts}</span>
          </div>
          {progress.lastAttemptedAt && (
            <div className="stat-item">
              <span className="stat-label">ניסיון אחרון</span>
              <span className="stat-value stat-date">{formatDate(progress.lastAttemptedAt)}</span>
            </div>
          )}
        </div>

        {/* Encouragement message based on score */}
        <p className="previous-attempt-message">
          {getMessage(progress.bestScore)}
        </p>

        {/* Action buttons */}
        <div className="previous-attempt-actions">
          <button className="btn-continue" onClick={onContinue}>
            כן, בוא נתחיל! 🚀
          </button>
          <button className="btn-go-back" onClick={handleGoBack}>
            חזרה לנושאים
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviousAttemptModal;
