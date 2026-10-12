import React, { useState, useEffect } from 'react';
import api from '../../API/axios';
import './Admin.css';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/auditLogs'); 
        const logData = Array.isArray(res.data) ? res.data : (res.data.logs || []);
        setLogs(logData); 
      } catch (err) {
        console.error('Failed to fetch logs:', err);
        setError('Failed to load audit logs.');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const handleExportCSV = () => {
    if (logs.length === 0) return alert("No logs available to export.");
    const headers = ['Timestamp', 'Action Performed', 'User Email'];
    const csvRows = logs.map(log => {
      const date = new Date(log.createdAt).toLocaleString();
      const action = `"${log.action || 'N/A'}"`;
      const user = `"${log.performedBy?.email || 'System'}"`; 
      return [date, action, user].join(',');
    });
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `System_Audit_Logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

 // Fetch the detailed summary when the HOD clicks the button
  const handleViewDetails = async (targetId) => {
    setModalLoading(true);
    setIsModalOpen(true);
    
    try {
      // 1. Forcefully retrieve the token from local storage
      // (Adjust this depending on if you store it as 'token' or inside a 'user' object)
      const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('user'))?.token;

      // 2. Explicitly attach the Authorization header to the request
      const res = await api.get(`/profiles/${targetId}/summary`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setSelectedStudent(res.data);
    } catch (err) {
      console.error("API Error:", err.response || err);
      alert(err.response?.data?.message || "Failed to load student data or data no longer exists.");
      setIsModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) return <div>Loading audit logs...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="card table-responsive">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ margin: 0 }}>System Audit Logs</h3>
          <p className="helper-text" style={{ margin: '5px 0 0 0' }}>Track administrative actions and system events.</p>
        </div>
        <button className="btn-primary" onClick={handleExportCSV} style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}>
          ⬇ Export to CSV
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Action</th>
            <th>Performed By</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>No audit logs recorded yet.</td>
            </tr>
          ) : (
            logs.map((log) => (
              <tr key={log._id}>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
                <td><strong>{log.action}</strong></td>
                <td>{log.performedBy?.email || 'System'}</td>
                <td>
                  {/* Only show the button if the action involves a Student Profile */}
                  {log.targetId && log.action.includes('Profile') ? (
                    <button 
                      className="btn-secondary" 
                      onClick={() => handleViewDetails(log.targetId)}
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      View Record
                    </button>
                  ) : (
                    <span style={{ color: '#94a3b8' }}>-</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* --- THE DETAILED MODAL OVERLAY --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex-between" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>Student Overall Record</h3>
              <button 
                onClick={() => { setIsModalOpen(false); setSelectedStudent(null); }} 
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b' }}
              >
                ✖
              </button>
            </div>
            
            {modalLoading ? (
              <p style={{ textAlign: 'center', padding: '20px' }}>Fetching complete records...</p>
            ) : selectedStudent ? (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '6px' }}>
                   <div>
                     <small style={{ color: '#64748b' }}>Email</small>
                     <p style={{ margin: '0', fontWeight: 'bold' }}>{selectedStudent.profile.userId?.email}</p>
                   </div>
                   <div>
                     <small style={{ color: '#64748b' }}>Enrollment</small>
                     <p style={{ margin: '0', fontWeight: 'bold' }}>{selectedStudent.profile.enrollmentNo}</p>
                   </div>
                   <div>
                     <small style={{ color: '#64748b' }}>Branch & CGPA</small>
                     <p style={{ margin: '0', fontWeight: 'bold' }}>{selectedStudent.profile.branch} ({selectedStudent.profile.cgpa})</p>
                   </div>
                   <div>
                     <small style={{ color: '#64748b' }}>Backlogs</small>
                     <p style={{ margin: '0', fontWeight: 'bold', color: selectedStudent.profile.activeBacklogs > 0 ? '#ef4444' : '#10b981' }}>
                       {selectedStudent.profile.activeBacklogs}
                     </p>
                   </div>
                </div>
                
                <h4 style={{ margin: '0 0 10px 0' }}>Job Applications ({selectedStudent.totalApplications} total)</h4>
                <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Role</th>
                        <th>Current Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudent.applications.length === 0 ? (
                        <tr><td colSpan="3" style={{ textAlign: 'center' }}>No applications found.</td></tr>
                      ) : (
                        selectedStudent.applications.map(app => (
                          <tr key={app._id}>
                            <td><strong>{app.driveId?.companyId?.companyName || 'N/A'}</strong></td>
                            <td>{app.driveId?.jobRole || 'N/A'}</td>
                            <td>
                              <span className="badge-outline" style={{ fontSize: '11px' }}>
                                {app.status?.replace('_', ' ')}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;