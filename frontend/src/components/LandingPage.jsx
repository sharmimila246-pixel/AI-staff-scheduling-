import React from 'react';

export default function LandingPage({ onGetStarted, onLoginClick }) {
  return (
    <div className="landing-container animate-fade">
      {/* Header */}
      <header className="nav-header">
        <div className="logo-container">
          <div className="logo-icon">AI</div>
          <span>AI Staff Scheduler</span>
        </div>
        <nav>
          <ul className="nav-links">
            <li><a href="#home" className="active">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
        <button className="btn-login-outline" onClick={onLoginClick}>Login</button>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">Smart Timetable Management</div>
          <h1 className="hero-title">
            AI-Powered <br />
            <span>Staff Scheduling</span> <br />
            Made Simple
          </h1>
          <p className="hero-subtitle">
            Automated. Accurate. Conflict-Free. Let AI handle the complexity while you focus on education. Save hundreds of administrative hours with instant smart generation.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={onGetStarted}>Get Started</button>
            <button className="btn-secondary" onClick={() => {
              const element = document.getElementById('features');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}>Learn More</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-image-wrapper animate-float">
            {/* SVG Scheduler Illustration */}
            <svg viewBox="0 0 500 400" width="100%" height="100%" style={{ maxHeight: '320px' }}>
              <rect x="10" y="10" width="480" height="380" rx="20" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
              {/* Grid representation */}
              <rect x="40" y="40" width="420" height="40" rx="8" fill="#1e293b" />
              <circle cx="70" cy="60" r="8" fill="#ef4444" />
              <circle cx="95" cy="60" r="8" fill="#eab308" />
              <circle cx="120" cy="60" r="8" fill="#22c55e" />
              <text x="210" y="66" fill="#ffffff" fontWeight="700" fontSize="14" fontFamily="sans-serif">Staff Timetable Optimizer</text>
              
              {/* Daily schedule blocks */}
              <rect x="40" y="100" width="120" height="70" rx="8" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1" />
              <text x="50" y="125" fill="#1e3a8a" fontWeight="700" fontSize="12" fontFamily="sans-serif">09:00 - 10:00</text>
              <text x="50" y="145" fill="#3b82f6" fontWeight="600" fontSize="14" fontFamily="sans-serif">CS101 - A1</text>
              <text x="50" y="160" fill="#64748b" fontSize="10" fontFamily="sans-serif">Dr. R. Sharma</text>

              <rect x="180" y="100" width="120" height="70" rx="8" fill="#ecfeff" stroke="#a5f3fc" strokeWidth="1" />
              <text x="190" y="125" fill="#083344" fontWeight="700" fontSize="12" fontFamily="sans-serif">10:00 - 11:00</text>
              <text x="190" y="145" fill="#06b6d4" fontWeight="600" fontSize="14" fontFamily="sans-serif">Math101 - B2</text>
              <text x="190" y="160" fill="#64748b" fontSize="10" fontFamily="sans-serif">Prof. S. Gupta</text>

              <rect x="320" y="100" width="140" height="70" rx="8" fill="#fef2f2" stroke="#fecaca" strokeWidth="1" />
              <text x="330" y="125" fill="#7f1d1d" fontWeight="700" fontSize="12" fontFamily="sans-serif">12:15 - 01:15</text>
              <text x="330" y="145" fill="#ef4444" fontWeight="600" fontSize="14" fontFamily="sans-serif">EC201 - Lab2</text>
              <text x="330" y="160" fill="#64748b" fontSize="10" fontFamily="sans-serif">Prof. M. Patel</text>

              <rect x="40" y="190" width="420" height="50" rx="8" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" />
              <text x="220" y="220" fill="#78350f" fontWeight="700" fontSize="16" fontFamily="sans-serif">Break Schedule</text>

              <rect x="40" y="260" width="200" height="90" rx="8" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1" />
              <text x="50" y="290" fill="#064e3b" fontWeight="700" fontSize="12" fontFamily="sans-serif">02:00 - 04:00</text>
              <text x="50" y="315" fill="#22c55e" fontWeight="600" fontSize="15" fontFamily="sans-serif">Physics Seminar</text>
              <text x="50" y="335" fill="#64748b" fontSize="11" fontFamily="sans-serif">Auditorium - All Faculty members</text>

              <circle cx="370" cy="305" r="30" fill="#2563eb" opacity="0.1" />
              <circle cx="370" cy="305" r="20" fill="#2563eb" opacity="0.2" />
              <path d="M 365 305 L 375 310 L 370 295 Z" fill="#2563eb" />
            </svg>
          </div>
        </div>
      </section>

      {/* Why AI Scheduler Section */}
      <section id="features" className="features-section">
        <h2 className="section-title">Why AI Staff Scheduler?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper f-blue">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3>AI Generated Schedules</h3>
            <p>AI creates optimized, conflict-free schedules for staff and classrooms in seconds.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper f-cyan">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18.36 18.36A9 9 0 015.64 5.64m12.72 12.72A9 9 0 005.64 5.64m12.72 12.72L5.64 5.64" />
              </svg>
            </div>
            <h3>No Time Collisions</h3>
            <p>Ensures zero overlapping classes for staff, batches, or lecture halls automatically.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper f-blue">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
            </div>
            <h3>Easy Dashboard</h3>
            <p>Staff can view their customized timetables across all semesters in one click.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper f-cyan">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3>Smart Calendaring</h3>
            <p>Monthly calendar view with working Saturdays, holidays, and reminders marked.</p>
          </div>
        </div>

        <div id="about" className="about-summary">
          <div className="about-summary-icon">🎓</div>
          <div className="about-summary-text">
            <h3>Optimize Your Educational Institution</h3>
            <p>AI Staff Scheduler uses genetic algorithms and modern constraint satisfaction solvers to deliver highly efficient, balanced academic calendars. Our software integrates seamlessly with college databases to automatically map professor availability, student workloads, and classroom allocations without double-bookings.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" style={{ background: '#0f172a', color: '#94a3b8', padding: '4rem 5% 2rem 5%', marginTop: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ color: 'white', marginBottom: '1rem' }}>AI Staff Scheduler</h3>
            <p style={{ maxWidth: '300px', fontSize: '0.9rem', lineHeight: '1.5' }}>Smart scheduling solution for modern educational institutions.</p>
          </div>
          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem' }}>Contact Us</h4>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>📧 scheduler@college.edu</p>
            <p style={{ fontSize: '0.9rem' }}>📞 +91 98765 43210</p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem' }}>
          © 2026 AI Staff Scheduler. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
