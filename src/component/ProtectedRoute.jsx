import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles, redirectTo = "/login" }) => {
  const { user, loading, isAuthenticated, hasAnyRole } = useContext(AuthContext);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles && allowedRoles.length > 0) {
    // Filter to only valid roles (Customer and Admin)
    const validRoles = ["Customer", "Admin"];
    const filteredAllowedRoles = allowedRoles.filter(role => validRoles.includes(role));
    
    if (filteredAllowedRoles.length === 0) {
      console.warn("No valid roles specified in allowedRoles");
      return <Navigate to="/login" replace />;
    }
    
    if (!hasAnyRole(filteredAllowedRoles)) {
      console.warn(`Access denied: User role '${user.role}' not in allowed roles: [${filteredAllowedRoles.join(', ')}]`);
      
      // Redirect based on user role
      if (user.role === "Admin") {
        return <Navigate to="/admin" replace />;
      } else if (user.role === "Customer") {
        return <Navigate to="/product" replace />;
      } else {
        return <Navigate to="/login" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;
