import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export default function LoginPage({ selectedStaff, onLoginSuccess, onBackToProfiles }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('password123'); // pre-fill with default for ease of testing
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedStaff) {
      setUsername(selectedStaff.username);
    }
  }, [selectedStaff]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Success
      localStorage.setItem('staffToken', data.token);
      onLoginSuccess(data.staff);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left panel */}
      <div className="login-left">
        <div className="login-left-logo">
          <div className="logo-icon" style={{ background: 'white', color: 'var(--primary-navy)' }}>AI</div>
          <span>AI Staff Scheduler</span>
        </div>

        <div className="login-left-content">
          <h2 className="login-left-title">Welcome Back!</h2>
          <p className="login-left-subtitle">
            Login to view your personalized schedule, class alerts, notifications, and manage your academic duties efficiently.
          </p>

          <div className="login-left-graphic">
            <div className="login-graphic-icon">📅</div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Dynamic Calendaring</h4>
              <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Real-time updates, syncs automatically with AI engine.</p>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
          © 2026 AI Staff Scheduler. All rights reserved.
        </div>
      </div>

      {/* Right panel */}
      <div className="login-right">
        <div className="login-form-wrapper">
          <div style={{ marginBottom: '1.5rem' }}>
            <button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={onBackToProfiles}>
              ← Back to Profiles
            </button>
          </div>

          <h2 className="login-form-title">Staff Login</h2>
          <p className="login-form-subtitle">Enter your credentials to access the scheduler dashboard.</p>

          {error && <div className="login-error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="login-input-group">
              <label className="login-input-label">Username</label>
              <input
                type="text"
                className="login-input"
                placeholder="Enter your username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="login-input-group">
              <label className="login-input-label">Password</label>
              <div className="login-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <span
                  className="login-input-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </span>
              </div>
            </div>

            <div className="login-form-options">
              <label className="remember-me-checkbox">
                <input type="checkbox" defaultChecked /> Remember Me
              </label>
              <a href="#" className="forgot-password-link" onClick={(e) => {
                e.preventDefault();
                alert('For security reasons, please contact the IT Administrator to reset your password.');
              }}>Forgot Password?</a>
            </div>

            <button type="submit" className="btn-login-submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div style={{ marginTop: '2rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
            <strong>Demo Tip:</strong> Use <code>password123</code> to log in with any staff username.
          </div>
        </div>
      </div>
    </div>
  );
}
