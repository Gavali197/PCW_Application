import React from 'react';
import './Sidebar.css'; 

const Sidebar = ({ role, menuItems, activeTab, setActiveTab, user, onLogout }) => {
  return (
    <div className="modern-sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <h2>Placement Portal</h2>
        <span className={`role-badge ${role.toLowerCase().replace(' ', '-')}`}>
          {role}
        </span>
      </div>

      {/* Dynamic Navigation Links */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Profile Widget & Logout */}
      <div className="sidebar-footer">
        <div className="user-profile-widget">
          <img 
            src={user?.profilePicUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
            alt="Profile" 
            className="sidebar-pic"
          />
          <div className="user-info">
            <p className="user-name">{user?.fullName || 'Complete Profile'}</p>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>
        
        <button className="logout-btn" onClick={onLogout}>
          <span className="nav-icon">🚪</span> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;