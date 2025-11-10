// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { token, role, userInfo }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    const savedUserInfo = localStorage.getItem("userInfo");
    
    if (savedToken && savedRole) {
      try {
        const userInfo = savedUserInfo ? JSON.parse(savedUserInfo) : {};
        setUser({ token: savedToken, role: savedRole, userInfo });
      } catch (error) {
        console.error("Error parsing saved user info:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userInfo");
      }
    }
    setLoading(false);
  }, []);

  // Safe Base64URL decoder (handles '-' '_' and padding)
  const base64UrlDecode = (base64UrlString) => {
    try {
      let base64 = base64UrlString.replace(/-/g, "+").replace(/_/g, "/");
      const paddingNeeded = 4 - (base64.length % 4);
      if (paddingNeeded > 0 && paddingNeeded < 4) {
        base64 += "=".repeat(paddingNeeded);
      }
      const json = atob(base64);
      return json;
    } catch (e) {
      console.error("Failed to decode base64url payload", e);
      throw new Error("Invalid token encoding");
    }
  };

  const parseJwtPayload = (token) => {
    try {
      const payloadSegment = token.split(".")[1];
      if (!payloadSegment) throw new Error("Invalid token format");
      const json = base64UrlDecode(payloadSegment);
      return JSON.parse(json);
    } catch (e) {
      console.error("Failed to parse JWT payload", e);
      throw new Error("Invalid token payload");
    }
  };

  const extractRole = (payload, providedRole) => {
    if (providedRole) return providedRole;

    const roleClaimKeys = [
      "role",
      "roles",
      "Role",
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"
    ];

    let rawRole = undefined;
    for (const key of roleClaimKeys) {
      if (payload && Object.prototype.hasOwnProperty.call(payload, key)) {
        rawRole = payload[key];
        break;
      }
    }

    if (Array.isArray(rawRole)) rawRole = rawRole[0];

    if (typeof rawRole === "string") {
      const lower = rawRole.toLowerCase();
      if (lower === "admin") return "Admin";
      if (lower === "customer") return "Customer";
    }

    return undefined;
  };

  const extractUsername = (payload) => {
    const nameKeys = [
      "username",
      "unique_name",
      "name",
      "given_name",
      "sub",
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
    ];
    for (const key of nameKeys) {
      if (payload && payload[key]) return payload[key];
    }
    return undefined;
  };

  const login = (token, role) => {
    try {
      const payload = parseJwtPayload(token);
      let userRole = extractRole(payload, role);

      if (!userRole) {
        throw new Error("Role not found in token");
      }

      // Normalize role to proper case
      const normalizedRole = userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase();
      const validRoles = ["Customer", "Admin"];
      if (!validRoles.includes(normalizedRole)) {
        throw new Error(`Invalid role: ${userRole}. Only Customer and Admin roles are supported.`);
      }
      userRole = normalizedRole; // Use normalized version

      const userInfo = {
        username: extractUsername(payload) || "User",
        email: payload?.email,
        userId: payload?.userId || payload?.sub,
        role: userRole,
        ...payload
      };

      localStorage.setItem("token", token);
      localStorage.setItem("role", userRole);
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      setUser({ token, role: userRole, userInfo });
      console.log("✅ User logged in successfully:", { role: userRole, userInfo });
    } catch (error) {
      console.error("Error during login:", error);
      throw new Error("Failed to process login token");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userInfo");
    setUser(null);
    console.log("✅ User logged out successfully");
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    const validRoles = ["Customer", "Admin"];
    return validRoles.includes(requiredRole) && user.role === requiredRole;
  };

  const hasAnyRole = (requiredRoles) => {
    if (!user) return false;
    const validRoles = ["Customer", "Admin"];
    const filteredRoles = requiredRoles.filter(role => validRoles.includes(role));
    return filteredRoles.some(role => user.role === role);
  };

  const isAdmin = () => hasRole("Admin");
  const isCustomer = () => hasRole("Customer");
  const isAuthenticated = () => !!user;

  const getUserInfo = () => user?.userInfo || {};
  const getRole = () => user?.role || null;
  const getToken = () => user?.token || null;

  const value = {
    user,
    loading,
    login,
    logout,
    hasRole,
    hasAnyRole,
    isAdmin,
    isCustomer,
    isAuthenticated,
    getUserInfo,
    getRole,
    getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
