import React, { useState } from "react";

function Insurance() {
  const [form, setForm] = useState({
    bikeNumber: "",
    phoneNumber: "",
    type: "Comprehensive",
    vehicleType: "Bike",
    engineCapacity: "150cc"
  });

  const [activeTab, setActiveTab] = useState("quote");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const calculatePrice = () => {
    switch (form.engineCapacity) {
      case "150cc": return 843;
      case "1000cc": return form.vehicleType === "CNG" ? 2600 : 2500;
      case "1500cc": return 4031;
      default: return 0;
    }
  };

  const insurancePlans = [
    { 
      id: 1, 
      type: "Basic", 
      price: 850,
      features: ["Third-party liability", "Personal accident cover", "Legal compliance"],
      recommended: false
    },
    { 
      id: 2, 
      type: "Comprehensive", 
      price: 1200,
      features: ["Own damage + third-party", "Cashless repairs", "Theft protection", "24/7 roadside assistance"],
      recommended: true
    },
    { 
      id: 3, 
      type: "Zero Depreciation", 
      price: 1500,
      features: ["No depreciation deduction", "New parts coverage", "Enhanced protection", "Zero claim bonus protection"],
      recommended: false
    },
  ];

  const pricingData = [
    { vehicleType: "Bike", engineCapacity: "Up to 150cc", price: "₹843" },
    { vehicleType: "Car", engineCapacity: "1000cc", price: "₹2500" },
    { vehicleType: "CNG", engineCapacity: "1000cc", price: "₹2600" },
    { vehicleType: "Car", engineCapacity: "1500cc", price: "₹4031" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const price = calculatePrice();

    const data = {
      vehicleType: form.vehicleType,
      engineCapacity: form.engineCapacity,
      bikeNumber: form.bikeNumber,
      phoneNumber: form.phoneNumber,
      type: form.type,
      estimatedPrice: price,
      timestamp: new Date().toLocaleString(),
    };

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbzrN-mPW2qnmvjYxvtvLIU_Wunmg0XEynulKK8od0y19he_Wi-1x3FUzPHfaLmx4iYw/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const adminNumber = "918780777688";
      const message = `🚘 *New Insurance Inquiry*\n\n🛞 Vehicle Type: ${form.vehicleType}\n⚙️ Engine Capacity: ${form.engineCapacity}\n🔢 Vehicle Number: ${form.bikeNumber}\n📞 Phone: ${form.phoneNumber}\n🛡️ Insurance Type: ${form.type}\n💰 Estimated Price: ₹${price}`;
      const whatsappUrl = `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");

      setForm({
        bikeNumber: "",
        phoneNumber: "",
        type: "Comprehensive",
        vehicleType: "Bike",
        engineCapacity: "150cc",
      });

      alert("✅ Insurance inquiry sent successfully!");
    } catch (error) {
      console.error("❌ Error sending data:", error);
      alert("❌ Failed to send data. Try again later!");
    }
  };

  return (
    <div className="container my-5 mt-5">
      {/* Modern Header */}
      <div className="text-center mb-5">
        <div className="bg-primary bg-opacity-10 rounded-3 mt-5 p-3 d-inline-block mb-3">
          <span className="text-primary display-4 mt-5">🛡️</span>
        </div>
        <h1 className="fw-bold text-gradient">Vehicle Insurance</h1>
        <p className="text-muted fs-5">Get comprehensive protection for your vehicle with our affordable plans</p>
      </div>

      {/* Navigation Tabs */}
      <div className="card border-0 rounded-4 shadow-sm mb-4">
        <div className="card-body p-2">
          <div className="row g-0 text-center">
            <div className="col">
              <button
                className={`btn w-100 py-3 rounded-3 ${activeTab === "quote" ? "btn-primary" : "btn-light"}`}
                onClick={() => setActiveTab("quote")}
              >
                <i className="bi bi-calculator me-2"></i>
                Get Quote
              </button>
            </div>
            <div className="col">
              <button
                className={`btn w-100 py-3 rounded-3 ${activeTab === "plans" ? "btn-primary" : "btn-light"}`}
                onClick={() => setActiveTab("plans")}
              >
                <i className="bi bi-wallet2 me-2"></i>
                Insurance Plans
              </button>
            </div>
            <div className="col">
              <button
                className={`btn w-100 py-3 rounded-3 ${activeTab === "pricing" ? "btn-primary" : "btn-light"}`}
                onClick={() => setActiveTab("pricing")}
              >
                <i className="bi bi-table me-2"></i>
                Pricing Table
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Form Section */}
      {activeTab === "quote" && (
        <div className="card border-0 rounded-4 shadow-lg mb-4">
          <div className="card-header bg-transparent border-0 py-4">
            <h4 className="mb-0 fw-bold text-dark">
              <i className="bi bi-lightning-charge text-primary me-2"></i>
              Instant Insurance Quote
            </h4>
            <p className="text-muted mb-0">Fill in your details to get an instant price estimate</p>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                {/* Vehicle Details */}
                <div className="col-md-6">
                  <div className="mb-4">
                    <h6 className="fw-semibold text-muted mb-3">
                      <i className="bi bi-car-front text-primary me-2"></i>
                      Vehicle Details
                    </h6>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label fw-semibold">Vehicle Type</label>
                        <select
                          name="vehicleType"
                          value={form.vehicleType}
                          onChange={handleChange}
                          className="form-select form-select-lg border-2"
                        >
                          <option value="Bike">🏍️ Bike</option>
                          <option value="Car">🚗 Car</option>
                          <option value="CNG">⛽ CNG Vehicle</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">Engine Capacity</label>
                        <select
                          name="engineCapacity"
                          value={form.engineCapacity}
                          onChange={handleChange}
                          className="form-select form-select-lg border-2"
                        >
                          <option value="150cc">150cc or less</option>
                          <option value="1000cc">1000cc</option>
                          <option value="1500cc">1500cc or more</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Details */}
                <div className="col-md-6">
                  <div className="mb-4">
                    <h6 className="fw-semibold text-muted mb-3">
                      <i className="bi bi-person text-primary me-2"></i>
                      Your Details
                    </h6>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label fw-semibold">Vehicle Number</label>
                        <input
                          type="text"
                          name="bikeNumber"
                          value={form.bikeNumber}
                          onChange={handleChange}
                          className="form-control form-control-lg border-2"
                          placeholder="e.g. MH01AB1234"
                          required
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">Phone Number</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={form.phoneNumber}
                          onChange={handleChange}
                          className="form-control form-control-lg border-2"
                          placeholder="10-digit mobile number"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Insurance Type & Price */}
                <div className="col-12">
                  <div className="row g-4 align-items-end">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Insurance Type</label>
                      <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="form-select form-select-lg border-2"
                      >
                        <option value="Comprehensive">Comprehensive</option>
                        <option value="Third-Party">Third-Party</option>
                        <option value="Zero Depreciation">Zero Depreciation</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <div className="bg-light rounded-3 p-3 text-center">
                        <div className="text-muted small">Estimated Price</div>
                        <div className="h3 fw-bold text-primary mb-0">₹{calculatePrice()}</div>
                        <div className="text-muted small">per year</div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold py-3">
                        <i className="bi bi-whatsapp me-2"></i>
                        Get Quote on WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Insurance Plans Section */}
      {activeTab === "plans" && (
        <div className="row g-4">
          {insurancePlans.map((plan) => (
            <div key={plan.id} className="col-lg-4 col-md-6">
              <div className={`card h-100 border-0 rounded-4 shadow-sm transition-all ${plan.recommended ? 'border-primary border-2' : ''}`}>
                {plan.recommended && (
                  <div className="position-absolute top-0 start-50 translate-middle">
                    <span className="badge bg-primary px-3 py-2 rounded-3 fw-normal">
                      ⭐ Most Popular
                    </span>
                  </div>
                )}
                <div className="card-body p-4 text-center">
                  <div className={`rounded-3 p-3 mb-4 ${plan.recommended ? 'bg-primary bg-opacity-10' : 'bg-light'}`}>
                    <span className={`display-6 ${plan.recommended ? 'text-primary' : 'text-muted'}`}>
                      {plan.type === "Basic" && "🛡️"}
                      {plan.type === "Comprehensive" && "🚀"}
                      {plan.type === "Zero Depreciation" && "✨"}
                    </span>
                  </div>
                  <h5 className="card-title fw-bold mb-2">{plan.type}</h5>
                  <div className="mb-4">
                    <span className="h2 fw-bold text-dark">₹{plan.price}</span>
                    <span className="text-muted">/year</span>
                  </div>
                  <ul className="list-unstyled mb-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button 
                    className={`btn w-100 py-2 fw-semibold ${plan.recommended ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab("quote")}
                  >
                    Select Plan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pricing Table Section */}
      {activeTab === "pricing" && (
        <div className="card border-0 rounded-4 shadow-sm">
          <div className="card-header bg-transparent border-0 py-4">
            <h4 className="mb-0 fw-bold text-dark">
              <i className="bi bi-currency-dollar text-primary me-2"></i>
              Standard Insurance Pricing
            </h4>
            <p className="text-muted mb-0">Third-party insurance rates as per IRDAI guidelines</p>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="ps-4 py-3 fw-semibold text-muted">Vehicle Type</th>
                    <th scope="col" className="py-3 fw-semibold text-muted">Engine Capacity</th>
                    <th scope="col" className="pe-4 py-3 fw-semibold text-muted text-end">Annual Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingData.map((item, index) => (
                    <tr key={index} className="border-top">
                      <td className="ps-4 py-3">
                        <div className="d-flex align-items-center">
                          <span className="me-3">
                            {item.vehicleType === "Bike" && "🏍️"}
                            {item.vehicleType === "Car" && "🚗"}
                            {item.vehicleType === "CNG" && "⛽"}
                          </span>
                          {item.vehicleType}
                        </div>
                      </td>
                      <td className="py-3 text-muted">{item.engineCapacity}</td>
                      <td className="pe-4 py-3 fw-bold text-success text-end">{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-light rounded-bottom-4">
              <div className="alert alert-info border-0 mb-0">
                <i className="bi bi-info-circle me-2"></i>
                <strong>Note:</strong> Comprehensive insurance prices may vary based on vehicle age, IDV, and additional coverage options.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="row g-4 mt-2">
        <div className="col-md-4">
          <div className="card border-0 rounded-4 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="bg-success bg-opacity-10 rounded-3 p-3 d-inline-block mb-3">
                <span className="text-success display-6">⚡</span>
              </div>
              <h6 className="fw-bold">Instant Policy</h6>
              <p className="text-muted mb-0">Get your insurance policy instantly with digital processing</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 rounded-4 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="bg-warning bg-opacity-10 rounded-3 p-3 d-inline-block mb-3">
                <span className="text-warning display-6">🛠️</span>
              </div>
              <h6 className="fw-bold">Cashless Repairs</h6>
              <p className="text-muted mb-0">Access 5000+ network garages for hassle-free claims</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 rounded-4 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="bg-info bg-opacity-10 rounded-3 p-3 d-inline-block mb-3">
                <span className="text-info display-6">📞</span>
              </div>
              <h6 className="fw-bold">24/7 Support</h6>
              <p className="text-muted mb-0">Round-the-clock customer support for all your queries</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .text-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .transition-all {
          transition: all 0.3s ease;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 1rem 3rem rgba(0,0,0,0.1) !important;
        }
        .border-2 {
          border-width: 2px !important;
        }
        .form-select-lg, .form-control-lg {
          padding: 0.75rem 1rem;
          font-size: 1rem;
        }
        .btn {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
}

export default Insurance;