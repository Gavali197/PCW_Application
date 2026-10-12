import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../API/axios'; 

import Sidebar from '../../Components/Sidebar'; // The new modular sidebar
import VerifyStudents from './VerifyStudents';
import CreateJobDrive from './CreateJobDrive';
import ManageCompanies from './ManageCompanies';
import ApplicantTracking from './ApplicantTracking'; 
import Settings from '../common/Settings'; // The new settings page
import '../student/Dashboard.css'; 

const CommitteeDashboard = () => {
  const { logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('tracking');
  const [userDetails, setUserDetails] = useState(null);

  // Fetch detailed user settings for the sidebar widget (Profile Pic & Name)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/settings');
        setUserDetails(res.data.user);
      } catch (err) {
        console.error("Failed to load user info", err);
      }
    };
    fetchUser();
  }, []);

  // Define the menu structure
  const menuItems = [
    { id: 'companies', label: 'Company Directory', icon: '🏢' },
    { id: 'createJob', label: 'Post Job Drive', icon: '📢' },
    { id: 'tracking', label: 'Applicant Tracking', icon: '📊' },
    { id: 'verify', label: 'Verify Students', icon: '✅' },
    { id: 'settings', label: 'Account Settings', icon: '⚙️' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      
      {/* THE NEW MODULAR SIDEBAR */}
      <Sidebar 
        role="Committee"
        menuItems={menuItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={userDetails}
        onLogout={logout}
      />

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, padding: '30px', height: '100vh', overflowY: 'auto' }}>
        <header className="content-header" style={{ marginBottom: '25px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>
          <h1 style={{ margin: 0, color: '#0f172a', fontSize: '24px' }}>
            {activeTab === 'companies' && 'Manage Recruiting Companies'}
            {activeTab === 'createJob' && 'Create New Job Drive'}
            {activeTab === 'tracking' && 'Track Job Applications'}
            {activeTab === 'verify' && 'Student Profile Verification'}
            {activeTab === 'settings' && 'Profile & Security Settings'}
          </h1>
        </header>
        
        <div className="content-body">
          {activeTab === 'companies' && <ManageCompanies />}
          {activeTab === 'createJob' && <CreateJobDrive />}
          {activeTab === 'tracking' && <ApplicantTracking />}
          {activeTab === 'verify' && <VerifyStudents />}
          {activeTab === 'settings' && <Settings />}
        </div>
      </main>
    </div>
  );
};

export default CommitteeDashboard;