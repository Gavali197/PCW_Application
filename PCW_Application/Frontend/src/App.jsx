import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import ProtectedRoute from './Components/ProtectedRoute';
import RoleRoute from './Components/RoleRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Default redirect based on auth status can go here later */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* ----------------- TIER 3: STUDENT ROUTES ----------------- */}
          <Route 
            path="/student-dashboard" 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['Student']}>
                  <div>Welcome to the Student Dashboard</div>
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
                  <div>Welcome to the Committee Dashboard</div>
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
                  <div>Welcome to the Super Admin (HOD) Dashboard</div>
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