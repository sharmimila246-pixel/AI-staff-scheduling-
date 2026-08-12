import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import ProfileSelection from './components/ProfileSelection';
import LoginPage from './components/LoginPage';
import DashboardLayout from './components/DashboardLayout';

export default function App() {
  const [view, setView] = useState('landing');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loggedInStaff, setLoggedInStaff] = useState(null);

  // Auto login check from localStorage
  useEffect(() => {
    const cachedStaff = localStorage.getItem('staffUser');
    const token = localStorage.getItem('staffToken');
    if (cachedStaff && token) {
      try {
        setLoggedInStaff(JSON.parse(cachedStaff));
        setView('dashboard');
      } catch (err) {
        console.error('Failed to parse cached staff info', err);
        localStorage.removeItem('staffUser');
        localStorage.removeItem('staffToken');
      }
    }
  }, []);

  const handleProfileSelect = (staff) => {
    setSelectedStaff(staff);
    setView('login');
  };

  const handleLoginSuccess = (staff) => {
    setLoggedInStaff(staff);
    localStorage.setItem('staffUser', JSON.stringify(staff));
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('staffToken');
    localStorage.removeItem('staffUser');
    setLoggedInStaff(null);
    setSelectedStaff(null);
    setView('landing');
  };

  const handleStaffUpdate = (updatedStaff) => {
    setLoggedInStaff(updatedStaff);
    localStorage.setItem('staffUser', JSON.stringify(updatedStaff));
  };

  const renderView = () => {
    switch (view) {
      case 'landing':
        return (
          <LandingPage
            onGetStarted={() => setView('profiles')}
            onLoginClick={() => setView('profiles')}
          />
        );
      case 'profiles':
        return (
          <ProfileSelection
            onProfileSelect={handleProfileSelect}
            onBackToHome={() => setView('landing')}
          />
        );
      case 'login':
        return (
          <LoginPage
            selectedStaff={selectedStaff}
            onLoginSuccess={handleLoginSuccess}
            onBackToProfiles={() => setView('profiles')}
          />
        );
      case 'dashboard':
        return (
          <DashboardLayout
            staff={loggedInStaff}
            onLogout={handleLogout}
            onStaffUpdate={handleStaffUpdate}
          />
        );
      default:
        return (
          <LandingPage
            onGetStarted={() => setView('profiles')}
            onLoginClick={() => setView('profiles')}
          />
        );
    }
  };

  return (
    <div className="app-root">
      {renderView()}
    </div>
  );
}
