import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    studentName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('הסיסמאות לא תואמות (Passwords do not match)');
      return;
    }

    if (formData.password.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים (Password must be at least 6 characters)');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        studentName: formData.studentName || undefined,
        email: formData.email || undefined,
        password: formData.password,
        age: formData.age ? parseInt(formData.age) : undefined
      };

      await register(userData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>English Tutorial App</h1>
          <h2>מערכת לימוד אנגלית</h2>
        </div>

        <div className="auth-form-container">
          <h3>הרשמה</h3>
          <p className="auth-subtitle">Create an account to start learning</p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">שם משתמש *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Username"
                required
                disabled={loading}
                minLength={2}
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label htmlFor="studentName">שם מלא (אופציונלי)</label>
              <input
                type="text"
                id="studentName"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                placeholder="Full Name"
                disabled={loading}
                maxLength={255}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">אימייל (אופציונלי)</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email (optional)"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">גיל (אופציונלי)</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                disabled={loading}
                min={1}
                max={150}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">סיסמה *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password (min 6 characters)"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">אשר סיסמה *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'נרשם...' : 'הרשם'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              כבר יש לך חשבון?{' '}
              <Link to="/">התחבר כאן</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
