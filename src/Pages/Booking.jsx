import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { Alert, Snackbar } from "@mui/material";

function BookingPage() {
  const location = useLocation();
  const { bikeId } = location.state || {}; // ✅ bikeId from product page
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    UserId: "",
    BikeId: bikeId || "",
    AadharNumber: "",
    BookingDate: new Date().toISOString().slice(0, 10),
    Amount: 5000, // fixed
    PaymentMethod: "Online", // fixed
    UTRNumber: "",
  });

  const [bikeName, setBikeName] = useState("");
  const [AadharCard, setAadharCard] = useState(null);
  const [PaymentSS, setPaymentSS] = useState(null);


  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  // ✅ Get logged in user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      setFormData((prev) => ({
        ...prev,
        UserId: userObj.userId || "",
      }));
    }
  }, []);

  // ✅ Fetch bike name
  useEffect(() => {
    if (bikeId) {
      fetch(`http://localhost:5275/api/Bike/${bikeId}`)
        .then((res) => res.json())
        .then((data) => {
          setBikeName(data.bikeName || data.name || "");
          setFormData((prev) => ({
            ...prev,
            BikeId: data.bikeId || bikeId,
          }));
        })
        .catch((err) => console.error("Error fetching bike:", err));
    }
  }, [bikeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAadharCard(e.target.files[0]);
    }
  };

  const handlePaymentFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentSS(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookingData = new FormData();
    bookingData.append("UserId", Number(formData.UserId));
    bookingData.append("BikeId", Number(formData.BikeId));
    bookingData.append("AadharNumber", formData.AadharNumber);
    bookingData.append("BookingDate", formData.BookingDate);
    bookingData.append("Amount", formData.Amount);
    bookingData.append("PaymentMethod", formData.PaymentMethod);
    bookingData.append("UTRNumber", formData.UTRNumber);

    if (AadharCard) bookingData.append("AadharCardFile", AadharCard);
    if (PaymentSS) bookingData.append("PaymentSSfile", PaymentSS);

    try {
      const bookingRes = await fetch("http://localhost:5275/api/Booking/CreateBooking", {
        method: "POST",
        body: bookingData,
      });

      if (!bookingRes.ok) {
        const error = await bookingRes.json();
        setAlertSeverity("error");
        setAlertMessage("❌ Booking Failed: " + (error.message || "Something went wrong"));
        setAlertOpen(true);
        return;
      }

      // Success
      setAlertSeverity("success");
      setAlertMessage("✅ Booking Completed Successfully!");
      setAlertOpen(true);

      // Redirect after short delay
      setTimeout(() => navigate("/MyBookings"), 1500);
    } catch (error) {
      console.error("Error:", error);
      setAlertSeverity("error");
      setAlertMessage("⚠️ Error submitting booking");
      setAlertOpen(true);
    }
  };

  // ✅ UPI QR Code
  const upiId = "pratikkhunt43@okicici";
  const qrValue = `upi://pay?pa=${upiId}&pn=Maa%20Bhagvati%20Auto%20Point&am=5000&cu=INR&tn=Bike%20Booking`;

  return (
    <div className="container bg-light mt-5">
      <div className="card shadow-lg p-4">
        <h3 className="fw-bold mb-2 text-center">Complete Your Booking</h3>
        <p className="text-muted text-center mb-4">
          Fill in your details to reserve this bike and pay online
        </p>

        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* LEFT SIDE - BOOKING */}
            <div className="col-md-6 border-end">
              <h5 className="mb-3">Booking Details</h5>

              <div className="mb-3">
                <input
                  type="hidden"
                  name="UserId"
                  value={formData.UserId}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="hidden"
                  name="BikeId"
                  value={formData.BikeId}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* <div className="mb-3">
                <label className="form-label">Bike Name</label>
                <input
                  type="hideen"
                  value={bikeName}
                  readOnly
                  className="form-control bg-light fw-bold"
                />
              </div> */}

              <div className="mb-3">
                <label className="form-label">Booking Date</label>
                <input
                  type="date"
                  name="BookingDate"
                  value={formData.BookingDate}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Aadhar Number</label>
                <input
                  type="text"
                  name="AadharNumber"
                  value={formData.AadharNumber}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Aadhar Card Upload</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* RIGHT SIDE - PAYMENT */}
            <div className="col-md-6">
              <h5 className="mb-3">Payment Details</h5>

              <div className="mb-3 text-center">
                <p className="fw-bold mb-2">Scan & Pay ₹5000 via UPI</p>
                <QRCodeCanvas value={qrValue} size={200} />
                <p className="text-muted small mt-2">{upiId}</p>
              </div>

              <div className="mb-3">
                <label className="form-label">UTR Number</label>
                <input
                  type="text"
                  name="UTRNumber"
                  value={formData.UTRNumber}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Payment Screenshot</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handlePaymentFileChange}
                />
              </div>
            </div>
          </div>



          <button
            type="submit"
            className="btn btn-success w-100 mt-4 py-2 fw-semibold"
          >
            Confirm Booking & Pay ₹5000
          </button>
        </form>
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

export default BookingPage;
