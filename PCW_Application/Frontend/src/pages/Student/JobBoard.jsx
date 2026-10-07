import React, { useState, useEffect } from 'react';
import api from '../../API/axios';

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs');
        setJobs(res.data);
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApply = async (driveId) => {
    try {
      await api.post(`/applications/drive/${driveId}`);
      alert('Application submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply.');
    }
  };

  if (loading) return <div>Loading available jobs...</div>;

  return (
    <div className="job-grid">
      {jobs.map((job) => (
        <div key={job._id} className="card job-card">
          <div className="job-header">
            <h3>{job.companyId?.companyName || 'Unknown Company'}</h3>
            <span className="ctc-badge">{job.ctc}</span>
          </div>
          <h4 className="job-role">{job.jobRole}</h4>
          
          <div className="job-details">
            <p><strong>Eligibility:</strong> {job.eligibility.minCgpa} CGPA, Max {job.eligibility.maxBacklogs} Backlogs</p>
            <p><strong>Allowed Branches:</strong> {job.eligibility.allowedBranches.join(', ')}</p>
            <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
          </div>

          <button 
            className="btn-primary apply-btn" 
            onClick={() => handleApply(job._id)}
          >
            Apply Now
          </button>
        </div>
      ))}
    </div>
  );
};

export default JobBoard;