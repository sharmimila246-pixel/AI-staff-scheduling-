import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../config';

const DEPARTMENTS = [
  'All Departments',
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Civil Engineering',
  'Mathematics',
  'Physics',
  'Chemistry',
  'English',
  'Management',
  'Commerce',
  'IT',
  'ECE'
];

export default function ProfileSelection({ onProfileSelect, onBackToHome }) {
  const [staffList, setStaffList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pin state persistent in localStorage
  const [pinnedIds, setPinnedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('pinned_staff_ids');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Dropdown menu state
  const [openMenuId, setOpenMenuId] = useState(null);

  // Inline rename state
  const [editingId, setEditingId] = useState(null);
  const [editNameInput, setEditNameInput] = useState('');
  const [savingRename, setSavingRename] = useState(false);

  // Action status message (toast banner)
  const [actionMessage, setActionMessage] = useState(null);

  const menuRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/staff`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch staff list');
        return res.json();
      })
      .then(data => {
        setStaffList(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Error loading staff. Make sure the backend server is running.');
        setLoading(false);
      });
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showToast = (msg, isError = false) => {
    setActionMessage({ text: msg, isError });
    setTimeout(() => {
      setActionMessage(null);
    }, 3500);
  };

  // Toggle Pin
  const togglePin = (staffId, e) => {
    e.stopPropagation();
    let updated;
    if (pinnedIds.includes(staffId)) {
      updated = pinnedIds.filter(id => id !== staffId);
      showToast('Unpinned profile');
    } else {
      updated = [...pinnedIds, staffId];
      showToast('Pinned profile to top');
    }
    setPinnedIds(updated);
    localStorage.setItem('pinned_staff_ids', JSON.stringify(updated));
    setOpenMenuId(null);
  };

  // Start Rename
  const handleStartRename = (staff, e) => {
    e.stopPropagation();
    setEditingId(staff._id);
    setEditNameInput(staff.name);
    setOpenMenuId(null);
  };

  // Save Rename
  const handleSaveRename = (staffId, e) => {
    if (e) e.stopPropagation();
    if (!editNameInput.trim()) {
      showToast('Name cannot be empty', true);
      return;
    }

    setSavingRename(true);
    fetch(`${API_BASE_URL}/api/staff/${staffId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editNameInput.trim() })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update name');
        return res.json();
      })
      .then(updatedStaff => {
        setStaffList(prev => prev.map(s => s._id === staffId ? { ...s, name: updatedStaff.name || editNameInput.trim() } : s));
        setEditingId(null);
        setSavingRename(false);
        showToast('Name updated successfully');
      })
      .catch(err => {
        console.error(err);
        // Fallback update locally
        setStaffList(prev => prev.map(s => s._id === staffId ? { ...s, name: editNameInput.trim() } : s));
        setEditingId(null);
        setSavingRename(false);
        showToast('Name updated locally');
      });
  };

  const handleCancelRename = (e) => {
    if (e) e.stopPropagation();
    setEditingId(null);
    setEditNameInput('');
  };

  // Remove Staff
  const handleRemoveStaff = (staff, e) => {
    e.stopPropagation();
    setOpenMenuId(null);

    const confirmed = window.confirm(`Are you sure you want to remove "${staff.name}"?`);
    if (!confirmed) return;

    fetch(`${API_BASE_URL}/api/staff/${staff._id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete staff');
        return res.json();
      })
      .then(() => {
        setStaffList(prev => prev.filter(s => s._id !== staff._id));
        showToast(`Removed "${staff.name}"`);
      })
      .catch(err => {
        console.error(err);
        // Remove from local list as fallback
        setStaffList(prev => prev.filter(s => s._id !== staff._id));
        showToast(`Removed "${staff.name}"`);
      });
  };

  // Filtering and Sorting (Pinned items first)
  const filteredStaff = staffList
    .filter(staff => {
      const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            staff.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = selectedDept === 'All Departments' || staff.department === selectedDept;
      return matchesSearch && matchesDept;
    })
    .sort((a, b) => {
      const isAPinned = pinnedIds.includes(a._id);
      const isBPinned = pinnedIds.includes(b._id);
      if (isAPinned && !isBPinned) return -1;
      if (!isAPinned && isBPinned) return 1;
      return 0;
    });

  // Generates consistent background colors based on name initials
  const getAvatarStyle = (name) => {
    const colors = [
      'linear-gradient(135deg, #3b82f6, #1d4ed8)', // Blue
      'linear-gradient(135deg, #10b981, #047857)', // Green
      'linear-gradient(135deg, #f59e0b, #b45309)', // Amber
      'linear-gradient(135deg, #ec4899, #be185d)', // Pink
      'linear-gradient(135deg, #8b5cf6, #6d28d9)', // Purple
      'linear-gradient(135deg, #06b6d4, #0891b2)', // Cyan
      'linear-gradient(135deg, #f43f5e, #be123c)'  // Rose
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return {
      background: colors[sum % colors.length]
    };
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

  return (
    <div className="profile-selection-container">
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '2rem' }}>
        <button className="btn-secondary" onClick={onBackToHome}>
          ← Back to Home
        </button>
      </div>

      <h2 className="profile-title">Select Your Profile</h2>
      <p className="profile-subtitle">Click on your name to login and view your schedule</p>

      {/* Toast Notification */}
      {actionMessage && (
        <div className={`toast-banner ${actionMessage.isError ? 'error' : 'success'}`}>
          {actionMessage.text}
        </div>
      )}

      {error && (
        <div style={{
          padding: '1rem',
          background: '#fee2e2',
          color: '#ef4444',
          borderRadius: '8px',
          marginBottom: '2rem',
          fontWeight: 500
        }}>
          {error}
        </div>
      )}

      {/* Filter panel */}
      <div className="profile-filters">
        <input
          type="text"
          placeholder="Search name or title..."
          className="search-input"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={selectedDept}
          onChange={e => setSelectedDept(e.target.value)}
        >
          {DEPARTMENTS.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          Loading staff profiles...
        </div>
      ) : (
        <div className="profiles-grid">
          {filteredStaff.map(staff => {
            const isPinned = pinnedIds.includes(staff._id);
            const isEditing = editingId === staff._id;
            const isMenuOpen = openMenuId === staff._id;

            return (
              <div
                key={staff._id}
                className={`profile-card animate-fade ${isPinned ? 'card-pinned' : ''}`}
                onClick={() => !isEditing && onProfileSelect(staff)}
              >
                {/* Right Corner Menu & Pin Badge */}
                <div className="card-top-actions" onClick={e => e.stopPropagation()}>
                  {isPinned && (
                    <span className="pin-badge" title="Pinned to top">
                      📌
                    </span>
                  )}

                  {/* 3-dots Menu Button */}
                  <button
                    className="three-dots-btn"
                    title="Options"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(isMenuOpen ? null : staff._id);
                    }}
                  >
                    ⋮
                  </button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <div className="card-dropdown-menu" ref={menuRef}>
                      <button
                        className="dropdown-item"
                        onClick={(e) => togglePin(staff._id, e)}
                      >
                        <span className="dropdown-icon">{isPinned ? '📍' : '📌'}</span>
                        {isPinned ? 'Unpin' : 'Pin to Top'}
                      </button>

                      <button
                        className="dropdown-item"
                        onClick={(e) => handleStartRename(staff, e)}
                      >
                        <span className="dropdown-icon">✏️</span>
                        Rename
                      </button>

                      <button
                        className="dropdown-item delete-item"
                        onClick={(e) => handleRemoveStaff(staff, e)}
                      >
                        <span className="dropdown-icon">🗑️</span>
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Avatar */}
                <div className="profile-avatar-circle" style={getAvatarStyle(staff.name)}>
                  {getInitials(staff.name)}
                </div>

                {/* Name / Inline Rename Edit Mode */}
                {isEditing ? (
                  <div className="rename-container" onClick={e => e.stopPropagation()}>
                    <input
                      type="text"
                      className="rename-input"
                      value={editNameInput}
                      onChange={e => setEditNameInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleSaveRename(staff._id, e);
                        if (e.key === 'Escape') handleCancelRename(e);
                      }}
                      autoFocus
                      disabled={savingRename}
                    />
                    <div className="rename-actions">
                      <button
                        className="btn-rename-save"
                        onClick={e => handleSaveRename(staff._id, e)}
                        title="Save Name"
                        disabled={savingRename}
                      >
                        ✓
                      </button>
                      <button
                        className="btn-rename-cancel"
                        onClick={e => handleCancelRename(e)}
                        title="Cancel"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="name-header-group">
                    <h3>{staff.name}</h3>
                    <button
                      className="inline-edit-icon"
                      title="Edit Name"
                      onClick={e => handleStartRename(staff, e)}
                    >
                      ✏️
                    </button>
                  </div>
                )}

                <p className="prof-title">{staff.title}</p>
                <p className="prof-dept">{staff.department}</p>
              </div>
            );
          })}

          {filteredStaff.length === 0 && (
            <div style={{ gridColumn: '1/-1', padding: '3rem', color: 'var(--text-muted)' }}>
              No staff found matching details.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
