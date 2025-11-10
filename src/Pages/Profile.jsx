import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "../all.css";
import { Alert, Snackbar } from "@mui/material";

const Profile = () => {
  const { getUserInfo, getRole, getToken } = useContext(AuthContext);
  const jwtUser = getUserInfo();
  const role = getRole();
  const token = getToken();

  const [apiUser, setApiUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
  });

    const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");


  const fetchUser = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5275/api/User", {
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      const data = await res.json();

      let selected = data;
      if (Array.isArray(data)) {
        const candidate =
          data.find(
            (u) =>
              (jwtUser?.userId && (u.id === jwtUser.userId || u.userId === jwtUser.userId)) ||
              (jwtUser?.username &&
                (u.username === jwtUser.username || u.fullName === jwtUser.username))
          ) || data[0];
        selected = candidate || null;
      }
      setApiUser(selected);
      if (selected) {
        setFormData({
          fullName: selected.fullName || "",
          email: selected.email || "",
          phoneNumber: selected.phoneNumber || "",
          dateOfBirth: selected.dateOfBirth || "",
          gender: selected.gender || "",
        });
      }
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`http://localhost:5275/api/User/${apiUser.id || apiUser.userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to update profile");
      }

      // ✅ Material UI alert instead of window.alert
      setAlertSeverity("success");
      setAlertMessage("✅ Profile updated successfully!");
      setAlertOpen(true);

      setEditMode(false);
      fetchUser();
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.message);
      setAlertSeverity("error");
      setAlertMessage(`❌ ${err.message}`);
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const display = apiUser || {};

  return (
    <section className="py-5 mt-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm p-4 profile-card">
              <div className="d-flex align-items-center mb-4">
                <div
                  className="avatar-initial me-3"
                  style={{ width: 48, height: 48, fontSize: "1.1rem" }}
                >
                  {(jwtUser.username || "U").toString().charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="mb-0">
                    {display.fullName || jwtUser.username || display.username || "User"}
                  </h4>
                  <small className="text-muted">Role: {role || display.role || "-"}</small>
                </div>
                <div className="ms-auto d-flex gap-2">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={fetchUser}
                    disabled={loading}
                  >
                    <i className="fas fa-sync-alt me-2"></i>
                    {loading ? "Refreshing..." : "Refresh"}
                  </button>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setEditMode(!editMode)}
                  >
                    <i className="fas fa-edit me-2"></i>
                    {editMode ? "Cancel" : "Edit"}
                  </button>
                </div>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              {!editMode ? (
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name</label>
                    <input className="form-control" value={display.fullName || ""} readOnly />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input className="form-control" value={display.email || ""} readOnly />
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
              ) : (
                <form onSubmit={handleUpdate}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name</label>
                      <input
                        className="form-control"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        className="form-control"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone Number</label>
                      <input
                        className="form-control"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Date of Birth</label>
                      <input
                        className="form-control"
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Gender</label>
                      <select
                        className="form-select"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="col-12 text-center">
                      <button
                        type="submit"
                        className="btn btn-success px-5"
                        disabled={loading}
                      >
                        <i className="fas fa-save me-2"></i>
                        {loading ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
       <Snackbar
        open={alertOpen}
        autoHideDuration={4000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity={alertSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </section>
  );
};

export default Profile;
