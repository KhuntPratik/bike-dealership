import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function MyBookings() {
  const { getUserInfo, getToken } = useContext(AuthContext);
  const jwtUser = getUserInfo();
  const token = getToken();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Get username instead of userId
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const username =
    jwtUser?.fullName ||
    jwtUser?.username ||
    storedUser?.fullName ||
    storedUser?.username;

  useEffect(() => {
    if (!username) {
      console.error("❌ No username found in AuthContext or localStorage!");
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        // ✅ Encode username for URL (handles spaces like "jay patel")
        const encodedUsername = encodeURIComponent(username);

        const res = await fetch(
          `http://localhost:5275/api/Booking/user/${encodedUsername}`,
          {
            headers: {
              Accept: "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (!res.ok) throw new Error(`Failed to fetch bookings (HTTP ${res.status})`);

        const data = await res.json();
        console.log("✅ Fetched bookings:", data);
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [username, token]);

  if (loading) return <div className="text-center mt-5">Loading bookings...</div>;

  return (
   <div className="container my-5 mt-5">
  <h2 className="fw-bold text-dark text-center mb-5"style={{marginTop: "100px"}}>📑 My Bookings</h2>

  {bookings.length === 0 ? (
    <div className="alert alert-info text-center">No bookings found.</div>
  ) : (
    <div className="row g-4">
      {bookings.map((booking, index) => (
        <div className="col-md-6" key={index}>
          <div className="card border-0 shadow-lg rounded-4 h-100 p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold text-primary mb-0">{booking.bikeName}</h4>
              <span
                className={`badge px-3 py-2 ${
                  booking.status === "Completed" ? "bg-success" : "bg-warning"
                }`}
              >
                {booking.status}
              </span>
            </div>

            <ul className="list-unstyled text-muted mb-4">
              <li className="mb-2">
                <i className="bi bi-hash text-dark me-2"></i>
                <strong>ID:</strong> {booking.bookingId}
              </li>
              <li className="mb-2">
                <i className="bi bi-currency-rupee text-dark me-2"></i>
                <strong>Price:</strong> ₹{booking.price?.toLocaleString()}
              </li>
              <li className="mb-2">
                <i className="bi bi-calendar-date text-dark me-2"></i>
                <strong>Date:</strong>{" "}
                {new Date(booking.bookingDate).toLocaleDateString()}
              </li>
              <li className="mb-2">
                <i className="bi bi-person text-dark me-2"></i>
                <strong>User:</strong> {booking.userName}
              </li>
            </ul>

            <div className="text-end">
              <button className="btn btn-outline-primary btn-sm rounded-pill px-4">
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

  );
}

export default MyBookings;