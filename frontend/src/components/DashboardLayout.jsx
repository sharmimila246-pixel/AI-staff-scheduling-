import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import ScheduleView from './ScheduleView';
import CalendarView from './CalendarView';
import NotificationsList from './NotificationsList';
import ProfileSettings from './ProfileSettings';

export default function DashboardLayout({ staff, onLogout, onStaffUpdate }) {
  const [activeTab, setActiveTab] = useState('schedule');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  // Fetch notifications to get the unread count
  useEffect(() => {
    if (!staff) return;
    const fetchCount = () => {
      fetch(`${API_BASE_URL}/api/notifications/${staff.id || staff._id}`)
        .then(res => res.json())
        .then(data => {
          const unread = data.filter(n => !n.read).length;
          setNotificationCount(unread);
        })
        .catch(err => console.error('Error fetching notification count:', err));
    };

    fetchCount();
    // Poll every 10 seconds to simulate real-time AI updates
    const interval = setInterval(fetchCount, 10000);
    return () => clearInterval(interval);
  }, [staff]);

  const handleTriggerAIScheduler = async () => {
    if (!confirm('Optimize scheduling? The AI engine will re-balance conflicts and update tables.')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/schedule/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId: staff.id || staff._id }),
      });
      const data = await response.json();
      alert(data.message);
      
      // Navigate to notifications to see updates
      setActiveTab('notifications');
    } catch (err) {
      console.error(err);
      alert('Error triggering AI optimizer.');
    }
  };

  const getInitials = (name) => {
    return name
      .replace(/Dr\.|Prof\./g, '')
      .trim()
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'schedule':
        return <ScheduleView staff={staff} />;
      case 'calendar':
        return <CalendarView />;
      case 'notifications':
        return <NotificationsList staff={staff} />;
      case 'profile':
        return <ProfileSettings staff={staff} mode="profile" onStaffUpdate={onStaffUpdate} />;
      case 'password':
        return <ProfileSettings staff={staff} mode="password" onStaffUpdate={onStaffUpdate} />;
      default:
        return <ScheduleView staff={staff} />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div>
          <div className="sidebar-brand">
            <div className="logo-container" style={{ color: 'white' }}>
              <div className="logo-icon" style={{ background: 'var(--primary-blue)' }}>AI</div>
              <span>AI Staff Scheduler</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            <div
              className={`sidebar-nav-item ${activeTab === 'schedule' ? 'active' : ''}`}
              onClick={() => { setActiveTab('schedule'); setSidebarOpen(false); }}
            >
              <span className="sidebar-icon">📅</span>
              <span>My Schedule</span>
            </div>

            <div
              className={`sidebar-nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => { setActiveTab('calendar'); setSidebarOpen(false); }}
            >
              <span className="sidebar-icon">📆</span>
              <span>Monthly Calendar</span>
            </div>

            <div
              className={`sidebar-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => { setActiveTab('notifications'); setSidebarOpen(false); }}
            >
              <span className="sidebar-icon">🔔</span>
              <span>Notifications</span>
              {notificationCount > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  background: 'var(--color-danger)',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                }}>
                  {notificationCount}
                </span>
              )}
            </div>

            <div
              className={`sidebar-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }}
            >
              <span className="sidebar-icon">👤</span>
              <span>My Profile</span>
            </div>

            <div
              className={`sidebar-nav-item ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => { setActiveTab('password'); setSidebarOpen(false); }}
            >
              <span className="sidebar-icon">🔒</span>
              <span>Change Password</span>
            </div>
          </nav>
        </div>

        <div className="sidebar-footer">
          <button className="btn-secondary" style={{ width: '100%', marginBottom: '1rem', background: '#3b82f6', color: 'white', border: 'none', padding: '0.65rem 1rem' }} onClick={handleTriggerAIScheduler}>
            ⚡ Optimize AI Schedule
          </button>
          <div className="sidebar-logout" onClick={onLogout}>
            <span className="sidebar-icon">🚪</span>
            <span>Logout</span>
          </div>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="dashboard-main">
        {/* Upper Navbar */}
        <header className="dashboard-navbar">
          <div className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </div>

          <div className="navbar-user-info">
            <div className="navbar-avatar">
              {getInitials(staff.name)}
            </div>
            <div className="navbar-user-text">
              <h4>Welcome, {staff.name}</h4>
              <p>{staff.department} Department | {staff.title}</p>
            </div>
          </div>

          <div className="navbar-actions">
            <span className="navbar-role-badge">{staff.title}</span>
          </div>
        </header>

        {/* Dynamic Inner View Content */}
        <div className="view-container">
          {renderActiveView()}
          
          <div className="footer-credits">
            © 2026 AI Staff Scheduler. All rights reserved. Registered staff employee: {staff.employeeId}.
          </div>
        </div>
      </main>
    </div>
  );
}
