import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CalendarToday } from "@mui/icons-material";
import { faMotorcycle } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { faTag } from "@fortawesome/free-solid-svg-icons";

import "../all.css";

export default function MyBookings() {
  const navigate = useNavigate();
  const { getUserInfo, getToken } = useContext(AuthContext);
  const jwtUser = getUserInfo();
  const token = getToken();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = jwtUser?.userId || storedUser?.userId;

  useEffect(() => {
    if (!userId) {
      console.error("❌ No userId found!");
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await fetch(`http://localhost:5275/api/Booking/user/${userId}`, {
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error(`Failed to fetch bookings (HTTP ${res.status})`);
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId, token]);

const getStatusBadge = (status) => {
  const isConfirmed = status === true || status === "true";

  return (
    <span
      className="badge px-3 py-2"
      style={{
        background: isConfirmed ? "#28a745" : "#ffc107",
        color: "white",
        borderRadius: "20px",
        fontSize: "0.85rem",
        fontWeight: "600",
        boxShadow: isConfirmed
          ? "0 2px 8px rgba(40, 167, 69, 0.4)"
          : "0 2px 8px rgba(255, 193, 7, 0.4)",
      }}
    >
      <i
        className={`fas ${isConfirmed ? "fa-check-circle" : "fa-clock"} me-1`}
      ></i>
      {isConfirmed ? "Confirmed" : "Pending"}
    </span>
  );
};


  if (loading) {
    return (
      <div className="container py-5 mt-5">
        <div className="text-center py-5">
          <div
            className="spinner-border mx-auto"
            role="status"
            style={{ width: "3rem", height: "3rem", color: "#dc3545" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-4 fw-semibold text-muted">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="container py-5 mt-5">
        <div className="text-center py-5">
          <div
            className="card border-0 shadow-sm mx-auto"
            style={{ maxWidth: "500px", borderRadius: "20px" }}
          >
            <div className="card-body p-5">
              <div
                className="rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center"
                style={{
                  width: "120px",
                  height: "120px",
                  background: "#dc3545",
                  opacity: 0.1,
                }}
              >
                <i className="fas fa-calendar-check fa-4x" style={{ color: "#dc3545" }}></i>
              </div>
              <h4 className="fw-bold mb-3" style={{ color: "#2d3748" }}>
                No Bookings Found
              </h4>
              <p className="text-muted mb-4">
                You haven't made any bookings yet. Start exploring our amazing bike collection!
              </p>
              <button
                className="btn px-4 py-2 fw-semibold"
                onClick={() => navigate("/product")}
                style={{
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 4px 15px rgba(220, 53, 69, 0.4)",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.background = "#c82333";
                  e.target.style.boxShadow = "0 6px 20px rgba(220, 53, 69, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.background = "#dc3545";
                  e.target.style.boxShadow = "0 4px 15px rgba(220, 53, 69, 0.4)";
                }}
              >
                <i className="fas fa-motorcycle me-2"></i>Browse Bikes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-5">
      {/* Header Section */}
      <div className="mb-5">
        <div className="d-flex align-items-center mb-3">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center me-3"
            style={{
              width: "60px",
              height: "60px",
              background: "#dc3545",
              boxShadow: "0 4px 15px rgba(220, 53, 69, 0.4)",
            }}
          >
            <i className="fas fa-calendar-alt text-white fa-lg"></i>
          </div>
          <div>
            <h2 className="mb-0 fw-bold" style={{ color: "#2d3748" }}>
              My Bookings
            </h2>
            <p className="text-muted mb-0">Manage and view all your bike rental bookings</p>
          </div>
        </div>
      </div>

      {/* Bookings Grid */}
      <div className="row g-4">
        {bookings.map((booking) => (
          <div className="col-lg-4 col-md-6 col-sm-12" key={booking.bookingId}>
            <div
              className="card border-0 h-100"
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                background: "#fff",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
              }}
            >
              {/* Bike Image */}
              <div
                className="position-relative"
                style={{
                  height: "250px",
                  background: "#ffffff",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottom: "3px solid #dc3545",
                }}
              >
                <img
                  src={
                    booking.bikeImageUrl ||
                    (booking.imageUrl1
                      ? `http://localhost:5275/${booking.imageUrl1}`
                      : "https://via.placeholder.com/400x250?text=Bike+Image")
                  }
                  alt={booking.bikeName || "Bike"}
                  className="img-fluid"
                  style={{
                    height: "90%",
                    objectFit: "contain",
                    width: "auto",
                    transition: "transform 0.3s ease",
                  }}
                  onError={(e) => {
                    e.target.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjhGOUZBIi8+CjxwYXRoIGQ9Ik0xNzUgOTVIMjI1VjE1NUgxNzVWOTVaIiBmaWxsPSIjREREREREIi8+CjxwYXRoIGQ9Ik0xODUgMTA1SDIxNVYxNDVIMTg1VjEwNVoiIGZpbGw9IiNDQ0NDQ0MiLz4KPGNpcmNsZSBjeD0iMTk1IiBjeT0iMTI1IiByPSI1IiBmaWxsPSIjRkZGRkZGIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTgwIiBmaWxsPSIjOTk5OTk5IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJJREUgSU1BR0U8L3RleHQ+Cjwvc3ZnPgo=";
                  }}
                />
                {/* Status Badge */}
                <div
                  className="position-absolute"
                  style={{ top: "15px", right: "15px" }}
                >
                  {getStatusBadge(booking.status)}
                </div>
              </div>

              {/* Card Body */}
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5
                    className="card-title fw-bold mb-0"
                    style={{
                      color: "#2d3748",
                      fontSize: "1.3rem",
                      flex: 1,
                    }}
                  >
                    {booking.bikeName || "Unknown Bike"}
                  </h5>
                </div>

                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "36px",
                        height: "36px",
                        background: "rgba(0,0,0,0.05)", // light gray background
                      }}
                    >
                      <CalendarToday sx={{ color: "#1a1a1a" }} fontSize="small" />
                    </div>
                    <div>
                      <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>
                        Booking ID
                      </small>
                      <span className="fw-semibold" style={{ color: "#2d3748" }}>
                        #{booking.bookingId}
                      </span>
                    </div>
                  </div>



                  <div className="d-flex align-items-center mb-2">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "36px",
                        height: "36px",
                        background: "rgba(0,0,0,0.05)",
                      }}
                    >
                    <FontAwesomeIcon icon={faMotorcycle} style={{ color: "#1a1a1a" }} />
                    </div>
                    <div>
                      <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>
                        Bike Number
                      </small>
                      <span className="fw-semibold" style={{ color: "#2d3748" }}>
                        {booking.bikeNumber || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-2">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "36px",
                        height: "36px",
                        background: "rgba(0,0,0,0.05)",
                      }}
                    >
                      <FontAwesomeIcon icon={faTag} style={{ color: "#1a1a1a" }} />

                    </div>
                    <div>
                      <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>
                        Price
                      </small>
                      <span
                        className="fw-bold"
                        style={{
                          fontSize: "1.1rem",
                        }}
                      >
                        ₹{booking.price?.toLocaleString("en-IN") || "0"}
                      </span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-2">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "36px",
                        height: "36px",
                        background: "rgba(0,0,0,0.05)",
                      }}
                    >
                      <FontAwesomeIcon icon={faCalendarDays} style={{ color: "#1a1a1a" }} />
                    </div>
                    <div>
                      <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>
                        Booking Date
                      </small>
                      <span className="fw-semibold" style={{ color: "#2d3748" }}>
                        {booking.bookingDate
                          ? new Date(booking.bookingDate).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "36px",
                        height: "36px",
                        background: "rgba(0,0,0,0.05)"
                      }}
                    >
                      <FontAwesomeIcon icon={faUser} style={{ color: "#2d3748" }} />
                    </div>
                    <div>
                      <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>
                        User
                      </small>
                      <span className="fw-semibold" style={{ color: "#2d3748" }}>
                        {booking.userName || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
