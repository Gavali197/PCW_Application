import React, { useState, useEffect } from 'react';
import api from '../../API/axios';
import '../../pages/admin/Admin.css';

const ApplicantTracking = () => {
  const [drives, setDrives] = useState([]);
  const [selectedDrive, setSelectedDrive] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch all job drives on load to populate the dropdown
  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const res = await api.get('/jobs');
        setDrives(res.data);
      } catch (err) {
        console.error('Failed to fetch job drives', err);
      }
    };
    fetchDrives();
  }, []);

  // 2. Fetch applications whenever a specific drive is selected
  useEffect(() => {
    if (!selectedDrive) {
      setApplications([]);
      return;
    }

    const fetchApplications = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/applications/drive/${selectedDrive}`);
        setApplications(res.data);
      } catch (err) {
        console.error('Failed to fetch applications', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [selectedDrive]);

  // 3. Handle updating the student's application status
  const handleStatusUpdate = async (applicationId, newStatus) => {
    if (newStatus === 'Placed') {
      const confirmLock = window.confirm(
        'WARNING: Marking a student as Placed will activate the Policy Lock. They will be removed from all other active drives and prevented from applying to new ones. Continue?'
      );
      if (!confirmLock) return;
    }

    try {
      await api.put(`/applications/${applicationId}/status`, { status: newStatus });
      
      // Update local state to reflect the change immediately
      setApplications(prev => 
        prev.map(app => 
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="card">
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
          Select Job Drive to View Applicants
        </label>
        <select 
          value={selectedDrive} 
          onChange={(e) => setSelectedDrive(e.target.value)}
          style={{ width: '100%', maxWidth: '400px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">-- Select a Job Drive --</option>
          {drives.map(drive => (
            <option key={drive._id} value={drive._id}>
              {drive.companyId?.companyName} - {drive.jobRole} (CTC: {drive.ctc})
            </option>
          ))}
        </select>
      </div>

      {loading && <div>Loading applicants...</div>}

      {!loading && selectedDrive && (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student Details</th>
                <th>Academic Standing</th>
                <th>Resume</th>
                <th>Current Status</th>
                <th>Update Stage</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No applications received for this drive yet.</td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <strong>{app.profileId?.enrollmentNo}</strong><br/>
                      <small>{app.profileId?.userId?.email}</small>
                    </td>
                    <td>
                      {app.profileId?.branch}<br/>
                      <small>CGPA: {app.profileId?.cgpa}</small>
                    </td>
                    <td>
                      <a href={app.profileId?.resumeUrl} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                        View Resume ↗
                      </a>
                    </td>
                    <td>
                      <span className="badge-outline" style={{ 
                        backgroundColor: app.status === 'Placed' ? '#dcfce7' : app.status === 'Rejected' ? '#fee2e2' : '#f1f5f9'
                      }}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <select 
                        value={app.status}
                        onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                        disabled={app.status === 'Placed' || app.status === 'Rejected'}
                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                      >
                        <option value="Applied">Applied</option>
                        <option value="Shortlisted_Round1">Shortlisted (Round 1)</option>
                        <option value="Shortlisted_Round2">Shortlisted (Round 2)</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Placed">Placed (Final)</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApplicantTracking;