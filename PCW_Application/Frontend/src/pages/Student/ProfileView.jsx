import React, { useState, useEffect } from 'react';
import api from '../../API/axios';

const ProfileView = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profiles/me');
        setProfile(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Profile not found. Please contact the committee to set up your profile.');
        } else {
          setError('Failed to load profile.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading profile data...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!profile) return null;

  return (
    <div className="card">
      <div className="card-header flex-between">
        <h3>Academic Details</h3>
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
    </div>
  );
};

export default ProfileView;