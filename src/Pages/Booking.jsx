import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function BookingPage() {
  const location = useLocation();
  const { bikeId } = location.state || {};

  const [formData, setFormData] = useState({
  UserId: "",
  BikeId: bikeId || "",
  AadharNumber: "",
  BookingDate: new Date().toISOString().slice(0, 10),
});
const [bikeName, setBikeName] = useState(""); // separate state


  const [AadharCard, setAadharCard] = useState(null);


  // Load user info
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

  // Fetch bike name from API
  useEffect(() => {
    if (bikeId) {
      fetch(`http://localhost:5275/api/Bike/${bikeId}`)
        .then((res) => res.json())
        .then((data) => {
          setBikeName(data.name); // adjust 'name' based on your API response
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

const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData();
  data.append("UserId", formData.UserId);
  data.append("BikeId", formData.BikeId);
  data.append("BikeName", bikeName); // ✅ include bikeName here
  data.append("AadharNumber", formData.AadharNumber);
  data.append("BookingDate", formData.BookingDate);
  if (AadharCard) data.append("AadharCard", AadharCard);

  try {
    const res = await fetch("http://localhost:5275/api/Booking/Image", {
      method: "POST",
      body: data,
    });

    if (res.ok) {
      const result = await res.json();
      alert("✅ " + result.Message);
    } else {
      const error = await res.json();
      alert("❌ " + error.Message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("⚠️ Error submitting booking");
  }
};


  return (
    <div className="container d-flex justify-content-center align-items-center bg-light mt-5">
      <div className="card shadow-lg p-4" style={{ maxWidth: "600px", width: "100%" }}>
        <h3 className="fw-bold mb-2 text-center">Complete Your Booking</h3>
        <p className="text-muted text-center mb-4">
          Fill in your details to reserve this bike
        </p>
        <p>{formData.BikeId}</p>


        {/* Display Bike Name */}
       {/* Display Bike Name */}
{bikeName && (
  <div className="mb-3">
    <label className="form-label">Bike Name</label>
    <input
      type="text"
      value={bikeName}
      readOnly
      className="form-control bg-light fw-bold"
    />
  </div>
)}

        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
          <div className="mb-3">
            <label className="form-label">User ID</label>
            <input
              type="number"
              name="UserId"
              value={formData.UserId}
              readOnly
              className="form-control bg-light"
            />
          </div>



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
              placeholder="Enter 12-digit Aadhar number"
              value={formData.AadharNumber}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Aadhar Card Upload</label>
            <div
              className="border border-2 border-secondary rounded-3 p-4 text-center bg-light"
              style={{ cursor: "pointer" }}
              onClick={() => document.getElementById("file-upload").click()}
            >
              <i className="bi bi-cloud-arrow-up fs-1 text-secondary"></i>
              <p className="mt-2 text-muted">
                <span className="text-primary fw-bold">Click to upload</span> or drag and drop
              </p>
              <p className="small text-muted">PNG, JPG up to 10MB</p>
              {AadharCard && <p className="text-success fw-bold">{AadharCard.name}</p>}
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="d-none"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-success w-100 py-2 fw-semibold">
            Confirm Booking
          </button>
        </form>
      </div>
    </div>


  );
}

export default BookingPage;
