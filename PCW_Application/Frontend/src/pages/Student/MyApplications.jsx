import React, { useState, useEffect } from 'react';
import api from '../../API/axios';
import '../admin/Admin.css'; 

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const res = await api.get('/applications/me');
        setApplications(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyApplications();
  }, []);

  if (loading) return <div>Loading your applications...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="card table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Job Role</th>
            <th>Applied On</th>
            <th>Current Status</th>
          </tr>
        </thead>
        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>You have not applied to any job drives yet.</td>
            </tr>
          ) : (
            applications.map((app) => (
              <tr key={app._id}>
                {/* Updated to match your 'driveId' populate path */}
                <td><strong>{app.driveId?.companyId?.companyName || 'N/A'}</strong></td>
                <td>{app.driveId?.jobRole || 'N/A'}</td>
                
                {/* Updated to match your 'appliedOn' field */}
                <td>{app.appliedOn ? new Date(app.appliedOn).toLocaleDateString() : 'N/A'}</td>
                
                <td>
                  <span 
                    className="badge-outline" 
                    style={{ 
                      backgroundColor: app.status === 'Placed' ? '#dcfce7' 
                                     : app.status === 'Rejected' ? '#fee2e2' 
                                     : '#f1f5f9',
                      borderColor: app.status === 'Placed' ? '#166534' 
                                 : app.status === 'Rejected' ? '#991b1b' 
                                 : '#cbd5e1',
                      color: app.status === 'Placed' ? '#166534' 
                           : app.status === 'Rejected' ? '#991b1b' 
                           : '#475569',
                      fontWeight: 'bold'
                    }}
                  >
                    {app.status.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyApplications;