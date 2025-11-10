import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../all.css";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",           // ⬅️ Added Email
    phoneNumber: "",
    dateOfBirth: "",
    gender: "Male",
    password: "",
    role: "Customer",    // Default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const extractServerError = (err) => {
    const status = err.response?.status;
    const data = err.response?.data;
    if (!data) return `Request failed${status ? ` (HTTP ${status})` : ""}.`;
    if (typeof data === "string") return data;
    if (data?.message) return data.message;
    if (data?.title) return data.title;
    if (data?.errors && typeof data.errors === "object") {
      const messages = [];
      for (const key of Object.keys(data.errors)) {
        const arr = data.errors[key];
        if (Array.isArray(arr)) messages.push(...arr);
      }
      if (messages.length) return messages.join(" \n");
    }
    try {
      return JSON.stringify(data);
    } catch {
      return "Unknown server error";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,                // ⬅️ Added email to payload
        phoneNumber: form.phoneNumber,
        password: form.password,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        role: form.role,
      };

      const endpoints = [
        { url: "http://localhost:5275/api/User", type: "json" },
        { url: "http://localhost:5275/api/User/register", type: "json" },
        { url: "http://localhost:5275/api/User/Register", type: "json" },
        { url: "http://localhost:5275/api/User/register", type: "form" },
      ];

      let lastErr = null;
      for (const attempt of endpoints) {
        try {
          if (attempt.type === "json") {
            await axios.post(attempt.url, payload, {
              headers: { "Content-Type": "application/json" },
            });
          } else if (attempt.type === "form") {
            const formData = new URLSearchParams();
            Object.entries(payload).forEach(([k, v]) =>
              formData.append(k, v)
            );
            await axios.post(attempt.url, formData.toString(), {
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });
          }
          lastErr = null;
          break;
        } catch (err) {
          lastErr = err;
          const code = err.response?.status;
          if (![404, 405, 415, 500].includes(code)) break;
        }
      }

      if (lastErr) throw lastErr;

      setSuccess("Registration successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      console.error("Registration error:", err);
      setError(extractServerError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center px-3 mt-5"
      style={{ 
        background:
          "linear-gradient(135deg, rgba(13,110,253,0.08) 0%, rgba(220,53,69,0.08) 100%)",
      }}
    >
      <div className="container mt-5 mb-5" style={{ maxWidth: "560px" }}>
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="p-4 p-md-5 bg-white">
            <div className="text-center mb-4">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: 64, height: 64, background: "#f3f6ff" }}
                aria-hidden="true"
              >
                <i className="fas fa-user-plus" style={{ color: "#0d6efd", fontSize: 24 }}></i>
              </div>
              <h2 className="h3 fw-bold mb-1">Create your account</h2>
              <p className="text-muted mb-0">Join and explore the best bike deals</p>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="alert alert-danger" style={{ whiteSpace: "pre-line" }}>
                  {error}
                </div>
              )}
              {success && <div className="alert alert-success">{success}</div>}

              <div className="form-floating mb-3">
                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  id="regFullName"
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />
                <label htmlFor="regFullName">Full Name</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  id="regEmail"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
                <label htmlFor="regEmail">Email</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="tel"
                  name="phoneNumber"
                  className="form-control"
                  id="regPhone"
                  placeholder="Phone Number"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  required
                  autoComplete="tel"
                />
                <label htmlFor="regPhone">Phone Number</label>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-floating mb-3 mb-md-0">
                    <input
                      type="date"
                      name="dateOfBirth"
                      className="form-control"
                      id="regDob"
                      placeholder="Date of Birth"
                      value={form.dateOfBirth}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="regDob">Date of Birth</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label d-block">Gender</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender"
                          id="genderMale"
                          value="Male"
                          checked={form.gender === "Male"}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="genderMale">Male</label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender"
                          id="genderFemale"
                          value="Female"
                          checked={form.gender === "Female"}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="genderFemale">Female</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  id="regPassword"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
                <label htmlFor="regPassword">Password</label>
              </div>

              <input type="hidden" name="role" value={form.role} readOnly />

              <button
                type="submit"
                className="btn w-100 py-2 fw-semibold"
                disabled={loading}
                style={{
                  background: "linear-gradient(135deg, #0d6efd 0%, #6f42c1 100%)",
                  color: "#fff",
                  border: 0,
                  borderRadius: 12,
                }}
              >
                {loading ? "Registering..." : "Create Account"}
              </button>

              <div className="text-center mt-4">
                <span className="text-muted">Already have an account? </span>
                <a href="/login" className="text-decoration-none">Sign in</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
