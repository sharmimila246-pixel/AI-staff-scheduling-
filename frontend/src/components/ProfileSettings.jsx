import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export default function ProfileSettings({ staff, onStaffUpdate }) {
  const [name, setName] = useState(staff.name);
  const [email, setEmail] = useState(staff.email);
  const [contact, setContact] = useState(staff.contact);
  const [isEditing, setIsEditing] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

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

  const getAvatarStyle = (name) => {
    const colors = [
      'linear-gradient(135deg, #3b82f6, #1d4ed8)', // Blue
      'linear-gradient(135deg, #10b981, #047857)', // Green
      'linear-gradient(135deg, #f59e0b, #b45309)', // Amber
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

  useEffect(() => {
    setName(staff.name);
    setEmail(staff.email);
    setContact(staff.contact);
  }, [staff]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/staff/${staff.id || staff._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, contact }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      onStaffUpdate(data);
      setProfileSuccess('Profile details updated successfully.');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setProfileError(err.message || 'Error updating profile.');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/staff/${staff.id || staff._id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password');
      }

      setPasswordSuccess('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setPasswordError(err.message || 'Error updating password. Verify your current password.');
    }
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div className="view-header">
        <div className="view-title-group">
          <h2>Profile Settings</h2>
          <p>Update your contact email, phone number, and change account credentials.</p>
        </div>
      </div>

      <div className="profile-grid-container">
        {/* Profile Card */}
        <div className="profile-info-card">
          <div className="profile-avatar-large" style={getAvatarStyle(staff.name)}>
            {getInitials(staff.name)}
          </div>
          <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            {staff.name}
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: '0.25rem', transition: 'transform 0.15s ease' }}
                title="Edit Name & Details"
                className="edit-pencil-btn"
              >
                ✏️
              </button>
            )}
          </h3>
          <p className="prof-title-dept">{staff.title} — {staff.department} Department</p>

          {profileSuccess && <div className="form-success-message">{profileSuccess}</div>}
          {profileError && <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', color: '#ef4444', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem' }}>{profileError}</div>}

          {!isEditing ? (
            <div className="profile-details-list">
              <div className="profile-detail-row">
                <span className="profile-detail-label">Employee ID</span>
                <span className="profile-detail-value">{staff.employeeId}</span>
              </div>
              <div className="profile-detail-row">
                <span className="profile-detail-label">Email</span>
                <span className="profile-detail-value">{staff.email}</span>
              </div>
              <div className="profile-detail-row">
                <span className="profile-detail-label">Contact</span>
                <span className="profile-detail-value">{staff.contact}</span>
              </div>
              <div className="profile-detail-row">
                <span className="profile-detail-label">Joining Date</span>
                <span className="profile-detail-value">{staff.joiningDate}</span>
              </div>
              <button
                className="btn-secondary"
                style={{ width: '100%', marginTop: '1.5rem', fontWeight: 700 }}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile details
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="profile-details-list">
              <div className="profile-detail-row" style={{ display: 'block', textAlign: 'left', borderBottom: 'none' }}>
                <span className="profile-detail-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Staff Name</span>
                <input
                  type="text"
                  className="login-input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
              <div className="profile-detail-row" style={{ display: 'block', textAlign: 'left', borderBottom: 'none', marginTop: '1rem' }}>
                <span className="profile-detail-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Email Address</span>
                <input
                  type="email"
                  className="login-input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="profile-detail-row" style={{ display: 'block', textAlign: 'left', borderBottom: 'none', marginTop: '1rem' }}>
                <span className="profile-detail-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Contact Number</span>
                <input
                  type="text"
                  className="login-input"
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Save
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => {
                    setName(staff.name);
                    setEmail(staff.email);
                    setContact(staff.contact);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Change Password Card */}
        <div className="profile-form-card">
          <h3>Change Password</h3>
          {passwordSuccess && <div className="form-success-message">{passwordSuccess}</div>}
          {passwordError && <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', color: '#ef4444', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem' }}>{passwordError}</div>}

          <form onSubmit={handleUpdatePassword}>
            <div className="login-input-group">
              <label className="login-input-label">Current Password</label>
              <input
                type="password"
                className="login-input"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="login-input-group">
              <label className="login-input-label">New Password</label>
              <input
                type="password"
                className="login-input"
                placeholder="Enter new password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="login-input-group">
              <label className="login-input-label">Confirm New Password</label>
              <input
                type="password"
                className="login-input"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
