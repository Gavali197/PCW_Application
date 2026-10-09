import React, { useState, useEffect } from 'react';
import api from '../../API/axios';

const CreateJobDrive = () => {
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    companyId: '',
    jobRole: '',
    ctc: '',
    deadline: '',
    minCgpa: '',
    maxBacklogs: '',
    branchesString: '' // We will split this into an array before sending
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get('/companies');
        setCompanies(res.data);
      } catch (err) {
        console.error('Failed to fetch companies', err);
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Transform flat state into the nested structure the backend expects
    const payload = {
      companyId: formData.companyId,
      jobRole: formData.jobRole,
      ctc: formData.ctc,
      deadline: formData.deadline,
      eligibility: {
        minCgpa: Number(formData.minCgpa),
        maxBacklogs: Number(formData.maxBacklogs),
        // Split string by comma, remove whitespace, filter out empty strings
        allowedBranches: formData.branchesString.split(',').map(b => b.trim()).filter(b => b)
      }
    };

    try {
      await api.post('/jobs', payload);
      setMessage({ type: 'success', text: 'Job Drive created successfully!' });
      // Reset form
      setFormData({
        companyId: '', jobRole: '', ctc: '', deadline: '', minCgpa: '', maxBacklogs: '', branchesString: ''
      });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create job drive.' });
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px' }}>
      <h3>Post a New Job Drive</h3>
      
      {message.text && (
        <div className={`alert ${message.type}`} style={{ marginTop: '15px' }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <div className="form-group">
          <label>Company</label>
          <select 
            name="companyId" 
            value={formData.companyId} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value="">Select a Company...</option>
            {companies.map(c => (
              <option key={c._id} value={c._id}>{c.companyName}</option>
            ))}
          </select>
          {companies.length === 0 && (
            <small style={{ color: 'red' }}>You must add a company to the system first via Postman.</small>
          )}
        </div>

        <div className="admin-grid">
          <div className="form-group">
            <label>Job Role</label>
            <input type="text" name="jobRole" value={formData.jobRole} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>CTC Details</label>
            <input type="text" name="ctc" value={formData.ctc} onChange={handleChange} required placeholder="e.g., 8.5 LPA" />
          </div>
        </div>

        <h4>Eligibility Criteria (The Policy Lock)</h4>
        <div className="admin-grid">
          <div className="form-group">
            <label>Minimum CGPA</label>
            <input type="number" step="0.01" name="minCgpa" value={formData.minCgpa} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Maximum Active Backlogs</label>
            <input type="number" name="maxBacklogs" value={formData.maxBacklogs} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Allowed Branches (Comma separated)</label>
          <input 
            type="text" 
            name="branchesString" 
            value={formData.branchesString} 
            onChange={handleChange} 
            required 
            placeholder="e.g., BTech CS, MSc ICT, MCA" 
          />
        </div>

        <div className="form-group">
          <label>Application Deadline</label>
          <input type="datetime-local" name="deadline" value={formData.deadline} onChange={handleChange} required />
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: '15px' }}>
          Publish Job Drive
        </button>
      </form>
    </div>
  );
};

export default CreateJobDrive;