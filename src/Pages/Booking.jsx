import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function BikeBooking() {
  const location = useLocation();

  const [bikes, setBikes] = useState([]);
  const [formData, setFormData] = useState({
    bookingId: 0,
    userId: "", 
    bikeId: "",
    AadharNumber: "",
    AadharCardPhoto: "",
    modifiedAt: new Date().toISOString(),
    bookingDate: new Date().toISOString(),
  });

  // Pre-fill bikeId from BikeDetails
  useEffect(() => {
    if (location.state) {
      setFormData((prev) => ({
        ...prev,
        bikeId: location.state.bikeId || "",
      }));
    }
  }, [location]);

  // Fetch all bikes for dropdown
  useEffect(() => {
    fetch("http://localhost:5275/api/Bike")
      .then((res) => res.json())
      .then(setBikes)
      .catch((err) => console.error("Bike fetch error:", err));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle booking submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Format modifiedAt and bookingDate to ISO format
    const payload = {
      ...formData,
      bookingId: 0, // always 0 for new booking
      modifiedAt: new Date().toISOString(),
      bookingDate: new Date(formData.bookingDate).toISOString(),
    };

    fetch("http://localhost:5275/api/Booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Booking failed");
        return res.json();
      })
      .then((data) => {
        alert("Booking successful!");
        console.log("Booking Response:", data);
      })
      .catch((err) => {
        console.error("Booking Error:", err);
        alert("This bike alredy booked");
      });
  };
  return (
    <div className="container my-5">
      <div className="card shadow p-4">
        <h2 className="text-center mb-4 mt-5">Book This Bike</h2>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">

            <div className="col-md-6">
              <label className="form-label">User ID</label>
              <input
                type="number"
                className="form-control border border-black text-black"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Bike</label>
              <input
                className="form-select border border-black"
                name="bikeId"
                value={formData.bikeId}
                onChange={handleChange}
                required
              />
            </div>

             <div className="col-md-6">
              <label className="form-label">Adhar Number</label>
              <input
                type="text"
                className="form-control border border-black text-black"
                name="AadharNumber"
                value={formData.AadharNumber}
                onChange={handleChange}
              />
            </div>

             <div className="col-md-6">
              <label className="form-label">AdharCard Photo</label>
              <input
                type="text"
                className="form-control border border-black text-black"
                name="AadharNumber"
                value={formData.AadharNumber}
                onChange={handleChange}
              />
            </div>


            <div className="col-md-6">
              <label className="form-label">Booking Date</label>
              <input
                type="datetime-local"
                className="form-control border border-black text-black"
                name="bookingDate"
                value={formData.bookingDate.slice(0, 16)} // format for input
                onChange={handleChange}
              />
            </div>

            
           
            <div className="col-md-6">
              <label className="form-label">Modified At</label>
              <input
                type="datetime-local"
                className="form-control border border-black text-black"
                name="modifiedAt"
                value={formData.modifiedAt.slice(0, 16)} // format for input
                onChange={handleChange}
              />
            </div>

            <div className="col-12 text-center mt-3 p-3">
              <button
                className="btn btn-primary px-5 mr-3"
                onClick={() => window.location.href = "https://razorpay.me/@pratikhiteshbhaikhunt"}
              >
                Payment
              </button>

               <button
                className="btn btn-primary px-5 m-3">
                Add to Cart
              </button>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BikeBooking;
