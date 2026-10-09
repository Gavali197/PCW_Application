import React, { useState } from 'react';
import api from '../../API/axios';

const ProfileForm = ({ initialData, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    enrollmentNo: initialData?.enrollmentNo || '',
    branch: initialData?.branch || '',
    cgpa: initialData?.cgpa || '',
    activeBacklogs: initialData?.activeBacklogs || 0,
    resumeUrl: initialData?.resumeUrl || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        cgpa: Number(formData.cgpa),
        activeBacklogs: Number(formData.activeBacklogs)
      };
      
      const res = await api.post('/profiles', payload);
      onSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px' }}>
      <h3>{initialData ? 'Update Profile' : 'Complete Your Profile'}</h3>
      
      {initialData && (
        <div className="alert pending" style={{ backgroundColor: '#fef9c3', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
          <strong>Note:</strong> Updating your CGPA will reset Verification Status to 'Pending'.
        </div>
      )}

      {error && <div className="error-message" style={{ marginBottom: '15px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Enrollment Number</label>
          <input type="text" name="enrollmentNo" value={formData.enrollmentNo} onChange={handleChange} required disabled={!!initialData} />
        </div>

        <div className="form-group">
          <label>Branch / Degree</label>
          <select name="branch" value={formData.branch} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
            <option value="">Select Branch...</option>
            <option value="BCA">BCA</option>
            <option value="BTech CS">BTech CS</option>
            <option value="BTech IT">BTech IT</option>
            <option value="MCA">MCA</option>
            <option value="MSc ICT">MSc ICT</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="form-group">
            <label>Current CGPA</label>
            <input type="number" step="0.01" min="0" max="10" name="cgpa" value={formData.cgpa} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Active Backlogs</label>
            <input type="number" min="0" name="activeBacklogs" value={formData.activeBacklogs} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Resume Link (Google Drive / S3)</label>
          <input type="url" name="resumeUrl" value={formData.resumeUrl} onChange={handleChange} required placeholder="https://..." />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
          {initialData && (
            <button type="button" className="btn-secondary" onClick={onCancel} style={{ flex: 1 }}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;