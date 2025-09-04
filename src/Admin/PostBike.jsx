import React, { useState, useEffect } from "react";

function AddBikeForm() {
  const [dealers, setDealers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    dealerId: "",
    brandId: "",
    bikeNumber: "",
    bikeName: "",
    model: "",
    km: "",
    owner: "",
    price: "",
    color: "",
    imageUrl1: "",
    imageUrl2: "",
    imageUrl3: "",
    imageUrl4: "",
  });

  // Load dealers and brands
  useEffect(() => {
    fetch("http://localhost:5275/api/Bike/DealerDropdown")
      .then((res) => res.json())
      .then((data) => setDealers(data))
      .catch((err) => console.error("Error loading dealers", err));

    fetch("http://localhost:5275/api/Bike/BradnDropdown")
      .then((res) => res.json()) 
      .then((data) => setBrands(data))
      .catch((err) => console.error("Error loading brands", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5275/api/Bike", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (res.ok) {
          alert("✅ Bike added successfully!");
          setFormData({
            dealerId: "",
            brandId: "",
            bikeNumber: "",
            bikeName: "",
            model: "",
            km: "",
            owner: "",
            price: "",
            color: "",
            imageUrl1: "",
            imageUrl2: "",
            imageUrl3: "",
            imageUrl4: "",
          });
        } else {
          alert("❌ Failed to add bike.");
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add New Bike</h2>
      <form onSubmit={handleSubmit} className="row g-4">

        {/* Brand */}
        <div className="col-md-6">
          <label className="form-label">Brand</label>
          <select
            name="brandId"
            className="form-select border border-secondary"
            value={formData.brandId}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Brand --</option>
            {brands.map((b) => (
              <option key={b.brandId} value={b.brandId}>
                {b.brandName}
              </option>
            ))}
          </select>
        </div>

        {/* Bike Number */}
        <div className="col-md-6">
          <label className="form-label">Bike Number</label>
          <input
            type="text"
            name="bikeNumber"
            className="form-control text-black border border-secondary"
            value={formData.bikeNumber}
            onChange={handleChange}
            placeholder="e.g. GJ01AB1234"
            required
          />
        </div>

        {/* Bike Name */}
        <div className="col-md-6">
          <label className="form-label">Bike Name</label>
          <input
            type="text"
            name="bikeName"
            placeholder="e.g. TVS Jupiter ZX"
            className="form-control text-black border border-secondary"
            value={formData.bikeName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Model Year */}
        <div className="col-md-4">
          <label className="form-label">Model Year</label>
          <input
            type="number"
            name="model"
            placeholder="e.g. 2023"
            className="form-control text-black border border-secondary"
            value={formData.model}
            onChange={handleChange}
            required
          />
        </div>

        {/* KM Driven */}
        <div className="col-md-4">
          <label className="form-label">Kilometers Driven</label>
          <input
            type="number"
            name="km"
            placeholder="e.g. 12000"
            className="form-control text-black border border-secondary"
            value={formData.km}
            onChange={handleChange}
            required
          />
        </div>

        {/* Owner */}
        <div className="col-md-4">
          <label className="form-label">Owner</label>
          <input
            type="text"
            name="owner"
            placeholder="e.g. First Owner"
            className="form-control text-black border border-secondary"
            value={formData.owner}
            onChange={handleChange}
            required
          />
        </div>

        {/* Price */}
        <div className="col-md-6">
          <label className="form-label">Price (₹)</label>
          <input
            type="number"
            name="price"
            placeholder="e.g. 78000"
            className="form-control text-black border border-secondary"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        {/* Color */}
        <div className="col-md-6">
          <label className="form-label">Color</label>
          <input
            type="text"
            name="color"
            placeholder="e.g. Red"
            className="form-control text-black border border-secondary"
            value={formData.color}
            onChange={handleChange}
            required
          />
        </div>

        {/* Image URLs */}
        {[1, 2, 3, 4].map((n) => (
          <div className="col-md-6" key={n}>
            <label className="form-label">{`Image URL ${n}`}</label>
            <input
              type="text"
              name={`imageUrl${n}`}
              placeholder={`Enter image URL ${n}`}
              className="form-control text-black border border-secondary"
              value={formData[`imageUrl${n}`]}
              onChange={handleChange}
            />
          </div>
        ))}

        {/* Submit Button */}
        <div className="col-12 mt-4">
          <button type="submit" className="btn btn-success w-100 mb-5">
            🚀 Submit Bike Details
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddBikeForm;