import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          
          {/* We will build these protected dashboards next */}
          <Route path="/student-dashboard" element={<div>Student Area</div>} />
          <Route path="/committee-dashboard" element={<div>Committee Area</div>} />
          <Route path="/admin-dashboard" element={<div>Admin Area</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;