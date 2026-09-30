import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Don't show navbar on login/register pages
  if (location.pathname === '/' || location.pathname === '/register') {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <button
            className="navbar-home"
            onClick={() => navigate('/dashboard')}
            title="חזרה לדף הבית"
          >
            <span className="home-icon">🏠</span>
            <span className="home-text">דף הבית</span>
          </button>
        </div>

        <div className="navbar-center">
          <h1 className="navbar-title">English Tutorial</h1>
          <div className="navbar-links" role="navigation" aria-label="נושאי לימוד">
            <button
              className={`navbar-link ${location.pathname === '/topics' ? 'active' : ''}`}
              onClick={() => navigate('/topics')}
            >
              אנגלית
            </button>
            <button
              className={`navbar-link ${location.pathname === '/math' ? 'active' : ''}`}
              onClick={() => navigate('/math')}
            >
              מתמטיקה
            </button>
            <button
              className={`navbar-link ${location.pathname === '/arabic' ? 'active' : ''}`}
              onClick={() => navigate('/arabic')}
            >
              ערבית
            </button>
          </div>
        </div>

        <div className="navbar-right">
          {user && (
            <>
              <span className="navbar-user">שלום, {user.name || user.username}</span>
              <button
                className={`navbar-link navbar-telegram ${location.pathname === '/settings/telegram' ? 'active' : ''}`}
                onClick={() => navigate('/settings/telegram')}
                title="תרגול מילים בטלגרם"
                aria-label="טלגרם"
              >
                <span className="navbar-telegram-icon" aria-hidden="true">✈️</span>
                <span className="navbar-telegram-text">טלגרם</span>
              </button>
              <button className="navbar-logout" onClick={handleLogout}>
                יציאה
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
