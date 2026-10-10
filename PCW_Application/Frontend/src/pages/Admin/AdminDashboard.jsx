import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../API/axios'; 

import Sidebar from '../../components/Sidebar'; // The new modular sidebar
import ManageCommittee from '../committee/ManageCommittee';
import AuditLogs from './AuditLogs';
import Settings from '../common/Settings'; // The new settings page
import '../student/Dashboard.css'; 
import './Admin.css'; 

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'committee', 'logs', 'settings'
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

  // Define the Super Admin specific menu
  const menuItems = [
    { id: 'analytics', label: 'System Overview', icon: '📈' },
    { id: 'committee', label: 'Manage Committee', icon: '👥' },
    { id: 'logs', label: 'System Audit Logs', icon: '🛡️' },
    { id: 'settings', label: 'Account Settings', icon: '⚙️' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      
      {/* THE NEW MODULAR SIDEBAR */}
      <Sidebar 
        role="SuperAdmin"
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
            {activeTab === 'analytics' && 'System Overview & Analytics'}
            {activeTab === 'committee' && 'Committee Management'}
            {activeTab === 'logs' && 'System Activity Logs'}
            {activeTab === 'settings' && 'Profile & Security Settings'}
          </h1>
        </header>
        
        <div className="content-body">
          {activeTab === 'analytics' && (
            <div className="card">
              <h3>Welcome to the HOD Dashboard</h3>
              <p>System analytics (Placement %, Total Drives, Active Students) will appear here.</p>
            </div>
          )}
          {activeTab === 'committee' && <ManageCommittee />}
          {activeTab === 'logs' && <AuditLogs />}
          {activeTab === 'settings' && <Settings />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;