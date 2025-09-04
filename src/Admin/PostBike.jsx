import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function AddBikeForm() {
  const { getToken, isAdmin, getRole, getUserInfo } = useContext(AuthContext);
  const token = getToken && getToken();
  const navigate = useNavigate();

  const authHeaders = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    brandId: "",
    bikeNumber: "",
    bike: "",      // bike display/name expected by backend
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
    fetch("http://localhost:5275/api/Bike/BradnDropdown", {
      headers: { ...authHeaders },
    })
      .then((res) => {
        if (res.status === 401) {
          throw new Error("Unauthorized: Please login again.");
        }
        if (res.status === 403) {
          throw new Error("Forbidden: Only Admins can access this resource.");
        }
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isAdmin || !isAdmin()) {
      const role = getRole ? getRole() : "Unknown";
      alert(`Forbidden: Only Admins can post bikes. Current role: ${role || "N/A"}`);
      return;
    }

    const info = getUserInfo ? getUserInfo() : {};
    const derivedDealerId = info?.dealerId || info?.DealerId || info?.dealerID || info?.dealer_id || undefined;

    const payload = {
      ...formData,
      // canonical (lowerCamel) payload
      brandId: formData.brandId ? Number(formData.brandId) : formData.brandId,
      model: formData.model !== undefined && formData.model !== null ? String(formData.model) : "",
      km: formData.km ? Number(formData.km) : 0,
      price: formData.price ? Number(formData.price) : 0,
      ...(derivedDealerId ? { dealerId: Number(derivedDealerId) } : {}),
      // add PascalCase aliases to satisfy backend validators
      BikeName: formData.bike || formData.bikeName || "",
      BrandId: formData.brandId ? Number(formData.brandId) : undefined,
      BikeNumber: formData.bikeNumber || "",
      Model: formData.model !== undefined && formData.model !== null ? String(formData.model) : "",
      Km: formData.km ? Number(formData.km) : 0,
      Price: formData.price ? Number(formData.price) : 0,
      Color: formData.color || "",
      ImageUrl1: formData.imageUrl1 || "",
      ImageUrl2: formData.imageUrl2 || "",
      ImageUrl3: formData.imageUrl3 || "",
      ImageUrl4: formData.imageUrl4 || "",
      DealerId: derivedDealerId ? Number(derivedDealerId) : undefined,
    };

    // Diagnostics
    console.log("[PostBike] role:", getRole && getRole());
    console.log("[PostBike] userInfo:", info);
    console.log("[PostBike] payload to POST /api/Bike:", payload);
    console.log("[PostBike] auth header present:", !!authHeaders.Authorization);

    fetch("http://localhost:5275/api/Bike", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", ...authHeaders },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.status === 401) {
          throw new Error("Unauthorized: Your session has expired. Please login again.");
        }
        if (res.status === 403) {
          // Try to surface backend reason
          return (res.text ? res.text() : Promise.resolve(""))
            .then((t) => {
              const reason = t && t.length < 300 ? t : "You do not have permission to add a bike.";
              throw new Error(`Forbidden: ${reason}`);
            });
        }
        if (res.ok) {
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
            imageUrl1: "",
            imageUrl2: "",
            imageUrl3: "",
            imageUrl4: "",
          });
          navigate("/admin");
        } else {
          return res.text().then((t) => {
            const msg = t || "Failed to add bike.";
            throw new Error(msg);
          });
        }
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

        {/* Bike Name (maps to backend 'bike') */}
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