import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";

function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");


  const navigate = useNavigate();

  // ✅ Fetch all bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5275/api/Booking/BookingDetails?pageNumber=${pageNumber}&pageSize=3`
      );
      setBookings(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [pageNumber]);

  // ✅ DELETE booking function
  const handleDelete = async (bookingId) => {
    if (!window.confirm("Are you sure you want to decline and delete this booking?")) return;

    try {
      const res = await axios.delete(`http://localhost:5275/api/Booking/${bookingId}`);
      if (res.status === 200) {
        setAlertSeverity("success");
        setAlertMessage("❌ Booking declined and deleted successfully!");
        setAlertOpen(true);

        setBookings((prev) => prev.filter((b) => b.bookingId !== bookingId));

        setTimeout(() => navigate("/BookingManagement"), 1500);
      } else {
        setAlertSeverity("warning");
        setAlertMessage("⚠️ Failed to delete booking.");
        setAlertOpen(true);
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      setAlertSeverity("error");
      setAlertMessage("Error deleting booking. Check console for details.");
      setAlertOpen(true);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white mt-5">
          <h5 className="m-0">Bookings Management</h5>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-4">No bookings found</div>
          ) : (
            <div className="row">
              {bookings.map((b, i) => (
                <div className="col-md-4 mb-4" key={b.bookingId ?? i}>
                  <div className="card border-0 shadow-lg h-100 rounded-4 overflow-hidden">
                    {b.adharcardPhoto && (
                      <div className="position-relative">
                        <img
                          src={`http://localhost:5275/${b.adharcardPhoto}`}
                          alt="Aadhar"
                          className="img-fluid w-100"
                          style={{ maxHeight: "180px", objectFit: "cover" }}
                        />
                        <span className="badge bg-light text-dark position-absolute top-0 end-0 m-2 shadow-sm">
                          {b.bikeName}
                        </span>
                      </div>
                    )}

                    <div className="card-body">
                      <p className="mb-2">
                        <strong>Customer:</strong> {b.username}
                      </p>
                      <p className="mb-2">
                        <strong>Bike:</strong> {b.bikeName}
                      </p>
                      <p className="mb-2">
                        <strong>Date:</strong>{" "}
                        {new Date(b.bookingDate).toLocaleDateString()}
                      </p>

                      <span
                        className={`badge px-3 py-2 rounded-pill ${b.status === "Approved"
                            ? "bg-success"
                            : b.status === "Pending"
                              ? "bg-warning text-dark"
                              : "bg-danger"
                          }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <div className="card-footer bg-light border-0 d-flex flex-column">
                      <button
                        className="btn btn-outline-primary btn-sm mb-2 rounded-pill shadow-sm"
                        onClick={() => navigate(`/booking/${b.bookingId}`)}
                      >
                        View More
                      </button>

                      {/* ✅ Decline/Delete Button */}
                      <button
                        className="btn btn-outline-danger btn-sm rounded-pill shadow-sm"
                        onClick={() => handleDelete(b.bookingId)}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-center mt-3">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${pageNumber === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setPageNumber((p) => p - 1)}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${pageNumber === i + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPageNumber(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${pageNumber === totalPages ? "disabled" : ""
                  }`}
              >
                <button
                  className="page-link"
                  onClick={() => setPageNumber((p) => p + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
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
    </div>
  );
}

export default BookingManagement;
