import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect unauthorized users to their appropriate dashboard or a 403 page
    if (user?.role === 'Student') return <Navigate to="/student-dashboard" replace />;
    if (user?.role === 'Committee') return <Navigate to="/committee-dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RoleRoute;