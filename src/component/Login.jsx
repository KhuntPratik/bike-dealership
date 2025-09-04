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
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `http://localhost:5275/api/User/login?username=${form.username}&password=${form.password}`
      );

      const { token, user } = res.data;
      console.log("🔑 Token:", token);
      console.log("👤 Backend User:", user);

      // Save token and user info
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      login(token, user.role);

      if (user.role === "Admin") {
        navigate("/admin");
      } else if (user.role === "Customer") {
        navigate("/product");
      } else {
        throw new Error("Unknown role");
      }
    } catch (err) {
      console.error("❌ Login Error:", err);
      if (err.response?.status === 401) {
        setError("Invalid username or password");
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

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
