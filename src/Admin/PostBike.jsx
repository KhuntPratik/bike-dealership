import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function AddBikeForm() {
  const { getToken, isAdmin, getRole, getUserInfo } = useContext(AuthContext);
  const token = getToken && getToken();
  const navigate = useNavigate();

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    brandId: "",
    bikeNumber: "",
    bike: "",
    model: "",
    km: "",
    owner: "",
    price: "",
    color: "",
    imageFile1: null,
    imageFile2: null,
    imageFile3: null,
    imageFile4: null,
  });

  const [previews, setPreviews] = useState({});

  // Load brands
  useEffect(() => {
    fetch("http://localhost:5275/api/Bike/BradnDropdown", {
      headers: { ...authHeaders },
    })
      .then((res) => {
        if (res.status === 401) throw new Error("Unauthorized: Please login again.");
        if (res.status === 403) throw new Error("Forbidden: Only Admins can access this resource.");
        return res.json();
      })
      .then((data) => setBrands(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Error loading brands", err);
        alert(err.message || "Failed to load brands");
      });
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "bike") {
      setFormData((prev) => ({ ...prev, bike: value, bikeName: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, [fieldName]: file }));
    if (file) {
      setPreviews((prev) => ({ ...prev, [fieldName]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isAdmin || !isAdmin()) {
      const role = getRole ? getRole() : "Unknown";
      alert(`Forbidden: Only Admins can post bikes. Current role: ${role || "N/A"}`);
      return;
    }

    const info = getUserInfo ? getUserInfo() : {};
    const derivedDealerId =
      info?.dealerId || info?.DealerId || info?.dealerID || info?.dealer_id || undefined;

    const form = new FormData();
    form.append("BrandId", formData.brandId);
    form.append("BikeNumber", formData.bikeNumber);
    form.append("BikeName", formData.bike || "");
    form.append("Model", formData.model);
    form.append("Km", formData.km);
    form.append("Owner", formData.owner);
    form.append("Price", formData.price);
    form.append("Color", formData.color);

    if (derivedDealerId) {
      form.append("DealerId", derivedDealerId);
    }

    [1, 2, 3, 4].forEach((n) => {
      if (formData[`imageFile${n}`]) {
        form.append(`ImageFile${n}`, formData[`imageFile${n}`]);
      }
    });

    fetch("http://localhost:5275/api/Bike", {
      method: "POST",
      headers: { ...authHeaders }, // do not set Content-Type manually
      body: form,
    })
      .then((res) => {
        if (res.status === 401) throw new Error("Unauthorized: Your session has expired.");
        if (res.status === 403) return res.text().then((t) => {
          throw new Error(t || "You do not have permission to add a bike.");
        });
        if (!res.ok) return res.text().then((t) => { throw new Error(t || "Failed to add bike."); });
        return res.json();
      })
      .then(() => {
        alert("✅ Bike added successfully!");
        setFormData({
          brandId: "",
          bikeNumber: "",
          bike: "",
          model: "",
          km: "",
          owner: "",
          price: "",
          color: "",
          imageFile1: null,
          imageFile2: null,
          imageFile3: null,
          imageFile4: null,
        });
        setPreviews({});
        navigate("/admin");
      })
      .catch((err) => {
        console.error("Error:", err);
        alert(`❌ ${err.message || "Failed to add bike."}`);
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add New Bike</h2>
      <form onSubmit={handleSubmit} className="row g-4">

        {/* Brand */}
        <div className="col-md-6">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label className="form-label mb-0">Brand</label>
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => navigate("/brand-management")}
              title="Manage Brands"
            >
              <i className="fas fa-tags me-1"></i>Manage Brands
            </button>
          </div>
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
            name="bike"
            placeholder="e.g. TVS Jupiter ZX"
            className="form-control text-black border border-secondary"
            value={formData.bike}
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

        {/* Image Uploads */}
        {[1, 2, 3, 4].map((n) => (
          <div className="col-md-6" key={n}>
            <label className="form-label">{`Image ${n}`}</label>
            <input
              type="file"
              accept="image/*"
              className="form-control border border-secondary"
              onChange={(e) => handleFileChange(e, `imageFile${n}`)}
            />
            {previews[`imageFile${n}`] && (
              <img
                src={previews[`imageFile${n}`]}
                alt={`Preview ${n}`}
                className="img-thumbnail mt-2"
                style={{ maxHeight: "150px" }}
              />
            )}
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
