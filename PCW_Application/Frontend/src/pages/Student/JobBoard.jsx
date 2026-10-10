import React, { useState, useEffect } from "react";
import api from "../../API/axios";
import "../admin/Admin.css"; // Reusing the modal CSS we just wrote

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal State
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");
        setJobs(res.data);
      } catch (err) {
        setError("Failed to load available job drives.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleOpenDetails = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleApply = async () => {
    if (!selectedJob) return;
    setApplying(true);
    try {
      await api.post("/applications", { jobDriveId: selectedJob._id });
      alert("Successfully applied to " + selectedJob.companyId?.companyName);
      setIsModalOpen(false);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to apply. Check your eligibility or if you already applied.",
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div>Loading opportunities...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Active Placement Drives</h2>

      {jobs.length === 0 ? (
        <div className="card" style={{ textAlign: "center" }}>
          No active job drives at the moment.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {jobs.map((job) => (
            <div
              key={job._id}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h3 style={{ margin: "0 0 5px 0", color: "#1e293b" }}>
                  {job.companyId?.companyName}
                </h3>
                <p
                  style={{
                    margin: "0 0 15px 0",
                    fontWeight: "bold",
                    color: "#0f172a",
                  }}
                >
                  {job.jobRole}
                </p>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#475569",
                    marginBottom: "15px",
                  }}
                >
                  <p style={{ margin: "5px 0" }}>💰 CTC: {job.ctc}</p>
                  <p style={{ margin: "5px 0" }}>
                    📅 Deadline: {new Date(job.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                className="btn-secondary"
                onClick={() => handleOpenDetails(job)}
                style={{ width: "100%" }}
              >
                View Full Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* --- THE JOB DETAILS MODAL --- */}
      {isModalOpen && selectedJob && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "650px" }}>
            <div
              className="flex-between"
              style={{
                borderBottom: "1px solid #e2e8f0",
                paddingBottom: "15px",
                marginBottom: "15px",
              }}
            >
              <div>
                <h2 style={{ margin: "0" }}>
                  {selectedJob.companyId?.companyName}
                </h2>
                <span style={{ color: "#64748b", fontSize: "14px" }}>
                  {selectedJob.jobRole}
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                ✖
              </button>
            </div>

            <div
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                paddingRight: "10px",
              }}
            >
              {/* Description */}
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ margin: "0 0 8px 0" }}>Job Description</h4>
                <p
                  style={{
                    margin: 0,
                    color: "#334155",
                    fontSize: "14px",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {selectedJob.description ||
                    "No specific description provided for this drive."}
                </p>
              </div>

              {/* Eligibility & Salary */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "15px",
                  backgroundColor: "#f8fafc",
                  padding: "15px",
                  borderRadius: "6px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <small style={{ color: "#64748b" }}>Package (CTC)</small>
                  <p style={{ margin: "0", fontWeight: "bold" }}>
                    {selectedJob.ctc}
                  </p>
                </div>
                <div>
                  <small style={{ color: "#64748b" }}>Min CGPA Required</small>
                  <p style={{ margin: "0", fontWeight: "bold" }}>
                    {/* ADDED .eligibility HERE */}
                    {selectedJob.eligibility?.minCgpa || 0}+
                  </p>
                </div>
                <div>
                  <small style={{ color: "#64748b" }}>
                    Max Backlogs Allowed
                  </small>
                  <p style={{ margin: "0", fontWeight: "bold" }}>
                    {/* ADDED .eligibility HERE */}
                    {selectedJob.eligibility?.maxBacklogs || 0}
                  </p>
                </div>
                <div>
                  <small style={{ color: "#64748b" }}>
                    Application Deadline
                  </small>
                  <p
                    style={{
                      margin: "0",
                      fontWeight: "bold",
                      color: "#ef4444",
                    }}
                  >
                    {new Date(selectedJob.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Committee Contact Information */}
              <div
                style={{
                  borderLeft: "4px solid #3b82f6",
                  paddingLeft: "15px",
                  marginBottom: "20px",
                }}
              >
                <h4 style={{ margin: "0 0 5px 0" }}>Placement Coordinator</h4>
                <p style={{ margin: "0", fontSize: "14px", color: "#475569" }}>
                  {/* CHANGED postedBy to createdBy HERE */}
                  <strong>
                    {selectedJob.createdBy?.fullName || "Committee Member"}
                  </strong>
                  <br />
                  Email: {selectedJob.createdBy?.email || "N/A"}
                  <br />
                  {selectedJob.createdBy?.phone &&
                    `Phone: ${selectedJob.createdBy.phone}`}
                </p>
              </div>
            </div>

            <div
              style={{
                marginTop: "20px",
                paddingTop: "15px",
                borderTop: "1px solid #e2e8f0",
              }}
            >
              <button
                className="btn-primary"
                style={{ width: "100%", padding: "12px", fontSize: "16px" }}
                onClick={handleApply}
                disabled={applying}
              >
                {applying ? "Submitting Application..." : "Apply for this Job"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobBoard;
