import React, { useState } from "react";

function Insurance() {
  const [form, setForm] = useState({ bikeNumber: "", phoneNumber: "", type: "Comprehensive" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

   const insurancePlans = [
    { id: 1, type: "Bike Third Party Insurance", price: 850 },
    { id: 2, type: "Car Third Party Insurance", price: 2500 },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const adminNumber = "8780777688";
    const message = `New Insurance Inquiry\n\nBike Number: ${form.bikeNumber}\nCustomer Phone: ${form.phoneNumber}\nInsurance Type: ${form.type}`;
    const whatsappUrl = `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="container my-5 mt-5">
      {/* Hero header */}
      <div className="rounded-4 p-4 p-md-5 mb-4 shadow-sm" style={{ background: "linear-gradient(135deg,#e8f0ff,#f7fbff)" }}>
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "56px", height: "56px", background: "#e2edff" }}>
            <span style={{ fontSize: "1.6rem" }}>🛡️</span>
          </div>
          <div>
            <h2 className="fw-bold text-dark m-0">Bike Insurance</h2>
            <small className="text-muted">Protect your ride with the right plan</small>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Plans */}
        <div className="col-lg-7">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100 rounded-4">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span>🧾</span>
                    <h5 className="mb-0">Basic Plan</h5>
                    <span className="badge bg-light text-dark ms-auto">Budget</span>
                  </div>
                  <ul className="text-muted small mb-0 ps-3">
                    <li>Third-party liability</li>
                    <li>Personal accident cover</li>
                    <li>Low premium</li>
                    <li>Bike Price = 850</li>
                    <li>Car Insurance price = 2500</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100 rounded-4">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span>🚀</span>
                    <h5 className="mb-0">Comprehensive</h5>
                    <span className="badge bg-primary-subtle text-primary ms-auto">Popular</span>
                  </div>
                  <ul className="text-muted small mb-0 ps-3">
                    <li>Own damage + third-party</li>
                    <li>Cashless repairs</li>
                    <li>Roadside assistance</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100 rounded-4">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span>✨</span>
                    <h5 className="mb-0">Zero Dep</h5>
                    <span className="badge bg-warning-subtle text-warning ms-auto">Premium</span>
                  </div>
                  <ul className="text-muted small mb-0 ps-3">
                    <li>No depreciation deduction</li>
                    <li>New parts coverage</li>
                    <li>Best for new bikes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quote form */}
        <div className="col-lg-5">
          <div className="card border-0 shadow rounded-4 h-100">
            <div className="card-header bg-white border-0 rounded-top-4">
              <h5 className="mb-0">Get an Insurance Quote</h5>
            </div>
            <div className="card-body">
              <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-12">
                  <label className="form-label">Bike Number</label>
                  <div className="input-group">
                    <span className="input-group-text">🏍️</span>
                    <input
                      type="text"
                      name="bikeNumber"
                      value={form.bikeNumber}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="e.g. GJ03 AB 1234"
                      required
                    />
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label">Your Phone Number</label>
                  <div className="input-group">
                    <span className="input-group-text">📱</span>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="e.g. 9876543210"
                      required
                    />
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label">Insurance Type</label>
                  <div className="input-group">
                    <span className="input-group-text">🧩</span>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="Comprehensive">Comprehensive</option>
                      <option value="Third-Party">Third-Party</option>
                      <option value="Zero Depreciation">Zero Depreciation</option>
                    </select>
                  </div>
                </div>
                <div className="col-12 d-grid">
                  <button type="submit" className="btn btn-primary">
                    Send on WhatsApp
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

        <section className="py-5 mt-5">
      <div className="container">
        <h2 className="fw-bold mb-4 text-center">🚘 Insurance Plans</h2>

        <div className="row">
          {insurancePlans.map((plan) => (
            <div className="col-md-6 mb-4" key={plan.id}>
              <div className="card shadow-lg border-0 rounded-4 h-100">
                <div className="card-body text-center">
                  <h5 className="card-title fw-semibold mb-3">{plan.type}</h5>
                  <h4 className="text-danger mb-3">₹{plan.price}</h4>
                  <button className="btn btn-primary">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    </div>

    
  );
}

export default Insurance;


