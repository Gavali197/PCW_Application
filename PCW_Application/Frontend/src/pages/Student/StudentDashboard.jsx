import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import ProfileView from './ProfileView';
import JobBoard from './JobBoard';
import MyApplications from './MyApplications';
import './Dashboard.css';

const StudentDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Placement Portal</h2>
          <span className="role-badge">Student</span>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={activeTab === 'profile' ? 'active' : ''} 
            onClick={() => setActiveTab('profile')}
          >
            My Profile
          </button>
          <button 
            className={activeTab === 'jobs' ? 'active' : ''} 
            onClick={() => setActiveTab('jobs')}
          >
            Job Board
          </button>
          <button 
            className={activeTab === 'applications' ? 'active' : ''} 
            onClick={() => setActiveTab('applications')}
          >
            My Applications
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
            {activeTab === 'profile' && 'Profile Status'}
            {activeTab === 'jobs' && 'Available Job Drives'}
            {activeTab === 'applications' && 'Application Tracking'}
          </h1>
        </header>
        
        <div className="content-body">
          {activeTab === 'profile' && <ProfileView />}
          {activeTab === 'jobs' && <JobBoard />}
          {activeTab === 'applications' && <MyApplications />}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;