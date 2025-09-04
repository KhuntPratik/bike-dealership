// EditBike.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function EditBike() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken, getUserInfo } = useContext(AuthContext);

  const token = getToken && getToken();
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
  const user = getUserInfo ? getUserInfo() : {};

  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
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

  // ✅ If not Admin, redirect immediately
  useEffect(() => {
    if (user.role !== "Admin") {
      alert("❌ Only Admin can access Edit Bike");
      navigate("/admin");
    }
  }, [user, navigate]);

  // Load bike data
  useEffect(() => {
    fetch(`http://localhost:5275/api/Bike/${id}`, { headers: { ...authHeaders } })
      .then((res) => res.json())
      .then((data) => setFormData(data))
      .catch((err) => console.error("Error loading bike", err));
  }, [id]);

  // Load brands
  useEffect(() => {
    fetch("http://localhost:5275/api/Brand", { headers: { ...authHeaders } })
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

    const payload = {
      ...formData,
      bikeId: id ? Number(id) : formData.bikeId,
      brandId: formData.brandId ? Number(formData.brandId) : formData.brandId,
      // keep model as string (no Number conversion ❌)
      model: formData.model ? String(formData.model) : "",
      km: formData.km ? Number(formData.km) : 0,
      price: formData.price ? Number(formData.price) : 0,
      // add required field "bike" (if backend expects object name)
      bike: formData.bike || formData.bikeName, 
    };
    

    fetch(`http://localhost:5275/api/Bike/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.ok) {
          alert("✅ Bike updated successfully!");
          navigate("/admin");
        } else {
          return res.text().then((msg) => {
            throw new Error(msg || "Failed to update bike.");
          });
        }
      })
      .catch((err) => {
        console.error("Update error:", err);
        alert(`❌ ${err.message}`);
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">✏️ Edit Bike</h2>
      <form onSubmit={handleSubmit} className="row g-4">
        {/* Brand Dropdown */}
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

        {/* Other inputs */}
        {[
          { label: "Bike Number", name: "bikeNumber", type: "text" },
          { label: "Bike Name", name: "bikeName", type: "text" },
          { label: "Model Year", name: "model", type: "number" },
          { label: "Kilometers", name: "km", type: "number" },
          { label: "Owner", name: "owner", type: "text" },
          { label: "Price (₹)", name: "price", type: "number" },
          { label: "Color", name: "color", type: "text" },
        ].map((field, i) => (
          <div key={i} className="col-md-6">
            <label className="form-label">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              className="form-control"
              value={formData[field.name] || ""}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        {/* Image fields */}
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="col-md-6">
            <label className="form-label">{`Image URL ${n}`}</label>
            <input
              type="text"
              name={`imageUrl${n}`}
              className="form-control"
              value={formData[`imageUrl${n}`] || ""}
              onChange={handleChange}
            />
          </div>
        ))}

        <div className="col-12 mt-4 d-flex gap-2 mb-5">
          <button type="submit" className="btn btn-warning w-100">
            ✅ Update Bike
          </button>
          <button
            type="button"
            className="btn btn-secondary w-100"
            onClick={() => navigate("/admin")}
          >
            ❌ Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditBike;
