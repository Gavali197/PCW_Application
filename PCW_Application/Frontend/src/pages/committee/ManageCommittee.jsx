import React, { useState, useEffect } from 'react';
// import api from '../../api/axios';
import api from '../../API/axios';


const ManageCommittee = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  
  // NEW: State for the committee list
  const [members, setMembers] = useState([]);
  const [fetchingMembers, setFetchingMembers] = useState(true);

  // Fetch the list on component load
  const fetchMembers = async () => {
    try {
      const res = await api.get('/users/committee');
      setMembers(res.data);
    } catch (err) {
      console.error('Failed to fetch committee members', err);
    } finally {
      setFetchingMembers(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('/users/committee', { email, password });
      setMessage({ type: 'success', text: `Account for ${email} created successfully!` });
      setEmail('');
      setPassword('');
      fetchMembers(); // Refresh the list instantly
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create account.' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this account?`)) return;

    try {
      await api.patch(`/users/${userId}/status`);
      fetchMembers(); // Refresh the list to show the new status
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="admin-grid">
      {/* Create Account Form */}
      <div className="card admin-form-card">
        <h3>Add New Committee Member</h3>
        <p className="helper-text">This creates an account with Tier 2 privileges.</p>
        
        {message.text && (
          <div className={`alert ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleCreateAccount}>
          <div className="form-group">
            <label>Staff Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Temporary Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
      </div>

      {/* Active Members List */}
      <div className="card table-responsive">
        <h3>Staff Directory</h3>
        <p className="helper-text">Manage access for existing committee members.</p>
        
        {fetchingMembers ? (
          <p>Loading directory...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>No committee members found.</td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member._id}>
                    <td>{member.email}</td>
                    <td>
                      <span className={`status-badge ${member.isActive ? 'verified' : 'rejected'}`}>
                        {member.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-secondary"
                        style={{ borderColor: member.isActive ? '#991b1b' : '#166534', color: member.isActive ? '#991b1b' : '#166534' }}
                        onClick={() => handleToggleStatus(member._id, member.isActive)}
                      >
                        {member.isActive ? 'Revoke Access' : 'Restore Access'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageCommittee;