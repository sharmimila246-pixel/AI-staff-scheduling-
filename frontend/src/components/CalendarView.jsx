import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/calendar`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch calendar');
        return res.json();
      })
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Error loading calendar events.');
        setLoading(false);
      });
  }, []);

  // May 2024 starts on a Wednesday (index 3).
  // This means we need 3 blank padding days at the start.
  const paddingDays = 3;
  const daysInMonth = 31;
  const calendarCells = [];

  // Add padding days
  for (let i = 0; i < paddingDays; i++) {
    calendarCells.push({ dayNumber: null, dateStr: null });
  }

  // Add actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `2024-05-${day.toString().padStart(2, '0')}`;
    calendarCells.push({ dayNumber: day, dateStr });
  }

  const getEventForDate = (dateStr) => {
    if (!dateStr) return null;
    return events.find(e => e.date === dateStr);
  };

  const getDayClass = (dayEvent) => {
    if (!dayEvent) return '';
    if (dayEvent.type === 'Class Day') return 'day-class-day';
    if (dayEvent.type === 'Working Saturday') return 'day-working-saturday';
    if (dayEvent.type === 'Holiday') return 'day-holiday';
    return '';
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div className="view-header">
        <div className="view-title-group">
          <h2>Monthly Calendar</h2>
          <p>View scheduled class days, working Saturdays, and academic holidays.</p>
        </div>
      </div>

      {loading && (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading calendar...
        </div>
      )}

      {error && (
        <div style={{ padding: '1rem', background: '#fee2e2', color: '#ef4444', borderRadius: '8px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="calendar-card">
          <div className="calendar-header">
            <div className="calendar-nav-btn" onClick={() => alert('Only May 2024 is configured for this demo.')}>
              &lt;
            </div>
            <div className="calendar-month-year">May 2024</div>
            <div className="calendar-nav-btn" onClick={() => alert('Only May 2024 is configured for this demo.')}>
              &gt;
            </div>
          </div>

          <div className="calendar-weekdays">
            {WEEKDAYS.map(day => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="calendar-grid">
            {calendarCells.map((cell, idx) => {
              const dayEvent = getEventForDate(cell.dateStr);
              const eventClass = getDayClass(dayEvent);

              return (
                <div
                  key={idx}
                  className={`calendar-day ${!cell.dayNumber ? 'day-other-month' : ''}`}
                >
                  <span className="calendar-day-num">{cell.dayNumber}</span>
                  {dayEvent && cell.dayNumber && (
                    <span className={`calendar-day-label ${eventClass}`}>
                      {dayEvent.type}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="calendar-legend">
            <div className="legend-item">
              <div className="legend-color day-class-day" style={{ border: '1px solid var(--accent-cyan)' }}></div>
              <span>Class Day</span>
            </div>
            <div className="legend-item">
              <div className="legend-color day-working-saturday" style={{ border: '1px solid var(--primary-blue)' }}></div>
              <span>Working Saturday (1st &amp; 3rd)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color day-holiday" style={{ border: '1px solid var(--text-light)' }}></div>
              <span>Holiday / Sunday</span>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', background: 'var(--primary-blue-light)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-slate)', fontSize: '0.85rem', color: 'var(--primary-blue)', fontWeight: 500 }}>
            📌 Note: Classes will be conducted on every 1st and 3rd Saturday of the month.
          </div>
        </div>
      )}
    </div>
  );
}
