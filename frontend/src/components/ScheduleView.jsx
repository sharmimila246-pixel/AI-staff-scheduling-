import React, { useState, useEffect } from 'react';

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday (1st & 3rd)'
];

const TIME_SLOTS = [
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:15 - 12:15', // Break slot
  '12:15 - 01:15',
  '02:00 - 03:00',
  '03:00 - 04:00'
];

export default function ScheduleView({ staff }) {
  const [schedules, setSchedules] = useState([]);
  const [selectedYear, setSelectedYear] = useState('1st Year');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!staff) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/schedule/${staff.id || staff._id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch schedule');
        return res.json();
      })
      .then(data => {
        setSchedules(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Error loading schedule information.');
        setLoading(false);
      });
  }, [staff]);

  // Construct a schedule map for quick lookup: map[day][timeSlot] = item
  const scheduleMap = {};
  DAYS.forEach(day => {
    scheduleMap[day] = {};
    TIME_SLOTS.forEach(slot => {
      scheduleMap[day][slot] = null;
    });
  });

  schedules
    .filter(item => item.year === selectedYear)
    .forEach(item => {
      if (scheduleMap[item.day]) {
        scheduleMap[item.day][item.timeSlot] = item;
      }
    });

  const getCellContent = (day, slot) => {
    const item = scheduleMap[day][slot];
    if (!item) {
      if (slot === '11:15 - 12:15') {
        return <span className="cell-break">Break</span>;
      }
      return <span style={{ color: 'var(--text-light)' }}>-</span>;
    }

    if (item.subject === 'Break') {
      return <span className="cell-break">Break</span>;
    }

    const isLab = item.subject.toLowerCase().includes('lab');
    const isSpecial = ['lib', 'seminar', 'nptel', 'sports', 'mentoring', 'tutoring', 'library'].includes(item.subject.toLowerCase());

    return (
      <div>
        <div className="cell-subject">{item.subject}</div>
        {item.room && (
          <span className={`cell-room ${isLab ? 'day-working-saturday' : ''}`}>
            {item.room}
          </span>
        )}
        {isSpecial && (
          <span className="cell-special">
            {item.subject}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Title */}
      <div className="view-header">
        <div className="view-title-group">
          <h2>My Schedule</h2>
          <p>Weekly academic timetable dashboard for classes and seminars.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="schedule-tabs">
        {['1st Year', '2nd Year', '3rd Year'].map(year => (
          <div
            key={year}
            className={`schedule-tab ${selectedYear === year ? 'active' : ''}`}
            onClick={() => setSelectedYear(year)}
          >
            {year} Schedule
          </div>
        ))}
      </div>

      {/* Loading & Error */}
      {loading && (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading schedule data...
        </div>
      )}

      {error && (
        <div style={{ padding: '1rem', background: '#fee2e2', color: '#ef4444', borderRadius: '8px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {/* Table grid */}
      {!loading && !error && (
        <div className="table-card">
          <div className="table-wrapper">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Time / Day</th>
                  {TIME_SLOTS.map(slot => (
                    <th key={slot}>{slot}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS.map(day => (
                  <tr key={day}>
                    <td style={{ fontWeight: 700, color: 'var(--secondary-navy)', background: 'var(--bg-slate)', borderRight: '1px solid var(--border-slate)', width: '150px' }}>
                      {day}
                    </td>
                    {TIME_SLOTS.map(slot => (
                      <td key={slot} style={{ minWidth: '120px' }}>
                        {getCellContent(day, slot)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={{ marginTop: '1.5rem', background: 'var(--bg-slate)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-slate)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <strong>Note:</strong> Timetable matches standard institute hours. Classrooms are assigned dynamically by the AI core to ensure conflict resolution.
      </div>
    </div>
  );
}
