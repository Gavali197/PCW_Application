import React, { useState, useEffect } from 'react';
// import api from '../../api/axios';
import api from '../../API/axios';
import '../admin/Admin.css'; // Reusing the data-table CSS

const VerifyStudents = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = async () => {
    try {
      const res = await api.get('/profiles');
      setProfiles(res.data);
    } catch (err) {
      console.error('Failed to fetch profiles', err);
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
      // Refresh the list after successful update
      fetchProfiles(); 
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) return <div>Loading student profiles...</div>;

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
          {profiles.map((profile) => (
            <tr key={profile._id}>
              <td><strong>{profile.enrollmentNo}</strong></td>
              <td>{profile.userId?.email}</td>
              <td>{profile.branch}</td>
              <td>{profile.cgpa} <br/><small>{profile.activeBacklogs} backlogs</small></td>
              <td>
                <span className={`status-badge ${profile.verificationStatus.toLowerCase()}`}>
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VerifyStudents;