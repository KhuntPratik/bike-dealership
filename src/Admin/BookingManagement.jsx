import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function BookingManagement() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const navigate = useNavigate();

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
                                            <p className="mb-2"><strong>Customer:</strong> {b.username}</p>
                                            <p className="mb-2"><strong>Bike:</strong> {b.bikeName}</p>
                                            <p className="mb-2"><strong>Date:</strong> {new Date(b.bookingDate).toLocaleDateString()}</p>

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
                                                onClick={() => navigate(`/booking/${b.bookingId}`)} // ✅ must match your API key
                                            >
                                                View More
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
                                <button className="page-link" onClick={() => setPageNumber((p) => p - 1)}>
                                    Previous
                                </button>
                            </li>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <li key={i} className={`page-item ${pageNumber === i + 1 ? "active" : ""}`}>
                                    <button className="page-link" onClick={() => setPageNumber(i + 1)}>
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${pageNumber === totalPages ? "disabled" : ""}`}>
                                <button className="page-link" onClick={() => setPageNumber((p) => p + 1)}>
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
}

export default BookingManagement;
