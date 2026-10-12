import React, { useState } from 'react';
import api from '../../API/axios'; // Matched your exact import path

const ProfileForm = ({ initialData, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    // Personal Details (From User Model)
    fullName: initialData?.userId?.fullName || '',
    phone: initialData?.userId?.phone || '',
    profilePicUrl: initialData?.userId?.profilePicUrl || '',
    address: initialData?.address || '',
    
    // Academic Base
    enrollmentNo: initialData?.enrollmentNo || '',
    collegeName: initialData?.collegeName || 'Veer Narmad South Gujarat University',
    highestEducation: initialData?.highestEducation || '',
    branch: initialData?.branch || '',
    
    // Grades
    tenthMarks: initialData?.tenthMarks || '',
    twelfthMarks: initialData?.twelfthMarks || '',
    cgpa: initialData?.cgpa || '',
    lastSemCgpa: initialData?.lastSemCgpa || '',
    activeBacklogs: initialData?.activeBacklogs || 0,
    resumeUrl: initialData?.resumeUrl || '',
    
    // Internship
    hasInternship: initialData?.internship?.hasCompleted || false,
    internshipCompany: initialData?.internship?.companyName || '',
    internshipDuration: initialData?.internship?.duration || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/profiles', {
        ...formData,
        cgpa: Number(formData.cgpa),
        lastSemCgpa: Number(formData.lastSemCgpa || 0),
        activeBacklogs: Number(formData.activeBacklogs)
      });
      onSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile details.');
    } finally {
      setLoading(false);
    }
  };

  // Helper styles for the form sections
  const sectionStyle = { backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e2e8f0' };
  const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h3 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px' }}>
        {initialData ? 'Update Complete Profile' : 'Setup Your Profile'}
      </h3>
      
      {initialData && (
        <div className="alert pending" style={{ backgroundColor: '#fef9c3', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
          <strong>Note:</strong> Updating your core CGPA or Backlogs will reset Verification Status to 'Pending'.
        </div>
      )}

      {error && <div className="error-message" style={{ marginBottom: '15px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        
        {/* SECTION 1: Personal Details */}
        <div style={sectionStyle}>
          <h4 style={{ margin: '0 0 15px 0', color: '#0f172a' }}>1. Personal Information</h4>
          <div style={gridStyle}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Profile Picture URL</label>
              <input type="url" name="profilePicUrl" value={formData.profilePicUrl} onChange={handleChange} placeholder="https://imgur.com/... (Optional)" />
            </div>
            <div className="form-group">
              <label>Full Legal Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Residential Address</label>
              <textarea name="address" value={formData.address} onChange={handleChange} required rows="2" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }} />
            </div>
          </div>
        </div>

        {/* SECTION 2: Academic History */}
        <div style={sectionStyle}>
          <h4 style={{ margin: '0 0 15px 0', color: '#0f172a' }}>2. Academic History</h4>
          <div style={gridStyle}>
            <div className="form-group">
              <label>10th Marks (Percentage / CGPA)</label>
              <input type="text" name="tenthMarks" value={formData.tenthMarks} onChange={handleChange} required placeholder="e.g. 85%" />
            </div>
            <div className="form-group">
              <label>12th Marks (Percentage / CGPA)</label>
              <input type="text" name="twelfthMarks" value={formData.twelfthMarks} onChange={handleChange} required placeholder="e.g. 82%" />
            </div>
            <div className="form-group">
              <label>College / University Name</label>
              <input type="text" name="collegeName" value={formData.collegeName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Highest Education / Degree</label>
              <select name="highestEducation" value={formData.highestEducation} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                <option value="">Select...</option>
                <option value="BCA">BCA</option>
                <option value="BTech CS">BTech CS</option>
                <option value="BTech IT">BTech IT</option>
                <option value="MCA">MCA</option>
                <option value="MSc ICT">MSc ICT</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 3: Current Degree Status */}
        <div style={sectionStyle}>
          <h4 style={{ margin: '0 0 15px 0', color: '#0f172a' }}>3. Current Degree Status</h4>
          <div style={gridStyle}>
            <div className="form-group">
              <label>Enrollment Number</label>
              <input type="text" name="enrollmentNo" value={formData.enrollmentNo} onChange={handleChange} required disabled={!!initialData} />
            </div>
            <div className="form-group">
              <label>Branch / Specialization</label>
              <select name="branch" value={formData.branch} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                <option value="">Select Branch...</option>
                <option value="BCA">BCA</option>
                <option value="BTech CS">BTech CS</option>
                <option value="BTech IT">BTech IT</option>
                <option value="MCA">MCA</option>
                <option value="MSc ICT">MSc ICT</option>
              </select>
            </div>
            <div className="form-group">
              <label>Overall CGPA</label>
              <input type="number" step="0.01" min="0" max="10" name="cgpa" value={formData.cgpa} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Last Semester CGPA</label>
              <input type="number" step="0.01" min="0" max="10" name="lastSemCgpa" value={formData.lastSemCgpa} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Active Backlogs</label>
              <input type="number" min="0" name="activeBacklogs" value={formData.activeBacklogs} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Resume Link (Google Drive / S3)</label>
              <input type="url" name="resumeUrl" value={formData.resumeUrl} onChange={handleChange} required placeholder="https://..." />
            </div>
          </div>
        </div>

        {/* SECTION 4: Internship Experience */}
        <div style={sectionStyle}>
          <h4 style={{ margin: '0 0 15px 0', color: '#0f172a' }}>4. Experience</h4>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
              <input 
                type="checkbox" 
                name="hasInternship" 
                checked={formData.hasInternship} 
                onChange={handleChange} 
                style={{ width: '18px', height: '18px' }}
              />
              I have completed a professional internship
            </label>
          </div>

          {formData.hasInternship && (
            <div style={{ ...gridStyle, marginTop: '15px' }}>
              <div className="form-group">
                <label>Company Name</label>
                <input type="text" name="internshipCompany" value={formData.internshipCompany} onChange={handleChange} required={formData.hasInternship} />
              </div>
              <div className="form-group">
                <label>Duration (Dates)</label>
                <input type="text" name="internshipDuration" value={formData.internshipDuration} onChange={handleChange} required={formData.hasInternship} placeholder="e.g. May 2026 - July 2026" />
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1, padding: '12px' }}>
            {loading ? 'Saving...' : 'Save Complete Profile'}
          </button>
          {initialData && (
            <button type="button" className="btn-secondary" onClick={onCancel} style={{ padding: '12px', width: '150px' }}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;