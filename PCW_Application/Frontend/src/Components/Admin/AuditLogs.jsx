import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/audit-logs');
        setLogs(res.data.logs);
      } catch (err) {
        console.error('Failed to fetch audit logs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) return <div>Loading system logs...</div>;

  return (
    <div className="card">
      <div className="flex-between" style={{ marginBottom: '20px' }}>
        <h3>System Activity Logs</h3>
        <button className="btn-secondary">Export to CSV</button>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Performed By</th>
              <th>Target ID</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>No audit logs found.</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id}>
                  <td>{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="log-action">{log.action}</td>
                  <td>
                    {log.performedBy?.email} <br/>
                    <small className="badge-outline">{log.performedBy?.role}</small>
                  </td>
                  <td><small>{log.targetId}</small></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogs;