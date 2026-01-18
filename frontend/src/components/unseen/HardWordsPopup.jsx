import React from 'react';
import './HardWordsPopup.css';

const HardWordsPopup = ({ hardWords, onClose }) => {
  if (!hardWords || hardWords.length === 0) return null;

  return (
    <div className="hard-words-overlay" onClick={onClose}>
      <div className="hard-words-popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>📖 מילים קשות</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <div className="words-list">
          {hardWords.map((wordObj, index) => (
            <div key={index} className="word-item">
              <div className="word-english" dir="ltr">{wordObj.word}</div>
              <div className="word-arrow">←</div>
              <div className="word-hebrew">{wordObj.translation}</div>
            </div>
          ))}
        </div>

        <div className="popup-footer">
          <button onClick={onClose} className="close-button">
            סגור
          </button>
        </div>
      </div>
    </div>
  );
};

export default HardWordsPopup;
