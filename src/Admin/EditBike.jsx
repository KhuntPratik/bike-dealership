// EditBike.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Alert, Snackbar } from "@mui/material";

function EditBike() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken, getUserInfo } = useContext(AuthContext);

  const token = getToken && getToken();
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
  const user = getUserInfo ? getUserInfo() : {};



  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");


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
  });

  const [files, setFiles] = useState({
    imageFile1: null,
    imageFile2: null,
    imageFile3: null,
    imageFile4: null,
  });

  const [previews, setPreviews] = useState({});

  // ✅ Only Admin can access
  useEffect(() => {
    if (user.role !== "Admin") {
      alert("❌ Only Admin can access Edit Bike");
      navigate("/admin");
    }
  }, [user, navigate]);

  // Load bike data
  useEffect(() => {
    fetch(`http://localhost:5275/api/Bike/GetById/${id}`, { headers: { ...authHeaders } })
      .then((res) => res.json())
      .then((data) => {
        setFormData(data);
        // load existing images as previews
        setPreviews({
          imageFile1: data.imageUrl1 ? `http://localhost:5275/${data.imageUrl1}` : null,
          imageFile2: data.imageUrl2 ? `http://localhost:5275/${data.imageUrl2}` : null,
          imageFile3: data.imageUrl3 ? `http://localhost:5275/${data.imageUrl3}` : null,
          imageFile4: data.imageUrl4 ? `http://localhost:5275/${data.imageUrl4}` : null,
        });
      })
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

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    setFiles((prev) => ({ ...prev, [field]: file }));
    if (file) {
      setPreviews((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("BikeNumber", formData.bikeNumber);
    form.append("BrandId", formData.brandId);
    form.append("BikeName", formData.bikeName);
    form.append("Model", formData.model);
    form.append("Km", formData.km);
    form.append("Owner", formData.owner);
    form.append("Price", formData.price);
    form.append("Color", formData.color);

    if (files.imageFile1) form.append("ImageFile1", files.imageFile1);
    if (files.imageFile2) form.append("ImageFile2", files.imageFile2);
    if (files.imageFile3) form.append("ImageFile3", files.imageFile3);
    if (files.imageFile4) form.append("ImageFile4", files.imageFile4);

    fetch(`http://localhost:5275/api/Bike/BikeEdit/${id}`, {
      method: "PUT",
      headers: { ...authHeaders }, // don't manually set Content-Type
      body: form,
    })
      .then((res) => {
        if (res.ok) {
          setAlertSeverity("success");
          setAlertMessage("✅ Bike updated successfully!");
          setAlertOpen(true);
          setTimeout(() => navigate("/admin"), 1500); // navigate after a short delay
        } else {
          return res.text().then((msg) => {
            throw new Error(msg || "Failed to update bike.");
          });
        }
      })
      .catch((err) => {
        console.error("Update error:", err);
        setAlertSeverity("error");
        setAlertMessage(`❌ ${err.message}`);
        setAlertOpen(true);
      });
  };


  return (
    <div className="container mt-5">
      <h2 className="mb-4">✏️ Edit Bike</h2>
      <form onSubmit={handleSubmit} className="row g-4">
        {/* Brand Dropdown */}
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

        {/* Image file inputs + preview */}
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="col-md-6">
            <label className="form-label">{`Image ${n}`}</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
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
      <Snackbar
        open={alertOpen}
        autoHideDuration={4000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity={alertSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>

    </div>

  );
}

export default EditBike;
