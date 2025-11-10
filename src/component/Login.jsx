import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Send raw password; backend will hash it
      const res = await axios.post(
        "http://localhost:5275/api/User/login",
        {
          Username: username.trim(),
          Password: password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const { token, user } = res.data;
      if (!token || !user) {
        throw new Error("Invalid response from server");
      }
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      login(token, user.role);
      if (user.role.toLowerCase() === "admin") {
        navigate("/admin");
      } else if (user.role.toLowerCase() === "customer") {
        navigate("/product");
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data ?? err);
      if (err.response?.status === 401) {
        setError("Unauthorized: Incorrect username or password");
      } else {
        setError("Login failed. Check console / backend logs.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center px-3 mt-5"
      style={{
        background:
          "linear-gradient(135deg, rgba(220,53,69,0.08) 0%, rgba(108,117,125,0.08) 100%)",
      }}
    >
      <div className="container" style={{ maxWidth: "440px" }}>
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="p-4 p-md-5 bg-white">
            {/* Header Section */}
            <div className="text-center mb-4">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ 
                  width: 64, 
                  height: 64, 
                  background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)" 
                }}
                aria-hidden="true"
              >
                <i 
                  className="fas fa-motorcycle" 
                  style={{ color: "#ffffff", fontSize: 24 }}
                ></i>
              </div>
              <h2 className="h3 fw-bold mb-1" style={{ color: "#dc3545" }}>
                Welcome back
              </h2>
              <p className="text-muted mb-0">Sign in to continue your journey</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control border-2"
                  id="loginUsername"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="username"
                  style={{ borderColor: "#dee2e6" }}
                />
                <label htmlFor="loginUsername" style={{ color: "#6c757d" }}>
                  Username
                </label>
              </div>

              <div className="form-floating mb-4">
                <input
                  type="password"
                  className="form-control border-2"
                  id="loginPassword"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                  style={{ borderColor: "#dee2e6" }}
                />
                <label htmlFor="loginPassword" style={{ color: "#6c757d" }}>
                  Password
                </label>
              </div>

              <button
                type="submit"
                className="btn w-100 py-3 fw-bold text-white border-0"
                disabled={loading}
                style={{
                  background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.target.style.background = "linear-gradient(135deg, #c82333 0%, #a71e2a 100%)";
                    e.target.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading) {
                    e.target.style.background = "linear-gradient(135deg, #dc3545 0%, #c82333 100%)";
                    e.target.style.transform = "translateY(0)";
                  }
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div 
                className="alert border-0 mt-3 text-center"
                style={{
                  background: "linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)",
                  color: "#721c24",
                  borderLeft: "4px solid #dc3545",
                  borderRadius: "8px"
                }}
                role="alert"
              >
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            {/* Register Link */}
            <div className="text-center mt-4 pt-3 border-top">
              <span className="text-muted">Don't have an account? </span>
              <a 
                href="/register" 
                className="text-decoration-none fw-semibold"
                style={{ color: "#dc3545" }}
                onMouseOver={(e) => e.target.style.color = "#c82333"}
                onMouseOut={(e) => e.target.style.color = "#dc3545"}
              >
                Create one now
              </a>
            </div>

            {/* Additional Features */}
            <div className="row text-center mt-4">
              <div className="col-12">
                <small className="text-muted">
                  <i className="fas fa-shield-alt me-1" style={{ color: "#dc3545" }}></i>
                  Your data is securely encrypted
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .form-control:focus {
          border-color: #dc3545 !important;
          box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
        }
        
        .form-floating label {
          transition: all 0.3s ease;
        }
        
        .form-floating > .form-control:focus ~ label,
        .form-floating > .form-control:not(:placeholder-shown) ~ label {
          color: #dc3545 !important;
        }
      `}</style>
    </div>
  );
};

export default Login;