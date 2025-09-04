import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const base64UrlDecode = (base64UrlString) => {
    let base64 = base64UrlString.replace(/-/g, "+").replace(/_/g, "/");
    const paddingNeeded = 4 - (base64.length % 4);
    if (paddingNeeded > 0 && paddingNeeded < 4) {
      base64 += "=".repeat(paddingNeeded);
    }
    const json = atob(base64);
    return json;
  };

  const extractRoleFromPayload = (payload) => {
    const roleKeys = [
      "role",
      "roles",
      "Role",
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role",
      "userRole",
      "UserRole",
      "roleName",
      "RoleName"
    ];
    let rawRole;
    for (const key of roleKeys) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `http://localhost:5275/api/User/login?username=${form.username}&password=${form.password}`
      );

      const token = res.data.token;
      console.log("🔑 Token:", token);

      // Decode once here to decide navigation and pass role into context
      let roleForContext;
      try {
        const payloadSegment = token.split(".")[1];
        const json = base64UrlDecode(payloadSegment);
        const payload = JSON.parse(json);
        console.log("📝 JWT Payload:", payload);
        roleForContext = extractRoleFromPayload(payload);
      } catch (decodeErr) {
        console.warn("Failed to decode token locally for navigation", decodeErr);
      }

      // Let context handle parsing/validation (provide role if we found it)
      login(token, roleForContext);

      // Navigate by role we determined (fallback to context validation)
      if (roleForContext === "Admin") {
        navigate("/admin");
      } else if (roleForContext === "Customer") {
        navigate("/product");
      } else {
        // If we couldn't determine role here, rely on context; if it throws, catch below
        throw new Error("Role not found in token");
      }

    } catch (err) {
      console.error("❌ Login Error:", err);
      
      if (err.response?.status === 401) {
        setError("Invalid username or password");
      } else if (err.message?.toLowerCase().includes("role")) {
        setError("Authentication error: Invalid or missing user role. Check console for token payload.");
      } else if (err.response?.status >= 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login to Your Account</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="form-input"
            placeholder="Username"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="form-input"
            placeholder="Password"
            required
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          className="login-button"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
