import React, { useState, useEffect } from 'react';
import api from '../../API/axios';
import './Admin.css';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Adjust this endpoint if your route is named differently (e.g., /analytics/logs)
        const res = await api.get('/logs'); 
        setLogs(res.data);
      } catch (err) {
        console.error('Failed to fetch logs:', err);
        setError('Failed to load audit logs.');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // --- THE CSV GENERATOR FUNCTION ---
  const handleExportCSV = () => {
    if (logs.length === 0) {
      alert("No logs available to export.");
      return;
    }

    // 1. Create the Header Row
    const headers = ['Timestamp', 'Action Performed', 'User Email', 'Details'];

    // 2. Map through the log data and format each row
    const csvRows = logs.map(log => {
      const date = new Date(log.createdAt).toLocaleString();
      
      // Wrapping values in quotes prevents commas inside the text from breaking the CSV columns
      const action = `"${log.action || 'N/A'}"`;
      
      // Depending on how your backend populates the user, adjust this field
      const user = `"${log.userId?.email || 'System'}"`; 
      
      const details = `"${log.details || 'N/A'}"`;

      return [date, action, user, details].join(',');
    });

    // 3. Combine headers and rows with line breaks
    const csvContent = [headers.join(','), ...csvRows].join('\n');

    // 4. Create a downloadable file object (Blob)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // 5. Create a temporary hidden link, click it to download, and remove it
    const link = document.createElement('a');
    link.href = url;
    
    // Generate a dynamic filename with today's date
    const today = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `System_Audit_Logs_${today}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        
        {/* The Export Button */}
        <button 
          className="btn-primary" 
          onClick={handleExportCSV}
          style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
        >
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
                <td>{log.userId?.email || 'System'}</td>
                <td>{log.details}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogs;