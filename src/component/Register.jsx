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
    <section id="contact" className="mt-5">
      <div className="container">
        <h2 className="text-center section-title text-white mb-5">Register</h2>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <form onSubmit={handleSubmit}>
              {error && (
                <div
                  className="alert alert-danger"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success">{success}</div>
              )}

              {/* Full Name */}
              <div className="mb-4">
                <label className="form-label text-white">
                  <i className="fas fa-user me-2"></i>Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="form-label text-white">
                  <i className="fas fa-envelope me-2"></i>Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="mb-4">
                <label className="form-label text-white">
                  <i className="fas fa-phone me-2"></i>Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  className="form-control"
                  placeholder="Phone Number"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Date of Birth */}
              <div className="mb-4">
                <label className="form-label text-white">
                  <i className="fas fa-calendar me-2"></i>Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  className="form-control"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Gender */}
              <div className="mb-4">
                <label className="form-label text-white">
                  <i className="fas fa-venus-mars me-2"></i>Gender
                </label>
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
                  <label
                    className="form-check-label text-white"
                    htmlFor="genderMale"
                  >
                    Male
                  </label>
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
                  <label
                    className="form-check-label text-white"
                    htmlFor="genderFemale"
                  >
                    Female
                  </label>
                </div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="form-label text-white">
                  <i className="fas fa-lock me-2"></i>Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Hidden fixed role */}
              <input type="hidden" name="role" value={form.role} readOnly />

              {/* Submit button */}
              <div className="d-flex justify-content-center mb-3">
                <button
                  type="submit"
                  className="btn btn-custom"
                  disabled={loading}
                >
                  {loading ? (
                    "Registering..."
                  ) : (
                    <>
                      <i className="fas fa-user-plus me-2"></i>Register
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <span className="text-white">Already have an account? </span>
                <a href="/login" className="text-warning fw-bold">
                  Login
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
