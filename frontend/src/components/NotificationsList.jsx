import React, { useState, useEffect } from 'react';

export default function NotificationsList({ staff }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = () => {
    if (!staff) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/notifications/${staff.id || staff._id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch notifications');
        return res.json();
      })
      .then(data => {
        setNotifications(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Error loading notifications.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNotifications();
  }, [staff]);

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PUT',
      });
      if (response.ok) {
        setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const getNotificationIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('generate')) {
      return { symbol: '🤖', typeClass: 'n-success' }; // AI optimizer
    } else if (t.includes('reminder') || t.includes('class')) {
      return { symbol: '⏰', typeClass: 'n-alert' }; // Time reminder
    } else if (t.includes('saturday') || t.includes('working')) {
      return { symbol: '📅', typeClass: 'n-info' }; // Calendar working
    }
    return { symbol: '🔔', typeClass: 'n-info' }; // Default bell
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div className="view-header">
        <div className="view-title-group">
          <h2>Notifications</h2>
          <p>Recent alerts, class reminders, and scheduling system updates.</p>
        </div>
      </div>

      {loading && (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading notifications...
        </div>
      )}

      {error && (
        <div style={{ padding: '1rem', background: '#fee2e2', color: '#ef4444', borderRadius: '8px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <div style={{ maxWidth: '800px' }}>
          {notifications.map(item => {
            const iconDetails = getNotificationIcon(item.title);
            return (
              <div
                key={item._id}
                className={`notification-item ${!item.read ? 'unread' : ''}`}
                onClick={(e) => !item.read && handleMarkAsRead(item._id, e)}
              >
                <div className={`notification-icon-wrapper ${iconDetails.typeClass}`}>
                  {iconDetails.symbol}
                </div>
                <div className="notification-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <h4>{item.title}</h4>
                    {!item.read && (
                      <span style={{ fontSize: '0.7rem', background: 'var(--primary-blue)', color: 'white', padding: '0.15rem 0.4rem', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                        New
                      </span>
                    )}
                  </div>
                  <p>{item.message}</p>
                  <div className="notification-meta">
                    <span className="notification-time">{item.time}</span>
                    {!item.read && (
                      <button
                        className="btn-mark-read"
                        onClick={(e) => handleMarkAsRead(item._id, e)}
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {notifications.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', background: 'white', borderRadius: '12px', border: '1px solid var(--border-slate)', color: 'var(--text-muted)' }}>
              No notifications at this time.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
