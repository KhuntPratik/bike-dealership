import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "../all.css";

const Profile = () => {
  const { getUserInfo, getRole, getToken } = useContext(AuthContext);
  const jwtUser = getUserInfo();
  const role = getRole();
  const token = getToken();

  const [apiUser, setApiUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUser = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5275/api/User", {
        headers: {
          "Accept": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      const data = await res.json();

      let selected = data;
      // If API returns an array, try to pick current user by id/username/email
      if (Array.isArray(data)) {
        const candidate =
          data.find((u) =>
            jwtUser?.userId && (u.id === jwtUser.userId || u.userId === jwtUser.userId)
          ) ||
          data.find((u) => jwtUser?.username && (u.username === jwtUser.username || u.fullName === jwtUser.username)) ||
          data[0];
        selected = candidate || null;
      }
      setApiUser(selected);
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError(typeof err.message === "string" ? err.message : "Failed to load user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const display = apiUser || {};

  return (
    <section className="py-5 mt-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm p-4 profile-card">
              <div className="d-flex align-items-center mb-4">
                <div className="avatar-initial me-3" style={{ width: 48, height: 48, fontSize: "1.1rem" }}>
                  {(jwtUser.username || "U").toString().charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="mb-0">{display.fullName || jwtUser.username || display.username || "User"}</h4>
                  <small className="text-muted">Role: {role || display.role || "-"}</small>
                </div>
                <div className="ms-auto">
                  <button className="btn btn-outline-secondary btn-sm" onClick={fetchUser} disabled={loading}>
                    <i className="fas fa-sync-alt me-2"></i>{loading ? "Refreshing..." : "Refresh"}
                  </button>
                </div>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name</label>
                  <input className="form-control" value={display.fullName || jwtUser.username || ""} readOnly />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input className="form-control" value={display.email || jwtUser.email || ""} readOnly />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone Number</label>
                  <input className="form-control" value={display.phoneNumber || ""} readOnly />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Date of Birth</label>
                  <input className="form-control" value={display.dateOfBirth || ""} readOnly />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Gender</label>
                  <input className="form-control" value={display.gender || ""} readOnly />
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
