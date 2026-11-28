import React, { useState } from 'react';
import api from '../../API/axios';

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
    cgpa: initialData?.cgpa ?? '',
    lastSemCgpa: initialData?.lastSemCgpa ?? '',
    activeBacklogs: initialData?.activeBacklogs ?? 0,
    resumeUrl: initialData?.resumeUrl || '',
    
    // Internship
    hasInternship: initialData?.internship?.hasCompleted || false,
    internshipCompany: initialData?.internship?.companyName || '',
    internshipDuration: initialData?.internship?.duration || ''
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle Input Changes with 10-Digit Restriction for Enrollment No
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === 'checkbox' ? checked : value;

    // Restrict Enrollment Number to only numbers and max 10 digits
    if (name === 'enrollmentNo') {
      finalValue = value.replace(/\D/g, '').slice(0, 10);
    }

    setFormData({ ...formData, [name]: finalValue });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName || !formData.fullName.trim()) {
      newErrors.fullName = 'Full Name cannot be empty or only spaces.';
    }
    if (!formData.phone || !formData.phone.trim()) {
      newErrors.phone = 'Phone Number cannot be empty or only spaces.';
    }
    if (!formData.address || !formData.address.trim()) {
      newErrors.address = 'Residential Address cannot be empty or only spaces.';
    }
    if (!formData.tenthMarks || !formData.tenthMarks.trim()) {
      newErrors.tenthMarks = '10th Marks cannot be empty or only spaces.';
    }
    if (!formData.twelfthMarks || !formData.twelfthMarks.trim()) {
      newErrors.twelfthMarks = '12th Marks cannot be empty or only spaces.';
    }
    if (!formData.collegeName || !formData.collegeName.trim()) {
      newErrors.collegeName = 'College Name cannot be empty or only spaces.';
    }
    if (!formData.highestEducation || !formData.highestEducation.trim()) {
      newErrors.highestEducation = 'Please select Highest Education.';
    }

    // --- ENROLLMENT NUMBER 10-DIGIT VALIDATION ---
    const enrollmentTrimmed = (formData.enrollmentNo || '').trim();
    if (!enrollmentTrimmed) {
      newErrors.enrollmentNo = 'Enrollment Number cannot be empty.';
    } else if (!/^\d{10}$/.test(enrollmentTrimmed)) {
      newErrors.enrollmentNo = 'Enrollment Number must be exactly 10 digits.';
    }

    if (!formData.branch || !formData.branch.trim()) {
      newErrors.branch = 'Please select your Branch.';
    }
    if (formData.cgpa === '' || isNaN(Number(formData.cgpa))) {
      newErrors.cgpa = 'Valid CGPA is required (0 - 10).';
    }
    if (formData.lastSemCgpa === '' || isNaN(Number(formData.lastSemCgpa))) {
      newErrors.lastSemCgpa = 'Valid Last Sem CGPA is required (0 - 10).';
    }
    if (formData.activeBacklogs === '' || isNaN(Number(formData.activeBacklogs))) {
      newErrors.activeBacklogs = 'Enter number of backlogs (0 or more).';
    }
    if (!formData.resumeUrl || !formData.resumeUrl.trim()) {
      newErrors.resumeUrl = 'Resume Link cannot be empty or only spaces.';
    }

    if (formData.hasInternship) {
      if (!formData.internshipCompany || !formData.internshipCompany.trim()) {
        newErrors.internshipCompany = 'Company Name cannot be empty or only spaces.';
      }
      if (!formData.internshipDuration || !formData.internshipDuration.trim()) {
        newErrors.internshipDuration = 'Duration cannot be empty or only spaces.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        profilePicUrl: formData.profilePicUrl.trim(),
        address: formData.address.trim(),
        enrollmentNo: formData.enrollmentNo.trim(),
        collegeName: formData.collegeName.trim(),
        highestEducation: formData.highestEducation.trim(),
        branch: formData.branch.trim(),
        tenthMarks: formData.tenthMarks.trim(),
        twelfthMarks: formData.twelfthMarks.trim(),
        resumeUrl: formData.resumeUrl.trim(),
        cgpa: Number(formData.cgpa),
        lastSemCgpa: Number(formData.lastSemCgpa || 0),
        activeBacklogs: Number(formData.activeBacklogs || 0),
        internshipCompany: formData.hasInternship ? formData.internshipCompany.trim() : '',
        internshipDuration: formData.hasInternship ? formData.internshipDuration.trim() : ''
      };

      const res = await api.post('/profiles', payload);
      onSuccess(res.data);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to save profile details.');
    } finally {
      setLoading(false);
    }
  };

  const sectionStyle = { backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e2e8f0' };
  const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };

  const getInputStyle = (fieldName, baseStyle = {}) => ({
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: errors[fieldName] ? '1.5px solid #dc2626' : '1px solid #ccc',
    outlineColor: errors[fieldName] ? '#dc2626' : '#2563eb',
    backgroundColor: errors[fieldName] ? '#fff5f5' : '#ffffff',
    boxSizing: 'border-box',
    ...baseStyle
  });

  const renderError = (fieldName) => {
    if (!errors[fieldName]) return null;
    return (
      <span style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px', display: 'block', fontWeight: '500' }}>
        ⚠️ {errors[fieldName]}
      </span>
    );
  };

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

      {serverError && (
        <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '6px', border: '1px solid #f87171', marginBottom: '15px', fontWeight: '500' }}>
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        
        {/* SECTION 1: Personal Details */}
        <div style={sectionStyle}>
          <h4 style={{ margin: '0 0 15px 0', color: '#0f172a' }}>1. Personal Information</h4>
          <div style={gridStyle}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Profile Picture URL</label>
              <input 
                type="url" 
                name="profilePicUrl" 
                value={formData.profilePicUrl} 
                onChange={handleChange} 
                style={getInputStyle('profilePicUrl')} 
                placeholder="https://imgur.com/... (Optional)" 
              />
            </div>
            
            <div className="form-group">
              <label>Full Legal Name *</label>
              <input 
                type="text" 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleChange} 
                style={getInputStyle('fullName')} 
                placeholder="e.g. John Doe" 
              />
              {renderError('fullName')}
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                style={getInputStyle('phone')} 
                placeholder="e.g. 9876543210" 
              />
              {renderError('phone')}
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Residential Address *</label>
              <textarea 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                rows="2" 
                style={getInputStyle('address', { resize: 'vertical' })} 
                placeholder="Enter complete residential address" 
              />
              {renderError('address')}
            </div>
          </div>
        </div>

        {/* SECTION 2: Academic History */}
        <div style={sectionStyle}>
          <h4 style={{ margin: '0 0 15px 0', color: '#0f172a' }}>2. Academic History</h4>
          <div style={gridStyle}>
            <div className="form-group">
              <label>10th Marks (Percentage / CGPA) *</label>
              <input 
                type="text" 
                name="tenthMarks" 
                value={formData.tenthMarks} 
                onChange={handleChange} 
                style={getInputStyle('tenthMarks')} 
                placeholder="e.g. 85%" 
              />
              {renderError('tenthMarks')}
            </div>

            <div className="form-group">
              <label>12th Marks (Percentage / CGPA) *</label>
              <input 
                type="text" 
                name="twelfthMarks" 
                value={formData.twelfthMarks} 
                onChange={handleChange} 
                style={getInputStyle('twelfthMarks')} 
                placeholder="e.g. 82%" 
              />
              {renderError('twelfthMarks')}
            </div>

            <div className="form-group">
              <label>College / University Name *</label>
              <input 
                type="text" 
                name="collegeName" 
                value={formData.collegeName} 
                onChange={handleChange} 
                style={getInputStyle('collegeName')} 
              />
              {renderError('collegeName')}
            </div>

            <div className="form-group">
              <label>Highest Education / Degree *</label>
              <select 
                name="highestEducation" 
                value={formData.highestEducation} 
                onChange={handleChange} 
                style={getInputStyle('highestEducation')}
              >
                <option value="">Select...</option>
                <option value="BCA">BCA</option>
                <option value="BTech CS">BTech CS</option>
                <option value="BTech IT">BTech IT</option>
                <option value="MCA">MCA</option>
                <option value="MSc ICT">MSc ICT</option>
              </select>
              {renderError('highestEducation')}
            </div>
          </div>
        </div>

        {/* SECTION 3: Current Degree Status */}
        <div style={sectionStyle}>
          <h4 style={{ margin: '0 0 15px 0', color: '#0f172a' }}>3. Current Degree Status</h4>
          <div style={gridStyle}>
            <div className="form-group">
              <label>Enrollment Number (10 Digits) *</label>
              <input 
                type="text" 
                name="enrollmentNo" 
                value={formData.enrollmentNo} 
                onChange={handleChange} 
                disabled={!!initialData} 
                maxLength={10}
                inputMode="numeric"
                style={getInputStyle('enrollmentNo')} 
                placeholder="Enter 10-digit number (e.g. 2101201100)" 
              />
              {renderError('enrollmentNo')}
            </div>

            <div className="form-group">
              <label>Branch / Specialization *</label>
              <select 
                name="branch" 
                value={formData.branch} 
                onChange={handleChange} 
                style={getInputStyle('branch')}
              >
                <option value="">Select Branch...</option>
                <option value="BCA">BCA</option>
                <option value="BTech CS">BTech CS</option>
                <option value="BTech IT">BTech IT</option>
                <option value="MCA">MCA</option>
                <option value="MSc ICT">MSc ICT</option>
              </select>
              {renderError('branch')}
            </div>

            <div className="form-group">
              <label>Overall CGPA *</label>
              <input 
                type="number" 
                step="0.01" 
                min="0" 
                max="10" 
                name="cgpa" 
                value={formData.cgpa} 
                onChange={handleChange} 
                style={getInputStyle('cgpa')} 
                placeholder="e.g. 8.5" 
              />
              {renderError('cgpa')}
            </div>

            <div className="form-group">
              <label>Last Semester CGPA *</label>
              <input 
                type="number" 
                step="0.01" 
                min="0" 
                max="10" 
                name="lastSemCgpa" 
                value={formData.lastSemCgpa} 
                onChange={handleChange} 
                style={getInputStyle('lastSemCgpa')} 
                placeholder="e.g. 8.2" 
              />
              {renderError('lastSemCgpa')}
            </div>

            <div className="form-group">
              <label>Active Backlogs *</label>
              <input 
                type="number" 
                min="0" 
                name="activeBacklogs" 
                value={formData.activeBacklogs} 
                onChange={handleChange} 
                style={getInputStyle('activeBacklogs')} 
                placeholder="0" 
              />
              {renderError('activeBacklogs')}
            </div>

            <div className="form-group">
              <label>Resume Link (Google Drive / S3) *</label>
              <input 
                type="url" 
                name="resumeUrl" 
                value={formData.resumeUrl} 
                onChange={handleChange} 
                style={getInputStyle('resumeUrl')} 
                placeholder="https://drive.google.com/..." 
              />
              {renderError('resumeUrl')}
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
                <label>Company Name *</label>
                <input 
                  type="text" 
                  name="internshipCompany" 
                  value={formData.internshipCompany} 
                  onChange={handleChange} 
                  style={getInputStyle('internshipCompany')} 
                  placeholder="Company Name" 
                />
                {renderError('internshipCompany')}
              </div>
              <div className="form-group">
                <label>Duration (Dates) *</label>
                <input 
                  type="text" 
                  name="internshipDuration" 
                  value={formData.internshipDuration} 
                  onChange={handleChange} 
                  style={getInputStyle('internshipDuration')} 
                  placeholder="e.g. May 2026 - July 2026" 
                />
                {renderError('internshipDuration')}
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