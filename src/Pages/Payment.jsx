// src/pages/PaymentPage.jsx
import React, { useState } from "react";

export default function PaymentPage() {
  const [form, setForm] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Payment submitted!");
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body mt-5">
              <h3 className="card-title mb-4 text-center">Payment Details</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Cardholder Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control text-black"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    className="form-control text-black"
                    value={form.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>

                <div className="row mb-3">
                  <div className="col">
                    <label className="form-label">Expiry</label>
                    <input
                      type="text"
                      name="expiry"
                      className="form-control text-black"
                      value={form.expiry}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div className="col">
                    <label className="form-label">CVV</label>
                    <input
                      type="password"
                      name="cvv"
                      className="form-control text-black"
                      value={form.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <h5>Total: ₹1,499.00</h5>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Pay Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
