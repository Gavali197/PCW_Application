import React, { useState, useEffect } from 'react';
import api from '../../API/axios'; // Adjust path as needed
import '../admin/Admin.css';

const Settings = () => {
  const [formData, setFormData] = useState({
    profilePicUrl: '',
    fullName: '',
    phone: '',
    email: '',
    password: '',
    department: '',
    managingClass: ''
  });
  
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        const { user, committeeData } = res.data;
        
        setRole(user.role);
        setFormData({
          profilePicUrl: user.profilePicUrl || '',
          fullName: user.fullName || '',
          phone: user.phone || '',
          email: user.email || '',
          password: '', // Keep password blank initially
          department: committeeData?.department || '',
          managingClass: committeeData?.managingClass || ''
        });
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to load settings.' });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.put('/settings', formData);
      setMessage({ type: 'success', text: res.data.message });
      // Clear password field after successful save
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile settings...</div>;

  return (
    <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px' }}>
        <img 
          src={formData.profilePicUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
          alt="Profile" 
          style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #e2e8f0' }}
        />
        <div>
          <h2 style={{ margin: '0 0 5px 0' }}>Account Settings</h2>
          <span className="badge-outline">{role}</span>
        </div>
      </div>

      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'success' : 'error'}`} style={{ padding: '10px', marginBottom: '20px', borderRadius: '4px', backgroundColor: message.type === 'success' ? '#dcfce3' : '#fee2e2', color: message.type === 'success' ? '#166534' : '#991b1b' }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Profile Picture URL</label>
            <input type="url" name="profilePicUrl" value={formData.profilePicUrl} onChange={handleChange} placeholder="https://imgur.com/..." />
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>

          {/* Committee Only Fields */}
          {role === 'Committee' && (
            <>
              <div className="form-group" style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                <label>Department</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange} required placeholder="e.g. Computer Science" />
              </div>
              <div className="form-group" style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                <label>Managing Class</label>
                <input type="text" name="managingClass" value={formData.managingClass} onChange={handleChange} required placeholder="e.g. TYBCA Div A" />
              </div>
            </>
          )}

          <div className="form-group" style={{ gridColumn: 'span 2', marginTop: '10px' }}>
            <hr style={{ borderTop: '1px solid #e2e8f0', margin: '0 0 15px 0' }} />
            <h4 style={{ margin: '0 0 15px 0' }}>Security</h4>
          </div>

          <div className="form-group">
            <label>Email Address (Login ID)</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to keep current" />
            <small style={{ color: '#64748b' }}>Only fill this if you want to change your password.</small>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={saving} style={{ marginTop: '25px', width: '100%', padding: '12px' }}>
          {saving ? 'Saving Updates...' : 'Save All Settings'}
        </button>
      </form>
    </div>
  );
};

export default Settings;