import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../API/axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/users/login", { email, password });

      login(
        {
          id: response.data._id,
          email: response.data.email,
          role: response.data.role,
        },
        response.data.token,
      );

      if (response.data.role === "Student") navigate("/student-dashboard");
      else if (response.data.role === "Committee")
        navigate("/committee-dashboard");
      else if (response.data.role === "SuperAdmin")
        navigate("/admin-dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Placement System Login</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Login
          </button>
          <div
            style={{ marginTop: "15px", textAlign: "center", fontSize: "14px" }}
          >
            New student?{" "}
            <Link to="/register" style={{ color: "#0056b3" }}>
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
