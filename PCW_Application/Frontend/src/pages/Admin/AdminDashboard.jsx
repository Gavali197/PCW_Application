import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import ManageCommittee from '../committee/ManageCommittee';
import AuditLogs from './AuditLogs';
import '../student/Dashboard.css'; // Reusing the layout CSS
import './Admin.css'; // Specific styles for tables/forms

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('committee'); // 'analytics', 'committee', 'logs'

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar admin-sidebar">
        <div className="sidebar-header">
          <h2>Placement Portal</h2>
          <span className="role-badge admin-badge">Super Admin</span>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={activeTab === 'analytics' ? 'active' : ''} 
            onClick={() => setActiveTab('analytics')}
          >
            System Overview
          </button>
          <button 
            className={activeTab === 'committee' ? 'active' : ''} 
            onClick={() => setActiveTab('committee')}
          >
            Manage Committee
          </button>
          <button 
            className={activeTab === 'logs' ? 'active' : ''} 
            onClick={() => setActiveTab('logs')}
          >
            Audit Logs
          </button>
        </nav>

        <div className="sidebar-footer">
          <p>{user?.email}</p>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="content-header">
          <h1>
            {activeTab === 'analytics' && 'System Overview'}
            {activeTab === 'committee' && 'Committee Management'}
            {activeTab === 'logs' && 'System Activity Logs'}
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
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;