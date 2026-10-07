import React, { useState, useEffect } from 'react';
import api from '../../API/axios';
import ProfileForm from './ProfileForm';

const ProfileView = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profiles/me');
      setProfile(res.data);
      setIsEditing(false); // Close form if we have data
    } catch (err) {
      if (err.response?.status === 404) {
        // 404 means no profile exists yet. Show the form instantly!
        setIsEditing(true);
      } else {
        setError('Failed to load profile.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSaved = (updatedProfileData) => {
    setProfile(updatedProfileData);
    setIsEditing(false);
    setError('');
  };

  if (loading) return <div>Loading profile data...</div>;
  if (error && !isEditing) return <div className="error-message">{error}</div>;

  // Render the Form if editing or if it's a new student
  if (isEditing) {
    return (
      <ProfileForm 
        initialData={profile} 
        onSuccess={handleProfileSaved} 
        onCancel={() => setIsEditing(false)} 
      />
    );
  }

  // Otherwise, render the read-only Profile view
  return (
    <div className="card">
      <div className="card-header flex-between" style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: 0 }}>Academic Details</h3>
        <span className={`status-badge ${profile.verificationStatus.toLowerCase()}`}>
          {profile.verificationStatus}
        </span>
      </div>
      
      <div className="profile-grid">
        <div className="detail-group">
          <label>Enrollment Number</label>
          <p>{profile.enrollmentNo}</p>
        </div>
        <div className="detail-group">
          <label>Branch</label>
          <p>{profile.branch}</p>
        </div>
        <div className="detail-group">
          <label>Current CGPA</label>
          <p>{profile.cgpa}</p>
        </div>
        <div className="detail-group">
          <label>Active Backlogs</label>
          <p>{profile.activeBacklogs}</p>
        </div>
        <div className="detail-group">
          <label>Placement Status</label>
          <p>{profile.isPlaced ? 'Placed 🎓' : 'Actively Looking'}</p>
        </div>
      </div>

      <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
        <button className="btn-secondary" onClick={() => setIsEditing(true)}>
          Edit Profile Details
        </button>
      </div>
    </div>
  );
};

export default ProfileView;