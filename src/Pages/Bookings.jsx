import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "../all.css";

const Bookings = () => {
  const { getToken, getUserInfo, isAdmin } = useContext(AuthContext);
  const token = getToken();
  const user = getUserInfo();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const endpoints = useMemo(() => [
    "http://localhost:5275/api/Bookings",
    "http://localhost:5275/api/Booking",
    "http://localhost:5275/api/Bookings/user",
    "http://localhost:5275/api/Booking/user",
  ], []);

  const normalizeArray = (data) => {
    if (Array.isArray(data)) return data;
    if (!data || typeof data !== "object") return [];
    if (Array.isArray(data.items)) return data.items;
    return [data];
  };

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      let lastErr = null;
      let result = [];
      for (const url of endpoints) {
        try {
          const res = await fetch(url, {
            headers: {
              Accept: "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          result = normalizeArray(data);
          lastErr = null;
          break;
        } catch (e) {
          lastErr = e;
          continue;
        }
      }
      if (lastErr) throw lastErr;

      // If not admin, filter to user's bookings heuristically
      const userId = user?.userId || user?.id;
      const username = user?.username || user?.fullName;
      const filtered = isAdmin() ? result : result.filter((b) => {
        return (
          (b.userId && userId && (b.userId === userId || String(b.userId) === String(userId))) ||
          (b.username && username && b.username === username) ||
          (b.customerName && username && b.customerName === username)
        );
      });

      setBookings(filtered);
    } catch (err) {
      console.error("Bookings fetch error:", err);
      setError(typeof err.message === "string" ? err.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatCurrency = (num) => {
    if (num === undefined || num === null || Number.isNaN(Number(num))) return "-";
    try {
      return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(num));
    } catch {
      return `₹${num}`;
    }
  };

  return (
    <section className="py-5 mt-5">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h3 className="m-0"><i className="fas fa-calendar-check me-2"></i>{isAdmin() ? "All Bookings" : "My Bookings"}</h3>
            <small className="text-muted">View recent reservations and their status</small>
          </div>
          <div>
            <button className="btn btn-outline-secondary" onClick={fetchBookings} disabled={loading}>
              <i className="fas fa-sync-alt me-2"></i>{loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card table-card">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Bike</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                {!loading && bookings.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">No bookings found</td>
                  </tr>
                )}
                {bookings.map((b, idx) => {
                  const id = b.bookingId || b.id || idx + 1;
                  const bikeName = b.bikeName || b.bike?.bikeName || b.itemName || "-";
                  const customer = b.customerName || b.username || b.userName || b.user?.fullName || "-";
                  const rawDate = b.date || b.bookingDate || b.bookedAt || b.createdAt || null;
                  const dateStr = rawDate ? new Date(rawDate).toLocaleString() : "-";
                  const status = (b.status || "").toString() || "-";
                  const amount = b.amount || b.total || b.price || b.totalAmount || undefined;

                  return (
                    <tr key={`${id}-${idx}`}>
                      <td>{id}</td>
                      <td>{bikeName}</td>
                      <td>{customer}</td>
                      <td>{dateStr}</td>
                      <td>
                        <span className="chip">{status}</span>
                      </td>
                      <td className="text-end">{formatCurrency(amount)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Bookings;
