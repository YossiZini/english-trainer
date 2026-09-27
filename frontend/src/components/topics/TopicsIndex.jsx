import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import lessonService from '../../services/lessonService';
import topicMeta, { getSubtopicExamples } from '../../content/topicMeta';
import './TopicsIndex.css';

// One page for every subject: the lessons come from the API filtered by
// subject, the display text from content/topicMeta.js.
const TopicsIndex = ({ subject = 'english' }) => {
  const { user, logout } = useAuth();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState([subject === 'math' ? 101 : 1]); // Expand first topic by default
  const [videoModal, setVideoModal] = useState({ isOpen: false, video: null });

  // Display text per subject (names, examples, descriptions, videos)
  const meta = topicMeta[subject] || topicMeta.english;
  const { topicNames, tocExamples, topicDescriptions, topicVideos } = meta;
  const displayNumber = (topicNumber) => topicNumber - meta.numberOffset;
  // '101.1' is shown as '1.1' on the Math page
  const displaySubtopic = (subtopicNumber) => String(subtopicNumber).replace(/^\d+/, n => displayNumber(Number(n)));
  const openVideoModal = (video) => {
    setVideoModal({ isOpen: true, video });
  };

  const closeVideoModal = () => {
    setVideoModal({ isOpen: false, video: null });
  };

  useEffect(() => {
    loadLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject]);

  // Handle ESC key to close video modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && videoModal.isOpen) {
        closeVideoModal();
      }
    };

    if (videoModal.isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [videoModal.isOpen]);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const data = await lessonService.getAllLessons({ subject });
      setTopics(data);
    } catch (error) {
      setError(error.message || 'Failed to load lessons');
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = (topicNumber) => {
    setExpandedTopics(prev =>
      prev.includes(topicNumber)
        ? prev.filter(t => t !== topicNumber)
        : [...prev, topicNumber]
    );
  };

  if (loading) {
    return (
      <div className="topics-container">
        <div className="loader-container">
          <div className="loader"></div>
          <p>טוען שיעורים...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="topics-container">
        <div className="error-container">
          <p>שגיאה: {error}</p>
          <button onClick={loadLessons} className="btn-retry">נסה שוב</button>
        </div>
      </div>
    );
  }

  return (
    <div className="topics-container">
      <header className="topics-header">
        <div className="header-content">
          <div className="header-title">
            <h1>{meta.title}</h1>
          </div>
          <div className="header-user">
            <span>שלום, {user?.name}!</span>
            <button onClick={logout} className="btn-logout">יציאה</button>
          </div>
        </div>
      </header>

      {/* Table of Contents */}
      <div className="table-of-contents">
        <h3 className="toc-title">תוכן העניינים</h3>
        <div className="toc-grid">
          {Object.keys(topicNames).map(topicNum => (
            <a
              key={topicNum}
              href={`#topic-${topicNum}`}
              className="toc-item"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(`topic-${topicNum}`);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              <span className="toc-number">{displayNumber(Number(topicNum))}</span>
              <span className="toc-content">
                <span className="toc-name">{topicNames[topicNum][meta.nameKey]}</span>
                <span className="toc-example">{tocExamples[topicNum]}</span>
              </span>
            </a>
          ))}
        </div>
      </div>

      <div className="topics-content">
        {topics.length === 0 ? (
          <div className="no-topics">
            <p>אין שיעורים זמינים כרגע</p>
          </div>
        ) : (
          <div className="topics-list">
            {topics.map((topic) => (
              <div key={topic.topicNumber} id={`topic-${topic.topicNumber}`} className="topic-card">
                <div
                  className="topic-header"
                  onClick={() => toggleTopic(topic.topicNumber)}
                >
                  <div className="topic-title">
                    <h2>נושא {displayNumber(topic.topicNumber)}: {topicNames[topic.topicNumber]?.[meta.nameKey] || `Topic ${topic.topicNumber}`}</h2>
                    <span className="topic-level">כל הרמות - מתחיל עד מתקדם</span>
                  </div>
                  <div className="topic-progress">
                    <div className="topic-progress-bar">
                      <div
                        className="topic-progress-fill"
                        style={{
                          width: `${(topic.lessons.filter(l => l.progress.status === 'completed').length / topic.lessons.length) * 100}%`
                        }}
                      />
                    </div>
                    <span className="progress-text">
                      {topic.lessons.filter(l => l.progress.status === 'completed').length}/{topic.lessons.length} הושלמו
                    </span>
                    <span className="expand-icon">
                      {expandedTopics.includes(topic.topicNumber) ? '▼' : '◀'}
                    </span>
                  </div>
                </div>

                {/* Topic Description and Examples - Always visible */}
                {topicDescriptions[topic.topicNumber] && (
                  <div className="topic-preview">
                    <p className="topic-description">
                      {topicDescriptions[topic.topicNumber].description}
                    </p>
                    <div className="topic-examples">
                      <strong>דוגמאות:</strong>
                      <ul>
                        {topicDescriptions[topic.topicNumber].examples.map((example, index) => (
                          <li key={index}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {expandedTopics.includes(topic.topicNumber) && (
                  <div className="topic-expanded-content">
                    {/* Video link if available */}
                    {topicVideos[topic.topicNumber] && (
                      <div className="topic-video-link-section">
                        <div
                          className="video-thumbnail-card"
                          onClick={() => openVideoModal(topicVideos[topic.topicNumber])}
                        >
                          <div className="video-thumbnail">
                            <div className="thumbnail-icon">
                              {topicVideos[topic.topicNumber].thumbnail}
                            </div>
                            <div className="play-overlay">
                              <div className="play-button">▶</div>
                            </div>
                            <div className="video-duration">
                              {topicVideos[topic.topicNumber].duration}
                            </div>
                          </div>
                          <div className="video-info">
                            <h4>{topicVideos[topic.topicNumber].title}</h4>
                            <p>{topicVideos[topic.topicNumber].description}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="subtopics-list">
                    {topic.lessons.map((lesson) => {
                      const examples = getSubtopicExamples(topic.topicNumber, lesson.subtopicNumber);

                      // Calculate progress summary
                      const difficulties = ['easy', 'medium', 'hard'];
                      const completedCount = difficulties.filter(
                        diff => lesson.progress.difficultyScores?.[diff]?.score >= 80
                      ).length;
                      const attemptedCount = difficulties.filter(
                        diff => lesson.progress.difficultyScores?.[diff]
                      ).length;

                      return (
                        <div
                          key={lesson.id}
                          className={`subtopic-item ${lesson.progress.status === 'completed' ? 'completed' : ''} ${lesson.progress.status === 'in_progress' ? 'in-progress' : ''}`}
                        >
                          <div className="subtopic-header-section">
                            <div className="subtopic-title-row">
                              <h3>{displaySubtopic(lesson.subtopicNumber)}. {lesson.titleHe}</h3>
                              <p className="subtopic-title-en">{lesson.titleEn}</p>

                              {/* Progress Summary Badge */}
                              {attemptedCount > 0 && (
                                <span className={`progress-summary ${completedCount === 3 ? 'all-passed' : ''}`}>
                                  {completedCount === 3 ? '✓' : `${completedCount}/3`}
                                </span>
                              )}
                            </div>

                            {/* Examples */}
                            {examples && examples.length > 0 && (
                              <div className="subtopic-examples">
                                {examples.map((example, idx) => (
                                  <span key={idx} className="example-badge">{example}</span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Compact Action Buttons Row */}
                          <div className="subtopic-actions-compact">
                            <Link
                              to={`/learn/${lesson.id}`}
                              className="btn-compact btn-learn-compact"
                            >
                              📖 Learn
                            </Link>
                            <Link
                              to={`/exercise/${lesson.id}?difficulty=easy`}
                              className={`btn-compact btn-level ${lesson.progress.difficultyScores?.easy?.score >= 80 ? 'passed' : lesson.progress.difficultyScores?.easy ? 'attempted' : 'not-attempted'}`}
                            >
                              <span className="status-icon">
                                {lesson.progress.difficultyScores?.easy?.score >= 80 ? '✓' :
                                 lesson.progress.difficultyScores?.easy ? '⚠' : '○'}
                              </span>
                              🌱 Beginner
                              {lesson.progress.difficultyScores?.easy && (
                                <span className="score-mini">{lesson.progress.difficultyScores.easy.score}%</span>
                              )}
                            </Link>
                            <Link
                              to={`/exercise/${lesson.id}?difficulty=medium`}
                              className={`btn-compact btn-level ${lesson.progress.difficultyScores?.medium?.score >= 80 ? 'passed' : lesson.progress.difficultyScores?.medium ? 'attempted' : 'not-attempted'}`}
                            >
                              <span className="status-icon">
                                {lesson.progress.difficultyScores?.medium?.score >= 80 ? '✓' :
                                 lesson.progress.difficultyScores?.medium ? '⚠' : '○'}
                              </span>
                              ⚡ Intermediate
                              {lesson.progress.difficultyScores?.medium && (
                                <span className="score-mini">{lesson.progress.difficultyScores.medium.score}%</span>
                              )}
                            </Link>
                            <Link
                              to={`/exercise/${lesson.id}?difficulty=hard`}
                              className={`btn-compact btn-level ${lesson.progress.difficultyScores?.hard?.score >= 80 ? 'passed' : lesson.progress.difficultyScores?.hard ? 'attempted' : 'not-attempted'}`}
                            >
                              <span className="status-icon">
                                {lesson.progress.difficultyScores?.hard?.score >= 80 ? '✓' :
                                 lesson.progress.difficultyScores?.hard ? '⚠' : '○'}
                              </span>
                              🔥 Advanced
                              {lesson.progress.difficultyScores?.hard && (
                                <span className="score-mini">{lesson.progress.difficultyScores.hard.score}%</span>
                              )}
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal */}
      {videoModal.isOpen && (
        <div className="video-modal-overlay" onClick={closeVideoModal}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={closeVideoModal}>
              ✕
            </button>
            <div className="video-modal-header">
              <h2>{videoModal.video.title}</h2>
              <p>{videoModal.video.description}</p>
            </div>
            <div className="video-modal-player">
              <video
                controls
                autoPlay
                className="modal-video"
              >
                <source
                  src={`${process.env.REACT_APP_VIDEO_BASE_URL || '/videos'}/${encodeURIComponent(videoModal.video.filename)}`}
                  type="video/mp4"
                />
                הדפדפן שלך לא תומך בנגן וידאו.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicsIndex;
