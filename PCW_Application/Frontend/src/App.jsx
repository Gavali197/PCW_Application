import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import Register from './pages/Register';

// 1. Import your actual dashboard components
import AdminDashboard from './pages/admin/AdminDashboard';
import CommitteeDashboard from './pages/committee/CommitteeDashboard';
import StudentDashboard from './pages/Student/StudentDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* NEW */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* ----------------- TIER 3: STUDENT ROUTES ----------------- */}
          <Route 
            path="/student-dashboard" 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['Student']}>
                  <StudentDashboard /> {/* Replaced the <div> placeholder */}
                </RoleRoute>
              </ProtectedRoute>
            } 
          />

          {/* ----------------- TIER 2: COMMITTEE ROUTES ----------------- */}
          <Route 
            path="/committee-dashboard" 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['Committee', 'SuperAdmin']}>
                  <CommitteeDashboard /> {/* Replaced the <div> placeholder */}
                </RoleRoute>
              </ProtectedRoute>
            } 
          />

          {/* ----------------- TIER 1: SUPER ADMIN ROUTES ----------------- */}
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['SuperAdmin']}>
                  <AdminDashboard /> {/* Replaced the <div> placeholder */}
                </RoleRoute>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;