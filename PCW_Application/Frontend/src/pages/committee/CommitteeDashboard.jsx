import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import VerifyStudents from './VerifyStudents';
import CreateJobDrive from './CreateJobDrive';
import '../student/Dashboard.css'; 

const CommitteeDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('verify'); // 'verify', 'createJob'

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Placement Portal</h2>
          <span className="role-badge" style={{ backgroundColor: '#f59e0b' }}>Committee</span>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={activeTab === 'verify' ? 'active' : ''} 
            onClick={() => setActiveTab('verify')}
          >
            Verify Students
          </button>
          <button 
            className={activeTab === 'createJob' ? 'active' : ''} 
            onClick={() => setActiveTab('createJob')}
          >
            Post Job Drive
          </button>
        </nav>

        <div className="sidebar-footer">
          <p>{user?.email}</p>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <h1>
            {activeTab === 'verify' && 'Student Profile Verification'}
            {activeTab === 'createJob' && 'Create New Job Drive'}
          </h1>
        </header>
        
        <div className="content-body">
          {activeTab === 'verify' && <VerifyStudents />}
          {activeTab === 'createJob' && <CreateJobDrive />}
        </div>
      </main>
    </div>
  );
};

export default CommitteeDashboard;