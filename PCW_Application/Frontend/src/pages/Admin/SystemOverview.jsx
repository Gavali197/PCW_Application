import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../API/axios';

const SystemOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/overview');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading system analytics...</div>;
  if (!data) return <div className="error-message">Failed to load data.</div>;

  return (
    <div>
      {/* KPI Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Placement Rate</h3>
          <p className="stat-number highlight">{data.kpis.placementPercentage}%</p>
          <small>{data.kpis.placedStudents} of {data.kpis.totalStudents} students placed</small>
        </div>
        
        <div className="stat-card">
          <h3>Total Job Drives</h3>
          <p className="stat-number">{data.kpis.totalDrives}</p>
          <small>Across {data.kpis.totalCompanies} registered companies</small>
        </div>

        <div className="stat-card">
          <h3>Total Applications</h3>
          <p className="stat-number">{data.kpis.totalApplications}</p>
          <small>Processed by the system</small>
        </div>
      </div>

      {/* Chart Section */}
      <div className="card" style={{ marginTop: '30px', height: '400px' }}>
        <h3 style={{ marginBottom: '20px' }}>Placements by Branch</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.branchStats}
            margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="branch" />
            <YAxis />
            <Tooltip cursor={{ fill: '#f1f5f9' }} />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="totalStudents" name="Total Students" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="placedStudents" name="Placed Students" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SystemOverview;