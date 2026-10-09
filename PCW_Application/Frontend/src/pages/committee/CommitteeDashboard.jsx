import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import VerifyStudents from './VerifyStudents';
import CreateJobDrive from './CreateJobDrive';
import ManageCompanies from './ManageCompanies';
import ApplicantTracking from './ApplicantTracking'; // NEW IMPORT
import '../student/Dashboard.css'; 

const CommitteeDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('tracking'); // Defaulting to the new tab

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Placement Portal</h2>
          <span className="role-badge" style={{ backgroundColor: '#f59e0b' }}>Committee</span>
        </div>
        
        <nav className="sidebar-nav">
          <button className={activeTab === 'companies' ? 'active' : ''} onClick={() => setActiveTab('companies')}>
            Company Directory
          </button>
          <button className={activeTab === 'createJob' ? 'active' : ''} onClick={() => setActiveTab('createJob')}>
            Post Job Drive
          </button>
          <button className={activeTab === 'tracking' ? 'active' : ''} onClick={() => setActiveTab('tracking')}>
            Applicant Tracking
          </button>
          <button className={activeTab === 'verify' ? 'active' : ''} onClick={() => setActiveTab('verify')}>
            Verify Students
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
            {activeTab === 'companies' && 'Manage Recruiting Companies'}
            {activeTab === 'createJob' && 'Create New Job Drive'}
            {activeTab === 'tracking' && 'Track Job Applications'}
            {activeTab === 'verify' && 'Student Profile Verification'}
          </h1>
        </header>
        
        <div className="content-body">
          {activeTab === 'companies' && <ManageCompanies />}
          {activeTab === 'createJob' && <CreateJobDrive />}
          {activeTab === 'tracking' && <ApplicantTracking />}
          {activeTab === 'verify' && <VerifyStudents />}
        </div>
      </main>
    </div>
  );
};

export default CommitteeDashboard;