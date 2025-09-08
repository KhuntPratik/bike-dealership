import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function BookingDetails() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch booking details
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get(`http://localhost:5275/api/Booking/${id}`)
      .then((res) => {
        setBooking(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching booking:", err);
        setLoading(false);
      });
  }, [id]);

  // Send WhatsApp message
  const sendWhatsAppMessage = (phoneNumber, message) => {
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, "");
    const formattedPhoneNumber = cleanPhoneNumber.startsWith("91")
      ? cleanPhoneNumber
      : `91${cleanPhoneNumber}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${formattedPhoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  // Accept booking
  const handleAccept = async () => {
    try {
      await axios.put(
        `http://localhost:5275/api/Booking/UpdateBooking/${booking.bookingId}`,
        { status: true },
        { headers: { "Content-Type": "application/json" } }
      );

      setBooking((prev) => ({
        ...prev,
        Status: true,
      }));

      const message = `🎉 Congratulations! Your bike rental booking has been *APPROVED*!

📋 Booking Details:
• Booking ID: #${booking.bookingId}
• Bike: ${booking.bikeName}
• Customer: ${booking.userName}
• Date: ${new Date(booking.bookingDate).toLocaleDateString()}

✅ Your booking is now confirmed and ready for pickup!

For any queries, please contact us.
Thank you for choosing our service! 🏍️`;

      sendWhatsAppMessage(booking.userPhone, message);
      alert("Booking accepted! WhatsApp message sent to customer.");
    } catch (err) {
      console.error(err);
      alert("Failed to accept booking");
    }
  };

  // Decline booking
  const handleDecline = async () => {
    try {
      await axios.put(
        `http://localhost:5275/api/Booking/UpdateBooking/${booking.bookingId}`,
        { status: false },
        { headers: { "Content-Type": "application/json" } }
      );

      setBooking((prev) => ({ ...prev, Status: false }));

      const message = `❌ We regret to inform you that your bike rental booking has been *DECLINED*.

📋 Booking Details:
• Booking ID: #${booking.bookingId}
• Bike: ${booking.bikeName}
• Customer: ${booking.userName}
• Date: ${new Date(booking.bookingDate).toLocaleDateString()}

We apologize for any inconvenience caused. Please feel free to contact us for more information or to make a new booking.

Thank you for your understanding. 🏍️`;

      sendWhatsAppMessage(booking.userPhone, message);
      alert("Booking declined! WhatsApp message sent to customer.");
    } catch (err) {
      console.error(err);
      alert("Failed to decline booking");
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "400px" }}
        >
          <div className="text-center">
            <div
              className="spinner-border text-primary mb-3"
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="text-muted">Loading booking details...</h5>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center" role="alert">
          <div className="mb-3" style={{ fontSize: "2rem" }}>
            ⚠️
          </div>
          <h4>Booking Not Found</h4>
          <p>Sorry, we couldn't find the booking details you're looking for.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex align-items-center mb-3">
            <div
              className="bg-primary rounded-circle p-3 me-3 mt-5 d-flex align-items-center justify-content-center"
              style={{ width: "60px", height: "60px" }}
            >
              <span className="text-white" style={{ fontSize: "1.5rem" }}>
                📋
              </span>
            </div>
            <div>
              <h2 className="mb-1 fw-bold text-dark mt-5">Booking Details</h2>
              <p className="text-muted mb-0">
                Complete booking information and customer details
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Main Details */}
        <div className="col-lg-8">
          {/* Booking Info */}
          <div className="card shadow rounded-4 mb-4" style={{ border: "1px solid #eef2f7" }}>
            <div className="card-header bg-white text-dark border-0 rounded-top-4 border-bottom">
              <div className="d-flex align-items-center">
                <span className="me-2" style={{ fontSize: "1.2rem" }}>
                  ℹ️
                </span>
                <h5 className="mb-0 fw-semibold">Booking Information</h5>
              </div>
            </div>
            <div className="card-body p-4">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-center p-3 bg-light rounded-3">
                    <div
                      className="bg-primary bg-opacity-10 rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <span
                        className="text-primary"
                        style={{ fontSize: "1.1rem" }}
                      >
                        #
                      </span>
                    </div>
                    <div>
                      <small className="text-muted d-block">Booking ID</small>
                      <strong className="text-dark">
                        #{booking.bookingId}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex align-items-center p-3 bg-light rounded-3">
                    <div
                      className="bg-success bg-opacity-10 rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <span
                        className="text-success"
                        style={{ fontSize: "1.1rem" }}
                      >
                        📅
                      </span>
                    </div>
                    <div>
                      <small className="text-muted d-block">Booking Date</small>
                      <strong className="text-dark">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Bike */}
          <div className="card shadow rounded-4 mb-4" style={{ border: "1px solid #eef2f7" }}>
            <div className="card-header bg-white text-dark border-0 rounded-top-4 border-bottom">
              <div className="d-flex align-items-center">
                <span className="me-2" style={{ fontSize: "1.2rem" }}>
                  👤
                </span>
                <h5 className="mb-0 fw-semibold">Customer & Bike Details</h5>
              </div>
            </div>
            <div className="card-body p-4">
              <div className="row g-4">
                {/* Customer Name */}
                <div className="col-md-6">
                  <div className="d-flex align-items-center p-3 bg-light rounded-3">
                    <div
                      className="bg-info bg-opacity-10 rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <span className="text-info" style={{ fontSize: "1.1rem" }}>
                        👤
                      </span>
                    </div>
                    <div>
                      <small className="text-muted d-block">Customer Name</small>
                      <strong className="text-dark">{booking.userName}</strong>
                    </div>
                  </div>

                  <div className="d-flex align-items-center p-3 bg-light rounded-3">
                    <div
                      className="bg-warning bg-opacity-10 rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <span
                        className="text-warning"
                        style={{ fontSize: "1.1rem" }}
                      >
                        💱
                      </span>
                    </div>
                    <div>
                      <small className="text-muted d-block">
                        Amount UTR Number
                      </small>
                      <strong className="text-dark">{booking.utrNumber}</strong>
                    </div>
                  </div>
                </div>

                {/* Bike Name */}
                <div className="col-md-6">
                  <div className="d-flex align-items-center p-3 bg-light rounded-3">
                    <div
                      className="bg-warning bg-opacity-10 rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <span
                        className="text-warning"
                        style={{ fontSize: "1.1rem" }}
                      >
                        🏍️
                      </span>
                    </div>
                    <div>
                      <small className="text-muted d-block">Bike Model</small>
                      <strong className="text-dark">{booking.bikeName}</strong>
                    </div>
                  </div>

                  <div className="d-flex align-items-center p-3 bg-light rounded-3">
                    <div
                      className="bg-warning bg-opacity-10 rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <span
                        className="text-warning"
                        style={{ fontSize: "1.1rem" }}
                      >
                        📱
                      </span>
                    </div>
                    <div>
                      <small className="text-muted d-block">
                        User Phone Number
                      </small>
                      <strong className="text-dark">{booking.userPhone}</strong>
                    </div>
                  </div>
                </div>
              </div>

               {/* Uploaded Documents */}
          <div className="card shadow rounded-4 mb-4" style={{ border: "1px solid #eef2f7" }}>
            <div className="card-header bg-white text-dark border-0 rounded-top-4 border-bottom">
              <div className="d-flex align-items-center">
                <span className="me-2" style={{ fontSize: "1.2rem" }}>📎</span>
                <h5 className="mb-0 fw-semibold">Uploaded Documents</h5>
              </div>
            </div>
            <div className="card-body p-4">
              <div className="row g-4">
                {/* Aadhaar Card */}
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3 h-100">
                    <small className="text-muted d-block mb-2">Aadhaar Card</small>
                    {booking.aadharCardPhoto ? (
                      <a
                        href={`http://localhost:5275/${booking.aadharCardPhoto}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={`http://localhost:5275/${booking.aadharCardPhoto}`}
                          alt="Aadhaar Card"
                          className="img-fluid rounded"
                          style={{ maxHeight: "260px", objectFit: "contain", background: "#fff" }}
                        />
                      </a>
                    ) : (
                      <span className="text-muted">Not uploaded</span>
                    )}
                  </div>
                </div>

                {/* Payment Screenshot */}
                {/* Payment Screenshot */}
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3 h-100">
                    <small className="text-muted d-block mb-2">Payment Screenshot</small>
                    {booking.paymentSS ? (
                      <a
                        href={`http://localhost:5275/${booking.paymentSS}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={`http://localhost:5275/${booking.paymentSS}`}
                          alt="Payment Screenshot"
                          className="img-fluid rounded"
                          style={{ maxHeight: "260px", objectFit: "contain", background: "#fff" }}
                        />
                      </a>
                    ) : (
                      <span className="text-muted">Not uploaded</span>
                    )}
                  </div>
                </div>


              </div>
            </div>
          </div>

              {/* Accept & Decline Buttons */}
              <div className="d-flex justify-content-end mt-4 gap-2">
                <button className="btn btn-success" onClick={handleAccept}>
                  <span className="me-2">✅</span>Accept & Send WhatsApp
                </button>
                <button className="btn btn-danger" onClick={handleDecline}>
                  <span className="me-2">❌</span>Decline & Send WhatsApp
                </button>
              </div>
            </div>
          </div>

         
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          <div className="card shadow rounded-4 mb-4" style={{ border: "1px solid #eef2f7" }}>
            <div className="card-header bg-white text-dark border-0 rounded-top-4 border-bottom">
              <div className="d-flex align-items-center">
                <span className="me-2" style={{ fontSize: "1.2rem" }}>
                  {booking.Status ? "✅" : "⏳"}
                </span>
                <h6 className="mb-0 fw-semibold">Booking Status</h6>
              </div>
            </div>
            <div className="card-body p-4 text-center">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: booking.Status
                    ? "rgba(40, 167, 69, 0.1)"
                    : "rgba(255, 193, 7, 0.1)",
                }}
              >
                <span
                  style={{
                    fontSize: "2rem",
                    color: booking.Status ? "#28a745" : "#ffc107",
                  }}
                >
                  {booking.Status ? "✅" : "⏳"}
                </span>
              </div>
              <h6
                className={`fw-bold mb-2 ${booking.Status ? "text-success" : "text-warning"
                  }`}
              >
                {booking.Status ? "Accepted" : "Pending"}
              </h6>
              <p className="text-muted small mb-0">
                {booking.Status
                  ? "Your booking has been accepted."
                  : "Booking is pending approval."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingDetails;
