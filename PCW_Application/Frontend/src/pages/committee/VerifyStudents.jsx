import React, { useState, useEffect } from 'react';
import api from '../../API/axios';
import '../admin/Admin.css'; 

const VerifyStudents = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfiles = async () => {
    try {
      const res = await api.get('/profiles');
      // Handle case where backend might wrap data in an object (e.g., res.data.data)
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setProfiles(data);
    } catch (err) {
      console.error('Failed to fetch profiles:', err);
      setError(err.response?.data?.message || 'Failed to load student profiles. Check console.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleVerify = async (profileId, status) => {
    try {
      await api.put(`/profiles/${profileId}/verify`, { status });
      fetchProfiles(); 
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) return <div>Loading student profiles...</div>;
  if (error) return <div className="alert error">{error}</div>;

  return (
    <div className="card table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th>Enrollment</th>
            <th>Email</th>
            <th>Branch</th>
            <th>CGPA</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {profiles.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                No student profiles found. Wait for students to submit their details.
              </td>
            </tr>
          ) : (
            profiles.map((profile) => (
              <tr key={profile._id}>
                <td><strong>{profile.enrollmentNo}</strong></td>
                <td>{profile.userId?.email || 'N/A'}</td>
                <td>{profile.branch}</td>
                <td>{profile.cgpa} <br/><small>{profile.activeBacklogs} backlogs</small></td>
                <td>
                  <span className={`status-badge ${profile.verificationStatus?.toLowerCase()}`}>
                    {profile.verificationStatus}
                  </span>
                </td>
                <td>
                  {profile.verificationStatus === 'Pending' && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        className="btn-secondary" 
                        style={{ color: '#166534', borderColor: '#166534' }}
                        onClick={() => handleVerify(profile._id, 'Verified')}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn-secondary" 
                        style={{ color: '#991b1b', borderColor: '#991b1b' }}
                        onClick={() => handleVerify(profile._id, 'Rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VerifyStudents;