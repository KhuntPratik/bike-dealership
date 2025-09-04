import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Role-based access control hook
export const useRoleAccess = (requiredRoles = []) => {
  const { user, hasAnyRole, isAuthenticated } = useAuth();
  
  // Filter to only valid roles (Customer and Admin)
  const validRoles = ["Customer", "Admin"];
  const filteredRequiredRoles = requiredRoles.filter(role => validRoles.includes(role));
  
  const hasAccess = () => {
    if (!isAuthenticated()) return false;
    if (filteredRequiredRoles.length === 0) return true;
    return hasAnyRole(filteredRequiredRoles);
  };
  
  return {
    hasAccess: hasAccess(),
    user,
    isAuthenticated: isAuthenticated()
  };
};

// Admin-only hook
export const useAdminAccess = () => {
  const { isAdmin, user } = useAuth();
  return { isAdmin: isAdmin(), user };
};

// Customer-only hook
export const useCustomerAccess = () => {
  const { isCustomer, user } = useAuth();
  return { isCustomer: isCustomer(), user };
};
