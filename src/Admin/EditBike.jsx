// EditBike.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditBike() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  // Load bike data for editing
  useEffect(() => {
    fetch(`http://localhost:5275/api/Bike/${id}`)
      .then((res) => res.json())
      .then((data) => setFormData(data))
      .catch((err) => console.error("Error loading bike", err));
  }, [id]);

  // Load dealers and brands
  useEffect(() => {
    fetch("http://localhost:5275/api/Dealers")
      .then((res) => res.json())
      .then(setDealers)
      .catch((err) => console.error("Error loading dealers", err));

    fetch("http://localhost:5275/api/Brand")
      .then((res) => res.json())
      .then(setBrands)
      .catch((err) => console.error("Error loading brands", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:5275/api/Bike/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (res.ok) {
          alert("✅ Bike updated successfully!");
          navigate("/admin"); // Redirect back to admin list
        } else {
          alert("❌ Failed to update bike.");
        }
      })
      .catch((err) => console.error("Update error:", err));
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">✏️ Edit Bike</h2>
      <form onSubmit={handleSubmit} className="row g-4">
        {/* Dealer */}
        <div className="col-md-6">
          <label className="form-label">Dealer</label>
          <select
            name="dealerId"
            className="form-select"
            value={formData.dealerId}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Dealer --</option>
            {dealers.map((d) => (
              <option key={d.dealerId} value={d.dealerId}>
                {d.dealerName}
              </option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div className="col-md-6">
          <label className="form-label">Brand</label>
          <select
            name="brandId"
            className="form-select"
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

        {/* Other fields */}
        {[
          { label: "Bike Number", name: "bikeNumber", type: "text" },
          { label: "Bike Name", name: "bikeName", type: "text" },
          { label: "Model Year", name: "model", type: "number" },
          { label: "Kilometers Driven", name: "km", type: "number" },
          { label: "Owner", name: "owner", type: "text" },
          { label: "Price (₹)", name: "price", type: "number" },
          { label: "Color", name: "color", type: "text" },
        ].map((field, idx) => (
          <div className="col-md-6" key={idx}>
            <label className="form-label">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              className="form-control text-black border border-secondary"
              value={formData[field.name]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

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

        <div className="col-12 mt-4 d-flex gap-2 mb-5">
          <button type="submit" className="btn btn-warning w-100">
            ✅ Update Bike
          </button>
          <button type="button" className="btn btn-secondary w-100" onClick={() => navigate("/admin")}>
            ❌ Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditBike;
