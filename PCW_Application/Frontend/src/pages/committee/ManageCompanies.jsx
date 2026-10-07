import React, { useState, useEffect } from 'react';
import api from '../../API/axios';
import '../../pages/admin/Admin.css'; // Reusing the grid and table CSS

const ManageCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    hrContactName: '',
    hrEmail: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchCompanies = async () => {
    try {
      const res = await api.get('/companies');
      setCompanies(res.data);
    } catch (err) {
      console.error('Failed to fetch companies', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      await api.post('/companies', formData);
      setMessage({ type: 'success', text: `${formData.companyName} added successfully!` });
      setFormData({ companyName: '', hrContactName: '', hrEmail: '' });
      fetchCompanies(); // Refresh the table
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to add company.' });
    }
  };

  return (
    <div className="admin-grid">
      {/* Add Company Form */}
      <div className="card admin-form-card">
        <h3>Add New Company</h3>
        <p className="helper-text">Register a new recruiter for upcoming job drives.</p>
        
        {message.text && (
          <div className={`alert ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name</label>
            <input 
              type="text" 
              name="companyName" 
              value={formData.companyName} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>HR Contact Name</label>
            <input 
              type="text" 
              name="hrContactName" 
              value={formData.hrContactName} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>HR Email Address</label>
            <input 
              type="email" 
              name="hrEmail" 
              value={formData.hrEmail} 
              onChange={handleChange} 
              required 
            />
          </div>
          <button type="submit" className="btn-primary">
            Register Company
          </button>
        </form>
      </div>

      {/* Companies List */}
      <div className="card table-responsive">
        <h3>Registered Companies</h3>
        <p className="helper-text">Companies available for job drive selection.</p>
        
        {loading ? (
          <p>Loading directory...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>HR Contact</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {companies.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>No companies registered yet.</td>
                </tr>
              ) : (
                companies.map((company) => (
                  <tr key={company._id}>
                    <td><strong>{company.companyName}</strong></td>
                    <td>{company.hrContactName}</td>
                    <td><a href={`mailto:${company.hrEmail}`}>{company.hrEmail}</a></td>
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

export default ManageCompanies;